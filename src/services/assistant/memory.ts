/*
 * memory.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Message, MessageBackgroundInformation} from 'src/services/assistant/types'
import UserRepo from 'src/dao/repositories/user.repository'
import redis from 'src/dao/connections/redis'
import config from 'src/config'
import {logError} from 'src/utils/logger'
import UserService from 'src/services/user.service'


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

			const tempData = await UserService.getTempData(token)
				.catch(logError('UserService.getTempData'))

			return {
				user: null,
				tempData,
				conversationHistory: JSON.parse(messages)
			}
		},
		async recordConversation(token, messages) {
			const {conversationHistory} = await this.recognizeTarget(token)

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
			const user = await UserRepo.findById(userId)
				.catch(logError('recognizeTarget->UserRepo.findById'))
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