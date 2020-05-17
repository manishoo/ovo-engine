/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import DietService from '@Services/diet/diet.service'
import MailingService from '@Services/mail/mail.service'
import { getRecoverTemplate } from '@Services/mail/utils/mailTemplates'
import UploadService from '@Services/upload/upload.service'
import { LanguageCode, ObjectId, Role, Status } from '@Types/common'
import { RedisKeys } from '@Types/redis'
import {
  BasicUser,
  DecodedUser,
  User,
  UserAuthResponse,
  UserLoginArgs,
  UserRegistrationInput,
  UserUpdateInput,
} from '@Types/user'
import { ContextUser, ContextUserType } from '@Utils/context'
import decodeJwtToken from '@Utils/decode-jwt-token'
import Errors from '@Utils/errors'
import { generateAvatarUrl } from '@Utils/generate-avatar-url'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import { Service } from 'typedi'
import generateRecoverLink from './utils/generate-recover-link'


@Service()
export default class UserService {
  constructor(
    // service injection
    private readonly uploadService: UploadService,
    private readonly mailingService: MailingService,
    private readonly dietService: DietService,
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
        status: dbUser.status!,
        role: dbUser.role,
        type: ContextUserType.user,
        session,
      }
      redis.setex(key, config.times.sessionExpiration, JSON.stringify(user))
        .catch(logError('findBySession->redis.setex'))
      return user
    }
  }

  async getUserById(userId: string | ObjectId, careGiver?: string | ObjectId): Promise<User> {
    const user = await UserModel.findById(userId)

    if (!user) throw new Errors.NotFound('User not found')
    if (careGiver && !user.careGivers.find(ct => String((ct as ObjectId)) === String(careGiver))) throw new Errors.NotFound('Invalid care giver')

    return user
  }

  async register(user: UserRegistrationInput): Promise<UserAuthResponse> {
    const checkUser = await UserModel.findOne({ username: user.username })
    if (checkUser) throw new Errors.UserInput('user creation error', { username: 'This username already exists' })

    const checkEmail = await UserModel.findOne({ email: user.email })
    if (checkEmail) throw new Errors.UserInput('user creation error', { username: 'This email is already in use' })

    let createUser = <Partial<User>>{
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
    }
    if (user.dietId) {
      const diet = await this.dietService.get(user.dietId)
      createUser.diet = diet
    }
    let newUser = await UserModel.create(createUser)
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
      session: checkUser.session!,
    }
  }

  async update(userInput: UserUpdateInput, userId: ObjectId): Promise<User> {
    let user = await UserModel.findById(userId)
    if (!user) throw new Errors.NotFound('user not found')

    if (userInput.avatar) {
      user.avatar = {
        url: await this.uploadService.processUpload(userInput.avatar, userInput.username, `images/users/${user.id}`)
      }
    }
    if (userInput.dietId) {
      user.diet = await this.dietService.get(userInput.dietId)
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

  async userProfile(selfId?: string, userId?: ObjectId, username?: string): Promise<User | BasicUser> {
    let user

    /**
     * Find by either id or username
     * */
    user = await UserModel.findOne({
      $or: [
        { _id: userId },
        { username },
      ]
    })

    if (!user) throw new Errors.NotFound('User not found')

    return user
  }

  async doesUsernameExist(username: string): Promise<boolean> {
    const user = await UserModel.findOne({ username })

    return !!user
  }

  async requestRecoverPassword(email: string, locale: LanguageCode): Promise<Boolean> {

    const user = await UserModel.findOne({ email })
    if (!user) return true

    let userFirstName: string = ''
    if (user.firstName) {
      userFirstName = user.firstName
    } else {
      userFirstName = 'User'
    }

    const recoverLink = generateRecoverLink(user.id)

    this.mailingService.sendMail([{
      name: userFirstName,
      email: user.email,
      senderAddress: 'recover',
      subject: `Password recover for ${user.firstName}`,
      template: getRecoverTemplate(locale),
      recover: recoverLink
    }])
    return true
  }

  async changeUserPassword(token: string, password: string) {
    const decoded = decodeJwtToken(token) as DecodedUser

    const user = await UserModel.findById(decoded.id!)
    if (!user) throw new Errors.NotFound('Invalid token')

    user.password = await generateHashPassword(password)
    await user.save()

    return true
  }

  async getTempData(token: string): Promise<any> {
    const data = await redis.get(`${RedisKeys.userTempData}:${token}`)
    if (data) {
      return JSON.parse(data)
    }

    return null
  }
}
