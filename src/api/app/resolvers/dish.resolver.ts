/*
 * dish.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import DishService from '@Services/dish/dish.service'
import { Dish, DishInput, DishListResponse, DishInputArgs, ListDishesArgs } from '@Types/dish'
import { Arg, Authorized, Ctx, Query, Resolver, Mutation, Args } from 'type-graphql'
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
    return this.dishService.create(dish, ctx.user!.id)
  }

  @Authorized(UserRole.user)
  @Query(returns => DishListResponse)
  async dishes(
    @Args() { page, size, authorId }: ListDishesArgs,
    @Ctx() ctx: Context,
  ) {
    return this.dishService.list({ page, size, authorId })
  }
  @Authorized(UserRole.user)
  @Query(returns => Dish)
  async dish(
    @Args() { id, slug }: DishInputArgs,
    @Ctx() ctx: Context,
  ) {
    return this.dishService.get({ id, slug })
  }

  @Authorized()
  @Query(returns => Boolean)
  deleteDish(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    return this.dishService.delete(id)
  }

  @Authorized()
  @Query(returns => Dish)
  updateDish(
    @Arg('id') id: string,
    @Arg('data') data: DishInput,
    @Ctx() ctx: Context,
  ): Promise<Dish> {
    return this.dishService.update(id, data)
  }
}
