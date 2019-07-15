/*
 * tag.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Typegoose, prop} from 'typegoose'
import {Field, InputType, ObjectType} from 'type-graphql'
import mongoose from '@dao/connections/mongoose'
import {LANGUAGE_CODES, TAG_TYPE} from '~/constants/enums'
import {Types} from 'mongoose'

@InputType()
export class TagInput {
	@Field()
	slug: string
	@Field()
	title: string
	@Field({nullable: true})
	info?: string
	@Field()
	type: TAG_TYPE
}

@ObjectType()
export class Tag {
	_id?: Types.ObjectId
	@Field()
	slug: string
	@Field({nullable: true})
	title?: string
	@Field({nullable: true})
	info?: string
	@Field()
	type: TAG_TYPE
	origTitle: string
	origInfo?: string
	origLang: LANGUAGE_CODES
	createdAt?: Date
	updatedAt?: Date
}

export class TagSchema extends Typegoose implements Tag {
	@prop({required: true})
	slug: string // only English: quick-bite
	@prop({required: true})
	origTitle: string // translation: سریع‌الحلقوم | Quick bite
	@prop()
	origInfo?: string // info about the tag
	@prop({required: true})
	origLang: LANGUAGE_CODES // translation: سریع‌الحلقوم | Quick bite
	@prop({required: true})
	type: TAG_TYPE // recipe, cuisine, etc.

	createdAt?: Date
	updatedAt?: Date
}

export const TagModel = new TagSchema().getModelForClass(TagSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		timestamps: true,
	}
})
