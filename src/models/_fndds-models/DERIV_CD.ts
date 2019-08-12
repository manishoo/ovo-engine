/*
 * DERIV_CD.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { derivCdAttribute, derivCdInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<derivCdInstance, derivCdAttribute>('derivCd', {
    derivCd: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'Deriv_Cd'
    },
    derivDesc: {
      type: DataTypes.STRING(240),
      allowNull: true,
      field: 'Deriv_Desc'
    }
  }, {
    tableName: 'DERIV_CD'
  })
}
