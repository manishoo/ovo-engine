/*
 * user.datasource.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import config from '@Config'
import { ObjectId } from '@Types/common'
import { User } from '@Types/user'
import { Context } from '@Utils/context'
import Errors from '@Utils/errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Service } from 'typedi'


@Service()
export default class UserDataSource extends MongoDataSource<User, Context> {
  async get(userId: ObjectId): Promise<User> {
    let user = await this.findOneById(userId, { ttl: config.cacheTTL })
    if (!user) throw new Errors.NotFound('User not found')

    return {
      ...user,
      id: String(user._id),
    }
  }
}
