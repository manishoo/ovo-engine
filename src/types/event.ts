/*
 * event.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserMeal } from '@Types/eating'
import { Field, ObjectType } from 'type-graphql'
import { prop } from 'typegoose'


export enum EVENT_TYPES {
	meal = 'meal',
	exercise = 'exercise',
}


@ObjectType()
export class Event {
	@Field()
	id: string

	@Field()
	name: string

	@Field()
	datetime: string

	@Field()
	type: 'meal' | 'exercise'

	@Field(type => UserMeal, { nullable: true })
	@prop()
	meal?: UserMeal
}