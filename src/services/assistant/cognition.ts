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
} from '@services/assistant/types'
import {__} from 'i18n'
import {createMessage} from '@services/assistant'
import Language from './language'
import Memory from './memory'
import {
	generateActivitySelect,
	generateGenderSelect,
	generateGoalOptions,
	generateMealPlanSettings,
	getLastMessageData,
	keepInMind
} from '@services/assistant/utils'
import UserService from '@services/user.service'
import NutritionCalculator from '@services/food/nutrition-calculator'
import Validators from '@services/assistant/validators'
import {generateHashPassword} from '@utils/password-manager'
import {MealUnit, User} from '@dao/models/user.model'
import {logError} from '@utils/logger'
import {ACTIVITY, GENDER, GOALS, LANGUAGE_CODES} from '~/constants/enums'
import {generateAvatarUrl} from '@utils/generate-avatar-url'

interface Cognition {
	recognizeContext(message: Message, backgroundInfo: MessageBackgroundInformation): Promise<CONTEXTS>

	replyToConversation(context: CONTEXTS, message: MessagePayload, backgroundInfo: MessageBackgroundInformation, lang: LANGUAGE_CODES): Promise<Message[]>
}

export default <Cognition>{
	async recognizeContext(message, backgroundInfo) {
		return CONTEXTS.introduction
	},

	async replyToConversation(context, messagePayload, backgroundInfo, lang) {
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
				if (!lastMessageData) return null

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
							if (!message.data) return
							if (!message.data.value) return
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
							if (!message.data) return
							if (!message.data.value) return
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
							if (!message.data) return
							if (!message.data.value) return
							// TODO VALIDATION
							const goal = message.data.value
							// const goal = await Language.extractGoals(m)
							await keepInMind(t, GUEST_TEMP_FIELDS.goal, goal)

							return askForRegistration(lang)
						}
						/*case EXPECTATIONS.allergy: {
							const data: MessageAdditionalData = message.data || {}
							if (data.skip) {
								return askForDislikes()
							} else if (Validators.validateIds(data.foods)) {
								await keepInMind(t, GUEST_TEMP_FIELDS.allergies, data.foods)
								return askForDislikes()
							} else {
								throw Error()
							}
						}
						case EXPECTATIONS.dislikedFoods: {
							const data: MessageAdditionalData = message.data || {}
							//TODO incomplete
							if (data.skip) {
								return askForDiet()
							} else if (Validators.validateIds(data.foods)) {
								await keepInMind(t, GUEST_TEMP_FIELDS.allergies, data.foods)
								return askForDiet()
							} else {
								throw Error()
							}
						}
						case EXPECTATIONS.diet: {
							/!**
							 * The answer is either yes or no
							 * *!/
							if (m === __('yes')) {
								return [
									createMessage(__('assistantAskChooseDiet'), {
										expect: EXPECTATIONS.chooseDiet,
										type: INPUT_TYPES.select,
										// @ts-ignore
										items: Object.keys(DIETS).map((k: string) => ({text: DIETS[k]})),
									})
								]
							} else if (m === __('no')) {
								return askNormalRoutine()
							} else {
								throw Error()
							}
						}
						case EXPECTATIONS.chooseDiet: {
							let diet
							Object.keys(DIETS).map((k: string) => {
								// @ts-ignore
								if (DIETS[k] === m) {
									// @ts-ignore
									diet = DIETS[k]
								}
							})
							if (!diet) {
								throw Error()
							}
							// const tempData = await Memory.shortTerm.getGuestTempData(t)
							await keepInMind(t, 'diet', diet)

							return askNormalRoutine()
						}
						case EXPECTATIONS.normalRoutine: {
							if (m === 'Normal') {
								const tmp = await Memory.shortTerm.getGuestTempData(t)
								const mealRoutine = generateDefaultMealRoutine()
								await keepInMind(t, 'mealDistribution', mealRoutine)
								await keepInMind(t, 'meals', [])

								if (!tmp.tdee) {
									throw Error()
								}
								return giveInfo(tmp.tdee)
							} else if (m === 'Different') {
								return [
									createMessage(__('assistantAskRoutine')),
									createMessage(__('assistantShowExample'), {
										expect: EXPECTATIONS.meals,
									}),
								]
							} else {
								throw Error()
							}
						}
						case EXPECTATIONS.meals: { // only if said different
							// const mealDistribution = await Language.extractMealRoutine(m)
							const tmp = await Memory.shortTerm.getGuestTempData(t)
							// await keepInMind(t, 'mealDistribution', mealDistribution)
							await keepInMind(t, 'meals', [])

							if (!tmp.tdee) {
								throw Error()
							}
							return giveInfo(tmp.tdee)
						}
						case EXPECTATIONS.meal: {
							const {foods, recipes} = await Language.extractFoods(m)
							const tmp = await Memory.shortTerm.getGuestTempData(t)

							const mealIndex = tmp['meals'].length
							const targetMeal = tmp.mealDistribution[mealIndex]
							tmp.meals.push({
								mealName: targetMeal.name,
								foods,
								recipes,
							})

							await keepInMind(t, 'meals', tmp.meals)

							// if there was still some left
							const nextMealRoutine = tmp.mealDistribution[mealIndex + 1]
							if (nextMealRoutine) {
								return [
									createMessage(__('askMealRoutine', {mealName: nextMealRoutine.name}), {
										expect: EXPECTATIONS.meal,
										type: INPUT_TYPES.food,
										skip: true,
									})
								]
							} else {
								return askForMealSettings(Number(tmp.tdee))
							}
						}
						case EXPECTATIONS.mealPlanSettings: {
							const MPSettings = await Language.extractMealPlanSettings(message.data)
							await keepInMind(t, 'mealPlanSettings', MPSettings)
							return askForRegistration()
						}*/
						case EXPECTATIONS.register: {
							const data = message.data
							const validatedData = Validators.validateRegistration(data)
							const tempData = await UserService.getTempData(t)

							await UserService.createNewUser(<User>{
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
				} catch (e) {
					if (Array.isArray(e)) {
						return e.map(error => {
							logError('Cognition->catch1')(error)
							return [
								createMessage(error, {...lastMessageData, error: true})
							]
						})
					}

					logError('Cognition->catch2')(e)
					return [
						// FIXME return a complete message
						createMessage('I didn\'t get that, can you say it again?', {...lastMessageData, error: true})
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

function askNormalRoutine() {
	return [
		createMessage(__('assistantExplainMeals')),
		createMessage(__('assistantAskNormalRoutine'), {
			expect: EXPECTATIONS.normalRoutine,
			type: INPUT_TYPES.select,
			items: [{text: __('Normal')}, {text: __('Different')}]
		})
	]
}

function generateDefaultMealRoutine() {
	return [
		{name: 'Breakfast', time: '08:00', energyPercentageOfDay: 30},
		{name: 'Snack1', time: '10:00', energyPercentageOfDay: 5},
		{name: 'Launch', time: '14:00', energyPercentageOfDay: 40},
		{name: 'Dinner', time: '21:00', energyPercentageOfDay: 20},
		{name: 'Snack2', time: '17:00', energyPercentageOfDay: 5},
	]
}

function askForMealSettings(lang: LANGUAGE_CODES, tdee: number) {
	return [
		createMessage(__('mealPlanSettings'), {
			expect: EXPECTATIONS.mealPlanSettings,
			type: INPUT_TYPES.mealPlanSettings,
			mealPlanSettings: generateMealPlanSettings(tdee)
		}),
	]
}

function giveInfo(lang: LANGUAGE_CODES, tdee: number) {
	return [
		createMessage(__('assistant2')),
		createMessage(__('assistant3')),
		// createMessage(__('assistant4')),
		// createMessage(__('askMealRoutine', {mealName: mealDistribution[0].name}), {
		// 	expect: EXPECTATIONS.meal,
		// })
		...askForMealSettings(lang, tdee)
	]
}

function askForName(lang: LANGUAGE_CODES) {
	return [
		createMessage(__({phrase: 'assistantAskName', locale: lang}), {
			expect: EXPECTATIONS.nickname,
		}),
	]
}

function askForAge(lang: LANGUAGE_CODES, nickname: string) {
	return [
		createMessage(__({phrase: 'assistantExplainNext1', locale: lang}, {name: nickname})),
		createMessage(__({phrase: 'assistantExplainNext2', locale: lang})),
		createMessage(__({phrase: 'assistantAskAge', locale: lang}), {expect: EXPECTATIONS.age, type: INPUT_TYPES.number}),
	]
}

function askForWeight(lang: LANGUAGE_CODES,) {
	return [
		createMessage(__({phrase: 'assistantAskWeight', locale: lang}), {
			expect: EXPECTATIONS.weight,
			type: INPUT_TYPES.weight
		})
	]
}

function askForHeight(lang: LANGUAGE_CODES,) {
	return [
		createMessage(__({phrase: 'assistantAskHeight', locale: lang}), {
			expect: EXPECTATIONS.height,
			type: INPUT_TYPES.height,
		})
	]
}

function askForGender(lang: LANGUAGE_CODES) {
	return [
		createMessage(__({phrase: 'assistantAskGender', locale: lang}), {
			expect: EXPECTATIONS.gender,
			type: INPUT_TYPES.select,
			items: generateGenderSelect(lang),
		})
	]
}

function askForActivity(lang: LANGUAGE_CODES, bmr: number, gender: GENDER) {
	return [
		createMessage(__({phrase: 'assistantShowBMR', locale: lang}, {bmr: String(bmr)})),
		createMessage(__({phrase: 'assistantExplainActivity', locale: lang})),
		createMessage(__({phrase: 'assistantAskActivity', locale: lang}), {
			expect: EXPECTATIONS.activity,
			type: INPUT_TYPES.select,
			items: generateActivitySelect(lang, gender)
		})
	]
}

function askForGoal(lang: LANGUAGE_CODES, tdee: number, weight: number, height: number) {
	return [
		createMessage(__({phrase: 'assistantExplainTDEE', locale: lang}, {tdee: String(tdee)})),
		createMessage(__({phrase: 'assistantAskGoal', locale: lang}), {
			expect: EXPECTATIONS.goal,
			type: INPUT_TYPES.select,
			items: generateGoalOptions(lang, weight, height),
		})
	]
}

function askForFoodAllergy() {
	return [
		createMessage(__('assistantAllergy1')),
		createMessage(__('assistantAllergy2'), {
			expect: EXPECTATIONS.allergy,
			type: INPUT_TYPES.food,
			skip: true,
		})
	]
}

function askForDislikes() {
	return [
		createMessage(__('assistantAskDislikes'), {
			expect: EXPECTATIONS.dislikedFoods,
			type: INPUT_TYPES.food,
			skip: true,
		})
	]
}

function askForDiet() {
	return [
		createMessage(__('assistantAskDiet'), {
			expect: EXPECTATIONS.diet,
			type: INPUT_TYPES.select,
			items: [{text: __('yes')}, {text: __('no')}]
		})
	]
}

function askForRegistration(lang: LANGUAGE_CODES,) {
	return [
		createMessage(__({phrase: 'goRegister', locale: lang}), {
			expect: EXPECTATIONS.register,
			type: INPUT_TYPES.form,
		})
	]
}

function askForMealPlan(lang: LANGUAGE_CODES, targetCalories: number) {
	return [
		createMessage(__({phrase: 'assistantWhatHappensNext1', locale: lang})),
		createMessage(__({phrase: 'assistantWhatHappensNext2', locale: lang}, {cal: String(Math.ceil(targetCalories))}), {
			expect: EXPECTATIONS.mealPlan,
			type: INPUT_TYPES.select,
			items: [{text: __({phrase: 'ok', locale: lang}), value: 'ok'}]
		})
	]
}
