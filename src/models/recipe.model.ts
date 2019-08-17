/*
 * recipe.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { UserSchema } from '@Models/user.model'
import { Image, Translation, LanguageCode } from '@Types/common'
import { Ingredient, Instruction, Recipe, RecipeOrigin, RecipeTag, RecipeTiming, Review } from '@Types/recipe'
import { arrayProp, prop, Ref, Typegoose } from 'typegoose'
import { NutritionalData } from '@Types/food';


export class RecipeSchema extends Typegoose implements Recipe {
  _id: mongoose.Types.ObjectId
  id: string
  likedByUser: boolean
  likesCount: number

  @prop({ required: true })
  title: Translation[]
  @prop({ required: true })
  ingredients: Ingredient[]
  @prop({ required: true })
  serving: number
  @prop()
  nutritionalData?: NutritionalData
  @prop()
  slug: string
  @prop()
  coverImage?: Image
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
  timing: RecipeTiming
  @prop()
  origin?: RecipeOrigin
  @prop()
  tags?: RecipeTag[]
  @prop()
  updatedAt: Date
  @prop()
  languages: LanguageCode[]
  @prop()
  reviews?: Review[]
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
