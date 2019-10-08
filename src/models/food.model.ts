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
import { index, plugin, prop, Typegoose } from 'typegoose'


export interface FoodSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
@index({ 'name.text': 'text' })
@index({ 'description.text': 'text' })
@index({ 'name.text': 1 })
@index({ 'description.text': 1 })
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
  @prop({ required: true })
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
}

export const FoodModel = new FoodSchema().getModelForClass(FoodSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'foods',
  }
})
