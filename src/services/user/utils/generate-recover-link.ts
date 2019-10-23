/*
 * generate-recover-link.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import jwt from 'jsonwebtoken'
import Config from '@Config'


export default function generateRecoverLink(userId: string): string {

  const token = jwt.sign({ id: userId }, Config.jwt.key, {
    expiresIn: 60 * 60 //an hour
  })

  return `${Config.appFullAddressForExternalUse}/recover?key=${token}`
}