/*
 * get-locale-from-request.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { LanguageCode } from '@Types/common'
import { Request } from 'express'


export default function getLocaleFromRequest(req: Request) {
  const locale: LanguageCode = req.headers['accept-language'] as LanguageCode || config.defaultLocale

  const isLocaleSupported = !!config.supportedLanguages.find(p => p === locale)

  if (!isLocaleSupported) {
    return LanguageCode.en
  }

  return locale
}
