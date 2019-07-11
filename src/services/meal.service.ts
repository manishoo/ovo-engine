/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealRepository from 'src/dao/repositories/meal.repository'
import {MealInput} from '~/api/panel/resolvers/meals.resolver'

const DEFAULT_PAGE_SIZE = 25

const MealService = {
	async list(page: number = 1, size: number = DEFAULT_PAGE_SIZE, query?: string) {
		const {meals, totalCount} = await MealRepository.find(
			size,
			(page - 1) * size,
			query,
		)

		return {
			meals,
			pagination: {
				page,
				count: size,
				totalCount,
				totalPages: Math.ceil(totalCount / size),
			},
		}
	},
	async getOne(publicId: string) {
		return MealRepository.findById(publicId)
	},
	async delete(publicId: string) {
		await MealRepository.delete(publicId)

		return true
	},
	async update(publicId: string, data: MealInput) {
		return MealRepository.update(publicId, data)
	},
	async create(data: MealInput) {
		return MealRepository.create(data)
	},
}

export default MealService
