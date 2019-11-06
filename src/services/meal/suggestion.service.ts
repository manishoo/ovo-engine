/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { Meal } from '@Types/meal'
import UserService from '@Services/user/user.service'
import { MealModel } from '@Models/meal.model'
import Errors from '@Utils/errors'

const math = require('mathjs')

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
    // TODO get user diet
    // TODO get user excluded foods and food classes
    const biasConditions: any = {}

    const mealsCount = userMeals.length || 4

    const mealWeight = 1 / mealsCount
    if (nutritionProfile.isStrict) {
      biasConditions.nutrition = {
        'proteins.amount': {
          $gte: nutritionProfile.protein.min * mealWeight,
          $lte: nutritionProfile.protein.max * mealWeight
        },
        'totalCarbs.amount': {
          $gte: nutritionProfile.carb.min * mealWeight,
          $lte: nutritionProfile.carb.max * mealWeight
        },
        'fats.amount': {
          $gte: nutritionProfile.fat.min * mealWeight,
          $lte: nutritionProfile.fat.max * mealWeight
        },
      }
    }

    const meals = await MealModel.find(biasConditions, null, { plain: true })

    if (meals.length === 0) {
      throw new Errors.NotFound('no meal suggestion found')
    }

    // this weights indicate the importance of each parameter of our input features
    const weights = [
      1, // bias
      1, // calories
      1, // carb
      1, // protein
      1, // fat
    ]
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

      const inputs = [1, nutDiff.calories, nutDiff.carb, nutDiff.protein, nutDiff.fat]

      const rank = (math.multiply(inputs, weights) as number[])[0]
      return { id, rank }
    }))

    rankedMeals.sort((a, b) => a.rank - b.rank) // sort descending

    return (await MealModel.findById(rankedMeals[0].id))!!
  }
}
