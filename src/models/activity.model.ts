import { Activity, ActivityGroup } from '../types/activity'
import { Translation, Ref } from '../types/common'
import { plugin, prop, Typegoose } from 'typegoose'
import mongoose from '@Config/connections/mongoose'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { ActivityGroupSchema } from './activity-group.model'


export interface ActivitySchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class ActivitySchema extends Typegoose implements Activity {
  @prop()
  activityTypeName: Translation[]

  @prop()
  met: number

  @prop()
  icon?: string

  @prop({ ref: ActivityGroupSchema })
  activityGroup: Ref<ActivityGroup>
}

export const ActivityModel = new ActivitySchema().getModelForClass(ActivitySchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'activities',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
}
)