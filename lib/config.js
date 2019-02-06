const pkgJSON = require('../package.json')

module.exports = {
  ua: pkgJSON.name + '#' + pkgJSON.version,
  url: 'https://api.github.com/repos/github/gitignore/contents',
}
