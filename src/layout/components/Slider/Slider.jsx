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
  resize,
  setWindowSize,
  setBreakpoints,
  setSlidesLength,
} from '../../../store/Slider/actions'

export default function Slider(props) {
  const [sliderState, sliderDispatch] = useReducer(
    sliderMiddleware,
    initialSliderState
  )

  const [windowSize] = useWindowSize()

  useEffect(() => {
    const breakpoints = [
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 3,
        slidesToShif: 3,
        slidesToLoad: 9,
        showButtons: false,
        showPaging: false,
        infinite: false,
        breakpoint: 900,
      },
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 2,
        slidesToShif: 2,
        slidesToLoad: 6,
        showButtons: false,
        showPaging: false,
        infinite: false,
        breakpoint: 500,
      },
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 1,
        slidesToShif: 1,
        slidesToLoad: 3,
        showButtons: false,
        showPaging: false,
        infinite: false,
        breakpoint: 300,
      },
    ]

    // Resize the slider main exhibition properties
    if (sliderState.windowSize !== windowSize) {
      resize(sliderDispatch, breakpoints, windowSize)
      setWindowSize(sliderDispatch, windowSize)
      setSlidesLength(sliderDispatch, props.children.length)

      if (!sliderState.breakpoints.length) {
        setBreakpoints(sliderDispatch, breakpoints)
      }
    }
  }, [sliderState, windowSize])

  return (
    <div className='sl'>
      <Wrapper properties={sliderState} dispatch={sliderDispatch}>
        {props.children &&
          props.children.map((e, i) => (
            <Slide key={i} properties={sliderState}>
              {e}
            </Slide>
          ))}
      </Wrapper>
    </div>
  )
}
