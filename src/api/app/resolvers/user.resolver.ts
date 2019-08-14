/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { User, UserRegistrationInput, UserAuthResponse, UserLoginArgs } from '@Types/user'
import { Arg, Ctx, Mutation, Resolver, Args, Authorized, Query } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { UserRole } from '@Types/common'


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
    @Args() {username, password}: UserLoginArgs,
  ) {
    return this.userService.loginUser({username, password})
  }

  @Authorized(UserRole.user)
  @Query(returns => User)
  async me(
    @Ctx() ctx: Context,
  ) {
    return this.userService.getUserInfo(ctx.user!.id)
  }
}
