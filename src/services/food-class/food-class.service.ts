/*
 * food-class.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassListResponse, FoodClass, FoodClassInput } from '@Types/food-class'
import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
import { Service } from 'typedi'
import mongoose from 'mongoose'
import Errors from '@Utils/errors'

@Service()
export default class FoodClassService {
	async listFoodClasses(page: number, size: number, foodGroupID?: string, searchFoodGroup?: string): Promise<FoodClassListResponse> {
		let query: any = {}

		if (foodGroupID) {
			query['foodGroup._id'] = foodGroupID
		}
		if (searchFoodGroup) {//{ "name" : { $regex: /Ghost/, $options: 'i' }
			let reg = new RegExp(searchFoodGroup)
			query['name.text'] = { $regex: reg, $options: 'i' }
		}
		console.log(query)
		const counts = await FoodClassModel.countDocuments()

		if (page > Math.ceil(counts / size)) page = Math.ceil(counts / size)
		if (page < 1) page = 1

		const foodClasses = await FoodClassModel.find(query)
			.limit(size)
			.skip(size * (page - 1))

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

	async editFoodClass(foodClass: FoodClassInput): Promise<FoodClass> {
		const foodGroup = await FoodGroupModel.findOne({ _id: mongoose.Types.ObjectId(foodClass.foodGroupId) })
		if (!foodGroup) throw new Errors.NotFound('food group not found')

		const editingFoodClass = await FoodClassModel.findByIdAndUpdate(mongoose.Types.ObjectId(foodClass.id), {
			...foodClass,
			foodGroup
		})
		if (!editingFoodClass) throw new Errors.NotFound('food class not found')

		return editingFoodClass
	}

}
