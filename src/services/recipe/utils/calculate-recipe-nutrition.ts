/*
 * calculate-recipe-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food, Nutrition } from '@Types/food'
import { Ingredient } from '@Types/ingredient'
import { calculateNutrition, scaleFoodNutrition } from '@Utils/calculate-nutrition'
import { determineIfItsWeightOrObject, determineIfItsCustomUnit } from '@Utils/determine-object'


export function calculateRecipeNutrition(ingredients: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(ingredient => {
    if (!ingredient.amount || !ingredient.item) return

    let weightId
    let gramWeight

    if (ingredient.unit && determineIfItsWeightOrObject(ingredient.unit)) {
      weightId = ingredient.unit.id
    } else if (ingredient.unit && determineIfItsCustomUnit(ingredient.unit)) {
      gramWeight = ingredient.unit.gramWeight
    }

    calculateNutrition(scaleFoodNutrition(ingredient.item as Food, ingredient.amount, weightId, gramWeight), totalNutrition)
  })

  return totalNutrition
}
