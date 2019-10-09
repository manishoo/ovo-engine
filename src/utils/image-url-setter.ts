/*
 * image-url-setter.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'


export function setImageUrl(url: string, full: boolean = false, foodId: number) {
  return `${config.imagesUrl}/${foodId}/${full ? 'full' : 'thumb'}/${url.replace('jpg', 'png')}`
}
