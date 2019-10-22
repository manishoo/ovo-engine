/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import UploadService from '@Services/upload/upload.service'
import { ObjectId } from '@Types/common'
import { Food, FoodInput, FoodListArgs, FoodsListResponse } from '@Types/food'
import { WeightInput } from '@Types/weight'
import { ContextUser } from '@Utils/context'
import { DeleteBy } from '@Utils/delete-by'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import { Service } from 'typedi'


@Service()
export default class FoodService {
  constructor(
    // service injection
    private readonly uploadService: UploadService
  ) {
    // noop
  }

  async getFood(foodId: string) {
    return FoodModel.findById(foodId)
      .populate({
        path: 'foodClass',
        model: FoodClassModel,
      })
      .exec()
  }

  async listFoods({ page, size, foodClassId, nameSearchQuery }: FoodListArgs): Promise<FoodsListResponse> {
    let query: any = {}
    if (foodClassId) {
      query['foodClass'] = new ObjectId(foodClassId)
    }
    if (nameSearchQuery) {
      query['$or'] = [
        {
          $text: {
            $search: nameSearchQuery,
          }
        },
        {
          'name.text': {
            $regex: nameSearchQuery,
            $options: 'i',
          }
        }
      ]
    }

    const foods = await FoodModel.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(size)
      .skip(size * (page - 1))

    const counts = await FoodModel.countDocuments(query)

    return {
      foods,
      pagination: createPagination(page, size, counts),
    }
  }

  async updateFood(foodId: string, foodInput: FoodInput): Promise<Food | null> {
    if (!ObjectId.isValid(foodId)) throw new Errors.UserInput('invalid food ID', { 'foodID': 'invalid food ID' })

    const food = await FoodModel.findById(foodId)
    if (!food) throw new Errors.NotFound('food not found')

    let weights: WeightInput[] = []
    foodInput.weights.map(weight => {
      if (weight.id) {
        weights.push(weight)
      } else {
        weight['id'] = String(new ObjectId())
        weights.push(weight)
      }
    })

    if (foodInput.image) {
      food.image = {
        url: await this.uploadService.processUpload(foodInput.image, 'full', `images/foods/${food.id}`)
      }
      if (!foodInput.thumbnail) {
        food.thumbnail = {
          url: await this.uploadService.processUpload(foodInput.image, 'thumb', `images/foods/${food.id}`)
        }
      }
    }

    if (foodInput.thumbnail) {
      food.thumbnail = {
        url: await this.uploadService.processUpload(foodInput.thumbnail, 'thumb', `images/foods/${food.id}`)
      }
    }

    food.name = foodInput.name
    food.description = foodInput.description
    food.weights = weights

    if (foodInput.nutrition) {
      food.nutrition = {
        ...foodInput.nutrition
      }
    }

    return food.save()
  }

  async deleteFood(foodID: string, user: ContextUser): Promise<Food> {
    if (!ObjectId.isValid(foodID)) throw new Errors.UserInput('invalid food ID', { 'foodID': 'invalid food ID' })

    const food = await FoodModel.findById(foodID)
    if (!food) throw new Errors.NotFound('food not found')

    await food.delete(DeleteBy.user(user))

    return food
  }

  async createFood(foodClassID: string, foodInput: FoodInput): Promise<Food> {
    if (!ObjectId.isValid(foodClassID)) throw new Errors.UserInput('invalid food class id', { 'foodClassId': 'invalid food class id' })

    const foodClass = await FoodClassModel.findById(foodClassID)
    if (!foodClass) throw new Errors.NotFound('food class not found')

    let weights: WeightInput[] = []
    foodInput.weights.map(weight => {
      weight['id'] = String(new ObjectId())
      weights.push(weight)
    })

    const food = new FoodModel({
      name: foodInput.name,
      weights,
      description: foodInput.description,
      foodClass: foodClass._id,
      origFoodClassName: foodClass.name,
      origFoodGroups: foodClass.foodGroups,
      nutrition: foodInput.nutrition,
    } as Partial<Food>)

    if (foodInput.image) {
      food.image = {
        url: await this.uploadService.processUpload(foodInput.image, 'full', `images/foods/${food.id}`)
      }
      if (!foodInput.thumbnail) {
        food.thumbnail = {
          url: await this.uploadService.processUpload(foodInput.image, 'thumb', `images/foods/${food.id}`)
        }
      }
    }

    if (foodInput.thumbnail) {
      food.thumbnail = {
        url: await this.uploadService.processUpload(foodInput.thumbnail, 'thumb', `images/foods/${food.id}`)
      }
    }

    if (foodInput.nutrition) {
      food.nutrition = {
        ...foodInput.nutrition
      }
    }

    return food.save()
  }

}
