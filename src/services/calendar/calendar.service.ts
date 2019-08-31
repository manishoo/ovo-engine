/*
 * Calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import DishService from '@Services/dish/dish.service'
import { CalendarMeal, CalendarMealInput, CalendarResponse, Day } from '@Types/calendar'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import mongoose from 'mongoose'
import { Service } from 'typedi'


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
          _id: {
            month: { $month: { date: '$date' } },
            day: { $dayOfMonth: { date: '$date' } },
            year: { $year: { date: '$date' } }
          },
          items: { $addToSet: '$_id' }
        }
      }
    ])

    let dayId = null, day
    days.map(day => {

      if (
        (day._id.year == dishInput.time!.getFullYear()) &&
        (day._id.month == dishInput.time!.getMonth() + 1) &&
        (day._id.day == dishInput.time!.getDate())) {
        dayId = day.items[0]
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
