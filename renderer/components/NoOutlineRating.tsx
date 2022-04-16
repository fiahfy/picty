import { Rating, styled, experimental_sx as sx } from '@mui/material'

const NoOutlineRating = styled(Rating)(
  sx({
    '&': {
      '&.Mui-focusVisible': {
        '.MuiRating-iconActive': {
          outline: 'none',
        },
      },
      '.MuiRating-label': {
        outline: 'none',
      },
    },
  })
)

export default NoOutlineRating
