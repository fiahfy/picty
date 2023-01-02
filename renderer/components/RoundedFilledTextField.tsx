import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const RoundedFilledTextField = styled((props: TextFieldProps) => (
  <TextField {...props} variant="filled" />
))(({ theme }) =>
  theme.unstable_sx({
    '& .MuiFilledInput-root': {
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

export default RoundedFilledTextField
