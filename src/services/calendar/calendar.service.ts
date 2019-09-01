/*
 * Calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { CalendarResponse, Day, CalendarMeal, CalendarMealInput } from '@Types/calendar'
import { CalendarModel } from '@Models/calendar.model'
import mongoose, { mongo } from 'mongoose'
import { createPagination } from '@Utils/generate-pagination'
import { LOADIPHLPAPI } from 'dns';
import Errors from '@Utils/errors';
import DishService from '@Services/dish/dish.service'


@Service()
export default class CalendarService {
  constructor(
    // service injection
    private readonly dishService: DishService
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

  async logDay(dishInput: CalendarMealInput, userId: string): Promise<Day> {

    if (!dishInput.time) {
      dishInput.time = new Date()
    }

    let meal: CalendarMeal = {
      type: dishInput.type,
      time: dishInput.time,
      dish: await this.dishService.generateDishItemList(dishInput.dish),
    }

    let days = await CalendarModel.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: { month: { $month: { date: '$date' } }, day: { $dayOfMonth: { date: '$date' } }, year: { $year: { date: '$date' } } },
          items: { $addToSet: "$_id" }
        }
      }
    ])

    var dayId = null,
      day
    days.map(tt => {

      if (tt._id.year == dishInput.time!.getFullYear() && tt._id.month == dishInput.time!.getMonth() + 1 && tt._id.day == dishInput.time!.getDate()) {
        dayId = tt.items[0]
      }
    })

    if (!dayId) {
      let calendarMeal: Partial<CalendarMeal[]> = []
      calendarMeal.push(meal)
      day = new CalendarModel({
        date: dishInput.time,
        user: userId,
        meals: calendarMeal
      })
    } else {
      day = await CalendarModel.findById(dayId)
      if (!day) throw new Errors.System('Something went wrong')
      day.meals = [...day.meals, meal]
    }

    return day.save()
  }
}
