/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { GENDER, User } from '@Types/user'
import userValidator from '@Utils/user.validator'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
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

  @Mutation(returns => User)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context
  ): Promise<User> {
    return this.userService.verifyUser(username, password)
  }

  @Mutation(returns => User)
  async register(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('timeZone') timeZone: string,
    @Ctx() ctx: Context,
    @Arg('gender', { nullable: true }) gender?: GENDER,
  ): Promise<User> {
    const validatedData = userValidator.validateRegistration({
      username,
      email,
      password,
      timeZone,
      gender,
    })
    return this.userService.createUser(validatedData.username, validatedData.email, validatedData.password, validatedData.timeZone, validatedData.gender)
  }

  @Authorized()
  @Query(returns => User)
  async me(
    @Ctx() ctx: Context,
  ) {
    return this.userService.getSelfUser(ctx.user!.id)
  }

  @Query(returns => User)
  async user(
    @Arg('username') username: string,
    @Ctx() ctx: Context,
  ) {
    return this.userService.getUser(username)
  }
}
