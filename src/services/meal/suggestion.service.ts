/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import redis from '@Config/connections/redis'
import mealConfig from '@Config/meal'
import { FoodModel } from '@Models/food.model'
import { MealModel } from '@Models/meal.model'
import { RecipeModel } from '@Models/recipe.model'
import getIncludedFoodClassIdsInDiets from '@Services/diet/utils/get-food-class-ids-from-diets'
import UserService from '@Services/user/user.service'
import { ObjectId } from '@Types/common'
import { Meal } from '@Types/meal'
import { RedisKeys } from '@Types/redis'
import Errors from '@Utils/errors'
import addHours from 'date-fns/addHours'
import subHours from 'date-fns/subHours'
import { Service } from 'typedi'


@Service()
export default class SuggestionService {
  constructor(
    // service injection
    private readonly userService: UserService,
  ) {
    // noop
  }

  async suggestMeal(userId: string): Promise<Meal> {
    const {
      nutritionProfile,
      meals: userMeals,
      diet,
    } = await this.userService.getUserById(userId)

    /* TODO bias conditions: user excluded foods and food classes */
    const biasConditions: any = {}

    /**
     * Apply user diet
     * */
    if (diet) {
      const includedFoodClassIdsInDiet = await getIncludedFoodClassIdsInDiets([diet])

      const foodsInDiet = await FoodModel.find({ foodClass: { $in: includedFoodClassIdsInDiet } })
      const recipesInDiet = await RecipeModel.find({ 'ingredients.food.foodClass': { $in: includedFoodClassIdsInDiet } })

      biasConditions['items.food'] = { $not: { $elemMatch: { $not: { $in: foodsInDiet.map(food => food._id) } } } }
      biasConditions['items.recipe'] = { $not: { $elemMatch: { $not: { $in: recipesInDiet.map(recipe => recipe._id) } } } }
    }

    const mealsCount = userMeals.length || 4
    const mealWeight = 1 / mealsCount

    const targetCalories = nutritionProfile.calories * mealWeight
    if (nutritionProfile.isStrict) {
      biasConditions.nutrition = {
        'proteins.amount': {
          $gte: nutritionProfile.protein.min * mealWeight,
          $lte: nutritionProfile.protein.max * mealWeight,
        },
        'totalCarbs.amount': {
          $gte: nutritionProfile.carb.min * mealWeight,
          $lte: nutritionProfile.carb.max * mealWeight,
        },
        'fats.amount': {
          $gte: nutritionProfile.fat.min * mealWeight,
          $lte: nutritionProfile.fat.max * mealWeight,
        },
      }
    }

    // find the previous suggestions from a set which belongs to the user
    const previousSuggestionsRedisKey = RedisKeys.previousSuggestions(userId)
    const now = Date.now()
    const suggestionExpirationTime = subHours(new Date(), mealConfig.mealSuggestionCycleHours).getTime()
    const previousSuggestions: string[] = await redis.zrevrangebyscore(previousSuggestionsRedisKey, now, suggestionExpirationTime)

    biasConditions._id = { $nin: previousSuggestions.map(it => new ObjectId(it)) }

    const meal: Meal = await MealModel.aggregate([
      { $match: { ...biasConditions, deleted: { $ne: true } } },
      // create a field which keeps the difference of the user target calories and the food calories
      { $addFields: { caloriesDiff: { $abs: { $subtract: ['$nutrition.calories.amount', targetCalories] } } } },
      { $sort: { caloriesDiff: 1 } },
      { $limit: 1 }
    ]).then(it => it[0])

    if (!meal) {
      // if there is any exclusion, clear them and try once more
      if (previousSuggestions.length !== 0) {
        await redis.del(previousSuggestionsRedisKey)
        return this.suggestMeal(userId)
      } else {
        throw new Errors.NotFound('no meal suggestion found')
      }
    }

    /*
    * add the meal id into an ordered set belong to the user,
    * this list will expire after the `suggestionExpirationTime` have passed
    * */
    await redis.zadd(previousSuggestionsRedisKey, String(now), String(meal._id))
    await redis.expireat(previousSuggestionsRedisKey, addHours(new Date(), mealConfig.mealSuggestionCycleHours).getTime())

    return meal
  }
}
