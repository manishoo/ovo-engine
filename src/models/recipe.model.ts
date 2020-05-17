/*
 * recipe.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserSchema } from '@Models/user.model'
import { Image, LanguageCode, ObjectId, Ref, Timing, Translation } from '@Types/common'
import { Nutrition } from '@Types/food'
import { Ingredient } from '@Types/ingredient'
import { Instruction, Recipe, RecipeDifficulty, RecipeOrigin, RecipeStatus, Review } from '@Types/recipe'
import { Tag } from '@Types/tag'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { arrayProp, plugin, prop, Typegoose } from 'typegoose'


export interface RecipeSchema extends SoftDeleteModel<SoftDeleteDocument & Recipe> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
export class RecipeSchema extends Typegoose implements Recipe {
  _id: ObjectId
  id: string

  @prop({ required: true })
  title: Translation[]
  @prop({ required: true })
  ingredients: Ingredient[]
  @prop({ required: true })
  serving: number
  @prop()
  servingName: Translation[]
  @prop({ required: true, unique: true })
  slug: string
  @prop()
  image?: Image
  @prop()
  thumbnail?: Image
  @prop()
  instructions?: Instruction[]
  @arrayProp({ itemsRef: UserSchema, default: [] })
  likes: Ref<UserSchema>[]
  @prop({ ref: UserSchema })
  author: Ref<UserSchema>
  @prop()
  description?: Translation[]
  @prop()
  timing: Timing
  @prop({ default: {} })
  nutrition: Nutrition
  @prop()
  difficulty?: RecipeDifficulty
  @prop()
  origin?: RecipeOrigin
  @prop()
  tags: Ref<Tag>[]
  @prop()
  updatedAt?: Date
  @prop()
  languages: LanguageCode[]
  @prop()
  reviews?: Review[]
  @prop()
  createdAt: Date

  userLikedRecipe: boolean

  @prop({ default: RecipeStatus.unverified, required: true })
  status: RecipeStatus

  @prop()
  get likesCount(): number {
    return this.likes.length
  }
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
