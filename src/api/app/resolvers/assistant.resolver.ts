/*
 * assistant.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import AssistantService, { createMessage } from '@Services/assistant'
import { MessagePayload } from '@Types/assistant'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'

@Service()
@Resolver()
export default class AssistantResolver {
	constructor(
		// service injection
		private readonly assistantService: AssistantService,
	) {
		// noop
	}

	@Mutation(returns => MessagePayload)
	async setupConversation(
		@Ctx() ctx: Context,
		@Arg('token', { nullable: true }) token?: string,
		@Arg('message', { nullable: true }) message?: string,
		@Arg('data', { nullable: true }) data?: string,
	): Promise<MessagePayload> {
		if (data) {
			try {
				data = JSON.parse(data)
			} catch (e) {
				// throw e
			}
		}

		return this.assistantService.conversation({
			messages: message ? [createMessage(message, data, 'user')] : [],
			token
		}, ctx.lang)
	}
}
