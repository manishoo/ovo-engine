import { Meal } from "@Types/meal"
import { Food } from "@Types/food"


export function transformMeal(meal: Meal) {

  meal.items.map(item => {
    if (item.food && item.weight) {
      let food = item.food as Food
      item.weight = food.weights.find(w => w.id == item.weight)
    }
  })

  return meal
}
