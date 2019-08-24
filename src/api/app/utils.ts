/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, Status, UserRole, Pagination } from '@Types/common'
import { Request } from 'express'
import { AuthChecker } from 'type-graphql'


export interface Context {
  request: Request,
  lang: LanguageCode,
  user?: {
    id: string,
    status: Status,
    lang: LanguageCode,
    role: UserRole
  },
}

const authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles,
) => {
  if (!context.user) return false
  if (context.user.role === UserRole.user) return true

  return false
}

export { authChecker }

export function createPagination(page: number, size: number, count: number): Pagination {

  return{
    page: page,
    size: size,
    totalCount: count,
    totalPages: Math.ceil(count / size),
    hasNext: page !== Math.ceil(count / size)
  }
}