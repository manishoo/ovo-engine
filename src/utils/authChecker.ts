/*
 * authChecker.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Context } from '@Utils/context'
import { Role } from '../types/common'
import { AuthChecker } from 'type-graphql'


const authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles,
) => {
  if (!context.user) return false
  if (context.user.role === Role.admin) return true

  if (roles.find(role => role === context.user!.role)) return true

  return false
}

export { authChecker }
