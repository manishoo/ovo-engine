/*
 * language.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// import {MealUnit} from '@dao/models/user.model'
// import {coreNLP, CoreNLP} from '@dao/connections/corenlp'
// import {__} from 'i18n'
// import {normalizeTimes} from '@services/app/assistant/utils'
import {Recipe} from '@dao/models/recipe.model'
import {ACTIVITY, GENDER, GOALS, HEIGHT_UNITS, WEIGHT_UNITS} from '~/constants/enums'
import {MacroNutrientDistribution} from '@services/assistant/types'
import {Food} from '@dao/types'
import {Height, WeightUnit} from '@dao/models/user.model'


export default {
	// async extractMealRoutine(text: string): Promise<MealUnit[]> {
	// 	const exp = '(?$mealName [{tag: /J.*/}]? [{tag: NN}]*) [{tag: IN}] (?$time [{tag: CD}] [{tag: NN}]?))'
	// 	const expression = new CoreNLP.simple.Expression(text, exp)
	//
	// 	const expressions = await coreNLP.annotateTokensRegex(expression)  // similarly use pipeline.annotateTokensRegex / pipeline.annotateTregex
	//
	// 	const meals: MealUnit[] = []
	// 	expressions.sentence(0).matches().map((match: any) => {
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
	// 		throw [
	// 			__('mealExample'),
	// 			'I didn\'t get it',
	// 		]
	// 	}
	// 	return normalizeTimes(meals)
	// },

	extractNickname(text: string): string {
		// if (!text) return null
		return text
	},
	async extractAge(text: string): Promise<number> {
		// 21
		// twenty one
		// twenty one years old
		if (text.match(/\d/)) {
			return Number(text)
		} else {
			throw Error()
		}
	},
	extractWeight(data: any): WeightUnit {
		if (!data) throw Error()

		const foundUnit = Object.keys(WEIGHT_UNITS).find(i => i === data.unit)
		if (foundUnit) {
			return {
				value: +data.value,
				unit: <WEIGHT_UNITS>foundUnit
			}
		} else {
			throw Error('unit unacceptable')
		}
	},
	extractHeight(data: any): Height {
		if (!data) throw Error()

		const foundUnit = Object.keys(HEIGHT_UNITS).find(i => i === data.unit)
		if (foundUnit) {
			return {
				value: +data.value,
				unit: <HEIGHT_UNITS>foundUnit
			}
		} else {
			throw Error('unit unacceptable')
		}
	},
	async extractGender(text: string): Promise<string> {
		let g
		Object.keys(GENDER).map((key: any) => {
			if (GENDER[key] === text.replace(/[👱‍♀️‍♂️]/g, '')) {
				g = key
			}
		})
		if (!g) {
			throw Error()
		}
		return g
	},
	async extractActivity(text: string): Promise<string> {
		// one of enum
		let g
		Object.keys(ACTIVITY).map((key: string) => {
			// @ts-ignore
			if (ACTIVITY[key] === text.replace(/[🏋‍♂️‍♀️🏃🚶🛋🔥]/g, '')) {
				// @ts-ignore
				g = key
			}
		})
		if (!g) {
			throw Error()
		}
		return g
	},
	async extractGoals(text: string): Promise<string> {
		let g
		Object.keys(GOALS).map((key: string) => {
			// @ts-ignore
			if (GOALS[key] === text) {
				// @ts-ignore
				g = key
			}
		})
		if (!g) {
			throw Error()
		}
		return g
	},
	async extractFoodAllergies(text: string): Promise<string> {
		return ''
	},
	async extractDiet(text: string): Promise<string> {
		return ''
	},
	async extractDislikedFoods(text: string): Promise<string> {
		return ''
	},
	async extractFoods(text: string): Promise<{ foods: Food[], recipes: Recipe[] }> {
		return {
			foods: [],
			recipes: [],
		}
	},
	extractMealPlanSettings(data: any): MacroNutrientDistribution {
		if (data.mealPlanSettings) {
			return data.mealPlanSettings
		}

		throw Error()
	},
}
