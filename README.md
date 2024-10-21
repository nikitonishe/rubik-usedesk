# rubik-usedesk
Usedsk's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-usedesk
```

### yarn
```bash
yarn add rubik-usedesk
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const Usedesk = require('rubik-usedesk');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const tam = new Usedesk();

app.add([ config, tam ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`usedesk.js` config in configs volume may contain the host and token.

If you do not specify a host, then `https://api.usedesk.ru/` will be used by default.

If you don't specify a token, you will need to pass it.
```js
...
const response = await app.get('usedesk').me({ token });
...
```

You may need the host option if for some reason Usedesk host is not available from your server
and you want to configure a proxy server.


For example:
`config/usedesk.js`
```js
module.exports = {
  host: 'https://my.usedesk.proxy.example.com/'
};
```

## Extensions
Usedesk kubik doesn't has any extension.
