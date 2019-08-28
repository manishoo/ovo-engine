/*
 * recipe.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { FoodSchema } from '@Models/food.model'
import { UserSchema } from '@Models/user.model'
import { Image, LanguageCode, Pagination, Ref, Translation, TranslationInput } from '@Types/common'
import { Nutrition } from '@Types/food'
import { Author } from '@Types/user'
import { TagType, Tag } from '@Types/tag'
import { Weight } from '@Types/weight'
import { GraphQLUpload } from 'apollo-server'
import { Max, Min, ArrayNotEmpty } from 'class-validator'
import { Types } from 'mongoose'
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql'


@ObjectType()
export class RecipeTag {
  _id?: Types.ObjectId

  @Field()
  slug: string

  @Field(type => [Translation], { nullable: true })
  title?: Translation[]

  @Field()
  type: TagType
}

@InputType()
export class RecipeTagInput {
  _id?: Types.ObjectId

  @Field()
  slug: string

  @Field(type => [TranslationInput], { nullable: true })
  title?: TranslationInput[]

  @Field()
  type: TagType
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
  readonly _id: mongoose.Types.ObjectId
  @Field()
  readonly id: string

  @Field(type => [Translation])
  title: Translation[]

  @Field(type => [Ingredient])
  ingredients: Ingredient[]

  @Field(type => Int)
  serving: number

  @Field(type => Nutrition, { nullable: true })
  nutrition?: Nutrition

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


  @Field(type => Int)
  likesCount: number

  @Field(type => Author)
  author: Ref<Author>

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]

  @Field(type => RecipeTiming)
  timing: RecipeTiming

  @Field(type => RecipeOrigin, { nullable: true })
  origin?: RecipeOrigin

  @Field(type => String, { nullable: true })
  tags?: Ref<Tag>[]

  @Field(type => LanguageCode, { nullable: true })
  languages: LanguageCode[]

  @Field(type => Date)
  createdAt: Date

  @Field(type => Date)
  updatedAt?: Date
  @Field({ nullable: true })
  userLikedRecipe?: boolean
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
  @ArrayNotEmpty()
  name?: TranslationInput[]

  @Field({ nullable: true })
  weight?: string

  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]

  @Field(type => GraphQLUpload, { nullable: true })
  thumbnail?: any
}

@InputType()
export class InstructionInput {
  @Field()
  @Min(1)
  step: number

  @Field(type => [TranslationInput])
  @ArrayNotEmpty()
  text: TranslationInput[]

  @Field(type => [TranslationInput], { nullable: true })
  note?: TranslationInput[]

  @Field(type => GraphQLUpload, { nullable: true })
  image?: any
}

@InputType()
export class RecipeInput {
  @Field(type => [TranslationInput])
  @ArrayNotEmpty()
  title: TranslationInput[]

  @Field(type => [IngredientInput])
  @ArrayNotEmpty()
  ingredients: IngredientInput[]

  @Field(type => [InstructionInput])
  instructions: InstructionInput[]

  @Field(type => Int)
  serving: number

  @Field(type => RecipeTimingInput)
  timing: RecipeTimingInput

  @Field({ nullable: true })
  slug?: string

  @Field(type => [TranslationInput], { nullable: true })
  description: [TranslationInput]

  @Field(type => GraphQLUpload, { nullable: true })
  coverImage?: any

  @Field(type => GraphQLUpload, { nullable: true })
  thumbnail?: any

  @Field(type => [String], { nullable: true })
  tags?: string[]
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

  @Field(type => [String], { nullable: true })
  tags?: string[]

  viewerUserId?: string
}
