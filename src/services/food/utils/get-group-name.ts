/*
 * get-group-name.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES } from '@Types/common'
import { includeFoodGroupTranslations } from './includes'
import { foodGroupInstance } from '@Types/food-database'
import { FoodGroupModel } from '@Models'

export async function getGroupName(foodGroup: foodGroupInstance, lang: LANGUAGE_CODES): Promise<{ name: string, id: string }[]> {
	function getTranslation(fg: foodGroupInstance): string {
		let name = ''
		const tr = fg.translations.find(p => p.lang === lang)

		if (tr) {
			name = tr.text
		}

		return name
	}

	const groupArray: { name: string, id: string }[] = []

	groupArray.push({
		name: getTranslation(foodGroup),
		id: foodGroup.publicId,
	})
	let parent = foodGroup.parentId
	while (parent) {
		// get the parent and add it to array
		const p = await FoodGroupModel.findByPk(parent, {
			include: [includeFoodGroupTranslations()]
		})
		if (!p) throw new Error('invalid food group')

		groupArray.push({
			name: getTranslation(p),
			id: p.publicId,
		})
		parent = p.parentId
	}

	return groupArray
}