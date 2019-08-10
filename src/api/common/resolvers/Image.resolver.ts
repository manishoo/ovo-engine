/*
 * Image.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { Image } from '@Types/common'
import { FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql'


@Resolver(of => Image)
export default class ImageResolver implements ResolverInterface<Image> {
	@FieldResolver(returns => String)
	url(@Root() image: Image) {
		if (image.url.includes('http')) return image.url

		return `${config.appFullAddressForExternalUse}/${image.url}`
	}
}
