/* global self, caches, fetch */
const { version } = require('../package.json')
const CACHE_NAME = `go-seven-cache-v${version}`

const REQUIRED_FILES = [
  '/',
  `/js/bundle.v${version}.js`,
  `/js/cache.v${version}.js`,
  '/favicon.ico',
  '/fonts/roboto-v18.css',
  '/fonts/KFOkCnqEu92Fr1Mu51xIIzI.woff2',
  '/fonts/KFOlCnqEu92Fr1MmWUlfBBc4.woff2',
  '/fonts/KFOmCnqEu92Fr1Mu4mxK.woff2',
  '/libs/react.js',
  '/libs/react.v16.8.2.min.js',
  '/libs/react-dom.js',
  '/libs/react-dom.v16.8.2.min.js',
  '/libs/react-router-dom.js',
  '/libs/react-router-dom.v4.3.1.min.js',
  '/manifest.json',
  '/media/logo-16x16.png',
  '/media/logo-32x32.png',
  '/media/logo-36x36.png',
  '/media/logo-48x48.png',
  '/media/logo-72x72.png',
  '/media/logo-96x96.png',
  '/media/logo-120x120.png',
  '/media/logo-128x128.png',
  '/media/logo-144x144.png',
  '/media/logo-152x152.png',
  '/media/logo-180x180.png',
  '/media/logo-192x192.png',
  '/media/logo-256x256.png',
  '/media/logo-512x512.png',
  '/media/logo.svg',
  '/style.css'
]

self.addEventListener('install', event => {
  event.waitUntil(async function () {
    const cache = await caches.open(CACHE_NAME)

    await cache.addAll(REQUIRED_FILES)
  }())
})

// Cache and update with stale-while-revalidate policy.
self.addEventListener('fetch', event => {
  event.respondWith(async function () {
    const cache = await caches.open(CACHE_NAME)

    const cachedResponsePromise = await cache.match(event.request)
    const networkResponsePromise = fetch(event.request)

    if (event.request.url.startsWith(self.location.origin)) {
      event.waitUntil(async function () {
        const networkResponse = await networkResponsePromise

        await cache.put(event.request, networkResponse.clone())
      }())
    }

    return cachedResponsePromise || networkResponsePromise
  }())
})

// Clean up caches other than current.
self.addEventListener('activate', event => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys()

    await Promise.all(
      cacheNames.filter((cacheName) => {
        const deleteThisCache = cacheName !== CACHE_NAME

        return deleteThisCache
      }).map(cacheName => caches.delete(cacheName))
    )
  }())
})
