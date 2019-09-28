/*
 * calculate-meal-timing.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Timing } from '@Types/common'
import { MealItem } from '@Types/meal'
import { Recipe } from '@Types/recipe'


export default function calculateMealTiming(mealItems: MealItem[]): Timing {
  let timing: Timing = {
    totalTime: 0,
    prepTime: 0,
    cookTime: 0,
  }

  mealItems.map(mealItem => {
    if (mealItem.food) {
      /**
       * We'll take 1 minutes for each food
       * */
      timing.prepTime! += 1
    }
    if (mealItem.recipe) {
      if (typeof mealItem.recipe === 'string') throw new Error('recipe not populated')
      const recipe = mealItem.recipe as Recipe

      timing = {
        totalTime: timing.totalTime + recipe.timing.totalTime,
        prepTime: timing.prepTime! + (recipe.timing.prepTime || 0),
        cookTime: timing.cookTime! + (recipe.timing.cookTime || 0),
      }
    }
  })

  return timing
}
