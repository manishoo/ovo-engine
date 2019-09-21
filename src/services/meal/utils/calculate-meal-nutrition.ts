import { MealItem } from "@Types/meal"
import { Nutrition, Food, NutrientUnit } from "@Types/food"
import { Recipe } from "@Types/recipe"


export function calculateMealNutrition(items: MealItem[]): Nutrition {
  let totalNutrition: Partial<Nutrition> = {}

  items.map(mealItem => {

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
      if (mealItem.recipe) {
        let recipe = mealItem.recipe as Recipe
        if (recipe.nutrition && recipe.nutrition[fieldName]) {

          totalNutrition[fieldName] = {
            amount: baseNutritionAmount(totalNutrition[fieldName]) + recipe.nutrition[fieldName]!.amount * mealItem.amount,
            unit: recipe.nutrition[fieldName]!.unit,
          }
        }
      } else {
        let food = mealItem.food as Food
        if (food.nutrition && food.nutrition[fieldName]) {

          totalNutrition[fieldName] = {
            amount: baseNutritionAmount(totalNutrition[fieldName]) + (food.nutrition[fieldName]!.amount / 100 * mealItem.amount),
            unit: food.nutrition[fieldName]!.unit,
          }
        }
      }
    }

    function calculateFoodCalories() {

      if (mealItem.recipe) {
        let recipe = mealItem.recipe as Recipe

        if (recipe.nutrition && recipe.nutrition.calories) {

          totalNutrition.calories = {
            amount: baseNutritionAmount(totalNutrition.calories) + convertCalorie(recipe.nutrition.calories) * mealItem.amount,
            unit: 'kcal',
          }
        }
      } else {
        let food = mealItem.food as Food

        if (food.nutrition && food.nutrition.calories) {

          totalNutrition.calories = {
            amount: baseNutritionAmount(totalNutrition.calories) + (convertCalorie(food.nutrition.calories) / 100 * mealItem.amount * food.weights.find(w => w.id == mealItem.weight)!.gramWeight),
            unit: 'kcal'
          }
        }
      }
    }

    let rf
    mealItem.recipe ? rf = mealItem.recipe as Recipe : rf = mealItem.food as Food
    Object.keys(rf!.nutrition!).map(nutritionName => calc(nutritionName))

    calculateFoodCalories()
  })

  return totalNutrition
}
