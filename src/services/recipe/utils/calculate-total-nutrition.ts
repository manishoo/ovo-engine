import { Food, Nutrition } from '@Types/food'
import { Ingredient } from '@Types/recipe'
import { Weight } from '@Types/weight'


export function calculateTotalNutrition(ingredients: Ingredient[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(ingredient => {
    if (!ingredient.amount) return

    function calc(food: Food, fieldName: string) {
      if (food.nutrition[fieldName]) {
        let baseNutritionAmount = 0
        if (totalNutrition[fieldName]) {
          baseNutritionAmount = totalNutrition[fieldName]!.amount
        }

        totalNutrition[fieldName] = {
          amount: baseNutritionAmount + (food.nutrition[fieldName]!.amount / 100 * ingredient.amount!),
          unit: food.nutrition[fieldName]!.unit
        }
      }
    }

    if (ingredient.food) {
      let food = ingredient.food as Food

      Object.keys(food.nutrition).map(nutritionKey => calc(food, nutritionKey))

      if (food.nutrition.calories) {
        let cal

        /**
         * Convert kj to kcal
         * */
        if (food.nutrition.calories.unit == 'kJ') {
          cal = food.nutrition.calories.amount * 239
        } else {
          cal = food.nutrition.calories.amount
        }

        /**
         * If custom gramWeight was provided, use it, otherwise use
         * weight.gramWeight
         * */
        let gramPerWeight = 0
        let weight = ingredient.weight as Weight
        if (!ingredient.weight && ingredient.gramWeight) {
          gramPerWeight = ingredient.gramWeight
        } else {
          gramPerWeight = weight.gramWeight / weight.amount
        }

        let baseCal = 0
        if (totalNutrition.calories) {
          baseCal = totalNutrition.calories.amount
        }
        totalNutrition.calories = {
          amount: baseCal + Math.round((cal / 100) * ingredient.amount * gramPerWeight),
          unit: 'kcal',
        }
      }
    }
  })

  return totalNutrition
}
