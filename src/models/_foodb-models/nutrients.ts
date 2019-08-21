/*
 * nutrients.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { nutrientsAttribute, nutrientsInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<nutrientsInstance, nutrientsAttribute>('nutrients', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    legacyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'legacy_id'
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'type'
    },
    publicId: {
      type: DataTypes.STRING(9),
      allowNull: false,
      unique: true,
      field: 'public_id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'name'
    },
    export: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'export'
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'state'
    },
    annotationQuality: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'annotation_quality'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    wikipediaId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'wikipedia_id'
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comments'
    },
    dfcId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'dfc_id'
    },
    dukeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'duke_id'
    },
    eafusId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'eafus_id'
    },
    dfcName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'dfc_name'
    },
    compoundSource: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'compound_source'
    },
    metabolism: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'metabolism'
    },
    synthesisCitations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'synthesis_citations'
    },
    generalCitations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'general_citations'
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
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    }
  }, {
    tableName: 'nutrients'
  })
}
