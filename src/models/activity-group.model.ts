/*
 * activity-group.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { ActivityGroup } from '@Types/activity'
import { Translation } from '@Types/common'
import { prop, Typegoose } from 'typegoose'


export class ActivityGroupSchema extends Typegoose implements ActivityGroup {
  @prop()
  name: Translation[]

  @prop({ required: true, unique: true })
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
