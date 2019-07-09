/*
 * operator.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Operator, OperatorModel} from '~/dao/models/operator.model'
import redis from '~/dao/connections/redis'
import {logError} from '~/utils/logger'
import config from '~/config'
import {STATUS} from '~/constants/enums'

export default {
	async findByUsername(username: string): Promise<Operator | null> {
		const o = await OperatorModel.findOne({
			username,
		})

		if (o) {
			return o.transform()
		}

		return null
	},
	async findBySession(session: string): Promise<Operator | null> {
		const key = `operator:session:${session}`
		const userDataJSONString = await redis.get(key)
		if (userDataJSONString) {
			let user = JSON.parse(userDataJSONString)
			redis.expire(key, config.times.sessionExpiration)
			return user
		} else {
			const dbUser = await OperatorModel.findOne({session, status: {$ne: STATUS.inactive}})
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