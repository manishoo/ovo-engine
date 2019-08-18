/*
 * recipe.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { Image, Pagination, LanguageCode, Translation, TranslationInput, Ref } from '@Types/common'
import { NutritionalData } from '@Types/food'
import { TAG_TYPE } from '@Types/tag'
import { RecipeAuthor } from '@Types/user'
import { Weight, WeightInput } from '@Types/weight'
import { GraphQLUpload } from 'apollo-server'
import { Max, Min } from 'class-validator'
import { Types } from 'mongoose'
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql'
import mongoose from '@Config/connections/mongoose'
import { FoodSchema } from '@Models/food.model'


@ObjectType()
export class RecipeTag {
  _id?: Types.ObjectId
  
  @Field()
  slug: string
  
  @Field({ nullable: true })
  title?: string
  
  @Field()
  type: TAG_TYPE
}

@InputType()
export class RecipeTagInput {
  _id?: Types.ObjectId
  
  @Field()
  slug: string
  
  @Field({ nullable: true })
  title?: string
  
  @Field()
  type: TAG_TYPE
}

@ObjectType()
export class RecipeTiming {
  @Field(type => Int, { nullable: true })
  prepTime?: number

  @Field(type => Int, { nullable: true })
  cookTime?: number

  @Field(type => Int)
  totalTime: number
}

@InputType()
export class RecipeTimingInput {
  @Field(type => Int, { nullable: true })
  prepTime?: number

  @Field(type => Int, { nullable: true })
  cookTime?: number

  @Field(type => Int)
  totalTime: number
}

@ObjectType()
export class Ingredient {
  @Field(type => [Translation], { nullable: true })
  name?: Translation[]

  @Field()
  amount: number

  @Field({ nullable: true })
  customUnit?: string

  @Field({ nullable: true })
  gramWeight?: number

  @Field(type => Image, { nullable: true })
  thumbnail?: Image

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]

  @Field(type => String, { nullable: true })
  food?: Ref<FoodSchema>

  @Field(type => String, { nullable: true })
  weight?: Ref<Weight>
}

@ObjectType()
export class Action {
  @Field({ nullable: true })
  verb?: string

  @Field(type => [Ingredient], { nullable: true })
  ingredients?: Ingredient[]
}

@ObjectType()
export class Instruction {
  @Field(type => Int)
  step: number

  @Field(type => [Translation])
  text: Translation[]

  @Field(type => Image, { nullable: true })
  image?: Image

  @Field(type => [Translation], { nullable: true })
  notes?: Translation[]
}

@ObjectType()
export class Comment {
  @Field(type => String)
  text: string
  
  @Field(type => Int)
  timestamp: number
  
  @Field(type => Image)
  image?: Image
  
  @Field(type => [String])
  likes?: string[]
  
  @Field(type => String)
  userId: Ref<UserSchema>
}

@ObjectType()
export class Review {
  @Field(type => String)
  text: string
  
  @Field(type => Int)
  timestamp: number
  
  @Field(type => Image)
  image?: Image
  
  @Field(type => [String])
  likes?: string[]
  
  @Field(type => String)
  userId: Ref<UserSchema>
  
  @Field(type => Int)
  rating: number
  
  @Field(type => Comment)
  comments?: Comment[]
}

@ObjectType()
export class RecipeOrigin {
  @Field()
  source: string
  
  @Field({ nullable: true })
  sourceUrl?: string
  
  @Field({ nullable: true })
  authorName?: string
  
  @Field({ nullable: true })
  url?: string

  authorAdditionalInfo?: any
}

@ObjectType()
export class Recipe {
  @Field()
  readonly id: string
  
  @Field(type => [Translation])
  title: Translation[]
  
  @Field(type => [Ingredient])
  ingredients: Ingredient[]
  
  @Field(type => Int)
  serving: number
  
  @Field(type => NutritionalData, { nullable: true })
  nutritionalData?: NutritionalData
  
  @Field()
  slug: string
  
  @Field(type => Image, { nullable: true })
  coverImage?: Image
  
  @Field(type => Image, { nullable: true })
  thumbnail?: Image
  
  @Field(type => [Instruction])
  instructions?: Instruction[]
  
  @Field(type => [Review], { nullable: true })
  reviews?: Review[]
  
  @Field(type => Boolean)
  likedByUser: boolean
  
  @Field(type => Int)
  likesCount: number
  
  @Field(type => RecipeAuthor)
  author: Ref<RecipeAuthor>
  
  @Field(type => [Translation], { nullable: true })
  description?: Translation[]
  
  @Field(type => RecipeTiming)
  timing: RecipeTiming
  
  @Field(type => RecipeOrigin, { nullable: true })
  origin?: RecipeOrigin
  
  @Field(type => [RecipeTag], { nullable: true })
  tags?: RecipeTag[]
  
  @Field(type => LanguageCode, { nullable: true })
  languages: LanguageCode[]
  
  @Field(type => Date)
  createdAt: Date
  
  @Field(type => Date)
  updatedAt?: Date

  readonly _id: mongoose.Types.ObjectId
  likes: Ref<UserSchema>[]
}

@ObjectType()
export class RecipesListResponse {
  @Field(type => [Recipe])
  recipes: Recipe[]
  
  @Field(type => Pagination)
  pagination: Pagination
}

@InputType()
export class IngredientInput {
  @Field(type => String, { nullable: true })
  food?: string
  
  @Field()
  amount: number
  
  @Field({ nullable: true })
  customUnit?: string
  
  @Field({ nullable: true })
  gramWeight?: number
  
  @Field(type => [TranslationInput], { nullable: true })
  name?: TranslationInput[]
  
  @Field({ nullable: true })
  weight?: string
  
  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]
}

@InputType()
export class InstructionInput {
  @Field()
  @Min(1)
  step: number
  
  @Field(type => [TranslationInput])
  text: TranslationInput[]
  
  @Field(type => [TranslationInput], { nullable: true })
  note?: TranslationInput[]
  
  @Field(type => GraphQLUpload, { nullable: true })
  Image?: any
}

@InputType()
export class RecipeInput {
  @Field(type => [TranslationInput])
  title: TranslationInput[]
  
  @Field(type => [IngredientInput])
  ingredients: IngredientInput[]
  
  @Field(type => [InstructionInput])
  instructions: InstructionInput[]
  
  @Field()
  serving: number
  
  @Field(type => RecipeTimingInput)
  timing: RecipeTimingInput
  
  @Field()
  slug?: string
  
  @Field(type => [TranslationInput], { nullable: true })
  description: [TranslationInput]
  
  @Field(type => GraphQLUpload, { nullable: true })
  coverImage?: any
  
  @Field(type => GraphQLUpload, { nullable: true })
  thumbnail?: any
  
  @Field(type => [RecipeTagInput], { nullable: true })
  tags?: RecipeTagInput[]
}

@ArgsType()
export class ListRecipesArgs {
  @Field()
  @Min(1)
  page: number

  @Field()
  @Min(1)
  @Max(30)
  size: number

  @Field({ nullable: true })
  lastId?: string

  @Field({ nullable: true })
  nameSearchQuery?: string

  @Field({ nullable: true })
  userId?: string

  viewerUserId?: string
}
