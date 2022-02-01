// Build the slider based on passed breakpoint
function build(dispatch, breakpoint) {
  return dispatch({
    type: 'build',
    payload: {
      slideSize: breakpoint.slideSize,
      slideMargin: breakpoint.slideMargin,
      slidesToShow: breakpoint.slidesToShow,
      slidesToShift: breakpoint.slidesToShift,
      slidesToLoad: breakpoint.slidesToLoad,
      showButtons: breakpoint.showButtons,
      showPaging: breakpoint.showPaging,
      isInfinite: breakpoint.isInfinite,
    },
  })
}

// Handle breakpoints in the page
export function resize(dispatch, breakpoints, windowSize) {
  if (breakpoints.length > 1) {
    breakpoints.forEach((item, index) => {
      if (
        breakpoints[index + 1] !== undefined &&
        item.breakpoint >= windowSize &&
        item.breakpoint < windowSize
      ) {
        const breakpoint = { ...item }
        build(dispatch, breakpoint)
      } else if (item.breakpoint >= windowSize && windowSize > 0) {
        const breakpoint = { ...item }
        build(dispatch, breakpoint)
      }
    })
  } else {
    breakpoints.push({
      slideSize: 190,
      slideMargin: 5,
      slidesToShow: 1,
      slidesToShif: 1,
      slidesToLoad: 9,
      showButtons: false,
      showPaging: false,
      infinite: false,
      breakpoint: 500,
    })

    resize(dispatch, breakpoints, windowSize)
  }
}

// Set the current width of the window size 
export function setWindowSize(dispatch, windowSize) {
  return dispatch({
    type: 'set_window_size',
    payload: { windowSize: windowSize },
  })
}

// Set all the breakpoints passed to slider params
export function setBreakpoints(dispatch, breakpoints) {
  return dispatch({
    type: 'set_breakpoints',
    payload: { breakpoints: breakpoints },
  })
}

// Set the slides length in the slider
export function setSlidesLength(dispatch, slidesLength) {
  return dispatch({
    type: 'set_slides_length',
    payload: { slidesLength: slidesLength },
  })
}
