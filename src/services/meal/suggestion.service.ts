/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import redis from '@Config/connections/redis'
import moment from 'moment'
import { Types } from 'mongoose'
import mealConfig from '@Config/meal'
import { Service } from 'typedi'
import { Meal } from '@Types/meal'
import UserService from '@Services/user/user.service'
import { MealModel } from '@Models/meal.model'
import Errors from '@Utils/errors'

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
    } = await this.userService.getUserById(userId)
    /* TODO bias conditions: diet, exclude foods and food classes */
    const biasConditions: any = {}

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
    const previousSuggestionsRedisKey = `meal-suggestion:user-${userId}`
    const now = moment().unix()
    const suggestionExpirationTime = moment().add(-mealConfig.mealSuggestionCycleHours, 'hour').unix()
    const previousSuggestions = await redis.zrevrangebyscore(previousSuggestionsRedisKey, now, suggestionExpirationTime)

    biasConditions._id = { $nin: previousSuggestions.map((it: any) => Types.ObjectId(it)) }

    const meal = await MealModel.aggregate([
      { $match: { ...biasConditions, deleted: false } },
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
    await redis.zadd(previousSuggestionsRedisKey, String(now), meal._id)
    await redis.expireat(previousSuggestionsRedisKey, moment().add(mealConfig.mealSuggestionCycleHours, 'hour').unix())

    return meal
  }
}
