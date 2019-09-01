/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import { UserRole } from '@Types/common'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { Day, CalendarResponse } from '@Types/calendar'
import { MealInput } from '@Types/eating'


@Service()
@Resolver(of => Day)
export default class CalendarResolver {
  constructor(
    // service injection
    private readonly calendarService: CalendarService
  ) {
    // noop
  }

  @Authorized(UserRole.user)
  @Query(returns => [Day])
  async calendar(
    @Arg('start') startDate: Date,
    @Arg('end') endDate: Date,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.listDays(ctx.user!.id, startDate, endDate)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Day)
  async logMeal(
    @Arg('meal', type => MealInput) mealInput: MealInput,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logMeal(mealInput, ctx.user!.id)
  }
}
