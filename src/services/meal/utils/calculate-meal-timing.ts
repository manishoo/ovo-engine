/*
 * calculate-meal-timing.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Timing } from '@Types/common'
import { IngredientItemUnion } from '@Types/ingredient'
import { MealItem } from '@Types/meal'
import { determineIfItsFood, determineIfItsRecipe } from '@Utils/determine-object'


export default function calculateMealTiming(mealItems: MealItem[]): Timing {
  let timing: Timing = {
    totalTime: 0,
    prepTime: 0,
    cookTime: 0,
  }

  mealItems.map(mealItem => {
    const mealItemItem = mealItem.item as typeof IngredientItemUnion | undefined

    if (mealItemItem && determineIfItsFood(mealItemItem)) {
      /**
       * We'll assume foods don't have any timing
       * */
    }
    if (mealItemItem && determineIfItsRecipe(mealItemItem)) {
      timing = {
        totalTime: (timing.totalTime || 0) + (mealItemItem.timing.totalTime || 0),
        prepTime: (timing.prepTime || 0) + (mealItemItem.timing.prepTime || 0),
        cookTime: (timing.cookTime || 0) + (mealItemItem.timing.cookTime || 0),
      }
    }
  })

  return timing
}
