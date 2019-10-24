/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserModel } from '@Models/user.model'
import { NutritionProfile } from '@Types/user'
import Errors from '@Utils/errors'
import { Service } from 'typedi'

@Service()
export default class UserService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async getUserNutritionProfile(userId: string): Promise<NutritionProfile> {
    const user = await UserModel.findById(userId)

    if (!user) throw new Errors.NotFound('User not found')

    return user.nutritionProfile
  }
}
