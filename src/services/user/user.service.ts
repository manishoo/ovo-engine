/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import redis from '@Config/connections/redis'
import { UserModel } from '@Models/user.model'
import MealPlanService from '@Services/meal-plan/meal-plan.service'
import { transformMealPlan } from '@Services/meal-plan/transformers/meal-plan.transformer'
import transformSelfUser from '@Services/user/transformers/self-user.transformer'
import transformUser from '@Services/user/transformers/user.transformer'
import { LANGUAGE_CODES, STATUS } from '@Types/common'
import { MealPlan } from '@Types/meal-plan'
import { GENDER, User } from '@Types/user'
import Errors from '@Utils/errors'
import { generateAvatarUrl } from '@Utils/generate-avatar-url'
import { logError } from '@Utils/logger'
import { generateHashPassword, verifyPassword } from '@Utils/password-manager'
import { AuthenticationError } from 'apollo-server'
import { ObjectID } from 'bson'
import i18n, { __ } from 'i18n'
import { Service } from 'typedi'
import { generatePath } from './utils/generate-path'


@Service()
export default class UserService {
	constructor(
		// service injection
		private readonly mealPlanService: MealPlanService
	) {
		// noop
	}

	async findById(id: string): Promise<User> {
		const r = await UserModel.findById(id)
		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}

		return transformSelfUser(r)
	}

	async findByPublicId(publicId: string): Promise<User> {
		const r = await UserModel.findOne({ publicId })
		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}

		// TODO Error handling
		return transformSelfUser(r)
	}

	async findByUsername(username: string): Promise<Partial<User>> {
		const r = await UserModel.findOne({ username })
		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}

		// TODO Error handling
		return transformUser(r)
	}

	async findOne(query: {}): Promise<User> {
		const r = await UserModel.findOne(query)
		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}
		return transformSelfUser(r)
	}

	async getUserMealPlan(userId: string, lang: LANGUAGE_CODES): Promise<MealPlan> {
		let r = await UserModel.findById(userId).populate({
			path: 'mealPlans'
		}).exec()
		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}

		r = r.toObject()

		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}

		if (Array.isArray(r.mealPlans) && r.mealPlans.length === 0) {
			throw new Errors.ValidationError('no meal plan')
		}

		if (r.mealPlans && !Array.isArray(r.mealPlans)) {
			return transformMealPlan(r.mealPlans, lang)
		}

		// @ts-ignore
		return transformMealPlan(r.mealPlans[0].toObject(), lang)
	}

	async create(data: User) {
		return transformSelfUser(await UserModel.create(data))
	}

	async modify(userId: string, data: Partial<User>) {
		// FIXME transform
		await UserModel.updateOne({ _id: userId }, { $set: data })

		return this.findById(userId)
	}

	async createMany(data: User[]) {
		// FIXME transform
		return UserModel.insertMany(data)
	}

	async find(query: {}, limit: number, skip: number): Promise<User[]> {
		const r = await UserModel.find(query).limit(limit).skip(skip).exec()
		return Promise.all(r.map(u => transformSelfUser(u)))
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
			const dbUser = await this.findOne({ session, status: { $ne: STATUS.inactive } })
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

	async getSelfUser(userId: string): Promise<User> {
		return this.findById(userId)
	}

	async getUser(username: string): Promise<Partial<User>> {
		return this.findByUsername(username)
	}

	async createNewUser(user: User): Promise<User> {
		if (!user.timeZone) throw new Errors.ValidationError('no timezone')
		const newUser = await this.create(user)
		// create a meal plan
		const mp = await this.mealPlanService.generateMealPlan(newUser._id)
		newUser.path = generatePath(mp, user.timeZone)

		return this.modify(newUser._id, {
			path: generatePath(mp, user.timeZone),
			mealPlans: [
				new ObjectID(mp._id),
			]
		})
	}

	async createUser(username: string, email: string, password: string, timeZone: string, gender?: GENDER): Promise<User> {
		return this.create({
			username,
			gender,
			persistedPassword: await generateHashPassword(password),
			email,
			timeZone,
			avatar: {
				url: generateAvatarUrl(username, gender)
			}
		})
	}

	async updateUser(userId: string, data: User) {
		return this.modify(userId, data)
	}

	async verifyUser(username: string, password: string): Promise<User> {
		const user = await this.findOne({ username })
		if (!user) {
			throw new AuthenticationError(i18n.__('loginVerificationFail'))
		}

		try {
			if (await verifyPassword(user.persistedPassword, password)) {
				return user
			} else {
				throw new AuthenticationError(i18n.__('loginVerificationFail'))
			}
		} catch (e) {
			throw new AuthenticationError(i18n.__('loginVerificationFail'))
		}
	}

	/*async storeDataTemp(token: string, fieldName: string, data: any): Promise<void> {
		const tempData = await this.getTempData(token)
		if (tempData) {
			tempData[fieldName] = data
			await redis.setex(`${config.constants.userTempStorageKey}:${token}`, config.times.userTempDataExpiration, JSON.stringify(tempData))
		} else {
			await redis.setex(`${config.constants.userTempStorageKey}:${token}`, config.times.userTempDataExpiration, JSON.stringify({
				[fieldName]: data,
			}))
		}
	}*/

	async getTempData(token: string): Promise<any> {
		const data = await redis.get(`${config.constants.userTempStorageKey}:${token}`)
		if (data) {
			return JSON.parse(data)
		}

		return null
	}
}

