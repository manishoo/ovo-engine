/*
 * cognition.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {
	CONTEXTS,
	EXPECTATIONS,
	GUEST_TEMP_FIELDS,
	INPUT_TYPES,
	Message,
	MessageBackgroundInformation,
	MessagePayload
} from '@Types/assistant'
import { LANGUAGE_CODES } from '@Types/common'
import { GENDER, MealUnit, User } from '@Types/user'
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
	static async recognizeContext(message: Message, backgroundInfo: MessageBackgroundInformation): Promise<CONTEXTS> {
		return CONTEXTS.introduction
	}

	static async replyToConversation(context: CONTEXTS, messagePayload: MessagePayload, backgroundInfo: MessageBackgroundInformation, lang: LANGUAGE_CODES): Promise<Message[]> {
		const message = messagePayload.messages[0]

		const m = message ? message.text : undefined
		if (!messagePayload.token) throw new Error('no token provided')
		const t = messagePayload.token

		switch (context) {
			case CONTEXTS.introduction:
			default:
				/**
				 * If we haven't talked before
				 * */
				if (backgroundInfo.conversationHistory.length === 0) {
					return askForName(lang)
				}

				const lastMessageData = getLastMessageData(backgroundInfo.conversationHistory)
				if (!lastMessageData) throw new Error('invalid message')

				try {
					if (!m) throw new Error('no message provided')

					switch (lastMessageData.expect) {
						case EXPECTATIONS.nickname: {
							const nickname = Language.extractNickname(m || '')
							await keepInMind(t, GUEST_TEMP_FIELDS.nickname, nickname)

							return askForAge(lang, nickname)
						}
						case EXPECTATIONS.age: {
							const age = await Language.extractAge(m)
							await keepInMind(t, GUEST_TEMP_FIELDS.age, age)

							return askForWeight(lang)
						}
						case EXPECTATIONS.weight: {
							const weight = Language.extractWeight(message.data)
							await keepInMind(t, GUEST_TEMP_FIELDS.weight, weight)

							return askForHeight(lang)
						}
						case EXPECTATIONS.height: {
							const height = Language.extractHeight(message.data)
							await keepInMind(t, GUEST_TEMP_FIELDS.height, height)

							return askForGender(lang)
						}
						case EXPECTATIONS.gender: {
							if (!message.data) throw new Error('invalid message')
							if (!message.data.value) throw new Error('invalid message')
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
						case EXPECTATIONS.activity: {
							if (!message.data) throw new Error('invalid message')
							if (!message.data.value) throw new Error('invalid message')
							// TODO VALIDATION
							const activity = message.data.value
							console.log('activity', activity)
							await keepInMind(t, GUEST_TEMP_FIELDS.activity, activity)

							const tempData = await Memory.shortTerm.getGuestTempData(t)
							const tdee = await NutritionCalculator.calculateTDEE(tempData.bmr, activity)
							await keepInMind(t, GUEST_TEMP_FIELDS.tdee, tdee)

							return askForGoal(lang, tdee, Number(tempData.weight), Number(tempData.height))
						}
						case EXPECTATIONS.goal: {
							if (!message.data) throw new Error('invalid message')
							if (!message.data.value) throw new Error('invalid message')
							// TODO VALIDATION
							const goal = message.data.value
							await keepInMind(t, GUEST_TEMP_FIELDS.goal, goal)

							return askForRegistration(lang)
						}
						case EXPECTATIONS.register: {
							const data = message.data
							const validatedData = Validators.validateRegistration(data)
							const userService = Container.get(UserService)

							const tempData = await userService.getTempData(t)

							await userService.createNewUser(<User>{
								username: validatedData.username,
								persistedPassword: await generateHashPassword(validatedData.password),
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
								meals: createDefaultMealDistribution(),
								session: t,
								avatar: {
									url: generateAvatarUrl(validatedData.username, tempData.gender)
								}
							})
							return askForMealPlan(lang, tempData.tdee)
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
						createMessage('I didn\'t get that, can you say it again?', { ...lastMessageData, error: true })
					]
				}
		}
	}
}

function createDefaultMealDistribution(): MealUnit[] {
	return [
		{
			energyPercentageOfDay: 30,
			time: '09:00',
			name: __('Breakfast'),
			availableTime: 90,
			cook: false,
		},
		{
			energyPercentageOfDay: 30,
			time: '14:00',
			name: __('Lunch'),
			availableTime: 90,
			cook: true,
		},
		{
			energyPercentageOfDay: 40,
			time: '21:00',
			name: __('Dinner'),
			availableTime: 90,
			cook: true,
		}
	]
}

function askForName(lang: LANGUAGE_CODES) {
	return [
		createMessage(__({ phrase: 'assistantAskName', locale: lang }), {
			expect: EXPECTATIONS.nickname,
		}),
	]
}

function askForAge(lang: LANGUAGE_CODES, nickname: string) {
	return [
		createMessage(__({ phrase: 'assistantExplainNext1', locale: lang }, { name: nickname })),
		createMessage(__({ phrase: 'assistantExplainNext2', locale: lang })),
		createMessage(__({ phrase: 'assistantAskAge', locale: lang }), {
			expect: EXPECTATIONS.age,
			type: INPUT_TYPES.number
		}),
	]
}

function askForWeight(lang: LANGUAGE_CODES,) {
	return [
		createMessage(__({ phrase: 'assistantAskWeight', locale: lang }), {
			expect: EXPECTATIONS.weight,
			type: INPUT_TYPES.weight
		})
	]
}

function askForHeight(lang: LANGUAGE_CODES,) {
	return [
		createMessage(__({ phrase: 'assistantAskHeight', locale: lang }), {
			expect: EXPECTATIONS.height,
			type: INPUT_TYPES.height,
		})
	]
}

function askForGender(lang: LANGUAGE_CODES) {
	return [
		createMessage(__({ phrase: 'assistantAskGender', locale: lang }), {
			expect: EXPECTATIONS.gender,
			type: INPUT_TYPES.select,
			items: generateGenderSelect(lang),
		})
	]
}

function askForActivity(lang: LANGUAGE_CODES, bmr: number, gender: GENDER) {
	return [
		createMessage(__({ phrase: 'assistantShowBMR', locale: lang }, { bmr: String(bmr) })),
		createMessage(__({ phrase: 'assistantExplainActivity', locale: lang })),
		createMessage(__({ phrase: 'assistantAskActivity', locale: lang }), {
			expect: EXPECTATIONS.activity,
			type: INPUT_TYPES.select,
			items: generateActivitySelect(lang, gender)
		})
	]
}

function askForGoal(lang: LANGUAGE_CODES, tdee: number, weight: number, height: number) {
	return [
		createMessage(__({ phrase: 'assistantExplainTDEE', locale: lang }, { tdee: String(tdee) })),
		createMessage(__({ phrase: 'assistantAskGoal', locale: lang }), {
			expect: EXPECTATIONS.goal,
			type: INPUT_TYPES.select,
			items: generateGoalOptions(lang, weight, height),
		})
	]
}

function askForRegistration(lang: LANGUAGE_CODES,) {
	return [
		createMessage(__({ phrase: 'goRegister', locale: lang }), {
			expect: EXPECTATIONS.register,
			type: INPUT_TYPES.form,
		})
	]
}

function askForMealPlan(lang: LANGUAGE_CODES, targetCalories: number) {
	return [
		createMessage(__({ phrase: 'assistantWhatHappensNext1', locale: lang })),
		createMessage(__({
			phrase: 'assistantWhatHappensNext2',
			locale: lang
		}, { cal: String(Math.ceil(targetCalories)) }), {
			expect: EXPECTATIONS.mealPlan,
			type: INPUT_TYPES.select,
			items: [{ text: __({ phrase: 'ok', locale: lang }), value: 'ok' }]
		})
	]
}
