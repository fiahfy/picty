const orders = [
  'Shift',
  'CmdOrCtrl'
]

const win = process.platform === 'win32'

function sortKey (a, b) {
  a = orders.indexOf(a)
  b = orders.indexOf(b)
  a = a === -1 ? Infinity : a
  b = b === -1 ? Infinity : b
  if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  } else {
    return 0
  }
}

export function title (text, accelerator = '') {
  const keys = accelerator.split('+')
  if (!keys.length) {
    return text
  }
  const seperator = win ? '+' : ''
  const suffix = keys.sort(sortKey).map(key => {
    switch (key) {
      case 'Shift':
        return win ? 'Shift' : '⇧'
      case 'CmdOrCtrl':
        return win ? 'Ctrl' : '⌘'
      default:
        return key
    }
  }).join(seperator)
  return `${text} (${suffix})`
}
