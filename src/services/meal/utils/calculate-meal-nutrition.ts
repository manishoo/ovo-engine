/*
 * calculate-meal-nutrition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food, Nutrition } from '@Types/food'
import { MealItemBase } from '@Types/meal'
import { Recipe } from '@Types/recipe'
import { calculateNutrition, scaleFoodNutrition, scaleRecipeNutrition } from '@Utils/calculate-nutrition'
import { ObjectId } from '@Types/common'
import determineWeightIsObject from '@Utils/determine-weight-is-object'


export function calculateMealNutrition(items: MealItemBase[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate meal items and calculate their nutrition
   * and add to {totalNutrition}
   * */
  items.map(mealItem => {
    if (mealItem.recipe) {
      const recipe = mealItem.recipe as Recipe
      if (recipe.nutrition) {
        calculateNutrition(scaleRecipeNutrition(recipe, mealItem.amount), totalNutrition)
      }
    } else if (mealItem.food) {
      const food = mealItem.food as Food
      if (food.nutrition) {
        let weightId: ObjectId = new ObjectId()
        if (mealItem.weight) {
          if (determineWeightIsObject(mealItem.weight)) {
            weightId = mealItem.weight.id!
          } else {
            weightId = mealItem.weight
          }
        }

        calculateNutrition(scaleFoodNutrition(food, mealItem.amount, weightId), totalNutrition)
      }
    }
  })

  return totalNutrition
}




