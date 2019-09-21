/*
 * meal.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Meal, MealItem } from '@Types/meal'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'
import { Author } from '@Types/user'
import { Nutrition } from '@Types/food'


export interface MealSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class MealSchema extends Typegoose implements Meal {
  readonly id?: string
  @prop()
  name?: string
  @prop()
  description?: string
  @prop()
  items: MealItem[]
  @prop()
  nutrition?: Nutrition
  @prop({ ref: UserSchema })
  author: Ref<Author>
}

export const MealModel = new MealSchema().getModelForClass(MealSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'meals',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
