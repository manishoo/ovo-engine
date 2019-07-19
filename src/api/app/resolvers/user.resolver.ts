/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import UserService from '@Services/user/user.service'
import { User } from '@Types/user'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


@Service()
@Resolver(of => User)
export default class UserResolver {
	constructor(
		// service injection
		private readonly userService: UserService
	) {
		// noop
	}

	@Query(returns => User)
	async getUser(
		@Arg('username') username: string,
		@Ctx() ctx: Context,
	) {
		return this.userService.getUser(username)
	}
}
