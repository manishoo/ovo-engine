/*
 * household.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Household, HouseholdModel} from '~/dao/models/household.model'

export default {
	async create(data: Household) {
		try {
			const newHousehold = new HouseholdModel(data)
			return newHousehold.save()
		} catch (e) {
			console.log(e)
			throw e
		}
	},
	async findOrCreate(data: Household) {
		console.log('.')
		const result = await HouseholdModel.findOne(data)
		if (result) { // had result
			return result
		} else {
			const newHousehold = new HouseholdModel(data)
			return newHousehold.save()
		}
	},
}