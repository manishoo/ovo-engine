/*
 * healthCheckRouter.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import express from 'express'

export default ({ app }: { app: express.Application }) => {
	app.use('/ping', (req, res) => {
		res.sendStatus(200)
	})

	return app
}
