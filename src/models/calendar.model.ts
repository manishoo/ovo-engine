/*
 * calendar.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserActivity } from '@Types/activity'
import { Day, DayMeal } from '@Types/calendar'
import { Ref } from '@Types/common'
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { prop, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'


export interface DaySchema extends SoftDeleteModel<SoftDeleteDocument> {
}

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
