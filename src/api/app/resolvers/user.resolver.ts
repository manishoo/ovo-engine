/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, Arg, Ctx, Mutation, Query, FieldResolver, Root} from 'type-graphql'
import {checkUser, Context} from '@services/api-gateway/utils'
import {User} from '@dao/models/user.model'
import UserService from '@services/user.service'
import userValidator from '@services/api-gateway/validation/user.validator'
import {GENDER} from '~/constants/enums'


@Resolver(of => User)
export default class UserResolver {
	@Mutation(returns => User)
	async login(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() ctx: Context
	): Promise<User> {
		return UserService.verifyUser(username, password)
	}

	@Mutation(returns => User)
	async register(
		@Arg('username') username: string,
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Arg('timeZone') timeZone: string,
		@Ctx() ctx: Context,
		@Arg('gender', {nullable: true}) gender?: GENDER,
	): Promise<User> {
		const validatedData = userValidator.validateRegistration({
			username,
			email,
			password,
			timeZone,
			gender,
		})
		return UserService.createUser(validatedData.username, validatedData.email, validatedData.password, validatedData.timeZone, validatedData.gender)
	}

	@Query(returns => User)
	async me(
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)

		// @ts-ignore
		return UserService.getSelfUser(ctx.user.id)
	}

	@Query(returns => User)
	async getUser(
		@Arg('username') username: string,
		@Ctx() ctx: Context,
	) {
		return UserService.getUser(username)
	}




	// @FieldResolver(returns => Image)
	// avatar(@Root() user: User) {
	// 	if (user.avatar && user.avatar.url) return user.avatar
	//
	// 	return {
	// 		url: generateAvatarUrl(user),
	// 	}
	// }
}
