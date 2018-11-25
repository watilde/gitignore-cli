const request = require('request')
const config = require('./config')

const add = (argv) => {
  argv._handled = true
  if (argv._.length !== 2) {
    throw new Error('Argument for add command must be one')
  }
  const name = argv._[1]
  const reg = new RegExp(name, 'i')

  request(config.url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': config.ua,
    }
  }, (e, res, body) => {
    if (e) throw new Error(e)
    const contents = JSON.parse(body)
    let download_url = ''
    for (let i = 0; contents.length > i; i++) {
      const content = contents[i]
      if (!content.name) continue
      if (!content.name.match(reg)) continue
      download_url = content.download_url
      break
    }
    console.log(`mv .gitignore .gitignore.back && wget ${download_url} .gitignore`)
  })
}

module.exports = {
  command: 'add',
  describe: 'add a specified gitignore file',
  handler: add,
  aliases: ['a'],
  options: {
    only: {
      type: 'string'
    }
  }
}
