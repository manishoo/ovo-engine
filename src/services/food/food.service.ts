/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import UploadService from '@Services/upload/upload.service'
import { Food, FoodInput, FoodListArgs, FoodsListResponse } from '@Types/food'
import { WeightInput } from '@Types/weight'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import mongoose from 'mongoose'
import { Service } from 'typedi'


@Service()
export default class FoodService {
  constructor(
    // service injection
    private readonly uploadService: UploadService
  ) {
    // noop
  }

  async listFoods({page, size, foodClassId, nameSearchQuery}: FoodListArgs): Promise<FoodsListResponse> {
    let query: any = {}
    if (foodClassId) {
      query['foodClass'] = new mongoose.Types.ObjectId(foodClassId)
    }
    if (nameSearchQuery) {
      query['name.text'] = {
        $regex: nameSearchQuery,
        $options: 'i',
      }
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

  async updateFood(foodId: string, foodInput: FoodInput): Promise<Food | null> {
    if (!mongoose.Types.ObjectId.isValid(foodId)) throw new Errors.UserInput('invalid food ID', { 'foodID': 'invalid food ID' })

    const food = await FoodModel.findById(foodId)
    if (!food) throw new Errors.NotFound('food not found')

    let weights: WeightInput[] = []
    foodInput.weights.map(weight => {
      if (weight.id) {
        weights.push(weight)
      } else {
        weight['id'] = String(new mongoose.Types.ObjectId())
        weights.push(weight)
      }
    })

    if (foodInput.imageUrl) {
      food.imageUrl = {
        url: await this.uploadService.processUpload(foodInput.imageUrl, 'full', `images/foods/${food.id}`)
      }
      if (!foodInput.thumbnailUrl) {
        food.thumbnailUrl = {
          url: await this.uploadService.processUpload(foodInput.imageUrl, 'thumb', `images/foods/${food.id}`)
        }
      }
    }

    if (foodInput.thumbnailUrl) {
      food.thumbnailUrl = {
        url: await this.uploadService.processUpload(foodInput.thumbnailUrl, 'thumb', `images/foods/${food.id}`)
      }
    }

    food.name = foodInput.name
    food.weights = weights

    if (foodInput.nutrition) {
      food.nutrition = foodInput.nutrition
    }

    return food.save()
  }

  async deleteFood(foodID: string): Promise<Food> {
    if (!mongoose.Types.ObjectId.isValid(foodID)) throw new Errors.UserInput('invalid food ID', { 'foodID': 'invalid food ID' })

    const food = await FoodModel.findByIdAndDelete(foodID)
    if (!food) throw new Errors.NotFound('food not found')

    return food
  }

  async createFood(foodClassID: string, foodInput: FoodInput): Promise<Food> {
    if (!mongoose.Types.ObjectId.isValid(foodClassID)) throw new Errors.UserInput('invalid food class id', { 'foodClassId': 'invalid food class id' })

    const foodClass = await FoodClassModel.findById(foodClassID)
    if (!foodClass) throw new Errors.NotFound('food class not found')

    let weights: WeightInput[] = []
    foodInput.weights.map(weight => {
      weight['id'] = String(new mongoose.Types.ObjectId())
      weights.push(weight)
    })

    const food = new FoodModel({
      name: foodInput.name,
      weights,
      description: foodInput.description,
      foodClass: foodClass._id,
      nutrition: foodInput.nutrition,
    })

    if (foodInput.imageUrl) {
      food.imageUrl = {
        url: await this.uploadService.processUpload(foodInput.imageUrl, 'full', `images/foods/${food.id}`)
      }
      if (!foodInput.thumbnailUrl) {
        food.thumbnailUrl = {
          url: await this.uploadService.processUpload(foodInput.imageUrl, 'thumb', `images/foods/${food.id}`)
        }
      }
    }

    if (foodInput.thumbnailUrl) {
      food.thumbnailUrl = {
        url: await this.uploadService.processUpload(foodInput.thumbnailUrl, 'thumb', `images/foods/${food.id}`)
      }
    }

    return food.save()
  }

}
