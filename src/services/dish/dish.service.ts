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
      if (item.food && item.recipe) {
        throw new Errors.UserInput('Wrong input', { 'food': 'Only one of the following fields can be used', 'recipe': 'Only one of the following fields can be used' })
      }
      if (!item.food && !item.recipe) {
        throw new Errors.UserInput('Wrong input', { 'food': 'One of the items should be used', 'recipe': 'One of the items should be used' })
      }

      if (item.food) {
        if (!item.weight) throw new Errors.Validation('Weight is mandatory')
        if (!mongoose.Types.ObjectId.isValid(item.food.toString())) throw new Errors.Validation('Invalid food id')

        const food = await FoodModel.findById(item.food.toString())
        if (!food) throw new Errors.NotFound('food not found')
        const foundWeight = food.weights.find(w => w.id === item.weight)
        if(!foundWeight) throw new Errors.UserInput('Wront weight', {'weight': 'This weight is not available for the following food'})

        return {
          unit: item.unit,
          food: food.id,
          weight: item.weight,
        }
      }
      if (item.recipe) {
        if (!mongoose.Types.ObjectId.isValid(item.recipe.toString())) throw new Errors.Validation('Invalid recipe id')

        const recipe = await RecipeModel.findById(item.recipe.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          unit: item.unit,
          recipe: recipe.id,
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
