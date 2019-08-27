/*
 * recipe.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */


import { InstanceType } from 'typegoose'
import { RecipeSchema } from '@Models/recipe.model'

export function transformRecipe(recipe: InstanceType<RecipeSchema>, userId?: string) {
  recipe.userLikedRecipe = recipe.likedByUser(userId!)
  return recipe
}