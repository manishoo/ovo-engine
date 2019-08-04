/*
 * weight.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation } from '@Types/common'
import * as mongoose from 'mongoose'
import { Field, InputType, ObjectType } from 'type-graphql'
import { prop } from 'typegoose'


@ObjectType()
export class Weight {
	@prop({ default: mongoose.Types.ObjectId })
	@Field(type => String)
	id: mongoose.Types.ObjectId
	@Field()
	amount: number
	@Field()
	gramWeight: number
	@Field()
	seq: number
	@Field(type => String)
	name: Translation[]
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