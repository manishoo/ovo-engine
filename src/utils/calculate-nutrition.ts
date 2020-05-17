/*
 * calculate-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { IngredientFood, NutrientUnit, Nutrition } from '@Types/food'
import { Recipe } from '@Types/recipe'
import Errors from '@Utils/errors'


export function calculateNutrition(nutrition: Nutrition, totalNutrition: Nutrition) {
  /**
   * Iterate nutrition fields
   * */
  Object.keys(nutrition).map(fieldName => {
    const nutrient = nutrition[fieldName]!

    totalNutrition[fieldName] = {
      amount: Number((nutrient.amount + (totalNutrition[fieldName] ? totalNutrition[fieldName]!.amount : 0)).toFixed(2)),
      unit: nutrient.unit,
    }
  })
}

export function scaleFoodNutrition(food: IngredientFood, foodAmount: number, weightId?: ObjectId, customGramWeight?: number): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  if (!food.nutrition) return totalNutrition

  /**
   * Iterate nutrition fields
   * */
  Object.keys(food.nutrition).map(fieldName => {
    const nutrient = food.nutrition![fieldName]!

    totalNutrition[fieldName] = {
      amount: getFoodNutrientAmount(food, foodAmount, nutrient, totalNutrition[fieldName] ? totalNutrition[fieldName]!.amount : 0, weightId, customGramWeight),
      unit: nutrient.unit,
    }
  })

  return totalNutrition
}

function getFoodNutrientAmount(food: IngredientFood, amount: number, nutrient: NutrientUnit, existingNutrientAmount: number, weightId?: ObjectId, customGramWeight?: number) {
  let totalGrams = 0

  /**
   * If the food had a weight,
   * use the weight's {gramWeight}
   * */
  if (weightId) {
    const foundWeight = food.weights.find(w => w.id.toString() == weightId.toString())
    if (!foundWeight) throw new Errors.Validation('Weight id not valid')
    if (!foundWeight.gramWeight) throw new Errors.Validation('Found weight doesnt have gramWeight')

    totalGrams = foundWeight.gramWeight * amount
  } else if (customGramWeight) {
    totalGrams = customGramWeight * amount
  } else {
    totalGrams = amount
  }

  // 60g of protein
  const totalNutrientAmount =
    // 60g of sugar
    totalGrams *
    // 1g of protein in 100g
    (nutrient.amount / 100)

  return Number((totalNutrientAmount + existingNutrientAmount).toFixed(2))
}

export function scaleRecipeNutrition(recipe: Recipe, serving: number): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate nutrition fields
   * */
  if (recipe.nutrition) {
    Object.keys(recipe.nutrition).map(fieldName => {
      const nutrient = recipe.nutrition![fieldName]!

      totalNutrition[fieldName] = {
        amount: getRecipeNutrientAmount(nutrient, totalNutrition[fieldName] ? totalNutrition[fieldName]!.amount : 0, serving),
        unit: nutrient.unit,
      }
    })
  }

  return totalNutrition
}

function getRecipeNutrientAmount(nutrient: NutrientUnit, baseAmount: number, serving: number) {
  let totalAmount = baseAmount

  totalAmount += (nutrient.amount * serving)

  return totalAmount
}
