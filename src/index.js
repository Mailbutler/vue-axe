import axeCore from 'axe-core'
import debounce from 'lodash.debounce'
import merge from 'lodash.merge'
import { checkAndReport, resetCache } from './audit'
import { clear, draf } from './utils'

const defaultOptions = {
  auto: true,
  allowConsoleClears: true,
  clearConsoleOnUpdate: false,
  delay: 500,
  config: {
    branding: {
      application: 'vue-axe'
    }
  },
  runOptions: {
    reporter: 'v2',
    resultTypes: ['violations']
  },
  style: {
    head: 'padding:6px;font-size:20px;font-weight:bold;',
    boldCourier: 'font-weight:bold;font-family:Courier;',
    moderate: 'padding:2px 4px;border-radius:5px;background-color:#FFBA52;color:#222;font-weight:normal;',
    critical: 'padding:2px 4px;border-radius:5px;background-color:#AD0000;color:#fff;font-weight:normal;',
    serious: 'padding:2px 4px;border-radius:5px;background-color:#333;color:#FFCE85;font-weight:normal;',
    minor: 'padding:2px 4px;border-radius:5px;background-color:#333;color:#FFCE85;font-weight:normal;',
    title: 'font-color:black;font-weight:bold;',
    url: 'font-color:#4D4D4D;font-weight:normal;'
  },
  customInitialContext: document,
  plugins: []
}

export default function install (Vue, options) {
  // Browser only
  if (typeof window === 'undefined') return

  // merge options
  options = merge(defaultOptions, options)

  // set config
  axeCore.configure({ ...options.config })

  // register plugins
  options.plugins.forEach(plugin => axeCore.registerPlugin(plugin))

  // vue-axe methods in Vue Instance
  Vue.prototype.$axe = {
    run ({ clearConsole = options.clearConsoleOnUpdate, element, label } = {}) {
      clear(clearConsole, options)
      draf(() => checkAndReport(options, element, (label || 'Run manually')))
    },
    plugins: axeCore.plugins
  }

  // if false, disable automatic verification
  if (!options.auto) return

  const checkWithDebounce = debounce(function () {
    const componentsName = this.$options.name || ''
    resetCache()
    draf(() => checkAndReport(options, this.$el, componentsName))
  }, 1000, { maxWait: 5000 })

  // Rechecking when updating specific component
  Vue.mixin({
    updated () {
      checkWithDebounce.call(this)
    },
    // Used for change of route
    beforeDestroy () {
      clear(true, options)
    }
  })

  // First check
  setTimeout(() => draf(() => checkAndReport(options, options.customInitialContext, 'App')), options.delay)
}
