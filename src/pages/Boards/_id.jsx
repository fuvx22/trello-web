import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'


function Board() {

  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Dùng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '65b10816588cda0a6b319303'

    fetchBoardDetailsAPI(boardId).then(board => {
      // console.log(board)
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={ board }/>
      <BoardContent board={ board }/>
    </Container>
  )
}

export default Board
