/*
 * cognition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import userConfig from '@Config/user-config'
import { UserModel } from '@Models/user.model'
import {
  AssistantExpectations,
  ConversationContext,
  GUEST_TEMP_FIELDS,
  Message,
  MessageAdditionalData,
  MessageBackgroundInformation,
  MessagePayload,
  MessageType
} from '@Types/assistant'
import { LanguageCode } from '@Types/common'
import { Gender, User } from '@Types/user'
import Errors from '@Utils/errors'
import { generateAvatarUrl } from '@Utils/generate-avatar-url'
import { logError } from '@Utils/logger'
import { generateHashPassword } from '@Utils/password-manager'
import { __ } from 'i18n'
import { Container } from 'typedi'
import NutritionCalculator from '../../meal-plan/utils/nutrition-calculator'
import UserService from '../../user/user.service'
import Language from './language'
import Memory from './memory'
import {
  createMessage,
  generateActivitySelect,
  generateGenderSelect,
  generateGoalOptions,
  getLastMessageData,
  keepInMind
} from './utils'
import Validators from './validators'


export default class Cognition {
  static async recognizeContext(message: Message, backgroundInfo: MessageBackgroundInformation): Promise<ConversationContext> {
    return ConversationContext.introduction
  }

  static async replyToConversation(context: ConversationContext, messagePayload: MessagePayload, backgroundInfo: MessageBackgroundInformation, lang: LanguageCode): Promise<Message[]> {
    const message = messagePayload.messages[0]

    const m = message ? message.text : undefined
    if (!messagePayload.token) throw new Errors.Forbidden('no token provided')
    const t = messagePayload.token

    switch (context) {
      case ConversationContext.introduction:
      default:
        /**
         * If we haven't talked before
         * */
        if (backgroundInfo.conversationHistory.length === 0) {
          return askForName(lang)
        }

        const lastMessageData = getLastMessageData(backgroundInfo.conversationHistory)
        if (!lastMessageData) throw new Errors.Validation('invalid message')

        try {
          if (!m) throw new Errors.Validation('no message provided')

          switch (lastMessageData.expect) {
            case AssistantExpectations.nickname: {
              const nickname = Language.extractNickname(m || '')
              await keepInMind(t, GUEST_TEMP_FIELDS.nickname, nickname)

              return askForAge(lang, nickname)
            }
            case AssistantExpectations.age: {
              const age = await Language.extractAge(m)
              await keepInMind(t, GUEST_TEMP_FIELDS.age, age)

              return askForWeight(lang)
            }
            case AssistantExpectations.weight: {
              const weight = Language.extractWeight(message.data)
              await keepInMind(t, GUEST_TEMP_FIELDS.weight, weight)

              return askForHeight(lang)
            }
            case AssistantExpectations.height: {
              const height = Language.extractHeight(message.data)
              await keepInMind(t, GUEST_TEMP_FIELDS.height, height)

              return askForGender(lang)
            }
            case AssistantExpectations.gender: {
              if (!message.data) throw new Errors.Validation('invalid message')
              if (!message.data.value) throw new Errors.Validation('invalid message')
              // if (m !== __({locale: lang, phrase: 'ratherNotSay'})) {
              // const gender = await Language.extractGender(m)
              // TODO VALIDATION
              await keepInMind(t, GUEST_TEMP_FIELDS.gender, message.data.value)
              // }
              const tmpData = await Memory.shortTerm.getGuestTempData(t)
              const bmr = await NutritionCalculator.calculateBMR(+tmpData.height.value, +tmpData.weight.value, +tmpData.age, tmpData.gender)
              await keepInMind(t, GUEST_TEMP_FIELDS.bmr, bmr)

              return askForActivity(lang, bmr, tmpData.gender)
            }
            case AssistantExpectations.activity: {
              if (!message.data) throw new Errors.Validation('invalid message')
              if (!message.data.value) throw new Errors.Validation('invalid message')
              // TODO VALIDATION
              const activity = message.data.value
              await keepInMind(t, GUEST_TEMP_FIELDS.activity, activity)

              const tempData = await Memory.shortTerm.getGuestTempData(t)
              const tdee = await NutritionCalculator.calculateTDEE(tempData.bmr, activity)
              await keepInMind(t, GUEST_TEMP_FIELDS.tdee, tdee)

              return askForGoal(lang, tdee, Number(tempData.weight), Number(tempData.height))
            }
            case AssistantExpectations.goal: {
              if (!message.data) throw new Errors.Validation('invalid message')
              if (!message.data.value) throw new Errors.Validation('invalid message')
              // TODO VALIDATION
              const goal = message.data.value
              await keepInMind(t, GUEST_TEMP_FIELDS.goal, goal)

              return askForMeals(lang)
            }
            case AssistantExpectations.meals: {
              if (!message.data) throw new Errors.Validation('invalid message')
              if (!message.data.meals) throw new Errors.Validation('invalid message')
              // TODO VALIDATION
              const meals = message.data.meals
              await keepInMind(t, GUEST_TEMP_FIELDS.meals, meals)

              return askForRegistration(lang)
            }
            case AssistantExpectations.register: {
              const data = message.data
              const validatedData = Validators.validateRegistration(data)
              const userService = Container.get(UserService)
              const tempData = await userService.getTempData(t)

              const user = await UserModel.create(<Partial<User>>{
                username: validatedData.username,
                password: await generateHashPassword(validatedData.password),
                email: validatedData.email,
                timeZone: validatedData.timeZone,
                firstName: tempData.nickname,
                // bmr: tempData.bmr,
                mealPlanSettings: tempData.mealPlanSettings,
                caloriesPerDay: tempData.tdee,
                height: tempData.height,
                weight: tempData.weight,
                age: tempData.age,
                activityLevel: tempData.activity,
                goal: tempData.goal,
                gender: tempData.gender,
                meals: tempData.meals,
                session: t,
                avatar: {
                  url: generateAvatarUrl(validatedData.username, tempData.gender)
                }
              })

              return askForMealPlan(lang, tempData.tdee, user)
            }
          }

          return []
        } catch (e) {
          if (Array.isArray(e)) {
            return e.map(error => {
              logError('Cognition->catch1')(error)
              return createMessage(error, { ...lastMessageData, error: true })
            })
          }

          logError('Cognition->catch2')(e)
          return [
            // FIXME return a complete message
            createMessage(__({ phrase: 'assistantError', locale: lang }), { ...lastMessageData, error: true })
          ]
        }
    }
  }
}

function askForName(lang: LanguageCode) {
  return [
    createMessage(__({ phrase: 'assistantAskName', locale: lang }), {
      expect: AssistantExpectations.nickname,
    }),
  ]
}

function askForAge(lang: LanguageCode, nickname: string) {
  return [
    createMessage(__({ phrase: 'assistantExplainNext1', locale: lang }, { name: nickname })),
    createMessage(__({ phrase: 'assistantExplainNext2', locale: lang })),
    createMessage(__({ phrase: 'assistantAskAge', locale: lang }), {
      expect: AssistantExpectations.age,
      type: MessageType.number
    }),
  ]
}

function askForWeight(lang: LanguageCode,) {
  return [
    createMessage(__({ phrase: 'assistantAskWeight', locale: lang }), {
      expect: AssistantExpectations.weight,
      type: MessageType.weight
    })
  ]
}

function askForHeight(lang: LanguageCode,) {
  return [
    createMessage(__({ phrase: 'assistantAskHeight', locale: lang }), {
      expect: AssistantExpectations.height,
      type: MessageType.height,
    })
  ]
}

function askForGender(lang: LanguageCode) {
  return [
    createMessage(__({ phrase: 'assistantAskGender', locale: lang }), {
      expect: AssistantExpectations.gender,
      type: MessageType.select,
      items: generateGenderSelect(lang),
    })
  ]
}

function askForActivity(lang: LanguageCode, bmr: number, gender: Gender) {
  return [
    createMessage(__({ phrase: 'assistantShowBMR', locale: lang }, { bmr: String(bmr) })),
    createMessage(__({ phrase: 'assistantExplainActivity', locale: lang })),
    createMessage(__({ phrase: 'assistantAskActivity', locale: lang }), {
      expect: AssistantExpectations.activity,
      type: MessageType.select,
      items: generateActivitySelect(lang, gender)
    })
  ]
}

function askForGoal(lang: LanguageCode, tdee: number, weight: number, height: number) {
  return [
    createMessage(__({ phrase: 'assistantExplainTDEE', locale: lang }, { tdee: String(tdee) })),
    createMessage(__({ phrase: 'assistantAskGoal', locale: lang }), {
      expect: AssistantExpectations.goal,
      type: MessageType.select,
      items: generateGoalOptions(lang, weight, height),
    })
  ]
}

function askForMeals(lang: LanguageCode) {
  return [
    createMessage(__({ phrase: 'assistantAskMeals', locale: lang }), {
      expect: AssistantExpectations.meals,
      type: MessageType.meals,
      meals: userConfig.defaultUserMeals(lang)
    } as MessageAdditionalData)
  ]
}

function askForRegistration(lang: LanguageCode,) {
  return [
    createMessage(__({ phrase: 'goRegister', locale: lang }), {
      expect: AssistantExpectations.register,
      type: MessageType.form,
    })
  ]
}

function askForMealPlan(lang: LanguageCode, targetCalories: number, user: User) {
  return [
    createMessage(__({ phrase: 'assistantWhatHappensNext1', locale: lang })),
    createMessage(__({
      phrase: 'assistantWhatHappensNext2',
      locale: lang
    }, { cal: String(Math.ceil(targetCalories)) }), {
      expect: AssistantExpectations.mealPlan,
      type: MessageType.select,
      items: [{ text: __({ phrase: 'ok', locale: lang }), value: 'ok' }],
      user,
    })
  ]
}
