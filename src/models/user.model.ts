/*
 * user.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { MealPlanSchema } from '@Models/meal-plan.model'
import HouseholdService from '@Services/household/household.service'
import { PersistedPassword } from '@Types/auth'
import { Image, Ref, Role, Status } from '@Types/common'
import { Household } from '@Types/household'
import { ActivityLevel, Gender, Goal, Height, UserMeal, SocialNetworks, User, WeightUnit, NutritionProfile } from '@Types/user'
import { Length } from 'class-validator'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { Container } from 'typedi'
import { plugin, pre, prop, Typegoose } from 'typegoose'
import uuid from 'uuid/v1'


export interface UserSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
/**
 * Household middleware
 * */
@pre<UserSchema>('save', function (next) {
  if (!this.household) {
    /**
     * Create and assign household
     * */
    const householdService = Container.get(HouseholdService)
    return householdService.create(<Household>{
      members: [this._id]
    })
      .then((household) => {
        this.household = household._id

        next()
      })
  }

  next()
})
export class UserSchema extends Typegoose implements User {
  readonly id?: string

  /**
   * login credentials
   * */
  @prop({ required: true, unique: true })
  username: string

  @prop({ required: true })
  password: PersistedPassword

  @prop({ required: true, unique: true, default: uuid })
  session: string

  @prop({ required: true, enum: Role, default: Role.user })
  role: Role
  /**
   * personal information
   * */
  @prop({ required: true, unique: true })
  email: string

  @prop()
  firstName?: string

  @prop()
  middleName?: string

  @prop()
  lastName?: string

  @prop()
  avatar: Image

  @prop({ default: {} })
  socialNetworks: SocialNetworks

  @prop()
  bio?: string

  @prop()
  @Length(5, 15)
  phoneNumber?: string

  /**
   * physical attributes
   * */
  @prop()
  nutritionProfile?: NutritionProfile

  @prop()
  caloriesPerDay?: number

  @prop()
  height?: Height

  @prop()
  weight?: WeightUnit

  @prop({ min: 0, max: 150 })
  age?: number

  @prop()
  bodyFat?: number

  @prop()
  gender?: Gender

  /**
   * other
   * */
  @prop({ required: true, enum: Status, default: Status.active })
  status: Status

  @prop({ default: [] })
  meals?: UserMeal[]

  @prop({ ref: MealPlanSchema })
  mealPlans?: Ref<MealPlanSchema>[]

  @prop({ ref: Household })
  household?: Ref<Household>

  @prop()
  activityLevel?: ActivityLevel

  @prop()
  goal?: Goal

  @prop()
  timeZone?: string
}

export const UserModel = new UserSchema().getModelForClass(UserSchema, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    emitIndexErrors: true,
    validateBeforeSave: true,
  }
})
