/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import { UserRole, LanguageCode, MealType } from '@Types/common'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { Day, LogActivityInput, BodyMeasurementInput } from '@Types/calendar'
import { DayMealInput } from '@Types/calendar'
import { Activity } from '@Types/activity'


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
    @Arg('startDate') startDate: Date,
    @Arg('endDate') endDate: Date,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.listDays(ctx.user!.id, startDate, endDate)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Day)
  async logMeal(
    @Arg('meal', type => DayMealInput) mealInput: DayMealInput,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logMeal(mealInput, ctx.user!.id)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => [Day])
  async logActivities(
    @Arg('activities', type => [LogActivityInput]) activities: LogActivityInput[],
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logActivity(activities, ctx.user!.id)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => [Day])
  async logBodyMeasurement(
    @Arg('measurement', type => [BodyMeasurementInput]) bodyMeasurements: BodyMeasurementInput[],
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logMeasurements(bodyMeasurements, ctx.user!.id)
  }
}
