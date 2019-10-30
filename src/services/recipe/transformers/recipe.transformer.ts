/*
 * recipe.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Recipe } from '@Types/recipe'


export function transformRecipe(recipe: Recipe/* nstanceType<RecipeSchema> */, userId?: string) {
  recipe.userLikedRecipe = !!recipe.likes.find(p => String(p) === userId)
  recipe.likesCount = recipe.likes.length
  recipe.id = recipe._id.toString()
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
