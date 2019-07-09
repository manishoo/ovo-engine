/*
 * logger.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

export const logError = (location: string) => (error: Error) => {
	console.error(`${location} ====>`, error)
}

export default {

}