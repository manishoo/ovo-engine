/*
 * recipe.datasource.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import config from '@Config'
import FoodDataSource from '@Services/food/food.datasource'
import { ObjectId } from '@Types/common'
import { IngredientItemUnion } from '@Types/ingredient'
import { Recipe } from '@Types/recipe'
import { Context } from '@Utils/context'
import Errors from '@Utils/errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Service } from 'typedi'


@Service()
export default class RecipeDataSource extends MongoDataSource<Recipe, Context> {
  async get(recipeId: ObjectId, foodDataSource: FoodDataSource): Promise<Recipe> {
    let recipe = await this.findOneById(recipeId, { ttl: config.cacheTTL })
    if (!recipe) throw new Errors.NotFound('Recipe not found')

    const recipeIds: ObjectId[] = []
    const foodIds: ObjectId[] = []

    recipe.ingredients.map(ingredient => {
      if (!ingredient.item) return

      if (!('ref' in ingredient.item)) return

      if (ingredient.item.ref === 'recipe') {
        recipeIds.push(ingredient.item.id)
      } else {
        foodIds.push(ingredient.item.id)
      }
    })

    const recipes = await this.findManyByIds(recipeIds)
    const foods = await foodDataSource.findManyByIds(foodIds)

    function populateIngredientItem(ingredientItem?: typeof IngredientItemUnion | { id: ObjectId, ref: 'recipe' | 'food' }) {
      if (!ingredientItem) return

      if (!('ref' in ingredientItem)) return ingredientItem

      switch (ingredientItem.ref) {
        case 'food':
          return foods.find(f => f && (f.id === String(ingredientItem!.id))) || undefined
        case 'recipe':
          return recipes.find(f => f && (f.id === String(ingredientItem!.id))) || undefined
      }
    }

    return {
      ...recipe,
      id: String(recipe._id),
      ingredients: await Promise.all(recipe.ingredients.map(async ingredient => ({
        ...ingredient,
        item: populateIngredientItem(ingredient.item)
      })))
    }
  }
}
