/*
 * calculate-meal-timing.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Timing } from '@Types/common'
import { MealItem } from '@Types/meal'
import { determineIfItsFood, determineIfItsRecipe } from '@Utils/determine-object'


export default function calculateMealTiming(mealItems: MealItem[]): Timing {
  let timing: Timing = {
    totalTime: 0,
    prepTime: 0,
    cookTime: 0,
  }

  mealItems.map(mealItem => {
    if (mealItem.item && determineIfItsFood(mealItem.item)) {
      /**
       * We'll assume foods don't have any timing
       * */
    }
    if (mealItem.item && determineIfItsRecipe(mealItem.item)) {
      timing = {
        totalTime: (timing.totalTime || 0) + (mealItem.item.timing.totalTime || 0),
        prepTime: (timing.prepTime || 0) + (mealItem.item.timing.prepTime || 0),
        cookTime: (timing.cookTime || 0) + (mealItem.item.timing.cookTime || 0),
      }
    }
  })

  return timing
}
