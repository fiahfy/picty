export const breakpoints = [600, 960, 1264, 1904, Infinity]

export const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

export const colSizes = [6, 4, 3, 2, 2]

export const getSizeIndex = () => {
  const w = window.innerWidth
  return breakpoints.findIndex((b) => {
    return w < b
  })
}

export const getSize = () => {
  return sizes[getSizeIndex()]
}

export const getOffset = () => {
  return 12 / colSizes[getSizeIndex()]
}
