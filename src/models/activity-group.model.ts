import { ActivityGroup } from '../types/activity'
import { Translation } from '../types/common'
import { plugin, prop, Typegoose, index } from 'typegoose'
import mongoose from '@Config/connections/mongoose'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'


export interface ActivityGroupSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})

export class ActivityGroupSchema extends Typegoose implements ActivityGroup {
  @prop()
  name: Translation[]

  @prop()
  slug: string
}

export const ActivityGroupModel = new ActivityGroupSchema().getModelForClass(ActivityGroupSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'activityGroups',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true
  }
})