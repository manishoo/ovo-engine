/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import transformSelfUser from '@Services/user/transformers/self-user.transformer'
import transformUser from '@Services/user/transformers/user.transformer'
import { Status } from '@Types/common'
import { GENDER, User, UserRegistrationInput, UserAuthResponse } from '@Types/user'
import Errors from '@Utils/errors'
import { generateAvatarUrl } from '@Utils/generate-avatar-url'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import { AuthenticationError } from 'apollo-server'
import i18n, { __ } from 'i18n'
import { Service } from 'typedi'
import { checkUser } from 'src/api/panel/utils';


@Service()
export default class UserService {

  async findBySession(session: string) {
    const key = `user:session:${session}`
    const userDataJSONString = await redis.get(key)
      .catch(logError('findBySession->redis.get'))

    if (userDataJSONString) {
      let user = JSON.parse(userDataJSONString)
      redis.expire(key, config.times.sessionExpiration)
        .catch(logError('findBySession->redis.expire'))
      return user
    } else {
      const dbUser = await UserModel.findOne({ session, status: { $ne: Status.inactive } })
      if (!dbUser) {
        return null
      }
      let user = {
        id: dbUser._id,
        status: dbUser.status,
      }
      redis.setex(key, config.times.sessionExpiration, JSON.stringify(user))
        .catch(logError('findBySession->redis.setex'))
      return user
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return UserModel.findOne({ username })
  }

  async register(user: UserRegistrationInput): Promise<UserAuthResponse> {
    const checkUser = await this.findByUsername(user.username)
    if (checkUser) throw new Errors.UserInput('user creation error', { username: 'This username already exists' })

    let newUser = await UserModel.create({
      username: user.username,
      persistedPassword: generateHashPassword(user.password),
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    })
    return {
      user: newUser,
      session: newUser.session,
    }
  }
}

