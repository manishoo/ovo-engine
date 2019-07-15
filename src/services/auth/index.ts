/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorRepo from '@dao/repositories/operator.repository'
import { verifyPassword } from '@utils/password-manager'
import {AuthResponse} from '@dao/types'

export async function authenticate(username: string, password: string): Promise<AuthResponse> {
	const operator = await OperatorRepo.findByUsername(username)
	if (!operator) throw new Error('wrong username or password')

	const isOk = await verifyPassword(operator.persistedPassword, password)

	if (!isOk) throw new Error('wrong username or password')

	return {
		operator,
		session: operator.session,
	}
}

export async function authenticateBySession(session: string): Promise<AuthResponse> {
	const operator = await OperatorRepo.findBySession(session)
	if (!operator) throw new Error('not ok')

	return {
		operator,
		session: operator.session,
	}
}
