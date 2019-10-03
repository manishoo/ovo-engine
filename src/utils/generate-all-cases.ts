/*
 * generate-all-cases.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

function allPossibleCases(arr: string[][]): string[] {
  if (arr.length == 1) {
    return arr[0]
  } else {
    const result = []
    const allCasesOfRest = allPossibleCases(arr.slice(1))
    for (let i = 0; i < allCasesOfRest.length; i++) {
      for (let j = 0; j < arr[0].length; j++) {
        result.push(arr[0][j] + '_' + allCasesOfRest[i])
      }
    }
    return result
  }
}

function normalizeArray(arr: string[]): string[][] {
  return arr.map(i => i.split('_'))
}

export default function generateAllCases(arrayOfArrayOfMealItemIds: string[][]) {
  return normalizeArray(allPossibleCases(arrayOfArrayOfMealItemIds))
}
