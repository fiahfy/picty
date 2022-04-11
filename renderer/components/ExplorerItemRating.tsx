import { Rating, experimental_sx as sx, styled } from '@mui/material'

const ExplorerItemRating = styled(Rating)(
  sx({
    '.MuiRating-iconActive': {
      outline: 'none!important',
    },
  })
)

export default ExplorerItemRating
