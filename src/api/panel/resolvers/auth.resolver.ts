/*
 * auth.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { OperatorModel } from '@Models/operator.model'
import AuthService from '@Services/auth/auth.service'
import { AuthResponse } from '@Types/auth'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'

@Service()
@Resolver()
export default class AuthResolver {
	constructor(
		// service injection
		private readonly authService: AuthService
	) {
		// noop
	}

	@Mutation(returns => AuthResponse)
	async loginOperator(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() ctx: Context,
	) {
		const s = await this.authService.authenticate(username, password)
		return s
	}

	@Query(returns => AuthResponse)
	async me(
		@Arg('session') session: string,
		@Ctx() ctx: Context,
	) {
		const s = await this.authService.authenticateBySession(session)
		s.operator = new OperatorModel(s.operator) // TODO what the hell
		return s
	}
}
