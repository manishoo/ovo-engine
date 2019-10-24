/*
 * diet.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Arg, Authorized, Ctx, Mutation, Resolver, Query } from 'type-graphql'
import { Service } from 'typedi'
import { Diet, DietInput, ListDietInput } from '@Types/diet'
import { Role } from '@Types/common'
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
    @Ctx() ctx: Context,
    @Arg('variables', { nullable: true }) variables?: ListDietInput,
  ) {
    return this.dietService.list(variables)
  }
}
