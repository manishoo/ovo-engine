/*
 * determine-object.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Weight } from "@Types/weight"
import { ObjectId, CustomUnit } from "@Types/common"
import { Food } from "@Types/food"
import { Recipe } from "@Types/recipe"


export function determineIfItsWeightOrObject(weight: Weight | CustomUnit | ObjectId): weight is Weight {
  return 'id' in weight
}

export function determineIfItsCustomUnit(unit: CustomUnit): unit is CustomUnit {
  return 'gramWeight' in unit
}

export function determineIfItsFood(food: Food | Recipe): food is Food {
  return 'name' in food
}

export function determineIfItsRecipe(recipe: Recipe | Food): recipe is Recipe {
  return 'serving' in recipe
}
