/*
 * household.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food } from '@Types/food'
import { User } from '@Types/user'
import { Field, Int, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'
import { UserSchema } from '@Models/user.model'

@ObjectType()
export class LatLng {
	@Field(type => Int)
	lat: number
	@Field(type => Int)
	lng: number
}


@ObjectType()
export class PantryItem {
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
export class Household {
	@Field(type => [User])
	members: Ref<UserSchema>[] | User[]
	@Field(type => LatLng, { nullable: true })
	location?: LatLng
	@Field(type => [PantryItem])
	pantry?: PantryItem[]
}