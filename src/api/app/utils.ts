/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, Status } from '@Types/common'
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
  return !!context.user
}

export { authChecker }
