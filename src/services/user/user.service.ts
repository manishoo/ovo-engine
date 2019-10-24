/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import UploadService from '@Services/upload/upload.service'
import { ObjectId, Role, Status, LanguageCode } from '@Types/common'
import { RedisKeys } from '@Types/redis'
import { BaseUser, User, UserAuthResponse, UserLoginArgs, UserRegistrationInput, UserUpdateInput } from '@Types/user'
import { ContextUser, ContextUserType } from '@Utils/context'
import Errors from '@Utils/errors'
import { generateAvatarUrl } from '@Utils/generate-avatar-url'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import { Service } from 'typedi'
import MailingService from '@Services/mail/mail.service'
import { getRecoverTemplate } from '@Services/mail/utils/mailTemplates'
import generateRecoverLink from './utils/generate-recover-link'


@Service()
export default class UserService {
  constructor(
    // service injection
    private readonly uploadService: UploadService,
    private readonly mailingService: MailingService,
  ) {
    // noop
  }

  async findBySession(session: string): Promise<ContextUser | null> {
    const key = RedisKeys.userSession(session)
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
      let user: ContextUser = {
        id: dbUser._id,
        status: dbUser.status,
        role: dbUser.role,
        type: ContextUserType.user,
        session,
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
      password: await generateHashPassword(user.password),
      role: Role.user,
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      avatar: {
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

    const validatePassword = await verifyPassword(checkUser.password, user.password)

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

    if (userInput.avatar) {
      user.avatar = {
        url: await this.uploadService.processUpload(userInput.avatar, userInput.username, `images/users/${user.id}`)
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

  async userProfile(selfId?: string, userId?: string, username?: string): Promise<User | BaseUser> {
    let user

    /**
     * Find by either id or username
     * */
    user = await UserModel.findOne({
      $or: [
        { userId: new ObjectId(userId) },
        { username },
      ]
    })

    if (!user) throw new Errors.NotFound('User not found')

    let userInfo: User | BaseUser

    if (userId === selfId) {
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
        avatar: user.avatar,
        socialNetworks: user.socialNetworks,
        height: user.height,
        weight: user.weight,
        age: user.age,
        bodyFat: user.bodyFat,
        gender: user.gender,
        household: user.household,
        activityLevel: user.activityLevel,
      } as User
    } else {
      userInfo = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        bio: user.bio,
        avatar: user.avatar,
        socialNetworks: user.socialNetworks,
      } as BaseUser
    }

    return userInfo
  }

  async doesUsernameExist(username: string): Promise<boolean> {
    const user = await UserModel.findOne({ username })

    return !!user
  }

  async requestRecoverPassword(email: string, locale: LanguageCode): Promise<Boolean> {

    const user = await UserModel.findOne({ email })
    if (!user) throw new Errors.NotFound('User not found')

    let userFirstName: string = ''
    if (user.firstName) {
      userFirstName = user.firstName
    } else {
      userFirstName = 'User'
    }
    this.mailingService.sendMail([{
      name: userFirstName,
      email: user.email,
      senderAddress: 'recover',
      subject: `Password recover for ${user.firstName}`,
      template: getRecoverTemplate(locale),
      recover: generateRecoverLink(user.id)
    }])
    return true
  }

}
