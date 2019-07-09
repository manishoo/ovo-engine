/*
 * kitchen-recipes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/*
// const rp = require('request-promise');
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import {Recipe} from '~/dao/models/recipe.model'
import RecipeRepo from '~/dao/repositories/recipe.repository'
import {Utensil} from '~/dao/models/utensil.model'
import {normalizeKR} from 'scripts/normalize-kr-recipes'
import * as fs from 'fs'

// throw new Error('Deprecated')

let allData = []

// fs.writeFileSync('myjsonfile.json', JSON.stringify([]), 'utf8');

async function run() {
	return puppeteer
		.launch({headless: true /!** , slowMo: 250 *!/})
		.then(async function (browser) {
			async function getListData() {
				return new Promise(async (resolve, reject) => {
					const url = encodeURI(`https://www.kitchenstories.com/en/recipes`)
					const page = await browser.newPage()

					await page.setRequestInterception(true)
					page.on('request', request => {
						if (request.resourceType() === 'image')
							request.abort()
						else
							request.continue()
					})
					await page.setExtraHTTPHeaders({Referer: 'https://www.domain.com/langdingpage'})
					await page.goto(url, {
						waitUntil: 'networkidle2'
					})
					const html = await page.content()
					const $ = cheerio.load(html)

					if ($('a.load-more-button')) {
						await page.click('a.load-more-button')
					}

					page.on('response', async res => {
						//filter out the requests we do not need, or when the request fails
						if (res.url().includes('https://www.kitchenstories.com/api/recipes') && res.ok) {
							//do with the json data, e.g:
							const data = await res.json()
							// no more data
							if (!data.data || data.data.length < 1) return
							//add data to a single array for later use
							allData.push(...data.data)
							process.stdout.write('.')
							//now you can trigger the next scroll
							try {
								await page.click('a.load-more-button')
							} catch (e) {
								console.log('Offloading to database')
								console.log(allData.length)
								if (allData.length === 0) return null
								let data = allData

								const recipes = []
								for (const item of data) {
									const normalized = await normalizeKR(item)

									if (normalized) {
										recipes.push(<Recipe>{
											...normalized,
											title: item.title,
											additionalData: item,
											yield: item.servings,
											utensils: item.utensils,
										})
									}
								}

								fs.writeFileSync('myjsonfile.json', JSON.stringify(recipes), 'utf8');
								await RecipeRepo.createMany(recipes)
								console.log('DONE ==========>')
							}
						}
					})
				})
			}

			await getListData()
		})
}

run()
	.then(() => {
		console.log('done')
		process.exit(0)
	})
	.catch(e => {
		console.error(e)
	})
*/
