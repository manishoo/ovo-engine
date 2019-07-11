/*
 * translate-recipes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/**
 * This script will fill the ingredients and instructions fields
 * of all the recipes in the database
 * */
import {Recipe, RecipeModel} from '../src/dao/models/recipe.model'

interface AdditionalData {
	id: any,
	content_id: any,
	difficulty: any,
	servings: any,
	preparation_time: any,
	baking_time: any,
	resting_time: any,
	calories: any,
	fat: any,
	protein: any,
	carbohydrate: any,
	date_created: any,
	date_modified: any,
	cell_image: any,
	detail_image: any,
	video: any,
	published_at: any,
	url: any,
	short_url: any,
	ingredients_count: any,
	type: any,
	comments_count: any,
	rating_count: any,
	like_count: any,
	rating: any,
	cookbook_count: any,
	utensils: any,
	ingredients: any,
	howto_videos: any,
	tags: any,
	partners: any,
	images_count: any,
	comments: any,
	images: any,
	steps: any,
	testimonial: any,
	resource_uri: any,
	title: any,
	slug: any,
	testimonial_author: any,
	testimonial_image: any,
	testimonial_link: any,
	blogger_article_id: any,
	instructionsRaw: any,
	instructions: any,
	ingredientsRaw: any,
}

async function main() {
	let count = 0
	let limit = 10000

	while (true) {
		const recipes = await RecipeModel.find({}).limit(limit).skip(count * limit).exec()

		if (recipes.length == 0) {
			console.log('done')
			process.exit(0)
		}

		for (let j = 0; j < recipes.length; j++) {
			const recipe = recipes[j]

			const additionalData = <AdditionalData>recipe.additionalData

			await RecipeModel.create(<Recipe>{
				title: additionalData.title,
				coverImage: {
					url: additionalData.cell_image.url,
					width: additionalData.cell_image.width,
					height: additionalData.cell_image.height,
					source: additionalData.cell_image.source,
					sourceUrl: additionalData.cell_image.source_link,
				},
				thumbnail: {
					url: additionalData.detail_image.url,
					width: additionalData.detail_image.width,
					height: additionalData.detail_image.height,
					source: additionalData.detail_image.source,
					sourceUrl: additionalData.detail_image.source_link,
				},
			})
		}

		count++
	}
}

main()
	.then(d => console.log('Done'))
	.catch(e => console.error(e))
