/*
 * diet.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Authorized, Ctx, Mutation, Resolver, Query, Args } from 'type-graphql'
import { Service } from 'typedi'
import { Diet, DietInput, ListDietArgs } from '@Types/diet'
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

  @Query(returns => [Diet])
  async diets(
    @Args() args: ListDietArgs,
    @Ctx() ctx: Context,
  ) {
    return this.dietService.list(args)
  }

  @Mutation(returns => ObjectId)
  async deleteDiet(
    @Arg('dietId') dietId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.dietService.delete(dietId, ctx.user!)
  }
  @Mutation(returns => Diet)
  async updateDiet(
    @Arg('dietId') dietId: ObjectId,
    @Arg('diet') diet: DietInput,
    @Ctx() ctx: Context,
  ) {
    return this.dietService.update(dietId, diet)
  }
}
