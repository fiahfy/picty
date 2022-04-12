import { Rating, experimental_sx as sx, styled } from '@mui/material'

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
