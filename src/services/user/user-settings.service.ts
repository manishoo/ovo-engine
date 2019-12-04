/*
 * user-settings.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserModel } from '@Models/user.model'
import { UserMeal, UserMealInput } from '@Types/user'
import Errors from '@Utils/errors'
import { Service } from 'typedi'


@Service()
export default class UserSettingsService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async updateMealSetting(userMealInput: UserMealInput, userId: string): Promise<UserMeal> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    const foundUserMealIndex = user.meals.findIndex(p => p.id === userMealInput.id)
    if (foundUserMealIndex === -1) throw new Errors.NotFound('User meal not found')

    const userMeal = {
      id: userMealInput.id,
      name: userMealInput.name,
      time: userMealInput.time,
      size: userMealInput.size,
      availableTime: userMealInput.availableTime,
      cook: userMealInput.cook,
    }

    user.meals[foundUserMealIndex] = userMeal
    user.markModified('meals')
    await user.save()

    return userMeal
  }

  async updateUserMeals(userMealInputs: UserMealInput[], userId: string): Promise<UserMeal[]> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    user.meals = userMealInputs.map(userMealInput => ({
      id: userMealInput.id,
      name: userMealInput.name,
      time: userMealInput.time,
      size: userMealInput.size,
      availableTime: userMealInput.availableTime,
      cook: userMealInput.cook,
    }))

    user.markModified('meals')
    await user.save()

    return user.meals
  }
}
