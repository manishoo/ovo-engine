/*
 * calendar.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import { BodyMeasurementInput, Day, DayMealInput, LogActivityInput } from '@Types/calendar'
import { LanguageCode, MealType, Role } from '@Types/common'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver(of => Day)
export default class CalendarResolver {
  constructor(
    // service injection
    private readonly calendarService: CalendarService
  ) {
    // noop
  }

  @Authorized(Role.user)
  @Query(returns => [Day])
  async calendar(
    @Arg('startDate') startDate: Date,
    @Arg('endDate') endDate: Date,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.listDays(ctx.user!.id, startDate, endDate)
  }

  @Authorized(Role.user)
  @Mutation(returns => Day)
  async logMeal(
    @Arg('meal', type => DayMealInput) mealInput: DayMealInput,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logMeal(mealInput, ctx.user!.id)
  }

  @Authorized(Role.user)
  @Mutation(returns => [Day])
  async logActivities(
    @Arg('activities', type => [LogActivityInput]) activities: LogActivityInput[],
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logActivity(activities, ctx.user!.id)
  }

  @Authorized(Role.user)
  @Mutation(returns => [Day])
  async logBodyMeasurement(
    @Arg('measurement', type => [BodyMeasurementInput]) bodyMeasurements: BodyMeasurementInput[],
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logMeasurements(bodyMeasurements, ctx.user!.id)
  }
}
