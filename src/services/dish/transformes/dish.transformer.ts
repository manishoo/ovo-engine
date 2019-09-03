import { Dish } from "@Types/dish"
import { Food } from "@Types/food"


export function transformDish(dish: Dish) {

  dish.items.map(item => {
    if (item.food && item.weight) {
      let food = item.food as Food
      item.weight = food.weights.find(w => w.id == item.weight)
    }
  })

  return dish
}