/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { UserRole } from '@Types/common'
import { User, UserAuthResponse, UserLoginArgs, UserRegistrationInput, UserUpdateInput } from '@Types/user'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


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

  @Mutation(returns => User)
  async updateUser(
    @Arg('id') userId: string,
    @Arg('user') user: UserUpdateInput,
    @Ctx() ctx: Context,
  ) {
    return this.userService.update(user, userId)
  }

  @Authorized(UserRole.user)
  @Query(returns => User)
  async me(
    @Ctx() ctx: Context,
  ) {
    return this.userService.getUserInfo(ctx.user!.id)
  }

  @Query(returns => Boolean)
  async usernameExists(
    @Arg('username') username: string,
    @Ctx() ctx: Context,
  ) {
    return this.userService.doesUsernameExist(username)
  }
}
