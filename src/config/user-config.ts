/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, ObjectId } from '@Types/common'
import { MealAvailableTime, MealSize, NutritionProfileInput, NutritionProfileMode, UserMeal } from '@Types/user'
import dotenv from 'dotenv'
import { __ } from 'i18n'


dotenv.config()

export default {
  defaultUserMeals(locale: LanguageCode): UserMeal[] {
    return [
      {
        id: 'breakfast',
        name: __({ phrase: 'Breakfast', locale }),
        availableTime: MealAvailableTime.littleTime,
        cook: false,
        time: '08:00',
        size: MealSize.normal,
      },
      {
        id: 'snack1',
        name: __({ phrase: 'Snack', locale }),
        availableTime: MealAvailableTime.noTime,
        cook: false,
        time: '10:00',
        size: MealSize.tiny,
      },
      {
        id: 'lunch',
        name: __({ phrase: 'Lunch', locale }),
        availableTime: MealAvailableTime.lotsOfTime,
        cook: true,
        time: '13:00',
        size: MealSize.big,
      },
      {
        id: 'snack2',
        name: __({ phrase: 'Snack', locale }),
        availableTime: MealAvailableTime.noTime,
        cook: false,
        time: '17:30',
        size: MealSize.tiny,
      },
      {
        id: 'dinner',
        name: __({ phrase: 'Dinner', locale }),
        availableTime: MealAvailableTime.moreTime,
        cook: true,
        time: '21:00',
        size: MealSize.normal,
      }
    ]
  },
  get defaultNutritionProfile() {
    return {
      id: new ObjectId(),
      mode: NutritionProfileMode.range,
      isStrict: false,
      calories: 2000,
      carbs: {
        percentage: 60,
        max: 250,
        min: 200,
      },
      fat: {
        percentage: 15,
        max: 90,
        min: 80,
      },
      protein: {
        percentage: 25,
        max: 170,
        min: 150,
      },
    } as NutritionProfileInput
  },
}
