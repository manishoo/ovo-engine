import { Ingredient } from "@Types/recipe"
import { Nutrition, Food } from "@Types/food"
import { Weight } from "@Types/weight"


export function calculateTotalNutrition(ingredients: Ingredient[]): Nutrition {

  let totalNutrition: Partial<Nutrition> = {}

  ingredients.map(item => {
    if (item.food) {
      let food = item.food as Food
      if (food.nutrition.calories) {
        let cal
        if (food.nutrition.calories.unit == 'Kj') {
          cal = food.nutrition.calories.amount * 239
        } else {
          cal = food.nutrition.calories.amount
        }
        let gramPerWeight = 0
        let weight = item.weight as Weight
        if (!item.weight && item.gramWeight) {
          gramPerWeight = item.gramWeight
        } else {
          gramPerWeight = weight.gramWeight / weight.amount
        }
        let baseCal = 0
        if (totalNutrition.calories) {
          baseCal = totalNutrition.calories.amount
        }
        totalNutrition.calories = {
          amount: baseCal + Math.round((cal / 100) * item.amount * gramPerWeight),
          unit: 'Kcal',
        }
      }

      if (food.nutrition.proteins) {
        let protein = 0
        if (totalNutrition.proteins) {
          protein = totalNutrition.proteins.amount
        }
        totalNutrition.proteins = {
          amount: protein + (food.nutrition.proteins.amount / 100 * item.amount),
          unit: 'g'
        }
      }

      if (food.nutrition.carbs) {
        let carbs = 0
        if (totalNutrition.carbs) {
          carbs = totalNutrition.carbs.amount
        }
        totalNutrition.carbs = {
          amount: carbs + (food.nutrition.carbs.amount / 100 * item.amount),
          unit: 'g'
        }
      }
    }
  })

  return totalNutrition
}