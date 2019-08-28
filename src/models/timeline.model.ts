
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'
import { TimeLine, TimelineMeal } from '@Types/timeline'
import mongoose from '@Config/connections/mongoose'


export interface TimelineSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class TimelineSchema extends Typegoose implements TimeLine {
  @prop()
  date: string

  @prop({ ref: UserSchema })
  user: Ref<UserSchema>

  @prop()
  meals: TimelineMeal[]
}

export const TimelineModel = new TimelineSchema().getModelForClass(TimelineSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'timeline',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})