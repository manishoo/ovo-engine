/*
 * compound_synonyms.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {compoundSynonymsInstance, compoundSynonymsAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<compoundSynonymsInstance, compoundSynonymsAttribute>('compoundSynonyms', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    synonym: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'synonym'
    },
    synonymSource: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'synonym_source'
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
    sourceId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'source_id'
    },
    sourceType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'source_type'
    }
  }, {
    tableName: 'compound_synonyms'
  });
};
