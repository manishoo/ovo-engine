/*
 * meal-plan.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DayMeal } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import { Field, ObjectType } from 'type-graphql'


export enum WEEKDAYS {
  saturday = 'saturday',
  sunday = 'sunday',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
}

@ObjectType()
export class Day {
  @Field()
  dayName: WEEKDAYS
  @Field(type => [DayMeal])
  meals: DayMeal[]
}

@ObjectType()
export class MealPlan {
  @Field()
  id: string
  @Field()
  name: string
  @Field(type => [Day])
  days: Day[]

  _id?: ObjectId
}

export enum DAY_PERIOD {
  breakfast = 'breakfast',
  launch = 'launch',
  dinner = 'dinner',
}
