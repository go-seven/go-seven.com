export class CouldNotOpenIndexedDB extends Error {
  /**
   * @param {String} dbName
   * @param {Number} dbVersion
   */
  constructor (dbName, dbVersion) {
    super(`Could not open indexedDB ${dbName} version ${dbVersion}`)
  }
}
