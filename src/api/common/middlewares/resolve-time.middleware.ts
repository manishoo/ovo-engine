/*
 * resolve-time.middleware.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MiddlewareFn } from 'type-graphql'


export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now()
  await next()
  const resolveTime = Date.now() - start
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`)
}
