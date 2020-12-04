import { resetCache, resetLastNotification } from './audit'

export const draf = (cb) => requestAnimationFrame(() => requestAnimationFrame(cb))

export function clear (forceClear = false, options) {
  resetCache()
  if (forceClear || options.clearConsoleOnUpdate) {
    resetLastNotification()
    if (options.allowConsoleClears) {
      console.clear()
    }
  }
}
