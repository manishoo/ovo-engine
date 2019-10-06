/*
 * food-map.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { FoodSchema } from '@Models/food.model'
import { LanguageCode, Ref } from '@Types/common'
import { Food } from '@Types/food'
import { FoodMap, FoodMapUnit } from '@Types/food-map'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'


export interface FoodMapSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class FoodMapSchema extends Typegoose implements FoodMap {
  readonly _id: mongoose.Types.ObjectId

  readonly id: string

  @prop({ required: true })
  text: string

  @prop()
  verified: boolean

  @prop({ ref: FoodSchema })
  food?: Ref<Food>

  @prop({ enum: LanguageCode })
  locale: LanguageCode

  @prop()
  usageCount: number

  @prop()
  units: FoodMapUnit[]
}

export const FoodMapModel = new FoodMapSchema().getModelForClass(FoodMapSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'foodMaps',
  }
})
