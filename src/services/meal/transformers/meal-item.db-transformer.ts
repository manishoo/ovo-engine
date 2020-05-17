/*
 * meal-item.db-transformer.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { Ingredient, IngredientItemUnion } from '@Types/ingredient'
import { MealItem } from '@Types/meal'
import { determineIfItsFood } from '@Utils/determine-object'


export default function transformDbMealItem(ingredient: Ingredient | MealItem) {
  const ingredientItem = ingredient.item as typeof IngredientItemUnion
  const obj = {
    ...ingredient,
    item: ingredient.item ? {
      ref: determineIfItsFood(ingredientItem) ? 'food' : 'recipe',
      id: new ObjectId(ingredientItem.id),
    } : undefined
  }

  if ('alternativeMealItems' in ingredient) {
    (obj as MealItem).alternativeMealItems = ingredient.alternativeMealItems.map(alt => transformDbMealItem(alt))
  }

  return obj as typeof ingredient
}
