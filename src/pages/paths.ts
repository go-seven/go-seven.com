import { IUrlCollectionItemId } from '../model'

import route from '../routes'

export default {
  createAccount: () => route.createAccount,
  createUrl: () => route.createUrl,
  enter: () => route.enter,
  home: () => route.home,
  myUrls: () => route.myUrls,
  passwordReset: () => route.passwordReset,
  privacyPolicy: () => route.privacyPolicy,
  settings: () => route.settings,
  termsOfService: () => route.termsOfService,
  url: ({ urlCollectionId, urlId }: IUrlCollectionItemId) => route.url.replace(':urlCollectionId', urlCollectionId).replace(':urlId', urlId),
}
