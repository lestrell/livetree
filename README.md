## [livetree](http://livetree.herokuapp.com/home)
Live-updating tree view web application

### TODO
* Add access logger
* Add JWT authentication
* Add [bunyan](https://github.com/trentm/node-bunyan) JSON logger
* Build a testing pipeline

### Frontend
* [Angular 6](https://angular.io/)
* [Angular Material](https://material.angular.io/)

### Server
* NodeJs
* [Socket.IO](https://socket.io/)
* Typescript
* Helmet

### Installation
The app is divided in two services: client and server. Right now, the server and the server are deployed together.

#### Server: ./
```bash
npm install
npm run start:local
npm test
```
#### Client: ./client
```bash
npm install
npm start
npm test
```

### Heroku
The app itself doesn't required any database. But it's configured to use Redis (RedisToGo) to persist the data.
In order to use a RedisDatabase, please provide this environment variable that look like this:\
```REDISTOGO_URL``` => ```redis://redistogo:44ec0bc04dd4a5afe77a649acee7a8f3@drum.redistogo.com:9092/```




### Scripts

```json
  {
    "scripts": {
      "start": "node ./dist/server.js",
      "build": "node ./node_modules/typescript/bin/tsc --project ./tsconfig.json",
      "start:local": "node ./node_modules/nodemon/bin/nodemon.js --watch ./src --exec ./node_modules/.bin/ts-node -- ./src/server.ts",
      "test": "mocha --reporter spec --compilers spec --compilers ts:ts-node/register \"src/**/*.spec.ts*\"",
      "test:redis": "mocha --reporter spec --compilers spec --compilers ts:ts-node/register \"src/services/redis/index.spec.ts*\"",
      "preinstall_": "npm install -g @angular/cli @angular/compiler-cli typescript",
      "postinstall": "npm run build && npm run setup --prefix=./client"
    }
  }
```
