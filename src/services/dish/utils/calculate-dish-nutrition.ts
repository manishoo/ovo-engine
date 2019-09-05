import { DishItem } from "@Types/dish"
import { Nutrition, Food } from "@Types/food"
import { Recipe } from "@Types/recipe"


export function calculateDishNutrition(items: DishItem[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  items.map(dishItem => {

    function calc(fieldName: string, unit: string) {
      if (dishItem.recipe) {
        let recipe = dishItem.recipe as Recipe
        if (recipe.nutrition && recipe.nutrition[fieldName]) {
          let baseNut = 0
          if (totalNutrition[fieldName]) {
            baseNut = totalNutrition[fieldName]!.amount
          }
          totalNutrition[fieldName] = {
            amount: baseNut + recipe.nutrition[fieldName]!.amount * dishItem.amount,
            unit: unit,
          }
        }
      } else {
        let food = dishItem.food as Food
        if (food.nutrition && food.nutrition[fieldName]) {
          let baseNut = 0
          if (totalNutrition[fieldName]) {
            baseNut = totalNutrition[fieldName]!.amount
          }
          totalNutrition[fieldName] = {
            amount: baseNut + (food.nutrition[fieldName]!.amount / 100 * dishItem.amount),
            unit: unit,
          }
        }
      }
    }

    function calculateCalories() {
      if (dishItem.recipe) {

        let recipe = dishItem.recipe as Recipe

        if (recipe.nutrition && recipe.nutrition.calories) {
          let baseCal = 0
          if (totalNutrition.calories) {
            baseCal = totalNutrition.calories.amount
          }
          totalNutrition.calories = {
            amount: baseCal + recipe.nutrition.calories.amount * dishItem.amount,
            unit: 'kcal',
          }
        }
      } else {

        let food = dishItem.food as Food

        if (food.nutrition && food.nutrition.calories) {
          let baseCal = 0
          if (totalNutrition.calories) {
            baseCal = totalNutrition.calories.amount
          }
          totalNutrition.calories = {
            amount: baseCal + (food.nutrition.calories.amount / 100 * dishItem.amount * food.weights.find(w => w.id == dishItem.weight)!.gramWeight),
            unit: 'kcal'
          }
        }
      }
    }

    calc('proteins', 'g')
    calc('carbs', 'g')
    calc('sodium', 'mg')
    calculateCalories()

  })

  return totalNutrition
}

