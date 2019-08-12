/*
 * enzymes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { enzymesAttribute, enzymesInstance } from '@Types/food-database'
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<enzymesInstance, enzymesAttribute>('enzymes', {
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
    geneName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'gene_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    goClassification: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'go_classification'
    },
    generalFunction: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'general_function'
    },
    specificFunction: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'specific_function'
    },
    pathway: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pathway'
    },
    reaction: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reaction'
    },
    cellularLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cellular_location'
    },
    signals: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'signals'
    },
    transmembraneRegions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'transmembrane_regions'
    },
    molecularWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'molecular_weight'
    },
    theoreticalPi: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'theoretical_pi'
    },
    locus: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'locus'
    },
    chromosome: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'chromosome'
    },
    uniprotName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'uniprot_name'
    },
    uniprotId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      field: 'uniprot_id'
    },
    pdbId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
      field: 'pdb_id'
    },
    genbankProteinId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'genbank_protein_id'
    },
    genbankGeneId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'genbank_gene_id'
    },
    genecardId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'genecard_id'
    },
    genatlasId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'genatlas_id'
    },
    hgncId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'hgnc_id'
    },
    hprdId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'hprd_id'
    },
    organism: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'organism'
    },
    generalCitations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'general_citations'
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comments'
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
    tableName: 'enzymes'
  })
}
