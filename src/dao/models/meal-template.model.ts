/*
 * meal-template.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Field, ObjectType} from 'type-graphql'
import {prop, Ref, Typegoose} from 'typegoose'
import {User, UserSchema} from '@dao/models/user.model'
import mongoose from '@dao/connections/mongoose'
import {MealItem} from '@dao/types'


@ObjectType()
export class MealTemplate extends Typegoose {
	@Field()
	id: string

	@Field({nullable: true})
	@prop()
	name?: string

	@Field({nullable: true})
	@prop()
	description?: string

	@Field(type => User, {nullable: true})
	@prop({ref: UserSchema})
	author?: Ref<UserSchema>

	@Field(type => [MealItem])
	@prop()
	items: MealItem[]
}

export const MealTemplateModel = new MealTemplate().getModelForClass(MealTemplate, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'dishes',
		timestamps: true,
		emitIndexErrors: true,
		validateBeforeSave: true,
	}
})
