/*
 * meal-item.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import MealItemService from '@Services/calendar/meal-item.service'
import { IngredientListArgs, IngredientListResponse } from '@Types/ingredient'
import { Context } from '@Utils/context'
import { Args, Authorized, Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class MealItemsResolver {
  constructor(
    // service injection
    private readonly mealItemService: MealItemService,
  ) {
    // noop
  }

  @Authorized()
  @Query(returns => IngredientListResponse)
  async mealItems(
    @Args() {
      size,
      page,
      nameSearchQuery,
    }: IngredientListArgs,
    @Ctx() ctx: Context,
  ) {
    return this.mealItemService.list({
      nameSearchQuery,
      page,
      size
    }, ctx.user!)
  }
}
