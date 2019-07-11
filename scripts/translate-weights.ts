// /*
//  * translate-weights.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// import WeightTr from '~/dao/models/foods/weights-translation.model'
//
// const fs = require('fs')
//
//
// const uniqueTokens: { token: string, tr?: string, count: number }[] = []
//
// async function main() {
// 	const weightTrs = await WeightTr.findAll()
//
// 	const arrays = []
// 	const size = 1000
//
// 	while (weightTrs.length > 0)
// 		arrays.push(weightTrs.splice(0, size))
//
// 	for (let i = 0; i < arrays.length; i++) {
// 		const wtrs = arrays[i]
//
// 		await Promise.all(wtrs.map(async wtr => {
// 			const prevAdded = uniqueTokens.findIndex(p => p.token === wtr.description)
// 			if (prevAdded >= 0) {
// 				uniqueTokens[prevAdded].count = uniqueTokens[prevAdded].count + 1
// 			} else {
// 				uniqueTokens.push({
// 					token: wtr.description,
// 					count: 1,
// 				})
// 			}
// 		}))
// 	}
//
// 	let s = ''
// 	let ss: string[] = []
// 	uniqueTokens
// 		.map(p => p.token)
// 		.map(token => {
// 			if ((s.length + token.length) < 5000) {
// 				s = `${token}\n${s}`
// 			} else {
// 				ss.push(s)
// 				s = ''
// 			}
// 		})
//
// 	const {Translate} = require('@google-cloud/translate')
// 	const translate = new Translate({projectId: 'firebase-hampa'})
// 	// console.log('uniqueTokens', uniqueTokens)
// 	for (let i = 0; i < ss.length; i++) {
// 		let text = ss[i]
// 		const [translation] = await translate.translate(text, {from: 'en', to: 'fa'})
//
// 		const splitTranslations = translation
// 			.split('\n')
// 		text
// 			.split('\n')
// 			.map((token, index) => {
// 				if (!token) return null
// 				const foundIndex = uniqueTokens.findIndex(p => {
// 					return p.token == token
// 				})
// 				if (foundIndex < 0) throw new Error('Something went wrong')
//
// 				uniqueTokens[foundIndex].tr = splitTranslations[index]
// 			})
// 	}
//
// 	uniqueTokens.sort(function (a, b) {
// 		if (a.count < b.count) return -1
// 		if (a.count > b.count) return 1
// 		return 0
// 	})
//
// 	fs.writeFileSync('weight-uniqueTokens.json', JSON.stringify(uniqueTokens), 'utf8')
// }
//
// main()
// 	.then(() => process.exit(0))
// 	.catch(e => console.error(e))
