/*
 * imageUrlSetter.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '~/config'

export function setImageUrl(url: string, full: boolean = false, foodId: number) {
	return `${config.imageUrl}/${foodId}/${full ? 'full' : 'thumb'}/${url.replace('jpg', 'png')}`
}
