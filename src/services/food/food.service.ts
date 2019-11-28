/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import putDefaultFoodsOnTop from '@Services/food/utils/put-default-foods-on-top'
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

  async get(foodId: ObjectId) {
    let food = await FoodModel.findById(foodId)
    if (!food) throw new Errors.NotFound('Food not found')

    return food
  }

  async list({ page, size, foodClassId, nameSearchQuery, withDeleted }: FoodListArgs): Promise<FoodsListResponse> {
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

    let foods = []
    let count

    if (withDeleted) {
      foods = await FoodModel.findWithDeleted(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(size)
        .skip(size * (page - 1))
      count = await FoodModel.countWithDeleted(query)
    } else {
      foods = await FoodModel.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(size)
        .skip(size * (page - 1))
      count = await FoodModel.count(query)
    }

    return {
      foods: putDefaultFoodsOnTop(foods),
      pagination: createPagination(page, size, count),
    }
  }

  async update(foodId: ObjectId, foodInput: FoodInput): Promise<Food | null> {
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

    if (foodInput.foodClassId) {
      if (food.isDefault) throw new Error('The selected Food is the default food, please remove the default status and try again')
      food.foodClass = foodInput.foodClassId
    }

    return food.save()
  }

  async delete(foodID: ObjectId, user: ContextUser, restore?: boolean): Promise<Food> {
    const food = await FoodModel.findOneWithDeleted({ _id: foodID })
    if (!food) throw new Errors.NotFound('food not found')

    if (restore) {
      await food.restore()
    } else {
      await food.delete(DeleteBy.user(user))
    }

    return food
  }

  async create(foodClassID: ObjectId, foodInput: FoodInput): Promise<Food> {
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
