/*
 * operator.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { OperatorModel } from '@Models/operator.model'
import AuthService from '@Services/auth/auth.service'
import OperatorService from '@Services/operator/operator.service'
import { AuthResponse } from '@Types/auth'
import { Role } from '@Types/common'
import { Operator, OperatorResponse } from '@Types/operator'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'


@Service()
@Resolver()
export default class OperatorResolver {
  constructor(
    // service injection
    private readonly operatorService: OperatorService,
    private readonly authService: AuthService,
  ) {
    // noop
  }

  @Mutation(returns => AuthResponse)
  async loginOperator(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    return this.authService.authenticate(username, password)
  }

  @Query(returns => AuthResponse)
  async me(
    @Arg('session') session: string,
    @Ctx() ctx: Context,
  ) {
    const s = await this.authService.authenticateBySession(session)
    s.operator = new OperatorModel(s.operator) // TODO what the hell
    return s
  }

  @Authorized(Role.admin)
  @Query(returns => [Operator])
  async operators(
    @Ctx() ctx: Context,
  ) {
    return this.operatorService.getOperatorsList()
  }

  @Authorized(Role.admin)
  @Mutation(returns => OperatorResponse)
  async createOperator(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    return this.operatorService.create(username, password)
  }

  @Authorized(Role.admin)
  @Mutation(returns => Operator)
  async deleteOperator(
    @Arg('id') operatorID: string,
    @Ctx() ctx: Context,
  ) {
    if (!mongoose.Types.ObjectId.isValid(operatorID)) throw new Errors.UserInput('Invalid id', { id: 'Invalid id' })
    return this.operatorService.removeOperator(operatorID)
  }
}
