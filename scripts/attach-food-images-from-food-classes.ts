/*
 * attach-food-images-from-food-classes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '../src/models/food-class.model'
import { FoodModel } from '../src/models/food.model'


async function main() {
  const foodClasses = await FoodClassModel.find()

  await Promise.all(foodClasses.map(async fc => {
    const foods = await FoodModel.find({ foodClass: fc._id })

    await Promise.all(foods.map(async food => {
      food.imageUrl = {
        source: 'sameAsFoodClass',
        url: `http://foodb.ca/system/foods/pictures/${fc.origId}/full/${fc.origId}.png`
      }
      food.thumbnailUrl = {
        source: 'sameAsFoodClass',
        url: `http://foodb.ca/system/foods/pictures/${fc.origId}/thumb/${fc.origId}.png`
      }

      return food.save()
    }))
  }))
}

main()
  .then(() => process.exit(0))
