/*
 * recipe.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserSchema } from '@Models/user.model'
import { Image, Video } from '@Types/common'
import { Ingredient, Instruction, Recipe, RecipeOrigin, RecipeTag, RecipeTiming, Review } from '@Types/recipe'
import { User } from '@Types/user'
import mongooseDelete from 'mongoose-delete'
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { arrayProp, plugin, prop, Ref, Typegoose } from 'typegoose'
import uuid from 'uuid'


export interface RecipeSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
})
export class RecipeSchema extends Typegoose implements Recipe {
  _id: string
  id: string
  likedByUser: boolean
  likesCount: number

  @prop({ required: true })
  title: string
  @prop({ default: uuid, unique: true, required: true })
  publicId?: string
  @prop({ required: true })
  ingredients: Ingredient[]
  @prop({ required: true })
  yield: number
  @prop()
  calories?: number
  @prop()
  fat?: number
  @prop()
  carbohydrate?: number
  @prop()
  protein?: number
  @prop()
  slug: string
  @prop()
  coverImage?: Image
  @prop()
  thumbnail?: Image
  @prop()
  ingredientsRaw?: string
  @prop()
  instructionsRaw?: string
  @prop()
  instructions?: Instruction[]
  @prop()
  reviews?: Review[]
  @arrayProp({ itemsRef: UserSchema, default: [] })
  likes: Ref<UserSchema>[]
  @prop({ ref: UserSchema })
  author: Ref<UserSchema> | Partial<User>
  @prop()
  description?: string
  @prop()
  timing: RecipeTiming
  @prop()
  origin?: RecipeOrigin
  @prop()
  tags?: RecipeTag[]
  @prop()
  images?: Image[]
  @prop()
  video?: Video
  @prop()
  dataVersion?: number
  @prop()
  additionalData?: any
  createdAt: Date
}

export const RecipeModel = new RecipeSchema().getModelForClass(RecipeSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'recipes',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
