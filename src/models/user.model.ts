/*
 * user.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { MealPlanSchema } from '@Models/meal-plan.model'
import HouseholdService from '@Services/household/household.service'
import { MacroNutrientDistribution } from '@Types/assistant'
import { PersistedPassword } from '@Types/auth'
import { Image, Status, UserRole } from '@Types/common'
import { Event } from '@Types/event'
import { Household } from '@Types/household'
import { ActivityLevel, Gender, Goal, Height, MealUnit, SocialNetworks, User, WeightUnit } from '@Types/user'
import { Length } from 'class-validator'
import isUUID from 'is-uuid'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { Container } from 'typedi'
import { arrayProp, plugin, pre, prop, Ref, Typegoose } from 'typegoose'
import uuid from 'uuid/v1'


export interface UserSchema extends SoftDeleteModel<SoftDeleteDocument> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
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
  persistedPassword: PersistedPassword
  @prop({ required: true, unique: true, default: uuid })
  session: string
  @prop({ required: true, enum: UserRole, default: UserRole.user })
  role?: UserRole
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
  imageUrl: Image
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
  // FIXME allergies aren't foods!
  @arrayProp({ items: String, validate: value => !value.find((v: string) => !isUUID.v4(v)) })
  foodAllergies?: string[]

  /**
   * other
   * */
  @prop({ required: true, enum: Status, default: Status.active })
  status?: string
  @prop({ default: [] })
  meals?: MealUnit[]
  @prop()
  mealPlanSettings?: MacroNutrientDistribution
  @prop({ ref: MealPlanSchema })
  mealPlans?: Ref<MealPlanSchema>[]
  @prop({ ref: Household })
  household?: Ref<Household>
  @prop()
  activityLevel?: ActivityLevel
  @prop()
  goal?: Goal
  @prop({ default: [] })
  path?: Event[]
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
