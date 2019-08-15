/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import { Status, UserRole } from '@Types/common'
import { User, UserRegistrationInput, UserAuthResponse, UserLoginArgs } from '@Types/user'
import Errors from '@Utils/errors'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import { Service } from 'typedi'

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
        role: dbUser.role
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
      persistedPassword: await generateHashPassword(user.password),
      role: UserRole.user,
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

  async loginUser(user: UserLoginArgs): Promise<UserAuthResponse> {
    const checkUser = await UserModel.findOne({ username: user.username })
    if (!checkUser) throw new Errors.NotFound('user not found')

    const validatePassword = await verifyPassword(checkUser.persistedPassword, user.password)

    if (!validatePassword) throw new Errors.UserInput('wrong username or password', { password: 'wrong password' })

    return {
      user: checkUser,
      session: checkUser.session,
    }
  }

  async getUserInfo(id: string): Promise<User> {
    const user = await UserModel.findById(id)
    if(!user) throw new Errors.NotFound('user not found!')

    return user
  }
}

