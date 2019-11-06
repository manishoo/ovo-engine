/*
 * assistant.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Item } from '@Types/common'
import { User, UserMeal } from '@Types/user'
import { Field, Float, ObjectType, registerEnumType } from 'type-graphql'


@ObjectType()
export class MacroNutrientDistribution {
  @Field(type => Float, { nullable: true })
  protein?: number

  @Field(type => Float, { nullable: true })
  fat?: number

  @Field(type => Float, { nullable: true })
  carbs?: number

  @Field(type => Float, { nullable: true })
  tdee?: number
}

@ObjectType()
export class MessageAdditionalData {
  @Field(type => AssistantExpectations, { nullable: true })
  expect?: AssistantExpectations
  @Field({ nullable: true })
  value?: string
  @Field(type => Boolean, { nullable: true })
  skip?: boolean
  @Field(type => [Item], { nullable: true })
  items?: Item[]
  @Field(type => [String], { nullable: true })
  foods?: string[]
  @Field(type => MacroNutrientDistribution, { nullable: true })
  mealPlanSettings?: MacroNutrientDistribution
  @Field(type => [UserMeal], { nullable: true })
  meals?: UserMeal[]
  @Field(type => User, { nullable: true })
  user?: User
}

@ObjectType()
export class Message {
  @Field()
  id: string
  @Field(type => MessageSenders)
  sender: MessageSenders
  @Field()
  text: string
  @Field()
  timestamp: string
  @Field(type => MessageType)
  type: MessageType
  @Field(type => [Item], { nullable: true })
  items?: Item[]
  @Field(type => AssistantExpectations, { nullable: true })
  expect?: AssistantExpectations
  @Field({ nullable: true })
  data?: MessageAdditionalData
}

@ObjectType()
export class MessagePayload {
  @Field(type => [Message])
  messages: Message[]
  @Field({ nullable: true })
  token?: string
  @Field({ nullable: true })
  userId?: string
}

export class MessageBackgroundInformation {
  conversationHistory: Message[]
  tempData?: any
  user?: any
}

export enum ConversationContext {
  introduction = 'introduction'
}

export enum AssistantExpectations {
  gender = 'gender',
  nickname = 'nickname',
  age = 'age',
  weight = 'weight',
  height = 'height',
  activity = 'activity',
  goal = 'goal',
  meals = 'meals',
  register = 'register',
  allergy = 'allergy',
  dislikedFoods = 'dislikedFoods',
  diet = 'diet',
  chooseDiet = 'chooseDiet',
  meal = 'meal',
  normalRoutine = 'normalRoutine',
  mealPlanSettings = 'mealPlanSettings',
  mealPlan = 'mealPlan',
}

registerEnumType(AssistantExpectations, {
  name: 'AssistantExpectations',
  description: 'AssistantExpectations'
})

export enum GUEST_TEMP_FIELDS {
  nickname = 'nickname',
  age = 'age',
  weight = 'weight',
  height = 'height',
  gender = 'gender',
  bmr = 'bmr',
  activity = 'activity',
  tdee = 'tdee',
  goal = 'goal',
  allergies = 'allergies',
  meals = 'meals',
}

export enum MessageType {
  text = 'text',
  number = 'number',
  email = 'email',
  password = 'password',
  select = 'select',
  form = 'form',
  food = 'food',
  weight = 'weight',
  height = 'height',
  mealPlanSettings = 'mealPlanSettings',
  mealPlan = 'mealPlan',
  meals = 'meals',
}

registerEnumType(MessageType, {
  name: 'MessageType',
  description: 'Message Type'
})

export enum MessageSenders {
  assistant = 'assistant',
  user = 'user',
}

registerEnumType(MessageSenders, {
  name: 'MessageSenders',
  description: 'Message Senders'
})
