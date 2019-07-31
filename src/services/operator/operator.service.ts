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
import { PersistedPassword } from '@Types/auth';

@Service()
export default class OperatorService {
	async findByUsername(username: string): Promise<Operator | null> {
		const o = await OperatorModel.findOne({
			username,
		})

		if (o) {
			return o.transform()
		}

		return null
	}

	async addOperator(username: string, password: PersistedPassword): Promise<Operator | null> {
		return OperatorModel.create({
			username,
			persistedPassword: password,
		})
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
			}
			redis.setex(key, config.times.sessionExpiration, JSON.stringify(user))
			return user
		}
	}
}