'use strict'

function conditionNodeVersion (pluginConfig, config, callback) {
  pluginConfig = pluginConfig || {}
  config = config || {}

  function isVerbose () {
    return pluginConfig.verbose ||
      pluginConfig.debug ||
      config.verbose ||
      config.debug
  }

  if (isVerbose()) {
    console.log('condition plugin config', pluginConfig)
    console.log('condition config environment', config.env)
    console.log('condition config options', config.options)
    console.log('node version', process.versions.node)
  }

  function fail (message) {
    return callback(new Error(message))
  }

  if (typeof pluginConfig.node !== 'string') {
    return fail('Missing node version in the config')
  }

  if (!/^6\./.test(process.versions.node) || /^darwin/.test(process.platform)) {
    return fail('Not publishing from Node ' + process.versions.node + ' on ' + process.platform)
  }

  console.log('Publishing from Node version', process.versions.node, process.platform)
  callback(null)
}

module.exports = conditionNodeVersion
