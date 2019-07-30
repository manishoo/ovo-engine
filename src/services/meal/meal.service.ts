/*
 * meal.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealTemplateModel } from '@Models/meal-template.model'
import { MealTemplate } from '@Types/meal-template'
import Errors from '@Utils/errors'
import { __ } from 'i18n'
import { MealInput } from 'src/api/panel/resolvers/meal.resolver'
import { Service } from 'typedi'

const DEFAULT_PAGE_SIZE = 25

@Service()
export default class MealService {
	async findById(id: String): Promise<MealTemplate> {
		const r = await MealTemplateModel.findById(id)
		if (!r) {
			throw new Errors.NotFoundError(__('notFound'))
		}

		return r
	}

	async findOne(query: {}): Promise<MealTemplate> {
		const r = await MealTemplateModel.findOne(query)
		if (!r) throw new Errors.NotFoundError(__('notFound'))

		return r
	}

	async create(data: MealInput) {
		const createdMeal = await MealTemplateModel.create({
			// TODO incomplete
		})

		return createdMeal
	}

	async delete(id: string) {
		await MealTemplateModel.remove({ publicId: id })

		return true
	}

	async find(limit: number, skip: number = 0, query?: string): Promise<{ meals: MealTemplate[], totalCount: number }> {
		const q = {} // FIXME
		const results = await MealTemplateModel.find(q).limit(limit).skip(skip).exec()
		const totalCount = await MealTemplateModel.count(q)

		return {
			meals: results,
			totalCount,
		}
	}

	async update(publicId: string, data: MealInput) {
		const meal = await MealTemplateModel.findById(publicId)
		if (!meal) throw new Errors.NotFoundError(__('notFound'))

		// TODO: actually update the meal

		return meal
	}

	async list(page: number = 1, size: number = DEFAULT_PAGE_SIZE, query?: string) {
		const { meals, totalCount } = await this.find(
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
	}

	async getOne(publicId: string) {
		return this.findById(publicId)
	}
}
