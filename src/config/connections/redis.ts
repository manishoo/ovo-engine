/*
 * redis.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import Redis from 'ioredis'

const redis = new Redis({
	host: config.redis.host,
	port: config.redis.port ? Number(config.redis.port) : undefined,
	password: config.redis.password,
})

export default redis
