const path = require('path')
const test = require('tap').test
const fs = require('fs-extra')
const tmp = path.join(__dirname, 'tmp')

test((t) => {
  fs.removeSync(path.join(tmp, '.gitignore'))
  fs.removeSync(path.join(tmp, '.gitignore.bak'))
  t.end()
})
