/*
 * memory.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import UserService from '@Services/user/user.service'
import { Message, MessageBackgroundInformation } from '@Types/assistant'
import { logError } from '@Utils/logger'
import { Container } from 'typedi'


interface ShortTermMemory {
	recognizeTarget(token: string): Promise<MessageBackgroundInformation>

	storeGuestTempInfo(token: string, field: string, data: any): Promise<void>

	getGuestTempData(token: string): Promise<any>,

	recordConversation(token: string, messages: Message[]): Promise<void>

	offloadToLongTerm(token: string, userId: string): Promise<void>
}

interface LongTermMemory {
	recognizeTarget(userId: string): Promise<MessageBackgroundInformation>

	recordConversation(userId: string, messages: Message[]): Promise<void>
}

interface Memory {
	shortTerm: ShortTermMemory
	longTerm: LongTermMemory
}

export default <Memory>{
	shortTerm: {
		async recognizeTarget(token) {
			const messages = await redis.get(`${config.constants.assistantConversationKey}:${token}`)
				.catch(logError('recognizeTarget->redis.get'))

			if (!messages) {
				return {
					conversationHistory: []
				}
			}

			const userService = Container.get(UserService)
			const tempData = await userService.getTempData(token)
				.catch(logError('UserService.getTempData'))

			return {
				user: null,
				tempData,
				conversationHistory: JSON.parse(messages)
			}
		},
		async recordConversation(token, messages) {
			const { conversationHistory } = await this.recognizeTarget(token)

			await redis.setex(`${config.constants.assistantConversationKey}:${token}`, config.times.conversationExpiration, JSON.stringify([...conversationHistory, ...messages]))
				.catch(logError('recordConversation->redis.setex'))
		},
		async offloadToLongTerm(token, userId) {
			return
		},
		async getGuestTempData(token: string) {
			const data = await redis.get(`${config.constants.userTempStorageKey}:${token}`)
			if (data) {
				return JSON.parse(data)
			}

			return null
		},
		async storeGuestTempInfo(token: string, field: string, data: any): Promise<void> {
			const tempData = await this.getGuestTempData(token)
			if (tempData) {
				tempData[field] = data
				await redis.setex(`${config.constants.userTempStorageKey}:${token}`, config.times.userTempDataExpiration, JSON.stringify(tempData))
			} else {
				await redis.setex(`${config.constants.userTempStorageKey}:${token}`, config.times.userTempDataExpiration, JSON.stringify({
					[field]: data,
				}))
			}
		}
	},
	longTerm: {
		async recognizeTarget(userId) {
			const userService = Container.get(UserService)

			const user = await userService.findById(userId)
				.catch(logError('recognizeTarget->userService.findById'))
			return {
				user,
				tempData: null,
				conversationHistory: [],
			}
		},
		async recordConversation(userId, messages) {
			// TODO: CHECK!
			const conversationMessages = await this.recognizeTarget(userId)

			await redis.setex(`${config.constants.assistantConversationKey}:${userId}`, config.times.conversationExpiration, JSON.stringify([...conversationMessages, ...messages]))
				.catch(logError('recordConversation->redis.setex'))
		},
	},
}
