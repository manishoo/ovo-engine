/*
 * user-settings.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserSettingsService from '@Services/user/user-settings.service'
import { Role } from '@Types/common'
import { NutritionProfile, NutritionProfileInput, UserMeal, UserMealInput } from '@Types/user'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class UserSettingsResolver {
  constructor(
    // service injection
    private readonly userSettingsService: UserSettingsService
  ) {
    // noop
  }

  @Mutation(returns => UserMeal)
  @Authorized(Role.user)
  async updateMealSetting(
    @Arg('userMeal', type => UserMealInput) userMeal: UserMealInput,
    @Ctx() ctx: Context,
  ) {
    return this.userSettingsService.updateMealSetting(userMeal, ctx.user!.id)
  }

  @Mutation(returns => NutritionProfile)
  @Authorized(Role.user)
  async updateNutritionProfile(
    @Arg('nutritionProfile', type => NutritionProfileInput) nutritionProfileInput: NutritionProfileInput,
    @Ctx() ctx: Context,
  ) {
    return this.userSettingsService.updateNutritionProfile(nutritionProfileInput, ctx.user!.id)
  }

  @Mutation(returns => [UserMeal])
  @Authorized(Role.user)
  async updateUserMeals(
    @Arg('userMeals', type => [UserMealInput]) userMeals: UserMealInput[],
    @Ctx() ctx: Context,
  ) {
    return this.userSettingsService.updateUserMeals(userMeals, ctx.user!.id)
  }
}
