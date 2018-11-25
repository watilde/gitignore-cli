const fetch = require('node-fetch')
const config = require('./config')

const list = argv => {
  argv._handled = true
  fetch(config.url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': config.ua,
    },
  })
    .then(res => res.json())
    .then(contents => {
      // filter out languages whose name contains not .gitignore
      const list = contents
        .filter(content => content.name && content.name.includes('.gitignore'))
        .map(content => content.name.split('.')[0])

      // list available languages
      console.log(list.join(', '))
    })
    .catch(err => {
      throw new Error(err)
    })
}

module.exports = {
  command: 'list',
  describe: 'List all gitignore files',
  handler: list,
  aliases: ['l'],
}
