/*
 * operatorSession.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorRepo from 'src/dao/repositories/operator.repository'
import {Request} from 'express'

export default async (req: Request) => {
	if (!req.headers) return null
	const {authorization: session} = req.headers

	if (session && typeof session == 'string') {
		const operator = await OperatorRepo.findBySession(session)
		if (!operator) {
			return null
		}
		// TODO handle user status
		return operator
	} else {
		return null
	}
}
