/*
 * food.datasource.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import config from '@Config'
import { ObjectId } from '@Types/common'
import { Food } from '@Types/food'
import { Context } from '@Utils/context'
import Errors from '@Utils/errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Service } from 'typedi'


@Service()
export default class FoodDataSource extends MongoDataSource<Food, Context> {
  async get(foodId: ObjectId): Promise<Food> {
    let food = await this.findOneById(foodId, { ttl: config.cacheTTL })
    if (!food) throw new Errors.NotFound(`Food not found ${foodId}`)

    return {
      ...food,
      id: String(food._id),
    }
  }
}
