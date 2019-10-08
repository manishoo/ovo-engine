/*
 * food-map.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode, ObjectId, Pagination, Ref } from '@Types/common'
import { Food } from '@Types/food'
import { Weight } from '@Types/weight'
import { Max, Min } from 'class-validator'
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql'


@ObjectType()
export class FoodMapUnit {
  @Field()
  text: string
  @Field({ nullable: true })
  foodId?: string
  @Field(type => Weight, { nullable: true })
  weight?: Weight
}

@InputType()
export class FoodMapUnitInput {
  @Field()
  text: string
  @Field({ nullable: true })
  foodId?: string
  @Field({ nullable: true })
  weightId?: string
}

@ObjectType()
export class FoodMap {
  readonly _id: ObjectId

  @Field()
  readonly id: string

  @Field()
  text: string

  @Field()
  verified: boolean

  @Field(type => Food, { nullable: true })
  food?: Ref<Food>

  @Field(type => LanguageCode)
  locale: LanguageCode

  @Field(type => Int)
  usageCount: number

  @Field(type => [FoodMapUnit])
  units: FoodMapUnit[]
}

@InputType()
export class FoodMapInput {
  @Field()
  verified: boolean
  @Field()
  food: ObjectId
  @Field(type => [FoodMapUnitInput])
  units: FoodMapUnitInput[]
}

@ObjectType()
export class FoodMapList {
  @Field(type => [FoodMap])
  foodMaps: FoodMap[]
  @Field(type => Pagination)
  pagination: Pagination
}

@ArgsType()
export class FoodMapListArgs {
  @Field(type => Int, { defaultValue: 1 })
  @Min(1)
  page: number

  @Field(type => Int, { defaultValue: 10 })
  @Min(1)
  @Max(30)
  size: number

  @Field({ nullable: true })
  nameSearchQuery?: string

  @Field({ nullable: true })
  verified?: boolean
}
