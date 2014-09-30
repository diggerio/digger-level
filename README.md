digger-level
============

A [digger](https://github.com/diggerio) supplier that uses [level-path-index](https://github.com/binocarlos/level-path-index) and [leveldb](https://github.com/Level/level) for storage

## installation

```bash
$ npm install digger-level
```

## usage

```bash
var level = require('level');
var diggerserver = require('digger-server')
var diggerlevel = require('digger-level')

// create a new leveldb - this can also be a sub-level
var leveldb = level('/tmp/digger')

// create a level digger supplier
var supplier = diggerlevel(leveldb)

// create a digger server to mount our level supplier
var digger = diggerserver()

// mount the level supplier onto the server
digger.use(supplier)

// create a HTTP server to host it
var server = http.createServer(digger.handler())

server.listen(80)
```

## licence

MIT
