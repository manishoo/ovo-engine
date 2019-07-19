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

	persistedPassword: PersistedPassword

	session: string
}