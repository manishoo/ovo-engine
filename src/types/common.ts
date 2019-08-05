/*
 * common.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { Field, ObjectType, registerEnumType, InputType } from 'type-graphql'
import { prop, Ref } from 'typegoose'


export enum LanguageCode {
	en = 'en',
	fa = 'fa',
}
registerEnumType(LanguageCode, {
	name: 'LanguageCode',
	description: 'Language Roles'
})

export enum Status {
	active = 'ACTIVE',
	inactive = 'INACTIVE',
}

export enum Role {
	admin = 'ADMIN',
	operator = 'OPERATOR',
}

registerEnumType(Role, {
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

@ObjectType()
export class Translation {
	@prop({ enum: LanguageCode, required: true })
	@Field(type => LanguageCode)
	locale: LanguageCode
	@prop({ required: true })
	@Field()
	text: string
}

@InputType()
export class TranslationInput {
	@Field(type => LanguageCode)
	locale: LanguageCode
	@Field()
	text: string
}
