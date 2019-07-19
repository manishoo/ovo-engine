/*
 * weight.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { weightInstance } from '@Types/food-database'
import { LANGUAGE_CODES } from '@Types/common'

export async function transformWeights(weights: weightInstance[], lang: LANGUAGE_CODES) {
	return Promise.all((weights || []).map(async weight => {
		let description
		const wFound = weight.translations && weight.translations.find(p => p.lang === lang)
		if (wFound) {
			description = wFound.text
		}

		return {
			id: weight.publicId,
			description,
			amount: weight.amount,
			gramWeight: weight.gmWgt,
			seq: weight.seq,
			unit: weight.unit,
		}
	}))
}