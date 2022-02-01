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
    default:
      return state
  }
}
