/*
 * food-class.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import FoodClassService from '@Services/food-class/food-class.service'
import { ObjectId } from '@Types/common'
import { FoodClass } from '@Types/food-class'
import { Context } from '@Utils/context'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class FoodClassCommonResolver {
  constructor(
    // service injection
    private readonly foodClassService: FoodClassService,
  ) {
    // noop
  }

  @Query(returns => FoodClass)
  async foodClass(
    @Ctx() ctx: Context,
    @Arg('id', { nullable: true }) id?: ObjectId,
    @Arg('slug', { nullable: true }) slug?: string,
  ) {
    return this.foodClassService.getFoodClass(id, slug)
  }
}
