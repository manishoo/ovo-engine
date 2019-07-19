/*
 * LANGDESC.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { langdescAttribute, langdescInstance } from './db'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<langdescInstance, langdescAttribute>('langdesc', {
		factor: {
			type: DataTypes.STRING(12),
			allowNull: false,
			field: 'Factor'
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
			field: 'Description'
		}
	}, {
		tableName: 'LANGDESC'
	})
}
