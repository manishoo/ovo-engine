/*
 * dish.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserSchema } from '@Models/user.model'
import { Dish } from '@Types/dish'
import { MealItem } from '@Types/eating'
import { User } from '@Types/user'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'


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
  @prop({ ref: UserSchema })
  author?: Ref<UserSchema> | User
  @prop()
  items: MealItem[]
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
