/*
 * weight.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { ObjectId } from '@Types/common'
import { Weight, WeightInput } from '@Types/weight'
import Errors from '@Utils/errors'
import { Service } from 'typedi'


@Service()
export default class WeightService {
  async create(foodId: ObjectId, weightInput: WeightInput): Promise<Weight> {
    const weight: Weight = {
      ...weightInput,
      id: new ObjectId(),
    }

    const food = await FoodModel.findById(foodId)
    if (!food) throw new Errors.NotFound('food not found')

    food.weights = [
      ...food.weights,
      weight
    ]

    await food.save()

    return weight
  }
}
