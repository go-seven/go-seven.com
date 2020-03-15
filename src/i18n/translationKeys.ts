import * as api from '../api'

const translationKey = {
  error: {
    UnknownError: 'error.UnknownError'
  },
  page: {
    PasswordReset: {
      email: {
        errorMessage: {
          EmailNotFoundError: 'PasswordResetPage.email.EmailNotFoundError',
        },
        errorMessageByCode: (errorCode) => {
          switch (errorCode) {
            case api.error.EmailNotFoundError:
              return translationKey.page.PasswordReset.email.errorMessage.EmailNotFoundError
            default:
              return translationKey.error.UnknownError
          }
        }
      }
    }
  }
}

export default translationKey
