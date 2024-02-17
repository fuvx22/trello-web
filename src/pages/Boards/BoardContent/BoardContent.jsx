import Box from '@mui/material/Box'
import ListColumns from './ListComlumns/ListColumns'
// import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './listComlumns/Column/Column'
import Card from './listComlumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInSameColumn,
  moveCardToDifColumn,
  deleteColumnDetails
}) {
  // Yêu cầu chuột di chuyển 10px mới kích hoạt event
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})

  const mouseSensor = useSensor(MouseSensor, {activationConstraint: {distance: 10}})

  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 100, tolerance: 500}})

  const sensor = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có 1 phần tử được kéo ( card of column)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [columnBeforeDrag, setColumnBeforeDrag] = useState(null)

  // Điểm va chạm cuối cùng trước đó
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Khởi tạo Function xử lý cập nhật lại state khi khi chuyển card giữa columns khác nhau
  const moveCardBtwDifCols = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí mà active card sắp được drop vào
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(col => col._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(col => col._id === overColumn._id)

      // column cũ
      if (nextActiveColumn) {
        // Xóa card ở colum cũ
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Thêm card giữ chỗ khi kéo card cuối cùng ra khỏi col để fix bug
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // cập nhật lại thứ tự của cards
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          {
            ...activeDraggingCardData,
            columnId: nextOverColumn._id
          })

        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

      }

      // Nếu function này đc gọi bằng handleDragEnd thì gọi API
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifColumn(
          activeDraggingCardId,
          columnBeforeDrag._id,
          nextOverColumn._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  // Trigger khi bắt đầu (drag) hành động kéo
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      // Nếu là kéo card thì mới set col của card đang đc kéo
      setColumnBeforeDrag(findColumnByCardId(event?.active.id))
    }
  }

  // Trigger trong quá trình kéo ( drag) phần từ
  const handleDragOver = (event) => {

    // Không làm gì khi drag column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const {active, over} = event

    if (!active || !over) return

    const { id: activeDraggingCardId, data:{current: activeDraggingCardData} } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBtwDifCols(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  // Trigger khi kết thúc (drop) hành động kéo
  const handleDragEnd = (event) => {

    const {active, over} = event


    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: overCardId } = over
      const { id: activeDraggingCardId, data:{current: activeDraggingCardData} } = active

      const overColumn = findColumnByCardId(overCardId)
      const activeColumn = findColumnByCardId(activeDraggingCardId)

      if (!activeColumn || !overColumn) return

      // Kéo card giữa 2 column khác nhau
      if (columnBeforeDrag._id !== overColumn._id) {
        moveCardBtwDifCols(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      }
      // Kéo card trong 1 column
      else {
        const oldCardIndex = columnBeforeDrag?.cards?.findIndex(c => c._id === activeDragItemId)

        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Kéo card trong 1 col tương tự kéo col trong board content
        const dndOrderedCards = arrayMove(columnBeforeDrag?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          targetColumn.cards = dndOrderedCards

          targetColumn.cardOrderIds = dndOrderedCardIds

          return nextColumns
        })
        // Call prop moveCardInSameColumn in the highest component to update state of board
        moveCardInSameColumn(dndOrderedCards, dndOrderedCardIds, columnBeforeDrag._id)
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (!over) return

      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)

        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // Dùng để xử lý gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

        // Gọi lên props moveColumn của thg cha cao nhất để update state của board
        // Sau này sử dụng Redux sẽ gọi tại đây luôn
        setOrderedColumns(dndOrderedColumns)

        moveColumns(dndOrderedColumns)

      }
    }


    // console.log('handleDragEnd: ',event)

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setColumnBeforeDrag(null)
  }

  const customDropAnimation = {
    sideEffects : defaultDropAnimationSideEffects({ styles: {active: {opacity: '0.5'}}})
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    const pointerIntersections = pointerWithin(args)

    // Nếu kéo ra khỏi khu vực kéo thả( mảng pointerIntersections == []) thì return luôn
    if (!pointerIntersections?.length) return

    // Cách fix cũ vẫn còn bug
    // const intersections = pointerIntersections?.length > 0
    //   ? pointerIntersections
    //   : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {

      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
        // console.log('overId after: ', overId)

      }

      lastOverId.current = overId
      return [{ id:overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensor}
      // Nếu dùng closetCorners thì sẽ bị bug khi kéo giữa 2 cols
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor:(theme) => (theme.palette.mode == 'dark' ? '#34495e': '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard = {createNewCard}
          deleteColumnDetails = {deleteColumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
