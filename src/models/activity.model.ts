/*
 * activity.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Activity, ActivityGroup } from '@Types/activity'
import { Ref, Translation } from '@Types/common'
import { prop, Typegoose } from 'typegoose'
import { ActivityGroupSchema } from './activity-group.model'


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
