/*
 * DATA_SRC.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { dataSrcAttribute, dataSrcInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<dataSrcInstance, dataSrcAttribute>('dataSrc', {
    dataSrcId: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: 'DataSrc_ID'
    },
    authors: {
      type: DataTypes.STRING(510),
      allowNull: true,
      field: 'Authors'
    },
    title: {
      type: DataTypes.STRING(510),
      allowNull: true,
      field: 'Title'
    },
    year: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'Year'
    },
    journal: {
      type: DataTypes.STRING(270),
      allowNull: true,
      field: 'Journal'
    },
    volCity: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: 'Vol_City'
    },
    issueState: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Issue_State'
    },
    startPage: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Start_Page'
    },
    endPage: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'End_Page'
    }
  }, {
    tableName: 'DATA_SRC'
  })
}
