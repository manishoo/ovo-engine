/*
 * password-manager.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import * as crypto from 'crypto'
import {PersistedPassword} from '@dao/types'

const PASSWORD_LENGTH = 256
const SALT_LENGTH = 64
const ITERATIONS = 10000
const DIGEST = 'sha256'
const BYTE_TO_STRING_ENCODING = 'hex'

async function generateHashPassword(password: string): Promise<PersistedPassword> {
	return new Promise<PersistedPassword>((accept, reject) => {
		const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING)
		crypto.pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (error, hash) => {
			if (error) {
				reject(error)
			} else {
				accept({
					salt,
					hash: hash.toString(BYTE_TO_STRING_ENCODING),
					iterations: ITERATIONS,
				})
			}
		})
	})
}

async function verifyPassword(persistedPassword: PersistedPassword, passwordAttempt: string): Promise<boolean> {
	return new Promise<boolean>((accept, reject) => {
		crypto.pbkdf2(passwordAttempt, persistedPassword.salt, persistedPassword.iterations, PASSWORD_LENGTH, DIGEST, (error, hash) => {
			if (error) {
				reject(error)
			} else {
				accept(persistedPassword.hash === hash.toString(BYTE_TO_STRING_ENCODING))
			}
		})
	})
}


export {
	generateHashPassword,
	verifyPassword,
}
