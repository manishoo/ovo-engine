/*
 * dish.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DishModel } from '@Models/dish.model'
import { Dish, DishInput, DishListResponse, ListDishesArgs } from '@Types/dish'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import { createPagination } from 'src/api/app/utils'

@Service()
export default class DishService {

  async create(dishInput: DishInput, userId: string): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Errors.Validation('invalid user id')
    let me = await UserModel.findById(userId)
    if (!me) throw new Errors.NotFound('User not found')

    let dish: Partial<Dish> = {}

    if (dishInput.name) {
      dish.name = dishInput.name
    }
    if (dishInput.description) {
      dish.description = dishInput.description
    }
    dish.author = me._id
    let dishItems = await Promise.all(dishInput.items.map(async dishItemInput => {
      if (dishItemInput.food && dishItemInput.recipe) {

        throw new Errors.UserInput('Wrong input', { 'food': 'Only one of the following fields can be used', 'recipe': 'Only one of the following fields can be used' })
      }
      if (!dishItemInput.food && !dishItemInput.recipe) {
        throw new Errors.UserInput('Wrong input', { 'food': 'One of the items should be used', 'recipe': 'One of the items should be used' })
      }

      if (dishItemInput.food) {
        if (!mongoose.Types.ObjectId.isValid(dishItemInput.food.toString())) throw new Errors.Validation('Invalid food id')

        const food = await FoodModel.findById(dishItemInput.food.toString())
        if (!food) throw new Errors.NotFound('food not found')
        if (dishItemInput.weight) {
          const foundWeight = food.weights.find(w => w.id === dishItemInput.weight)
          if (!foundWeight) throw new Errors.UserInput('Wront weight', { 'weight': 'This weight is not available for the following food' })
        }

        return {
          amount: dishItemInput.amount,
          food: food.id,
          weight: dishItemInput.weight,
        }
      }
      if (dishItemInput.recipe) {
        if (!mongoose.Types.ObjectId.isValid(dishItemInput.recipe.toString())) throw new Errors.Validation('Invalid recipe id')

        const recipe = await RecipeModel.findById(dishItemInput.recipe.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          amount: dishItemInput.amount,
          recipe: recipe.id,
        }
      }

    }))
    const createDish = await DishModel.create({
      ...dish,
      items: dishItems,
    })
    const createdDish = await DishModel.findById(createDish.id).populate('author')
    if (!createdDish) throw new Errors.System('something went wrong')

    return createdDish

  }

  async get(id: string): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.UserInput('Invalid id', { id: 'Incorrect id' })

    const dish = await DishModel.findById(id)
    if (!dish) throw new Errors.NotFound('Dish not found')

    return dish
  }

  async list(variables: ListDishesArgs): Promise<DishListResponse> {
    if (!variables.page) variables.page = 1
    if (!variables.size) variables.size = 10

    let query: any = {}

    if (variables.authorId) {
      if (!mongoose.Types.ObjectId.isValid(variables.authorId)) throw new Errors.Validation('Invalid author id')
      let author = await UserModel.findById(variables.authorId)
      if (!author) throw new Errors.NotFound('Author not found')
      query['author'] = author._id
    }
    const counts = await DishModel.countDocuments(query)

    const dishes = await DishModel.find(query)
      .limit(variables.size)
      .skip(variables.size * (variables.page - 1))
      .populate('author')
      .exec()

    return {
      dishes,
      pagination: createPagination(variables.page, variables.size, counts),
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
