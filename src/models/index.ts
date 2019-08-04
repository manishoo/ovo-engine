/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import sequelize from '@Config/connections/sequelize'
import { getModels } from '@Models/_foods/food-database-tables'

export const models = getModels(sequelize)

const {
	CompoundSubstituent,
	CompoundExternalDescriptor,
	CompoundAlternateParent,
	CompoundSynonym,
	Compound,
	CompoundsEnzyme,
	CompoundsFlavor,
	CompoundsHealthEffect,
	CompoundsPathway,
	Content,
	Flavor,
	FoodTaxonomy,
	FoodcomexCompoundProvider,
	Enzyme,
	Food,
	// FoodTr,
	FoodGroup,
	// FoodGroupTr,
	Weight,
	// WeightTr,
	Translation,
	HealthEffect,
	FoodcomexCompound,
	Nutrient,
	Pathway,
	Reference,
	FoodVariety,
} = models

Food.belongsTo(FoodGroup, {
	foreignKey: 'foodGroupId',
	targetKey: 'id',
	as: 'foodGroup',
})
FoodGroup.hasMany(Food, {
	foreignKey: 'foodGroupId',
	sourceKey: 'id',
	as: 'foods',
})
FoodGroup.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
Food.hasMany(Content, {
	foreignKey: 'foodId',
	sourceKey: 'id',
	as: 'contents',
})
Food.hasMany(FoodTaxonomy, {
	foreignKey: 'foodId',
	sourceKey: 'id',
	as: 'taxonomies',
})
Food.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
Translation.belongsTo(Food, {
	foreignKey: 'sourceId',
	targetKey: 'id',
	as: 'food',
})
Translation.belongsTo(FoodVariety, {
	foreignKey: 'sourceId',
	targetKey: 'id',
	as: 'foodVariety',
})
FoodVariety.belongsTo(Food, {
	foreignKey: 'foodId',
	targetKey: 'id',
	as: 'food',
})
FoodVariety.hasMany(Weight, {
	foreignKey: 'foodVarietyId',
	sourceKey: 'id',
	as: 'weights',
})
FoodVariety.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
Weight.belongsTo(FoodVariety, {
	foreignKey: 'foodVarietyId',
	targetKey: 'id',
})
Weight.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
Content.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'origFoodId',
	as: 'translations',
})

export {
	CompoundSubstituent as CompoundSubstituentModel,
	CompoundExternalDescriptor as CompoundExternalDescriptorModel,
	CompoundAlternateParent as CompoundAlternateParentModel,
	CompoundSynonym as CompoundSynonymModel,
	Compound as CompoundModel,
	CompoundsEnzyme as CompoundsEnzymeModel,
	CompoundsFlavor as CompoundsFlavorModel,
	CompoundsHealthEffect as CompoundsHealthEffectModel,
	CompoundsPathway as CompoundsPathwayModel,
	Content as ContentModel,
	Flavor as FlavorModel,
	FoodTaxonomy as FoodTaxonomyModel,
	FoodcomexCompoundProvider as FoodcomexCompoundProviderModel,
	Enzyme as EnzymeModel,
	Food as FoodModel,
	// FoodTr,
	FoodGroup as FoodGroupModel,
	Translation as TranslationModel,
	// FoodGroupTr,
	Weight as WeightModel,
	// WeightTr,
	HealthEffect as HealthEffectModel,
	FoodcomexCompound as FoodcomexCompoundModel,
	Nutrient as NutrientModel,
	Pathway as PathwayModel,
	Reference as ReferenceModel,
	FoodVariety as FoodVarietyModel,
}
