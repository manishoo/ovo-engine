/*
 * assistant.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MessageBackgroundInformation, MessagePayload } from '@Types/assistant'
import { LanguageCode } from '@Types/common'
import { logError } from '@Utils/logger'
import { Service } from 'typedi'
import uuid from 'uuid/v1'
import Cognition from './utils/cognition'
import Memory from './utils/memory'


@Service()
export default class AssistantService {
  async conversation(messagePayload: MessagePayload, lang: LanguageCode): Promise<MessagePayload> {
    let { token, userId, messages } = messagePayload

    // currently, use messages have only one message. So only use the first one
    const message = messages[0]

    if (!token) {
      // if it didn't have a token, attach a token to the message payload
      token = uuid()
      messagePayload.token = token
    }

    let backgroundInformation: MessageBackgroundInformation
    /**
     * generate background information:
     *
     * 1. if the messagePayload had a userId (in other words, it was an existing user)
     *    load the backgroundInformation from long term memory (mongodb)
     *
     * 2. if the messagePayload didn't have a userId (in other words, it was a guest sending messages),
     *    load the backgroundInformation from short term memory (redis)
     * */
    if (userId) {
      backgroundInformation = await Memory.longTerm.recognizeTarget(userId)
    } else {
      backgroundInformation = await Memory.shortTerm.recognizeTarget(token)
    }

    // if you recently signed up and not a guest anymore, move short term to long term memory
    if (userId && token && backgroundInformation.conversationHistory.length > 0) {
      await Memory.shortTerm.offloadToLongTerm(token, userId)
    }

    // recognize the context of the speech based on background information, timing, user, etc...
    const context = await Cognition.recognizeContext(message, backgroundInformation)

    // reply to the messagePayload
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
  }
}
