/*
 * user.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { MealPlanSchema } from '@Models/meal-plan.model'
import HouseholdService from '@Services/household/household.service'
import { MacroNutrientDistribution } from '@Types/assistant'
import { PersistedPassword } from '@Types/auth'
import { Image, Status } from '@Types/common'
import { Event } from '@Types/event'
import { Household } from '@Types/household'
import { Activity, Gender, Goal, Height, MealUnit, User, WeightUnit } from '@Types/user'
import isUUID from 'is-uuid'
import { Container } from 'typedi'
import { arrayProp, post, prop, Ref, Typegoose } from 'typegoose'
import uuid from 'uuid/v1'


@post<UserSchema>('save', function () {
  if (!this.model.household) {
    // create and assign household
    return new Promise((resolve, reject) => {
      const householdService = Container.get(HouseholdService)
      householdService.create(<Household>{
        members: [this.model._id]
      })
        .then((h) => {
          this.model.household = h
          this.save()
            .then(resolve)
        })
        .catch(reject)
    })
  }
})
export class UserSchema extends Typegoose implements User {
  @prop({ default: uuid })
  publicId?: string

  /**
   * login credentials
   * */
  @prop({ required: true, unique: true })
  username: string

  @prop({ required: true })
  persistedPassword: PersistedPassword
  @prop({ required: true, unique: true, default: uuid })
  session: string

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
  avatar?: Image

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
  activityLevel?: Activity
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
