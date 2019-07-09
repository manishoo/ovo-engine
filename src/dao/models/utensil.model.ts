/*
 * utensil.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Typegoose, prop} from 'typegoose'
import { Field, ObjectType } from 'type-graphql'
import mongoose from '~/dao/connections/mongoose'
import {Image} from '~/dao/types'

@ObjectType()
export class Utensil extends Typegoose {
	@Field()
	@prop({required: true})
	name: string

	@Field(type => Image, { nullable: true })
	@prop()
	image?: Image
}

export const UtensilModel = new Utensil().getModelForClass(Utensil, {
	existingMongoose: mongoose,
})
