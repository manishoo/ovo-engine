import jwt from 'jsonwebtoken'
import Config from '@Config'


export default function decodeJwtToken(token: string) {

  return jwt.verify(token, Config.jwt.key)
}