/*
 * diet.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Diet, DietInput } from '@Types/diet'
import { Role, ObjectId } from '@Types/common'
import DietService from '@Services/diet/diet.service'
import { Context } from '@Utils/context'


@Service()
@Resolver(of => Diet)
export default class DietResolver {
  constructor(
    // service injection
    private readonly dietService: DietService,
  ) {
    // noop
  }

  @Authorized(Role.operator)
  @Mutation(returns => Diet)
  async createDiet(
    @Arg('diet') diet: DietInput,
    @Ctx() ctx: Context,
  ) {
    return this.dietService.create(diet)
  }

  @Authorized(Role.operator)
  @Mutation(returns => ObjectId)
  async deleteDiet(
    @Arg('dietId') dietId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.dietService.delete(dietId, ctx.user!)
  }
}
