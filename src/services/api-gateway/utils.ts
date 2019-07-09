/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {LANGUAGE_CODES, STATUS} from '~/constants/enums'
import {Request} from 'express'

export interface Context {
	request: Request,
	lang: LANGUAGE_CODES,
	user?: {
		id: string,
		status: STATUS,
		lang: LANGUAGE_CODES,
		admin: boolean,
	},
}

export function checkUser(ctx: Context) {
	if (!ctx.user) throw new Error('not allowed')

	return ctx.user
}