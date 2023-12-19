import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';


function Profile() {

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ p:0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt='Ngoc Phu'
            src='https://e1.pxfuel.com/desktop-wallpaper/574/448/desktop-wallpaper-gojo-satoru-on-dog-gojo-cute-thumbnail.jpg'
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile'
        }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{width:28, height: 28, mr: 2}}
            src='https://e1.pxfuel.com/desktop-wallpaper/574/448/desktop-wallpaper-gojo-satoru-on-dog-gojo-cute-thumbnail.jpg'
          /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar sx={{width:28, height: 28, mr: 2}} 
            src='https://e1.pxfuel.com/desktop-wallpaper/574/448/desktop-wallpaper-gojo-satoru-on-dog-gojo-cute-thumbnail.jpg'
          /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile