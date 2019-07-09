/*
 * food_group.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {foodGroupAttribute, foodGroupInstance} from './db'

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<foodGroupInstance, foodGroupAttribute>('food_groups', {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			unique: true,
			autoIncrement: true,
		},
		publicId: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
		},
		parentId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'parent_id'
		},
		origName: {
			type: DataTypes.STRING(120),
			allowNull: false,
			field: 'orig_name'
		},
		pictureFileName: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'picture_file_name'
		},
		pictureContentType: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'picture_content_type'
		},
		pictureFileSize: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'picture_file_size'
		},
		pictureUpdatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'picture_updated_at'
		},
	}, {
		tableName: 'food_groups',
		timestamps: false,
	})
}