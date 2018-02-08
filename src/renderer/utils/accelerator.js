const orders = [
  'Shift',
  'CmdOrCtrl'
]

const win = process.platform !== 'darwin'

const sortKey = (a, b) => {
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

export const buildText = (accelerator) => {
  const keys = accelerator.split('+')
  const seperator = win ? '+' : ''
  return keys.sort(sortKey).map(key => {
    switch (key) {
      case 'Shift': return win ? key : '⇧'
      case 'CmdOrCtrl': return win ? 'Ctrl' : '⌘'
      case 'Up': return win ? key : '↑'
      case 'Down': return win ? key : '↓'
      case 'Left': return win ? key : '←'
      case 'Right': return win ? key : '→'
      case 'Enter': return win ? key : '↩'
      case 'Esc': return win ? key : '⎋'
      case 'Plus': return '+'
      default:
        return key
    }
  }).join(seperator)
}
