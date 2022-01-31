export function windowSizeReducer(state, action) {
  switch (action.type) {
    case 'set_size':
      return [ action.payload.width, action.payload.height ]
    default:
      return state
  }
}
