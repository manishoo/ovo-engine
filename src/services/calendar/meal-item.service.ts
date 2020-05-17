/*
 * meal-item.service.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import MealService from '@Services/meal/meal.service'
import RecipeService from '@Services/recipe/recipe.service'
import { ObjectId } from '@Types/common'
import { IngredientListArgs, IngredientListResponse } from '@Types/ingredient'
import { MealItem } from '@Types/meal'
import { ContextUser } from '@Utils/context'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import { Inject, Service } from 'typedi'
import CalendarService from './calendar.service'
import { createDefaultMealItem } from './utils'


const levenSort = require('leven-sort')

@Service()
export default class MealItemService {
  @Inject(type => RecipeService)
  private readonly recipeService: RecipeService
  @Inject(type => FoodService)
  private readonly foodService: FoodService
  @Inject(type => MealService)
  private readonly mealService: MealService
  @Inject(type => CalendarService)
  private readonly calendarService: CalendarService

  async list({ nameSearchQuery, page, size }: IngredientListArgs, user: ContextUser): Promise<IngredientListResponse> {
    /**
     * Ensure size is an even number
     * */
    if (size % 2 !== 0) throw new Errors.Validation('size must be an even number')

    const recipes = await this.recipeService.list({
      viewerUser: user,
      nameSearchQuery,
      page,
      size: size / 2,
      sortByMostPopular: true,
      showMyRecipes: true,
    })
    const foods = await this.foodService.list({
      nameSearchQuery,
      page,
      size: size / 2,
    })

    /**
     * Create default meal items from food and recipes
     * and merge them into a single array
     *
     * Sort the array so that the must relevant
     * items are on the top
     * */
    const mealItems = levenSort([
      ...foods.foods.map(i => ({
        id: i.id,
        name: i.name[0].text,
      })),
      ...recipes.recipes.map(i => ({
        id: i.id,
        name: i.title[0].text,
      })),
    ], nameSearchQuery, 'name')
      .map((i: any) => [
        ...foods.foods,
        ...recipes.recipes,
      ].find(p => p.id === i.id)!)
      .map(createDefaultMealItem)

    return {
      items: mealItems,
      pagination: createPagination(
        page,
        size,
        recipes.pagination.totalCount! + foods.pagination.totalCount!,
      )
    }
  }

  async move(planId: ObjectId, dayId: ObjectId, fromUserMealId: string, toUserMealId: string, insertAt: number, mealItemId: ObjectId, userId: string): Promise<boolean> {
    const day = await this.calendarService.get(dayId, planId, userId)

    let movedMealItem: undefined | MealItem = undefined

    day.meals = day.meals.map(meal => {
      if (meal.userMeal && (meal.userMeal.id === fromUserMealId)) {
        return {
          ...meal,
          items: meal.items.filter(p => {
            if (String(p.id) !== String(mealItemId)) {
              return true
            } else {
              movedMealItem = p
              return false
            }
          })
        }
      }

      return meal
    })

    if (!movedMealItem) throw new Errors.NotFound('Meal Item not found')

    day.meals = day.meals.map(meal => {
      if (meal.userMeal && (meal.userMeal.id === toUserMealId)) {
        const items = meal.items
        items.splice(insertAt, 0, movedMealItem!)
        return {
          ...meal,
          items
        }
      }

      return meal
    })

    day.markModified('meals')
    await day.save()

    return true
  }
}
