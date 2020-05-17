/*
 * calendar.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import { PlanModel } from '@Models/plan.model'
import { UserModel } from '@Models/user.model'
import ActivityService from '@Services/activity/activity.service'
import FoodService from '@Services/food/food.service'
import transformDbMealItem from '@Services/meal/transformers/meal-item.db-transformer'
import populateIngredients from '@Services/meal/utils/populate-ingredients'
import RecipeService from '@Services/recipe/recipe.service'
import UserService from '@Services/user/user.service'
import { UserActivity } from '@Types/activity'
import { Day, DayInput, DayMeal, LogActivityInput } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import { IngredientInput } from '@Types/ingredient'
import { MealItem } from '@Types/meal'
import Errors from '@Utils/errors'

import { parseFromTimeZone } from 'date-fns-timezone'
import addDays from 'date-fns/addDays'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import subDays from 'date-fns/subDays'
import { ArgsType, Field } from 'type-graphql'
import { Service } from 'typedi'
import { InstanceType } from 'typegoose'


@ArgsType()
export class LogMealArgs {
  @Field({ nullable: true })
  date?: Date

  @Field({ nullable: true })
  dayId?: ObjectId

  @Field()
  planId: ObjectId

  @Field()
  dayMealId: ObjectId

  @Field(type => [IngredientInput])
  ingredientInputs: IngredientInput[]
}

@Service()
export default class CalendarService {
  constructor(
    // service injection
    private readonly foodService: FoodService,
    private readonly recipeService: RecipeService,
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
  ) {
    // noop
  }

  async listDays(planId: ObjectId, dates: Date[], userId: string): Promise<Day[]> {
    await this._checkOwnPlan(planId, userId)

    const query: any = {
      plan: planId,
    }

    query.$or = dates.map(d => {
      const nextDayOfTime = addDays(new Date(d), 1)
      const lastDayOfTime = subDays(new Date(d), 1)

      return { date: { $gte: lastDayOfTime, $lte: nextDayOfTime } }
    })

    return CalendarModel.find(query)
  }

  async createDay(dayInput: DayInput, userId: string): Promise<InstanceType<Day>> {
    await this._checkOwnPlan(dayInput.planId, userId)

    return CalendarModel.create(<Day>{
      _id: dayInput.id,
      date: dayInput.date,
      plan: dayInput.planId,
      meals: await Promise.all(dayInput.meals.map(async dayMeal => ({
        ...dayMeal,
        items: dayMeal.items ? (await populateIngredients(dayMeal.items, this.foodService.get, this.recipeService.get)).map(transformDbMealItem) : []
      })))
    })
  }

  async deleteDay(dayId: ObjectId, planId: ObjectId, userId: string): Promise<ObjectId> {
    await this._checkOwnPlan(planId, userId)

    await CalendarModel.deleteOne({ _id: dayId })

    return dayId
  }

  async logMeal({ date, dayId, planId, dayMealId, ingredientInputs }: LogMealArgs, userId: string): Promise<DayMeal> {
    await this._checkOwnPlan(planId, userId)

    let day
    if (dayId) {
      day = await this.get(dayId, planId, userId)
    } else if (date) {
      day = await this.findOrCreateDayByTime(planId, userId, date)
    } else {
      throw new Errors.Validation('Date or dayId must be provided')
    }

    let loggedMeal = undefined
    day.meals = await Promise.all(day.meals.map(async meal => {
      if (String(meal.id) === String(dayMealId)) {
        const items = await populateIngredients(ingredientInputs, this.foodService.get, this.recipeService.get)

        loggedMeal = {
          ...meal,
          items: items.map(ingredient => {
            const previousMealItem = meal.items.find(item => String(item.id) === String(ingredient.id))
            const alternativeMealItems = previousMealItem ? previousMealItem.alternativeMealItems : []

            return {
              ...ingredient,
              alternativeMealItems,
            }
          }),
        }
        return {
          ...loggedMeal,
          items: loggedMeal.items.map(mealItem => transformDbMealItem(mealItem) as MealItem)
        }
      }

      return meal
    }))

    day.markModified('meals')
    await day.save()
    if (!loggedMeal) throw new Errors.System()
    return loggedMeal
  }

  async get(dayId: ObjectId, planId: ObjectId, userId: string): Promise<InstanceType<Day>> {
    await this._checkOwnPlan(planId, userId)

    const day = await CalendarModel.findOne({
      _id: dayId,
      plan: planId,
    })
    if (!day) throw new Errors.NotFound('Day not found')

    return day
  }

  async eatMeal(eaten: boolean, dayId: ObjectId, planId: ObjectId, userMealId: string, userId: string): Promise<boolean> {
    const day = await this.get(dayId, planId, userId)

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

  async logActivity(activities: LogActivityInput[], planId: ObjectId, userId: string): Promise<Day[]> {
    let days = []

    for (let activity of activities) {
      let day = await this.findOrCreateDayByTime(planId, userId, activity.time)

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

  async findDayByDate(planId: ObjectId, userId: string, date: Date): Promise<InstanceType<Day> | null> {
    const user = await this.userService.getUserById(userId)

    if (user.timeZone) {
      date = parseFromTimeZone(String(date.toUTCString()), { timeZone: user.timeZone })
    }

    const nextDayOfTime = addDays(new Date(date), 1)
    const lastDayOfTime = subDays(new Date(date), 1)

    let userActiveDays = await CalendarModel.aggregate([
      {
        $match: {
          plan: planId,
          date: { $gte: lastDayOfTime, $lte: nextDayOfTime }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
            year: { $year: '$date' },
            hour: { $hour: '$date' },
            minute: { $minute: '$date' },
            second: { $second: '$date' },
          },
          items: { $addToSet: '$_id' }
        }
      }
    ])

    let dayId = null
    userActiveDays.map(activeDay => {
      const {
        month,
        day,
        year,
        hour,
        minute,
        second,
      } = activeDay._id
      const activeDate = parseFromTimeZone(`${year}-${month}-${day}T${hour}:${minute}:${second}`, { timeZone: user.timeZone! })
      if (
        (activeDate.getFullYear() == date.getFullYear()) &&
        (activeDate.getMonth() == date.getMonth()) &&
        (activeDate.getDate() == date.getDate())) {

        dayId = activeDay.items[0]
      }
    })

    if (!dayId) return null

    const day = await CalendarModel.findById(dayId)
    if (!day) throw new Errors.System('Something went wrong')

    return day
  }

  async findOrCreateDayByTime(planId: ObjectId, userId: string, date: Date): Promise<InstanceType<Day>> {
    await this._checkOwnPlan(planId, userId)

    const user = await UserModel.findById(userId)
    if (!user) throw new Errors.System()

    let day = await this.findDayByDate(planId, userId, date)

    if (!day) {
      day = await this.createDay({
        planId,
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
        date: date,
      }, userId)
    }

    return day!
  }

  private async _checkOwnPlan(planId: ObjectId, userId: string) {
    const plan = await PlanModel.findOne({ _id: planId, user: new ObjectId(userId) })
    if (!plan) throw new Errors.Forbidden('Not your meal plan')

    return true
  }
}
