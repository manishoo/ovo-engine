/*
 * meal-plan.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { ObjectId } from '@Types/common'
import { Day, MealPlan } from '@Types/meal-plan'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'


export interface MealPlanSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class MealPlanSchema extends Typegoose implements MealPlan {
  id: string
  @prop({ required: true })
  name: string
  @prop({ required: true })
  days: Day[]
  _id?: ObjectId
}

export const MealPlanModel = new MealPlanSchema().getModelForClass(MealPlanSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'mealPlans',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
