/*
 * utils.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { Food } from '@Types/food'
import { Ingredient } from '@Types/ingredient'
import { Recipe } from '@Types/recipe'
import { determineIfItsFood } from '@Utils/determine-object'


export function createDefaultMealItem(foodOrRecipe: Food | Recipe): Ingredient {
  let unit
  let amount = 1

  if (determineIfItsFood(foodOrRecipe)) {
    if (foodOrRecipe.weights.length > 0) {
      unit = foodOrRecipe.weights[0]
    } else {
      amount = 100
    }
  } else {
  }

  return {
    isOptional: false,
    description: [],
    id: new ObjectId(),
    amount,
    unit,
    customUnit: undefined,
    name: [],
    item: foodOrRecipe,
  }
}
