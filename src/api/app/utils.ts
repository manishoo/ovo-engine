/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES, STATUS } from '@Types/common'
import Errors from '@Utils/errors'
import { Request } from 'express'

export interface Context {
	request: Request,
	lang: LANGUAGE_CODES,
	user?: {
		id: string,
		status: STATUS,
		lang: LANGUAGE_CODES,
	},
}

export function checkUser(ctx: Context) {
	if (!ctx.user) throw new Errors.Forbidden('not allowed')

	return ctx.user
}