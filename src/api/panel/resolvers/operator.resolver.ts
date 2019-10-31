/*
 * operator.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { OperatorModel } from '@Models/operator.model'
import AuthService from '@Services/auth/auth.service'
import OperatorService from '@Services/operator/operator.service'
import { AuthResponse } from '@Types/auth'
import { ObjectId, Role } from '@Types/common'
import { Operator, OperatorResponse } from '@Types/operator'
import { Context } from '@Utils/context'
import Errors from '@Utils/errors'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


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
    @Arg('role', type => Role, { nullable: true }) role: Role,
    @Ctx() ctx: Context,
  ) {
    return this.operatorService.create(username, password, role)
  }

  @Authorized(Role.admin)
  @Mutation(returns => Operator)
  async deleteOperator(
    @Arg('id') operatorId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.operatorService.removeOperator(operatorId, ctx.user!)
  }
}
