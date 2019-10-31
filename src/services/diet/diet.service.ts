/*
 * diet.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { DietInput, Diet } from '@Types/diet'
import Errors from '@Utils/errors'
import { DietModel } from '@Models/diet.model'
import { ObjectId } from '@Types/common'
import { DeleteBy } from '@Utils/delete-by'
import { ContextUser } from '@Utils/context'
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
    let checkExistance = await DietModel.findOne({ slug: diet.slug.toLowerCase() })
    if (checkExistance) throw new Errors.Validation('Diet already exists')

    await validateFoodClasses(diet.foodClassIncludes)
    await validateFoodGroups(diet.foodGroupIncludes)

    return DietModel.create({
      name: diet.name,
      slug: diet.slug.toLowerCase(),
      foodClassIncludes: diet.foodClassIncludes,
      foodGroupIncludes: diet.foodGroupIncludes,
    })
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
}
