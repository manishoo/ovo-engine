/*
 * calendar.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserActivity } from '@Types/activity'
import { Day, DayMeal, BodyMeasurement } from '@Types/calendar'
import { Ref } from '@Types/common'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'


export interface DaySchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class DaySchema extends Typegoose implements Day {
  @prop()
  date: Date

  @prop({ ref: UserSchema })
  user: Ref<UserSchema>

  @prop()
  meals: DayMeal[]

  @prop()
  activities?: UserActivity[]

  @prop()
  totalBurnt?: number

  @prop()
  measurements: BodyMeasurement

  @prop()
  createdAt: Date
  @prop()
  updatedAt?: Date
}

export const CalendarModel = new DaySchema().getModelForClass(DaySchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'days',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
