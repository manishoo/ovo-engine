/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { ObjectId, Role } from '@Types/common'
import { BasicUser, User, UserAuthResponse, UserLoginArgs, UserRegistrationInput, UserUpdateInput } from '@Types/user'
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
    @Arg('id') userId: ObjectId,
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
    return this.userService.userProfile(ctx.user!.id, new ObjectId(ctx.user!.id))
  }

  @Query(returns => BasicUser)
  async user(
    @Ctx() ctx: Context,
    @Arg('userId', { nullable: true }) userId?: ObjectId,
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

  @Mutation(returns => Boolean)
  async requestRecoverPassword(
    @Arg('email') email: string,
    @Ctx() ctx: Context,
  ) {
    return this.userService.requestRecoverPassword(email, ctx.lang)
  }

  @Mutation(returns => Boolean)
  async changePassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    return this.userService.changeUserPassword(token, password)
  }
}
