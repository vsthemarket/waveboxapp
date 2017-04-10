class DebugFlags {
  /* **************************************************************************/
  // Getters
  /* **************************************************************************/

  /**
  * Gets a flag value checking everything exists in the chain
  * @param key: the flag key
  * @param defaultValue: the default flag value
  */
  getValue (key, defaultValue = false) {
    if (!window.waveboxDebug) { return defaultValue }
    if (!window.waveboxDebug.flags) { return defaultValue }
    if (window.waveboxDebug.flags[key] === undefined) { return defaultValue }

    return window.waveboxDebug.flags[key]
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get slackLogUnreadCounts () { return this.getValue('slackLogUnreadCounts', false) }
}

module.exports = DebugFlags