/*
 * food-mapper.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import redis from '@Config/connections/redis'
import { WeightModel } from '@Models'
import { FoodMapModel } from '@Models/food-map.model'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { calculateRecipeNutrition } from '@Services/recipe/utils/calculate-recipe-nutrition'
import { Food, IngredientFood } from '@Types/food'
import { FoodMap, FoodMapInput, FoodMapList, FoodMapListArgs, FoodMapUnit } from '@Types/food-map'
import { RedisKeys } from '@Types/redis'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import { Service } from 'typedi'


@Service()
export default class FoodMapperService {
  async list({ page = 1, size = 25, nameSearchQuery, verified = false }: FoodMapListArgs): Promise<FoodMapList> {
    const q: any = {
      verified,
    }

    if (nameSearchQuery) {
      q['text'] = {
        $regex: nameSearchQuery,
        $options: 'i',
      }
    }

    const foodMaps = await FoodMapModel.find(q)
      .skip((Math.abs(page) - 1) * size)
      .limit(size)
      .sort({
        usageCount: -1,
      })
      .populate('food')
    const count = await FoodMapModel.countDocuments(q)

    return {
      foodMaps,
      pagination: createPagination(Math.abs(page), size, count)
    }
  }

  async mapFood(foodMapId: string, foodMapInput: FoodMapInput): Promise<FoodMap> {
    let foodMap = await FoodMapModel.findById(foodMapId)
    if (!foodMap) throw new Errors.NotFound('food map not found')

    const food = await FoodModel.findById(foodMapInput.food)
    if (!food) throw new Errors.NotFound('Food not found')

    foodMap.verified = foodMapInput.verified
    foodMap.units = foodMapInput.units.map(unit => ({
      text: unit.text,
      foodId: unit.foodId,
      weight: food.weights.find(w => w.id == unit.weightId),
    }))
    foodMap.food = foodMapInput.food

    if (foodMapInput.verified && await redis.get(RedisKeys.foodMapperJobRunning)) {
      throw new Errors.Forbidden('A job is already running')
    }

    await foodMap.save()

    foodMap.food = food

    if (foodMapInput.verified) {
      // FIXME: unhandled promise
      this.mapFoodToRecipeIngredients(foodMap, food.toObject())
    }

    return foodMap
  }

  /**
   * This function will get a FoodMap and
   * link it to all recipes which have an ingredient
   * with the same name as the FoodMap.text
   * */
  async mapFoodToRecipeIngredients(foodMap: FoodMap, food: IngredientFood) {
    const recipes = await RecipeModel.find({ ingredients: { $elemMatch: { 'name.text': foodMap.text } } })

    /**
     * We use redis in order to now allow two process of this kind to
     * run simultaneously
     * */
    await redis.setex(RedisKeys.foodMapperJobRunning, 60 * 60, 'true')

    /**
     * Cutting the big array into multiple
     * smaller arrays for better performance
     * */
    const arrays = []
    const size = 20

    while (recipes.length > 0) {
      arrays.push(recipes.splice(0, size))
    }

    for (let recipes of arrays) {
      await Promise.all(recipes.map(recipe => {
        recipe.ingredients = recipe.ingredients.map(ingredient => {
          if (ingredient.name) {
            ingredient.name.map(name => {
              if (name.text === foodMap.text) {
                ingredient.food = food
                ingredient.thumbnail = food.thumbnailUrl
              }
            })
          }

          return ingredient
        })
        recipe.nutrition = calculateRecipeNutrition(recipe.ingredients)
        return recipe.save()
      }))
    }

    await redis.del(RedisKeys.foodMapperJobRunning)
  }
}
