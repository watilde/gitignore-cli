const path = require('path')
const exec = require('child_process').exec
const test = require('tap').test
const fs = require('fs-extra')
const bin = path.join(__dirname, '..', 'bin', 'gitignore.js')
const tmp = path.join(__dirname, 'tmp')

test((t) => {
  exec(`node ${bin} add node`, {cwd: tmp}, (err, stdout, stderr) => {
    t.ifError(err, `add ran without error`)
    const files = fs.readdirSync(tmp)
    t.ok(files.includes('.gitignore'))
    t.end()
  })
})

test((t) => {
  exec(`node ${bin} add node`, {cwd: tmp}, (err, stdout, stderr) => {
    t.ifError(err, `add ran without error`)
    const files = fs.readdirSync(tmp)
    t.ok(files.includes('.gitignore.bak'))
    t.end()
  })
})
