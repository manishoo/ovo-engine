/*
 * diet.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { DietInput, Diet } from '@Types/diet'
import { FoodClassModel } from '@Models/food-class.model'
import Errors from '@Utils/errors'
import { FoodGroupModel } from '@Models/food-group.model'
import { DietModel } from '@Models/diet.model'


@Service()
export default class DietService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async create(diet: DietInput): Promise<Diet> {
    let checkExistance = await DietModel.findOne({ slug: diet.slug })
    if (checkExistance) throw new Errors.Validation('Diet already exists')

    let foodClassIds = await Promise.all(diet.foodClassIncludes.map(async foodClassId => {

      let foodClass = await FoodClassModel.findById(foodClassId)
      if (!foodClass) throw new Errors.NotFound('Food class not found')

      return foodClass._id
    }))

    let foodGroupIds = await Promise.all(diet.foodGroupIncludes.map(async foodGroupId => {

      let foodGroup = await FoodGroupModel.findById(foodGroupId)
      if (!foodGroup) throw new Errors.NotFound('Food group not found')

      return foodGroup._id
    }))

    return DietModel.create({
      name: diet.name,
      slug: diet.slug,
      foodClassIncludes: foodClassIds,
      foodGroupIncludes: foodGroupIds,
    })
  }
}
