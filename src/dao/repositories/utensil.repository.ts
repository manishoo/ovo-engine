/*
 * utensil.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Utensil, UtensilModel} from '@dao/models/utensil.model'

export default {
	async create(data: Utensil) {
		const utensil = new UtensilModel(data)
		return utensil.save()
	},
	async findOrCreate(data: Utensil) {
		console.log('.')
		const result = await UtensilModel.findOne(data)
		if (result) { // had result
			return result
		} else {
			const newUtensil = new UtensilModel(data)
			return newUtensil.save()
		}
	},
}
