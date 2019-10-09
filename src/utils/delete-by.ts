/*
 * delete-by.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ContextUser } from '@Utils/context'


export enum DeleteByType {
  user = 'user',
  operator = 'operator',
  system = 'system',
}

export class DeleteBy {
  public static user = (user: ContextUser) => `${user.type}-${user.id}`
  public static system = (name?: string) => `${DeleteByType.system}${name ? `-${name}` : ''}`
}
