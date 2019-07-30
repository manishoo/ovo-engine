/*
 * errors.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {
	AuthenticationError,
	ForbiddenError,
	UserInputError as ApolloUserInputError,
	ValidationError,
	ApolloError,
} from 'apollo-server'

enum ErrorCodes {
	NotFound = 'NOTFOUND',
	System = 'INTERNAL',
}

class UserInputError extends ApolloUserInputError {
	constructor(message: string, fieldErrors: { [k: string]: string }) {
		super(message, {
			fieldErrors,
		})
	}
}

class NotFoundError extends ApolloError {
	constructor(message: string) {
		super(message, ErrorCodes.NotFound)
	}
}

class SystemError extends ApolloError {
	constructor(message: string) {
		super(message, ErrorCodes.System)
	}
}

const Errors = {
	AuthenticationError: AuthenticationError,
	ForbiddenError: ForbiddenError,
	UserInputError: UserInputError,
	ValidationError: ValidationError,
	NotFoundError: NotFoundError,
	SystemError: SystemError,
}

export default Errors
