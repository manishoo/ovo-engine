import { DishItem } from "@Types/dish"
import { Nutrition, Food } from "@Types/food"
import { Recipe, RecipeInput } from "@Types/recipe"


export function calculateDishNutrition(items: DishItem[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  items.map(dishItem => {

    function calc(fieldName: string) {
      if (dishItem.recipe) {
        let recipe = dishItem.recipe as Recipe
        if (recipe.nutrition && recipe.nutrition[fieldName]) {
          let baseNut = 0
          if (totalNutrition[fieldName]) {
            baseNut = totalNutrition[fieldName]!.amount
          }
          totalNutrition[fieldName] = {
            amount: baseNut + recipe.nutrition[fieldName]!.amount * dishItem.amount,
            unit: recipe.nutrition[fieldName]!.unit,
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
            unit: food.nutrition[fieldName]!.unit,
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

    let rf
    dishItem.recipe ? rf = dishItem.recipe as Recipe : rf = dishItem.food as Food
    Object.keys(rf!.nutrition!).map(nutritionName => calc(nutritionName))

    calculateCalories()

  })

  return totalNutrition
}

