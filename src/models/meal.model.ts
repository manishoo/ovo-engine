/*
 * meal.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Ref, Timing, Translation } from '@Types/common'
import { Nutrition } from '@Types/food'
import { Meal, MealItem } from '@Types/meal'
import { Author } from '@Types/user'
import { ObjectId } from 'mongodb'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { arrayProp, instanceMethod, plugin, prop, Typegoose } from 'typegoose'
import { UserSchema } from './user.model'


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
  name?: Translation[]

  @prop()
  description?: Translation[]

  @prop()
  items: MealItem[]

  @prop()
  nutrition?: Nutrition

  @prop({ ref: UserSchema })
  author: Ref<Author>

  @prop({ default: {} })
  timing: Timing

  likedByUser?: boolean

  @arrayProp({ itemsRef: UserSchema, default: [] })
  likes: Ref<UserSchema>[]

  @prop()
  createdAt: Date
  @prop()
  updatedAt?: Date

  @prop()
  instanceOf?: ObjectId

  @prop()
  get likesCount(): number {
    return this.likes.length
  }

  @instanceMethod
  isLiked(userId: string): boolean {
    return !!this.likes.find(p => String(p) === userId)
  }
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
