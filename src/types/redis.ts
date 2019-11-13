/*
 * redis.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

export const RedisKeys = {
  foodMapperJobRunning: 'food_mapper:job_running',
  userTempData: 'user:registerDataTemp',
  userSession: (session: string) => `user:session:${session}`,
  operatorSession: (session: string) => `operator:session:${session}`,
  previousSuggestions: (userId: string) => `meal-suggestion:user-${userId}`
}
