/*
 * context.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, Status, UserRole, OperatorRole } from '@Types/common'
import { Request } from 'express'

export interface ContextUser {
  id: string,
  status: Status,
  lang: LanguageCode,
  role: UserRole | OperatorRole
}

export interface Context {
  request: Request,
  lang: LanguageCode,
  user?: ContextUser,
}
