/*
 * userSession.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserRepo from '~/dao/repositories/user.repository'
import {Request} from 'express'
import OperatorRepo from '~/dao/repositories/operator.repository'

export default async (req: Request) => {
	if (!req.headers) return null
	if (!req.headers.authorization) return null
	const {authorization: session} = req.headers

	try {
		if (session && typeof session == 'string') {
			const user = await UserRepo.findBySession(session)
			if (!user) {
				return null
			}
			// TODO handle user status
			return user
		} else {
			return null
		}
	} catch (e) {
		return null
	}
}
