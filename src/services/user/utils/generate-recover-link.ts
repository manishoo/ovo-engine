/*
 * generate-recover-link.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Config from '@Config'
import jwt from 'jsonwebtoken'


export default function generateRecoverLink(userId: string): string {

  const token = jwt.sign({ id: userId }, Config.jwt.key, {
    expiresIn: 60 * 60 //an hour
  })

  return `${Config.supernovaUrl}/new-password?t=${token}`
}
