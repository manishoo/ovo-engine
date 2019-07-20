/*
 * assistant.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Item } from '@Types/common'
import { Field, Float, ObjectType } from 'type-graphql'

@ObjectType()
export class MacroNutrientDistribution {
	@Field(type => Float, { nullable: true })
	protein?: number

	@Field(type => Float, { nullable: true })
	fat?: number

	@Field(type => Float, { nullable: true })
	carbs?: number

	@Field(type => Float, { nullable: true })
	tdee?: number
}

@ObjectType()
export class MessageAdditionalData {
	@Field({ nullable: true })
	expect?: string
	@Field({ nullable: true })
	value?: string
	@Field(type => Boolean, { nullable: true })
	skip?: boolean
	@Field(type => [Item], { nullable: true })
	items?: Item[]
	@Field(type => [String], { nullable: true })
	foods?: string[]
	@Field(type => MacroNutrientDistribution, { nullable: true })
	mealPlanSettings?: MacroNutrientDistribution
}

@ObjectType()
export class Message {
	@Field()
	id: string
	@Field()
	sender: string
	@Field()
	text: string
	@Field()
	timestamp: string
	@Field()
	type: string
	@Field(type => [Item], { nullable: true })
	items?: Item[]
	@Field({ nullable: true })
	expect?: string
	@Field({ nullable: true })
	data?: MessageAdditionalData
}

@ObjectType()
export class MessagePayload {
	@Field(type => [Message])
	messages: Message[]
	@Field({nullable: true})
	token?: string
	@Field({nullable: true})
	userId?: string
}


export class MessageBackgroundInformation {
	conversationHistory: Message[]
	tempData?: any
	user?: any
}

export enum CONTEXTS {
	introduction = 'introduction'
}

export enum EXPECTATIONS {
	gender = 'gender',
	nickname = 'nickname',
	age = 'age',
	weight = 'weight',
	height = 'height',
	activity = 'activity',
	goal = 'goal',
	meals = 'meals',
	register = 'register',
	allergy = 'allergy',
	dislikedFoods = 'dislikedFoods',
	diet = 'diet',
	chooseDiet = 'chooseDiet',
	meal = 'meal',
	normalRoutine = 'normalRoutine',
	mealPlanSettings = 'mealPlanSettings',
	mealPlan = 'mealPlan',
}

export enum GUEST_TEMP_FIELDS {
	nickname = 'nickname',
	age = 'age',
	weight = 'weight',
	height = 'height',
	gender = 'gender',
	bmr = 'bmr',
	activity = 'activity',
	tdee = 'tdee',
	goal = 'goal',
	allergies = 'allergies',
}

export enum INPUT_TYPES {
	number = 'number',
	form = 'form',
	select = 'select',
	food = 'food',
	weight = 'weight',
	height = 'height',
	mealPlanSettings = 'mealPlanSettings',
}

export enum DIETS {
	keto = 'Ketogenic',
}