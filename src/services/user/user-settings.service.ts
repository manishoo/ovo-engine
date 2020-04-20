/*
 * user-settings.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserModel } from '@Models/user.model'
import { ObjectId } from '@Types/common'
import { NutritionProfile, NutritionProfileInput, UserMeal, UserMealInput } from '@Types/user'
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

    const userMeal: UserMeal = {
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

  async updateNutritionProfile(nutritionProfileInput: NutritionProfileInput, userId: string): Promise<NutritionProfile> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('User not found')

    /**
     * Validate if percentage adds up to 100
     * */
    const totalPercentage = nutritionProfileInput.carbs.percentage
      + nutritionProfileInput.fat.percentage
      + nutritionProfileInput.protein.percentage

    if (totalPercentage !== 100) throw new Errors.Validation(`Your macro proportions must equal 100. Current value: ${totalPercentage}`)

    /**
     * Validate minimum and maximum possible calories
     * */
    const maxPossibleCalories = (nutritionProfileInput.carbs.max * 4)
      + (nutritionProfileInput.fat.max * 9)
      + (nutritionProfileInput.protein.max * 4)

    if (maxPossibleCalories < nutritionProfileInput.calories) {
      throw new Errors.Validation(`The maximum possible calories from your macros (${maxPossibleCalories}) is smaller than your desired calories (${nutritionProfileInput.calories}).`)
    }

    const minPossibleCalories = (nutritionProfileInput.carbs.min * 4)
      + (nutritionProfileInput.fat.min * 9)
      + (nutritionProfileInput.protein.min * 4)

    if (minPossibleCalories > nutritionProfileInput.calories) {
      throw new Errors.Validation(`The minimum possible calories from your macros (${minPossibleCalories}) is greater than your desired calories (${nutritionProfileInput.calories}).`)
    }

    user.nutritionProfile = {
      id: new ObjectId(),
      ...nutritionProfileInput,
    }
    user.markModified('nutritionProfile')
    await user.save()

    return user.nutritionProfile
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
