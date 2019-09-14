/*
 * user.middleware.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { Request } from 'express'
import { Container } from 'typedi'


/**
 * Check authorization header and if it had valid token
 * check the users and return the user to be attached to
 * the graphql context
 * */
export default async (req: Request) => {
  if (!req.headers) return null
  if (!req.headers.authorization) return null
  const { authorization: session } = req.headers

  try {
    if (session && typeof session == 'string') {
      const userService = Container.get(UserService)
      const user = await userService.findBySession(session)

      if (!user) {
        return null
      }
      // TODO handle user status
      return user
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}
