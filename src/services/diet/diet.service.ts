/*
 * diet.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { DietInput, Diet, ListDietArgs } from '@Types/diet'
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

    const foodClasses = await FoodClassModel.find({ _id: { $in: diet.foodClassIncludes } })
    if (foodClasses.length !== diet.foodClassIncludes.length) throw new Errors.Validation('Invalid food class id')

    const foodGroups = await FoodGroupModel.find({ _id: { $in: diet.foodGroupIncludes } })
    if (foodGroups.length !== diet.foodGroupIncludes.length) throw new Errors.Validation('Invalid food group id')

    return DietModel.create({
      name: diet.name,
      slug: diet.slug,
      foodClassIncludes: diet.foodClassIncludes,
      foodGroupIncludes: diet.foodGroupIncludes,
    })
  }

  async list({ searchSlug, searchFoodClass, searchFoodGroup }: ListDietArgs): Promise<Diet[]> {
    let query: any = {}

    if (searchSlug) {
      query['slug'] = { $regex: searchSlug, $options: 'i' }
    }
    if (searchFoodClass) {
      query['foodClassIncludes'] = { $in: searchFoodClass }
    }
    if (searchFoodGroup) {
      query['foodGroupIncludes'] = { $in: searchFoodGroup }
    }
    return DietModel.find(query)
  }
}
