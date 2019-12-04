/*
 * calculate-recipe-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Nutrition } from '@Types/food'
import { Ingredient } from '@Types/recipe'
import { Weight } from '@Types/weight'
import { calculateNutrition, scaleFoodNutrition } from '@Utils/calculate-nutrition'
import { ObjectId } from '@Types/common'


export function calculateRecipeNutrition(ingredients: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(ingredient => {
    if (!ingredient.amount || !ingredient.food) return

    let weightId: ObjectId = new ObjectId()
    if (ingredient.weight) {
      let weight = ingredient.weight as Weight
      if (weight.id) {
        weightId = weight.id
      } else {
        weightId = ingredient as ObjectId
      }
    }
    calculateNutrition(scaleFoodNutrition(ingredient.food, ingredient.amount, weightId, ingredient.gramWeight), totalNutrition)
  })

  return totalNutrition
}
