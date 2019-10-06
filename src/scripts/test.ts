/*
 * test.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel as mongoFoodClassModel } from '@Models/food-class.model'
import { FoodGroupSchema } from '@Models/food-group.model'
import { FoodModel } from '@Models/food.model'


async function main() {
  const foods = await FoodModel.find()
  const foodClasses = await mongoFoodClassModel.find()

  return Promise.all(foods.map(async food => {
    const foodClass = foodClasses.find(i => String(i._id) === String(food.foodClass))
    if (!foodClass) throw new Error('food without foodclass!')

    food.origFoodClassName = foodClass.name
    food.foodGroup = foodClass.foodGroup as FoodGroupSchema
    return food.save()
  }))
}

main()
  .then(() => console.log('DONE'))
