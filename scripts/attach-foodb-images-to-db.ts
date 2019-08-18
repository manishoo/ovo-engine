/*
 * attach-foodb-images-to-db.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */



import { FoodClassModel } from '../src/models/food-class.model'

export default async function main() {
	const foodClasses = await FoodClassModel.find()

	await Promise.all(foodClasses.map(async fc => {
		fc.imageUrl = {
			url: `http://foodb.ca/system/foods/pictures/${fc.origId}/full/${fc.origId}.png`
		}
		fc.thumbnailUrl = {
			url: `http://foodb.ca/system/foods/pictures/${fc.origId}/thumb/${fc.origId}.png`
		}

		await fc.save()
	}))
}
