/*
 * food-class.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassListResponse } from '@Types/food-class'
import { FoodClassModel } from '@Models/food-class.model'
import { Service } from 'typedi'

@Service()
export default class FoodClassService {
	async listFoodClasses(page: number, size: number): Promise<FoodClassListResponse> {
		const counts = await FoodClassModel.countDocuments()

		if (page > Math.ceil(counts / size)) page = Math.ceil(counts / size)
		if (page < 1) page = 1

		const foodClasses = await FoodClassModel.find()
			.limit(size)
			.skip(size * page)

		return {
			foodClasses,
			pagination: {
				page,
				size,
				totalCount: counts,
				totalPages: Math.floor(counts / size),
				hasNext: page !== Math.floor(counts / size)
			}
		}
	}
}
