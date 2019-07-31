/*
 * food-variety.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { getGroupName } from '@Services/food/utils/get-group-name'
import { Food } from '@Types/food'
import { foodVarietyInstance } from '@Types/food-database'
import { Weight } from '@Types/weight'
import Errors from '@Utils/errors'
import { setImageUrl } from '@Utils/image-url-setter'
import { LANGUAGE_CODES } from '@Types/common'

export async function transformFoodVariety(foodVariety: foodVarietyInstance, lang: LANGUAGE_CODES): Promise<Food> {
	const food = foodVariety.food

	console.log('foodVariety.weights', foodVariety.weights)

	let weights: Weight[] = []
	if (foodVariety.weights) {
		weights = foodVariety.weights.map(w => {
			const foundTr = w.translations.find(p => p.lang === lang)
			if (!foundTr) throw new Errors.NotFound('no weight found') //FIXME better

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

	const translation = foodVariety.translations[0]
	if (!translation) throw new Errors.NotFound('translation not found')

	return {
		id: foodVariety.publicId,
		name: translation.text,
		foodGroup: await getGroupName(food.foodGroup, lang),
		image: food.pictureFileName ? { url: setImageUrl(food.pictureFileName, true, food.id!) } : undefined, // FIXME setImageUrl
		thumbnail: food.pictureFileName ? { url: setImageUrl(food.pictureFileName, false, food.id!) } : undefined, // FIXME setImageUrl
		nutrients: foodVariety.nutritionalData,
		weights,
	}
}