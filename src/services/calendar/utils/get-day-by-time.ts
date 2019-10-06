import { CalendarModel } from "@Models/calendar.model"
import mongoose from "@Config/connections/mongoose"
import Errors from "@Utils/errors"


export async function getDayByTime(userId: string, time: Date) {
  let lastDayOfTime = new Date(time)
  lastDayOfTime.setDate(time.getDate() - 1)
  let nextDayOfTime = new Date(time)
  nextDayOfTime.setDate(time.getDate() + 1)

  let userActiveDays = await CalendarModel.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
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
  console.log('userActiveDays: ', userActiveDays)
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
