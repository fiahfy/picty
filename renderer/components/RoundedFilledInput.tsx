import { FilledInput, experimental_sx as sx, styled } from '@mui/material'

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