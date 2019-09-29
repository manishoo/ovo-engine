import { Food, Nutrition } from '@Types/food'
import { MealItemBase } from '@Types/meal'
import { Recipe } from '@Types/recipe'
import { calculateNutrition, scaleFoodNutrition, scaleRecipeNutrition } from '@Utils/calculate-nutrition'


export function calculateMealNutrition(items: MealItemBase[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  /**
   * Iterate meal items and calculate their nutrition
   * and add to {totalNutrition}
   * */
  items.map(mealItem => {
    if (mealItem.recipe) {
      const recipe = mealItem.recipe as Recipe
      if (recipe.nutrition) {
        calculateNutrition(scaleRecipeNutrition(recipe, mealItem.amount), totalNutrition)
      }
    } else if (mealItem.food) {
      const food = mealItem.food as Food
      if (food.nutrition) {
        calculateNutrition(scaleFoodNutrition(food, mealItem.amount, mealItem.weight as string), totalNutrition)
      }
    }
  })

  return totalNutrition
}
