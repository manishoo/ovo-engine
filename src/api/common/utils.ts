/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, Role, Status, UserRole } from '@Types/common'
import Errors from '@Utils/errors'
import { Request } from 'express'
import { AuthChecker } from 'type-graphql'


export interface Context {
  request: Request,
  lang: LanguageCode,
  user?: {
    id: string,
    status: Status,
    lang: LanguageCode,
    role: Role | UserRole,
  },
}

export function checkUser(ctx: Context) {
  if (!ctx.user) throw new Errors.Forbidden('not allowed')

  return ctx.user
}

const authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles,
) => {
  console.log('<------->');
  
  console.log(context.user!.role);
  if (!context.user) return false
  
  if (context.user.role === Role.admin) return true


  if (context.user.role === Role.operator || context.user.role === UserRole.user) {
    if (roles.find(i => i === Role.operator)) return true
    if (roles.find(i => i === UserRole.user)) return true
  }

  return false
}

export { authChecker }
