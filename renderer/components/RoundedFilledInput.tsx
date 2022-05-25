import { FilledInput } from '@mui/material'
import { styled, experimental_sx as sx } from '@mui/material/styles'

const RoundedFilledInput = styled(FilledInput)(
  sx({
    '&': {
      borderRadius: 4,
      '::after': {
        display: 'none',
      },
      '::before': {
        display: 'none',
      },
      '.MuiFilledInput-input': {
        py: 0.5,
        typography: 'body2',
      },
    },
  })
)

export default RoundedFilledInput
