/*
 * operator.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { PersistedPassword } from '@Types/auth'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Operator {
	@Field()
	id: string

	@Field()
	username: string

	@Field()
	status?: string

	@Field()
	role?: string

	persistedPassword: PersistedPassword

	@Field({nullable: true})
	session: string
}

@ObjectType()
export class OperatorResponse {
	@Field(type => Operator)
	operator: Operator
	@Field()
	session: string
}