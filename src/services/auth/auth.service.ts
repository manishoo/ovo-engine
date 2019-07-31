/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorService from '@Services/operator/operator.service'
import { AuthResponse } from '@Types/auth'
import { verifyPassword, generateHashPassword } from '@Utils/password-manager'
import { Service } from 'typedi'

@Service()
export default class AuthService {
	constructor(
		// service injection
		private readonly operatorService: OperatorService
	) {
		// noop
	}

	async authenticate(username: string, password: string): Promise<AuthResponse> {
		const operator = await this.operatorService.findByUsername(username)
		if (!operator) throw new Error('wrong username or password')

		const isOk = await verifyPassword(operator.persistedPassword, password)

		if (!isOk) throw new Error('wrong username or password')

		return {
			operator,
			session: operator.session,
		}
	}

	async create(username: string, password: string): Promise<AuthResponse>{

		const checkOperator = await this.operatorService.findByUsername(username)
		if(checkOperator) throw new Error('This operator already exists')

		const hashedPassword = await generateHashPassword(password)
		const operator = await this.operatorService.addOperator(username, hashedPassword)
		if(!operator) throw new Error('Problem creating operator')
		
		return{
			operator,
			session: operator.session,
		}
	}

	async authenticateBySession(session: string): Promise<AuthResponse> {
		const operator = await this.operatorService.findBySession(session)
		if (!operator) throw new Error('not ok')

		return {
			operator,
			session: operator.session,
		}
	}
}