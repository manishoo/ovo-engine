/*
 * household.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { IntlString } from '@Types/common'
import { FoodGroup, ParentFoodGroup } from '@Types/food-group'
import validateIntlString from '@Utils/validate-intl-string'
import { prop, Ref, Typegoose } from 'typegoose'


export class FoodGroupSchema extends Typegoose implements FoodGroup {
	readonly _id: mongoose.Schema.Types.ObjectId
	readonly id: number
	@prop({required: true, validate: validateIntlString})
	name: IntlString
	@prop({ ref: FoodGroupSchema })
	parentFoodGroup?: ParentFoodGroup | Ref<mongoose.Schema.Types.ObjectId>
}

export const FoodGroupModel = new FoodGroupSchema().getModelForClass(FoodGroupSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'foodGroups',
	}
})
