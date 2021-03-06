/*
 * dish.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Dish, DishItem } from '@Types/dish'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'
import { Author } from '@Types/user'
import { Nutrition } from '@Types/food'


export interface DishSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class DishSchema extends Typegoose implements Dish {
  readonly id?: string
  @prop()
  name?: string
  @prop()
  description?: string
  @prop()
  items: DishItem[]
  @prop()
  nutrition?: Nutrition
  @prop({ ref: UserSchema })
  author: Ref<Author>
}

export const DishModel = new DishSchema().getModelForClass(DishSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'dishes',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
