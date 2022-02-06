import sliderReducer from './reducers'

const initialSliderState = {
  // exhibition properies
  slideSize: 0,
  slideMargin: 0,
  slidesToShow: 0,
  slidesToShift: 0,
  showButtons: false,
  showPaging: false,
  isInfinite: false,
  breakpoints: [],
  windowSize: 0,
  status: 'not-loaded',
  action: 'immobile',
  // wrapper position properties
  index: 0,
  posX1: 0,
  posX2: 0,
  startPos: 0,
  endPos: 0,
  leftPos: 0,
  limit: 50,
  allowShift: true,
  // slide amount properties
  slidesLength: 0,
  slidesToLoad: 9,
}

function sliderMiddleware(state, action) {
  return sliderReducer(state, action)
}

export { initialSliderState, sliderMiddleware }
