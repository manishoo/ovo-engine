/*
 * user.validator.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Joi from '@hapi/joi'

class UserValidator {
	validateRegistration(data: any) {
		const schema = {
			username: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			timeZone: Joi.string().required(),
			gender: Joi.string(),
		}

		const { value, error } = Joi.validate(data, schema)
		if (error) {
			throw error
		}
		return value
	}
}

const userValidator = new UserValidator()

export default userValidator