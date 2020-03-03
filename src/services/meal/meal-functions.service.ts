// /*
//  * meal.service.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// import MealService from '@Services/meal/meal.service'
// import RecipeService from '@Services/recipe/recipe.service'
// import { Pagination } from '@Types/common'
// import { Food } from '@Types/food'
// import { Recipe } from '@Types/recipe'
// import { Service } from 'typedi'
//
//
// @Service()
// export default class MealFunctionsService {
//   constructor(
//     // service injection
//     private readonly mealService: MealService,
//     private readonly recipeService: RecipeService,
//   ) {
//     // noop
//   }
//
//   async updateMealsByIngredient(ingredient: Food | Recipe) {
//
//     let paginationCursor: Partial<Pagination> = {
//       page: 1,
//       hasNext: true,
//       size: 100,
//     }
//
//     while (paginationCursor.hasNext) {
//       const { meals, pagination } = await this.mealService.list({
//         ingredientId: ingredient._id,
//         size: paginationCursor.size,
//         page: paginationCursor.page
//       })
//
//       await Promise.all(meals.map(async meal => {
//         meal.items = meal.items.map(mealItem => {
//           if (mealItem.item && (mealItem.item.id === ingredient.id)) {
//             mealItem.item = ingredient
//           }
//
//           return mealItem
//         })
//         return meal.save()
//       }))
//
//       paginationCursor = pagination
//     }
//   }
// }
