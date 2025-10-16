export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'
import { js2xml, xml2js } from 'xml-js'

import { type CreditGrant, sendAsyncEvent } from '@mntn-dev/async-event-service'
import { MntnCredit } from '@mntn-dev/domain-types'
import { env } from '@mntn-dev/env'
import {
  BadRequestError,
  isBadRequestError,
  isNotFoundError,
} from '@mntn-dev/errors'
import { s } from '@mntn-dev/session'
import { asArray } from '@mntn-dev/utilities'

import { CreditsAPILogger } from '~/app/api/credits/logger'

import { strToDateWithEOD } from './str-to-date-with-eod'
import type { ParsedSoapEnvelope, SoapResponse } from './types'

const baseUrl = env.BASE_URL ?? 'https://marketplace.quickframe.com'

// SOAP Envelope template
const soapEnvelope = (body: Record<string, unknown>): SoapResponse => ({
  _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
  'soapenv:Envelope': {
    _attributes: {
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:tns': `${baseUrl}/credits`,
    },
    'soapenv:Body': body,
  },
})

const buildResponseXml = (Ack: boolean) =>
  js2xml(
    soapEnvelope({
      notificationsResponse: {
        Ack,
      },
    }),
    { compact: true, spaces: 2 }
  )

function findSoapBody(parsed: ParsedSoapEnvelope) {
  const envelopeKey = Object.keys(parsed).find(
    (k) => k.endsWith(':Envelope') || k === 'Envelope'
  )
  if (!envelopeKey) {
    throw new Error('Missing Envelope')
  }
  const envelope = parsed[envelopeKey]

  const bodyKey = Object.keys(envelope).find(
    (k) => k.endsWith(':Body') || k === 'Body'
  )
  if (!bodyKey) {
    throw new Error('Missing Body')
  }

  return envelope[bodyKey]
}

export const POST = async (request: NextRequest) => {
  try {
    CreditsAPILogger.info('POST /api/credits/soap - START', { request })

    // Get the raw XML from the request
    const xmlString = await request.text()
    CreditsAPILogger.info('POST /api/credits/soap - INPUT XML', { xmlString })

    // Convert XML to JavaScript object
    const result = xml2js(xmlString, { compact: true }) as ParsedSoapEnvelope
    CreditsAPILogger.info('POST /api/credits/soap - PARSED XML', { result })

    const soapBody = findSoapBody(result)
    CreditsAPILogger.info('POST /api/credits/soap - SOAP BODY', { soapBody })

    const notifications = asArray(soapBody.notifications.Notification)

    const grants: CreditGrant[] = notifications
      .map((notification) => {
        // Handle AddCredits operation
        const addCredits = notification.sObject
        CreditsAPILogger.info('POST /api/credits/soap - ADD CREDITS REQUEST', {
          addCredits,
        })

        const input = {
          financeEntityId: addCredits['sf:QFM_ID__c']?._text,
          amount: MntnCredit(
            Number(addCredits['sf:Total_Credits_Added__c']?._text)
          ),
          expirationDate: addCredits['sf:Expiration_Date__c']
            ? strToDateWithEOD(addCredits['sf:Expiration_Date__c']._text)
            : undefined,
          autoAddToPartnerProgram: true,
        }

        if (!input.financeEntityId) {
          throw new BadRequestError('QFM_ID__c is required', {
            code: 'missing_entityId',
          })
        }

        if (input.amount === undefined) {
          throw new BadRequestError('Total_Credits_Added__c is required', {
            code: 'missing_amount',
          })
        }

        return input
      })
      .filter((input) => input.amount !== 0)

    CreditsAPILogger.info('POST /api/credits/soap - ADD CREDITS INPUT', {
      grants,
    })

    await sendAsyncEvent(s.system, {
      topic: 'grant.credits',
      payload: { grants },
    })

    const responseXml = buildResponseXml(true)

    CreditsAPILogger.info('POST /api/credits/soap - SUCCESS', {
      responseXml,
    })

    return new NextResponse(responseXml, {
      status: StatusCodes.OK,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    CreditsAPILogger.error(`POST /api/credits/soap - ERROR: ${message}`, {
      error,
    })

    if (isBadRequestError(error)) {
      return new NextResponse(buildResponseXml(false), {
        status: StatusCodes.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
    }

    if (isNotFoundError(error)) {
      return new NextResponse(buildResponseXml(false), {
        status: StatusCodes.NOT_FOUND,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
    }

    return new NextResponse(buildResponseXml(false), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
