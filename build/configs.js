const path = require('path')
const { babel } = require('@rollup/plugin-babel')
const { uglify } = require('rollup-plugin-uglify')

const resolve = _path => path.resolve(__dirname, '../', _path)

const JSOptions = {
  umdDev: {
    input: resolve('src/index.js'),
    file: resolve('dist/videojs-danmaku.js'),
    format: 'umd'
  },
  umdPord: {
    input: resolve('src/index.js'),
    file: resolve('dist/videojs-danmaku.min.js'),
    format: 'umd',
    plugins: [uglify()]
  },
  esm: {
    input: resolve('src/index.js'),
    file: resolve('dist/videojs-danmaku.esm.js'),
    format: 'es'
  }
}

function genConfig (opt) {
  return {
    input: {
      input: opt.input,
      plugins: [ babel({ babelHelpers: 'bundled' }), ...(opt.plugins || []) ]
    },
    output: {
      file: opt.file,
      format: opt.format,
      name: 'videojs-danmaku'
    }
  }
}

function mapOpts (opts, fn) {
  return Object.keys(opts).map(key => {
    return fn(opts[key])
  })
}

module.exports = {
  js: mapOpts(JSOptions, genConfig)
}
