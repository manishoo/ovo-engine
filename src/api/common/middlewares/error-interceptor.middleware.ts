/*
 * error-interceptor.middleware.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MiddlewareFn } from 'type-graphql'
import Errors from '@Utils/errors';


export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next()
  } catch (err) {
    // TODO something
    if (err.validationErrors) {
      throw new Errors.Validation('Invalid input provided')
    }

    // rethrow the error
    throw err
  }
}
