import {
  Theme,
  ToggleButtonGroup,
  styled,
  experimental_sx as sx,
} from '@mui/material'

const FilledToggleButtonGroup = styled(ToggleButtonGroup)(
  sx({
    '.MuiToggleButtonGroup-grouped': {
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: (theme: Theme) => `${theme.shape.borderRadius}px`,
      },
      '&:first-of-type': {
        borderRadius: (theme: Theme) => `${theme.shape.borderRadius}px`,
        mr: 0.5,
      },
    },
  })
)

export default FilledToggleButtonGroup
