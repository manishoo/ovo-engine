/*
 * household.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Typegoose, prop, Ref} from 'typegoose'
import {Field, Int, ObjectType} from 'type-graphql'
import mongoose from '@dao/connections/mongoose'
import {User, UserSchema} from '@dao/models/user.model'
import {Utensil} from '@dao/models/utensil.model'
import {Food} from '@dao/types'


@ObjectType()
class LatLng {
	@Field(type => Int)
	lat: number
	@Field(type => Int)
	lng: number
}


@ObjectType()
class PantryItem {
	@Field(type => Food)
	food: Food
	@Field(type => Int)
	amountInGrams: number
	@Field()
	dateAdded: Date
	@Field()
	expiresAt?: Date
}


@ObjectType()
export class Household extends Typegoose {
	constructor(obj?: any) {
		super()
		if (obj) {
			Object.assign(this, obj)
		}
	}

	@Field(type => [User])
	@prop({required: true, ref: UserSchema})
	members: Ref<UserSchema>[]

	@Field(type => LatLng, {nullable: true})
	@prop()
	location?: LatLng

	@Field(type => [Utensil])
	@prop({ref: Utensil})
	utensils?: Ref<Utensil>[]

	@Field(type => [PantryItem])
	@prop()
	pantry?: PantryItem[]
}

export const HouseholdModel = new Household().getModelForClass(Household, {
	existingMongoose: mongoose,
})
