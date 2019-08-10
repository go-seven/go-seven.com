/* global localStorage, sessionStorage */
import {
  CHECK_AUTHENTICATION,
  CREATE_ACCOUNT,
  DELETE_ACCOUNT,
  ENTER_ACCOUNT,
  EXIT_ACCOUNT,
  SEND_PASSWORD_RESET,
} from "../reducers/account"

export default function localStorageMiddleware() {
   return (next) => (action) => {
     switch (action.type) {
       case CHECK_AUTHENTICATION:
         const accountId = localStorage.getItem("accountId") || ""
         const email = localStorage.getItem("email") || ""

         try {
           const storedAuthentication = localStorage.getItem("authentication")

           if (storedAuthentication) {
             const authentication = JSON.parse(storedAuthentication)

             const {
               expiresAt,
               token,
             } = authentication

             // Check if authentication has expired.
             if (expiresAt) {
               const now = new Date()

               const expireDate = new Date(expiresAt)

               const hasExpired = now.getTime() > expireDate.getTime()

               if (hasExpired) {
                 // Remove authentication if expired.
                 localStorage.removeItem("authentication")
               }

               return next({
                 ...action,
                 data: {
                   authentication: {
                     expiresAt,
                     hasExpired,
                     isValid: true,
                     token,
                   },
                   email,
                   id: accountId,
                 }
               })
             } else {
               // If there is no `expiresAt` attribute, assume it is expired.
               return next({
                 ...action,
                 data: {
                   authentication: {
                     hasExpired: true,
                     isValid: false,
                   },
                   email,
                   id: accountId,
                 }
               })
             }
           } else {
            return next({
              ...action,
              data: {
                authentication: {
                  isValid: false,
                },
                email,
              }
            })
           }
         } catch (ignore) {
           return next({
             ...action,
             data: {
               authentication: {
                 isValid: false,
               },
             }
           })
         }

         return next(action)

       case CREATE_ACCOUNT.SUCCESS:
         localStorage.setItem("accountId", action.data.accountId)
         localStorage.setItem("email", action.data.email)

         return next(action)

       case DELETE_ACCOUNT.SUCCESS:
         localStorage.removeItem("accountId")
         localStorage.removeItem("authentication")
         localStorage.removeItem("email")

         return next(action)

       case ENTER_ACCOUNT.SUCCESS:
         try {
           localStorage.setItem("accountId", action.data.id)
           localStorage.setItem("authentication", JSON.stringify(action.data.authentication))
           localStorage.setItem("email", action.data.email)
         } catch (ignore) {
           return next(action)
         }

         return next(action)

       case EXIT_ACCOUNT:
         localStorage.removeItem("accountId")
         localStorage.removeItem("authentication")

         sessionStorage.removeItem("session")

         return next(action)

       case SEND_PASSWORD_RESET.SUCCESS:
         localStorage.setItem("email", action.data.email)

         return next(action)

       default: return next(action)
     }
   }
}
