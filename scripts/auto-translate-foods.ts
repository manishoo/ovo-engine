/*
 * auto-translate-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Food} from '~/dao/models'
// import FoodRepo from '~/dao/repositories/food.repository'
// import {LANGUAGE_CODES} from '~/constants/enums'

const fs = require('fs')

// export const ABBRS = [
// 	{abbr: 'ALLPURP', tr: ''},
// 	{abbr: 'AL', tr: ''},
// 	{abbr: '&', tr: ''},
// 	{abbr: 'APPL', tr: ''},
// 	{abbr: 'APPLS', tr: ''},
// 	{abbr: 'APPLSAUC', tr: ''},
// 	{abbr: 'APPROX', tr: ''},
// 	{abbr: 'APPROX', tr: ''},
// 	{abbr: 'ARM&BLD', tr: ''},
// 	{abbr: 'ART', tr: ''},
// 	{abbr: 'VIT C', tr: ''},
// 	{abbr: 'ASPRT', tr: ''},
// 	{abbr: 'ASPRT-SWTND', tr: ''},
// 	{abbr: 'BABYFD', tr: ''},
// 	{abbr: 'BKD', tr: ''},
// 	{abbr: 'BBQ', tr: ''},
// 	{abbr: 'BSD', tr: ''},
// 	{abbr: 'BNS', tr: ''},
// 	{abbr: 'BF', tr: ''},
// 	{abbr: 'BEV', tr: ''},
// 	{abbr: 'BLD', tr: ''},
// 	{abbr: 'BNLESS', tr: ''},
// 	{abbr: 'BTLD', tr: ''},
// 	{abbr: 'BTTM', tr: ''},
// 	{abbr: 'BRSD', tr: ''},
// 	{abbr: 'BRKFST', tr: ''},
// 	{abbr: 'BRLD', tr: ''},
// 	{abbr: 'BTTRMLK', tr: ''},
// 	{abbr: 'CA', tr: ''},
// 	{abbr: 'CAL', tr: ''},
// 	{abbr: 'CND', tr: ''},
// 	{abbr: 'CARB', tr: ''},
// 	{abbr: 'CNTR', tr: ''},
// 	{abbr: 'CRL', tr: ''},
// 	{abbr: 'CHS', tr: ''},
// 	{abbr: 'CHICK', tr: ''},
// 	{abbr: 'CHOC', tr: ''},
// 	{abbr: 'CHOIC', tr: ''},
// 	{abbr: 'CHOL', tr: ''},
// 	{abbr: 'CHOL-FREE', tr: ''},
// 	{abbr: 'CHOPD', tr: ''},
// 	{abbr: 'CINN', tr: ''},
// 	{abbr: 'COATD', tr: ''},
// 	{abbr: 'COCNT', tr: ''},
// 	{abbr: 'COMM', tr: ''},
// 	{abbr: 'COMMLY', tr: ''},
// 	{abbr: 'CMDTY', tr: ''},
// 	{abbr: 'COMP', tr: ''},
// 	{abbr: 'CONC', tr: ''},
// 	{abbr: 'CONCD', tr: ''},
// 	{abbr: 'COND', tr: ''},
// 	{abbr: 'CONDMNT', tr: ''},
// 	{abbr: 'CKD', tr: ''},
// 	{abbr: 'CTTNSD', tr: ''},
// 	{abbr: 'CRM', tr: ''},
// 	{abbr: 'CRMD', tr: ''},
// 	{abbr: 'DK', tr: ''},
// 	{abbr: 'DECORT', tr: ''},
// 	{abbr: 'DEHYD', tr: ''},
// 	{abbr: 'DSSRT', tr: ''},
// 	{abbr: 'DIL', tr: ''},
// 	{abbr: 'DOM', tr: ''},
// 	{abbr: 'DRND', tr: ''},
// 	{abbr: 'DRSNG', tr: ''},
// 	{abbr: 'DRK', tr: ''},
// 	{abbr: 'DRUMSTK', tr: ''},
// 	{abbr: 'ENG', tr: ''},
// 	{abbr: 'ENR', tr: ''},
// 	{abbr: 'EQ', tr: ''},
// 	{abbr: 'EVAP', tr: ''},
// 	{abbr: 'XCPT', tr: ''},
// 	{abbr: 'EX', tr: ''},
// 	{abbr: 'FLANKSTK', tr: ''},
// 	{abbr: 'FLAV', tr: ''},
// 	{abbr: 'FLR', tr: ''},
// 	{abbr: 'FD', tr: ''},
// 	{abbr: 'FORT', tr: ''},
// 	{abbr: 'FRENCH FR', tr: ''},
// 	{abbr: 'FRENCH FR', tr: ''},
// 	{abbr: 'FRSH', tr: ''},
// 	{abbr: 'FRSTD', tr: ''},
// 	{abbr: 'FRSTNG', tr: ''},
// 	{abbr: 'FRZ', tr: ''},
// 	{abbr: 'GRDS', tr: ''},
// 	{abbr: 'GM', tr: ''},
//
// 	{abbr: 'GRN', tr: ''},
// 	{abbr: 'GRNS', tr: ''},
// 	{abbr: 'HTD', tr: ''},
// 	{abbr: 'HVY', tr: ''},
// 	{abbr: 'HI-MT', tr: ''},
// 	{abbr: 'HI', tr: ''},
// 	{abbr: 'HR', tr: ''},
// 	{abbr: 'HYDR', tr: ''},
// 	{abbr: 'IMITN', tr: ''},
// 	{abbr: 'IMMAT', tr: ''},
// 	{abbr: 'IMP', tr: ''},
// 	{abbr: 'INCL', tr: ''},
// 	{abbr: 'INCL', tr: ''},
// 	{abbr: 'INF FORMULA', tr: ''},
// 	{abbr: 'ING', tr: ''},
// 	{abbr: 'INST', tr: ''},
// 	{abbr: 'JUC', tr: ''},
// 	{abbr: 'JR', tr: ''},
// 	{abbr: 'KRNLS', tr: ''},
// 	{abbr: 'LRG', tr: ''},
// 	{abbr: 'LN', tr: ''},
// 	{abbr: 'LN', tr: ''},
// 	{abbr: 'LVND', tr: ''},
// 	{abbr: 'LT', tr: ''},
// 	{abbr: 'LIQ', tr: ''},
// 	{abbr: 'LO', tr: ''},
// 	{abbr: 'LOFAT', tr: ''},
// 	{abbr: 'MARSHMLLW', tr: ''},
// 	{abbr: 'MSHD', tr: ''},
// 	{abbr: 'MAYO', tr: ''},
// 	{abbr: 'MED', tr: ''},
// 	{abbr: 'MESQ', tr: ''},
// 	{abbr: 'MIN', tr: ''},
// 	{abbr: 'MXD', tr: ''},
// 	{abbr: 'MOIST', tr: ''},
// 	{abbr: 'NAT', tr: ''},
// 	{abbr: 'NZ', tr: ''},
// 	{abbr: 'NONCARB', tr: ''},
// 	{abbr: 'NFDM', tr: ''},
// 	{abbr: 'NFDMS', tr: ''},
// 	{abbr: 'NFMS', tr: ''},
// 	{abbr: 'NFS', tr: ''},
// 	{abbr: 'NUTR', tr: ''},
// 	{abbr: 'NUTR', tr: ''},
// 	{abbr: 'OZ', tr: ''},
// 	{abbr: 'PK', tr: ''},
// 	{abbr: 'PAR FR', tr: ''},
// 	{abbr: 'PARBLD', tr: ''},
// 	{abbr: 'PART', tr: ''},
// 	{abbr: 'PART', tr: ''},
// 	{abbr: 'PAR FR', tr: ''},
// 	{abbr: 'PAST', tr: ''},
// 	{abbr: 'PNUT', tr: ''},
// 	{abbr: 'PNUTS', tr: ''},
// 	{abbr: 'PO4', tr: ''},
// 	{abbr: 'P', tr: ''},
// 	{abbr: 'PNAPPL', tr: ''},
// 	{abbr: 'PLN', tr: ''},
// 	{abbr: 'PRTRHS', tr: ''},
// 	{abbr: 'K', tr: ''},
// 	{abbr: 'PDR', tr: ''},
// 	{abbr: 'PDR', tr: ''},
// 	{abbr: 'PRECKD', tr: ''},
// 	{abbr: 'PREHTD', tr: ''},
// 	{abbr: 'PREP', tr: ''},
// 	{abbr: 'PROC', tr: ''},
// 	{abbr: 'PROD CD', tr: ''},
// 	{abbr: 'PROP', tr: ''},
// 	{abbr: 'PROT', tr: ''},
// 	{abbr: 'PUDD', tr: ''},
// 	{abbr: 'RTB', tr: ''},
// 	{abbr: 'RTC', tr: ''},
// 	{abbr: 'RTD', tr: ''},
// 	{abbr: 'RTE', tr: ''},
// 	{abbr: 'RTF', tr: ''},
// 	{abbr: 'RTH', tr: ''},
// 	{abbr: 'RTS', tr: ''},
// 	{abbr: 'RTU', tr: ''},
// 	{abbr: 'RECON', tr: ''},
// 	{abbr: 'RED', tr: ''},
// 	{abbr: 'RED-CAL', tr: ''},
// 	{abbr: 'REFR', tr: ''},
// 	{abbr: 'REG', tr: ''},
// 	{abbr: 'REHTD', tr: ''},
// 	{abbr: 'REPLCMNT', tr: ''},
// 	{abbr: 'REST-PREP', tr: ''},
// 	{abbr: 'RTL', tr: ''},
// 	{abbr: 'RST', tr: ''},
// 	{abbr: 'RSTD', tr: ''},
// 	{abbr: 'RND', tr: ''},
// 	{abbr: 'SNDWCH', tr: ''},
// 	{abbr: 'SAU', tr: ''},
// 	{abbr: 'SCALLPD', tr: ''},
// 	{abbr: 'SCRMBLD', tr: ''},
// 	{abbr: 'SD', tr: ''},
// 	{abbr: 'SEL', tr: ''},
// 	{abbr: 'SHK&SIRL', tr: ''},
// 	{abbr: 'SHRT', tr: ''},
// 	{abbr: 'SHLDR', tr: ''},
// 	{abbr: 'SIMMRD', tr: ''},
// 	{abbr: 'SKN', tr: ''},
// 	{abbr: 'SML', tr: ''},
// 	{abbr: 'NA', tr: ''},
// 	{abbr: 'SOL', tr: ''},
// 	{abbr: 'SOLN', tr: ''},
// 	{abbr: 'SOYBN', tr: ''},
// 	{abbr: 'SPL', tr: ''},
// 	{abbr: 'SP', tr: ''},
// 	{abbr: 'SPRD', tr: ''},
// 	{abbr: 'STD', tr: ''},
// 	{abbr: 'STMD', tr: ''},
// 	{abbr: 'STWD', tr: ''},
// 	{abbr: 'STK', tr: ''},
// 	{abbr: 'STKS', tr: ''},
// 	{abbr: 'STR', tr: ''},
// 	{abbr: 'SUB', tr: ''},
// 	{abbr: 'SMMR', tr: ''},
// 	{abbr: 'SUPP', tr: ''},
// 	{abbr: 'SWT', tr: ''},
// 	{abbr: 'SWTND', tr: ''},
// 	{abbr: 'SWTNR', tr: ''},
// 	{abbr: 'TSP', tr: ''},
// 	{abbr: '1000', tr: ''},
// 	{abbr: 'TSTD', tr: ''},
// 	{abbr: 'TODD', tr: ''},
// 	{abbr: 'UNCKD', tr: ''},
// 	{abbr: 'UNCRMD', tr: ''},
// 	{abbr: 'UNDIL', tr: ''},
// 	{abbr: 'UNENR', tr: ''},
// 	{abbr: 'UNHTD', tr: ''},
// 	{abbr: 'UNPREP', tr: ''},
// 	{abbr: 'UNSPEC', tr: ''},
// 	{abbr: 'UNSWTND', tr: ''},
// 	{abbr: 'VAR', tr: ''},
// 	{abbr: 'VEG', tr: ''},
// 	{abbr: 'VIT A', tr: ''},
// 	{abbr: 'VIT C', tr: ''},
// 	{abbr: 'H20', tr: ''},
// 	{abbr: 'WHTNR', tr: ''},
// 	{abbr: 'WHL', tr: ''},
// 	{abbr: 'WNTR', tr: ''},
// 	{abbr: 'W/', tr: ''},
// 	{abbr: 'WO/', tr: ''},
// 	{abbr: 'YEL', tr: ''},
// ]

function sleep(t: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, t)
	})
}

async function main() {
	const uniqueTokens: { token: string, tr?: string, usedIn?: string}[] = []

	/**
	 * Gather foods
	 * */
	const foods = await Food.findAll()

	for (let i = 0; i < foods.length; i++) {
		const food = foods[i]

		if (!food.additional_data.longDesc) continue
		uniqueTokens.push({
			token: food.additional_data.longDesc,
		})
		// food.full_desc.forEach((token: string) => {
		// 	// const abbr = ABBRS.find(p => p.abbr === token)
		// 	const prevAdded = uniqueTokens.find(p => p.token === token)
		// 	if (prevAdded) {
		// 		return
		// 	}
		// 	uniqueTokens.push({
		// 		token,
		// 		usedIn: food.full_desc,
		// 	})
		// })
	}


	let s = ''
	let ss: string[] = []
	uniqueTokens
		.map(p => p.token)
		.map(token => {
			if ((s.length + token.length) < 5000) {
				s = `${token}\n${s}`
			} else {
				ss.push(s)
				s = ''
			}
		})

	const {Translate} = require('@google-cloud/translate')
	const translate = new Translate({projectId: 'firebase-hampa'})
	// console.log('uniqueTokens', uniqueTokens)
	for (let i = 0; i < ss.length; i++) {
		let text = ss[i]
		console.log('x')
		await sleep(5000)
		console.log('x2')
		const [translation] = await translate.translate(text, {from: 'en', to: 'fa'})

		const splitTranslations = translation
			.split('\n')
		text
			.split('\n')
			.map((token, index) => {
				if (!token) return null
				const foundIndex = uniqueTokens.findIndex(p => {
					return p.token == token
				})
				if (foundIndex < 0) throw new Error('Something went wrong')

				uniqueTokens[foundIndex].tr = splitTranslations[index]
			})
	}

	uniqueTokens.sort(function (a, b) {
		if (a.token < b.token) return -1
		if (a.token > b.token) return 1
		return 0
	})

	fs.writeFileSync('uniqueTokens-2.json', JSON.stringify(uniqueTokens), 'utf8')


	/**
	 * Translate
	 * */

	/**
	 * Apply translation to farsi in foodtr
	 * */
}

main()
	.then(() => process.exit(0))
	.catch((e) => console.error(e))
