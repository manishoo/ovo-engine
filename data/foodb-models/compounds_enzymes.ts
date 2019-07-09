/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {compoundsEnzymesInstance, compoundsEnzymesAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<compoundsEnzymesInstance, compoundsEnzymesAttribute>('compoundsEnzymes', {
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
    enzymeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'enzyme_id'
    },
    citations: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'citations'
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
    }
  }, {
    tableName: 'compounds_enzymes'
  });
};
