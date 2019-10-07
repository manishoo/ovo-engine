/*
 * attach-food-images-from-food-classes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'


export default async function main() {
  const foodClasses = await FoodClassModel.find()

  await Promise.all(foodClasses.map(async fc => {
    const foods = await FoodModel.find({ foodClass: fc._id })

    await Promise.all(foods.map(async food => {
      if (fc.image) {
        food.image = {
          source: 'sameAsFoodClass',
          url: fc.image.url
        }
      }

      if (fc.thumbnail) {
        food.thumbnail = {
          source: 'sameAsFoodClass',
          url: fc.thumbnail.url
        }
      }

      return food.save()
    }))
  }))
}

