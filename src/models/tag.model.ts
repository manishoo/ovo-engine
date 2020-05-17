/*
 * tag.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { Ref, Translation } from '@Types/common'
import { Tag, TagType } from '@Types/tag'
import { User } from '@Types/user'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { plugin, prop, Typegoose } from 'typegoose'


export interface TagSchema extends SoftDeleteModel<SoftDeleteDocument & Tag> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class TagSchema extends Typegoose implements Tag {
  @prop({ required: true, unique: true })
  slug: string // only English: quick-bite
  @prop({ required: true })
  title: Translation[] // translation: سریع‌الحلقوم | Quick bite
  @prop()
  info?: Translation[] // info about the tag
  @prop({ required: true })
  type: TagType // recipe, cuisine, etc.
  @prop()
  user?: Ref<User>

  createdAt?: Date
  updatedAt?: Date
}

export const TagModel = new TagSchema().getModelForClass(TagSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    timestamps: true,
    collection: 'tags',
  }
})
