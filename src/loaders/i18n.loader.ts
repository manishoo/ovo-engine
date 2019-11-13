/*
 * i18n.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import express from 'express'
import i18n from 'i18n'
import path from 'path'
import config from '@Config'


export default ({ app }: { app: express.Application }) => {
  i18n.configure({
    defaultLocale: config.defaultLocale,
    directory: path.join(__dirname, '/../../locales'),
    updateFiles: false,
  })
  app.use(i18n.init)
}
