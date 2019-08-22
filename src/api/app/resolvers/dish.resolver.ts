/*
 * dish.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import DishService from '@Services/dish/dish.service'
import { Dish, DishInput, DishListResponse } from '@Types/dish'
import { Arg, Authorized, Ctx, Int, Query, Resolver, Mutation } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { UserRole } from '@Types/common'


@Service()
@Resolver()
export default class DishResolver {
  constructor(
    // service injection
    private readonly dishService: DishService
  ) {
    // noop
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Dish)
  async createDish(
    @Arg('dish') dish: DishInput,
    @Ctx() ctx: Context,
  ) {
    return this.dishService.create(dish)
  }

  @Authorized()
  @Query(returns => DishListResponse)
  dishes(
    @Arg('page', type => Int) page: number,
    @Arg('size', type => Int) size: number,
    @Ctx() ctx: Context,
  ): Promise<DishListResponse> {
    return this.dishService.list(page, size)
  }

  @Query(returns => Dish)
  dish(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ): Promise<Dish> {
    return this.dishService.get(id)
  }

  @Authorized()
  @Query(returns => Boolean)
  deleteDish(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    return this.dishService.delete(id)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Dish)
  async updateDish(
    @Arg('id') id: string,
    @Arg('data') data: DishInput,
    @Ctx() ctx: Context,
  ) {
    return this.dishService.update(id, data, ctx.user!.id)
  }
}
