/*
 * recipe.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { transformRecipeUser } from '@Services/user/transformers/recipe-user.transformer'
import { Recipe } from '@Types/recipe'
import { User } from '@Types/user'


export function transformRecipe(recipe: Recipe, userId?: string) {
  recipe.userLikedRecipe = !!recipe.likes.find(p => String(p) === userId)
  recipe.likesCount = recipe.likes.length
  recipe.id = recipe._id.toString()
  recipe.author = transformRecipeUser(recipe.author as User)

  /**
   * Transform ingredients by attaching their _id to id field
   * */
  recipe.ingredients = recipe.ingredients.map(i => {
    if (i.item) {
      i.item.id = String(i.item._id)
    }

    return i
  })

  return recipe
}
