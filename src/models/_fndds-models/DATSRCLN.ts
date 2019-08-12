/*
 * DATSRCLN.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { datsrclnAttribute, datsrclnInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<datsrclnInstance, datsrclnAttribute>('datsrcln', {
    ndbNo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'NDB_No'
    },
    nutrNo: {
      type: DataTypes.STRING(6),
      allowNull: false,
      field: 'Nutr_No'
    },
    dataSrcId: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: 'DataSrc_ID'
    }
  }, {
    tableName: 'DATSRCLN'
  })
}
