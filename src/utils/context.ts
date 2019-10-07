/*
 * context.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, Role, Status } from '@Types/common'
import { Request } from 'express'


export enum ContextUserType {
  operator = 'operator',
  user = 'user',
}

export class ContextUser {
  id: string
  status: Status
  session: string
  // lang: LanguageCode
  type: ContextUserType
  role: Role
}

export class Context {
  request: Request
  lang: LanguageCode
  user?: ContextUser
}
