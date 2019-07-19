/*
 * recipe-user.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { User } from '@Types/user'

export function transformRecipeUser(user: User): Partial<User> {
	return {
		id: user.publicId,
		username: user.username,
		avatar: user.avatar,
		firstName: user.firstName,
		lastName: user.lastName,
	}
}