import { Rating } from '@mui/material'
import { styled, experimental_sx as sx } from '@mui/material/styles'

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
