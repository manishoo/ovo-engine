/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { Role } from '@Types/common'
import { BaseUser, User, UserAuthResponse, UserLoginArgs, UserRegistrationInput, UserUpdateInput, NutritionProfileInput, UpdateNutritionProfileResponse } from '@Types/user'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver(of => User)
export default class UserResolver {
  constructor(
    // service injection
    private readonly userService: UserService
  ) {
    // noop
  }

  @Mutation(returns => UserAuthResponse)
  async registerUser(
    @Arg('user') user: UserRegistrationInput,
    @Ctx() ctx: Context,
  ) {
    return this.userService.register(user)
  }

  @Mutation(returns => UserAuthResponse)
  async loginUser(
    @Args() { username, password }: UserLoginArgs,
  ) {
    return this.userService.loginUser({ username, password })
  }

  @Authorized(Role.user)
  @Mutation(returns => User)
  async updateUser(
    @Arg('id') userId: string,
    @Arg('user') user: UserUpdateInput,
    @Ctx() ctx: Context,
  ) {
    return this.userService.update(user, userId)
  }

  @Authorized(Role.user)
  @Query(returns => User)
  async me(
    @Ctx() ctx: Context,
  ) {
    return this.userService.userProfile(ctx.user!.id, ctx.user!.id)
  }

  @Query(returns => BaseUser)
  async user(
    @Ctx() ctx: Context,
    @Arg('userId', { nullable: true }) userId?: string,
    @Arg('username', { nullable: true }) username?: string,
  ) {
    return this.userService.userProfile(ctx.user && ctx.user.id, userId, username)
  }

  @Query(returns => Boolean)
  async usernameExists(
    @Arg('username') username: string,
    @Ctx() ctx: Context,
  ) {
    return this.userService.doesUsernameExist(username)
  }

  @Authorized(Role.user)
  @Mutation(returns => UpdateNutritionProfileResponse)
  async updateNutritionProfile(
    @Arg('nutritionProfile') nutritionProfile: NutritionProfileInput,
    @Ctx() ctx: Context,
  ) {
    return {
      userId: '5d6cd273eff1e93a034aeb5b',
      nutritionProfile: {
        calories: nutritionProfile.calories,
        protein: nutritionProfile.protein,
        carb: nutritionProfile.carb,
        fat: nutritionProfile.fat
      }
    }
  }

  @Query(returns => Boolean)
  async requestRecoverPassword(
    @Arg('email') email: string,
    @Ctx() ctx: Context,
  ) {
    return this.userService.requestRecoverPassword(email)
  }
}
