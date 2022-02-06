export default function sliderReducer(state, action) {
  switch (action.type) {
    case 'build':
      return {
        ...state,
        slideSize: action.payload.slideSize,
        slideMargin: action.payload.slideMargin,
        slidesToShow: action.payload.slidesToShow,
        slidesToShift: action.payload.slidesToShift,
        slidesToLoad: action.payload.slidesToLoad,
        showButtons: action.payload.showButtons,
        showPaging: action.payload.showPaging,
        isInfinite: action.payload.isInfinite,
      }
    case 'set_window_size':
      return {
        ...state,
        windowSize: action.payload.windowSize,
      }
    case 'set_breakpoints':
      return {
        ...state,
        breakpoints: { ...action.payload.breakpoints },
      }
    case 'set_slides_length':
      return {
        ...state,
        slidesLength: action.payload.slidesLength,
      }
    case 'set_action':
      return {
        ...state,
        action: action.payload.action,
      }
    case 'set_start_pos':
      return {
        ...state,
        startPos: action.payload.startPos,
      }
    case 'set_end_pos':
      return {
        ...state,
        endPos: action.payload.endPos,
      }
    case 'set_left_pos':
      return {
        ...state,
        leftPos: action.payload.leftPos,
      }
    case 'set_pos_x1':
      return {
        ...state,
        posX1: action.payload.posX1,
      }
    case 'set_pos_x2':
      return {
        ...state,
        posX2: action.payload.posX2,
      }
    default:
      return state
  }
}
