/*
 * create-panel-admin.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

const argv = require('minimist')(process.argv.slice(2))
import { OperatorModel } from '../src/dao/models/operator.model'
import { generateHashPassword } from '../src/utils/password-manager'

async function main() {
	const admin = new OperatorModel({
		username: String(argv.u || 'admin'),
		persistedPassword: await generateHashPassword(String(argv.p || '0000')),
	})
	await admin.save()
}

main()
	.then(() => process.exit(0))
