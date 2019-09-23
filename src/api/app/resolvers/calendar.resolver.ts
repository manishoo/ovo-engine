/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import { UserRole, LanguageCode } from '@Types/common'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver, Args } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { Day } from '@Types/calendar'
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
  @Query(returns => [Activity])
  async activities(
    @Ctx() ctc: Context,
  ) {
    return [{
      activityTypeName: [{ locale: LanguageCode.en, text: 'goshad-ish' }],
      met: 3,
      activityGroup: {
        name: [{ locale: LanguageCode.en, text: 'Cycling' }]
      }
    },
    {
      activityTypeName: [{ locale: LanguageCode.en, text: 'MTB' }],
      met: 12,
      activityGroup: {
        name: [{ locale: LanguageCode.en, text: 'Cycling' }]
      }
    },
    {
      activityTypeName: [{ locale: LanguageCode.en, text: 'bandari' }],
      met: 18,
      activityGroup: {
        name: [{ locale: LanguageCode.en, text: 'Dancing' }]
      }
    }]
  }
}
