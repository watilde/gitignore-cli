const fetch = require('node-fetch')
const config = require('./config')
const fs = require('fs')

const add = argv => {
  argv._handled = true
  if (argv._.length !== 2) {
    throw new Error('Argument for add command must be one')
  }
  const name = argv._[1]
  const nameRegexp = new RegExp(name, 'i')

  fetch(config.url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': config.ua,
    },
  })
    .then(res => res.json())
    .then(contents => {
      const { gitignoreURL } = contents.find(content => {
        return content.name && content.name.match(nameRegexp)
      })

      try {
        fs.renameSync('.gitignore', '.gitignore.bak')
        console.log(`Move .gitignore to .gitignore.bak`)
      } catch (err) {
        // raise an error if it is other than 'file not found'.
        if (err.code !== 'ENOENT') {
          throw new Error(err)
        }
      }

      console.log(`Download ${gitignoreURL} ...`)
      return fetch(gitignoreURL, { headers: { 'User-Agent': config.ua } })
    })
    .then(res => res.buffer())
    .then(buf => {
      fs.writeFileSync('.gitignore', buf)
      console.log('🗄  .gitignore has been added!')
    })
    .catch(err => {
      throw new Error(err)
    })
}

module.exports = {
  command: 'add',
  describe: 'add a specified gitignore file',
  handler: add,
  aliases: ['a'],
  options: {
    only: {
      type: 'string',
    },
  },
}
