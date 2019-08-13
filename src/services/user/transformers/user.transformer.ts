/*
 * user.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { User } from '@Types/user'
import { InstanceType } from 'typegoose'


export default function transformUser(u: InstanceType<UserSchema>): Partial<User> {
  u = u.toObject()

  return {
    id: String(u.publicId),
    username: u.username,
    avatar: u.avatar,
  }
}
