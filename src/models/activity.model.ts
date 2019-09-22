/*
 * tag.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { prop, Typegoose } from 'typegoose'
import { Activity } from '@Types/activity'
import { Translation } from '@Types/common'


export class ActivitySchema extends Typegoose implements Activity {
  @prop()
  activityTypeName: Translation[]

  @prop()
  burningRate: number

  @prop()
  met: number

  @prop()
  icon?: string

  createdAt?: Date
  updatedAt?: Date
}

export const ActivityModel = new ActivitySchema().getModelForClass(ActivitySchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    timestamps: true,
    collection: 'activities',
  }
})
