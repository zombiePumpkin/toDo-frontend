// Set the action status of the slider
export function setAction(dispatch, action) {
  return dispatch({ type: 'set_action', payload: { action: action } })
}

// Set the start position before drag the wrapper
export function setStartPos(dispatch, startPos) {
  return dispatch({ type: 'set_start_pos', payload: { startPos: startPos } })
}

// Set the start position before drag the wrapper
export function setEndPos(dispatch, endPos) {
  return dispatch({ type: 'set_end_pos', payload: { endPos: endPos } })
}

export function setLeftPos(dispatch, leftPos) {
  return dispatch({ type: 'set_left_pos', payload: { leftPos: leftPos } })
}

// Set the start position of the mouse on the wrapper
export function setPosX1(dispatch, posX1) {
  return dispatch({ type: 'set_pos_x1', payload: { posX1: posX1 } })
}

// Set the start position of the mouse on the wrapper
export function setPosX2(dispatch, posX2) {
  return dispatch({ type: 'set_pos_x2', payload: { posX2: posX2 } })
}

// Event triggered on press the button
export function setMouseDown(dispatch, e) {
  setAction(dispatch, 'grabbing')
  setStartPos(dispatch, e.target.offsetLeft)
  setPosX1(dispatch, e.clientX)

  console.log('mouse down')
}

// Event triggered on move the mouse pressed around the screen
export function setMouseMove(dispatch, posX1, posX2, e) {
  const wrapper = e.currentTarget

  setPosX2(dispatch, posX1 - e.clientX)
  setPosX1(dispatch, e.clientX)

  setLeftPos(dispatch, wrapper.offsetLeft - posX2)

  console.log('mouse move')
}

// Event triggered when user release the mouse button
export function setMouseUp(dispatch, startPos, endPos, limit, e) {
  const wrapper = e.currentTarget

  setAction(dispatch, 'immobile')
  setEndPos(dispatch, wrapper.offsetLeft)

  if (endPos - startPos < -limit) {
    // shiftSlide(1, 'drag')
  } else if (endPos - startPos > limit) {
    // shiftSlide(-1, 'drag')
  } else {
    setLeftPos(dispatch, startPos)
  }
  
  console.log('mouse up')
}

// Event triggered when user move the mouse outside the wrapper
export function setMouseLeave(dispatch, e) {
  setAction(dispatch, 'immobile')
  
  console.log('mouse leave')
}
