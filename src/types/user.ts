/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealPlanSchema } from '@Models/meal-plan.model'
import { PersistedPassword } from '@Types/auth'
import { Image, Ref, WeightMeasurement, Role, Status, ObjectId } from '@Types/common'
import { Event } from '@Types/event'
import { Household } from '@Types/household'
import { GraphQLUpload } from 'apollo-server'
import { IsEmail, IsPhoneNumber, Min, Max } from 'class-validator'
import { ArgsType, Field, Float, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'


export enum Gender {
  male = 'male',
  female = 'female',
}

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender'
})

export enum ActivityLevel {
  sed = 'sed',
  light = 'light',
  mod = 'mod',
  high = 'high',
  extreme = 'extreme',
}

export enum Goal {
  ml = 'ml',
  sl = 'sl',
  il = 'il',
  m = 'm',
  mg = 'mg',
  sg = 'sg',
  ig = 'ig',
}

export enum WeightUnit {
  kg = 'kg',
  lb = 'lb',
}

registerEnumType(WeightUnit, {
  name: 'WeightUnit',
  description: 'Weight Units'
})

export enum HeightUnit {
  cm = 'cm',
  m = 'm',
}

registerEnumType(HeightUnit, {
  name: 'HeightUnit',
  description: 'Height Units'
})

@ObjectType()
export class Height {
  @Field()
  value: number
  @Field()
  unit: HeightUnit
}

@InputType()
export class HeightInput {
  @Field()
  value: number
  @Field()
  unit: HeightUnit
}

@ObjectType()
export class UserMeal {
  @Field()
  name: string
  @Field()
  time: string
  @Field(type => Int)
  energyPercentageOfDay: number
  @Field(type => Int)
  availableTime?: number
  @Field(type => Int)
  mealFor?: number
  @Field(type => Boolean)
  cook?: boolean
}

@ObjectType()
export class SocialNetworks {
  @Field({ nullable: true })
  instagram?: string
  @Field({ nullable: true })
  twitter?: string
  @Field({ nullable: true })
  pinterest?: string
  @Field({ nullable: true })
  website?: string
}

@InputType()
export class SocialNetworksInput {
  @Field({ nullable: true })
  instagram?: string
  @Field({ nullable: true })
  twitter?: string
  @Field({ nullable: true })
  pinterest?: string
  @Field({ nullable: true })
  website?: string
}

@ObjectType()
export class TargetNutrition {
  @Field({ nullable: true })
  min?: number

  @Field({ nullable: true })
  max?: number

  @Field({ nullable: true })
  @Min(0)
  @Max(100)
  percent?: number
}

@InputType()
export class TargetNutritionInput {
  @Field({ nullable: true })
  min?: number

  @Field({ nullable: true })
  max?: number

  @Field({ nullable: true })
  @Min(0)
  @Max(100)
  percent?: number
}

@ObjectType()
export class NutritionProfile {
  @Field()
  calories: number

  @Field(type => TargetNutrition)
  protein: TargetNutrition

  @Field(type => TargetNutrition)
  carb: TargetNutrition

  @Field(type => TargetNutrition)
  fat: TargetNutrition
}

@InputType()
export class NutritionProfileInput {
  @Field()
  calories: number

  @Field(type => TargetNutritionInput)
  protein: TargetNutritionInput

  @Field(type => TargetNutritionInput)
  carb: TargetNutritionInput

  @Field(type => TargetNutritionInput)
  fat: TargetNutritionInput
}

@ObjectType()
export class UpdateNutritionProfileResponse {
  @Field()
  userId: ObjectId

  @Field()
  nutritionProfile: NutritionProfile
}

@ObjectType()
export class BaseUser {
  _id?: ObjectId
  @Field()
  id?: string
  @Field()
  username: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  middleName?: string
  @Field({ nullable: true })
  lastName?: string
  @Field({ nullable: true })
  bio?: string
  @Field(type => Image, { nullable: true })
  avatar: Image
  @Field(type => SocialNetworks, { defaultValue: {} })
  socialNetworks: SocialNetworks
}

@ObjectType()
export class Author extends BaseUser {
}

@ObjectType()
export class User extends BaseUser {
  password: PersistedPassword
  @Field()
  session?: string
  @Field(type => Role)
  role?: Role
  @Field()
  @IsEmail()
  email: string
  @Field({ nullable: true })
  @IsPhoneNumber('any')
  phoneNumber?: string
  @Field(type => Float, { nullable: true })
  caloriesPerDay?: number
  @Field({ nullable: true })
  height?: Height
  @Field(type => WeightMeasurement, { nullable: true })
  weight?: WeightMeasurement
  @Field({ nullable: true })
  age?: number
  @Field(type => Int, { nullable: true })
  bodyFat?: number
  @Field(type => Gender, { nullable: true })
  gender?: Gender
  @Field(type => NutritionProfile, { nullable: true })
  nutritionProfile?: NutritionProfile
  foodAllergies?: string[]
  status?: Status
  meals?: UserMeal[]
  mealPlans?: Ref<MealPlanSchema>[]
  household?: Ref<Household>
  activityLevel?: ActivityLevel
  goal?: Goal
  @Field(type => [Event], { nullable: true })
  path?: Event[]
  timeZone?: string
}

@InputType()
export class UserRegistrationInput {
  @Field()
  username: string
  @Field()
  password: string
  @Field()
  @IsEmail()
  email: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  middleName?: string
  @Field({ nullable: true })
  lastName?: string
}

@ArgsType()
export class UserLoginArgs {
  @Field()
  username: string
  @Field()
  password: string
}

@InputType()
export class UserUpdateInput {
  @Field()
  username: string
  @Field()
  @IsEmail()
  email: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  middleName?: string
  @Field({ nullable: true })
  lastName?: string
  @Field(type => Gender, { nullable: true })
  gender?: Gender
  @Field(type => GraphQLUpload, { nullable: true })
  avatar?: any
  @Field(type => SocialNetworksInput)
  socialNetworks: SocialNetworksInput
  @Field({ nullable: true })
  bio?: string
  @Field({ nullable: true })
  @IsPhoneNumber('any')
  phoneNumber?: string
}

@ObjectType()
export class UserAuthResponse {
  @Field(type => User)
  user: User
  @Field()
  session: string
}

@ObjectType()
export class DecodedUser {
  @Field()
  id: string
}