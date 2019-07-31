/*
 * food-variety-translation.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES } from '@Types/common'
import { Food } from '@Types/food'
import { translationInstance } from '@Types/food-database'
import { Weight } from '@Types/weight'
import Errors from '@Utils/errors'

export async function transformFoodVarietyTranslation(translation: translationInstance, lang: LANGUAGE_CODES, withNutrients: boolean, withWeights: boolean): Promise<Food> {
	const foodVariety = translation.foodVariety
	// const food = translation.foodVariety.food

	let weights: Weight[] = []
	if (withWeights && foodVariety.weights) {
		weights = foodVariety.weights.map(w => {
			const foundTr = w.translations.find(p => p.lang === lang)
			if (!foundTr) throw new Errors.Validation('no weight found') //FIXME better

			return {
				description: foundTr.text,
				id: w.publicId,
				unit: w.unit,
				amount: w.amount,
				gramWeight: w.gmWgt,
				seq: w.seq,
			}
		})
	}

	return {
		id: foodVariety.publicId,
		name: translation.text,
		// foodGroup: await getGroupName(food.foodGroup, lang),
		// image: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, false, food.id)} : undefined,
		nutrients: withNutrients ? foodVariety.nutritionalData : undefined,
		weights,
	}
}