/*
 * auth.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorService from '@Services/operator/operator.service'
import { OperatorResponse } from '@Types/operator'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'

@Service()
@Resolver()
export default class OperatorResolver {
	constructor(
		// service injection
		private readonly operatorService: OperatorService
	) {
		// noop
	}

	@Mutation(returns => OperatorResponse)
	async createNewOperator(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() ctx: Context,
	) {
		return await this.operatorService.create(username, password)
	}
}

