/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import { UserRole } from '@Types/common'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { Day, CalendarResponse, CalendarMealInput } from '@Types/calendar'


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
  @Query(returns => CalendarResponse)
  async calendar(
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.listDays(ctx.user!.id)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Day)
  async logDay(
    @Arg('dish') dishInput: CalendarMealInput,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.logDay(dishInput, ctx.user!.id)
  }
}
