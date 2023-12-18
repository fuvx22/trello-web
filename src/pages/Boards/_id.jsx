import AppBar from '~/components/AppBar'
import Container from '@mui/material/Container'
import BoardBar from './BoardBar'
import BoardContent from './BoardContent'


function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar/>
      <BoardContent/>
    </Container>
  )
}

export default Board
