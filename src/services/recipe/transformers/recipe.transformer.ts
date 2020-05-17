/*
 * recipe.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Recipe } from '@Types/recipe'
import { InstanceType } from 'typegoose'


export function transformRecipe(recipe: Recipe | InstanceType<Recipe>, userId?: string) {
  if ('toObject' in recipe) {
    return recipe.toObject()
  }

  return recipe
}
