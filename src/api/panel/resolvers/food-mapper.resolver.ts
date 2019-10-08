/*
 * food-mapper.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodMapperService from '@Services/food-mapper/food-mapper.service'
import { Role } from '@Types/common'
import { FoodMap, FoodMapInput, FoodMapList, FoodMapListArgs } from '@Types/food-map'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class FoodMapperResolver {
  constructor(
    // service injection
    private readonly foodMapperService: FoodMapperService,
  ) {
    // noop
  }

  @Authorized([Role.operator])
  @Query(returns => FoodMapList)
  async foodMaps(
    @Args() { page, size, nameSearchQuery, verified }: FoodMapListArgs,
    @Ctx() ctx: Context,
  ) {
    return this.foodMapperService.list({ page, size, nameSearchQuery, verified })
  }

  @Authorized([Role.operator])
  @Mutation(returns => FoodMap)
  async mapFood(
    @Arg('foodMapId') foodMapId: string,
    @Arg('foodMapInput') foodMapInput: FoodMapInput,
    @Ctx() ctx: Context
  ) {
    return this.foodMapperService.mapFood(foodMapId, foodMapInput)
  }
}
