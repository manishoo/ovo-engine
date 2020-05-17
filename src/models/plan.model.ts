/*
 * meal-plan.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserSchema } from '@Models/user.model'
import { Image, ObjectId, Ref, Translation } from '@Types/common'
import { Plan } from '@Types/plan'
import { BasicUser } from '@Types/user'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'


export interface PlanSchema extends SoftDeleteModel<SoftDeleteDocument & Plan> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class PlanSchema extends Typegoose implements Plan {
  readonly _id: ObjectId
  readonly id: ObjectId

  @prop({ ref: UserSchema })
  user: Ref<BasicUser>

  @prop()
  name?: Translation[]

  @prop()
  description?: Translation[]

  @prop()
  coverImage?: Image

  @prop()
  thumbnailImage?: Image
}

export const PlanModel = new PlanSchema().getModelForClass(PlanSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'plans',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
