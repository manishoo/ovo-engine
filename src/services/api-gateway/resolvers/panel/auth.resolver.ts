/*
 * auth.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, Arg, Ctx, Mutation, Query} from 'type-graphql'
import {authenticate, authenticateBySession} from 'src/services/auth'
import {AuthResponse} from 'src/dao/types'
import {Operator} from 'src/dao/models/operator.model'
import {Context} from '~/services/api-gateway/utils'


@Resolver()
export default class AuthResolver {
	@Mutation(returns => AuthResponse)
	async login(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() ctx: Context,
	) {
		const s = await authenticate(username, password)
		s.operator = new Operator(s.operator)
		return s
	}

	@Query(returns => AuthResponse)
	async me(
		@Arg('session') session: string,
		@Ctx() ctx: Context,
	) {
		const s = await authenticateBySession(session)
		s.operator = new Operator(s.operator)
		return s
	}
}
