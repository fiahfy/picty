export const breakpoints = [600, 960, 1280 - 16, 1920 - 16, Infinity]

export const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

export const getSizeIndex = () => {
  const w = window.innerWidth
  return breakpoints.findIndex((b) => {
    return w < b
  })
}

export const getSize = () => {
  return sizes[getSizeIndex()]
}
