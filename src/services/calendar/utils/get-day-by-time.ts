/*
 * get-day-by-time.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CalendarModel } from '@Models/calendar.model'
import { Day } from '@Types/calendar'
import Errors from '@Utils/errors'
import { InstanceType } from 'typegoose'
import { ObjectId } from '@Types/common'


export async function getDayByTime(userId: string, time: Date): Promise<InstanceType<Day>> {
  let lastDayOfTime = new Date(time)
  lastDayOfTime.setDate(time.getDate() - 1)
  let nextDayOfTime = new Date(time)
  nextDayOfTime.setDate(time.getDate() + 1)

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
          month: { $month: { date: '$date' } },
          day: { $dayOfMonth: { date: '$date' } },
          year: { $year: { date: '$date' } }
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

  if (!dayId) {
    let day = await CalendarModel.create({
      date: time,
      user: userId,
    })
    dayId = day.id
  }
  let day = await CalendarModel.findById(dayId)
  if (!day) throw new Errors.System('Something went wrong')

  return day
}
