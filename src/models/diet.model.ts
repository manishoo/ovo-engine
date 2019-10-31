/*
 * diet.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'
import { Diet } from '@Types/diet'
import mongoose from '@Config/connections/mongoose'
import { Translation, ObjectId } from '@Types/common'


export interface DietSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class DietSchema extends Typegoose implements Diet {
  _id: ObjectId
  id: string

  @prop()
  name: Translation[]

  @prop({ unique: true })
  slug: string

  @prop()
  foodClassIncludes: ObjectId[]

  @prop()
  foodGroupIncludes: ObjectId[]

  createdAt?: Date
  updatedAt?: Date
}

export const DietModel = new DietSchema().getModelForClass(DietSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    timestamps: true,
    collection: 'diets',
  }
})
