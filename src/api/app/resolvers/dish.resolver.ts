/*
 * meal.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealService from '@Services/meal/meal-service'
import { UserRole } from '@Types/common'
import { ListMealsArgs, Meal, MealInput, MealListResponse } from '@Types/meal'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class MealResolver {
  constructor(
    // service injection
    private readonly mealService: MealService
  ) {
    // noop
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Meal)
  async createMeal(
    @Arg('meal') meal: MealInput,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.create(meal, ctx.user!.id)
  }

  @Authorized(UserRole.user)
  @Query(returns => MealListResponse)
  async meals(
    @Args() { page, size, authorId }: ListMealsArgs,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.list({ page, size, authorId })
  }

  @Authorized(UserRole.user)
  @Query(returns => Meal)
  async meal(
    @Ctx() ctx: Context,
    @Arg('id', { nullable: true }) id?: string,
    @Arg('slug', { nullable: true }) slug?: string,
  ) {
    return this.mealService.get(id, slug)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Meal)
  async deleteMeal(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.delete(id, ctx.user!.id)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Meal)
  async updateMeal(
    @Arg('id') id: string,
    @Arg('data') data: MealInput,
    @Ctx() ctx: Context,
  ) {
    return this.mealService.update(id, data, ctx.user!.id)
  }
}
