// /*
//  * set-food-food-classes.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// import { FoodClassModel } from '@Models/food-class.model'
// import { FoodModel } from '@Models/food.model'
// import { MealModel } from '@Models/meal.model'
// import { OperatorModel } from '@Models/operator.model'
// import { RecipeModel } from '@Models/recipe.model'
// import { UserModel } from '@Models/user.model'
// import { ObjectId } from '@Types/common'
// import { Food } from '@Types/food'
// import { FoodClass } from '@Types/food-class'
// import { FoodGroup } from '@Types/food-group'
// import { Recipe } from '@Types/recipe'
//
//
// async function main() {
//   const foods = await FoodModel.find()
//   // const foodClasses = await FoodClassModel.find()
//   const meals = await MealModel.find()
//
//   await Promise.all(meals.map(async (meal, index) => {
//     meal.items = meal.items.map(mealItem => {
//       if (mealItem.food) {
//         const food = foods.find(f => String((mealItem.food as Food)._id) === String(f._id))!.toObject()
//         mealItem.food = {
//           id: String(food._id),
//           ...food
//         }
//       } else {
//         const recipe = mealItem.recipe as Recipe
//         (mealItem.recipe as Recipe).ingredients = recipe.ingredients.map(ingredient => {
//           const food = foods.find(f => String((ingredient.food as Food)._id) === String(f._id))!.toObject()
//           ingredient.food = {
//             id: String(food._id),
//             ...food
//           }
//
//           return ingredient
//         })
//       }
//
//       return mealItem
//     })
//
//     meal.markModified('items')
//
//     await meal.save()
//   }))
//
//   // await Promise.all(foods.map(async (food, index) => {
//   //   food.origFoodGroups = findFoodClass((food.foodClass as FoodClass)._id)
//   //
//   //   await food.save()
//   // }))
// }
//
// main()
//   .then(() => console.log('DONE'))
