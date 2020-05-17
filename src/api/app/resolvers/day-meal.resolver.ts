/*
 * day-meal.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import CalendarService, { LogMealArgs } from '@Services/calendar/calendar.service'
import MealItemService from '@Services/calendar/meal-item.service'
import { DayMeal } from '@Types/calendar'
import { ObjectId, Role } from '@Types/common'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class DayMealResolver {
  constructor(
    // service injection
    private readonly calendarService: CalendarService,
    private readonly mealItemService: MealItemService,
  ) {
    // noop
  }

  @Authorized(Role.user)
  @Mutation(returns => DayMeal)
  async logMeal(
    @Args() logMealArgs: LogMealArgs,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logMeal(logMealArgs, ctx.user!.id)
  }

  @Authorized(Role.user)
  @Mutation(returns => Boolean)
  async moveMealItem(
    @Arg('dayId') dayId: ObjectId,
    @Arg('fromUserMealId') fromUserMealId: string,
    @Arg('toUserMealId') toUserMealId: string,
    @Arg('toIndex', () => Int) toIndex: number,
    @Arg('mealItemId') mealItemId: ObjectId,
    @Arg('planId') planId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.mealItemService.move(planId, dayId, fromUserMealId, toUserMealId, toIndex, mealItemId, ctx.user!.id)
  }

  @Authorized(Role.user)
  @Mutation(returns => Boolean)
  async eatMeal(
    @Arg('eaten') eaten: boolean,
    @Arg('dayId') dayId: ObjectId,
    @Arg('userMealId') userMealId: string,
    @Arg('planId') planId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.eatMeal(eaten, dayId, planId, userMealId, ctx.user!.id)
  }
}
