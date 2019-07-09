/*
 * assistant.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, Query, Arg, Ctx, Mutation, InputType, Field, Int} from 'type-graphql'
import {Context} from '../../utils'
import AssistantService, {createMessage} from 'src/services/assistant'
import {MessagePayload} from 'src/services/assistant/types'

@Resolver()
export default class AssistantResolver {
	@Mutation(returns => MessagePayload)
	async setupConversation(
		@Ctx() ctx: Context,
		@Arg('token', {nullable: true}) token?: string,
		@Arg('message', {nullable: true}) message?: string,
		@Arg('data', {nullable: true}) data?: string,
	): Promise<MessagePayload> {
		if (data) {
			try {
				data = JSON.parse(data)
			} catch (e) {
				// throw e
			}
		}

		return AssistantService.conversation({messages: message ? [createMessage(message, data, 'user')] : [], token}, ctx.lang)
	}
}
