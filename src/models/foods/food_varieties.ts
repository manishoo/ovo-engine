/*
 * food_varieties.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */


import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { foodVarietyAttribute, foodVarietyInstance } from 'src/types/food-database'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<foodVarietyInstance, foodVarietyAttribute>('food_varieties', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		publicId: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			field: 'public_id',
		},
		origFoodName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'orig_food_name'
		},
		foodId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'food_id'
		},
		origFoodId: {
			type: DataTypes.STRING(255),
			field: 'orig_food_id'
		},
		origDb: {
			type: DataTypes.STRING(255),
			field: 'orig_db'
		},
		nutritionalData: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'nutritional_data'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'updated_at'
		},
		creatorId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'creator_id'
		},
		updaterId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'updater_id'
		},
	}, {
		tableName: 'food_varieties',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		paranoid: true,
		deletedAt: 'deleted_at'
	})
}
