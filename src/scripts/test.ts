/*
 * test.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import { OperatorModel } from '@Models/operator.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'


async function main() {
  const foods = await FoodModel.find()
  const foodClasses = await FoodClassModel.find()
  const users = await UserModel.find()
  const operators = await OperatorModel.find()
  const recipes = await RecipeModel.find()

  console.log('await Promise.all(foods.map(async (food, index) => {')
  await Promise.all(foods.map(async (food, index) => {
    // @ts-ignore
    food.image = food.toObject().imageUrl
    // @ts-ignore
    food.thumbnail = food.toObject().thumbnailUrl
    return food.save()
  }))

  console.log('await Promise.all(foodClasses.map(async (food, index) => {')
  await Promise.all(foodClasses.map(async (food, index) => {
    // @ts-ignore
    food.image = food.toObject().imageUrl
    // @ts-ignore
    food.thumbnail = food.toObject().thumbnailUrl

    return food.save()
  }))

  console.log('await Promise.all(users.map(async (user, index) => {')
  await Promise.all(users.map(async (user, index) => {
    // @ts-ignore
    user.password = user.toObject().persistedPassword
    // @ts-ignore
    user.avatar = user.toObject().imageUrl
    return user.save()
  }))

  console.log('await Promise.all(operators.map(async (operator, index) => {')
  await Promise.all(operators.map(async (operator, index) => {
    // @ts-ignore
    operator.password = user.toObject().persistedPassword
    return operator.save()
  }))


  console.log('await Promise.all(recipes.map(async (recipe, index) => {')
  await Promise.all(recipes.map(async (recipe, index) => {
    // @ts-ignore
    recipe.image = recipe.coverImage
    return recipe.save()
  }))
}

main()
  .then(() => console.log('DONE'))
