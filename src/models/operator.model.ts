/*
 * operator.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { PersistedPassword } from '@Types/auth'
import { STATUS } from '@Types/common'
import { Operator } from '@Types/operator'
import { instanceMethod, InstanceType, prop, Typegoose } from 'typegoose'
import uuid from 'uuid/v1'


export class OperatorSchema extends Typegoose implements Operator {
	id: string
	@prop({ unique: true, required: true })
	username: string
	@prop({ required: true })
	persistedPassword: PersistedPassword
	@prop({ required: true, unique: true, default: uuid })
	session: string
	@prop({ required: true, enum: STATUS, default: STATUS.active })
	status?: string

	@instanceMethod
	transform(this: InstanceType<Operator>) {
		const obj = this.toObject()

		obj.id = obj._id.toString()
		delete obj._id

		return obj
	}
}

export const OperatorModel = new OperatorSchema().getModelForClass(OperatorSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'operators',
	}
})
