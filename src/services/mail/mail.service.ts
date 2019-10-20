/*
 * mail.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { SendMail } from '@Types/mail'
import config from '@Config'

const mailgun = require('mailgun-js')({ apiKey: config.mail.apiKey, domain: config.mail.domain, retry: 5 })

@Service()
export default class MailingService {
  async sendMail(recipients: SendMail[]) {

    let emailList: string[] = []
    let mailRecipients: any = {}

    recipients.map(recipient => {
      mailRecipients[recipient.email] = {
        subject: recipient.subject,
        name: recipient.name,
        userId: recipient.userId,
        senderAddress: recipient.senderAddress,
        template: recipient.template,
      }
      emailList.push(recipient.email)
    })
    console.log('%recipient.template%')
    const envelope = {
      from: 'Prana <%recipient.senderAddress%@prana.global>',
      to: emailList,
      subject: '%recipient.subject%',
      html: '%recipient.template%',
      'recipient-variables': mailRecipients,
    }
    mailgun.messages().send(envelope)
  }
}
