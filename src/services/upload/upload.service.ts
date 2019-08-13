/*
 * upload.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import fs from 'fs-extra'
import { Service } from 'typedi'


@Service()
export default class UploadService {
  storeFS({ stream, filename, name, location }: { stream: any, filename: string, name: string, location: string }): Promise<{ path: string }> {
    const loc = `${config.uploadUrl}/${location}`
    const path = `${loc}/${name}.jpg`

    return new Promise((resolve, reject) =>
      fs.ensureDir(loc)
        .then(() => {
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
        })
        .catch(reject)
    )
  }

  async processUpload(upload: any, name: string, location: string): Promise<string> {
    const { createReadStream, filename, mimetype } = await upload
    const stream = createReadStream()
    const { path } = await this.storeFS({ stream, filename, name, location })
    return path.replace(`/${config.uploadUrl}`, '')
  }
}
