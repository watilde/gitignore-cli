#!/usr/bin/env node

const yargs = require('yargs')
const updateNotifier = require('update-notifier')
const commands = {
  add: require('../lib/add'),
  list: require('../lib/list')
}
const pkgJSON = require('../package.json')
const notifier = updateNotifier({pkg: pkgJSON})

if (notifier.update) {
  notifier.notify()
}

yargs.usage(pkgJSON.description)

yargs.help('help')
  .alias('help', 'h')

yargs.version(pkgJSON.version)
  .alias('version', 'v')
  .describe('version', 'Show version information')

Object.keys(commands).forEach((i) => {
  yargs.command(commands[i])
})

const argv = yargs.argv

if (!argv._handled) yargs.showHelp()
