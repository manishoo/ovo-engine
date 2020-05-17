/*
 * calendar.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { PlanSchema } from '@Models/plan.model'
import { UserActivity } from '@Types/activity'
import { Day, DayMeal } from '@Types/calendar'
import { ObjectId, Ref } from '@Types/common'
import { Plan } from '@Types/plan'
import { Field } from 'type-graphql'
import { prop, Typegoose } from 'typegoose'


export class DaySchema extends Typegoose implements Day {
  @Field()
  readonly id: ObjectId
  readonly _id: ObjectId

  @prop()
  date: Date

  @prop({ ref: PlanSchema })
  plan: Ref<Plan>

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
