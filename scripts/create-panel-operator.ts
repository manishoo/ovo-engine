 /*
 * create-panel-admin.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import 'reflect-metadata'
const argv = require('minimist')(process.argv.slice(2))
import { OperatorModel } from '@Models/operator.model'
import { generateHashPassword } from '@Utils/password-manager'

async function main() {
 const admin = new OperatorModel({
  username: String(argv.u || 'admin'),
  persistedPassword: await generateHashPassword(String(argv.p || '0000')),
 })
 await admin.save()
}

main()
 .then(() => process.exit(0))
 .catch(e => console.error(e))
