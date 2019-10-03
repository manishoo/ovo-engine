import { CalendarModel } from "@Models/calendar.model"
import mongoose from "@Config/connections/mongoose"


export async function getDayByTime(userId: string, time: Date) {
  console.log('date: ', time)
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

  userActiveDays.map(activeDay => {
    if (
      (activeDay._id.year == time.getFullYear()) &&
      (activeDay._id.month == time.getMonth() + 1) &&
      (activeDay._id.day == time.getDate())) {

      dayId = activeDay.items[0]
    }
  })

  if (!dayId) {

    let dayCreationDate = new Date(time)
    dayCreationDate.setUTCHours(0)
    dayCreationDate.setHours(0)
    dayCreationDate.setUTCMinutes(0)

    let day = await CalendarModel.create({
      date: time,
      user: userId,
    })
    dayId = day.id
  }

  return dayId
}
