
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'
import { Day } from '@Types/calendar'
import mongoose from 'mongoose'
import { Meal } from '@Types/eating';


export interface DaySchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class DaySchema extends Typegoose implements Day {
  @prop()
  date: Date

  @prop({ ref: UserSchema })
  user: Ref<UserSchema>

  @prop()
  meals: Meal[]

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