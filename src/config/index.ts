/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import dotenv from 'dotenv'


dotenv.config()

export default {
  appUrl: process.env.APP_URL || '127.0.0.1',
  appPort: Number(process.env.APP_PORT),
  panelUrl: process.env.PANEL_URL || '127.0.0.1',
  panelPort: Number(process.env.PANEL_PORT),

  get appFullAddressForExternalUse() {
    return process.env.CORE_APP_ADDRESS || `http://${this.appUrl}:${this.appPort}`
  },

  graphQLPath: process.env.GRAPHQL_PATH || 'gql',
  graphQLPath_APP: process.env.GRAPHQL_PATH_APP || 'gql',
  graphQLPath_PANEL: process.env.GRAPHQL_PATH_PANEL || 'gql',

  bodyParserLimit: '1mb',
  bodyParserUrlEncoderLimit: '10mb',

  cosmicOceanAddress: process.env.COSMIC_OCEAN_ADDRESS || 'http://localhost:8000',
  coreNLPAddress: process.env.CORENLP_ADDRESS || 'http://localhost:9000',
  mongodb: {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    database: process.env.MONGO_DATABASE || 'solarys',
    user: process.env.MONGO_USER || '',
    pass: process.env.MONGO_PASS || ''
  },
  get mongodbConnection() {
    if (this.mongodb.user && this.mongodb.pass)
      return `mongodb://${this.mongodb.user}:${this.mongodb.pass}@${this.mongodb.host}:${this.mongodb.port}/${this.mongodb.database}?authSource=admin`
    else
      return `mongodb://${this.mongodb.host}:${this.mongodb.port}/${this.mongodb.database}`
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    db: process.env.MYSQL_DB || 'main',
    port: process.env.MYSQL_PORT || '3306',
    user: process.env.MYSQL_USER || 'root',
    pass: process.env.MYSQL_PASS || ''
  },
  mysqlConnection(db: string) {
    if (this.mysql.user && this.mysql.pass)
      return `mysql://${this.mysql.user}:${this.mysql.pass}@${this.mysql.host}:${this.mysql.port}/${db}`
    else
      return `mysql://${this.mysql.host}:${this.mysql.port}/${db}`
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
  times: {
    sessionExpiration: 3000,
    conversationExpiration: 3000,
    userTempDataExpiration: 3000,
  },
  constants: {
    assistantConversationKey: 'assistant:conversation',
    userTempStorageKey: 'user:registerDataTemp',
    defaultMacroNutrientRatio: {
      carb: 35,
      fat: 20,
      protein: 45,
    },
  },
  uploadUrl: 'uploads',
  imageUrl: process.env.IMAGE_URL || '127.0.0.1',

}
