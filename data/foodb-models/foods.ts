/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {foodsInstance, foodsAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<foodsInstance, foodsAttribute>('foods', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'name'
    },
    nameScientific: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'name_scientific'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    itisId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'itis_id'
    },
    wikipediaId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'wikipedia_id'
    },
    pictureFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'picture_file_name'
    },
    pictureContentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'picture_content_type'
    },
    pictureFileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'picture_file_size'
    },
    pictureUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'picture_updated_at'
    },
    legacyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'legacy_id'
    },
    foodGroup: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'food_group'
    },
    foodSubgroup: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'food_subgroup'
    },
    foodType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'food_type'
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
    exportToAfcdb: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      field: 'export_to_afcdb'
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'category'
    },
    ncbiTaxonomyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'ncbi_taxonomy_id'
    },
    exportToFoodb: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1',
      field: 'export_to_foodb'
    }
  }, {
    tableName: 'foods'
  });
};
