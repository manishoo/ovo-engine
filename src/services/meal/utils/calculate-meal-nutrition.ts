/*
 * calculate-meal-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Nutrition } from '@Types/food'
import { Ingredient, IngredientItemUnion } from '@Types/ingredient'
import { calculateNutrition, scaleFoodNutrition, scaleRecipeNutrition } from '@Utils/calculate-nutrition'
import {
  determineIfItsCustomUnit,
  determineIfItsFood,
  determineIfItsRecipe,
  determineIfItsWeightOrObject
} from '@Utils/determine-object'


export function calculateMealNutrition(items: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate meal items and calculate their nutrition
   * and add to {totalNutrition}
   * */
  items.map(mealItem => {
    const mealItemItem = mealItem.item as typeof IngredientItemUnion | undefined

    if (mealItemItem && determineIfItsRecipe(mealItemItem)) {
      if (mealItemItem.nutrition && mealItem.amount) {
        calculateNutrition(scaleRecipeNutrition(mealItemItem, mealItem.amount), totalNutrition)
      }
    } else if (mealItemItem && determineIfItsFood(mealItemItem)) {
      if (mealItemItem.nutrition && mealItem.amount) {
        if (!mealItem.amount || !mealItemItem) return

        let weightId
        let gramWeight

        if (mealItem.unit && determineIfItsWeightOrObject(mealItem.unit)) {
          weightId = mealItem.unit.id!
        } else if (mealItem.unit && determineIfItsCustomUnit(mealItemItem)) {
          gramWeight = mealItem.unit.gramWeight
        }

        calculateNutrition(scaleFoodNutrition(mealItemItem, mealItem.amount, weightId, gramWeight), totalNutrition)
      }
    }
  })

  return totalNutrition
}
