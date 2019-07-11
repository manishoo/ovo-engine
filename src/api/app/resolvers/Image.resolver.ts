/*
 * Image.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, FieldResolver, Root, ResolverInterface} from 'type-graphql'
import {Image} from '~/dao/types'
import config from '~/config'


@Resolver(of => Image)
export default class ImageResolver implements ResolverInterface<Image> {
	@FieldResolver(returns => String)
	url(@Root() image: Image) {
		if (image.url.includes('http')) return image.url

		return `${config.appFullAddressForExternalUse}/${image.url}`
	}
}
