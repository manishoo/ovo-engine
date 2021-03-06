/*
 * dish.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DishModel } from '@Models/dish.model'
import { Dish, DishInput, DishListResponse, ListDishesArgs, DishItemInput, DishItem } from '@Types/dish'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import { createPagination } from '@Utils/generate-pagination'
import { Author } from '@Types/user'
import { calculateDishNutrition } from './utils/calculate-dish-nutrition'
import { Food } from '@Types/food'
import { transformDish } from './transformes/dish.transformer'

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

    let dishItems = await this.generateDishItemList(dishInput.items)

    const createDish = await DishModel.create({
      ...dish,
      items: dishItems,
      nutrition: calculateDishNutrition(dishItems)
    })
    createDish.author = me
    let createdDish = await DishModel.findById(createDish._id)
      .populate('author')
      .populate({
        path: 'items.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel
      })
      .exec()
    if (!createdDish) throw new Errors.System('Something went wrong')

    return transformDish(createdDish)
  }

  async get(id?: string, slug?: string): Promise<Dish> {
    let query: any = {}

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid dish id')
      query._id = id
    } else if (slug) {
      query.slug = slug
    } else {
      throw new Errors.UserInput('id or slug should be entered', { 'id': 'you should enter at least on of the following arguments. id, slug', 'slug': 'you should enter at least on of the following arguments. id, slug' })
    }
    let dish = await DishModel.findOne(query)
      .populate('author')
      .populate({
        path: 'items.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel
      })
      .exec()
    if (!dish) throw new Errors.NotFound('dish not found')

    return transformDish(dish)
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
      .populate({
        path: 'items.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel
      })
      .exec()

    dishes.map(dish => {
      transformDish(dish)
    })

    return {
      dishes,
      pagination: createPagination(variables.page, variables.size, counts),
    }

  }

  async delete(id: string, userId: string): Promise<string> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid dish id')

    let dish = await DishModel.findById(id)
    if (!dish) throw new Errors.NotFound('dish not found')

    if (dish.author.toString() !== userId) throw new Errors.Forbidden('You can only delete your own dishes')

    const deleted = await dish.delete()
    if (!deleted) throw new Errors.System('something went wrong')

    return dish.id

  }

  async update(id: string, dishInput: DishInput, userId: string): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid dish id')

    let dish = await DishModel.findById(id)
      .populate('author')
      .exec()

    if (!dish) throw new Errors.NotFound('dish not found')
    const author = dish.author as Author
    if (author.id !== userId) throw new Errors.Forbidden('update failed. you only can update your own dishes')

    dish.name = dishInput.name
    dish.description = dishInput.description
    dish.items = dishInput.items.map(inputItem => {
      return {
        amount: inputItem.amount,
        food: inputItem.food,
        recipe: inputItem.recipe,
        weight: inputItem.weight,
        auhtor: dish!.author,
      }
    })
    dish.nutrition = calculateDishNutrition(dish.items)

    let savedDish = await dish.save()
    const populatedDish = await DishModel.findById(savedDish._id)
      .populate('author')
      .populate({
        path: 'items.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel
      })
      .exec()
    if (!populatedDish) throw new Errors.System('Something went wrong')

    return transformDish(populatedDish)
  }

  async generateDishItemList(dishInputItems: DishItemInput[]): Promise<DishItem[]> {
    return Promise.all(dishInputItems.map(async dishItemInput => {
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

          const foundWeight = food.weights.find(w => w.id!.toString() === dishItemInput.weight)
          if (!foundWeight) throw new Errors.UserInput('Wront weight', { 'weight': 'This weight is not available for the following food' })
        }

        return {
          amount: dishItemInput.amount,
          food: food,
          weight: dishItemInput.weight,
        }
      } else if (dishItemInput.recipe) {
        if (!mongoose.Types.ObjectId.isValid(dishItemInput.recipe.toString())) throw new Errors.Validation('Invalid recipe id')

        const recipe = await RecipeModel.findById(dishItemInput.recipe.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          amount: dishItemInput.amount,
          recipe: recipe,
        }
      }

      throw new Errors.System('Something went wrong')
    }))
  }
}
