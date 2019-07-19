/*
 * tag.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES } from '@Types/common'
import { Types } from 'mongoose'
import { Field, InputType, ObjectType } from 'type-graphql'

export enum TAG_TYPE {
	cuisine = 'cuisine',
	meal = 'meal',
	diet = 'diet',
	recipe = 'recipe',
	ingredient = 'ingredient',
	occasion = 'occasion',
}

@InputType()
export class TagInput {
	@Field()
	slug: string
	@Field()
	title: string
	@Field({ nullable: true })
	info?: string
	@Field()
	type: TAG_TYPE
}

@ObjectType()
export class Tag {
	_id?: Types.ObjectId
	@Field()
	slug: string
	@Field({ nullable: true })
	title?: string
	@Field({ nullable: true })
	info?: string
	@Field()
	type: TAG_TYPE
	origTitle: string
	origInfo?: string
	origLang: LANGUAGE_CODES
	createdAt?: Date
	updatedAt?: Date
}