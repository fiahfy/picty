import { Theme, ToggleButtonGroup } from '@mui/material'
import { styled } from '@mui/material/styles'

const FilledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) =>
  theme.unstable_sx({
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
