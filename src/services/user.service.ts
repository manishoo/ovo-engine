/*
 * user.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {AuthenticationError} from 'apollo-server'
import {User} from '@dao/models/user.model'
import UserRepo from '@dao/repositories/user.repository'
import redis from '@dao/connections/redis'
import i18n from 'i18n'
import {generateHashPassword, verifyPassword} from '@utils/password-manager'
import config from '@config'
import {GENDER, WEEKDAYS} from '~/constants/enums'
import {MealPlan} from '@dao/models/meal-plan.model'
import {Event, UserMeal} from '@dao/types'
import moment from 'moment'
import uuid from 'uuid/v1'
import {generateAvatarUrl} from '@utils/generateAvatarUrl'
import foodService from '@services/food/food.service'
import {ObjectID} from 'bson'

class UserService {
	async getSelfUser(userId: string): Promise<User> {
		return UserRepo.findById(userId)
	}

	async getUser(username: string): Promise<Partial<User>> {
		return UserRepo.findByUsername(username)
	}

	async createNewUser(user: User): Promise<User> {
		if (!user.timeZone) throw new Error('no timezone')
		const newUser = await UserRepo.create(user)
		// create a meal plan
		const mp = await foodService.generateMealPlan(newUser._id)
		newUser.path = generatePath(mp, user.timeZone)

		return UserRepo.modify(newUser._id, {
			path: generatePath(mp, user.timeZone),
			mealPlans: [
				new ObjectID(mp._id),
			]
		})
	}

	async createUser(username: string, email: string, password: string, timeZone: string, gender?: GENDER): Promise<User> {
		return UserRepo.create({
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
		return UserRepo.modify(userId, data)
	}

	// @ts-ignore
	async verifyUser(username: string, password: string): Promise<User> {
		const user = await UserRepo.findOne({username})
		if (!user) {
			throw new AuthenticationError(i18n.__('loginVerificationFail'))
		}

		try {
			if (await verifyPassword(user.persistedPassword, password)) {
				return user
			}
		} catch (e) {
			throw new AuthenticationError(i18n.__('loginVerificationFail'))
		}
	}

	async storeDataTemp(token: string, fieldName: string, data: any): Promise<void> {
		const tempData = await this.getTempData(token)
		if (tempData) {
			tempData[fieldName] = data
			await redis.setex(`${config.constants.userTempStorageKey}:${token}`, config.times.userTempDataExpiration, JSON.stringify(tempData))
		} else {
			await redis.setex(`${config.constants.userTempStorageKey}:${token}`, config.times.userTempDataExpiration, JSON.stringify({
				[fieldName]: data,
			}))
		}
	}

	async getTempData(token: string): Promise<any> {
		const data = await redis.get(`${config.constants.userTempStorageKey}:${token}`)
		if (data) {
			return JSON.parse(data)
		}

		return null
	}
}

export function generatePath(mealPlan: MealPlan, timeZone: string): Event[] {
	const events: Event[] = []
	let currentDay: string = ''
	const localizedDate = moment().tz(timeZone)
	const daysArray: string[] = []
	Object.keys(WEEKDAYS)
		.map(k => daysArray.push(k))
	Object.keys(WEEKDAYS)
		.map(k => daysArray.push(k))

	mealPlan.days.map(day => {
		const nowLocalized = moment().tz(timeZone)
		const isoWeekDayNum = nowLocalized.isoWeekday()
		if (day.dayName === String(moment.weekdays()[isoWeekDayNum]).toLowerCase()) {
			currentDay = day.dayName
		}
	})

	let numberOfDaysAdded = 0
	let dayIndex = daysArray.findIndex(p => p == currentDay)

	while (numberOfDaysAdded <= 7) {
		const day = mealPlan.days.find(p => p.dayName === daysArray[dayIndex])
		if (!day) throw new Error('no Day found')

		const futureMeals: { diff: number, meal: UserMeal, datetime: any }[] = []

		day.meals.map(meal => {
			const h = Number(meal.time.split(':')[0])
			const m = Number(meal.time.split(':')[1])
			const datetime = moment({h, m}).add({d: numberOfDaysAdded}).tz(timeZone).format()
			const diff = moment({h, m}).tz(timeZone).diff(localizedDate)
			if (numberOfDaysAdded === 0) {
				if (diff > 0) {
					futureMeals.push({
						diff: diff,
						meal,
						datetime,
					})
				}
			} else {
				futureMeals.push({
					diff: diff,
					meal,
					datetime,
				})
			}
		})

		if (futureMeals.length > 0) {
			futureMeals.sort((a, b) => a.diff - b.diff)
			futureMeals.map(({meal, datetime}) => {
				events.push({
					id: uuid(),
					name: meal.name,
					meal,
					type: 'meal',
					datetime,
				})
			})
		}

		numberOfDaysAdded++
		dayIndex++
	}

	return events
}

const userService = new UserService()

export default userService
