/*
 * mealService.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { MealModel } from '@Models/meal.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import calculateMealTiming from '@Services/meal/utils/calculate-meal-timing'
import { UserRole } from '@Types/common'
import { Food } from '@Types/food'
import { ListMealsArgs, Meal, MealInput, MealItem, MealItemInput, MealListResponse } from '@Types/meal'
import { Recipe } from '@Types/recipe'
import { Author } from '@Types/user'
import Errors from '@Utils/errors'
import generateAllCases from '@Utils/generate-all-cases'
import { createPagination } from '@Utils/generate-pagination'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import uuid from 'uuid/v4'
import { transformMeal } from './transformes/meal.transformer'
import { calculateMealNutrition } from './utils/calculate-meal-nutrition'


@Service()
export default class MealService {
  async create(mealInput: MealInput, userId: string, bulkCreate?: boolean): Promise<Meal[]> {
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

    const mealItems = await this.validateMealItems(mealInput.items)
    const timing = calculateMealTiming(mealItems)
    const nutrition = calculateMealNutrition(mealItems)

    const mealToBeCreated = new MealModel({
      ...meal,
      items: mealItems.map(mealItem => {
        if (mealItem.food) {
          const food = mealItem.food as Food
          mealItem.food = food._id
        } else if (mealItem.recipe) {
          const recipe = mealItem.recipe as Recipe
          mealItem.recipe = recipe._id
        }

        return mealItem
      }),
      timing,
      nutrition,
    })

    let createdMeals: Meal[] = []

    /**
     * Create meal instances
     * */
    if (bulkCreate && me.role !== UserRole.user) {
      const mealInstances = await this.createMealInstances(mealToBeCreated)
      createdMeals.push(...mealInstances)
    } else {
      const createMeal = await MealModel.create(mealToBeCreated)
      let createdMeal = await MealModel.findById(createMeal._id)
        .populate('author')
        .populate({
          path: 'items.food',
          model: FoodModel
        })
        .populate({
          path: 'items.alternativeMealItems.food',
          model: FoodModel
        })
        .populate({
          path: 'items.recipe',
          model: RecipeModel,
          populate: {
            path: 'author',
            model: UserModel,
          },
        })
        .populate({
          path: 'items.alternativeMealItems.recipe',
          model: RecipeModel,
          populate: {
            path: 'author',
            model: UserModel,
          },
        })
        .exec()
      if (!createdMeal) throw new Errors.System('Something went wrong')
      createdMeals.push(createdMeal)
    }

    return createdMeals.map(transformMeal)
  }

  async createMealInstances(meal: Meal) {
    const items = meal.items.map(i => {
      i._tempId = uuid()
      i.alternativeMealItems.map(j => {
        j._tempId = uuid()
        return j
      })

      return i
    })

    const arrayOfArrayOfMealItemIds = generateAllCases(items.map((mealItem, i) => ([items[i], ...mealItem.alternativeMealItems].map(j => j._tempId!))))

    return Promise.all(arrayOfArrayOfMealItemIds.map(async arrayOfMealItemIds => {
      const mealItems = items.map((item, index) => {
        const allMealItems = [item, ...item.alternativeMealItems]

        const targetId = arrayOfMealItemIds[index]
        const found = allMealItems.find(p => p._tempId === targetId)
        if (!found) throw new Errors.System('Something went wrong')

        return {
          ...found,
          alternativeMealItems: allMealItems.filter(p => p._tempId !== found._tempId),
        } as MealItem
      })

      const createdMeal = await MealModel.create({
        author: meal.author,
        description: meal.description,
        items: mealItems,
        instanceOf: meal._id,
        timing: calculateMealTiming(mealItems),
        nutrition: calculateMealNutrition(mealItems),
      } as Meal)
      const populatedMeal = await MealModel.findById(createdMeal._id)
        .populate('author')
        .populate({
          path: 'items.food',
          model: FoodModel
        })
        .populate({
          path: 'items.alternativeMealItems.food',
          model: FoodModel
        })
        .populate({
          path: 'items.recipe',
          model: RecipeModel,
          populate: {
            path: 'author',
            model: UserModel,
          },
        })
        .populate({
          path: 'items.alternativeMealItems.recipe',
          model: RecipeModel,
          populate: {
            path: 'author',
            model: UserModel,
          },
        })
        .exec()
      if (!populatedMeal) throw new Errors.System('Something went wrong')

      return populatedMeal
    }))
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
        path: 'items.alternativeMealItems.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .populate({
        path: 'items.alternativeMealItems.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
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

    if (variables.lastId) {
      if (!mongoose.Types.ObjectId.isValid(variables.lastId)) throw new Errors.Validation('LastId is not valid')

      const meal = await MealModel.findById(variables.lastId)
      if (!meal) throw new Errors.NotFound('meal not found')

      query.createdAt = { $lt: meal.createdAt }
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
        path: 'items.alternativeMealItems.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .populate({
        path: 'items.alternativeMealItems.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .exec()

    meals.map((meal, index) => {
      if (index === 3) {
        meal.items.map((i, ind) => {
          if (i.recipe) {
            const r = i.recipe as Recipe

            console.log('r.author', r.author)
          }
        })
      }
      transformMeal(meal)
    })

    return {
      meals,
      pagination: createPagination(variables.page, variables.size, counts),
    }
  }

  async delete(id: string, userId: string, bulkDelete?: boolean): Promise<string[]> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid meal id')

    let meal = await MealModel.findById(id)
    if (!meal) throw new Errors.NotFound('meal not found')

    if (meal.author.toString() !== userId) throw new Errors.Forbidden('You can only delete your own meals')

    const deleted = await meal.delete()
    if (!deleted) throw new Errors.System('something went wrong')

    let deletedMealIds = []
    deletedMealIds.push(deleted.id)

    if (bulkDelete) {
      const meals = await MealModel.find({ instanceOf: { $in: [meal._id, meal.instanceOf] } })
      await MealModel.delete({ instanceOf: { $in: [meal._id, meal.instanceOf] } })

      //FIXME? Maybe I'm wrong?
      deletedMealIds.push(...meals.map(m => m.id))
    }

    return deletedMealIds
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
    meal.items = mealInput.items.map(inputItem => ({
      amount: inputItem.amount,
      food: inputItem.food,
      recipe: inputItem.recipe,
      weight: inputItem.weight,
      author: meal!.author,
      alternativeMealItems: inputItem.alternativeMealItems,
    } as MealItem))
    meal.nutrition = calculateMealNutrition(meal.items)

    let savedMeal = await meal.save()
    const populatedMeal = await MealModel.findById(savedMeal._id)
      .populate('author')
      .populate({
        path: 'items.food',
        model: FoodModel
      })
      .populate({
        path: 'items.alternativeMealItems.food',
        model: FoodModel
      })
      .populate({
        path: 'items.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .populate({
        path: 'items.alternativeMealItems.recipe',
        model: RecipeModel,
        populate: {
          path: 'author',
          model: UserModel,
        },
      })
      .exec()
    if (!populatedMeal) throw new Errors.System('Something went wrong')

    return transformMeal(populatedMeal)
  }

  async validateMealItems(mealInputItems: MealItemInput[]): Promise<MealItem[]> {
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

      const baseMealItem: Partial<MealItem> = {}

      if (mealItemInput.alternativeMealItems) {
        const mealItems = await this.validateMealItems(mealItemInput.alternativeMealItems as MealItemInput[])
        baseMealItem.alternativeMealItems = mealItems.map(mealItem => {
          if (mealItem.food) {
            const food = mealItem.food as Food
            mealItem.food = food._id
          } else if (mealItem.recipe) {
            const recipe = mealItem.recipe as Recipe
            mealItem.recipe = recipe._id
          }

          return mealItem
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
          ...baseMealItem,
          amount: mealItemInput.amount,
          food,
          weight: mealItemInput.weight,
        } as MealItem
      } else if (mealItemInput.recipe) {
        if (!mongoose.Types.ObjectId.isValid(mealItemInput.recipe.toString())) throw new Errors.Validation('Invalid recipe id')

        const recipe = await RecipeModel.findById(mealItemInput.recipe.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          ...baseMealItem,
          amount: mealItemInput.amount,
          recipe,
        } as MealItem
      }

      throw new Errors.System('Something went wrong')
    }))
  }
}
