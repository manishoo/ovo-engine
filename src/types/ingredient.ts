/*
 * ingredient.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { CustomUnit, CustomUnitInput, ObjectId, Translation, TranslationInput } from '@Types/common'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { Weight } from '@Types/weight'
import { createUnionType, Field, InputType, ObjectType } from 'type-graphql'
import { determineIfItsFood, determineIfItsWeightOrObject } from '@Utils/determine-object'


export const IngredientItemUnion = createUnionType({
  name: 'IngredientItem',
  description: 'Recipe or Food',
  types: () => [Recipe, Food],
  resolveType(value) {
    if (determineIfItsFood(value)) {
      return 'Food'
    } else {
      return 'Recipe'
    }
  }
})

export const IngredientUnitUnion = createUnionType({
  name: 'IngredientUnit',
  description: 'Weight or CustomUnit',
  types: () => [Weight, CustomUnit],
  resolveType(value) {
    if (determineIfItsWeightOrObject(value)) {
      return 'Weight'
    } else {
      return 'CustomUnit'
    }
  }
})

@ObjectType()
export class Ingredient {
  @Field()
  id: ObjectId

  @Field(type => [Translation], {
    nullable: true,
    description: 'The plain name of the ingredient in the case it was not associated with a food or recipe'
  })
  name?: Translation[]

  @Field({ nullable: true })
  amount?: number

  @Field(type => IngredientUnitUnion, {
    nullable: true,
    description: 'The active unit for this ingredient. Empty value means grams'
  })
  unit?: typeof IngredientUnitUnion

  @Field(type => CustomUnit, { nullable: true })
  customUnit?: CustomUnit

  @Field(type => IngredientItemUnion, { nullable: true })
  item?: typeof IngredientItemUnion

  @Field(type => [Translation], {
    nullable: true,
    description: 'Additional descriptions or hints for this ingredient'
  })
  description?: Translation[]

  @Field({ defaultValue: false })
  isOptional?: boolean
}

@InputType()
export class IngredientInput {
  @Field({ defaultValue: ObjectId, nullable: true })
  readonly id?: ObjectId

  @Field(type => [TranslationInput], {
    nullable: true,
    description: 'If the ingredient wasn\'t associated with a food or recipe, this field can be used as the plain name of an ingredient'
  })
  name?: TranslationInput[]

  @Field({ nullable: true })
  amount?: number

  @Field({
    description: 'the active unit for this ingredient. It is either a weight id, "customUnit" or "g"'
  })
  unit: string

  @Field({ nullable: true })
  food?: ObjectId

  @Field({ nullable: true })
  recipe?: ObjectId

  @Field({ defaultValue: false })
  isOptional?: boolean

  @Field(type => CustomUnitInput, { nullable: true })
  customUnit?: CustomUnitInput

  @Field(type => [TranslationInput], { nullable: true })
  description?: TranslationInput[]
}

