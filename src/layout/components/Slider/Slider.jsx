// Style
import './Slider.css'

// Components
import Slide from './Slide/Slide'
import Wrapper from './Wrapper/Wrapper'

// Dependencies
import { useWindowSize } from '../../../hooks/useWindowSize'
import { useEffect, useReducer } from 'react'
import { initialSliderState, sliderMiddleware } from '../../../store/Slider'
import {
  setSliderSize,
  setWindowSize,
  setBreakpoints,
  setSlidesLength,
} from '../../../store/Slider/actions'

export default function Slider(props) {
  const { children } = props
  const [windowSize] = useWindowSize()
  const [sliderState, sliderDispatch] = useReducer(
    sliderMiddleware,
    initialSliderState
  )

  useEffect(() => {
    const breakpoints = [
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 3,
        slidesToShift: 3,
        slidesToLoad: 9,
        showButtons: false,
        showPaging: false,
        isInfinite: false,
        breakpoint: 9999,
      },
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 2,
        slidesToShift: 2,
        slidesToLoad: 6,
        showButtons: false,
        showPaging: false,
        isInfinite: false,
        breakpoint: 800,
      },
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 1,
        slidesToShift: 1,
        slidesToLoad: 3,
        showButtons: false,
        showPaging: false,
        isInfinite: false,
        breakpoint: 500,
      },
    ]

    if (sliderState.windowSize !== windowSize) {
      setSliderSize(sliderDispatch, breakpoints, windowSize)
      setWindowSize(sliderDispatch, windowSize)
      setSlidesLength(sliderDispatch, props.children.length)

      if (!sliderState.breakpoints.length) {
        setBreakpoints(sliderDispatch, breakpoints)
      }
    }
  }, [sliderState, windowSize])

  return (
    <div className='sl'>
      <Wrapper state={sliderState} dispatch={sliderDispatch}>
        {children && children.map((e, i) => <Slide key={i}>{e}</Slide>)}
      </Wrapper>
    </div>
  )
}
