import { ToggleButtonGroup, experimental_sx as sx, styled } from '@mui/material'

const FilledToggleButtonGroup = styled(ToggleButtonGroup)(
  sx({
    '.MuiToggleButtonGroup-grouped': {
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: (theme: any) => `${theme.shape.borderRadius}px`,
      },
      '&:first-of-type': {
        borderRadius: (theme: any) => `${theme.shape.borderRadius}px`,
        mr: 0.5,
      },
    },
  })
)

export default FilledToggleButtonGroup
