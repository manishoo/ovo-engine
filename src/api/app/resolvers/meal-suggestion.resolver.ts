/*
 * meal-suggesttion.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealSuggestionService from '@Services/meal/suggestion.service'
import { Day, DayMeal } from '@Types/calendar'
import { MealItem } from '@Types/meal'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class MealSuggestionResolver {
  constructor(
    // service injection
    private readonly mealSuggestionService: MealSuggestionService,
  ) {
    // noop
  }

  @Authorized()
  @Mutation(returns => MealItem)
  async suggestMealItem(
    @Arg('mealItemId') mealItemId: string,
    @Arg('userMealId') userMealId: string,
    @Arg('date') date: Date,
    @Ctx() ctx: Context,
  ): Promise<MealItem> {
    return this.mealSuggestionService.suggestMealItem(mealItemId, userMealId, date, ctx.user!.id)
  }

  @Authorized()
  @Mutation(returns => DayMeal)
  async suggestMeal(
    @Arg('userMealId') userMealId: string,
    @Arg('date') date: Date,
    @Ctx() ctx: Context,
  ): Promise<DayMeal> {
    return this.mealSuggestionService.suggestMeal(userMealId, date, ctx.user!.id)
  }

  @Authorized()
  @Mutation(returns => Day)
  async suggestDay(
    @Arg('date') date: Date,
    @Ctx() ctx: Context,
  ): Promise<Day> {
    return this.mealSuggestionService.suggestDay(date, ctx.user!.id)
  }
}
