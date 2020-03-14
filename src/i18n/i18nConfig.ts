import * as en from '../../public/i18n/en.json'
import * as it from '../../public/i18n/it.json'

const config = {
  en,
  it
}

export default function i18nConfig () {
  // Define user's language. Different browsers have the user locale defined
  // on different fields on the `navigator` object, so we make sure to account
  // for these different by checking all of them.
  const language = (navigator.languages && navigator.languages[0]) || navigator.language

  // Split locales with a region code
  const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]

  return {
    defaultLocale: 'en',
    ...config[languageWithoutRegionCode]
  }
}
