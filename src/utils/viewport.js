const BREAKPOINTS = [600, 960, 1280 - 16, 1920 - 16, Infinity]

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

const getSizeIndex = () => {
  const w = window.innerWidth
  return BREAKPOINTS.findIndex((b) => {
    return w < b
  })
}

const getSize = () => {
  return SIZES[getSizeIndex()]
}

export default { BREAKPOINTS, SIZES, getSizeIndex, getSize }
