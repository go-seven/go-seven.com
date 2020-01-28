const assert = require('assert')
const fs = require('fs')

const { config, scripts, version } = require('./package.json')

const browserifyExclude = Object.keys(config.versions).map(lib => `-x ${lib.replace(/_/g, '-')}`).join(' ')
assert.strictEqual(browserifyExclude, config.browserify.exclude)

Object.keys(config.versions).forEach(libKey => {
  const packageName = libKey.replace(/_/g, '-')

  assert(typeof scripts[`browserify:shim:${packageName}`] === 'string')
  assert(typeof scripts[`get_js_libs:${packageName}`] === 'string')
  assert(typeof scripts[`postget_js_libs:${packageName}`] === 'string')
})

const libKeys = Object.keys(config.versions)

const linkToAppCss = `href="/css/app.v${version}.css"`
const linkToBundleJs = `src="/js/bundle.v${version}.js"`

fs.readFile('public/index.html', 'utf8', (error, code) => {
  if (error) {
    throw error
  }

  assert(code.includes(linkToAppCss))
  assert(code.includes(linkToBundleJs))

  libKeys.forEach(libKey => {
    const version = config.versions[libKey]
    const packageName = libKey.replace(/_/g, '-')

    const libPath = `/libs/${packageName}.v${version}.min.js`
    assert(code.includes(libPath), libPath)

    const shimPath = `libs/${packageName}.js`
    assert(code.includes(shimPath), shimPath)
  })
})

fs.readFile(`public/cache.v${version}.js`, 'utf8', (error, code) => {
  if (error) {
    throw error
  }

  libKeys.forEach(libKey => {
    const packageName = libKey.replace(/_/g, '-')

    const libPath = `/libs/${packageName}.v${config.versions[libKey]}.min.js`
    assert(code.includes(libPath), libPath)

    const shimPath = `libs/${packageName}.js`
    assert(code.includes(shimPath), shimPath)
  })
})
