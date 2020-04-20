/*
 * calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import { UserModel } from '@Models/user.model'
import ActivityService from '@Services/activity/activity.service'
import MealService from '@Services/meal/meal.service'
import { UserActivity } from '@Types/activity'
import { Day, DayInput, DayMeal, LogActivityInput } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import { IngredientInput } from '@Types/ingredient'
import Errors from '@Utils/errors'
import addDays from 'date-fns/addDays'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
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

  async listDays(userId: string, dates: Date[]): Promise<Day[]> {
    let query: any = {}

    query.$or = dates.map(d => {
      const nextDayOfTime = addDays(new Date(d), 1)
      const lastDayOfTime = subDays(new Date(d), 1)

      return { date: { $gte: lastDayOfTime, $lte: nextDayOfTime } }
    })
    query.user = new ObjectId(userId)

    return CalendarModel.find(query)
  }

  async createDay(dayInput: DayInput, userId: string): Promise<InstanceType<Day>> {
    return CalendarModel.create(<Day>{
      _id: dayInput.id,
      date: dayInput.date,
      nutritionProfile: dayInput.nutritionProfile,
      user: new ObjectId(userId),
      meals: await Promise.all(dayInput.meals.map(async dayMeal => ({
        ...dayMeal,
        items: dayMeal.items ? await this.mealService.validateMealItems(dayMeal.items) : []
      })))
    })
  }

  async deleteDay(dayId: ObjectId, userId: string): Promise<ObjectId> {
    await CalendarModel.deleteOne({ _id: dayId, user: new ObjectId(userId) })

    return dayId
  }

  async logMeal(date: Date, userMealId: string, ingredientInputs: IngredientInput[], userId: string): Promise<DayMeal> {
    let day = await this.findOrCreateDayByTime(userId, date!)

    let loggedMeal = undefined
    day.meals = await Promise.all(day.meals.map(async meal => {
      if (meal.userMeal && (meal.userMeal.id === userMealId)) {
        const items = await this.mealService.validateMealItems(ingredientInputs)

        loggedMeal = {
          ...meal,
          items: items.map(ingredient => {
            const previousMealItem = meal.items.find(item => String(item.id) === String(ingredient.id))
            const alternativeMealItems = previousMealItem ? previousMealItem.alternativeMealItems : []

            return {
              ...ingredient,
              // hasAlternatives: alternativeMealItems.length > 0,
              alternativeMealItems,
            }
          }),
        }
        return loggedMeal
      }

      return meal
    }))

    day.markModified('meals')
    await day.save()
    if (!loggedMeal) throw new Errors.System()
    return loggedMeal
  }

  async get(dayId: ObjectId, userId: string): Promise<InstanceType<Day>> {
    const day = await CalendarModel.findOne({
      _id: dayId,
      user: new ObjectId(userId),
    })
    if (!day) throw new Errors.NotFound('Day not found')

    return day
  }

  async eatMeal(eaten: boolean, dayId: ObjectId, userMealId: string, userId: string): Promise<boolean> {
    const day = await this.get(dayId, userId)

    day.meals = day.meals.map(meal => {
      if (meal.userMeal && (meal.userMeal.id === userMealId)) {
        meal.ate = eaten
      }

      return meal
    })
    day.markModified('meals')
    await day.save()

    return true
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

  async findDayByDate(userId: string, date: Date): Promise<InstanceType<Day> | null> {
    const nextDayOfTime = addDays(new Date(date), 1)
    const lastDayOfTime = subDays(new Date(date), 1)

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
        (activeDay._id.year == date.getFullYear()) &&
        (activeDay._id.month == date.getMonth() + 1) &&
        (activeDay._id.day == date.getDate())) {

        dayId = activeDay.items[0]
      }
    })

    if (!dayId) return null

    const day = await CalendarModel.findById(dayId)
    if (!day) throw new Errors.System('Something went wrong')

    return day
  }

  async findOrCreateDayByTime(userId: string, date: Date): Promise<InstanceType<Day>> {
    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.System()

    let day = await this.findDayByDate(userId, date)

    if (!day) {
      day = await this.createDay({
        meals: user.meals.map(userMeal => {
          let time = date
          time = setHours(time, Number(userMeal.time.split(':')[0]))
          time = setMinutes(time, Number(userMeal.time.split(':')[1]))

          return {
            id: new ObjectId(),
            userMeal,
            time,
            items: [],
            ate: false,
          }
        }),
        nutritionProfile: user.nutritionProfile,
        date: date,
      }, userId)
    }

    return day!
  }
}
