import { DishItem } from "@Types/dish"
import { Nutrition, Food, NutrientUnit } from "@Types/food"
import { Recipe } from "@Types/recipe"


export function calculateDishNutrition(items: DishItem[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  items.map(dishItem => {

    function baseNutritionAmount(totalNutritionFieldName: NutrientUnit | undefined): number {
      if (totalNutritionFieldName) {
        return totalNutritionFieldName.amount
      }
      return 0
    }

    function convertCalorie(cal: NutrientUnit): number {
      if (cal.unit == 'kJ') {
        return cal.amount * 239
      } else {
        return cal.amount
      }
    }

    function calc(fieldName: string) {
      if (dishItem.recipe) {
        let recipe = dishItem.recipe as Recipe
        if (recipe.nutrition && recipe.nutrition[fieldName]) {

          totalNutrition[fieldName] = {
            amount: baseNutritionAmount(totalNutrition[fieldName]) + recipe.nutrition[fieldName]!.amount * dishItem.amount,
            unit: recipe.nutrition[fieldName]!.unit,
          }
        }
      } else {
        let food = dishItem.food as Food
        if (food.nutrition && food.nutrition[fieldName]) {

          totalNutrition[fieldName] = {
            amount: baseNutritionAmount(totalNutrition[fieldName]) + (food.nutrition[fieldName]!.amount / 100 * dishItem.amount),
            unit: food.nutrition[fieldName]!.unit,
          }
        }
      }
    }

    function calculateFoodCalories() {

      if (dishItem.recipe) {
        let recipe = dishItem.recipe as Recipe

        if (recipe.nutrition && recipe.nutrition.calories) {

          totalNutrition.calories = {
            amount: baseNutritionAmount(totalNutrition.calories) + convertCalorie(recipe.nutrition.calories) * dishItem.amount,
            unit: 'kcal',
          }
        }
      } else {
        let food = dishItem.food as Food

        if (food.nutrition && food.nutrition.calories) {

          totalNutrition.calories = {
            amount: baseNutritionAmount(totalNutrition.calories) + (convertCalorie(food.nutrition.calories) / 100 * dishItem.amount * food.weights.find(w => w.id == dishItem.weight)!.gramWeight),
            unit: 'kcal'
          }
        }
      }
    }

    let rf
    dishItem.recipe ? rf = dishItem.recipe as Recipe : rf = dishItem.food as Food
    Object.keys(rf!.nutrition!).map(nutritionName => calc(nutritionName))

    calculateFoodCalories()
  })

  return totalNutrition
}
