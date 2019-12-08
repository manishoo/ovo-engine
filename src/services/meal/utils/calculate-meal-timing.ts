/*
 * calculate-meal-timing.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Timing } from '@Types/common'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { MealItem } from '@Types/meal'
import { determineFoodIsObject, determineRecipeIsObject } from '@Utils/determine-object'


export default function calculateMealTiming(mealItems: MealItem[]): Timing {
  let timing: Timing = {
    totalTime: 0,
    prepTime: 0,
    cookTime: 0,
  }

  mealItems.map(mealItem => {
    if (mealItem.item && determineFoodIsObject(mealItem.item)) {
      /**
       * We'll assume foods don't have any timing
       * */
    }
    if (mealItem.item && determineRecipeIsObject(mealItem.item)) {
      timing = {
        totalTime: timing.totalTime + mealItem.item.timing.totalTime,
        prepTime: timing.prepTime! + (mealItem.item.timing.prepTime || 0),
        cookTime: timing.cookTime! + (mealItem.item.timing.cookTime || 0),
      }
    }
  })

  return timing
}
