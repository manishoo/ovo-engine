/*
 * convertTimeToUTC.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

export default function convertTimeToUTC(time: Date): Date {
  let UTCTime = new Date(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(), time.getUTCMinutes(), time.getUTCSeconds())

  return UTCTime
}