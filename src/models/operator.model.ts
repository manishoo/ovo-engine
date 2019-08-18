/*
 * operator.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { PersistedPassword } from '@Types/auth'
import { Role, Status } from '@Types/common'
import { Operator } from '@Types/operator'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { instanceMethod, InstanceType, plugin, prop, Typegoose } from 'typegoose'
import uuid from 'uuid/v1'


export interface OperatorSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class OperatorSchema extends Typegoose implements Operator {
  id: string
  @prop({ unique: true, required: true })
  username: string
  @prop({ required: true })
  persistedPassword: PersistedPassword
  @prop({ required: true, unique: true, default: uuid })
  session: string
  @prop({ required: true, enum: Status, default: Status.active })
  status?: string
  @prop({ required: true, enum: Role, default: Role.operator })
  role?: Role

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
