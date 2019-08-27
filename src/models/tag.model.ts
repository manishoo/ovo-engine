/*
 * tag.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { LanguageCode, Translation } from '@Types/common'
import { Tag, TagType } from '@Types/tag'
import { prop, Typegoose } from 'typegoose'


export class TagSchema extends Typegoose implements Tag {
  @prop({ required: true })
  slug: string // only English: quick-bite
  @prop({ required: true })
  title: Translation[] // translation: سریع‌الحلقوم | Quick bite
  @prop()
  info?: Translation[] // info about the tag
  @prop({ required: true })
  type: TagType // recipe, cuisine, etc.

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
