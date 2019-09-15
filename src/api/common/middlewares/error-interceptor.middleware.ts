/*
 * error-interceptor.middleware.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Errors from '@Utils/errors'
import { ValidationError } from 'class-validator'
import { MiddlewareFn } from 'type-graphql'


export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next()
  } catch (err) {
    // TODO something
    if (err.validationErrors) {
      let userInputErrors: { [k: string]: string } = {}
      err.validationErrors.map((validationError: ValidationError) => {
        userInputErrors[validationError.property] = validationError.constraints[Object.keys(validationError.constraints)[0]]
      })
      throw new Errors.UserInput('Invalid input provided', userInputErrors)
    }

    // rethrow the error
    throw err
  }
}
