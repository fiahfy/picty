import { Rating as MuiRating, styled } from '@mui/material'

const Rating = styled(MuiRating)(({ theme }) => ({
  '.MuiRating-iconActive': {
    outline: 'none!important',
  },
  '.MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '.MuiRating-iconHover': {
    color: theme.palette.primary.main,
  },
}))

export default Rating
