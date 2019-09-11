/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import UploadService from '@Services/upload/upload.service'
import { Status, UserRole } from '@Types/common'
import { BaseUser, User, UserAuthResponse, UserLoginArgs, UserRegistrationInput, UserUpdateInput } from '@Types/user'
import Errors from '@Utils/errors'
import { generateAvatarUrl } from '@Utils/generate-avatar-url'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import mongoose from 'mongoose'
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

    const checkEmail = await UserModel.findOne({ email: user.email })
    if (checkEmail) throw new Errors.UserInput('user creation error', { username: 'This email is already in use' })

    let newUser = await UserModel.create(<Partial<User>>{
      username: user.username,
      persistedPassword: await generateHashPassword(user.password),
      role: UserRole.user,
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      imageUrl: {
        url: generateAvatarUrl(user.username),
        source: 'generated-avatar'
      }
    })
    return {
      user: newUser,
      session: newUser.session,
    }
  }

  async loginUser(user: UserLoginArgs): Promise<UserAuthResponse> {
    const checkUser = await UserModel.findOne({ username: user.username })
    if (!checkUser) throw new Errors.UserInput('Wrong username or password', {
      username: 'Wrong username or password',
      password: 'Wrong username or password'
    })

    const validatePassword = await verifyPassword(checkUser.persistedPassword, user.password)

    if (!validatePassword) throw new Errors.UserInput('Wrong username or password', {
      username: 'Wrong username or password',
      password: 'Wrong username or password'
    })

    return {
      user: checkUser,
      session: checkUser.session,
    }
  }

  async update(userInput: UserUpdateInput, userId: string): Promise<User> {
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

  async userProfile(id: string, userId?: string, username?: string): Promise<User | BaseUser> {
    let user

    /**
     * Find by either id or username
     * */
    user = await UserModel.findOne({
      $or: [
        { userId: mongoose.Types.ObjectId(userId) },
        { username },
      ]
    })

    if (!user) throw new Errors.NotFound('User not found')

    let userInfo: User | BaseUser

    if (userId === id) {
      userInfo = {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        imageUrl: user.imageUrl,
        socialNetworks: user.socialNetworks,
        caloriesPerDay: user.caloriesPerDay,
        height: user.height,
        weight: user.weight,
        age: user.age,
        bodyFat: user.bodyFat,
        gender: user.gender,
        foodAllergies: user.foodAllergies,
        household: user.household,
        activityLevel: user.activityLevel,
        path: user.path,
      } as User
    } else {
      userInfo = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        bio: user.bio,
        imageUrl: user.imageUrl,
        socialNetworks: user.socialNetworks,
      } as BaseUser
    }

    return userInfo
  }

  async doesUsernameExist(username: string): Promise<boolean> {
    const user = await UserModel.findOne({ username })

    return !!user
  }

}
