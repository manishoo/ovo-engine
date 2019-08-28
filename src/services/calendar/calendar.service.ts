/*
 * Calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { CalendarResponse, MealType, Day, CalendarMeal } from '@Types/calendar'
import { CalendarModel } from '@Models/calendar.model'
import mongoose, { mongo } from 'mongoose'
import { createPagination } from '@Utils/generate-pagination'


@Service()
export default class CalendarService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async listDays(userId: string): Promise<CalendarResponse> {

    let query: any = {}
    let day: Partial<Day> = {}

    query.user = mongoose.Types.ObjectId(userId)
    const calendar = await CalendarModel.find(query)

    return {
      calendar,
      pagination: createPagination(1, 30, 30)
    }

  }
}
