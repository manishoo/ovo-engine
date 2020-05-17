/*
 * meal.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { ObjectId, Pagination, Ref, Timing, Translation, TranslationInput } from '@Types/common'
import { Nutrition } from '@Types/food'
import { Ingredient, IngredientInput } from '@Types/ingredient'
import { Author } from '@Types/user'
import { ArrayNotEmpty, Max, Min } from 'class-validator'
import { ArgsType, Field, FieldResolver, InputType, Int, ObjectType, Resolver, Root } from 'type-graphql'


@ObjectType()
export class MealListResponse {
  @Field(type => [Meal])
  meals: Meal[]
  @Field(type => Pagination)
  pagination: Pagination
}

@ObjectType()
export class MealItem extends Ingredient {
  @Field({ nullable: true })
  hasAlternatives?: boolean

  @Field(type => [Ingredient])
  alternativeMealItems: Ingredient[]
}

@Resolver(of => MealItem)
export class MealItemResolver {
  @FieldResolver(returns => Boolean)
  hasAlternatives(@Root() mealItem: MealItem) {
    return mealItem.alternativeMealItems.length > 0
  }
}

@InputType()
export class MealItemInput extends IngredientInput {
  @Field(type => [IngredientInput])
  alternativeMealItems: IngredientInput[]
}

@ObjectType()
export class Meal {
  _id?: ObjectId

  @Field()
  id: string

  @Field(type => [Translation], { nullable: true })
  name?: Translation[]

  @Field(type => [Translation], { nullable: true })
  description?: Translation[]

  @Field(type => [MealItem])
  @ArrayNotEmpty()
  items: MealItem[]

  @Field(type => Nutrition)
  nutrition: Nutrition

  @Field(type => Author)
  author: Ref<Author>

  @Field({ nullable: true })
  likedByUser?: boolean

  @Field(type => Int)
  likesCount: number

  likes: Ref<UserSchema>[]

  @Field(type => Timing)
  timing: Timing

  @Field(type => Date)
  createdAt: Date

  @Field(type => Date)
  updatedAt?: Date

  @Field({ nullable: true })
  instanceOf?: ObjectId

  @Field({ nullable: true })
  hasPermutations?: boolean
}

@InputType()
export class MealInput {
  @Field(type => [TranslationInput], { nullable: true })
  name?: TranslationInput[]

  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]

  @Field(type => [MealItemInput])
  @ArrayNotEmpty()
  items: MealItemInput[]
}

@ArgsType()
export class ListMealsArgs {
  @Field({ nullable: true })
  lastId?: string

  @Field({ nullable: true })
  @Min(1)
  page?: number

  @Field({ nullable: true })
  @Min(1)
  @Max(30)
  size?: number

  @Field(type => ObjectId, { nullable: true })
  authorId?: ObjectId

  @Field(type => ObjectId, { nullable: true })
  ingredientId?: ObjectId
}
