import {
  Select,
  SelectProps,
  experimental_sx as sx,
  styled,
} from '@mui/material'

const RoundedFilledSelect = styled((props) => (
  <Select {...props} variant="filled" />
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
