/*
 * food-group.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Translation } from '@Types/common'
import { FoodGroup, ParentFoodGroup } from '@Types/food-group'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Ref, Typegoose } from 'typegoose'


export interface FoodGroupSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class FoodGroupSchema extends Typegoose implements FoodGroup {
  readonly _id: mongoose.Schema.Types.ObjectId
  readonly id: string
  @prop({ required: true })
  name: Translation[]
  @prop({ ref: FoodGroupSchema })
  parentFoodGroup?: Ref<ParentFoodGroup>
}

export const FoodGroupModel = new FoodGroupSchema().getModelForClass(FoodGroupSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'foodGroups',
  }
})
