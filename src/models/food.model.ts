/*
 * food.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { FoodClassSchema } from '@Models/food-class.model'
import { FoodGroupSchema } from '@Models/food-group.model'
import { Image, ObjectId, Ref, Translation } from '@Types/common'
import { Food, FoodContent, Nutrition } from '@Types/food'
import { Weight } from '@Types/weight'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { index, plugin, post, pre, prop, Typegoose } from 'typegoose'


export interface FoodSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@pre<Food>('find', function (next) { // or @pre(this: Car, 'save', ...
  this.populate('foodClass')
  next()
})
@post<Food>('save', function (food, next) {
  food.populate('foodClass').execPopulate().then(() => {
    if (next) next()
  })
})
@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
@index({ 'name.text': 'text' })
@index({ 'name.text': 1 })
export class FoodSchema extends Typegoose implements Food {
  readonly _id: ObjectId
  id: string

  @prop({ required: true })
  name: Translation[]
  @prop()
  description?: Translation[]
  @prop()
  origFoodId?: string
  @prop()
  origDb?: string
  @prop({ ref: FoodClassSchema, required: true })
  foodClass: Ref<FoodClassSchema>
  @prop({ required: true })
  origFoodClassName: Translation[]
  @prop()
  foodGroup: FoodGroupSchema
  @prop({ default: [], required: true })
  contents: FoodContent[]
  @prop({ default: {} })
  nutrition: Nutrition
  @prop({ default: [], required: true })
  weights: Weight[]
  @prop()
  image?: Image
  @prop()
  thumbnail?: Image
  @prop()
  isDefault?: boolean

  deleted: boolean
}

export const FoodModel = new FoodSchema().getModelForClass(FoodSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'foods',
  }
})
