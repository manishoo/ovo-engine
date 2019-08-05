/*
 * get-food-translation.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { translationInstance } from '@Types/food-database'
import { LanguageCode } from '@Types/common'

export function getFoodTranslation(translations: translationInstance[], lang: LanguageCode) {
	let name = ''
	let description = ''

	const foodTrs = translations.filter(p => p.lang === lang)

	const ourLangFoodTrs = foodTrs.filter(p => p.lang === lang)
	const nameFieldIndex = ourLangFoodTrs.findIndex(p => p.field == 'name')
	const descFieldIndex = ourLangFoodTrs.findIndex(p => p.field == 'description')

	if ((nameFieldIndex !== undefined) && ourLangFoodTrs[nameFieldIndex]) {
		name = ourLangFoodTrs[nameFieldIndex].text
	}

	if ((descFieldIndex !== undefined) && ourLangFoodTrs[descFieldIndex]) {
		description = ourLangFoodTrs[descFieldIndex].text
	}

	return {
		name,
		description,
	}
}