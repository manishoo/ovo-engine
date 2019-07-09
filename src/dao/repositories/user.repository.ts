/*
 * user.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '~/config'
import redis from '~/dao/connections/redis'
import {User, UserModel} from '~/dao/models/user.model'
import {EVENT_TYPES, LANGUAGE_CODES, STATUS} from '~/constants/enums'
import {logError} from '~/utils/logger'
import {__} from 'i18n'
import {MealPlan} from '~/dao/models/meal-plan.model'
import {transformMealItem, transformMealPlan} from '~/dao/repositories/meal-plan.repository'
import {InstanceType} from 'typegoose'
import {RecipeModel} from '~/dao/models/recipe.model'
import FoodRepo from '~/dao/repositories/food.repository'

async function transformSelfUser(userDocument: InstanceType<User>, lang: LANGUAGE_CODES = LANGUAGE_CODES.en) {
	userDocument = userDocument.toObject()
	userDocument.id = String(userDocument.publicId)
	if (userDocument.path) {
		// FIXME PLEASE! :(((
		let recipes: string[] = []
		let foods: string[] = []

		userDocument.path.map(({meal}) => {
			if (meal) {
				meal.items.map(item => {
					switch (item.type) {
						case 'recipe':
							if (!recipes.find(p => p === item.id)) {
								return recipes.push(item.id)
							}
							return
						case 'food':
							// weights.push(item)
							if (!foods.find(f => f === item.id)) {
								return foods.push(item.id)
							}
							return
						default:
							return
					}
				})
			}
		})

		const recipesData = await RecipeModel.find({_id: {$in: recipes}})
		const foodsData = await FoodRepo.findFoodVarietiesWithIds(foods, lang)

		userDocument.path = await Promise.all(userDocument.path.map(async event => {
			if (event.type === EVENT_TYPES.meal && event.meal) {
				event.meal.items = await Promise.all(event.meal.items.map(item => transformMealItem(item, recipesData, foodsData)))
			}

			return event
		}))
	}
	return userDocument
}

function transformUser(u: InstanceType<User>): Partial<User> {
	u = u.toObject()

	return {
		id: String(u.publicId),
		username: u.username,
		avatar: u.avatar,
	}
}

class UserRepository {
	static async findById(id: string): Promise<User> {
		const r = await UserModel.findById(id)
		if (!r) {
			throw new Error(__('notFound'))
		}

		// TODO Error handling
		return transformSelfUser(r)
	}

	static async findByPublicId(publicId: string): Promise<User> {
		const r = await UserModel.findOne({publicId})
		if (!r) {
			throw new Error(__('notFound'))
		}

		// TODO Error handling
		return transformSelfUser(r)
	}

	static async findByUsername(username: string): Promise<Partial<User>> {
		const r = await UserModel.findOne({username})
		if (!r) {
			throw new Error(__('notFound'))
		}

		// TODO Error handling
		return transformUser(r)
	}

	static async findOne(query: {}): Promise<User> {
		const r = await UserModel.findOne(query)
		if (!r) {
			throw new Error(__('notFound'))
		}
		return transformSelfUser(r)
	}

	static async getUserMealPlan(userId: string, lang: LANGUAGE_CODES): Promise<MealPlan> {
		let r = await UserModel.findById(userId).populate({
			path: 'mealPlans'
		}).exec()
		if (!r) {
			throw new Error(__('notFound'))
		}

		r = r.toObject()

		if (!r) {
			throw new Error(__('notFound'))
		}

		if (Array.isArray(r.mealPlans) && r.mealPlans.length === 0) {
			throw new Error('no meal plan')
		}

		if (r.mealPlans && !Array.isArray(r.mealPlans)) {
			return transformMealPlan(r.mealPlans, lang)
		}

		// @ts-ignore
		return transformMealPlan(r.mealPlans[0].toObject(), lang)
	}

	static async create(data: User) {
		return transformSelfUser(await UserModel.create(data))
	}

	static async modify(userId: string, data: Partial<User>) {
		// FIXME transform
		await UserModel.updateOne({_id: userId}, {$set: data})

		return this.findById(userId)
	}

	static async createMany(data: User[]) {
		// FIXME transform
		return UserModel.insertMany(data)
	}

	static async find(query: {}, limit: number, skip: number): Promise<User[]> {
		const r = await UserModel.find(query).limit(limit).skip(skip).exec()
		return Promise.all(r.map(u => transformSelfUser(u)))
	}

	static async findBySession(session: string) {
		const key = `user:session:${session}`
		const userDataJSONString = await redis.get(key)
			.catch(logError('findBySession->redis.get'))

		if (userDataJSONString) {
			let user = JSON.parse(userDataJSONString)
			redis.expire(key, config.times.sessionExpiration)
				.catch(logError('findBySession->redis.expire'))
			return user
		} else {
			const dbUser = await this.findOne({session, status: {$ne: STATUS.inactive}})
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
}

export default UserRepository