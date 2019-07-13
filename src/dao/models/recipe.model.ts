/*
 * recipe.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Image, Video, Food, Pagination, Weight} from '@dao/types'
import {prop, Typegoose, Ref, arrayProp} from 'typegoose'
import {ObjectType, Field, Int, InputType} from 'type-graphql'
import {Utensil} from './utensil.model'
import {User, UserSchema} from '@dao/models/user.model'
import mongoose from '@dao/connections/mongoose'
import uuid from 'uuid'
import {LANGUAGE_CODES, TAG_TYPE} from '~/constants/enums'
import {GraphQLUpload} from 'apollo-server-express'
import {Types} from "mongoose"

@ObjectType()
export class RecipeTag {
	_id?: Types.ObjectId
	@Field()
	slug: string
	@Field({nullable: true})
	title?: string
	@Field()
	type: TAG_TYPE
}

@ObjectType()
class RecipeTiming {
	@Field(type => Int, {nullable: true})
	prepTime?: number

	@Field(type => Int, {nullable: true})
	cookTime?: number

	@Field(type => Int)
	totalTime: number
}


@ObjectType()
class IngredientFood {
	@Field({nullable: true})
	foodId?: string

	@Field({nullable: true})
	name?: string

	@Field(type => Image, {nullable: true})
	image?: Image

	@Field({nullable: true})
	srcDb?: string

	@Field(type => [Food], {nullable: true})
	substituteFoods?: Food[]
}


@ObjectType()
export class Ingredient {
	@Field({nullable: true})
	name?: string

	@Field()
	amount: number

	@Field({nullable: true})
	unit?: string

	@Field(type => Image, {nullable: true})
	thumbnail?: Image

	weightId?: string

	@Field({nullable: true})
	description?: string

	@Field({nullable: true})
	foodId?: string

	// @Field(type => IngredientFood, {nullable: true})
	@Field({nullable: true})
	weight?: Weight
}


@ObjectType()
class Action {
	@Field({nullable: true})
	verb?: string

	@Field(type => Utensil, {nullable: true})
	utensil?: Utensil

	@Field(type => [Ingredient], {nullable: true})
	ingredients?: Ingredient[]
}


@ObjectType()
class Instruction {
	@Field(type => [Action], {nullable: true})
	actions?: Action[]

	@Field()
	step: number

	@Field()
	text: string

	@Field(type => [String], {nullable: true})
	notes?: string[]
}


@ObjectType()
class Comment {
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
class Review {
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
class RecipeOrigin {
	@Field()
	source: string

	@Field({nullable: true})
	sourceUrl?: string

	@Field({nullable: true})
	authorName?: string

	// @Field({nullable: true})
	authorAdditionalInfo?: any

	@Field({nullable: true})
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
	@Field({nullable: true})
	calories?: number
	@Field({nullable: true})
	fat?: number
	@Field({nullable: true})
	carbohydrate?: number
	@Field({nullable: true})
	protein?: number
	@Field({nullable: true})
	url?: string
	@Field()
	slug: string
	@Field(type => Image, {nullable: true})
	coverImage?: Image
	@Field(type => Image, {nullable: true})
	thumbnail?: Image
	ingredientsRaw?: string
	instructionsRaw?: string
	@Field(type => [Instruction])
	instructions?: Instruction[]
	@Field(type => [Review], {nullable: true})
	reviews?: Review[]
	@Field(type => Boolean)
	likedByUser: boolean
	@Field(type => Int)
	likesCount: number
	likes: Ref<UserSchema>[]
	@Field(type => User)
	author: Ref<UserSchema> | Partial<User>
	@Field({nullable: true})
	description?: string
	@Field(type => RecipeTiming)
	timing: RecipeTiming
	@Field(type => RecipeOrigin, {nullable: true})
	origin?: RecipeOrigin
	@Field(type => [RecipeTag], {nullable: true})
	tags?: RecipeTag[]
	@Field(type => [Image], {nullable: true})
	images?: Image[]
	@Field(type => Video, {nullable: true})
	video?: Video
	@Field(type => Int, {nullable: true})
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
	@Field({nullable: true})
	foodId?: string
	@Field()
	amount: number
	@Field({nullable: true})
	customUnit?: string
	@Field({nullable: true})
	name?: string
	@Field({nullable: true})
	weightId?: string
	@Field({nullable: true})
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
	@Field({nullable: true})
	cookTime: number
	@Field({nullable: true})
	prepTime: number
	@Field()
	slug: string
	@Field({nullable: true})
	description: string
	// @ts-ignore
	@Field(type => GraphQLUpload, {nullable: true})
	coverImage: any
	@Field(type => [String], {nullable: true})
	tags?: string[]
}


class RecipeSchema extends Typegoose implements Recipe {
	_id: string
	id: string
	likedByUser: boolean
	likesCount: number

	@prop({required: true})
	title: string
	@prop({default: uuid, unique: true, required: true})
	publicId?: string
	@prop({required: true})
	ingredients: Ingredient[]
	@prop({required: true})
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
	@arrayProp({itemsRef: UserSchema, default: []})
	likes: Ref<UserSchema>[]
	@prop({ref: UserSchema})
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
