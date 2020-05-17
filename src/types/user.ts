/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { PersistedPassword } from '@Types/auth'
import { Image, ObjectId, Ref, Role, Status } from '@Types/common'
import { Diet } from '@Types/diet'
import { Household } from '@Types/household'
import { Plan } from '@Types/plan'
import { GraphQLUpload } from 'apollo-server'
import { ArrayNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator'
import { ArgsType, Field, Float, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'


export enum Gender {
  male = 'male',
  female = 'female',
}

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender'
})

export enum MealSize {
  tiny = 'tiny',
  small = 'small',
  normal = 'normal',
  big = 'big',
  huge = 'huge',
}

export function getMealSizeValue(size: MealSize) {
  switch (size) {
    case MealSize.tiny:
      return 1
    case MealSize.small:
      return 2
    case MealSize.normal:
      return 3
    case MealSize.big:
      return 5
    case MealSize.huge:
      return 8
  }
}

registerEnumType(MealSize, {
  name: 'MealSize',
  description: 'Meal Size'
})

export enum MealAvailableTime {
  noTime = 'noTime',
  littleTime = 'littleTime',
  someTime = 'someTime',
  moreTime = 'moreTime',
  lotsOfTime = 'lotsOfTime',
  noLimit = 'noLimit',
}

registerEnumType(MealAvailableTime, {
  name: 'MealAvailableTime',
  description: 'Meal Available Time'
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

export enum WeightUnits {
  kg = 'kg',
  pound = 'pound',
}

export enum HeightUnits {
  cm = 'cm',
}

export enum MembershipType {
  premium = 'premium',
  pro = 'pro'
}

@ObjectType()
export class Membership {
  @Field()
  type: MembershipType
  @Field()
  fromDate: Date
  @Field()
  toDate: Date
}

@ObjectType()
export class Achievements {
  @Field({ nullable: true })
  finishedSetup?: boolean
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
export class UserMeal {
  @Field()
  id: string
  @Field()
  name: string
  @Field()
  time: string
  @Field(type => MealSize)
  size: MealSize
  @Field(type => MealAvailableTime)
  availableTime: MealAvailableTime
  @Field(type => Boolean, { nullable: true })
  cook?: boolean
}

@InputType()
export class UserMealInput {
  @Field()
  id: string
  @Field()
  name: string
  @Field()
  time: string
  @Field(type => MealSize)
  size: MealSize
  @Field(type => MealAvailableTime)
  availableTime: MealAvailableTime
  @Field(type => Boolean, { nullable: true })
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
  percentage: number

  @Field()
  min: number

  @Field()
  max: number
}

@InputType()
export class TargetNutritionInput {
  @Field({ nullable: true })
  percentage: number

  @Field()
  min: number

  @Field()
  max: number
}

export enum NutritionProfileMode {
  percentage = 'percentage',
  range = 'range',
}

registerEnumType(NutritionProfileMode, {
  name: 'NutritionProfileMode',
  description: 'Nutrition Profile Mode'
})

@ObjectType()
export class NutritionProfile {
  @Field()
  id: ObjectId

  @Field()
  calories: number

  @Field(type => TargetNutrition)
  protein: TargetNutrition

  @Field(type => TargetNutrition)
  carbs: TargetNutrition

  @Field(type => TargetNutrition)
  fat: TargetNutrition

  @Field()
  isStrict: boolean

  @Field(type => NutritionProfileMode)
  mode: NutritionProfileMode
}

@InputType()
export class NutritionProfileInput {
  @Field({ nullable: true })
  id?: ObjectId

  @Field()
  calories: number

  @Field(type => TargetNutritionInput)
  protein: TargetNutritionInput

  @Field(type => TargetNutritionInput)
  carbs: TargetNutritionInput

  @Field(type => TargetNutritionInput)
  fat: TargetNutritionInput

  @Field()
  isStrict: boolean

  @Field(type => NutritionProfileMode)
  mode: NutritionProfileMode
}

@ObjectType()
export class BasicUser {
  _id?: ObjectId
  @Field()
  id?: string
  @Field()
  username: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  lastName?: string
  @Field({ nullable: true })
  bio?: string
  @Field(type => Image, { nullable: true })
  avatar: Image
  @Field(type => SocialNetworks, { defaultValue: {} })
  socialNetworks: SocialNetworks
  @Field(type => Role)
  role: Role
}

@ObjectType()
export class Author extends BasicUser {
}

@ObjectType()
export class User extends BasicUser {
  password: PersistedPassword

  @Field({ nullable: true })
  session?: string

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

  @Field({ nullable: true })
  weight?: WeightUnit

  @Field({ nullable: true })
  age?: number

  @Field(type => Int, { nullable: true })
  bodyFat?: number

  @Field(type => Gender, { nullable: true })
  gender?: Gender

  @Field(type => NutritionProfile)
  nutritionProfile: NutritionProfile

  @Field(type => Diet, { nullable: true })
  diet?: Diet

  foodAllergies?: string[]

  status?: Status

  @ArrayNotEmpty()
  @Field(type => [UserMeal])
  meals: UserMeal[]

  @Field(type => ObjectId)
  plan: Ref<Plan>

  household: Ref<Household>

  activityLevel?: ActivityLevel

  goal?: Goal

  @Field(type => Membership, { nullable: true })
  membership?: Membership

  timeZone?: string

  @Field(type => Achievements)
  achievements: Achievements

  careGivers: Ref<User>[]
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
  @Field(type => ObjectId, { nullable: true })
  dietId?: ObjectId
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
  @Field(type => GraphQLUpload!, { nullable: true })
  avatar?: any
  @Field(type => SocialNetworksInput)
  socialNetworks: SocialNetworksInput
  @Field({ nullable: true })
  bio?: string
  @Field({ nullable: true })
  @IsPhoneNumber('any')
  phoneNumber?: string
  @Field(type => ObjectId, { nullable: true })
  dietId?: ObjectId
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
