# Online matrix solver (matrixsolve.herokuapp.com)

## How to run

To run it from folder (in this archieve), just start [public/index.html](./public/index.html) by server

## Installation

To use it, just clone this repo and install the npm dependencies:

```shell
$ git clone https://github.com/zombiQWERTY/matrixsolver matrixsolver
$ cd matrixsolver
$ npm install
```

## Scripts

All scripts are run with `npm run [script]`, for example: `npm run test`. Maybe `sudo` required.

* `build` - generate a minified build to dist folder
* `dev` - start development server, try it by opening `http://localhost:8080/`
* `test` - run all unit tests
* `test:live` - continuously run unit tests watching for changes
* `e2e` - run e2e tests
* `e2e:live` - continuously run e2e tests watching for changes
* `ci` - run all e2e and unit tests
* `stats` - genetate stats.json file
* `clean` - clean public directory

See what each script does by looking at the `scripts` section in [package.json](./package.json).

## License

The license of this application is MIT.
