# go-seven.com

## JavaScript dependencies

Heavy JavaScript dependencies are managed this way, in order to improve caching.

Get official production builds

```bash
npm run get_js_libs
```

Add related files to [public/cache.js](public/cache.js), for instance

```javascript
const REQUIRED_FILES = [
// ...
  '/libs/react.js',
  '/libs/react.v16.8.0.min.js',
  '/libs/react-dom.js',
  '/libs/react-dom.v16.8.0.min.js',
  '/libs/react-router-dom.js',
  '/libs/react-router-dom.v4.3.1.min.js',
// ...
]
```

Add related files to [public/index.html], for instance

```html
    <script src="/libs/react.v16.8.0.min.js"></script>
    <script src="/libs/react-dom.v16.8.0.min.js"></script>
    <script src="/libs/react-router-dom.v4.3.1.min.js"></script>
    <!-- ... -->
    <script src="/libs/react.js"></script>
    <script src="/libs/react-dom.js"></script>
    <script src="/libs/react-router-dom.js"></script>
```

Remember to add them to excluded browserify package, for instance `-x react -x react-dom -x react-router-dom`.

Running the command

```bash
npm run aws_s3_sync:public/libs
```

will upload them to S3 bucket with an aggressive cache (expiring in 2040 :)
