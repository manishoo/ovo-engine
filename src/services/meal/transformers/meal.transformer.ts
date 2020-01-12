/*
 * meal.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { transformRecipe } from '@Services/recipe/transformers/recipe.transformer'
import { determineIfItsFood } from '@Utils/determine-object'
import { Meal } from '@Types/meal'
import { InstanceType } from 'typegoose'


export function transformMeal(meal: InstanceType<Meal>): InstanceType<Meal> {
  meal.items = meal.items.map(mealItem => {
    if (mealItem.item) {
      if (determineIfItsFood(mealItem.item)) {
        // transform food
      } else {
        // transform recipe
        mealItem.item = transformRecipe(mealItem.item)
      }
    }

    return mealItem
  })
  return meal
}
