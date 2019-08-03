/*
 * validate-intl-string.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES } from '@Types/common'

export default function validateIntlString(intlStringObject: any) {
	let isValid = true

	Object.keys(intlStringObject).map(key => {
		let valid = false
		Object.keys(LANGUAGE_CODES).map(k => {
			// @ts-ignore
			if (key === LANGUAGE_CODES[k]) valid = true
		})

		if (!valid) isValid = false
	})

	return isValid
}