/*
 * weight.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import WeightService from '@Services/food/weight.service'
import { Role, ObjectId } from '@Types/common'
import { Weight, WeightInput } from '@Types/weight'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class WeightResolver {
  constructor(
    // service injection
    private readonly weightService: WeightService,
  ) {
    // noop
  }

  @Authorized([Role.operator])
  @Mutation(returns => Weight)
  async createWeight(
    @Arg('foodId') foodId: ObjectId,
    @Arg('weightInput', type => WeightInput) weightInput: WeightInput,
    @Ctx() ctx: Context
  ) {
    return this.weightService.create(foodId, weightInput)
  }
}
