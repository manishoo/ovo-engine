/*
 * meal-items.validator.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { Food } from '@Types/food'
import { Ingredient, IngredientInput } from '@Types/ingredient'
import { MealItem, MealItemInput } from '@Types/meal'
import { Recipe } from '@Types/recipe'
import Errors from '@Utils/errors'


export default function populateIngredients(mealInputItems: (MealItemInput | IngredientInput)[], getFood: (foodId: ObjectId) => Promise<Food>, getRecipe: (recipeId: ObjectId) => Promise<Recipe>): Promise<(MealItem | Ingredient)[]> {
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
      customUnit: mealItemInput.customUnit,
      description: mealItemInput.description,
      name: mealItemInput.name,
    }

    /**
     * Check and set the alternative meal items
     * */
    if ('alternativeMealItems' in mealItemInput) {
      const mealItems = await populateIngredients(mealItemInput.alternativeMealItems as MealItemInput[], getFood, getRecipe)
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
      const food = await getFood(mealItemInput.food)
      if (!food) throw new Errors.NotFound('food not found')

      /**
       * Check and select the unit: part 2
       * */
      if (mealItemInput.unit && ObjectId.isValid(mealItemInput.unit)) {
        const foundWeight = food.weights.find(w => w.id!.toString() == mealItemInput.unit)
        if (!foundWeight) throw new Errors.Validation('Unit is not valid')

        baseMealItem.unit = foundWeight
      }

      return {
        ...baseMealItem,
        item: {
          ...food,
          id: String(food._id),
        },
      } as MealItem
    } else if (mealItemInput.recipe) {
      const recipe = await getRecipe(mealItemInput.recipe)
      if (!recipe) throw new Errors.NotFound('recipe not found')

      return {
        ...baseMealItem,
        item: {
          ...recipe,
          id: String(recipe._id),
        },
      } as MealItem
    }

    throw new Errors.System('No food or recipe')
  }))
}
