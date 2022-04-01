// @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/img
const imageExtensions = [
  // APNG
  'apng',
  // AVIF
  'avif',
  // GIF
  'gif',
  // JPEG
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  // PNG
  'png',
  // SVG
  'svg',
  // WebP
  'webp',
  // BMP
  'bmp',
  // ICO
  'ico',
  'cur',
  // TIFF
  // 'tif',
  // 'tiff',
]

export const isImageFile = (path: string) => {
  const extension = path.match(/\.([^.]+)$/)?.[1] ?? ''
  return imageExtensions.includes(extension)
}
