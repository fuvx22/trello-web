import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDiffColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'


function Board() {

  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Dùng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '65b10816588cda0a6b319303'


    fetchBoardDetailsAPI(boardId).then(board => {
      // Sắp xếp thứ tự columns trc khi đưa dữ liệu xuống
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        //Thêm FE-placeholder-card cho tất cả column không có card khi F5
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
        else {
        // Sắp xếp thứ tự cards trc khi đưa dữ liệu xuống
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // Gọi API column và update state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Thêm FE-placeholder-card cho column mới được tạo
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật state board
    // Phía front-end tự làm lại dữ liệu, không cần gọi về back-end
    const newBoard = {...board}
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    setBoard(newBoard)
  }

  // Gọi API card và update state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật state board
    const newBoard = {...board}
    const columnToUpdate = newBoard.columns.find(c => c._id === createdCard.columnId)

    if (columnToUpdate) {

      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
      else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }

    }
    setBoard(newBoard)
  }

  // Gọi API khi kéo thả column xong
  const moveColumns = (dndOrderedColumns) => {

    // Cập nhật state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = {...board}
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })

  }

  // Gọi API khi kéo thả card trong cùng một column
  const moveCardInSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {

    // Cập nhật state board
    const newBoard = {...board}
    const columnToUpdate = newBoard.columns.find(c => c._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    updateColumnDetailsAPI(columnId, { cardOrderIds : dndOrderedCardIds })
  }

  /*
  Khi kéo thả card sang column khác ta phải:
  B1: Cập nhật ( Xóa) card _id hiện tại khỏi mảng cardOrderIds của column ban đầu
  B2: Cập nhật card_id vào mảng mảng cardOrderIds của column đích
  B3: Cập nhật lại trường columnId của card
  */
  const moveCardToDifColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Cập nhật state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = {...board}
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds

    //Xủ lý vấn để nếu column rỗng có card placeholder thì cần xóa nó đi, gửi cho back-end mảng rỗng
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    // Gọi API xử lý phía back-end
    moveCardToDiffColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={ board }/>
      <BoardContent
        board= { board }
        createNewColumn= { createNewColumn }
        createNewCard= { createNewCard }
        moveColumns = { moveColumns }
        moveCardInSameColumn = { moveCardInSameColumn }
        moveCardToDifColumn = { moveCardToDifColumn }
      />
    </Container>
  )
}

export default Board
