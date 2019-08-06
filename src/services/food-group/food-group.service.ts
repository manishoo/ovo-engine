/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
import { FoodModel } from '@Models/food.model'
import { Translation } from '@Types/common'
import { FoodGroup, FoodGroupInput, ParentFoodGroup } from '@Types/food-group'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'


@Service()
export default class FoodGroupService {
	async getFoodGroup(id: string): Promise<ParentFoodGroup> {
		const foodGroup = await FoodGroupModel.findById(id)
		if (!foodGroup) throw new Errors.NotFound('food group not found')

		const subGroups = await FoodGroupModel.find({ parentFoodGroup: mongoose.Types.ObjectId(id) })

		return {
			id: foodGroup.id,
			name: foodGroup.name,
			subGroups,
		}
	}

	async listFoodGroups(): Promise<ParentFoodGroup[]> {
		const foodGroups = await FoodGroupModel.find()

		return foodGroups.filter(fg => !fg.parentFoodGroup)
			.map(rootFoodGroup => {
				return {
					id: rootFoodGroup.id,
					name: rootFoodGroup.name,
					subGroups: foodGroups.filter(fg => String(fg.parentFoodGroup) === String(rootFoodGroup.id))
				} as ParentFoodGroup
			})
	}

	async addFoodGroup(name: Translation[], parentFoodGroup?: string): Promise<FoodGroup> {
		return FoodGroupModel.create(<FoodGroup>{
			name,
			parentFoodGroup,
		})
	}

	async removeFoodGroup(foodGroupID: string): Promise<Boolean> {
		const foodGroup = await FoodGroupModel.findById(foodGroupID)
		if (!foodGroup) throw new Errors.NotFound('food group not found')

		/**
		 * Check if this food group or its sub groups have foods associated with them
		 * throw an error
		 * */
		const foodsCount = await FoodClassModel.countDocuments({'foodGroup._id': foodGroup._id})
		if (foodsCount !== 0) throw new Errors.Validation('This food group has foods associated with it! It can\'t be removed')

		/**
		 * Check if it has subgroups, raise an error
		 * */
		const count = await FoodGroupModel.countDocuments({parentFoodGroup: foodGroup._id})
		if (count !== 0) throw new Errors.Validation('This food group has subgroups. Please first delete the subgroups')

		await foodGroup.remove()

		return true
	}

	async editFoodGroup(foodGroup: FoodGroupInput): Promise<ParentFoodGroup | null> {
		const editingFoodGroup = await FoodGroupModel.findById(foodGroup.id)
		if (!editingFoodGroup) throw new Errors.NotFound('food group not found')

		const editingFoodGroupSubGroups = await FoodGroupModel.find({ parentFoodGroup: foodGroup.id })

		editingFoodGroup.name = foodGroup.name

		// If user deleted a subgroup
		Promise.all(editingFoodGroupSubGroups.map(async fg => {
			const found = foodGroup.subGroups.find(sg => sg.id === String(fg.id))
			if (!found) {
				await fg.remove()
			}
		}))

		// If user added a subgroup
		Promise.all(foodGroup.subGroups.map(async fg => {
			const found = editingFoodGroupSubGroups.find(sg => String(sg.id) === fg.id)

			if (!found) {
				await this.addFoodGroup(fg.name, foodGroup.id)
			}
		}))

		const foodGroupSubGroups = await FoodGroupModel.find({ parentFoodGroup: foodGroup.id })

		const result = await editingFoodGroup.save()

		return {
			id: result.id,
			name: result.name,
			subGroups: foodGroupSubGroups,
		}
	}
}
