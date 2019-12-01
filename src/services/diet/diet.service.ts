/*
 * diet.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DietModel } from '@Models/diet.model'
import { FoodClassModel } from '@Models/food-class.model'
import { ObjectId } from '@Types/common'
import { Diet, DietInput, ListDietArgs } from '@Types/diet'
import { ContextUser } from '@Utils/context'
import { DeleteBy } from '@Utils/delete-by'
import Errors from '@Utils/errors'
import { Service } from 'typedi'
import validateFoodClasses from './utils/validate-food-classes'
import validateFoodGroups from './utils/validate-food-groups'


@Service()
export default class DietService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async create(diet: DietInput): Promise<Diet> {
    let checkExistence = await DietModel.findOne({ slug: diet.slug.toLowerCase() })
    if (checkExistence) throw new Errors.Validation('Diet already exists')

    await validateFoodClasses(diet.foodClassIncludes)
    await validateFoodGroups(diet.foodGroupIncludes)

    return DietModel.create({
      name: diet.name,
      slug: diet.slug.toLowerCase(),
      foodClassIncludes: diet.foodClassIncludes,
      foodGroupIncludes: diet.foodGroupIncludes,
    })
  }

  async get(dietId: ObjectId) {
    let diet = await DietModel.findById(dietId)
    if (!diet) throw new Errors.NotFound('Diet not found')

    return diet
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

  async delete(dietId: ObjectId, operator: ContextUser): Promise<ObjectId> {
    let diet = await DietModel.findById(dietId)
    if (!diet) throw new Errors.NotFound('Diet not found')

    const deleted = await diet.delete(DeleteBy.user(operator))
    if (!deleted) throw new Errors.System('Something went wrong')

    return diet.id
  }

  async update(dietId: ObjectId, dietInput: DietInput) {
    let diet = await DietModel.findById(dietId)
    if (!diet) throw new Errors.NotFound('Diet not found')

    let validateSlug = DietModel.findOne({ slug: dietInput.slug.toLowerCase() })
    if (validateSlug) throw new Errors.Validation('Diet already exists')

    await validateFoodClasses(dietInput.foodClassIncludes)
    await validateFoodGroups(dietInput.foodGroupIncludes)

    diet.name = dietInput.name
    diet.slug = dietInput.slug.toLowerCase()
    diet.foodClassIncludes = dietInput.foodClassIncludes
    diet.foodGroupIncludes = dietInput.foodGroupIncludes

    return diet.save()

  }

  async getFoodClassIdsFromDiets(diets: Diet[]): Promise<ObjectId[]> {
    const allFoodGroupIncludes: ObjectId[] = []
    const allFoodClassIncludes: ObjectId[] = []

    diets.map(diet => {
      allFoodGroupIncludes.push(...diet.foodGroupIncludes)
      allFoodClassIncludes.push(...diet.foodClassIncludes)
    })

    const foodClasses = await FoodClassModel.find({
      _id: { $in: allFoodClassIncludes },
      'foodGroups.0.id': { $in: allFoodGroupIncludes }
    }).select('_id').exec()

    return foodClasses.map(fc => fc._id)
  }
}
