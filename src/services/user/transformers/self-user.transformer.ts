/*
 * self-user.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode } from '@Types/common'
import { User } from '@Types/user'
import { InstanceType } from 'typegoose'


export default async function transformSelfUser(userDocument: InstanceType<User>, lang: LanguageCode = LanguageCode.en) {
  userDocument = userDocument.toObject()
  userDocument.id = String(userDocument.publicId)
  return userDocument
}
