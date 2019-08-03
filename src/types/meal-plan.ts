/*
 * meal-plan.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserMeal } from '@Types/eating'
import * as mongoose from 'mongoose'
import { Field, ObjectType } from 'type-graphql'

export enum WEEKDAYS {
	saturday = 'saturday',
	sunday = 'sunday',
	monday = 'monday',
	tuesday = 'tuesday',
	wednesday = 'wednesday',
	thursday = 'thursday',
	friday = 'friday',
}


@ObjectType()
export class Day {
	@Field()
	dayName: WEEKDAYS
	@Field(type => [UserMeal])
	meals: UserMeal[]
}

@ObjectType()
export class MealPlan {
	@Field()
	id: string
	@Field()
	name: string
	@Field(type => [Day])
	days: Day[]

	_id?: mongoose.Schema.Types.ObjectId
}

export enum DAY_PERIOD {
	breakfast = 'breakfast',
	launch = 'launch',
	dinner = 'dinner',
}
