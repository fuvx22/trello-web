import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color:'white',
  bgcolor:'transparent',
  px: '5px',
  borderRadius: '4px',
  border: 'none',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover':{
    bgcolor: 'primary.50'
  },
  '.MuiSvgIcon-root': {color: 'white'}
}

function BoardBar({ board }) {


  return (
    <Box sx={{
      bgcolor:(theme) => (theme.palette.mode == 'dark' ? '#34495e': '#1976d2'),
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      px: 2
    }}>
      <Box sx={{display:'flex', alignItems:'center', gap:2}}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable/>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board.type)}
          clickable/>
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable/>
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable/>
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable/>
      </Box>
      <Box sx={{display:'flex', alignItems:'center', gap:2}}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon/>}
          sx={{
            color:'white',
            borderColor: 'white',
            '&:hover': {borderColor:'white'}
          }}
        >Invite</Button>
        <AvatarGroup
          max={6}
          total={10}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {bgcolor:'#a4b0be'}
            }
          }}
        >
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Ngoc Phu" src="" />
          </Tooltip>
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Agoc Phu" src="" />
          </Tooltip>
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Rgoc Phu" src="" />
          </Tooltip>
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Hgoc Phu" src="" />
          </Tooltip>
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Ygoc Phu" src="" />
          </Tooltip>
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Ogoc Phu" src="" />
          </Tooltip>
          <Tooltip title='ngoc phu vo'>
            <Avatar alt="Qgoc Phu" src="" />
          </Tooltip>
        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar
