/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import uuid from 'uuid/v1'
import {Message, MessageBackgroundInformation, MessagePayload} from '@services/assistant/types'
import Cognition from './cognition'
import Memory from './memory'
import {logError} from '@utils/logger'
import {LANGUAGE_CODES} from '~/constants/enums'

export function createMessage(text: string, data: any = {}, sender?: string): Message {
	return {
		id: uuid(),
		sender: sender || 'assistant',
		text,
		timestamp: String(Date.now()),
		type: data.type ? data.type : 'text',
		data, // TODO fix
	}
}

export interface AssistantService {
	conversation(messagePayload: MessagePayload, lang: LANGUAGE_CODES): Promise<MessagePayload>
}

export default <AssistantService>{
	async conversation(messagePayload, lang) {
		let {token, userId, messages} = messagePayload
		const message = messages[0]

		if (!token) {
			token = uuid()
			messagePayload.token = token
		}

		let backgroundInformation: MessageBackgroundInformation
		if (userId) {
			backgroundInformation = await Memory.longTerm.recognizeTarget(userId)
		} else {
			backgroundInformation = await Memory.shortTerm.recognizeTarget(token)
		}

		// if you recently signed up and not a guest anymore
		if (userId && token && backgroundInformation.conversationHistory.length > 0) {
			await Memory.shortTerm.offloadToLongTerm(token, userId)
		}

		// what do you mean???
		const context = await Cognition.recognizeContext(message, backgroundInformation)

		const responses = await Cognition.replyToConversation(context, messagePayload, backgroundInformation, lang)

		// remember what you said
		if (userId) {
			Memory.longTerm.recordConversation(userId, message ? [message, ...responses] : responses)
				.catch(logError('Memory.longTerm.recordConversation'))
		} else {
			Memory.shortTerm.recordConversation(token, message ? [message, ...responses] : responses)
				.catch(logError('Memory.shortTerm.recordConversation'))
		}

		return {
			messages: responses,
			token,
			userId
		}
	},
}
