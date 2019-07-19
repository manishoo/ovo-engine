/*
 * operator-session.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorService from '@Services/operator/operator.service'
import { Request } from 'express'
import { Container } from 'typedi'

export default async (req: Request) => {
	if (!req.headers) return null
	const { authorization: session } = req.headers

	if (session && typeof session == 'string') {
		const operatorService = Container.get(OperatorService)
		const operator = await operatorService.findBySession(session)
		if (!operator) {
			return null
		}
		// TODO handle user status
		return operator
	} else {
		return null
	}
}
