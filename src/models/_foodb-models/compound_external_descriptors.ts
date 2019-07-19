/*
 * compound_external_descriptors.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { compoundExternalDescriptorsAttribute, compoundExternalDescriptorsInstance } from './db'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<compoundExternalDescriptorsInstance, compoundExternalDescriptorsAttribute>('compoundExternalDescriptors', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'id'
		},
		externalId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'external_id'
		},
		annotations: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'annotations'
		},
		compoundId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'compounds',
				key: 'id'
			},
			field: 'compound_id'
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
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updated_at'
		}
	}, {
		tableName: 'compound_external_descriptors'
	})
}
