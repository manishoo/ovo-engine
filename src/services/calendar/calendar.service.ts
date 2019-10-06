/*
 * Calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import MealService from '@Services/meal/meal.service'
import { Day, LogActivityInput, BodyMeasurementInput, BodyMeasurement } from '@Types/calendar'
import { DayMeal, DayMealInput } from '@Types/calendar'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'
import { getDayByTime } from './utils/get-day-by-time'
import ActivityService from '@Services/activity/activity.service'
import { UserActivity, Activity } from '@Types/activity'
import { ProvidedRequiredArgumentsRule } from 'graphql'


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
      items: await this.mealService.validateMealItems(dayMealInput.items),
    }

    let day
    let dayId = await getDayByTime(userId, dayMealInput.time!)

    day = await CalendarModel.findById(dayId)
    if (!day) throw new Errors.System('Something went wrong')
    if (day.meals) {
      day.meals = [...day.meals, meal]
    } else {
      day.meals = [meal]
    }

    return day.save()
  }


  async logActivity(activities: LogActivityInput[], userId: string): Promise<Day[]> {
    /**
     * 1- create UserActivity object
     * 2- get day of it's date
     * 3- push activity in it's activities list
     * 4- save all days
     */

    let days = await Promise.all(activities.map(async activity => {
      let dayId = await getDayByTime(userId, activity.time)

      let day = await CalendarModel.findById(dayId)
      if (!day) throw new Errors.System('Something went wrong')

      let dbActivity = await this.activityService.activity(activity.activityId)

      let newActivity: UserActivity = {
        ...dbActivity.toObject(),
        duration: activity.duration,
        totalBurnt: activity.burntCalories,
        activityName: activity.activityName,
        time: activity.time
      }

      if (day.activities) {
        day.activities = [...day.activities, newActivity]

      } else {
        day.activities = [newActivity]
      }
      await day.save()

      return day.toObject()
    }))

    return days
  }

  async logMeasurements(measurements: BodyMeasurementInput[], userId: string) {
    let days = await Promise.all(measurements.map(async measurement => {
      let dayId = await getDayByTime(userId, measurement.time)

      let day = await CalendarModel.findById(dayId)
      if (!day) throw new Errors.System('Something went wrong')

      day.measurements = {
        weight: measurement.weight,
        weightUnit: measurement.weightUnit,
      }
      await day.save()

      return day as Day
    }))

    return days
  }
}
