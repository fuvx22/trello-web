
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'

function App() {

  return (
    <>
      <div>Hello Phú Võ</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <br/>
      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
    </>
  )
}

export default App
