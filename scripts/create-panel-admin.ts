/*
 * create-panel-admin.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import 'reflect-metadata'
import { OperatorModel } from '@Models/operator.model'
import { generateHashPassword } from '@Utils/password-manager'
import { OperatorRole } from '../src/types/common'

const argv = require('minimist')(process.argv.slice(2))

export default async function main(username: string, password: string) {
	const admin = new OperatorModel({
		username,
		persistedPassword: await generateHashPassword(password),
		role: OperatorRole.admin
	})
	await admin.save()
}

