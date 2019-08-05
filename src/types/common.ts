/*
 * common.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { prop, Ref, Typegoose } from 'typegoose'


export enum LANGUAGE_CODES {
	en = 'en',
	fa = 'fa',
}

export enum STATUS {
	active = 'ACTIVE',
	inactive = 'INACTIVE',
}

export enum ROLE {
	admin = 'ADMIN',
	operator = 'OPERATOR',
}
registerEnumType(ROLE, {
	name: 'Role',
	description: 'Operator Roles'
})

@ObjectType()
export class NameAndId {
	@Field()
	name: string
	@Field()
	id: string
}


@ObjectType()
export class Video {
	@Field({ nullable: true })
	width?: number

	@Field({ nullable: true })
	height?: number

	@Field({ nullable: true })
	sourceUrl?: string

	@Field({ nullable: true })
	source?: string

	@Field({ nullable: true })
	authorName?: string

	// @Field(type => String, {nullable: true})
	authorId?: Ref<UserSchema>

	@Field()
	url: string
}

@ObjectType()
export class Image {
	@Field({ nullable: true })
	width?: number

	@Field({ nullable: true })
	height?: number

	@Field({ nullable: true })
	sourceUrl?: string

	@Field({ nullable: true })
	source?: string

	@Field({ nullable: true })
	authorName?: string

	// @Field(type => String, {nullable: true})
	authorId?: Ref<UserSchema>

	@Field()
	url: string
}

@ObjectType()
export class Pagination {
	@Field({ nullable: true })
	page?: number
	@Field({ nullable: true })
	size?: number
	@Field({ nullable: true })
	totalCount?: number
	@Field({ nullable: true })
	totalPages?: number
	@Field({ nullable: true })
	hasNext?: boolean
	@Field({ nullable: true })
	lastId?: string
}

@ObjectType()
export class Item {
	@Field()
	text: string
	@Field()
	value: string
}

export class Translation {
	@prop({ enum: LANGUAGE_CODES, required: true })
	locale: LANGUAGE_CODES
	@prop({ required: true })
	text: string
}
