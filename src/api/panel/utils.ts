/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES, STATUS, ROLE } from '@Types/common'
import Errors from '@Utils/errors'
import { Request } from 'express'
import { AuthChecker } from 'type-graphql';

export interface Context {
	request: Request,
	lang: LANGUAGE_CODES,
	user?: {
		id: string,
		status: STATUS,
		lang: LANGUAGE_CODES,
		role: ROLE,
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
	if(!context.user) return false
	if (context.user.role === ROLE.admin) return true
	
	if(context.user.role === ROLE.operator) {
		if (roles.find(i => i === ROLE.operator)) return true
	}
  
    return false
}

export {authChecker}