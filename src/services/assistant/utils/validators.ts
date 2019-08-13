/*
 * validators.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Joi from '@hapi/joi'


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
  }
}
