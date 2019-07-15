/*
 * redis.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Redis from 'ioredis'
import config from '@config'

const redis = new Redis({
	host: config.redis.host,
	port: config.redis.port ? Number(config.redis.port) : undefined,
	password: config.redis.password,
})

export default redis
