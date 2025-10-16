import type { ElementCompact } from 'xml-js'

export type SoapResponse = {
  _declaration: { _attributes: { version: string; encoding: string } }
  'soapenv:Envelope': {
    _attributes: {
      'xmlns:soapenv': string
      'xmlns:xsi': string
      'xmlns:tns': string
    }
    'soapenv:Body': Record<string, unknown>
  }
}

export interface ParsedSoapEnvelope extends ElementCompact {
  'soapenv:Envelope': {
    'soapenv:Body': {
      notifications: {
        OrganizationId: { _text: string }
        ActionId: { _text: string }
        SessionId: { _text: string }
        EnterpriseUrl: { _text: string }
        PartnerUrl: { _text: string }
        Notification: {
          Id: { _text: string }
          sObject: {
            _attributes: { 'xsi:type': string }
            'sf:Id': { _text: string }
            'sf:QFM_ID__c': { _text: string }
            'sf:Total_Credits_Added__c': { _text: number }
            'sf:Type_of_Credit__c': { _text: string }
            'sf:Expiration_Date__c'?: { _text: string }
          }
        }
      }
    }
  }
}
