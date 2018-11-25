const request = require('request')
const config = require('./config')

const list = (argv) => {
  argv._handled = true
  request(config.url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': config.ua,
    }
  }, (e, res, body) => {
    if (e) throw new Error(e)
    const contents = JSON.parse(body)
    const list = []
    contents.forEach((content, index) => {
      if (!content.name) return
      if (content.name.indexOf('.gitignore') === -1) return
      list.push(content.name.split('.')[0])
    })
    console.log(list.join(', '))
  })
}

module.exports = {
  command: 'list',
  describe: 'List all gitignore files',
  handler: list,
  aliases: ['l']
}
