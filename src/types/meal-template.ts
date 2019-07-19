/*
 * meal-template.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { MealItem } from '@Types/eating'
import { User } from '@Types/user'
import { Field, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'

@ObjectType()
export class MealTemplate {
	@Field()
	id: string

	@Field({ nullable: true })
	name?: string

	@Field({ nullable: true })
	description?: string

	@Field(type => User, { nullable: true })
	author?: Ref<UserSchema> | User

	@Field(type => [MealItem])
	items: MealItem[]
}