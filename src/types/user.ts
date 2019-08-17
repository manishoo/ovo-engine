/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealPlanSchema } from '@Models/meal-plan.model'
import { MacroNutrientDistribution } from '@Types/assistant'
import { PersistedPassword } from '@Types/auth'
import { UserRole } from '@Types/common'
import { Event } from '@Types/event'
import { Household } from '@Types/household'
import mongoose from 'mongoose'
import { Field, Float, Int, ObjectType, InputType, ArgsType } from 'type-graphql'
import { Ref } from 'typegoose'
import { GraphQLUpload } from 'apollo-server'
import { Length, IsEmail } from 'class-validator'


export enum GENDER {
  male = 'Male',
  female = 'Female',
}

export enum ACTIVITY {
  sed = 'sed',
  light = 'light',
  mod = 'mod',
  high = 'high',
  extreme = 'extreme',
}

export enum GOALS {
  ml = 'ml',
  sl = 'sl',
  il = 'il',
  m = 'm',
  mg = 'mg',
  sg = 'sg',
  ig = 'ig',
}

export enum WEIGHT_UNITS {
  kg = 'kg',
  pound = 'pound',
}

export enum HEIGHT_UNITS {
  cm = 'cm',
}

@ObjectType()
export class Height {
  @Field()
  value: number
  @Field()
  unit: HEIGHT_UNITS
}

@InputType()
export class HeightInput {
  @Field()
  value: number
  @Field()
  unit: HEIGHT_UNITS
}

@ObjectType()
export class WeightUnit {
  @Field()
  value: number
  @Field()
  unit: WEIGHT_UNITS
}

@InputType()
export class WeightUnitInput {
  @Field()
  value: number
  @Field()
  unit: WEIGHT_UNITS
}

@ObjectType()
export class MealUnit {
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
export class User {
  _id?: mongoose.Schema.Types.ObjectId
  @Field()
  id?: string
  @Field()
  publicId?: string
  @Field()
  username: string
  persistedPassword: PersistedPassword
  @Field()
  session?: string
  @Field(type => UserRole)
  role?: UserRole
  @Field()
  @IsEmail()
  email: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  middleName?: string
  @Field({ nullable: true })
  lastName?: string
  @Field({ nullable: true })
  bio?: string
  @Field({ nullable: true })
  @Length(5, 15)
  phoneNumber?: string
  @Field(type => GraphQLUpload, { nullable: true })
  imageUrl?: any
  @Field(type => SocialNetworks, { nullable: true })
  socialNetworks?: SocialNetworks
  @Field(type => Float, { nullable: true })
  caloriesPerDay?: number
  @Field({ nullable: true })
  height?: Height
  @Field({ nullable: true })
  weight?: WeightUnit
  @Field({ nullable: true })
  age?: number
  @Field(type => Int, { nullable: true })
  bodyFat?: number
  @Field({ nullable: true })
  gender?: GENDER
  foodAllergies?: string[]
  status?: string
  meals?: MealUnit[]
  mealPlanSettings?: MacroNutrientDistribution
  mealPlans?: Ref<MealPlanSchema>[]
  household?: Ref<Household>
  activityLevel?: ACTIVITY
  goal?: GOALS
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
  @Field({ nullable: true })
  gender?: GENDER
  @Field(type => GraphQLUpload, { nullable: true })
  imageUrl?: any
  @Field(type => SocialNetworksInput, { nullable: true })
  socialNetworks?: SocialNetworksInput
  @Field({ nullable: true })
  bio?: string
  @Field({ nullable: true })
  @Length(5, 15)
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