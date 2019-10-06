/*
 * calculate-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food, NutrientUnit, Nutrition, IngredientFood } from '@Types/food'
import { Recipe } from '@Types/recipe'
import Errors from '@Utils/errors'


export function calculateNutrition(nutrition: Nutrition, totalNutrition: Nutrition) {
  /**
   * Iterate nutrition fields
   * */
  Object.keys(nutrition).map(fieldName => {
    const nutrient = nutrition[fieldName]!

    totalNutrition[fieldName] = {
      amount: nutrient.amount + (totalNutrition[fieldName] ? totalNutrition[fieldName]!.amount : 0),
      unit: nutrient.unit,
    }
  })
}

export function scaleFoodNutrition(food: IngredientFood, foodAmount: number, weightId?: string, customGramWeight?: number): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate nutrition fields
   * */
  Object.keys(food.nutrition).map(fieldName => {
    const nutrient = food.nutrition[fieldName]!

    totalNutrition[fieldName] = {
      amount: getFoodNutrientAmount(food, foodAmount, nutrient, totalNutrition[fieldName] ? totalNutrition[fieldName]!.amount : 0, weightId, customGramWeight),
      unit: nutrient.unit,
    }
  })

  return totalNutrition
}

function getFoodNutrientAmount(food: IngredientFood, foodAmount: number, nutrient: NutrientUnit, baseAmount: number, weightId?: string, customGramWeight?: number) {
  let totalAmount = baseAmount
  /**
   * If the food had a weight,
   * use the weight's {gramWeight}
   * */
  if (weightId) {
    const foundWeight = food.weights.find(w => w.id == weightId)
    if (!foundWeight) throw new Errors.Validation('Weight id not valid')
    totalAmount = foundWeight.gramWeight * foodAmount
  } else if (customGramWeight) {
    totalAmount = customGramWeight * foodAmount
  } else {
    totalAmount = foodAmount
  }

  totalAmount += (nutrient.amount / 100) * totalAmount

  return totalAmount
}

export function scaleRecipeNutrition(recipe: Recipe, serving: number): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate nutrition fields
   * */
  Object.keys(recipe.nutrition).map(fieldName => {
    const nutrient = recipe.nutrition[fieldName]!

    totalNutrition[fieldName] = {
      amount: getRecipeNutrientAmount(nutrient, totalNutrition[fieldName] ? totalNutrition[fieldName]!.amount : 0, serving),
      unit: nutrient.unit,
    }
  })

  return totalNutrition
}

function getRecipeNutrientAmount(nutrient: NutrientUnit, baseAmount: number, serving: number) {
  let totalAmount = baseAmount

  totalAmount += (nutrient.amount * serving)

  return totalAmount
}
