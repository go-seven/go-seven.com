const { config, version } = require('../../package.json')

const CACHE_NAME = `go-seven-cache-v${version}`

const REQUIRED_FILES = [
  '/',
  `/js/bundle.v${version}.js`,
  `/js/cache.v${version}.js`,
  '/favicon.ico',
  '/fonts/lato-latin.css',
  '/fonts/Lato-Bold.woff2',
  '/fonts/Lato-Italic.woff2',
  '/fonts/Lato-Regular.woff2',
  '/libs/react.js',
  `/libs/react.v${config.versions.react}.min.js`,
  '/libs/react-dom.js',
  `/libs/react-dom.v${config.versions.react_dom}.min.js`,
  '/libs/react-router-dom.js',
  `/libs/react-router-dom.v${config.versions.react_router_dom}.min.js`,
  '/libs/redux.js',
  `/libs/redux.v${config.versions.redux}.min.js`,
  '/manifest.json',
  '/images/logo-16x16.png',
  '/images/logo-32x32.png',
  '/images/logo-96x96.png',
  '/images/logo-120x120.png',
  '/images/logo-144x144.png',
  '/images/logo-152x152.png',
  '/images/logo-180x180.png',
  '/images/logo-192x192.png',
  '/images/logo-256x256.png',
  '/images/logo-512x512.png',
  '/images/logo.svg',
  '/images/logotype.png',
  `/css/app.v${version}.css`
]

const cacheCode = `
const CACHE_NAME = '${CACHE_NAME}'
const REQUIRED_FILES = [${REQUIRED_FILES.map(filepath => `'${filepath}'`).join()}]

self.addEventListener('install', event => {
  event.waitUntil(async function () {
    const cache = await caches.open(CACHE_NAME)

    await cache.addAll(REQUIRED_FILES)
  }())
})

// Cache and update with stale-while-revalidate policy.
self.addEventListener('fetch', event => {
  const { request } = event

  // Prevent Chrome Developer Tools error:
  // Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
  //
  // See also https://stackoverflow.com/a/49719964/1217468
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  event.respondWith(async function () {
    const cache = await caches.open(CACHE_NAME)

    const cachedResponsePromise = await cache.match(request)
    const networkResponsePromise = fetch(request)

    // Whitelist only resources coming from app domain.
    if (request.url.startsWith(self.location.origin)) {
      event.waitUntil(async function () {
        const networkResponse = await networkResponsePromise

        await cache.put(request, networkResponse.clone())
      }())
    }

    return cachedResponsePromise || networkResponsePromise
  }())
})

// Clean up caches other than current.
self.addEventListener('activate', event => {
  event.waitUntil(async function () {
    const cacheNames = await caches.keys()

    await Promise.all(
      cacheNames.filter((cacheName) => {
        const deleteThisCache = cacheName !== CACHE_NAME

        return deleteThisCache
      }).map(cacheName => caches.delete(cacheName))
    )
  }())
})
`

console.log(cacheCode)
