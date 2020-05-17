/*
 * food.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { FoodClassSchema } from '@Models/food-class.model'
import { Image, ObjectId, Ref, Translation } from '@Types/common'
import { Food, FoodContent, Nutrition } from '@Types/food'
import { FoodGroup } from '@Types/food-group'
import { Weight } from '@Types/weight'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { index, plugin, post, pre, prop, Typegoose } from 'typegoose'


export interface FoodSchema extends SoftDeleteModel<SoftDeleteDocument & Food> {
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
@index({
  'name.text': 'text',
  'description.text': 'text',
}, {
  name: 'TextIndex',
  weights: {
    'name.text': 100,
    'description.text': 1,
  }
})
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
  @prop({ ref: FoodClassSchema, required: true })
  foodClass: Ref<FoodClassSchema>
  @prop()
  origFoodClassSlug: string
  @prop({ required: true })
  origFoodClassName: Translation[]
  @prop()
  origFoodGroups: Partial<FoodGroup>[][]
  @prop({ default: [], required: true, select: false })
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

  @prop({ select: false })
  deleted: boolean
  @prop({ select: false })
  deletedBy: any
  @prop({ select: false })
  deletedAt: any
}

export const FoodModel = new FoodSchema().getModelForClass(FoodSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'foods',
  }
})
