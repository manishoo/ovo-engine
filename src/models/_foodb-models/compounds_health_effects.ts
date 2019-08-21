/*
 * compounds_health_effects.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { compoundsHealthEffectsAttribute, compoundsHealthEffectsInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<compoundsHealthEffectsInstance, compoundsHealthEffectsAttribute>('compoundsHealthEffects', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    compoundId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'compound_id'
    },
    healthEffectId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'health_effect_id'
    },
    origHealthEffectName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'orig_health_effect_name'
    },
    origCompoundName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'orig_compound_name'
    },
    origCitation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'orig_citation'
    },
    citation: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'citation'
    },
    citationType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'citation_type'
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
    tableName: 'compounds_health_effects'
  })
}
