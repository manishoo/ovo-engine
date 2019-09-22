import { Nutrition } from '@Types/food'
import { Ingredient } from '@Types/recipe'
import { calculateNutrition, scaleFoodNutrition } from '@Utils/calculate-nutrition'


export function calculateRecipeNutrition(ingredients: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(ingredient => {
    if (!ingredient.amount || !ingredient.food) return

    let weightId
    if (ingredient.weight) {
      weightId = ingredient.weight.toString()
    }
    calculateNutrition(scaleFoodNutrition(ingredient.food, ingredient.amount, weightId, ingredient.gramWeight), totalNutrition)
  })

  return totalNutrition
}
