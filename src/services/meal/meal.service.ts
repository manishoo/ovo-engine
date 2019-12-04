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
import { MealItem, MealItemInput } from '@Types/ingredient'
import { ListMealsArgs, Meal, MealInput, MealListResponse } from '@Types/meal'
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
    let masterMealData: Partial<Meal> = {}

    /**
     * Attach Author
     * */
    let me = await UserModel.findById(userId)
    if (!me) throw new Errors.NotFound('User not found')
    masterMealData.author = me._id

    /**
     * Optional fields
     * */
    if (mealInput.name) {
      masterMealData.name = mealInput.name
    }
    if (mealInput.description) {
      masterMealData.description = mealInput.description
    }

    const masterMealMealItems = await this.validateMealItems(mealInput.items)

    const masterMealTiming = calculateMealTiming(masterMealMealItems)
    const masterMealNutrition = calculateMealNutrition(masterMealMealItems)

    const masterMealToBeCreated = new MealModel({
      ...masterMealData,
      items: masterMealMealItems,
      timing: masterMealTiming,
      nutrition: masterMealNutrition,
    })

    let mealsToBeCreated: Meal[] = []
    /**
     * Create meal permutations
     * */
    if (bulkCreate && (me.role !== Role.user)) {
      const mealPermutations = await this._createMealPermutations(masterMealToBeCreated)

      mealsToBeCreated.push(...mealPermutations)
    } else {
      const createdMeal = await MealModel.create(masterMealToBeCreated)
      mealsToBeCreated.push(await this.get(createdMeal._id))
    }

    return mealsToBeCreated
  }

  private async _createMealPermutations(meal: Meal): Promise<Meal[]> {
    let optionals: MealItem[] = []
    let constants: MealItem[] = []

    meal.items.map(mealItem => {
      if (mealItem.isOptional) {
        optionals.push(mealItem)
      } else {
        constants.push(mealItem)
      }
    })

    let mealItemOptionalPermutations: MealItem[][] = []

    /**
     * create optional permutations
     */
    for (let i = 0; i < Math.pow(2, optionals.length); i++) {
      let mealItemIncludes: MealItem[] = []
      for (let j = 0; j < optionals.length; j++) {
        if ((i >> j).toString(2)[(i >> j).toString(2).length - 1] === '1') {
          mealItemIncludes.push(optionals[j])
        }
      }
      mealItemOptionalPermutations.push([...constants, ...mealItemIncludes])
    }

    const optionalMeals = await Promise.all(mealItemOptionalPermutations.map(async mealItems => {
      return new MealModel({
        author: meal.author,
        description: meal.description,
        items: mealItems,
        instanceOf: meal._id,
        timing: calculateMealTiming(mealItems),
        nutrition: calculateMealNutrition(mealItems),
      } as Meal)
    }))

    let finalMeals: Meal[] = []
    /**
     * create meal alternative permutations
     */
    await Promise.all(optionalMeals.map(meal => {
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

        finalMeals.push(await this.get(createdMeal._id))
      }))
    }))

    return finalMeals
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
      .populate('items.item.author')
      .populate('items.alternativeMealItems.item.author')
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
      .populate('items.recipe.author')
      .populate('items.alternativeMealItems.recipe.author')
      .exec()

    return {
      meals: meals.map(meal => transformMeal(meal)),
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
    if (author.id !== userId) throw new Errors.Forbidden('Update failed. you only can update your own meals')

    meal.name = mealInput.name
    meal.description = mealInput.description
    meal.nutrition = calculateMealNutrition(meal.items)
    meal.items = await this.validateMealItems(mealInput.items)
    let savedMeal = await meal.save()

    return this.get(savedMeal._id)
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

      const baseMealItem: Partial<MealItem> = {
        id: mealItemInput.id || new ObjectId(),
        amount: mealItemInput.amount,
        isOptional: mealItemInput.isOptional,
      }

      /**
       * Check and set the alternative meal items
       * */
      if (mealItemInput.alternativeMealItems) {
        const mealItems = await this.validateMealItems(mealItemInput.alternativeMealItems as MealItemInput[])
        baseMealItem.alternativeMealItems = mealItems.map(mealItem => {
          if (!mealItem.id) mealItem.id = new ObjectId()

          return mealItem
        })
      }

      /**
       * Check and select the unit: part 1
       * */
      switch (mealItemInput.unit) {
        case 'customUnit':
          baseMealItem.unit = mealItemInput.customUnit
          break
        case 'g':
          baseMealItem.unit = undefined
          break
      }

      if (mealItemInput.food) {
        const food = await FoodModel.findById(mealItemInput.food)
        if (!food) throw new Errors.NotFound('food not found')

        /**
         * Check and select the unit: part 2
         * */
        if (!mealItemInput.unit) {
          const foundWeight = food.weights.find(w => w.id!.toString() == mealItemInput.unit)
          if (!foundWeight) throw new Errors.Validation('Unit is not valid')

          baseMealItem.unit = foundWeight
        }

        return {
          ...baseMealItem,
          item: {
            ...food.toObject(),
            id: String(food._id),
          },
        } as MealItem
      } else if (mealItemInput.recipe) {
        const recipe = await RecipeModel.findById(mealItemInput.recipe)
        if (!recipe) throw new Errors.NotFound('recipe not found')

        return {
          ...baseMealItem,
          item: {
            ...recipe.toObject(),
            id: String(recipe._id),
          },
        } as MealItem
      }

      throw new Errors.System('Something went wrong')
    }))
  }
}
