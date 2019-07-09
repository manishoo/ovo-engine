/*
 * validators.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Joi from '@hapi/joi'
import isUUID from 'is-uuid'

export default {
	validateRegistration(data: any) {
		const schema = {
			username: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			timeZone: Joi.string().required(),
		}

		const { value, error } = Joi.validate(data, schema)
		if (error) {
			throw error
		}
		return value
	},

	validateIds(ids?: string[]) {
		let valid = true
		if (!ids || ids.length === 0) return false
		ids.map(id => {
			if (!isUUID.v4(id)) {
				valid = false
			}
		})
		return valid
	},
}