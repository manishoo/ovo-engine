/*
 * meal.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Meal, MealModel} from '~/dao/models/meal.model'
import {__} from 'i18n'
import {MealInput} from '~/services/api-gateway/resolvers/panel/meals.resolver'
import {InstanceType} from 'typegoose'

async function transformMeal(meal: InstanceType<Meal>): Promise<Meal> {
	/**
	 because of a compatibility issue of
	 typegoose and type-graphql, we have
	 to do this absurd thing here
	 * */
	return new Meal(meal)
}

const MealRepository = {
	async findById(id: String): Promise<Meal> {
		const r = await MealModel.findById(id)
		if (!r) {
			throw new Error(__('notFound'))
		}

		return transformMeal(r)
	},

	async findOne(query: {}): Promise<Meal> {
		const r = await MealModel.findOne(query)
		if (!r) throw new Error(__('notFound'))

		return transformMeal(r)
	},

	async create(data: MealInput) {
		const createdMeal = await MealModel.create({
			// FIXME
		})

		return transformMeal(createdMeal)
	},

	async delete(id: string) {
		return MealModel.remove({publicId: id})
	},

	async find(limit: number, skip: number = 0, query?: string): Promise<{ meals: Meal[], totalCount: number }> {
		const q = {} // FIXME
		const results = await MealModel.find(q).limit(limit).skip(skip).exec()
		const totalCount = await MealModel.count(q)

		return {
			meals: await Promise.all(results.map(transformMeal)),
			totalCount,
		}
	},

	async update(publicId: string, data: MealInput) {
		const meal = await MealModel.findById(publicId)
		if (!meal) throw new Error(__('notFound'))

		// TODO: actually update the meal

		return transformMeal(meal)
	},
}

export default MealRepository
