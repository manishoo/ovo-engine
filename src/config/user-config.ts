/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode } from '@Types/common'
import { MealAvailableTime, MealSize, NutritionProfile, NutritionProfileMode, UserMeal } from '@Types/user'
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
        time: '09:00',
        size: MealSize.tiny,
      },
      {
        id: 'lunch',
        name: __({ phrase: 'Lunch', locale }),
        availableTime: MealAvailableTime.someTime,
        cook: true,
        time: '13:00',
        size: MealSize.normal,
      },
      {
        id: 'snack',
        name: __({ phrase: 'Snack', locale }),
        availableTime: MealAvailableTime.noLimit,
        cook: false,
        time: '17:30',
        size: MealSize.normal,
      },
      {
        id: 'dinner',
        name: __({ phrase: 'Dinner', locale }),
        availableTime: MealAvailableTime.moreTime,
        cook: true,
        time: '21:00',
        size: MealSize.big,
      }
    ]
  },
  defaultNutritionProfile: {
    mode: NutritionProfileMode.range,
    isStrict: false,
    calories: 2000,
    carbs: {
      max: 250,
      min: 200,
      get average(): number {
        return this.max + this.min / 2
      }
    },
    fat: {
      max: 90,
      min: 80,
      get average(): number {
        return this.max + this.min / 2
      }
    },
    protein: {
      max: 170,
      min: 150,
      get average(): number {
        return this.max + this.min / 2
      }
    },
  } as NutritionProfile,
}
