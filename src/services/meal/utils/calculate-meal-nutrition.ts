/*
 * calculate-meal-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CustomUnit } from '@Types/common'
import { Food, Nutrition } from '@Types/food'
import { Ingredient } from '@Types/ingredient'
import { Recipe } from '@Types/recipe'
import { Weight } from '@Types/weight'
import { calculateNutrition, scaleFoodNutrition, scaleRecipeNutrition } from '@Utils/calculate-nutrition'


export function calculateMealNutrition(items: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate meal items and calculate their nutrition
   * and add to {totalNutrition}
   * */
  items.map(mealItem => {
    if (mealItem.item instanceof Recipe) {
      if (mealItem.item.nutrition && mealItem.amount) {
        calculateNutrition(scaleRecipeNutrition(mealItem.item, mealItem.amount), totalNutrition)
      }
    } else if (mealItem.item instanceof Food) {
      if (mealItem.item.nutrition && mealItem.amount) {
        if (!mealItem.amount || !mealItem.item) return

        let weightId
        let gramWeight

        if (mealItem.unit && mealItem.unit instanceof Weight) {
          weightId = mealItem.unit.id!
        } else if (mealItem.unit instanceof CustomUnit) {
          gramWeight = mealItem.unit.gramWeight
        }

        calculateNutrition(scaleFoodNutrition(mealItem.item, mealItem.amount, weightId, gramWeight), totalNutrition)
      }
    }
  })

  return totalNutrition
}




