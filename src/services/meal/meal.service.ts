/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealModel } from '@Models/meal.model'
import { UserModel } from '@Models/user.model'
import FoodService from '@Services/food/food.service'
import transformDbMealItem from '@Services/meal/transformers/meal-item.db-transformer'
import calculateMealTiming from '@Services/meal/utils/calculate-meal-timing'
import populateIngredients from '@Services/meal/utils/populate-ingredients'
import RecipeService from '@Services/recipe/recipe.service'
import { ObjectId, Role } from '@Types/common'
import { ListMealsArgs, Meal, MealInput, MealItem, MealListResponse } from '@Types/meal'
import { User } from '@Types/user'
import { ContextUser } from '@Utils/context'
import Errors from '@Utils/errors'
import generateAllCases from '@Utils/generate-all-cases'
import { createPagination } from '@Utils/generate-pagination'
import { Inject, Service } from 'typedi'
import { transformMeal } from './transformers/meal.transformer'
import { calculateMealNutrition } from './utils/calculate-meal-nutrition'


@Service()
export default class MealService {
  @Inject(type => RecipeService)
  private readonly recipeService: RecipeService
  @Inject(type => FoodService)
  private readonly foodService: FoodService

  async create(mealInput: MealInput, userId: string, bulkCreate?: boolean): Promise<Meal> {
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

    const masterMealMealItems = await populateIngredients(mealInput.items, this.foodService.get, this.recipeService.get) as MealItem[]

    const masterMealTiming = calculateMealTiming(masterMealMealItems)
    const masterMealNutrition = calculateMealNutrition(masterMealMealItems)

    const masterMealToBeCreated = new MealModel({
      ...masterMealData,
      items: masterMealMealItems.map(mealItem => transformDbMealItem(mealItem)),
      timing: masterMealTiming,
      nutrition: masterMealNutrition,
    })

    /**
     * Create meal permutations
     * */
    if (bulkCreate && (me.role !== Role.user)) {
      await this._createMealPermutations(masterMealToBeCreated, me)
    }

    const createdMeal = await MealModel.create(masterMealToBeCreated)

    return this.get(createdMeal._id)
  }

  async delete(id: ObjectId, user: ContextUser): Promise<string> {
    let meal = await MealModel.findById(id)
    if (!meal) throw new Errors.NotFound('meal not found')

    if (meal.author.toString() !== user.id) throw new Errors.Forbidden('You can only delete your own meals')

    const deleted = await meal.delete()
    if (!deleted) throw new Errors.System('something went wrong')

    if (meal.hasPermutations) {
      await MealModel.deleteMany({ instanceOf: meal._id })
    }

    return deleted.id
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
    if (!meal) throw new Errors.NotFound('meal not found')

    return transformMeal(meal)
  }

  async list(variables: ListMealsArgs): Promise<MealListResponse> {
    if (!variables.page) variables.page = 1
    if (!variables.size) variables.size = 10

    let query: any = {
      instanceOf: { $exists: false }
    }

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

    if (variables.ingredientId) {
      query['items.item._id'] = variables.ingredientId
    }

    const counts = await MealModel.countDocuments(query)

    const meals = await MealModel.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(variables.size)
      .skip(variables.size * (variables.page - 1))

    return {
      meals: meals.map(meal => transformMeal(meal)),
      pagination: createPagination(variables.page, variables.size, counts, meals),
    }
  }

  async update(id: ObjectId, mealInput: MealInput, userId: string): Promise<Meal> {
    let meal = await MealModel.findById(id)

    if (!meal) throw new Errors.NotFound('meal not found')
    if (String(meal.author as ObjectId) !== userId) throw new Errors.Forbidden('Update failed. you only can update your own meals')

    meal.name = mealInput.name
    meal.description = mealInput.description
    meal.nutrition = calculateMealNutrition(meal.items)

    const masterMealMealItems = await populateIngredients(mealInput.items, this.foodService.get, this.recipeService.get) as MealItem[]

    meal.nutrition = calculateMealNutrition(masterMealMealItems)
    meal.timing = calculateMealTiming(masterMealMealItems)

    meal.items = masterMealMealItems.map(mealItem => transformDbMealItem(mealItem) as MealItem)
    let savedMeal = await meal.save()

    return this.get(savedMeal._id)
  }

  private async _createMealPermutations(meal: Meal, me: User): Promise<Meal[]> {
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
    for (let meal of optionalMeals) {
      const arrayOfArrayOfMealItemIds = generateAllCases(meal.items.map((mealItem, i) => ([meal.items[i], ...mealItem.alternativeMealItems].map(j => j.id.toString()!))))

      for (let arrayOfMealItemIds of arrayOfArrayOfMealItemIds) {
        const mealItems = meal.items.map((item, index) => {
          let allMealItems = [item, ...item.alternativeMealItems]

          const targetId = arrayOfMealItemIds[index]
          const found = allMealItems.find(p => p.id.toString() === targetId)
          if (!found) throw new Errors.System('Something went wrong')

          allMealItems = allMealItems.filter(p => p.id !== found.id)

          return {
            ...found,
            id: new ObjectId(),
            alternativeMealItems: allMealItems.map(alternativeMealItem => ({
              ...alternativeMealItem,
              alternativeMealItems: undefined,
            })),
          } as MealItem
        })

        /**
         * Create permutation but not the one that is like the masterMeal
         * */
        const isMaster = meal.items.map(mi => mi.item && String(mi.item.id)).join('_') === mealItems.map(mi => mi.item && String(mi.item.id)).join('_')
        if (isMaster) continue

        const createdMeal = await MealModel.create({
          author: meal.author,
          description: meal.description,
          items: mealItems,
          instanceOf: meal._id,
          hasPermutations: true,
          timing: calculateMealTiming(mealItems),
          nutrition: calculateMealNutrition(mealItems),
        } as Meal)

        /**
         * Transform without using this.get to make one less query
         * */
        createdMeal.author = me

        finalMeals.push(transformMeal(createdMeal))
      }
    }

    return finalMeals
  }
}
