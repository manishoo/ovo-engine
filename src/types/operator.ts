/*
 * operator.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { PersistedPassword } from '@Types/auth'
import { Role } from '@Types/common'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Operator {
	@Field()
	id: string

	@Field()
	username: string

	@Field()
	status?: string

	@Field(type => Role)
	role?: Role

	persistedPassword: PersistedPassword

	session: string
}

@ObjectType()
export class OperatorResponse {
	@Field(type => Operator)
	operator: Operator
	@Field()
	session: string
}