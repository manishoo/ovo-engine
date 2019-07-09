/*
 * foodcomex_compound_providers.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {foodcomexCompoundProvidersInstance, foodcomexCompoundProvidersAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<foodcomexCompoundProvidersInstance, foodcomexCompoundProvidersAttribute>('foodcomexCompoundProviders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    foodcomexCompoundId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'foodcomex_compound_id'
    },
    providerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'provider_id'
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
    }
  }, {
    tableName: 'foodcomex_compound_providers'
  });
};
