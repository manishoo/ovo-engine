/*
 * weight.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Field, InputType, ObjectType } from 'type-graphql'
import { LANGUAGE_CODES } from '@Types/common'

@ObjectType()
export class WeightTranslationO {
	@Field(type => String)
	lang: LANGUAGE_CODES
	@Field()
	description: string
}

@ObjectType()
export class Weight {
	@Field()
	id: string
	@Field()
	amount: number
	@Field()
	gramWeight: number
	@Field()
	seq: number
	@Field({ nullable: true })
	description?: string
	@Field({ nullable: true })
	unit?: string
	@Field(type => [WeightTranslationO], { nullable: true })
	translations?: WeightTranslationO[]
}

@InputType()
export class WeightTranslationI {
	@Field(type => String)
	lang: LANGUAGE_CODES
	@Field()
	description: string
}


@InputType()
export class WeightInput {
	@Field({ nullable: true })
	id?: string
	@Field()
	amount: number
	@Field(type => [WeightTranslationI])
	translations: WeightTranslationI[]
	@Field()
	seq: number
	@Field({ nullable: true })
	unit?: string
	@Field()
	gramWeight: number
}