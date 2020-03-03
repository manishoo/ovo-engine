/*
 * tst1.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'


export default async function main() {
  const foodClasses = await FoodClassModel.find()

  await Promise.all(foodClasses.map(async fc => {
    const foods = await FoodModel.find({ foodClass: fc._id })

    await Promise.all(foods.map(async food => {
      food.origFoodClassSlug = fc.slug
      return food.save()
    }))
  }))
}


main()
.then(() => console.log('done'))
