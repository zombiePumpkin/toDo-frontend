import { windowSizeReducer } from './reducers'

const initialWindowSizeState = [0, 0]

function windowSizeMiddleware(state, action) {
  return windowSizeReducer(state, action)
}

export { initialWindowSizeState, windowSizeMiddleware }
