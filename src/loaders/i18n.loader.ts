/*
 * i18n.loader.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import express from 'express'
import i18n from 'i18n'
import path from 'path'


export default async ({ app }: { app: express.Application }) => {
  i18n.configure({
    defaultLocale: 'en',
    directory: path.join(__dirname, '/../../../locales'),
    updateFiles: false,
  })
  app.use(i18n.init)
}
