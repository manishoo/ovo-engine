/*
 * meal-plan.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import PlanService from '@Services/meal-plan/meal-plan.service'
import { ObjectId } from '@Types/common'
import { Plan, PlanInput } from '@Types/plan'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class PlanResolver {
  constructor(
    // service injection
    private readonly planService: PlanService,
  ) {
    // noop
  }

  @Authorized()
  @Query(returns => Plan)
  async plan(
    @Arg('planId') planId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.planService.get(planId, ctx.user!.id)
  }

  @Authorized()
  @Query(returns => [Plan])
  async plans(
    @Arg('userId', { nullable: true }) userId: string,
    @Ctx() ctx: Context,
  ) {
    return this.planService.list(userId)
  }

  @Authorized()
  @Mutation(returns => Plan)
  async newPlan(
    @Arg('planInput') planInput: PlanInput,
    @Ctx() ctx: Context,
  ) {
    return this.planService.create(planInput, ctx.user!.id)
  }

  @Authorized()
  @Mutation(returns => Plan)
  async updatePlan(
    @Arg('id') id: ObjectId,
    @Arg('planInput') planInput: PlanInput,
    @Ctx() ctx: Context,
  ) {
    return this.planService.update(id, planInput, ctx.user!.id)
  }

  @Authorized()
  @Mutation(returns => ObjectId)
  async deletePlan(
    @Arg('planId') planId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.planService.delete(planId, ctx.user!.id)
  }
}
