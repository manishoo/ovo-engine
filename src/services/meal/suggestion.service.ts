/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { Meal } from '@Types/meal'
import UserSettingService from '@Services/user/user-setting.service'
import { MealModel } from '@Models/meal.model'
import math from 'mathjs'

@Service()
export default class SuggestionService {
  constructor(
    // service injection
    private readonly userSettingService: UserSettingService,
  ) {
    // noop
  }

  async suggestMeal(userId: string): Promise<Meal> {
    const nutritionProfile = await this.userSettingService.getUserNutritionProfile(userId)
    /* TODO bias conditions: diet, exclude foods and food classes */
    // TODO get user diet
    // TODO get user excluded foods and food classes
    const biasConditions: any = {}

    const mealsCount = 4 // temporary user meal count(same weight for each meal)

    if (nutritionProfile.isStrict) {
      biasConditions.nutrition = {
        'proteins.amount': {
          $gte: nutritionProfile.protein.min / mealsCount,
          $lte: nutritionProfile.protein.max / mealsCount
        },
        'totalCarbs.amount': {
          $gte: nutritionProfile.carb.min / mealsCount,
          $lte: nutritionProfile.carb.max / mealsCount
        },
        'fats.amount': {
          $gte: nutritionProfile.fat.min / mealsCount,
          $lte: nutritionProfile.fat.max / mealsCount
        },
      }
    }

    const meals = await MealModel.find(biasConditions, null, { plain: true })

    const weights = [1, 1, 1, 1, 1]
    const userTargetNuts = {
      calories: nutritionProfile.calories / mealsCount,
      protein: nutritionProfile.protein.average / mealsCount,
      carb: nutritionProfile.carb.average / mealsCount,
      fat: nutritionProfile.fat.average / mealsCount,
    }

    const rankedMeals = await Promise.all(meals.map(async (meal) => {
      const id = meal._id

      if (!meal.nutrition) return { id, rank: 0 }

      const { calories, proteins, totalCarbs, fats } = meal.nutrition

      const nutDiff = { ...userTargetNuts } // set some init values

      if (calories) {
        nutDiff.calories = Math.abs(calories.amount - userTargetNuts.calories)
      }

      if (proteins) {
        nutDiff.protein = Math.abs(proteins.amount - userTargetNuts.protein)
      }

      if (totalCarbs) {
        nutDiff.carb = Math.abs(totalCarbs.amount - userTargetNuts.carb)
      }

      if (fats) {
        nutDiff.fat = Math.abs(fats.amount - userTargetNuts.fat)
      }

      const inputs = [1, nutDiff.calories, nutDiff.carb, nutDiff.protein, nutDiff.carb]

      const rank = (math.multiply(inputs, weights) as number[])[0]
      return { id, rank }
    }))

    rankedMeals.sort((a, b) => a.rank - b.rank) // sort descending

    return (await MealModel.findById(rankedMeals[0].id))!!
  }
}
