import { registerEnumType, ObjectType, Field } from "type-graphql"

export enum ActivityType {
  running = 'running',
  cycling = 'cycling',
}

registerEnumType(ActivityType, {
  name: 'ActivityType',
  description: 'ActivityLevel types'
})

@ObjectType()
export class Activity {
  @Field()
  duration: number

  @Field()
  activityType: ActivityType

  @Field()
  totalBurnt: number

  @Field()
  activityName: string

  @Field(type => Date)
  time: Date
}
