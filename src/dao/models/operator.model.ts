/*
 * operator.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Typegoose, prop, instanceMethod, InstanceType} from 'typegoose'
import {Field, Int, ObjectType} from 'type-graphql'
import mongoose from '~/dao/connections/mongoose'
import uuid from 'uuid/v1'
import {LANGUAGE_CODES, STATUS} from '~/constants/enums'


export class PersistedPassword {
	salt: string
	hash: string
	iterations: number
}

@ObjectType()
export class Operator extends Typegoose {
	constructor(obj?: any) {
		super()
		if (obj) {
			Object.assign(this, obj)
		}
	}

	@Field()
	id: string

	@Field()
	@prop({unique: true, required: true})
	username: string

	@prop({required: true})
	persistedPassword: PersistedPassword

	@prop({required: true, unique: true, default: uuid})
	session: string

	@Field()
	@prop({required: true, enum: STATUS, default: STATUS.active})
	status?: string

	@instanceMethod
	transform(this: InstanceType<Operator>) {
		const obj = this.toObject()

		obj.id = obj._id.toString()
		delete obj._id

		return obj
	}
}

export const OperatorModel = new Operator().getModelForClass(Operator, {
	existingMongoose: mongoose,
})
