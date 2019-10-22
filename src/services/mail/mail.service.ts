/*
 * mail.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { MailInput } from '@Types/mail'
import Config from '@Config'

const mailgun = require('mailgun-js')({ apiKey: Config.mail.apiKey, domain: Config.mail.domain, retry: 5 })

@Service()
export default class MailingService {
  async sendMail(recipients: MailInput[]) {

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
    const envelope = {
      from: `${Config.mail.senderName} <%recipient.senderAddress%@${Config.mail.senderDomain}>`,
      to: emailList,
      subject: '%recipient.subject%',
      html: '%recipient.template%',
      'recipient-variables': mailRecipients,
    }
    mailgun.messages().send(envelope)
  }
}
