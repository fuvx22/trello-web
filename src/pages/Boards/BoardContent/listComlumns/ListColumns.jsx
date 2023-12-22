import Box from '@mui/material/Box'
import Comlumn from './Column/Column'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'


function ListColumns() {

  return (
    <Box sx={{
      bgcolor: 'inherit',
      width: '100%',
      height: '100%',
      display: 'flex',
      overflowX: 'auto',
      overflowY: 'hidden',
      '&::-webkit-scrollbar-track': {m:2}
    }}>
      <Comlumn></Comlumn>
      <Comlumn></Comlumn>
      <Comlumn></Comlumn>

      {/* Box Add new column */}
      <Box sx={{
        minWidth: '200px',
        maxWidth: '200px',
        mx: 2,
        borderRadius: '6px',
        height: 'fit-content',
        bgcolor: '#ffffff3d'
      }}>
        <Button
          startIcon={<AddIcon/>}
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.5,
            py: '8px'
          }}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns