/*
 * Calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import DishService from '@Services/dish/dish.service'
import { CalendarResponse, Day } from '@Types/calendar'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { Meal, MealInput } from '@Types/eating';


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

  async logMeal(dishInput: MealInput, userId: string): Promise<Day> {

    let meal: Meal = {
      type: dishInput.type,
      time: dishInput.time,
      items: await this.dishService.generateDishItemList(dishInput.items),
    }

    let userActiveDays = await CalendarModel.aggregate([
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

    let dayId = null
    let day
    userActiveDays.map(activeDay => {

      if (
        (activeDay._id.year == dishInput.time!.getFullYear()) &&
        (activeDay._id.month == dishInput.time!.getMonth() + 1) &&
        (activeDay._id.day == dishInput.time!.getDate())) {
        dayId = activeDay.items[0]
      }
    })

    if (!dayId) {
      let calendarMeal: Partial<Meal[]> = []
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
