/*
 * household.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserSchema } from '@Models/user.model'
import { Ref } from '@Types/common'
import { Household, LatLng, PantryItem } from '@Types/household'
import { User } from '@Types/user'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'


export interface HouseholdSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class HouseholdSchema extends Typegoose implements Household {
  @prop({ required: true, ref: UserSchema })
  members: Ref<UserSchema>[] | User[]
  @prop()
  location?: LatLng
  @prop()
  pantry?: PantryItem[]
}

export const HouseholdModel = new HouseholdSchema().getModelForClass(HouseholdSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'households',
  }
})
