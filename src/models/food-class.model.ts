/*
 * food-class.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { LanguageCode, Translation } from '@Types/common'
import { FOOD_CLASS_CATEGORY, FOOD_CLASS_TYPES, FoodClass, FoodClassTaxonomy } from '@Types/food-class'
import { FoodGroup } from '@Types/food-group'
import { instanceMethod, prop, Typegoose } from 'typegoose'


export class FoodClassSchema extends Typegoose implements FoodClass {
	readonly _id: mongoose.Schema.Types.ObjectId
	readonly id: string
	@prop({ required: true })
	name: Translation[]
	@prop()
	description?: Translation[]
	@prop({ required: true })
	slug: string
	@prop({ required: true })
	foodGroup: FoodGroup
	@prop({ enum: FOOD_CLASS_TYPES, required: true })
	foodType: FOOD_CLASS_TYPES
	@prop()
	origId: number
	@prop()
	nameScientific?: string
	@prop()
	itisId?: string
	@prop()
	wikipediaId?: string
	@prop({ enum: FOOD_CLASS_CATEGORY })
	category?: FOOD_CLASS_CATEGORY
	@prop()
	ncbiTaxonomyId?: number
	@prop()
	taxonomies: FoodClassTaxonomy[]

	@instanceMethod
	getName(locale: LanguageCode): string | undefined {
		const translation = this.name.find(p => p.locale === locale)

		if (!translation) return undefined

		return translation.text
	}

	@instanceMethod
	async addName(locale: LanguageCode, text: string) {
		this.name.push({
			locale,
			text,
		})
	}
}

export const FoodClassModel = new FoodClassSchema().getModelForClass(FoodClassSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'foodClasses',
	}
})
