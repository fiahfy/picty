import { FilledInput, styled } from '@mui/material'

const RoundedFilledInput = styled(FilledInput)({
  '&': {
    borderRadius: '40px',
    '::after': {
      display: 'none',
    },
    '::before': {
      display: 'none',
    },
  },
})

export default RoundedFilledInput
