/*
 * food-class.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
import { FoodModel } from '@Models/food.model'
import UploadService from '@Services/upload/upload.service'
import { FoodClass, FoodClassInput, FoodClassListResponse, ListFoodClassesArgs } from '@Types/food-class'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { createPagination } from '@Utils/generate-pagination'


@Service()
export default class FoodClassService {
  constructor(
    // service injection
    private readonly uploadService: UploadService
  ) {
    // noop
  }

  async listFoodClasses({ page, size, foodGroupId, nameSearchQuery, verified }: ListFoodClassesArgs): Promise<FoodClassListResponse> {
    let query: any = {}

    if (foodGroupId) {
      query['foodGroup._id'] = {
        /**
         * Search group and subgroups
         * */
        $in: [mongoose.Types.ObjectId(foodGroupId), ...(await FoodGroupModel.find({ parentFoodGroup: foodGroupId }))]
      }
    }

    if (nameSearchQuery) {
      let reg = new RegExp(nameSearchQuery)
      query['name.text'] = { $regex: reg, $options: 'i' }
    }

    if (typeof verified === 'boolean') {
      const aggregations: any[] = []
      if (verified) {
        query['name'] = {
          $not: {
            $elemMatch: {
              verified: !verified,
            }
          }
        }
        aggregations.push(
          {
            $project: {
              foodClass: '$foodClass',
              isNameVerified: { $allElementsTrue: ['$name.verified'] },
              isWeightsVerified: {
                $cond: {
                  if: { $gt: [{ $size: '$weights' }, 0] },
                  then: { $allElementsTrue: ['$weights.name.verified'] },
                  else: true,
                }
              },
            },
          },
          {
            $match: {
              isNameVerified: true,
              isWeightsVerified: true,
            }
          },
        )
      } else {
        query['name.verified'] = !verified
        aggregations.push({
          $match: {
            $or: [
              { 'name.verified': { $ne: true } },
              { 'weights.name.title.verified': { $ne: true } },
            ]
          }
        })
      }

      const foodClasses = await FoodModel.aggregate([
        ...aggregations,
        {
          $group: {
            _id: '$foodClass',
          }
        },
        {
          $skip: size * (page - 1),
        },
        {
          $limit: size,
        }
      ])

      query['_id'] = {
        $in: foodClasses.map(i => i._id)
      }
    }

    const counts = await FoodClassModel.countDocuments(query)

    if (page > Math.ceil(counts / size)) page = Math.ceil(counts / size)
    if (page < 1) page = 1

    const foodClasses = await FoodClassModel.find(query)
      .limit(size)
      .skip(size * (page - 1))

    return {
      foodClasses,
      pagination: createPagination(page, size, counts),
    }
  }

  async getFoodClass(foodClassID: string): Promise<FoodClass> {
    const foodClass = await FoodClassModel.findById(mongoose.Types.ObjectId(foodClassID))
    if (!foodClass) throw new Errors.NotFound('food class not found')

    return foodClass
  }

  async editFoodClass(foodClassID: string, foodClassInput: FoodClassInput): Promise<FoodClass> {
    const foodGroup = await FoodGroupModel.findOne({ _id: mongoose.Types.ObjectId(foodClassInput.foodGroupId) })
    if (!foodGroup) throw new Errors.NotFound('food group not found')

    const foodClass = await FoodClassModel.findById(foodClassID)
    if (!foodClass) throw new Errors.NotFound('food class not found')

    if (foodClassInput.imageUrl) {
      foodClass.imageUrl = {
        url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'full', `images/foods/${foodClassInput.slug}`)
      }
      if (!foodClassInput.thumbnailUrl) {
        foodClass.thumbnailUrl = {
          url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'thumb', `images/foods/${foodClassInput.slug}`)
        }
      }
    }

    if (foodClassInput.thumbnailUrl) {
      foodClass.thumbnailUrl = {
        url: await this.uploadService.processUpload(foodClassInput.thumbnailUrl, 'thumb', `images/foods/${foodClassInput.slug}`)
      }
    }

    foodClass.name = foodClassInput.name
    foodClass.foodGroup = foodGroup
    foodClass.description = foodClassInput.description
    foodClass.slug = foodClassInput.slug

    return foodClass.save()
  }

  async deleteFoodClass(foodClassID: string): Promise<String> {
    const foodClass = await FoodClassModel.findById(mongoose.Types.ObjectId(foodClassID))
    if (!foodClass) throw new Errors.NotFound('food class not found')

    const foodCount = await FoodModel.countDocuments({ foodClass: foodClass._id })
    if (foodCount !== 0) throw new Errors.Validation('This food class has food associated with it! It can\'t be removed')

    await foodClass.remove()

    return foodClass.id
  }

  async createFoodClass(foodClassInput: FoodClassInput): Promise<FoodClass> {
    if (!mongoose.Types.ObjectId.isValid(foodClassInput.foodGroupId)) throw new Errors.UserInput('invalid food group id', { 'foodGroupId': 'invalid food group id' })
    const foodGroup = await FoodGroupModel.findById(foodClassInput.foodGroupId)
    if (!foodGroup) throw new Errors.NotFound('food group not found')

    let foodClass = new FoodClassModel({
      ...foodClassInput,
      foodGroup,
    })

    if (foodClassInput.imageUrl) {
      foodClass.imageUrl = {
        url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'full', `images/foods/${foodClassInput.slug}`)
      }
      if (!foodClassInput.thumbnailUrl) {
        foodClass.thumbnailUrl = {
          url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'thumb', `images/foods/${foodClassInput.slug}`)
        }
      }
    }

    if (foodClassInput.thumbnailUrl) {
      foodClass.thumbnailUrl = {
        url: await this.uploadService.processUpload(foodClassInput.thumbnailUrl, 'thumb', `images/foods/${foodClassInput.slug}`)
      }
    }

    return foodClass.save()
  }
}
