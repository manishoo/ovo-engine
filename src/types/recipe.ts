/*
 * recipe.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { Image, Pagination, Video } from '@Types/common'
import { Food } from '@Types/food'
import { TAG_TYPE } from '@Types/tag'
import { User } from '@Types/user'
import { Weight } from '@Types/weight'
import { GraphQLUpload } from 'apollo-server'
import { Types } from 'mongoose'
import { Field, InputType, Int, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'


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

@ObjectType()
export class RecipeTiming {
  @Field(type => Int, { nullable: true })
  prepTime?: number

  @Field(type => Int, { nullable: true })
  cookTime?: number

  @Field(type => Int)
  totalTime: number
}

@ObjectType()
export class IngredientFood {
  @Field({ nullable: true })
  foodId?: string

  @Field({ nullable: true })
  name?: string

  @Field(type => Image, { nullable: true })
  image?: Image

  @Field({ nullable: true })
  srcDb?: string

  @Field(type => [Food], { nullable: true })
  substituteFoods?: Food[]
}

@ObjectType()
export class Ingredient {
  @Field({ nullable: true })
  name?: string

  @Field()
  amount: number

  @Field({ nullable: true })
  unit?: string

  @Field(type => Image, { nullable: true })
  thumbnail?: Image

  weightId?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  foodId?: string

  // @Field(type => IngredientFood, {nullable: true})
  @Field({ nullable: true })
  weight?: Weight
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
  @Field(type => [Action], { nullable: true })
  actions?: Action[]

  @Field()
  step: number

  @Field()
  text: string

  @Field(type => [String], { nullable: true })
  notes?: string[]
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

  // @Field({nullable: true})
  authorAdditionalInfo?: any

  @Field({ nullable: true })
  url?: string
}

@ObjectType()
export class Recipe {
  @Field()
  title: string
  publicId?: string
  @Field(type => [Ingredient])
  ingredients: Ingredient[]
  @Field(type => Int)
  yield: number
  @Field({ nullable: true })
  calories?: number
  @Field({ nullable: true })
  fat?: number
  @Field({ nullable: true })
  carbohydrate?: number
  @Field({ nullable: true })
  protein?: number
  @Field({ nullable: true })
  url?: string
  @Field()
  slug: string
  @Field(type => Image, { nullable: true })
  coverImage?: Image
  @Field(type => Image, { nullable: true })
  thumbnail?: Image
  ingredientsRaw?: string
  instructionsRaw?: string
  @Field(type => [Instruction])
  instructions?: Instruction[]
  @Field(type => [Review], { nullable: true })
  reviews?: Review[]
  @Field(type => Boolean)
  likedByUser: boolean
  @Field(type => Int)
  likesCount: number
  likes: Ref<UserSchema>[]
  @Field(type => User)
  author: Ref<UserSchema> | Partial<User>
  @Field({ nullable: true })
  description?: string
  @Field(type => RecipeTiming)
  timing: RecipeTiming
  @Field(type => RecipeOrigin, { nullable: true })
  origin?: RecipeOrigin
  @Field(type => [RecipeTag], { nullable: true })
  tags?: RecipeTag[]
  @Field(type => [Image], { nullable: true })
  images?: Image[]
  @Field(type => Video, { nullable: true })
  video?: Video
  @Field(type => Int, { nullable: true })
  dataVersion?: number
  additionalData?: any
  _id: string
  @Field()
  id: string
  @Field(type => Date)
  createdAt: Date
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
  @Field({ nullable: true })
  foodId?: string
  @Field()
  amount: number
  @Field({ nullable: true })
  customUnit?: string
  @Field({ nullable: true })
  name?: string
  @Field({ nullable: true })
  weightId?: string
  @Field({ nullable: true })
  description?: string
}

@InputType()
export class InstructionInput {
  @Field()
  step: number
  @Field()
  text: string
}

@InputType()
export class RecipeInput {
  @Field()
  title: string
  @Field(type => [IngredientInput])
  ingredients: IngredientInput[]
  @Field(type => [InstructionInput])
  instructions: InstructionInput[]
  @Field()
  yield: number
  @Field()
  totalTime: number
  @Field({ nullable: true })
  cookTime: number
  @Field({ nullable: true })
  prepTime: number
  @Field()
  slug: string
  @Field({ nullable: true })
  description: string
  @Field(type => GraphQLUpload, { nullable: true })
  coverImage: any
  @Field(type => [String], { nullable: true })
  tags?: string[]
}

export interface RecipesQuery {
  _id?: any
  createdAt?: any
  author?: any
  title?: any
}
