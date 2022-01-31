// dependencies
import { useLayoutEffect, useReducer } from 'react'
import { initialWindowSizeState, windowSizeMiddleware } from '../store/WindowSize'
import { setSize } from '../store/WindowSize/actions'

export function useWindowSize() {
  const [windowSizeState, windowSizeDispatch] = useReducer(
    windowSizeMiddleware,
    initialWindowSizeState
  )

  useLayoutEffect(() => {
    const updateSize = () =>
      setSize(windowSizeDispatch, {
        width: window.innerWidth,
        height: window.innerHeight,
      })

    window.addEventListener('resize', updateSize)

    updateSize()

    return () => window.removeEventListener('resize', updateSize)

  }, [])

  return windowSizeState
}
