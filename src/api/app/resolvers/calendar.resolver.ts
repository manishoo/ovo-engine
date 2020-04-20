/*
 * calendar.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import CalendarService from '@Services/calendar/calendar.service'
import MealSuggestionService from '@Services/meal/suggestion.service'
import { BodyMeasurementInput, Day, DayInput, LogActivityInput } from '@Types/calendar'
import { LanguageCode, MealType, ObjectId, Role } from '@Types/common'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class CalendarResolver {
  constructor(
    // service injection
    private readonly calendarService: CalendarService,
    private readonly mealSuggestionService: MealSuggestionService,
  ) {
    // noop
  }

  @Authorized(Role.user)
  @Query(returns => [Day])
  async calendar(
    @Arg('dates', type => [Date]) dates: Date[],
    @Ctx() ctx: Context,
  ): Promise<Day[]> {
    return this.calendarService.listDays(ctx.user!.id, dates)
  }

  @Authorized(Role.user)
  @Mutation(returns => Day)
  async newDay(
    @Arg('day') dayInput: DayInput,
    @Ctx() ctx: Context,
    @Arg('generate', { nullable: true }) generate?: boolean,
  ) {
    if (generate) {
      return this.mealSuggestionService.suggestDay(dayInput, ctx.user!.id)
    }

    return this.calendarService.createDay(dayInput, ctx.user!.id)
  }

  @Authorized(Role.user)
  @Mutation(returns => ObjectId)
  async clearDay(
    @Arg('dayId') dayId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.calendarService.deleteDay(dayId, ctx.user!.id)
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
            duration: 12,
            activityTypeName: [{ locale: LanguageCode.en, text: 'MTB' }],
            totalBurnt: 398,
            activityName: 'Morning ride',
            time: new Date('2019-10-23T14:12:28.098Z'),
            met: 4,
            activityGroup: {
              name: [{ locale: LanguageCode.en, text: 'Cycling' }]
            }
          }
        ],
        totalBurnt: 4,
        measurements: {
          time: new Date('2019-10-23T14:12:28.098Z'),
          weight: 132,
        }
      }
    ]
  }
}
