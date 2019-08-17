/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import UploadService from '@Services/upload/upload.service'
import { Status, UserRole } from '@Types/common'
import { User, UserAuthResponse, UserLoginArgs, UserRegistrationInput, UserUpdateInput } from '@Types/user'
import Errors from '@Utils/errors'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import { Service } from 'typedi'


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
        role: dbUser.role
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
    if (!user) throw new Errors.NotFound('user not found!')

    return user
  }

  async update(userInput: UserUpdateInput, userId: string): Promise<User | undefined> {
    let user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('user not found')

    if (userInput.imageUrl) {
      user.imageUrl = {
        url: await this.uploadService.processUpload(userInput.imageUrl, userInput.username, `images/users/${user.id}`)
      }
    }
    user.username = userInput.username
    user.firstName = userInput.firstName
    user.lastName = userInput.lastName
    user.email = userInput.email
    user.socialNetworks = userInput.socialNetworks
    user.bio = userInput.bio
    user.gender = userInput.gender

    return user.save()
    
  }
}
