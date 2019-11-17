/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { MealModel } from '@Models/meal.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import calculateMealTiming from '@Services/meal/utils/calculate-meal-timing'
import { ObjectId, Role } from '@Types/common'
import { Food } from '@Types/food'
import { ListMealsArgs, Meal, MealInput, MealItem, MealItemInput, MealListResponse } from '@Types/meal'
import { Recipe } from '@Types/recipe'
import { Author } from '@Types/user'
import { ContextUser } from '@Utils/context'
import { DeleteBy } from '@Utils/delete-by'
import Errors from '@Utils/errors'
import generateAllCases from '@Utils/generate-all-cases'
import { createPagination } from '@Utils/generate-pagination'
import { Service } from 'typedi'
import { transformMeal } from './transformes/meal.transformer'
import { calculateMealNutrition } from './utils/calculate-meal-nutrition'


@Service()
export default class MealService {
  async create(mealInput: MealInput, userId: string, bulkCreate?: boolean): Promise<Meal[]> {
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
      items: mealItems,
      timing,
      nutrition,
    })

    let createdMeals: Meal[] = []

    /**
     * Create meal instances
     * */
    if (bulkCreate && me.role !== Role.user) {
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
    const arrayOfArrayOfMealItemIds = generateAllCases(meal.items.map((mealItem, i) => ([meal.items[i], ...mealItem.alternativeMealItems].map(j => j.id.toString()!))))

    return Promise.all(arrayOfArrayOfMealItemIds.map(async arrayOfMealItemIds => {
      const mealItems = meal.items.map((item, index) => {
        const allMealItems = [item, ...item.alternativeMealItems]

        const targetId = arrayOfMealItemIds[index]
        const found = allMealItems.find(p => p.id.toString() === targetId)
        if (!found) throw new Errors.System('Something went wrong')

        return {
          ...found,
          id: item.id || new ObjectId(),
          alternativeMealItems: allMealItems.filter(p => p.id !== found.id).map(alternativeMealItem => ({
            ...alternativeMealItem,
            alternativeMealItems: undefined,
          })),
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

  async get(id?: ObjectId, slug?: string): Promise<Meal> {
    let query: any = {}

    if (id) {
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
      let author = await UserModel.findById(variables.authorId)
      if (!author) throw new Errors.NotFound('Author not found')
      query['author'] = author._id
    }

    if (variables.lastId) {

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

  async delete(id: ObjectId, user: ContextUser, bulkDelete?: boolean): Promise<string[]> {
    let meal = await MealModel.findById(id)
    if (!meal) throw new Errors.NotFound('meal not found')

    if (meal.author.toString() !== user.id) throw new Errors.Forbidden('You can only delete your own meals')

    const deleted = await meal.delete(DeleteBy.user(user))
    if (!deleted) throw new Errors.System('something went wrong')

    let deletedMealIds = []
    deletedMealIds.push(deleted.id)

    if (bulkDelete && meal.instanceOf) {
      const meals = await MealModel.find({ instanceOf: { $in: [meal._id, meal.instanceOf] } })
      await MealModel.delete({ instanceOf: { $in: [meal._id, meal.instanceOf] } }, DeleteBy.user(user))

      //FIXME? Maybe I'm wrong?
      deletedMealIds.push(...meals.map(m => m.id))
    }

    return deletedMealIds
  }

  async update(id: ObjectId, mealInput: MealInput, userId: string): Promise<Meal> {
    let meal = await MealModel.findById(id)
      .populate('author')
      .exec()

    if (!meal) throw new Errors.NotFound('meal not found')
    const author = meal.author as Author
    if (author.id !== userId) throw new Errors.Forbidden('update failed. you only can update your own meals')

    meal.name = mealInput.name
    meal.description = mealInput.description
    meal.items = mealInput.items.map(inputItem => ({
      id: inputItem.id,
      amount: inputItem.amount,
      food: inputItem.food,
      recipe: inputItem.recipe,
      weight: inputItem.weight,
      author: meal!.author,
      alternativeMealItems: inputItem.alternativeMealItems.map(alternativeMealItem => ({
        ...alternativeMealItem,
        alternativeMealItems: undefined,
      })),
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
          mealItem.id = new ObjectId()

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
        const food = await FoodModel.findById(mealItemInput.food.toString())
        if (!food) throw new Errors.NotFound('food not found')
        if (mealItemInput.weight) {

          const foundWeight = food.weights.find(w => w.id!.toString() === mealItemInput.weight)
          if (!foundWeight) throw new Errors.UserInput('Wront weight', { 'weight': 'This weight is not available for the following food' })
        }

        return {
          id: new ObjectId(),
          ...baseMealItem,
          amount: mealItemInput.amount,
          food,
          weight: mealItemInput.weight,
        } as MealItem
      } else if (mealItemInput.recipe) {
        const recipe = await RecipeModel.findById(mealItemInput.recipe.toString())
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          id: new ObjectId(),
          ...baseMealItem,
          amount: mealItemInput.amount,
          recipe,
        } as MealItem
      }

      throw new Errors.System('Something went wrong')
    }))
  }
}
