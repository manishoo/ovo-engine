/*
 * Calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import MealService from '@Services/meal/meal-service'
import { Day } from '@Types/calendar'
import { DayMeal, DayMealInput } from '@Types/calendar'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { ActivityModel } from '@Models/activity.model'
import { Activity } from '@Types/activity'


@Service()
export default class CalendarService {
  constructor(
    // service injection
    private readonly mealService: MealService
  ) {
    // noop
  }

  async listDays(userId: string, startDate: Date, endDate: Date): Promise<Day[]> {
    let query: any = {}

    query.date = { $gt: startDate, $lt: endDate }
    query.user = mongoose.Types.ObjectId(userId)

    return CalendarModel.find(query)
      .populate({
        path: 'meals.items.recipe',
        model: RecipeModel
      })
      .populate({
        path: 'meals.items.food',
        model: FoodModel,
      })
  }

  async logMeal(dayMealInput: DayMealInput, userId: string): Promise<Day> {
    let meal: DayMeal = {
      type: dayMealInput.type,
      time: dayMealInput.time,
      items: await this.mealService.generateMealItemList(dayMealInput.items),
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
        (activeDay._id.year == dayMealInput.time!.getFullYear()) &&
        (activeDay._id.month == dayMealInput.time!.getMonth() + 1) &&
        (activeDay._id.day == dayMealInput.time!.getDate())) {
        dayId = activeDay.items[0]
      }

    })

    if (!dayId) {
      let calendarMeal: Partial<DayMeal[]> = []
      calendarMeal.push(meal)
      let dayCreationDate = new Date(dayMealInput.time)

      dayCreationDate.setUTCHours(0)
      dayCreationDate.setHours(0)
      dayCreationDate.setUTCMinutes(0)

      day = new CalendarModel({
        date: dayCreationDate,
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

  async listActivity(nameSearchQuery?: string): Promise<Activity[]> {

    let query: any = {}
    if (nameSearchQuery) {
      query['activityTypeName.text'] = { $regex: nameSearchQuery }
    }
    const activities = await ActivityModel.find(query)

    return activities
  }
}