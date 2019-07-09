/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {referencesInstance, referencesAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<referencesInstance, referencesAttribute>('references', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    refType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'ref_type'
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'text'
    },
    pubmedId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'pubmed_id'
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'link'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'title'
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
    tableName: 'references'
  });
};
