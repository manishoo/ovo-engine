/*
 * authChecker.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Role } from '@Types/common'
import { Context } from '@Utils/context'
import { AuthChecker } from 'type-graphql'


const authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles,
) => {
  if (!context.user) return false

  return isAuthorized(roles as Role[], context.user.role)
}

const isAuthorized = (roles: Role[], userRole: Role) => {
  if (userRole === Role.admin) return true

  if (roles.find(role => role === userRole)) return true

  return Role.user === userRole ||
    Role.operator === userRole
}

export {
  authChecker,
  isAuthorized,
}
