/*
 * db.tables.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// tslint:disable
import * as path from 'path'
import * as sequelize from 'sequelize'
import * as def from './db'


export interface ITables {
  dataSrc: def.dataSrcModel;
  derivCd: def.derivCdModel;
  fdGroup: def.fdGroupModel;
  datsrcln: def.datsrclnModel;
  foodDes: def.foodDesModel;
  langdesc: def.langdescModel;
  langual: def.langualModel;
  footnote: def.footnoteModel;
  nutData: def.nutDataModel;
  nutrDef: def.nutrDefModel;
  srcCd: def.srcCdModel;
  weight: def.weightModel;
}

export const getModels = function (seq: sequelize.Sequelize): ITables {
  const tables: ITables = {
    dataSrc: seq.import(path.join(__dirname, './DATA_SRC')),
    derivCd: seq.import(path.join(__dirname, './DERIV_CD')),
    fdGroup: seq.import(path.join(__dirname, './FD_GROUP')),
    datsrcln: seq.import(path.join(__dirname, './DATSRCLN')),
    foodDes: seq.import(path.join(__dirname, './FOOD_DES')),
    langdesc: seq.import(path.join(__dirname, './LANGDESC')),
    langual: seq.import(path.join(__dirname, './LANGUAL')),
    footnote: seq.import(path.join(__dirname, './FOOTNOTE')),
    nutData: seq.import(path.join(__dirname, './NUT_DATA')),
    nutrDef: seq.import(path.join(__dirname, './NUTR_DEF')),
    srcCd: seq.import(path.join(__dirname, './SRC_CD')),
    weight: seq.import(path.join(__dirname, './WEIGHT')),
  }
  return tables
}
