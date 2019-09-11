/*
 * recipe.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { RecipeSchema } from '@Models/recipe.model'
import { InstanceType } from 'typegoose'


export function transformRecipe(recipe: InstanceType<RecipeSchema>, userId?: string) {
  recipe.userLikedRecipe = recipe.likedByUser(userId!)

  /**
   * Transform ingredients by attaching their _id to id field
   * */
  recipe.ingredients = recipe.ingredients.map(i => {
    if (i.food) {
      i.food.id = String(i.food._id)
    }

    return i
  })

  return recipe
}
