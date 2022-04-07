import { Rating, experimental_sx as sx, styled } from '@mui/material'

const ExplorerContentRating = styled(Rating)(
  sx({
    '.MuiRating-iconActive': {
      outline: 'none!important',
    },
  })
)

export default ExplorerContentRating
