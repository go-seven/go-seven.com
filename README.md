# go-seven.com

## JavaScript dependencies

Heavy JavaScript dependencies are managed this way, in order to improve caching.

First of all, add version numbers to package config, for example

```json
  "config": {
    "versions": {
      "react": "16.8.0",
      "react-dom": "16.8.0"
    }
  },
```

Add related files to [public/cache.js](public/cache.js), for instance

```javascript
const REQUIRED_FILES = [
// ...
  '/libs/react.js',
  `/libs/react.v${pkg.config.versions.react}.min.js`,
  '/libs/react-dom.js',
  `/libs/react-dom.v${pkg.config.versions['react-dom']}.min.js`,
// ...
]
```

Add related files to [public/index.html], for instance

```html
    <script src="/libs/react.v16.8.0.min.js"></script>
    <script src="/libs/react-dom.v16.8.0.min.js"></script>
    <!-- ... -->
    <script src="/libs/react.js"></script>
    <script src="/libs/react-dom.js"></script>
```

Remember to add them to packages excluded by browserify, add something like this fo package config

```json
  "config": {
    "browserify": {
      "exclude": "-x react -x react-dom"
    }
  },
```

Also add npm scripts to fetch js dist, for example

```json
  "scripts": {
    "get_js_libs:react": "wget -N https://unpkg.com/react@${npm_package_config_versions_react}/umd/react.production.min.js -O public/libs/react.v${npm_package_config_versions_react}.min.js",
    "get_js_libs:react-dom": "wget -N https://unpkg.com/react-dom@${npm_package_config_versions_react-dom}/umd/react-dom.production.min.js -O public/libs/react-dom.v${npm_package_config_versions_react-dom}.min.js",

    "postget_js_libs:react": "npm run browserify:shim:react",
    "postget_js_libs:react-dom": "npm run browserify:shim:react-dom"
  }
```

Check for consistency running
assert(typeof pkg.scripts.)

```bash
npm test
```

Get official production builds

```bash
npm run get_js_libs
```

Running the command

```bash
npm run aws_s3_sync:public/libs
```

will upload them to S3 bucket with an aggressive cache (expiring in 2040 :)
