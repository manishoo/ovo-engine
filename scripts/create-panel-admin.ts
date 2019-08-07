/*
 * create-panel-admin.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { OperatorModel } from '@Models/operator.model'
import { generateHashPassword } from '@Utils/password-manager'
import 'reflect-metadata'
import { Role } from '../src/types/common'

const argv = require('minimist')(process.argv.slice(2))

async function main() {
	const admin = new OperatorModel({
		username: String(argv.u || 'admin'),
		persistedPassword: await generateHashPassword(String(argv.p || '0000')),
		role: Role.admin
	})
	await admin.save()
}

main()
	.then(() => process.exit(0))