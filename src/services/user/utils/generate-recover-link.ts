/*
 * generate-recover-link.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import jwt from 'jsonwebtoken'
import Config from '@Config'


export default function generateRecoverLink(userId: string): string {

  const token = jwt.sign({ id: userId }, Config.jwt.key, {
    expiresIn: Config.jwt.tokenTime
  })

  return `${Config.appFullAddressForExternalUse}/recover?key=${token}`
}