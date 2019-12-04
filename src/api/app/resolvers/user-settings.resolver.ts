/*
 * user-settings.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserSettingsService from '@Services/user/user-settings.service'
import { UserMeal, UserMealInput } from '@Types/user'
import { Context } from '@Utils/context'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
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
  async updateMealSetting(
    @Arg('userMeal', type => UserMealInput) userMeal: UserMealInput,
    @Ctx() ctx: Context,
  ) {
    return this.userSettingsService.updateMealSetting(userMeal, ctx.user!.id)
  }

  @Mutation(returns => [UserMeal])
  async updateUserMeals(
    @Arg('userMeals', type => [UserMealInput]) userMeals: UserMealInput[],
    @Ctx() ctx: Context,
  ) {
    return this.userSettingsService.updateUserMeals(userMeals, ctx.user!.id)
  }
}
