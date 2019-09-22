/*
 * mealService.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealModel } from '@Models/meal.model'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import { Meal, MealInput, MealItem, MealItemInput, MealListResponse, ListMealsArgs } from '@Types/meal'
import { Author } from '@Types/user'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { transformMeal } from './transformes/meal.transformer'
import { calculateMealNutrition } from './utils/calculate-meal-nutrition'


@Service()
export default class MealService {
  async create(mealInput: MealInput, userId: string): Promise<Meal> {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Errors.Validation('invalid user id')

    let meal: Partial<Meal> = {}

    /**
     * Attach Author
     * */
    let me = await UserModel.findById(userId)
    if (!me) throw new Errors.NotFound('User not found')
    meal.author = me._id

    /**
     * Optional fields
     * */
    if (mealInput.name) {
      meal.name = mealInput.name
    }
    if (mealInput.description) {
      meal.description = mealInput.description
    }

    const mealItems = await this.generateMealItemList(mealInput.items)

    const createMeal = await MealModel.create({
      ...meal,
      items: mealItems,
      nutrition: calculateMealNutrition(mealItems)
    })
    createMeal.author = me
    let createdMeal = await MealModel.findById(createMeal._id)
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
    if (!createdMeal) throw new Errors.System('Something went wrong')

    return transformMeal(createdMeal)
  }

  async get(id?: string, slug?: string): Promise<Meal> {
    let query: any = {}

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid meal id')
      query._id = id
    } else if (slug) {
      query.slug = slug
    } else {
      throw new Errors.UserInput('id or slug should be entered', {
        'id': 'you should enter at least on of the following arguments. id, slug',
        'slug': 'you should enter at least on of the following arguments. id, slug'
      })
    }
    let meal = await MealModel.findOne(query)
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
    if (!meal) throw new Errors.NotFound('meal not found')

    return transformMeal(meal)
  }

  async list(variables: ListMealsArgs): Promise<MealListResponse> {
    if (!variables.page) variables.page = 1
    if (!variables.size) variables.size = 10

    let query: any = {}

    if (variables.authorId) {
      if (!mongoose.Types.ObjectId.isValid(variables.authorId)) throw new Errors.Validation('Invalid author id')
      let author = await UserModel.findById(variables.authorId)
      if (!author) throw new Errors.NotFound('Author not found')
      query['author'] = author._id
    }
    const counts = await MealModel.countDocuments(query)

    const meals = await MealModel.find(query)
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

    meals.map(meal => {
      transformMeal(meal)
    })

    return {
      meals,
      pagination: createPagination(variables.page, variables.size, counts),
    }

  }

  async delete(id: string, userId: string): Promise<string> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid meal id')

    let meal = await MealModel.findById(id)
    if (!meal) throw new Errors.NotFound('meal not found')

    if (meal.author.toString() !== userId) throw new Errors.Forbidden('You can only delete your own meals')

    const deleted = await meal.delete()
    if (!deleted) throw new Errors.System('something went wrong')

    return meal.id

  }

  async update(id: string, mealInput: MealInput, userId: string): Promise<Meal> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid meal id')

    let meal = await MealModel.findById(id)
      .populate('author')
      .exec()

    if (!meal) throw new Errors.NotFound('meal not found')
    const author = meal.author as Author
    if (author.id !== userId) throw new Errors.Forbidden('update failed. you only can update your own meals')

    meal.name = mealInput.name
    meal.description = mealInput.description
    meal.items = mealInput.items.map(inputItem => {
      return {
        amount: inputItem.amount,
        food: inputItem.food,
        recipe: inputItem.recipe,
        weight: inputItem.weight,
        auhtor: meal!.author,
      }
    })
    meal.nutrition = calculateMealNutrition(meal.items)

    let savedMeal = await meal.save()
    const populatedMeal = await MealModel.findById(savedMeal._id)
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
    if (!populatedMeal) throw new Errors.System('Something went wrong')

    return transformMeal(populatedMeal)
  }

  async generateMealItemList(mealInputItems: MealItemInput[]): Promise<MealItem[]> {
    return Promise.all(mealInputItems.map(async mealItemInput => {
      /**
       * Raise error if food and recipe were provided or
       * none were provided
       * */
      if (mealItemInput.food && mealItemInput.recipe) {
        throw new Errors.UserInput('Wrong input', {
          'food': 'Only one of the following fields can be used',
          'recipe': 'Only one of the following fields can be used'
        })
      }
      if (!mealItemInput.food && !mealItemInput.recipe) {
        throw new Errors.UserInput('Wrong input', {
          'food': 'One of the items should be used',
          'recipe': 'One of the items should be used'
        })
      }

      if (mealItemInput.food) {
        if (!mongoose.Types.ObjectId.isValid(mealItemInput.food.toString())) throw new Errors.Validation('Invalid food id')

        const food = await FoodModel.findById(mealItemInput.food.toString())
        if (!food) throw new Errors.NotFound('food not found')
        if (mealItemInput.weight) {

          const foundWeight = food.weights.find(w => w.id!.toString() === mealItemInput.weight)
          if (!foundWeight) throw new Errors.UserInput('Wront weight', { 'weight': 'This weight is not available for the following food' })
        }

        return {
          amount: mealItemInput.amount,
          food: food,
          weight: mealItemInput.weight,
        }
      } else if (mealItemInput.recipe) {
        if (!mongoose.Types.ObjectId.isValid(mealItemInput.recipe.toString())) throw new Errors.Validation('Invalid recipe id')

        const recipe = await RecipeModel.findById(mealItemInput.recipe.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          amount: mealItemInput.amount,
          recipe: recipe,
        }
      }

      throw new Errors.System('Something went wrong')
    }))
  }
}
