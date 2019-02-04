# go-seven.com

## JavaScript dependencies

Manage heavy JavaScript dependencies this way, in order to improve caching.

Get official production builds

```bash
wget https://unpkg.com/react@16.7.0/umd/react.production.min.js -O public/libs/react.v16.7.0.min.js
wget https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js -O public/libs/react-dom.v16.7.0.min.js
wget https://unpkg.com/react-router-dom@4.3.1/umd/react-router-dom.min.js -O public/libs/react-router-dom.v4.3.1.min.js
```

Build shims

```bash
npm run browserify:shim:react
npm run browserify:shim:react-dom
npm run browserify:shim:react-router-dom
```

Add related files to [public/cache.js], for instance

```javascript
const REQUIRED_FILES = [
// ...
  '/libs/react.js',
  '/libs/react.v16.7.0.min.js',
  '/libs/react-dom.js',
  '/libs/react-dom.v16.7.0.min.js',
  '/libs/react-router-dom.js',
  '/libs/react-router-dom.v4.3.1.min.js',
// ...
]
```

Add related files to [public/index.html], for instance

```html
    <script src="/libs/react.v16.7.0.min.js"></script>
    <script src="/libs/react-dom.v16.7.0.min.js"></script>
    <script src="/libs/react-router-dom.v4.3.1.min.js"></script>
    <!-- ... -->
    <script src="/libs/react.js"></script>
    <script src="/libs/react-dom.js"></script>
    <script src="/libs/react-router-dom.js"></script>
```

Remember to add them to excluded browserify package, for instance `-x react -x react-dom -x react-router-dom`.

