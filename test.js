const assert = require('assert')
const fs = require('fs')

const pkg = require('./package.json')
const { version } = pkg

const browserifyExclude = Object.keys(pkg.config.versions).map(lib => `-x ${lib.replace(/_/g, '-')}`).join(' ')
assert.strictEqual(browserifyExclude, pkg.config.browserify.exclude)

Object.keys(pkg.config.versions).forEach(lib => {
  const packageName = lib.replace(/_/g, '-')

  assert(typeof pkg.scripts[`browserify:shim:${packageName}`] === 'string')
  assert(typeof pkg.scripts[`get_js_libs:${packageName}`] === 'string')
  assert(typeof pkg.scripts[`postget_js_libs:${packageName}`] === 'string')
})

const libPaths = Object.keys(pkg.config.versions).map(lib => {
  const version = pkg.config.versions[lib]

  return `/libs/${lib.replace(/_/g, '-')}.v${version}.min.js`
})

const linkToCssApp = `<link rel="stylesheet" href="/css/app.v${version}.css">`

fs.readFile('public/index.html', 'utf8', (error, html) => {
  if (error) {
    throw error
  }

  assert(html.includes(linkToCssApp))

  libPaths.forEach(libPath => assert(html.includes(libPath)))
})
