/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import { UserRole, LanguageCode, MealType } from '@Types/common'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver, Args } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { Day, LogActivityInput } from '@Types/calendar'
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
    return [
      {
        id: '5d667c739f5aa96618af5b94',
        date: new Date('2019-09-23T14:12:28.098Z'),
        user: {
          id: '5d667c739f5aa96618af5b94',
          username: 'Gholam ali',
        },
        meals: [{
          type: MealType.breakfast,
          time: new Date('2019-09-23T14:12:28.098Z'),
          items: [{
            amount: 4,
            recipe: {
              id: '5d667c739f5aa96618af5b93',
              title: [{ locale: LanguageCode.en, text: 'cheshm' }],
              ingredients: [
                {
                  food: {
                    id: '5d667c739f5aa96618af5b87',
                    name: [{ locale: LanguageCode.en, text: 'carrot' }],
                  },
                  weight: '5d667c739f5aa96618af5b94'
                }
              ],
              serving: 1,
              slug: 'die-hard-please-vyHCB2D',
            }
          }]
        }],
        activities: [
          {
            id: '5d6cd273eff1e93a034aeb5b',
            duration: activities[0].duration,
            activityTypeName: [{ locale: LanguageCode.en, text: 'MTB' }],
            totalBurnt: activities[0].burntCalories,
            activityName: activities[0].activityName,
            time: activities[0].time,
            met: 4,
            activityGroup: {
              name: [{ locale: LanguageCode.en, text: 'Cycling' }]
            }
          }
        ],
        totalBurnt: 4
      }
    ]
  }
}
