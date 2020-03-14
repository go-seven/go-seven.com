import * as client from './client'
import {
  IUrl,
  IUrlCollectionItemId,
  TDay,
  TEmail,
  THref,
  TMonth,
  TPassword,
  TUrlCollectionId,
  TUrlId,
  TUrlTitle,
} from './model'

interface ICredentials {
  email: TEmail
  password: TPassword
}

export interface IChangePasswordPayload {
  password: TPassword
}

export interface ICreateAccountPayload extends ICredentials {}

export interface IEmailVerificationPayload {
  email: TEmail
}

export interface IEnterAccountPayload extends ICredentials {}

export interface IResetPasswordPayload {
  email: TEmail
}

export interface ISendVerificationPayload {
  email: TEmail
}

export interface IUrlExistsEndpointParam {
  id: TUrlId
}

export interface IUrlCollectionEndpointParam {
  id: TUrlCollectionId
}

interface IUrlCollectionItemParam extends IUrlCollectionItemId {}

interface ICreateUrlCollectionItemPayload {
  urlCollectionId: TUrlCollectionId
  url: IUrl
}

interface IUpdateUrlCollectionItemParam extends IUrlCollectionItemId {}

interface IUpdateUrlCollectionItemPayload {
  title: TUrlTitle
}

interface IUrlDailyHitsEndpointParam {
  id: TUrlId
  day: TDay
}

interface IUrlMetadataQueryStringParam {
  href: THref
}

interface IUrlMonthlyHitsEndpointParam {
  id: TUrlId
  month: TMonth
}

const CollectionNotFoundError = 'CollectionNotFoundError'
const EmailExistsError = 'EmailExistsError'
const EmailNotFoundError = 'EmailNotFoundError'
const EmailNotVerifiedError = 'EmailNotVerifiedError'
const InvalidPasswordError = 'InvalidPasswordError'
const UrlIdIsAlreadyTakenError = 'UrlIdIsAlreadyTakenError'
const UrlDoesNotExistError = 'UrlDoesNotExistError'

export const error = {
  CollectionNotFoundError,
  EmailExistsError,
  EmailNotFoundError,
  EmailNotVerifiedError,
  InvalidPasswordError,
  UrlIdIsAlreadyTakenError,
  UrlDoesNotExistError,
}

export const endpoint = {
  account: () => '/account',
  changePassword: () => '/change-password',
  enter: () => '/enter',
  resetPassword: () => '/reset-password',
  // TODO rename endpoint to /email-verification
  sendVerification: () => '/send-verification',
  url: () => '/url',
  urlCollection: ({ id }: IUrlCollectionEndpointParam) => `/url-collection/${id}`,
  urlCollectionItem: ({ urlCollectionId, urlId }: IUrlCollectionItemParam) => `/url-collection/${urlCollectionId}/${urlId}`,
  urlDailyHits: ({ id, day }: IUrlDailyHitsEndpointParam) => `/url-daily-hits/${id}/${day}`,
  urlExists: ({ id }: IUrlExistsEndpointParam) => `/url-exists/${id}`,
  urlMetadata: ({ href }: IUrlMetadataQueryStringParam) => `/url-metadata?href=${encodeURIComponent(href)}`,
  urlMonthlyHits: ({ id, month }: IUrlMonthlyHitsEndpointParam) => `/url-monthly-hits/${id}/${month}`,
}

export default function (token?) {
  return {
    changePassword: ({ payload }: { payload: IChangePasswordPayload }) => (
      client.post(endpoint.changePassword(), payload, token)
    ),
    createAccount: ({ payload }: { payload: ICreateAccountPayload }) => (
      client.post(endpoint.account(), payload)
    ),
    createUrlCollectionItem: ({ payload }: { payload: ICreateUrlCollectionItemPayload }) => (
      client.post(endpoint.url(), payload)
    ),
    deleteAccount: () => (
      client.del(endpoint.account(), token)
    ),
    deleteUrlCollectionItem: ({ param }) => (
      client.del(endpoint.urlCollectionItem(param), token)
    ),
    enterAccount: ({ payload }: { payload: IEnterAccountPayload }) => (
      client.post(endpoint.enter(), payload)
    ),
    emailVerification: ({ payload }: { payload: IEmailVerificationPayload }) => (
      client.post(endpoint.sendVerification(), payload, token)
    ),
    resetPassword: ({ payload }: { payload: IResetPasswordPayload }) => (
      client.post(endpoint.resetPassword(), payload)
    ),
    updateUrlCollectionItem: (
      { param, payload }: {
        param: IUpdateUrlCollectionItemParam
        payload: IUpdateUrlCollectionItemPayload
      }) => (
      client.put(endpoint.urlCollectionItem(param), payload)
    ),
    urlCollection: ({ param }: { param: IUrlCollectionEndpointParam }) => (
      client.get(endpoint.urlCollection(param), token)
    ),
    urlExists: ({ param }: { param: IUrlExistsEndpointParam }) => (
      client.get(endpoint.urlExists(param), token)
    ),
    urlDailyHits: ({ param }: { param: IUrlDailyHitsEndpointParam }) => (
      client.get(endpoint.urlDailyHits(param), token)
    ),
    urlMetadata: ({ query }: { query: IUrlMetadataQueryStringParam }) => (
      client.get(endpoint.urlMetadata(query), token)
    ),
    urlMonthlyHits: ({ param }: { param: IUrlMonthlyHitsEndpointParam }) => (
      client.get(endpoint.urlMonthlyHits(param), token)
    ),
  }
}
