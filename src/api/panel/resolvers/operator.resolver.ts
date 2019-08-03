/*
 * auth.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import OperatorService from '@Services/operator/operator.service'
import AuthService from '@Services/auth/auth.service'
import { OperatorResponse, Operator } from '@Types/operator'
import { Arg, Ctx, Mutation, Resolver, Query, Authorized } from 'type-graphql'
import { Service } from 'typedi'
import { Context, checkUser } from '../utils'
import { ROLE } from '@Types/common'
import mongoose from 'mongoose'
import Errors from '~/utils/errors';

@Service()
@Resolver()
export default class OperatorResolver {
	constructor(
		// service injection
		private readonly operatorService: OperatorService,
		private readonly authService: AuthService,
	) {
		// noop
	}

	@Authorized(ROLE.admin)
	@Mutation(returns => OperatorResponse)
	async createOperator(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() ctx: Context,
	) {
		return this.operatorService.create(username, password)
	}

	@Authorized(ROLE.admin)
	@Query(returns => [Operator])
	async listOperators(
		@Ctx() ctx: Context,
	) {
		return this.operatorService.getOperatorsList()
	}

	@Authorized(ROLE.admin)
	@Mutation(returns => Operator)
	async deleteOperator(
		@Arg('id') operatorID: string,
		@Ctx() ctx: Context,
	) {
		if(!mongoose.Types.ObjectId.isValid(operatorID)) throw new Errors.UserInput('Invalid id', {id: 'Invalid id'})
		return this.operatorService.removeOperator(operatorID)
	}

}

