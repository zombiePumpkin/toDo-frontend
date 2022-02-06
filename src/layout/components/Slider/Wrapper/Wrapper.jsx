// Styles
import './Wrapper.css'

// Dependencies
import {
  setMouseDown,
  setMouseMove,
  setMouseUp,
  setMouseLeave,
} from '../../../../store/Slider/actions'

export default function Wrapper(props) {
  const { state, dispatch, children } = props

  return (
    <div className='sl__box'>
      <div className={`sl__box__view ${state.action}`}>
        <div
          className='sl__box__view__wrapper'
          style={{ left: state.leftPos }}
          onMouseDown={(e) => {
            if (state.action === 'immobile') setMouseDown(dispatch, e)
          }}
          onMouseMove={(e) => {
            if (state.action === 'grabbing')
              setMouseMove(dispatch, state.posX1, state.posX2, e)
          }}
          onMouseUp={(e) => {
            if (state.action === 'grabbing')
              setMouseUp(dispatch, state.startPos, state.endPos, state.limit, e)
          }}
          onMouseLeave={(e) => {
            if (state.action === 'grabbing') setMouseLeave(dispatch, e)
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
