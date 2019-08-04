/*
 * content.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from '@Config/connections/mongoose'
import { LANGUAGE_CODES, Translation } from '@Types/common'
import { Content, CONTENT_TYPE, Synonym } from '@Types/Content'
import { instanceMethod, prop, Typegoose } from 'typegoose'


export class ContentSchema extends Typegoose implements Content {
	_id: mongoose.Schema.Types.ObjectId
	id: string

	@prop({ enum: CONTENT_TYPE, required: true })
	type: CONTENT_TYPE
	@prop({ required: true })
	name: Translation[]

	@prop({ default: [] })
	synonyms: Synonym[]
	@prop({ default: [] })
	flavors: mongoose.Schema.Types.ObjectId[]
	@prop({ default: [] })
	healthEffects: mongoose.Schema.Types.ObjectId[]
	@prop({ default: [] })
	pathways: mongoose.Schema.Types.ObjectId[]
	@prop({ default: [] })
	enzymes: mongoose.Schema.Types.ObjectId[]

	@prop()
	origId?: number
	@prop()
	state?: string
	@prop()
	annotationQuality?: string
	@prop()
	description?: string
	@prop()
	casNumber?: string
	@prop()
	meltingPoint?: string
	@prop()
	proteinFormula?: string
	@prop()
	proteinWeight?: string
	@prop()
	experimentalSolubility?: string
	@prop()
	experimentalLogp?: string
	@prop()
	hydrophobicity?: string
	@prop()
	isoelectricPoint?: string
	@prop()
	metabolism?: string
	@prop()
	keggCompoundId?: string
	@prop()
	pubchemCompoundId?: string
	@prop()
	pubchemSubstanceId?: string
	@prop()
	chebiId?: string
	@prop()
	hetId?: string
	@prop()
	uniprotId?: string
	@prop()
	uniprotName?: string
	@prop()
	genbankId?: string
	@prop()
	wikipediaId?: string
	@prop()
	synthesisCitations?: string
	@prop()
	generalCitations?: string
	@prop()
	comments?: string
	@prop()
	proteinStructureFileName?: string
	@prop()
	proteinStructureContentType?: string
	@prop()
	proteinStructureFileSize?: number
	@prop()
	proteinStructureUpdatedAt?: Date
	@prop()
	msdsFileName?: string
	@prop()
	msdsContentType?: string
	@prop()
	msdsFileSize?: number
	@prop()
	msdsUpdatedAt?: Date
	@prop()
	phenolexplorerId?: number
	@prop()
	dfcId?: string
	@prop()
	hmdbId?: string
	@prop()
	dukeId?: string
	@prop()
	drugbankId?: string
	@prop()
	biggId?: number
	@prop()
	eafusId?: string
	@prop()
	knapsackId?: string
	@prop()
	boilingPoint?: string
	@prop()
	boilingPointReference?: string
	@prop()
	charge?: string
	@prop()
	chargeReference?: string
	@prop()
	density?: string
	@prop()
	densityReference?: string
	@prop()
	opticalRotation?: string
	@prop()
	opticalRotationReference?: string
	@prop()
	percentComposition?: string
	@prop()
	percentCompositionReference?: string
	@prop()
	physicalDescription?: string
	@prop()
	physicalDescriptionReference?: string
	@prop()
	refractiveIndex?: string
	@prop()
	refractiveIndexReference?: string
	@prop()
	uvIndex?: string
	@prop()
	uvIndexReference?: string
	@prop()
	experimentalPka?: string
	@prop()
	experimentalPkaReference?: string
	@prop()
	experimentalSolubilityReference?: string
	@prop()
	experimentalLogpReference?: string
	@prop()
	hydrophobicityReference?: string
	@prop()
	isoelectricPointReference?: string
	@prop()
	meltingPointReference?: string
	@prop()
	moldbAlogpsLogp?: string
	@prop()
	moldbLogp?: string
	@prop()
	moldbAlogpsLogs?: string
	@prop()
	moldbSmiles?: string
	@prop()
	moldbPka?: string
	@prop()
	moldbFormula?: string
	@prop()
	moldbAverageMass?: string
	@prop()
	moldbInchi?: string
	@prop()
	moldbMonoMass?: string
	@prop()
	moldbInchikey?: string
	@prop()
	moldbAlogpsSolubility?: string
	@prop()
	moldbId?: number
	@prop()
	moldbIupac?: string
	@prop()
	structureSource?: string
	@prop()
	duplicateId?: string
	@prop()
	oldDfcId?: string
	@prop()
	dfcName?: string
	@prop()
	compoundSource?: string
	@prop()
	flavornetId?: string
	@prop()
	goodscentId?: string
	@prop()
	superscentId?: string
	@prop()
	phenolexplorerMetaboliteId?: number
	@prop()
	kingdom?: string
	@prop()
	superklass?: string
	@prop()
	klass?: string
	@prop()
	subklass?: string
	@prop()
	directParent?: string
	@prop()
	molecularFramework?: string
	@prop()
	chemblId?: string
	@prop()
	chemspiderId?: string
	@prop()
	metaCycId?: string
	@prop()
	foodcomex?: number
	@prop()
	phytohubId?: string


	@instanceMethod
	getName(locale: LANGUAGE_CODES): string | undefined {
		const translation = this.name.find(p => p.locale === locale)

		if (!translation) return undefined

		return translation.text
	}

	@instanceMethod
	async addName(locale: LANGUAGE_CODES, text: string) {
		this.name.push({
			locale,
			text,
		})
	}
}


export const ContentModel = new ContentSchema().getModelForClass(ContentSchema, {
	existingMongoose: mongoose,
	schemaOptions: {
		collection: 'contents',
	}
})
