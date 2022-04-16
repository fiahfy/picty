import {
  Select,
  SelectProps,
  styled,
  experimental_sx as sx,
} from '@mui/material'

const RoundedFilledSelect = styled((props) => (
  <Select {...props} variant="filled" />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
))<SelectProps<any>>(
  sx({
    '&': {
      borderRadius: 4,
      '::after': {
        display: 'none',
      },
      '::before': {
        display: 'none',
      },
      '.MuiSelect-select': {
        py: 0.5,
        typography: 'body2',
      },
    },
  })
)

export default RoundedFilledSelect
