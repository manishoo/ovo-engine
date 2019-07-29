/*
 * meal-template.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { MealItem } from '@Types/eating'
import { MealTemplate } from '@Types/meal-template'
import { User } from '@Types/user'
import { prop, Ref, Typegoose } from 'typegoose'


export class MealTemplateSchema extends Typegoose implements MealTemplate {
	id: string
	@prop()
	name?: string
	@prop()
	description?: string
	@prop({ ref: UserSchema })
	author?: Ref<UserSchema> | User
	@prop()
	items: MealItem[]
}

export const MealTemplateModel = new MealTemplateSchema().getModelForClass(MealTemplateSchema, {
	schemaOptions: {
		collection: 'mealTemplates',
		timestamps: true,
		emitIndexErrors: true,
		validateBeforeSave: true,
	}
})
