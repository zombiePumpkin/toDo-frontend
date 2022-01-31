export function setSize(dispatch, windowSize) {
  const { width, height } = windowSize
  dispatch({ type: 'set_size', payload: { width: width, height: height } })
}
