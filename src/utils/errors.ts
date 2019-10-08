/*
 * errors.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError as ApolloUserInputError,
  ValidationError,
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
  constructor(message: string = 'Something went wrong') {
    super(message, ErrorCodes.System)
  }
}

const Errors = {
  Authentication: AuthenticationError,
  Forbidden: ForbiddenError,
  UserInput: UserInputError,
  Validation: ValidationError,
  NotFound: NotFoundError,
  System: SystemError,
}

export default Errors
