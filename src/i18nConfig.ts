import { addLocaleData } from "react-intl"
import * as localeDataEn from "react-intl/locale-data/en"
import * as localeDataIt from "react-intl/locale-data/it"

import * as localeConfigEn from "../public/i18n/en.json"
import * as localeConfigIt from "../public/i18n/it.json"

const locale = {
  config: {
    en: localeConfigEn,
    it: localeConfigIt,
  },
  data: {
    en: localeDataEn,
    it: localeDataIt,
  }
}

export default function i18nConfig() {
  // Define user's language. Different browsers have the user locale defined
  // on different fields on the `navigator` object, so we make sure to account
  // for these different by checking all of them
  const language = (navigator.languages && navigator.languages[0]) || navigator.language

  // Split locales with a region code
  const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]

  const localeConfig = locale.config[languageWithoutRegionCode] || localeConfigEn
  const localeData = locale.data[languageWithoutRegionCode] || localeDataEn

  addLocaleData(localeData)

  return localeConfig
}
