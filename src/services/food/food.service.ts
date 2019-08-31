/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import { Food, FoodInput, FoodsListResponse } from '@Types/food'
import { WeightInput } from '@Types/weight'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { createPagination } from '@Utils/generate-pagination'


@Service()
export default class FoodService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async listFoods(page: number, size: number, foodClassID?: string): Promise<FoodsListResponse> {
    let query: any = {}
    if (foodClassID) {
      query['foodClass'] = new mongoose.Types.ObjectId(foodClassID)
    }

    const foods = await FoodModel.find(query)
      .limit(size)
      .skip(size * (page - 1))

    const counts = await FoodModel.countDocuments(query)

    return {
      foods,
      pagination: createPagination(page, size, counts),
    }
  }

  async updateFood(foodId: string, inputFood: FoodInput): Promise<Food | null> {
    if (!mongoose.Types.ObjectId.isValid(foodId)) throw new Errors.UserInput('invalid food ID', { 'foodID': 'invalid food ID' })

    const food = await FoodModel.findById(foodId)
    if (!food) throw new Errors.NotFound('food not found')

    let weights: WeightInput[] = []
    inputFood.weights.map(weight => {
      if (weight.id) {
        weights.push(weight)
      } else {
        weight['id'] = String(new mongoose.Types.ObjectId())
        weights.push(weight)
      }
    })

    food.name = inputFood.name
    food.weights = weights

    return food.save()
  }

  async deleteFood(foodID: string): Promise<Food> {
    if (!mongoose.Types.ObjectId.isValid(foodID)) throw new Errors.UserInput('invalid food ID', { 'foodID': 'invalid food ID' })

    const food = await FoodModel.findByIdAndDelete(foodID)
    if (!food) throw new Errors.NotFound('food not found')

    return food
  }

  async createFood(foodClassID: string, food: FoodInput): Promise<Food> {
    if (!mongoose.Types.ObjectId.isValid(foodClassID)) throw new Errors.UserInput('invalid food class id', { 'foodClassId': 'invalid food class id' })

    const foodClass = await FoodClassModel.findById(foodClassID)
    if (!foodClass) throw new Errors.NotFound('food class not found')

    let weights: WeightInput[] = []
    food.weights.map(weight => {
      weight['id'] = String(new mongoose.Types.ObjectId())
      weights.push(weight)
    })
    const foodInput = new FoodModel({
      name: food.name,
      weights,
      description: food.description,
      foodClass: foodClass._id,
      nutrition: food.nutrition,
    })

    return foodInput.save()
  }

}
