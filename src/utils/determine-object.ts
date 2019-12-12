/*
 * determine-object.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Weight } from "@Types/weight"
import { ObjectId, CustomUnit } from "@Types/common"
import { Food } from "@Types/food"
import { Recipe } from "@Types/recipe"


export function determineWeightIsObject(weight: Weight | ObjectId | CustomUnit): weight is Weight {
  return 'id' in weight
}

export function determineCustomUnitIsObject(unit: CustomUnit | ObjectId): unit is CustomUnit {
  return 'gramWeight' in unit
}

export function determineFoodIsObject(food: Food | ObjectId | Recipe): food is Food {
  return 'name' in food
}

export function determineRecipeIsObject(recipe: Recipe | ObjectId | Food): recipe is Recipe {
  return 'serving' in recipe
}
