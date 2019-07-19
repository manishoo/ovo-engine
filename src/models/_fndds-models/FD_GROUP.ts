/*
 * FD_GROUP.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { fdGroupAttribute, fdGroupInstance } from './db'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<fdGroupInstance, fdGroupAttribute>('fdGroup', {
		fdGrpCd: {
			type: DataTypes.STRING(8),
			allowNull: false,
			field: 'FdGrp_Cd',
			primaryKey: true,
		},
		fdGrpDesc: {
			type: DataTypes.STRING(120),
			allowNull: true,
			field: 'FdGrp_desc'
		}
	}, {
		tableName: 'FD_GROUP',
		timestamps: false,
	})
}
