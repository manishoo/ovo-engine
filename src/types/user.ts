/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealPlanSchema } from '@Models/meal-plan.model'
import { MacroNutrientDistribution } from '@Types/assistant'
import { PersistedPassword } from '@Types/auth'
import { Image, UserRole } from '@Types/common'
import { Event } from '@Types/event'
import { Household } from '@Types/household'
import { GraphQLUpload } from 'apollo-server'
import { IsEmail, IsPhoneNumber } from 'class-validator'
import mongoose from 'mongoose'
import { ArgsType, Field, Float, InputType, Int, ObjectType } from 'type-graphql'
import { Ref } from 'typegoose'


export enum Gender {
  male = 'Male',
  female = 'Female',
}

export enum Activity {
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

export enum WeightUnits {
  kg = 'kg',
  pound = 'pound',
}

export enum HeightUnits {
  cm = 'cm',
}

@ObjectType()
export class Height {
  @Field()
  value: number
  @Field()
  unit: HeightUnits
}

@InputType()
export class HeightInput {
  @Field()
  value: number
  @Field()
  unit: HeightUnits
}

@InputType()
export class WeightUnitInput {
  @Field()
  value: number
  @Field()
  unit: WeightUnits
}

@ObjectType()
export class WeightUnit {
  @Field()
  value: number
  @Field()
  unit: WeightUnits
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
export class BaseUser {
  _id?: mongoose.Schema.Types.ObjectId
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
  imageUrl: Image
}

@ObjectType()
export class Author extends BaseUser {
}

@ObjectType()
export class User extends BaseUser {
  persistedPassword: PersistedPassword
  @Field()
  session?: string
  @Field(type => UserRole)
  role?: UserRole
  @Field()
  @IsEmail()
  email: string
  @Field({ nullable: true })
  @IsPhoneNumber('any')
  phoneNumber?: string
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
  gender?: Gender
  foodAllergies?: string[]
  status?: string
  meals?: MealUnit[]
  mealPlanSettings?: MacroNutrientDistribution
  mealPlans?: Ref<MealPlanSchema>[]
  household?: Ref<Household>
  activityLevel?: Activity
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
  @Field({ nullable: true })
  gender?: Gender
  @Field(type => GraphQLUpload, { nullable: true })
  imageUrl?: any
  @Field(type => SocialNetworksInput, { nullable: true })
  socialNetworks?: SocialNetworksInput
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
