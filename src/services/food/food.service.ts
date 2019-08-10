/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { Food, FoodsListResponse, FoodInput } from '@Types/food'
import { Service } from 'typedi'
import mongoose from 'mongoose';
import Errors from '@Utils/errors'
import { WeightInput } from '@Types/weight'


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

	async updateFood(inputFood: FoodInput): Promise<Food | null> {
		const food = await FoodModel.findById(inputFood.id)
		if (!food) throw new Errors.NotFound('food not found')

		let weights: WeightInput[] = []
		inputFood.weights.map(weight => {
			if (weight.id) {
				weights.push(weight)
			} else {
				weight['id'] = String(new mongoose.Types.ObjectId())
				weights.push(weight)
			}
		})

		food.name = inputFood.name
		food.weights = weights

		return food.save()
	}

	async deleteFood(foodID: string): Promise<Food> {
		if(!mongoose.Types.ObjectId.isValid(foodID)) throw new Errors.UserInput('invalid food ID', {'foodID': 'invalid food ID'})

		const food = await FoodModel.findByIdAndDelete(foodID)
		if(!food) throw new Errors.NotFound('food not found')

		return food
	}

}
