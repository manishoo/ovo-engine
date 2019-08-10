/*
 * food-class.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
import { FoodModel } from '@Models/food.model'
import UploadService from '@Services/upload/upload.service'
import { FoodClass, FoodClassInput, FoodClassListResponse } from '@Types/food-class'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'

@Service()
export default class FoodClassService {
	constructor(
		// service injection
		private readonly uploadService: UploadService
	) {
		// noop
	}

	async listFoodClasses(page: number, size: number, foodGroupID?: string, nameSearchQuery?: string): Promise<FoodClassListResponse> {
		let query: any = {}

		if (foodGroupID) {
			query['foodGroup._id'] = foodGroupID
		}
		if (nameSearchQuery) {
			let reg = new RegExp(nameSearchQuery)
			query['name.text'] = { $regex: reg, $options: 'i' }
		}
		const counts = await FoodClassModel.countDocuments(query)

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
				totalPages: Math.ceil(counts / size),
				hasNext: page !== Math.ceil(counts / size)
			}
		}
	}

	async getFoodClass(foodClassID: string): Promise<FoodClass> {
		const foodClass = await FoodClassModel.findById(mongoose.Types.ObjectId(foodClassID))
		if (!foodClass) throw new Errors.NotFound('food class not found')

		return foodClass
	}

	async editFoodClass(foodClassID: string, foodClassInput: FoodClassInput): Promise<FoodClass> {
		const foodGroup = await FoodGroupModel.findOne({ _id: mongoose.Types.ObjectId(foodClassInput.foodGroupId) })
		if (!foodGroup) throw new Errors.NotFound('food group not found')

		const foodClass = await FoodClassModel.findById(foodClassID)
		if (!foodClass) throw new Errors.NotFound('food class not found')

		if (foodClassInput.imageUrl) {
			foodClass.imageUrl = {
				url: await this.uploadService.processUpload(foodClassInput.imageUrl, 'full', `images/foods/${foodClassInput.slug}`)
			}
		}
		if (foodClassInput.thumbnailUrl) {
			foodClass.thumbnailUrl = {
				url: await this.uploadService.processUpload(foodClassInput.thumbnailUrl, 'thumb', `images/foods/${foodClassInput.slug}`)
			}
		}

		foodClass.name = foodClassInput.name
		foodClass.foodGroup = foodGroup
		foodClass.description = foodClassInput.description
		foodClass.slug = foodClassInput.slug

		return foodClass.save()
	}

	async deleteFoodClass(foodClassID: string): Promise<Boolean> {
		const foodClass = await FoodClassModel.findById(mongoose.Types.ObjectId(foodClassID))
		if (!foodClass) throw new Errors.NotFound('food class not found')

		const foodCount = await FoodModel.countDocuments({ foodClass: foodClass._id })
		if (foodCount !== 0) throw new Errors.Validation('This food class has food associated with it! It can\'t be removed')

		await foodClass.remove()

		return true
	}

	async createFoodClass(foodClass: FoodClassInput): Promise<FoodClass> {
		if (!mongoose.Types.ObjectId.isValid(foodClass.foodGroupId)) throw new Errors.UserInput('invalid food group id', { 'foodGroupId': 'invalid food group id' })
		const foodGroup = await FoodGroupModel.findById(foodClass.foodGroupId)
		if (!foodGroup) throw new Errors.NotFound('food group not found')

		let newFoodClass = new FoodClassModel({
			...foodClass,
			foodGroup,
		})
		return newFoodClass.save()
	}

}
