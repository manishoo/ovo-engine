/*
 * mail.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectType, Field } from "type-graphql"


@ObjectType()
export class MailInput {
  @Field()
  userId?: string

  @Field()
  name: string

  @Field()
  subject: string

  @Field()
  email: string

  @Field()
  senderAddress: string

  @Field(type => String)
  template: string

  @Field()
  recover?: string
}
