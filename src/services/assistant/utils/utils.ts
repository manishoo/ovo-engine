/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Message, MessageAdditionalData, MessageSenders, MessageType } from '@Types/assistant'
import { LanguageCode } from '@Types/common'
import { ActivityLevel, Gender, Goal, UserMeal } from '@Types/user'
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

export function normalizeTimes(meals: UserMeal[]) {
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
      { value: Goal.m, text: __({ phrase: 'goal_m', locale: lang }) },
      { value: Goal.mg, text: __({ phrase: 'goal_mg', locale: lang }) },
      { value: Goal.ig, text: __({ phrase: 'goal_ig', locale: lang }) },
      { value: Goal.sg, text: __({ phrase: 'goal_sg', locale: lang }) },
      { value: Goal.ml, text: __({ phrase: 'goal_ml', locale: lang }) },
      { value: Goal.sl, text: __({ phrase: 'goal_sl', locale: lang }) },
      { value: Goal.il, text: __({ phrase: 'goal_il', locale: lang }) },
    ]
  } else if (bmi >= 25) { // overweight
    return [
      { value: Goal.m, text: __({ phrase: 'goal_m', locale: lang }) },
      { value: Goal.ml, text: __({ phrase: 'goal_ml', locale: lang }) },
      { value: Goal.il, text: __({ phrase: 'goal_il', locale: lang }) },
      { value: Goal.sl, text: __({ phrase: 'goal_sl', locale: lang }) },
      { value: Goal.mg, text: __({ phrase: 'goal_mg', locale: lang }) },
      { value: Goal.sg, text: __({ phrase: 'goal_sg', locale: lang }) },
      { value: Goal.ig, text: __({ phrase: 'goal_ig', locale: lang }) },
    ]
  }

  return [
    { value: Goal.m, text: __({ phrase: 'goal_m', locale: lang }) },
    { value: Goal.mg, text: __({ phrase: 'goal_mg', locale: lang }) },
    { value: Goal.ml, text: __({ phrase: 'goal_ml', locale: lang }) },
    { value: Goal.sg, text: __({ phrase: 'goal_sg', locale: lang }) },
    { value: Goal.sl, text: __({ phrase: 'goal_sl', locale: lang }) },
    { value: Goal.ig, text: __({ phrase: 'goal_ig', locale: lang }) },
    { value: Goal.il, text: __({ phrase: 'goal_il', locale: lang }) },
  ]
}

export function generateActivitySelect(lang: LanguageCode, gender: Gender) {
  return Object.keys(ActivityLevel).map((i: string) => {
    // @ts-ignore
    switch (ActivityLevel[i]) {
      case ActivityLevel.sed:
        return {
          text: '🛋' + __({ phrase: 'sedActivity', locale: lang }),
          value: ActivityLevel.sed,
        }
      case ActivityLevel.light: {
        let emoji
        if (gender === Gender.female) {
          emoji = '🚶‍♀️'
        } else {
          emoji = '🚶‍♂️'
        }
        return {
          text: `${emoji}${__({ phrase: 'lightActivity', locale: lang })}`,
          value: ActivityLevel.light,
        }
      }
      case ActivityLevel.mod: {
        let emoji
        if (gender === Gender.female) {
          emoji = '🏃‍♀️'
        } else {
          emoji = '🏃‍♂️'
        }
        return {
          text: `${emoji}${__({ phrase: 'modActivity', locale: lang })}`,
          value: ActivityLevel.mod,
        }
      }
      case ActivityLevel.high: {
        let emoji
        if (gender === Gender.female) {
          emoji = '🏋‍♀️'
        } else {
          emoji = '🏋‍♂️'
        }
        return {
          text: `${emoji}${__({ phrase: 'highActivity', locale: lang })}`,
          value: ActivityLevel.high,
        }
      }
      case ActivityLevel.extreme:
        return {
          text: '🔥' + __({ phrase: 'extremeActivity', locale: lang }),
          value: ActivityLevel.extreme,
        }
    }
  })
}

export function generateGenderSelect(lang: LanguageCode) {
  return [
    ...Object.keys(Gender).map(i => {
      // @ts-ignore
      const gender = Gender[i]
      switch (gender) {
        case Gender.female:
          return { text: `👱‍♀️${__({ locale: lang, phrase: 'female' })}`, value: 'female' }
        case Gender.male:
        default:
          return { text: `👱‍♂️${__({ locale: lang, phrase: 'male' })}`, value: 'male' }
      }
    }),
  ]
}

export function createMessage(text: string, data: any = {}, sender?: MessageSenders): Message {
  return {
    id: uuid(),
    sender: sender || MessageSenders.assistant,
    text,
    timestamp: String(Date.now()),
    type: data.type ? data.type : MessageType.text,
    data, // TODO fix
  }
}
