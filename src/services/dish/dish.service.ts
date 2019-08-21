/*
 * dish.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DishModel } from '@Models/dish.model'
import { Dish, DishInput, DishListResponse } from '@Types/dish'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'


const DEFAULT_PAGE_SIZE = 25

@Service()
export default class DishService {

  async create(dishInput: DishInput): Promise<Dish> {
    let dish: Partial<Dish> = {}

    if (dishInput.name) {
      dish.name = dishInput.name
    }
    if (dishInput.description) {
      dish.description = dishInput.description
    }
    let dishItems = await Promise.all(dishInput.items.map(async item => {
      if (item.foodId && item.recipeId) {
        throw new Errors.UserInput('Wrong input', { 'foodId': 'Only one of the following fields can be used', 'recipeId': 'Only one of the following fields can be used' })
      }
      if (!item.foodId && !item.recipeId) {
        throw new Errors.UserInput('Wrong input', { 'foodId': 'One of the items should be used', 'recipeId': 'One of the items should be used' })
      }

      if (item.foodId) {
        if (!mongoose.Types.ObjectId.isValid(item.foodId.toString())) throw new Errors.Validation('Invalid food id')

        const food = await FoodModel.findById(item.foodId.toString())
        if (!food) throw new Errors.NotFound('food not found')

        return {
          unit: item.unit,
          foodId: food.id,
        }
      }
      if (item.recipeId) {
        if (!mongoose.Types.ObjectId.isValid(item.recipeId.toString())) throw new Errors.Validation('Invalid recipe id')

        const recipe = await RecipeModel.findById(item.recipeId.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          unit: item.unit,
          recipeId: recipe.id,
        }
      }

    }))
    return DishModel.create({
      ...dish,
      items: dishItems
    })

  }

  async get(id: string): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.UserInput('Invalid id', { id: 'Incorrect id' })

    const dish = await DishModel.findById(id)
    if (!dish) throw new Errors.NotFound('Dish not found')

    return dish
  }

  async list(page: number = 1, size: number = DEFAULT_PAGE_SIZE): Promise<DishListResponse> {
    const counts = await DishModel.countDocuments()

    if (page > Math.ceil(counts / size)) page = Math.ceil(counts / size)
    if (page < 1) page = 1

    const dishes = await DishModel.find()
      .limit(size)
      .skip(size * (page - 1))

    return {
      dishes,
      pagination: {
        page,
        size,
        totalCount: counts,
        totalPages: Math.ceil(counts / size),
        hasNext: page !== Math.ceil(counts / size)
      },
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('Invalid  id')

    // TODO can only delete own dish

    await DishModel.remove({ _id: mongoose.Types.ObjectId(id) })

    return true
  }

  async update(id: string, dishInput: DishInput): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('Invalid  id')

    const dish = await DishModel.findById(id)
    if (!dish) throw new Errors.NotFound('Dish not found')

    // TODO can only update own dish

    // TODO complete

    return dish
  }
}
