/*
 * determine-object.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Weight } from "@Types/weight"
import { ObjectId, CustomUnit } from "@Types/common"
import { Food } from "@Types/food"
import { Recipe } from "@Types/recipe"


export function determineWeightIsObject(weight: Weight | ObjectId | CustomUnit): weight is Weight {
  if (weight.hasOwnProperty('amount')) return true

  return false
}

export function determineCustomUnitIsObject(unit: CustomUnit | ObjectId): unit is CustomUnit {
  if (unit.hasOwnProperty('gramWeight')) return true

  return false
}

export function determineFoodIsObject(food: Food | ObjectId | Recipe): food is Food {
  if ('weights' in food) return true

  return false
}

export function determineRecipeIsObject(recipe: Recipe | ObjectId | Food): recipe is Recipe {
  if ('serving' in recipe) return true

  return false
}
