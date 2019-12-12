/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import redis from '@Config/connections/redis'
import mealConfig from '@Config/meal'
import { FoodModel } from '@Models/food.model'
import { MealModel } from '@Models/meal.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import CalendarService from '@Services/calendar/calendar.service'
import DietService from '@Services/diet/diet.service'
import UserService from '@Services/user/user.service'
import { Day, DayMeal } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import { Ingredient } from '@Types/ingredient'
import { Meal, MealItem } from '@Types/meal'
import { RedisKeys } from '@Types/redis'
import { UserMeal, MealSize } from '@Types/user'
import Errors from '@Utils/errors'
import addHours from 'date-fns/addHours'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import subHours from 'date-fns/subHours'
import { Service } from 'typedi'


async function selectAlternativeMealItem(userId: string, meal: DayMeal, mealItem: MealItem): Promise<Ingredient> {
  const previousMealItemSuggestionsRedisKey = RedisKeys.previousMealItemSuggestions(userId, String(meal.id))
  const now = Date.now()
  const suggestionExpirationTime = subHours(new Date(), mealConfig.mealSuggestionCycleHours).getTime()
  const previousMealItemSuggestions: string[] = await redis.zrevrangebyscore(previousMealItemSuggestionsRedisKey, now, suggestionExpirationTime)

  if (mealItem.alternativeMealItems.length === 0) throw new Error('no alternatives')

  const selectedAlternative = mealItem.alternativeMealItems.find(alt => !previousMealItemSuggestions.find(p => p == String(alt.id)))
  if (!selectedAlternative) {
    await redis.del(previousMealItemSuggestionsRedisKey)
    return selectAlternativeMealItem(userId, meal, mealItem)
  }

  return selectedAlternative
}

@Service()
export default class SuggestionService {
  constructor(
    // service injection
    private readonly userService: UserService,
    private readonly dietService: DietService,
    private readonly calendarService: CalendarService,
  ) {
    // noop
  }

  async findBestMeal(userId: string, userMeal?: UserMeal): Promise<Meal> {
    const {
      nutritionProfile,
      meals: userMeals,
      diet,
    } = await this.userService.getUserById(userId)
    let mealSize = userMeal ? userMeal.size : MealSize.normal

    /* TODO bias conditions: user excluded foods and food classes */
    const biasConditions: any = {}

    /**
     * Apply user diet
     * */
    if (diet) {
      const includedFoodClassIdsInDiet = await this.dietService.getFoodClassIdsFromDiets([diet])

      const foodsInDiet = await FoodModel.find({ foodClass: { $in: includedFoodClassIdsInDiet } })
      const recipesInDiet = await RecipeModel.find({ 'ingredients.food.foodClass': { $not: { $elemMatch: { $nin: includedFoodClassIdsInDiet } } } })

      biasConditions['items.food'] = { $not: { $elemMatch: { $nin: foodsInDiet.map(food => food._id) } } }
      biasConditions['items.recipe'] = { $not: { $elemMatch: { $nin: recipesInDiet.map(recipe => recipe._id) } } }
    }
    let totalWeights = 0
    userMeals.map(userMeal => {
      totalWeights += parseInt(userMeal.size)
    })
    const mealWeight = parseInt(mealSize) / totalWeights

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
    const previousSuggestionsRedisKey = RedisKeys.previousMealSuggestions(userId)
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
        return this.findBestMeal(userId)
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

    const finalMeal = await MealModel.findById(meal._id)
      .populate('author')
      .populate({
        path: 'items.food',
        model: FoodModel
      })
      .populate({
        path: 'items.alternativeMealItems.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .populate({
        path: 'items.alternativeMealItems.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .exec()
    if (!finalMeal) throw new Errors.System('Something went wrong')

    return finalMeal
  }

  async suggestMealItem(mealItemId: string, userMealId: string, date: Date, userId: string) {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    const userMeal: UserMeal | undefined = user.meals.find(meal => meal.id === userMealId)
    if (!userMeal) throw new Errors.NotFound('User meal not found')

    const day = await this.calendarService.findOrCreateDayByTime(userId, date)
    const foundMeal = day.meals.find(meal => meal.userMeal ? meal.userMeal.id === userMealId : false)
    if (!foundMeal) throw new Errors.NotFound('Meal not found')

    let suggestedMealItem: MealItem | undefined

    day.meals = await Promise.all(day.meals.map(async meal => {
      if (meal.userMeal && (meal.userMeal.id === userMealId)) {
        return {
          ...meal,
          items: await Promise.all(meal.items.map(async mealItem => {
            if (String(mealItem.id) == mealItemId) {
              /**
               * If the meal item had alternative meal items
               * use an alternative meal item
               * */
              if (mealItem.alternativeMealItems.length > 0) {
                const selectedAlternative = await selectAlternativeMealItem(userId, meal, mealItem)

                suggestedMealItem = {
                  ...selectedAlternative,
                  alternativeMealItems: [
                    ...mealItem.alternativeMealItems.filter(p => String(p.id) !== String(selectedAlternative.id)),
                    mealItem
                  ]
                }

                return suggestedMealItem
              } else {
                /**
                 * If the meal item didn't have any alternatives
                 * return the same meal
                 * */
                suggestedMealItem = mealItem
                return mealItem
              }
            }

            return mealItem
          })),
        }
      }

      return meal
    }))
    await day.save()

    if (!suggestedMealItem) throw new Errors.System()
    return suggestedMealItem
  }

  async suggestMeal(userMealId: string, date: Date, userId: string): Promise<DayMeal> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    const userMeal: UserMeal | undefined = user.meals.find(meal => meal.id === userMealId)
    if (!userMeal) throw new Errors.NotFound('User meal not found')

    const day = await this.calendarService.findOrCreateDayByTime(userId, date)
    const foundMeal = day.meals.find(meal => meal.userMeal ? meal.userMeal.id === userMealId : false)

    let dayMeal: DayMeal | undefined = undefined

    /**
     * If meal exists
     * */
    if (foundMeal) {
      day.meals = await Promise.all(day.meals.map(async meal => {
        if (meal.userMeal && (meal.userMeal.id === userMealId)) {
          const bestMeal = await this.findBestMeal(userId, meal.userMeal)

          dayMeal = {
            ...meal,
            mealId: bestMeal._id,
            items: bestMeal.items,
          }
          return dayMeal
        }

        return meal
      }))
    } else {
      const bestMeal = await this.findBestMeal(userId)
      let time = day.date
      time = setHours(time, Number(userMeal.time.split(':')[0]))
      time = setMinutes(time, Number(userMeal.time.split(':')[1]))

      dayMeal = {
        id: new ObjectId(),
        userMeal,
        mealId: bestMeal._id,
        items: bestMeal.items,
        time,
      }
      day.meals.push(dayMeal)
    }

    await day.save()
    if (!dayMeal) throw new Errors.System('Something went wrong')
    return dayMeal
  }

  async suggestDay(date: Date, userId: string): Promise<Day> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    const day = await this.calendarService.findOrCreateDayByTime(userId, date)
    day.meals = await Promise.all((user.meals as UserMeal[]).map(async userMeal => {
      let time = day.date
      time = setHours(time, Number(userMeal.time.split(':')[0]))
      time = setMinutes(time, Number(userMeal.time.split(':')[1]))
      const selectedMeal = await this.findBestMeal(userId)

      return {
        id: new ObjectId(),
        userMeal,
        mealId: selectedMeal._id,
        items: selectedMeal.items,
        time,
      }
    }))

    return day.save()
  }
}
