const fetch = require('node-fetch')
const config = require('./config')
const fs = require('fs')
const { promisify } = require('util')

const add = async argv => {
  argv._handled = true
  if (argv._.length !== 2) {
    throw new Error('Argument for add command must be one')
  }
  const name = argv._[1]
  const nameRegexp = new RegExp(name, 'i')

  const entriesResponse = await fetch(config.url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': config.ua,
    },
  })
  const entries = await entriesResponse.json()
  const matchedEntry = entries.find(content => {
    return content.name && content.name.match(nameRegexp)
  })
  if (!matchedEntry) {
    throw new Error(`.gitignore for '${name}' not found`)
  }
  const gitignoreURL = matchedEntry.download_url

  try {
    await promisify(fs.rename)('.gitignore', '.gitignore.bak')
    console.log(`Move .gitignore to .gitignore.bak`)
  } catch (err) {
    // throw an error if it is other than 'file not found'.
    if (err.code !== 'ENOENT') {
      throw new Error(err)
    }
  }

  console.log(`Download ${gitignoreURL} ...`)
  const gitignoreResponse = await fetch(gitignoreURL, {
    headers: { 'User-Agent': config.ua },
  })
  const gitignoreBuffer = await gitignoreResponse.buffer()

  try {
    await promisify(fs.writeFile)('.gitignore', gitignoreBuffer)
  } catch (err) {
    throw new Error('Failed to write .gitignore')
  }

  console.log('🗄  .gitignore has been added!')
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
