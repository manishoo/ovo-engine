/*
 * operator.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { OperatorModel } from '@Models/operator.model'
import { AuthResponse } from '@Types/auth'
import { ObjectId, Role, Status } from '@Types/common'
import { Operator } from '@Types/operator'
import { RedisKeys } from '@Types/redis'
import { ContextUser, ContextUserType } from '@Utils/context'
import { DeleteBy } from '@Utils/delete-by'
import Errors from '@Utils/errors'
import { generateHashPassword } from '@Utils/password-manager'
import { Service } from 'typedi'


@Service()
export default class OperatorService {
  async findByUsername(username: string): Promise<Operator | null> {
    const operator = await OperatorModel.findOne({
      username,
    })

    if (operator) {
      return operator.transform()
    }

    return null
  }

  async create(username: string, password: string, role?: Role): Promise<AuthResponse> {
    const checkOperator = await this.findByUsername(username)
    if (checkOperator) throw new Errors.UserInput('Operator creation error', { username: 'This username already exists' })

    const hashedPassword = await generateHashPassword(password)
    const operator = await OperatorModel.create({
      username,
      password: hashedPassword,
      role,
    })
    return {
      operator,
      session: operator.session,
    }
  }

  async getOperatorsList() {
    return OperatorModel.find({ username: { $ne: 'admin' } })
      .select('-session -presistedPassword')
  }

  async removeOperator(id: string, user: ContextUser): Promise<Operator | null> {
    const removeOperator = await OperatorModel.deleteById(id, DeleteBy.user(user))
    if (!removeOperator) throw new Errors.NotFound('Operator not found')

    const operator = await OperatorModel.findOneWithDeleted({ _id: ObjectId(id) })
    if (!operator) throw new Errors.System()

    await redis.del(RedisKeys.operatorSession(operator.session))
    return operator
  }

  async findBySession(session: string): Promise<ContextUser | null> {
    const key = RedisKeys.operatorSession(session)
    const userDataJSONString = await redis.get(key)
    if (userDataJSONString) {
      let user = JSON.parse(userDataJSONString)
      redis.expire(key, config.times.sessionExpiration)
      return user
    } else {
      const dbUser = await OperatorModel.findOne({ session, status: { $ne: Status.inactive } })

      if (!dbUser) {
        return null
      }
      let user: ContextUser = {
        id: dbUser._id,
        status: dbUser.status,
        session,
        role: dbUser.role,
        type: ContextUserType.operator
      }
      redis.setex(key, config.times.sessionExpiration, JSON.stringify(user))
      return user
    }
  }
}
