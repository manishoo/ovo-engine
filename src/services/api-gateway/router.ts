/*
 * router.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Router } from 'express'

const router = Router()

router.get('/health-check', (req, res) => {
  res.sendStatus(200)
})

export default router
