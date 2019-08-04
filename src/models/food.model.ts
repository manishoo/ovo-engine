/*
 * food.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Translation } from '@Types/common'
import { Food, FoodContent } from '@Types/food'
import { Weight } from '@Types/weight'
import { prop, Typegoose, Ref } from 'typegoose'
import { FoodClassSchema } from '@Models/food-class.model'

export class FoodSchema extends Typegoose implements Food {
	readonly _id: mongoose.Schema.Types.ObjectId
	readonly id: string

	@prop({ required: true })
	name: Translation[]
	@prop()
	origFoodId?: string
	@prop()
	origDb?: string
	@prop({ required: true })
	foodClass: Ref<FoodClassSchema>
	@prop({ default: [], required: true })
	contents: FoodContent[]
	@prop({ default: [], required: true })
	weights: Weight[]
}

export const FoodModel = new FoodSchema().getModelForClass(FoodSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'foods',
	}
})
