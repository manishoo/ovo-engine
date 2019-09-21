/*
 * event.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DayMeal } from '@Types/calendar'
import { Field, ObjectType } from 'type-graphql'
import { prop } from 'typegoose'


export enum EVENT_TYPES {
  meal = 'meal',
  exercise = 'exercise',
}

@ObjectType()
export class Event {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  datetime: string

  @Field()
  type: 'meal' | 'exercise'

  @Field(type => DayMeal, { nullable: true })
  @prop()
  meal?: DayMeal
}
