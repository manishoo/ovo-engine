/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import { Status } from '@Types/common'
import { User, UserRegistrationInput, UserAuthResponse, UserUpdateInput } from '@Types/user'
import Errors from '@Utils/errors'
import { logError } from '@Utils/logger'
import { generateHashPassword } from '@Utils/password-manager'
import { Service } from 'typedi'
import UploadService from '@Services/upload/upload.service'

@Service()
export default class UserService {
  constructor(
    // service injection
    private readonly uploadService: UploadService
  ) {
    // noop
  }
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

  async register(user: UserRegistrationInput): Promise<UserAuthResponse> {
    const checkUser = await UserModel.findOne({ username: user.username })
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

  async update(userInput: UserUpdateInput): Promise<User | undefined> {
    let usr = await UserModel.findById(userInput.id)
    if (!usr) throw new Errors.NotFound('user not found')

    if (userInput.imageUrl) {
      usr.imageUrl = {
        url: await this.uploadService.processUpload(userInput.imageUrl, userInput.username , `images/users/${usr.id}`)
      }

      usr.username = userInput.username
      usr.firstName = userInput.firstName
      usr.middleName = userInput.middleName
      usr.lastName = userInput.lastName
      usr.email = userInput.email

      return usr.save()
    }
  }
}
