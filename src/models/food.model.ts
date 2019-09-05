/*
 * food.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { FoodClassSchema } from '@Models/food-class.model'
import { Image, Translation } from '@Types/common'
import { Food, FoodContent, Nutrition } from '@Types/food'
import { Weight } from '@Types/weight'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'


export interface FoodSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class FoodSchema extends Typegoose implements Food {
  readonly _id: mongoose.Schema.Types.ObjectId
  readonly id: string

  @prop({ required: true })
  name: Translation[]
  @prop()
  origFoodId?: string
  @prop()
  origDb?: string
  @prop({ required: true })
  foodClass: Ref<FoodClassSchema>
  @prop({ default: [], required: true })
  contents: FoodContent[]
  @prop({ default: {} })
  nutrition: Nutrition
  @prop({ default: [], required: true })
  weights: Weight[]
  @prop()
  imageUrl?: Image
  @prop()
  thumbnailUrl?: Image
}

export const FoodModel = new FoodSchema().getModelForClass(FoodSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'foods',
  }
})
