const DEFAULT_EXTENSIONS = [
  'BMP',
  'GIF',
  'ICO',
  'JPEG',
  'JPG',
  'PNG',
  'SVG',
  'TIF',
  'TIFF',
  'WEBP',
]

const PREVIEW_WIDTHS = {
  none: 0,
  narrow: 128,
  medium: 192,
  wide: 256,
}
const THUMBNAIL_HEIGHTS = {
  short: 128,
  medium: 192,
  tall: 256,
}

const THUMBNAIL_STYLES = ['cover', 'contain']

export default {
  DEFAULT_EXTENSIONS,
  PREVIEW_WIDTHS,
  THUMBNAIL_HEIGHTS,
  THUMBNAIL_STYLES,
}
