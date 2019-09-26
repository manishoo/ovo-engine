import { ObjectType, Field, InputType } from "type-graphql"
import { Translation, TranslationInput, Ref } from "@Types/common"
import { FoodClass } from "@Types/food-class"
import { Types } from "mongoose"


@ObjectType()
export class Diet {
  readonly _id: Types.ObjectId
  @Field()
  readonly id: string
  @Field(type => [Translation])
  name: Translation[]

  @Field()
  slug: string

  @Field(type => [FoodClass])
  excludes: Ref<FoodClass>[]

  @Field(type => [Translation])
  description: Translation[]
}

@InputType()
export class DietInput {
  @Field(type => [TranslationInput])
  name: TranslationInput[]

  @Field()
  slug: string

  @Field(type => [String])
  excludes: string[]

  @Field(type => [TranslationInput])
  description: TranslationInput[]
}