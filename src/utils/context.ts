/*
 * context.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodDataSource from '@Services/food/food.datasource'
import RecipeDataSource from '@Services/recipe/recipe.datasource'
import UserDataSource from '@Services/user/user.datasource'
import { LanguageCode, Role, Status } from '@Types/common'
import { Request } from 'express'


export enum ContextUserType {
  operator = 'operator',
  user = 'user',
}

export class ContextUser {
  id: string // FIXME use objectId
  status: Status
  session: string
  // lang: LanguageCode
  type: ContextUserType
  role: Role
}

export class Context {
  request: Request
  lang: LanguageCode
  user?: ContextUser
  dataSources: {
    foods: FoodDataSource,
    recipes: RecipeDataSource,
    users: UserDataSource,
  }
}
