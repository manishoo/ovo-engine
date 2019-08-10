/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { Food, FoodsListResponse, FoodInput } from '@Types/food'
import { Service } from 'typedi'
import mongoose from 'mongoose';


@Service()
export default class FoodService {
	constructor(
		// service injection
	) {
		// noop
	}

	async listFoods(page: number, size: number, foodClassID?: string): Promise<FoodsListResponse> {
		let query: any = {}
		if (foodClassID) {
			query['foodClass'] = new mongoose.Types.ObjectId(foodClassID)
		}

		const foods = await FoodModel.find(query)
			.limit(size)
			.skip(size * (page - 1))

		const counts = await FoodModel.countDocuments(query)

		return {
			foods,
			pagination: {
				page,
				size,
				totalCount: counts,
				totalPages: Math.ceil(counts / size),
				hasNext: page !== Math.ceil(counts / size),
			}
		}
	}

	async updateFood(food: FoodInput): Promise<Food> {
		return FoodModel.updateOne({_id: food.id}, food)
	}

}
