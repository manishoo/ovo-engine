/*
 * dish.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Dish, DishItemInput, DishItem } from '@Types/dish'
import { User } from '@Types/user'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'
import { UserSchema } from './user.model';


export interface DishSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class DishSchema extends Typegoose implements Dish {
  id: string
  @prop()
  name?: string
  @prop()
  description?: string
  @prop()
  items: DishItem[]
  @prop()
  author: Ref<UserSchema>
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
