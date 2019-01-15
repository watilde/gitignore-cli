const fs = require('fs')
const fetch = require('node-fetch')
const { promisify } = require('util')
const config = require('./config')

const rename = promisify(fs.rename)

function fileStream(fileName, readStream) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(fileName)
    readStream.pipe(writeStream)
    readStream.on('error', reject)
    writeStream.on('finish', resolve)
  })
}

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
    await rename('.gitignore', '.gitignore.bak')
    console.log(`Move .gitignore to .gitignore.bak`)
  } catch (err) {
    // throw an error if it is other than 'file not found'.
    if (err.code !== 'ENOENT') {
      throw new Error(err)
    }
  }

  console.log(`Download ${gitignoreURL} ...`)
  try {
    const response = await fetch(gitignoreURL, {
      headers: { 'User-Agent': config.ua },
    })
    await fileStream('.gitignore', response.body)
  } catch (err) {
    throw new Error('Failed to download .gitignore: ' + err.message)
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
