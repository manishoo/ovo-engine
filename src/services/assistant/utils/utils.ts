/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Message, MessageAdditionalData } from '@Types/assistant'
import { LanguageCode } from '@Types/common'
import { ACTIVITY, GENDER, GOALS, MealUnit } from '@Types/user'
import { __ } from 'i18n'
import uuid from 'uuid/v1'
import w2n from 'words-to-numbers'
import Memory from './memory'


export function validateTime(text: string): string {
  //TODO uncomplete
  if (text.match(/^\d*$/)) {
    return `${text}:00`
  } else if (text.match(/\b\d\d?:\d\d?\b/)) {
    return text
  } else {
    return String(w2n(text, { fuzzy: true }))
  }
}

export function normalizeTimes(meals: MealUnit[]) {
  let fullClock = true
  meals.forEach((meal) => {
    if (meal.time.includes('pm') || meal.time.includes('am')) {
      fullClock = false
    }
  })

  if (!fullClock) {
    meals = meals.map((meal) => {
      if (!meal.time.includes('pm') && !meal.time.includes('am')) {
        throw Error('one or more times do not have a period')
      }
      meal.time = meal.time.replace(/am|pm/, '').trim()
      meal.time = validateTime(meal.time)
      return meal
    })
  } else {
    meals = meals.map((meal) => {
      meal.time = validateTime(meal.time)
      return meal
    })
  }

  return meals
}

export function getLastMessageData(messages: Message[]) {
  let data: MessageAdditionalData | null = null
  for (let msg of messages) {
    if (msg && msg.data) {
      data = msg.data
    }
  }
  return data
}

export function keepInMind(token: string | null | undefined, field: string, data: any) {
  if (!token) return null
  return Memory.shortTerm.storeGuestTempInfo(token, field, data)
}

export function generateGoalOptions(lang: LanguageCode, weight: number, height: number) {
  const bmi = weight / ((height / 100) * (height / 100))
  if (bmi < 18.5) { // underweight
    return [
      { value: GOALS.m, text: __({ phrase: 'goal_m', locale: lang }) },
      { value: GOALS.mg, text: __({ phrase: 'goal_mg', locale: lang }) },
      { value: GOALS.ig, text: __({ phrase: 'goal_ig', locale: lang }) },
      { value: GOALS.sg, text: __({ phrase: 'goal_sg', locale: lang }) },
      { value: GOALS.ml, text: __({ phrase: 'goal_ml', locale: lang }) },
      { value: GOALS.sl, text: __({ phrase: 'goal_sl', locale: lang }) },
      { value: GOALS.il, text: __({ phrase: 'goal_il', locale: lang }) },
    ]
  } else if (bmi >= 25) { // overweight
    return [
      { value: GOALS.m, text: __({ phrase: 'goal_m', locale: lang }) },
      { value: GOALS.ml, text: __({ phrase: 'goal_ml', locale: lang }) },
      { value: GOALS.il, text: __({ phrase: 'goal_il', locale: lang }) },
      { value: GOALS.sl, text: __({ phrase: 'goal_sl', locale: lang }) },
      { value: GOALS.mg, text: __({ phrase: 'goal_mg', locale: lang }) },
      { value: GOALS.sg, text: __({ phrase: 'goal_sg', locale: lang }) },
      { value: GOALS.ig, text: __({ phrase: 'goal_ig', locale: lang }) },
    ]
  }

  return [
    { value: GOALS.m, text: __({ phrase: 'goal_m', locale: lang }) },
    { value: GOALS.mg, text: __({ phrase: 'goal_mg', locale: lang }) },
    { value: GOALS.ml, text: __({ phrase: 'goal_ml', locale: lang }) },
    { value: GOALS.sg, text: __({ phrase: 'goal_sg', locale: lang }) },
    { value: GOALS.sl, text: __({ phrase: 'goal_sl', locale: lang }) },
    { value: GOALS.ig, text: __({ phrase: 'goal_ig', locale: lang }) },
    { value: GOALS.il, text: __({ phrase: 'goal_il', locale: lang }) },
  ]
}

export function generateActivitySelect(lang: LanguageCode, gender: GENDER) {
  return Object.keys(ACTIVITY).map((i: string) => {
    // @ts-ignore
    switch (ACTIVITY[i]) {
      case ACTIVITY.sed:
        return {
          text: '🛋' + __({ phrase: 'sedActivity', locale: lang }),
          value: ACTIVITY.sed,
        }
      case ACTIVITY.light: {
        let emoji
        if (gender === GENDER.female) {
          emoji = '🚶‍♀️'
        } else {
          emoji = '🚶‍♂️'
        }
        return {
          text: `${emoji}${__({ phrase: 'lightActivity', locale: lang })}`,
          value: ACTIVITY.light,
        }
      }
      case ACTIVITY.mod: {
        let emoji
        if (gender === GENDER.female) {
          emoji = '🏃‍♀️'
        } else {
          emoji = '🏃‍♂️'
        }
        return {
          text: `${emoji}${__({ phrase: 'modActivity', locale: lang })}`,
          value: ACTIVITY.mod,
        }
      }
      case ACTIVITY.high: {
        let emoji
        if (gender === GENDER.female) {
          emoji = '🏋‍♀️'
        } else {
          emoji = '🏋‍♂️'
        }
        return {
          text: `${emoji}${__({ phrase: 'highActivity', locale: lang })}`,
          value: ACTIVITY.high,
        }
      }
      case ACTIVITY.extreme:
        return {
          text: '🔥' + __({ phrase: 'extremeActivity', locale: lang }),
          value: ACTIVITY.extreme,
        }
    }
  })
}

export function generateGenderSelect(lang: LanguageCode) {
  return [
    ...Object.keys(GENDER).map(i => {
      // @ts-ignore
      const gender = GENDER[i]
      switch (gender) {
        case GENDER.female:
          return { text: `👱‍♀️${__({ locale: lang, phrase: 'female' })}`, value: 'female' }
        case GENDER.male:
        default:
          return { text: `👱‍♂️${__({ locale: lang, phrase: 'male' })}`, value: 'male' }
      }
    }),
  ]
}

export function createMessage(text: string, data: any = {}, sender?: string): Message {
  return {
    id: uuid(),
    sender: sender || 'assistant',
    text,
    timestamp: String(Date.now()),
    type: data.type ? data.type : 'text',
    data, // TODO fix
  }
}
