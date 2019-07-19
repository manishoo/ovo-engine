/*
 * meals.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Pagination } from '@Types/common'
import { MealTemplate } from '@Types/meal-template'
import { Field, ObjectType } from 'type-graphql'


export enum MEAL_ITEM_TYPES {
	recipe = 'recipe',
	food = 'food',
}

@ObjectType()
export class MealsListResponse {
	@Field(type => [MealTemplate])
	meals: MealTemplate[]
	@Field(type => Pagination)
	pagination: Pagination
}