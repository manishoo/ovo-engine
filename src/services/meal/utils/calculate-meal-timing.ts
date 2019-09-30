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
       * We'll assume foods don't have any timing
       * */
    }
    if (mealItem.recipe) {
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
