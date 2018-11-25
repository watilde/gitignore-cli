const path = require('path')
const exec = require('child_process').exec
const test = require('tap').test
const bin = path.join(__dirname, '..', 'bin', 'gitignore.js')

test((t) => {
  exec(`node ${bin} list`, (err, stdout, stderr) => {
    t.ifError(err, `add ran without error`)
    t.has(stdout, 'Node')
    t.end()
  })
})
