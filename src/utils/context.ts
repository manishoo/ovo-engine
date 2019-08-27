/*
 * context.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, Status, UserRole, Role } from '../types/common' //TODO fix alias
import { Request } from 'express'

export interface Context {
  request: Request,
  lang: LanguageCode,
  user?: {
    id: string,
    status: Status,
    lang: LanguageCode,
    role: UserRole | Role
  },
}