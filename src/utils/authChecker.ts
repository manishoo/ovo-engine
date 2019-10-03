/*
 * authChecker.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Context } from '@Utils/context'
import { AuthChecker } from 'type-graphql'
import { OperatorRole, UserRole } from '@Types/common'


const authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles,
) => {
  if (!context.user) return false
  if (context.user.role === OperatorRole.admin) return true

  if (roles.find(role => role === context.user!.role)) return true

  return UserRole.user === context.user!.role ||
    UserRole.operator === context.user!.role
}

export { authChecker }
