import no from 'not-defined'

import { CouldNotOpenIndexedDB } from '../clientErrors'

let databaseInstance

class UrlCollectionsDatabase {
  static dbName = 'UrlCollectionsDB'

  static dbVersion = 1

  open () {
    const { dbName, dbVersion } = UrlCollectionsDatabase

    return new Promise((resolve, reject) => {
      if ('indexedDB' in window) {
        const openRequest = indexedDB.open(dbName, dbVersion)

        openRequest.onerror = () => {
          reject(new CouldNotOpenIndexedDB(dbName, dbVersion))
        }

        openRequest.onsuccess = () => {
          const db = openRequest.result

          // The `versionchange` event triggers an open database object when
          // a parallel upgrade is attempted.
          // This can happen if user opens a tab with an open connection to a new
          // version of the database and then opens another tab before upgrade is completed.
          db.onversionchange = () => {
            db.close()

            // TODO should open popup to ask user to refresh page.
          }

          resolve(this)
        }

        openRequest.onupgradeneeded = () => {
          const db = openRequest.result

          switch (db.version) {
            case 1:
              db.createObjectStore('urlCollection', { autoIncrement: true })
          }
        }
      } else {
        reject(new CouldNotOpenIndexedDB(dbName, dbVersion))
      }
    })
  }
}

export function geUrlCollectionsDatabaseInstance () {
  return new Promise((resolve, reject) => {
    if (no(databaseInstance)) {
      databaseInstance = new UrlCollectionsDatabase()

      databaseInstance.open().then(resolve, reject)
    } else {
      resolve(databaseInstance)
    }
  })
}
