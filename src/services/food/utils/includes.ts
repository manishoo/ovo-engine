/*
 * includes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ContentModel, FoodGroupModel, TranslationModel, WeightModel } from '@Models'

export function includeFoodGroup() {
	return {
		model: FoodGroupModel,
		required: true,
		include: [
			// {model: FoodGroupTr, required: true, as: 'translations'}
			includeFoodGroupTranslations()
		],
		as: 'foodGroup',
	}
}

export function includeWeights(foodSource?: string) {
	let where: any = undefined
	if (foodSource) {
		where = { foodSource }
	}
	return {
		model: WeightModel,
		include: [
			{
				model: TranslationModel,
				required: true,
				as: 'translations',
				where: { sourceType: 'weight' },
			}
		],
		as: 'weights',
		where,
	}
}

export function includeContentsShallow() {
	return {
		model: ContentModel,
		required: true,
		as: 'contents',
		where: {
			citation: 'USDA',
			// sourceType: 'Nutrient',
			// origSourceName: 'Energy',
			// origUnit: 'kcal',
		},
		// separate: true,
		// include: [{
		// 	model: Translation,
		// 	required: true,
		// 	as: 'translations',
		// 	where: {
		// 		field: 'common_name', // FIXME
		// 		sourceType: 'food_usda', // FIXME
		// 	},
		// }],
	}
}

export function includeFoodTranslations() {
	return {
		model: TranslationModel,
		required: true,
		as: 'translations',
		where: { sourceType: 'food' },
	}
}

export function includeFoodGroupTranslations() {
	return {
		model: TranslationModel,
		required: true,
		as: 'translations',
		where: { sourceType: 'food_group' },
	}
}