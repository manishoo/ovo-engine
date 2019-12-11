/*
 * recipe-user.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Author, User } from '@Types/user'


export function transformRecipeUser(user: User): Author {
  return {
    id: String(user._id),
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    avatar: user.avatar,
    socialNetworks: user.socialNetworks,
    role: user.role,
  }
}
