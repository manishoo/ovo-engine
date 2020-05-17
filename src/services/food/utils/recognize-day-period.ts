/*
 * recognize-day-period.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DAY_PERIOD } from '@Types/plan'


export function recognizeDayPeriod(time: string): DAY_PERIOD {
  const splitTime = time.split(':')
  if (splitTime[0].length !== 2) throw Error('time format should be HH:mm')
  if (splitTime[1].length !== 2) throw Error('time format should be HH:mm')

  const baseDate = new Date()
  const mealDate = baseDate
  const noonDate = baseDate
  const afterNoonDate = baseDate
  const morningDate = baseDate
  const nightDate = baseDate

  morningDate.setHours(0)
  noonDate.setHours(12)
  afterNoonDate.setHours(18)
  nightDate.setHours(23)
  nightDate.setMinutes(59)

  mealDate.setHours(+splitTime[0])
  mealDate.setMinutes(+splitTime[1])

  if (mealDate >= morningDate && mealDate < noonDate) {
    // breakfast
    return DAY_PERIOD.breakfast
  } else if (mealDate >= noonDate && mealDate < afterNoonDate) {
    // launch
    return DAY_PERIOD.launch
  } else if (mealDate >= afterNoonDate && mealDate < nightDate) {
    // dinner
    return DAY_PERIOD.dinner
  } else {
    throw Error('time is not correct')
  }
}
