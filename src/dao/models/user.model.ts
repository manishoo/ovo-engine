/*
 * user.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Typegoose, prop, Ref, post, arrayProp, pre} from 'typegoose'
import {Field, ObjectType, Int, Float} from 'type-graphql'
import {ACTIVITY, GENDER, GOALS, HEIGHT_UNITS, STATUS, WEIGHT_UNITS} from '~/constants/enums'
import uuid from 'uuid/v1'
import HouseholdRepo from '@dao/repositories/household.repository'
import {Household} from '@dao/models/household.model'
import isUUID from 'is-uuid'
import {MacroNutrientDistribution} from '@services/assistant/types'
import {MealPlan, MealPlanSchema} from '@dao/models/meal-plan.model'
import {Event, Image, PersistedPassword} from '@dao/types'
import mongoose from '@dao/connections/mongoose'
import {ObjectID} from 'bson'


@ObjectType()
export class Height {
	@Field()
	value: number
	@Field()
	unit: HEIGHT_UNITS
}

@ObjectType()
export class WeightUnit {
	@Field()
	value: number
	@Field()
	unit: WEIGHT_UNITS
}

@ObjectType()
export class MealUnit {
	@Field()
	name: string
	@Field()
	time: string
	@Field(type => Int)
	energyPercentageOfDay: number
	@Field(type => Int)
	availableTime?: number
	@Field(type => Int)
	mealFor?: number
	@Field(type => Boolean)
	cook?: boolean
}

@ObjectType()
export class User {
	_id?: ObjectID
	@Field()
	id?: string
	@Field()
	publicId?: string
	@Field()
	username: string
	persistedPassword: PersistedPassword
	@Field()
	session?: string
	@Field()
	email: string
	@Field({nullable: true})
	firstName?: string
	@Field({nullable: true})
	middleName?: string
	@Field({nullable: true})
	lastName?: string
	@Field({nullable: true})
	avatar?: Image
	@Field(type => Float, {nullable: true})
	caloriesPerDay?: number
	@Field({nullable: true})
	height?: Height
	@Field({nullable: true})
	weight?: WeightUnit
	@Field({nullable: true})
	age?: number
	@Field(type => Int, {nullable: true})
	bodyFat?: number
	@Field({nullable: true})
	gender?: GENDER
	foodAllergies?: string[]
	status?: string
	meals?: MealUnit[]
	mealPlanSettings?: MacroNutrientDistribution
	mealPlans?: Ref<MealPlanSchema>[]
	household?: Ref<Household>
	activityLevel?: ACTIVITY
	goal?: GOALS
	@Field(type => [Event], {nullable: true})
	path?: Event[]
	timeZone?: string
}


@post<UserSchema>('save', function () {
	if (!this.model.household) {
		// create and assign household
		return new Promise((resolve, reject) => {
			HouseholdRepo.create(<Household>{
				members: [this.model._id]
			})
				.then((h) => {
					this.model.household = h
					this.save()
						.then(resolve)
				})
				.catch(reject)
		})
	}
})
export class UserSchema extends Typegoose implements User {
	@prop({default: uuid})
	publicId?: string

	/**
	 * login credentials
	 * */
	@prop({required: true, unique: true})
	username: string

	@prop({required: true})
	persistedPassword: PersistedPassword
	@prop({required: true, unique: true, default: uuid})
	session?: string

	/**
	 * personal information
	 * */
	@prop({required: true, unique: true})
	email: string
	@prop()
	firstName?: string
	@prop()
	middleName?: string
	@prop()
	lastName?: string
	@prop()
	avatar?: Image

	/**
	 * physical attributes
	 * */
	@prop()
	caloriesPerDay?: number
	@prop()
	height?: Height
	@prop()
	weight?: WeightUnit
	@prop({min: 0, max: 150})
	age?: number
	@prop()
	bodyFat?: number
	@prop()
	gender?: GENDER
	// FIXME allergies aren't foods!
	@arrayProp({ items: String, validate: value => !value.find((v: string) => !isUUID.v4(v)) })
	foodAllergies?: string[]

	/**
	 * other
	 * */
	@prop({required: true, enum: STATUS, default: STATUS.active})
	status?: string
	@prop({default: []})
	meals?: MealUnit[]
	@prop()
	mealPlanSettings?: MacroNutrientDistribution
	@prop({ref: MealPlanSchema})
	mealPlans?: Ref<MealPlanSchema>[]
	@prop({ref: Household})
	household?: Ref<Household>
	@prop()
	activityLevel?: ACTIVITY
	@prop()
	goal?: GOALS
	@prop({default: []})
	path?: Event[]
	@prop()
	timeZone?: string
}

export const UserModel = new UserSchema().getModelForClass(UserSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'users',
		timestamps: true,
		emitIndexErrors: true,
		validateBeforeSave: true,
	}
})
