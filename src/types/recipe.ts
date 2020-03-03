/*
 * recipe.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import {
  Image,
  LanguageCode,
  ObjectId,
  Pagination,
  Ref,
  Role,
  Timing,
  TimingInput,
  Translation,
  TranslationInput,
} from '@Types/common'
import { Nutrition } from '@Types/food'
import { Ingredient, IngredientInput } from '@Types/ingredient'
import { Tag, TagType } from '@Types/tag'
import { Author } from '@Types/user'
import { ContextUser } from '@Utils/context'
import { GraphQLUpload } from 'apollo-server'
import { ArrayNotEmpty, Max, Min } from 'class-validator'
import { ArgsType, Authorized, Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'


export enum RecipeStatus {
  private = 'private',
  public = 'public',
  review = 'review',
}

registerEnumType(RecipeStatus, {
  name: 'RecipeStatus',
  description: 'Recipe Status'
})

export enum RecipeDifficulty {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
  expert = 'expert',
}

registerEnumType(RecipeDifficulty, {
  name: 'RecipeDifficulty',
  description: 'Recipe difficulty'
})

@ObjectType()
export class RecipeTag {
  _id?: ObjectId

  @Field()
  slug: string

  @Field(type => [Translation], { nullable: true })
  title?: Translation[]

  @Field()
  type: TagType
}

@InputType()
export class RecipeTagInput {
  _id?: ObjectId

  @Field()
  slug: string

  @Field(type => [TranslationInput], { nullable: true })
  title?: TranslationInput[]

  @Field()
  type: TagType
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
  readonly _id: ObjectId
  @Field()
  id: string

  @Field(type => [Translation])
  title: Translation[]

  @Field(type => [Ingredient])
  ingredients: Ingredient[]

  @Field(type => Int)
  serving: number

  @Field()
  slug: string

  @Field(type => Image, { nullable: true })
  image?: Image

  @Field(type => Image, { nullable: true })
  thumbnail?: Image

  @Field(type => [Instruction])
  instructions?: Instruction[]

  @Field(type => [Review], { nullable: true })
  reviews?: Review[]

  @Field(type => Int)
  likesCount: number

  @Field(type => RecipeDifficulty, { nullable: true })
  difficulty?: RecipeDifficulty

  @Field(type => Author)
  author: Ref<Author>

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]

  @Field(type => Timing)
  timing: Timing

  @Field(type => Nutrition)
  nutrition: Nutrition

  @Field(type => RecipeOrigin, { nullable: true })
  origin?: RecipeOrigin

  @Field(type => [String])
  tags: Ref<Tag>[]

  @Field(type => LanguageCode, { nullable: true })
  languages: LanguageCode[]

  @Field(type => Date)
  createdAt: Date

  @Field(type => Date)
  updatedAt?: Date

  @Field({ nullable: true })
  userLikedRecipe?: boolean

  likes: Ref<UserSchema>[]

  @Field(type => RecipeStatus)
  status: RecipeStatus
}

@ObjectType()
export class RecipesListResponse {
  @Field(type => [Recipe])
  recipes: Recipe[]

  @Field(type => Pagination)
  pagination: Pagination
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

  @Field(type => TimingInput)
  timing: TimingInput

  @Field(type => RecipeDifficulty, { nullable: true })
  difficulty?: RecipeDifficulty

  @Field({ nullable: true })
  slug?: string

  @Field(type => [TranslationInput], { nullable: true })
  description: [TranslationInput]

  @Field(type => GraphQLUpload, { nullable: true })
  image?: any

  @Field(type => GraphQLUpload, { nullable: true })
  thumbnail?: any

  @Field(type => [String], { nullable: true })
  tags?: string[]

  @Field(type => RecipeStatus, { nullable: true })
  status?: RecipeStatus
}

@ArgsType()
export class ListRecipesArgs {
  @Field(type => Int, { nullable: true })
  @Min(1)
  page?: number

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(30)
  size?: number

  @Field(type => ObjectId, { nullable: true })
  lastId?: ObjectId

  @Field({ nullable: true })
  nameSearchQuery?: string

  @Field(type => ObjectId, { nullable: true })
  userId?: ObjectId

  @Field(type => [String], { nullable: true })
  tags?: string[]

  @Field({ nullable: true })
  sortByMostPopular?: boolean

  @Field(type => [ObjectId], { nullable: true })
  ingredients?: ObjectId[]

  @Field(type => [ObjectId], { nullable: true })
  diets?: ObjectId[]

  @Field(type => RecipeStatus, { nullable: true })
  @Authorized(Role.operator)
  status?: RecipeStatus

  @Field({ nullable: true })
  @Authorized()
  showMyRecipes?: boolean

  viewerUser?: ContextUser
}
