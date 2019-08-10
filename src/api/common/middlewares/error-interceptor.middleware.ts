/*
 * error-interceptor.middleware.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MiddlewareFn } from 'type-graphql'

export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
	try {
		return await next()
	} catch (err) {
		// TODO something

		// rethrow the error
		throw err
	}
}