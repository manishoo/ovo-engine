/*
 * calculate-recipe-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CustomUnit } from '@Types/common'
import { Food, Nutrition } from '@Types/food'
import { Ingredient } from '@Types/ingredient'
import { Weight } from '@Types/weight'
import { calculateNutrition, scaleFoodNutrition } from '@Utils/calculate-nutrition'
import { ObjectId } from '@Types/common'


export function calculateRecipeNutrition(ingredients: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(ingredient => {
    if (!ingredient.amount || !ingredient.item) return

    let weightId
    let gramWeight

    if (ingredient.unit && ingredient.unit instanceof Weight) {
      weightId = ingredient.unit.id!
    } else if (ingredient.unit instanceof CustomUnit) {
      gramWeight = ingredient.unit.gramWeight
    }

    calculateNutrition(scaleFoodNutrition(ingredient.item as Food, ingredient.amount, weightId, gramWeight), totalNutrition)
  })

  return totalNutrition
}
