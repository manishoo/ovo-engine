/*
 * determine-weight-is-object.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Weight } from "@Types/weight"
import { ObjectId } from "@Types/common"


export default function determineWeightIsObject(weight: Weight | ObjectId): weight is Weight {
  if (weight.hasOwnProperty('amount')) return true

  return false
}