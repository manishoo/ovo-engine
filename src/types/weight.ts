/*
 * weight.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { IntlString } from '@Types/common'
import { Field, InputType, ObjectType } from 'type-graphql'


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
	@Field(type => String)
	name: IntlString
}


@InputType()
export class WeightInput {
	@Field({ nullable: true })
	id?: string
	@Field()
	amount: number
	// @Field(type => [WeightTranslationI])
	// translations: WeightTranslationI[]
	@Field()
	seq: number
	@Field({ nullable: true })
	unit?: string
	@Field()
	gramWeight: number
}