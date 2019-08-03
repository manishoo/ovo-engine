/*
 * operator.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { STATUS } from '@Types/common'
import { Operator } from '@Types/operator'
import { Service } from 'typedi'
import { OperatorModel } from '@Models/operator.model'
import { AuthResponse } from '@Types/auth'
import { generateHashPassword } from '@Utils/password-manager'
import Errors from '@Utils/errors'

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

	async create(username: string, password: string): Promise<AuthResponse> {
		const checkOperator = await this.findByUsername(username)
		if(checkOperator) throw new Errors.UserInput('Operator creation error', {username: 'This username already exists'})

		const hashedPassword = await generateHashPassword(password)
		const operator = await OperatorModel.create({
			username,
			persistedPassword: hashedPassword,
		})
		return {
			operator,
			session: operator.session,
		}
	}

	async getOperatorsList(){
		let operatorsList = await OperatorModel.find().select('-session -presistedPassword')
		operatorsList = operatorsList.filter(operator => {
			return operator.username != 'admin'
		})
		return operatorsList
	}

	async removeOperator(id: string): Promise<Operator | null> {
		const removeOperator = await OperatorModel.findByIdAndRemove(id)
		if(!removeOperator) throw new Errors.NotFound('Operator not found')

		return removeOperator
	}

	async findBySession(session: string): Promise<Operator | null> {
		const key = `operator:session:${session}`
		const userDataJSONString = await redis.get(key)
		if (userDataJSONString) {
			let user = JSON.parse(userDataJSONString)
			redis.expire(key, config.times.sessionExpiration)
			return user
		} else {
			const dbUser = await OperatorModel.findOne({ session, status: { $ne: STATUS.inactive } })
			
			if (!dbUser) {
				return null
			}
			let user = <Operator>{
				id: dbUser._id,
				status: dbUser.status,
				session,
				username: dbUser.username,
				role: dbUser.role,
			}
			redis.setex(key, config.times.sessionExpiration, JSON.stringify(user))
			return user
		}
	}
}