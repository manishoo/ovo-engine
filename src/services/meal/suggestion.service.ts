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
import MealService from '@Services/meal/meal.service'
import UserService from '@Services/user/user.service'
import { Day, DayInput, DayMeal } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import { Diet } from '@Types/diet'
import { Ingredient } from '@Types/ingredient'
import { Meal, MealItem } from '@Types/meal'
import { RedisKeys } from '@Types/redis'
import { getMealSizeValue, NutritionProfile, NutritionProfileInput, UserMeal, UserMealInput } from '@Types/user'
import Errors from '@Utils/errors'
import addHours from 'date-fns/addHours'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import subHours from 'date-fns/subHours'
import { ArgsType, Field } from 'type-graphql'
import { Service } from 'typedi'


@ArgsType()
export class SuggestMealInput {
  @Field()
  planId: ObjectId

  @Field()
  dayId: ObjectId

  @Field()
  dayMealId: ObjectId

  @Field({ nullable: true })
  careTaker?: ObjectId
}

@ArgsType()
export class SuggestMealItemInput extends SuggestMealInput {
  @Field()
  mealItemId: ObjectId
}

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
    private readonly mealService: MealService,
  ) {
    // noop
  }

  async findBestMeal(userMeal: UserMeal, nutritionProfile: NutritionProfile | NutritionProfileInput, userMeals: UserMeal[], diet?: Diet, userId?: string): Promise<Meal> {
    /* TODO bias conditions: user excluded foods and foo4d classes */
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

    /**
     * Calculate the meal size relative to the
     * size of other meals in the day
     * */
    let totalWeights = 0
    userMeals.map(userMeal => {
      totalWeights += getMealSizeValue(userMeal.size)
    })
    const mealWeight = getMealSizeValue(userMeal.size) / totalWeights

    const targetCalories = nutritionProfile.calories * mealWeight
    if (nutritionProfile.isStrict) {
      biasConditions.nutrition = {
        'proteins.amount': {
          $gte: nutritionProfile.protein.min * mealWeight,
          $lte: nutritionProfile.protein.max * mealWeight,
        },
        'totalCarbs.amount': {
          $gte: nutritionProfile.carbs.min * mealWeight,
          $lte: nutritionProfile.carbs.max * mealWeight,
        },
        'fats.amount': {
          $gte: nutritionProfile.fat.min * mealWeight,
          $lte: nutritionProfile.fat.max * mealWeight,
        },
      }
    }

    /**
     * Find the previous suggestions from a set which belongs to the user
     * */
    const now = Date.now()
    let previousSuggestions: string[] = []
    let previousSuggestionsRedisKey: string | null = null

    if (userId) {
      previousSuggestionsRedisKey = RedisKeys.previousMealSuggestions(userId)
      const suggestionExpirationTime = subHours(new Date(), mealConfig.mealSuggestionCycleHours).getTime()
      previousSuggestions = await redis.zrevrangebyscore(previousSuggestionsRedisKey, now, suggestionExpirationTime)
    }

    biasConditions._id = { $nin: previousSuggestions.map(it => new ObjectId(it)) }

    const meal: Meal = await MealModel.aggregate([
      { $match: { ...biasConditions, deleted: { $ne: true } } },
      /**
       * Create a field which keeps the difference of the user target calories and the food calories
       * */
      { $addFields: { caloriesDiff: { $abs: { $subtract: ['$nutrition.calories.amount', targetCalories] } } } },
      { $sort: { caloriesDiff: 1 } },
      { $limit: 1 }
    ]).then(it => it[0])

    if (!meal) {
      /**
       * If there is any exclusion, clear them and try once more
       * */
      if (previousSuggestions.length !== 0 && previousSuggestionsRedisKey) {
        await redis.del(previousSuggestionsRedisKey)
        return this.findBestMeal(userMeal, nutritionProfile, userMeals, diet, userId)
      } else {
        throw new Errors.NotFound('no meal suggestion found')
      }
    }

    /**
     * Add the meal id into an ordered set belong to the user, this list will expire after the `suggestionExpirationTime` have passed
     * */
    if (previousSuggestionsRedisKey) {
      await redis.zadd(previousSuggestionsRedisKey, String(now), String(meal._id))
      await redis.expireat(previousSuggestionsRedisKey, addHours(new Date(), mealConfig.mealSuggestionCycleHours).getTime())
    }

    const finalMeal = await this.mealService.get(meal._id)
    if (!finalMeal) throw new Errors.System('Something went wrong')

    return finalMeal
  }

  async suggestMealItem({ planId, dayId, dayMealId, careTaker, mealItemId }: SuggestMealItemInput, userId: string) {
    // const user = await this.userService.getUserById(careTaker || userId, careTaker ? userId : undefined)
    const day = await this.calendarService.get(dayId, planId, userId)

    const foundMeal = day.meals.find(meal => String(meal.id) === String(dayMealId))
    if (!foundMeal) throw new Errors.NotFound('Meal not found')

    let suggestedMealItem: MealItem | undefined = undefined

    day.meals = await Promise.all(day.meals.map(async meal => {
      if (String(meal.id) === String(dayMealId)) {
        return {
          ...meal,
          items: await Promise.all(meal.items.map(async mealItem => {
            if (String(mealItem.id) === String(mealItemId)) {
              /**
               * If the meal item had alternative meal items
               * use an alternative meal item
               * */
              if (mealItem.alternativeMealItems.length > 0) {
                const selectedAlternative = await selectAlternativeMealItem(userId, meal, mealItem)

                suggestedMealItem = {
                  ...selectedAlternative,
                  /**
                   * Keep the id
                   * */
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

  async suggestMeal({ planId, dayId, dayMealId, careTaker }: SuggestMealInput, userId: string): Promise<DayMeal> {
    const day = await this.calendarService.get(dayId, planId, userId)
    const foundMeal = day.meals.find(meal => String(meal.id) === String(dayMealId))
    if (!foundMeal) throw new Errors.NotFound('Day meal not found')

    const user = await this.userService.getUserById(careTaker || userId, careTaker ? userId : undefined)

    let dayMeal: DayMeal | undefined = undefined

    /**
     * If meal exists
     * */
    // if (foundMeal) {
    day.meals = await Promise.all(day.meals.map(async meal => {
      if (String(meal.id) === String(dayMealId)) {
        const bestMeal = await this.findBestMeal(meal.userMeal, user.nutritionProfile, day.meals.map(m => m.userMeal), user.diet, userId)

        dayMeal = {
          ...meal,
          mealId: bestMeal._id,
          items: bestMeal.items,
        }
        return dayMeal
      }

      return meal
    }))
    // } else {
    /*const bestMeal = await this.findBestMeal(userMeal, user.nutritionProfile, user.meals, user.diet, userId)
    let time = day.date || new Date()
    time = setHours(time, Number(userMeal.time.split(':')[0]))
    time = setMinutes(time, Number(userMeal.time.split(':')[1]))

    dayMeal = {
      id: new ObjectId(),
      userMeal,
      mealId: bestMeal._id,
      items: bestMeal.items,
      time,
    }
    day.meals.push(dayMeal)*/
    // }

    await day.save()
    if (!dayMeal) throw new Errors.System('Something went wrong')
    return dayMeal
  }

  async suggestDay(dayInput: DayInput, userId: string): Promise<Day> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    let day
    if (dayInput.date) {
      day = await this.calendarService.findOrCreateDayByTime(dayInput.planId, userId, dayInput.date)
    } else {
      day = await this.calendarService.createDay(dayInput, userId)
    }
    let dayMeals: DayMeal[] = []

    for (let dayMeal of dayInput.meals) {
      const selectedMeal = await this.findBestMeal(dayMeal.userMeal, user.nutritionProfile, dayInput.meals.map(dayMeal => dayMeal.userMeal), user.diet, userId)

      dayMeals.push({
        id: new ObjectId(),
        userMeal: dayMeal.userMeal,
        mealId: selectedMeal._id,
        items: selectedMeal.items,
        time: dayMeal.time,
        ate: dayMeal.ate,
      })
    }

    day.meals = dayMeals

    return day.save()
  }

  async generateDays(dates: Date[], userId: string): Promise<Day[]> {
    const user = await this.userService.getUserById(userId)

    // FIXME performance while doing promise all?
    return Promise.all(dates.map(date => this.suggestDay({
      meals: user.meals.map(userMeal => {
        let time = date
        time = setHours(time, Number(userMeal.time.split(':')[0]))
        time = setMinutes(time, Number(userMeal.time.split(':')[1]))

        return {
          userMeal,
          ate: false,
          time,
          items: [],
        }
      }),
      date,
      id: new ObjectId(),
      planId: user.plan as ObjectId,
    }, userId)))
  }

  async suggestDayMeals(userMeals: UserMealInput[], nutritionProfile: NutritionProfileInput, dietId?: ObjectId): Promise<DayMeal[]> {
    let dayMeals: DayMeal[] = []

    let diet: Diet | undefined = undefined
    if (dietId) {
      diet = await this.dietService.get(dietId)
    }

    for (let userMeal of userMeals) {
      let time = new Date()
      time = setHours(time, Number(userMeal.time.split(':')[0]))
      time = setMinutes(time, Number(userMeal.time.split(':')[1]))
      const selectedMeal = await this.findBestMeal(userMeal, nutritionProfile, userMeals, diet)

      dayMeals.push({
        id: new ObjectId(),
        userMeal,
        mealId: selectedMeal._id,
        items: selectedMeal.items,
        time,
      })
    }

    return dayMeals
  }
}
