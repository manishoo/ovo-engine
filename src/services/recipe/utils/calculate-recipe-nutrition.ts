/*
 * calculate-recipe-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Nutrition } from '@Types/food'
import { Ingredient } from '@Types/recipe'
import { Weight } from '@Types/weight'
import { calculateNutrition, scaleFoodNutrition } from '@Utils/calculate-nutrition'


export function calculateRecipeNutrition(ingredients: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(ingredient => {
    if (!ingredient.amount || !ingredient.food) return

    let weightId
    if (ingredient.weight) {
      if (ingredient.weight.hasOwnProperty('id')) {
        const weight = ingredient.weight as Weight
        weightId = weight.id!.toString()
      } else {
        weightId = ingredient.weight.toString()
      }
    }
    calculateNutrition(scaleFoodNutrition(ingredient.food, ingredient.amount, weightId, ingredient.gramWeight), totalNutrition)
  })

  return totalNutrition
}
