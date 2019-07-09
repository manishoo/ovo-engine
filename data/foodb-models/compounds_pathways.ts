/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {compoundsPathwaysInstance, compoundsPathwaysAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<compoundsPathwaysInstance, compoundsPathwaysAttribute>('compoundsPathways', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
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
    pathwayId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'pathways',
        key: 'id'
      },
      field: 'pathway_id'
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
    tableName: 'compounds_pathways'
  });
};
