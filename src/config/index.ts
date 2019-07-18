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

	graphQLPath: process.env.GRAPHQL_PATH || 'gql',

	uploadUrl: 'uploads',

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
}