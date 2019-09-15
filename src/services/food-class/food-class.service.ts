/*
 * food-class.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
import { FoodModel } from '@Models/food.model'
import UploadService from '@Services/upload/upload.service'
import { LanguageCode, Translation } from '@Types/common'
import { FoodClass, FoodClassInput, FoodClassListResponse, ListFoodClassesArgs } from '@Types/food-class'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
// @ts-ignore
import levenSort from 'leven-sort'
import mongoose from 'mongoose'
import { Service } from 'typedi'


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

    if (verified || nameSearchQuery) {
      const aggregations: any[] = []

      if (nameSearchQuery) {
        aggregations.push({
          $match: {
            name: {
              $elemMatch: {
                text: {
                  $regex: nameSearchQuery,
                  $options: 'i',
                },
              }
            }
          }
        })
      }

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
      }

      const foodClasses = await FoodModel.aggregate([
        ...aggregations,
        {
          $group: {
            _id: '$foodClass',
          }
        }
      ])

      query['_id'] = {
        $in: foodClasses.map(i => i._id)
      }
    }

    let counts = await FoodClassModel.countDocuments(query)

    if (page > Math.ceil(counts / size)) page = Math.ceil(counts / size)
    if (page < 1) page = 1

    let foodClasses: FoodClass[] = []

    if (nameSearchQuery) {
      /**
       * Sort FoodClasses by how close their name is to {nameSearchQuery}
       * */
      const dbFoodClasses = await FoodClassModel.find(query)

      counts = dbFoodClasses.length
      const sortedArray = levenSort(dbFoodClasses.map(i => ({
        id: i._id,
        name: getEnTranslation(i.name),
      })), nameSearchQuery, 'name')
      foodClasses = sortedArray.map((i: any) => dbFoodClasses.find(a => a._id.toString() === i.id.toString()))
      foodClasses = foodClasses.slice((size) * (page - 1), ((size) * (page - 1)) + (size - 1))
    } else {
      foodClasses = await FoodClassModel.find(query)
        .limit(size)
        .skip(size * (page - 1))
    }

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

    let foodClassFullImagePath: string | undefined
    let foodClassThumbImagePath: string | undefined

    if (foodClassInput.imageUrl) {
      foodClassFullImagePath = await this.uploadService.processUpload(foodClassInput.imageUrl, 'full', `images/food-classes/${foodClassInput.slug}`)
      foodClass.imageUrl = {
        url: foodClassFullImagePath,
      }
      if (!foodClassInput.thumbnailUrl) {
        foodClassThumbImagePath = await this.uploadService.processUpload(foodClassInput.imageUrl, 'thumb', `images/food-classes/${foodClassInput.slug}`)
        foodClass.thumbnailUrl = {
          url: foodClassThumbImagePath
        }
      }
    }

    if (foodClassInput.thumbnailUrl) {
      if (!foodClassThumbImagePath) {
        foodClassThumbImagePath = await this.uploadService.processUpload(foodClassInput.thumbnailUrl, 'thumb', `images/food-classes/${foodClassInput.slug}`)
      }
      foodClass.thumbnailUrl = {
        url: foodClassThumbImagePath
      }
    }

    foodClass.name = foodClassInput.name
    foodClass.foodGroup = foodGroup
    foodClass.description = foodClassInput.description
    foodClass.slug = foodClassInput.slug
    foodClass.defaultFood = mongoose.Types.ObjectId(foodClassInput.defaultFood)

    const savedFoodClass = await foodClass.save()

    /**
     * Replace the images of this food class' relative foods
     * with the uploaded image if any
     * */
    if (foodClassInput.imageUrl) {
      const foodClassFoods = await FoodModel.find({foodClass: savedFoodClass._id})

      Promise.all(foodClassFoods.map(async food => {
        if (food.thumbnailUrl && food.thumbnailUrl.source === 'sameAsFoodClass' && foodClassThumbImagePath) {
          food.thumbnailUrl = {
            source: 'sameAsFoodClass',
            url: foodClassThumbImagePath,
          }
        }

        if (food.imageUrl && food.imageUrl.source === 'sameAsFoodClass' && foodClassFullImagePath) {
          food.imageUrl = {
            source: 'sameAsFoodClass',
            url: foodClassFullImagePath,
          }
        }

        await food.save()
      }))
    }

    return savedFoodClass
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
        url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'full', `images/food-classes/${foodClassInput.slug}`)
      }
      if (!foodClassInput.thumbnailUrl) {
        foodClass.thumbnailUrl = {
          url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'thumb', `images/food-classes/${foodClassInput.slug}`)
        }
      }
    }

    if (foodClassInput.thumbnailUrl) {
      foodClass.thumbnailUrl = {
        url: await this.uploadService.processUpload(foodClassInput.thumbnailUrl, 'thumb', `images/food-classes/${foodClassInput.slug}`)
      }
    }

    return foodClass.save()
  }
}

function getEnTranslation(tr: Translation[]) {
  if (tr.length === 0) return

  const enTr = tr.find(t => t.locale === LanguageCode.en)
  if (enTr) {
    return enTr.text
  }

  return
}
