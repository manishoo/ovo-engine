/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// import {coreNLP, CoreNLP} from '~/dao/connections/corenlp'
import {MealUnit} from 'src/dao/models/user.model'
import w2n from 'words-to-numbers'
import {Message, MessageAdditionalData} from 'src/services/assistant/types'
import Memory from 'src/services/assistant/memory'
import {ACTIVITY, GENDER, GOALS, LANGUAGE_CODES} from 'src/constants/enums'
import {__} from 'i18n'


export function validateTime(text: string): string {
	//TODO uncomplete
	if (text.match(/^\d*$/)) {
		return `${text}:00`
	} else if (text.match(/\b\d\d?:\d\d?\b/)) {
		return text
	} else {
		return String(w2n(text, {fuzzy: true}))
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

// export async function extractMeals(text: string): Promise<MealUnit[]> {
// 	const exp = '(?$mealName [{tag: /J.*/}]? [{tag: NN}]*) [{tag: IN}] (?$time [{tag: CD}] [{tag: NN}]?))'
// 	const expression = new CoreNLP.simple.Expression(text, exp)
//
// 	const expressions = await coreNLP.annotateTokensRegex(expression)  // similarly use pipeline.annotateTokensRegex / pipeline.annotateTregex
//
// 	const meals: MealUnit[] = []
// 	expressions.sentence(0).matches().map(match => {
// 		const name = match.group('mealName').text
// 		const time = match.group('time').text
// 		//TODO handle times
//
// 		meals.push({
// 			name,
// 			time,
// 		})
// 	})
//
// 	if (meals.length == 0) {
// 		throw Error('no meal')
// 	}
// 	return normalizeTimes(meals)
// }

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

export function generateGoalOptions(lang: LANGUAGE_CODES, weight: number, height: number) {
	const bmi = weight / ((height / 100) * (height / 100))
	if (bmi < 18.5) { // underweight
		return [
			{value: GOALS.m, text: __({phrase: 'goal_m', locale: lang})},
			{value: GOALS.mg, text: __({phrase: 'goal_mg', locale: lang})},
			{value: GOALS.ig, text: __({phrase: 'goal_ig', locale: lang})},
			{value: GOALS.sg, text: __({phrase: 'goal_sg', locale: lang})},
			{value: GOALS.ml, text: __({phrase: 'goal_ml', locale: lang})},
			{value: GOALS.sl, text: __({phrase: 'goal_sl', locale: lang})},
			{value: GOALS.il, text: __({phrase: 'goal_il', locale: lang})},
		]
	} else if (bmi >= 25) { // overweight
		return [
			{value: GOALS.m, text: __({phrase: 'goal_m', locale: lang})},
			{value: GOALS.ml, text: __({phrase: 'goal_ml', locale: lang})},
			{value: GOALS.il, text: __({phrase: 'goal_il', locale: lang})},
			{value: GOALS.sl, text: __({phrase: 'goal_sl', locale: lang})},
			{value: GOALS.mg, text: __({phrase: 'goal_mg', locale: lang})},
			{value: GOALS.sg, text: __({phrase: 'goal_sg', locale: lang})},
			{value: GOALS.ig, text: __({phrase: 'goal_ig', locale: lang})},
		]
	}

	return [
		{value: GOALS.m, text: __({phrase: 'goal_m', locale: lang})},
		{value: GOALS.mg, text: __({phrase: 'goal_mg', locale: lang})},
		{value: GOALS.ml, text: __({phrase: 'goal_ml', locale: lang})},
		{value: GOALS.sg, text: __({phrase: 'goal_sg', locale: lang})},
		{value: GOALS.sl, text: __({phrase: 'goal_sl', locale: lang})},
		{value: GOALS.ig, text: __({phrase: 'goal_ig', locale: lang})},
		{value: GOALS.il, text: __({phrase: 'goal_il', locale: lang})},
	]
}

export function generateActivitySelect(lang: LANGUAGE_CODES, gender: GENDER) {
	return Object.keys(ACTIVITY).map((i: string) => {
		// @ts-ignore
		switch (ACTIVITY[i]) {
			case ACTIVITY.sed:
				return {
					text: '🛋' + __({phrase: 'sedActivity', locale: lang}),
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
					text: `${emoji}${__({phrase: 'lightActivity', locale: lang})}`,
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
					text: `${emoji}${__({phrase: 'modActivity', locale: lang})}`,
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
					text: `${emoji}${__({phrase: 'highActivity', locale: lang})}`,
					value: ACTIVITY.high,
				}
			}
			case ACTIVITY.extreme:
				return {
					text: '🔥' + __({phrase: 'extremeActivity', locale: lang}),
					value: ACTIVITY.extreme,
				}
		}
	})
}

export function generateGenderSelect(lang: LANGUAGE_CODES) {
	return [
		...Object.keys(GENDER).map(i => {
			// @ts-ignore
			const gender = GENDER[i]
			switch (gender) {
				case GENDER.female:
					return {text: `👱‍♀️${__({locale: lang, phrase: 'female'})}`, value: 'female'}
				case GENDER.male:
				default:
					return {text: `👱‍♂️${__({locale: lang, phrase: 'male'})}`, value: 'male'}
			}
		}),
		// {text: __('ratherNotSay')}
	]
}


export function generateMealPlanSettings(tdee: number) {
	return {
		carbs: 0.2,
		fat: 0.3,
		protein: 0.5,
		tdee,
	}
}