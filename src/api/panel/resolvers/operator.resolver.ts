/*
 * auth.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorService from '@Services/operator/operator.service'
import AuthService from '@Services/auth/auth.service'
import { OperatorResponse, Operator } from '@Types/operator'
import { Arg, Ctx, Mutation, Resolver, Query } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { ROLE } from '@Types/common'
import Errors from '~/utils/errors'

@Service()
@Resolver()
export default class OperatorResolver {
	constructor(
		// service injection
		private readonly operatorService: OperatorService,
		private readonly authService: AuthService
	) {
		// noop
	}

	@Mutation(returns => OperatorResponse)
	async createOperator(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() ctx: Context,
	) {
		return this.operatorService.create(username, password)
	}

	@Query(returns => [Operator])
	async listOperators(
		@Arg('session') session: string,
		@Ctx() ctx: Context,
	) {
		const checkAccess = await this.authService.authenticateBySession(session)
		if(checkAccess.operator.username.toUpperCase() != ROLE.admin) throw new Errors.Forbidden('Access Denied')

		return this.operatorService.getOperatorsList()
	}

}

