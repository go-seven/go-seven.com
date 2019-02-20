const assert = require('assert')
const fs = require('fs')

const pkg = require('./package.json')
const { version } = pkg

const browserifyExclude = Object.keys(pkg.config.versions).map(lib => `-x ${lib}`).join(' ')
const linkToCssApp = `<link rel="stylesheet" href="css/app.v${version}.css">`

fs.readFile('public/index.html', 'utf8', (error, html) => {
  assert(html.includes(linkToCssApp))

  assert.equal(browserifyExclude, pkg.config.browserify.exclude)
})

