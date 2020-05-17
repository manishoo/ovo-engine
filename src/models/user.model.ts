/*
 * user.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import userConfig from '@Config/user-config'
import { PlanSchema } from '@Models/plan.model'
import HouseholdService from '@Services/household/household.service'
import PlanService from '@Services/meal-plan/meal-plan.service'
import { PersistedPassword } from '@Types/auth'
import { Image, LanguageCode, Ref, Role, Status } from '@Types/common'
import { Diet } from '@Types/diet'
import { Household } from '@Types/household'
import { Plan } from '@Types/plan'
import {
  Achievements,
  ActivityLevel,
  Gender,
  Goal,
  Height,
  Membership,
  NutritionProfile,
  SocialNetworks,
  User,
  UserMeal,
  WeightUnit
} from '@Types/user'
import { Length } from 'class-validator'
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import { Container } from 'typedi'
import { plugin, pre, prop, Typegoose } from 'typegoose'
import uuid from 'uuid/v1'


export interface UserSchema extends SoftDeleteModel<SoftDeleteDocument & User> {
}

@plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  deletedByType: String,
})
@pre<UserSchema>('save', function (next) {
  (async () => {
    /**
     * Household middleware
     * */
    if (!this.household) {
      /**
       * Create and assign household
       * */
      const householdService = Container.get(HouseholdService)
      const household = await householdService.create(<Household>{
        members: [this._id]
      })

      this.household = household._id
    }

    /**
     * Plans middleware
     * */
    if (!this.plan) {
      const planService = Container.get(PlanService)
      const plan = await planService.create({}, this._id)
      this.plan = plan._id
    }
  })()
    .then(() => next())
    .catch(e => next(e))
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
  @prop({ default: () => userConfig.defaultNutritionProfile })
  nutritionProfile: NutritionProfile

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

  @prop({ default: () => userConfig.defaultUserMeals(LanguageCode.en) })
  meals: UserMeal[]

  @prop({ ref: PlanSchema })
  plan: Ref<Plan>

  @prop({ ref: Household })
  household: Ref<Household>

  @prop()
  activityLevel?: ActivityLevel

  @prop()
  goal?: Goal

  @prop()
  timeZone?: string

  @prop()
  membership?: Membership

  @prop({ default: {} })
  achievements: Achievements

  @prop()
  diet?: Diet

  @prop()
  careGivers: Ref<User>[]
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
