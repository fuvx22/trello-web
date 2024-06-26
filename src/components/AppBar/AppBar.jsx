import { useState } from 'react'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import WorkSpace from './Menu/WorkSpace'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profile from './Menu/Profile'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'


function AppBar() {

  const [searchValue, setSearchValue] = useState('')
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      px: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{display:'flex', alignItems:'center', gap:2}}>
        <AppsIcon sx={{color:'white'}}/>
        <Box sx={{display:'flex', alignItems:'center', gap:.5}}>
          <SvgIcon component={TrelloIcon} inheritViewBox fontSize='small' sx={{color:'white'}} ></SvgIcon>
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color:'white'}}>Trello</Typography>
        </Box>

        <Box sx={{display:{ xs: 'none', md: 'flex'}, gap: 1}}>
          <WorkSpace/>
          <Recent/>
          <Starred/>
          <Templates/>
        </Box>

        <Button
          sx={{
            color: 'white',
            border: 'note',
            '&:hover': {
              border: 'note'
            }
          }}
          variant=""
          startIcon={<LibraryAddIcon/>}
        >Create</Button>
      </Box>
      <Box sx={{display:'flex', alignItems:'center', gap:1.5}}>
        <TextField
          id="outlined-search"
          label="Search"
          type="text"
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment:(
              <InputAdornment position="start">
                <SearchIcon sx={{color:'white'}} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize='small'
                  sx={{color: searchValue ? 'white' : 'transparent', cursor:'pointer'}}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth:'120px',
            maxWidth: '180px',
            '& label': {color: 'white'},
            '& label.Mui-focused': {color: 'white'},
            '& input': {color: 'white'},
            '& .MuiOutlinedInput-root': {
              '& fieldset':{borderColor: 'white'},
              '&:hover fieldset': {borderColor: 'white'},
              '&.Mui-focused fieldset': {borderColor: 'white'}
            }
          }}
        />

        <ModeSelect/>

        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{cursor:'pointer'}}>
            <NotificationsNoneIcon sx={{color:'white'}}/>
          </Badge>
        </Tooltip>

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{cursor:'pointer', color:'white'}}/>
        </Tooltip>

        <Profile/>
      </Box>

    </Box>
  )
}

export default AppBar