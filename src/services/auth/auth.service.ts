/*
 * auth.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { OperatorModel } from '@Models/operator.model'
import OperatorService from '@Services/operator/operator.service'
import { AuthResponse } from '@Types/auth'
import Errors from '@Utils/errors'
import { verifyPassword } from '@Utils/password-manager'
import { Service } from 'typedi'


@Service()
export default class AuthService {
  constructor(
    // service injection
    private readonly operatorService: OperatorService
  ) {
    // noop
  }

  async authenticate(username: string, password: string): Promise<AuthResponse> {
    const operator = await this.operatorService.findByUsername(username)
    if (!operator) throw new Errors.Authentication('wrong username or password')

    const validatePassword = await verifyPassword(operator.password, password)

    if (!validatePassword) throw new Errors.UserInput('wrong username or password', { password: 'wrong password' })

    return {
      operator,
      session: operator.session,
    }
  }

  async authenticateBySession(session: string): Promise<AuthResponse> {
    const op = await this.operatorService.findBySession(session)
    if (!op) throw new Errors.Authentication('not ok')

    const operator = await OperatorModel.findById(op.id)
    if (!operator) throw new Errors.System()

    return {
      operator,
      session: operator.session,
    }
  }
}
