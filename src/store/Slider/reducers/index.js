export default function sliderReducer(state, action) {
  switch (action.type) {
    case 'build':
      return {
        ...state,
        slideSize: action.payload.slideSize,
        windowSize: action.payload.windowSize,
        slideMargin: action.payload.slideMargin,
        slidesToShow: action.payload.slidesToShow,
        slidesToShift: action.payload.slidesToShift,
        showButtons: action.payload.showButtons,
        showPaging: action.payload.showPaging,
        isInfinite: action.payload.isInfinite,
        isLoaded: action.payload.isLoaded,
        breakpoints: [ ...action.payload.breakpoints ],
        status: action.payload.status
      }
    default:
      return state
  }
}
