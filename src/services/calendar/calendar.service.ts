/*
 * calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import ActivityService from '@Services/activity/activity.service'
import MealService from '@Services/meal/meal.service'
import { UserActivity } from '@Types/activity'
import { Day, DayMeal, DayMealInput, LogActivityInput } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import Errors from '@Utils/errors'
import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import { Service } from 'typedi'
import { InstanceType } from 'typegoose'


@Service()
export default class CalendarService {
  constructor(
    // service injection
    private readonly mealService: MealService,
    private readonly activityService: ActivityService,
  ) {
    // noop
  }

  async listDays(userId: string, startDate: Date, endDate: Date): Promise<Day[]> {
    let query: any = {}

    query.date = { $gt: startDate, $lt: endDate }
    query.user = new ObjectId(userId)

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
      id: new ObjectId(),
      time: dayMealInput.time,
      items: await this.mealService.validateMealItems(dayMealInput.items),
    }

    let day = await this.findOrCreateDayByTime(userId, dayMealInput.time!)

    if (day.meals) {
      day.meals = [...day.meals, meal]
    } else {
      day.meals = [meal]
    }

    return day.save()
  }

  async logActivity(activities: LogActivityInput[], userId: string): Promise<Day[]> {
    let days = []

    for (let activity of activities) {
      let day = await this.findOrCreateDayByTime(userId, activity.time)

      let dbActivity = await this.activityService.activity(activity.activityId)

      let newActivity: UserActivity = {
        ...dbActivity.toObject(),
        duration: activity.duration,
        totalBurnt: activity.burntCalories,
        activityName: activity.activityName,
        time: activity.time,
      }

      if (day.activities) {
        day.activities = [...day.activities, newActivity]
      } else {
        day.activities = [newActivity]
      }

      days.push(await day.save())
    }

    return days
  }

  async findOrCreateDayByTime(userId: string, time: Date): Promise<InstanceType<Day>> {
    const nextDayOfTime = addDays(new Date(time), 1)
    const lastDayOfTime = subDays(new Date(time), 1)

    let userActiveDays = await CalendarModel.aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          date: { $gte: lastDayOfTime, $lte: nextDayOfTime }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
            year: { $year: '$date' }
          },
          items: { $addToSet: '$_id' }
        }
      }
    ])

    let dayId = null
    userActiveDays.map(activeDay => {
      if (
        (activeDay._id.year == time.getFullYear()) &&
        (activeDay._id.month == time.getMonth() + 1) &&
        (activeDay._id.day == time.getDate())) {

        dayId = activeDay.items[0]
      }
    })

    let day
    if (!dayId) {
      day = await CalendarModel.create({
        date: time,
        user: userId,
      })
      dayId = day.id
    }
    day = await CalendarModel.findById(dayId)
    if (!day) throw new Errors.System('Something went wrong')

    return day
  }
}
