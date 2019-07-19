/*
 * utils.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import fs from 'fs'

export const processUpload = async (upload: any, name: string, location: string) => {
	const { createReadStream, filename, mimetype } = await upload
	const stream = createReadStream()
	const { path } = await storeFS({ stream, filename, name, location })
	return path.replace(`/${config.uploadUrl}`, '')
	// return storeDB({id, filename, mimetype, path})
}

function storeFS({ stream, filename, name, location }: { stream: any, filename: string, name: string, location: string }): Promise<{ path: string }> {
	const path = `${config.uploadUrl}/${location}/${name}.jpg`
	return new Promise((resolve, reject) =>
		stream
			.on('error', (error: any) => {
				if (stream.truncated)
				// Delete the truncated file.
					fs.unlinkSync(path)
				reject(error)
			})
			.pipe(fs.createWriteStream(path))
			.on('error', (error: any) => reject(error))
			.on('finish', () => resolve({ path }))
	)
}
