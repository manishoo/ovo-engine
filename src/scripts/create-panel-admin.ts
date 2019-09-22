/*
 * create-panel-admin.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { OperatorModel } from '@Models/operator.model'
import { OperatorRole } from '@Types/common'
import { generateHashPassword } from '@Utils/password-manager'
import 'reflect-metadata'


const argv = require('minimist')(process.argv.slice(2))

export default async function main(username: string, password: string) {
  const admin = new OperatorModel({
    username,
    persistedPassword: await generateHashPassword(password),
    role: OperatorRole.admin
  })
  await admin.save()
}
