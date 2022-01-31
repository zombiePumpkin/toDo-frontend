// style
import './Slider.css'

// components
import Slide from './Slide/Slide'
import Wrapper from './Wrapper/Wrapper'

// dependencies
import { useWindowSize } from '../../../hooks/useWindowSize'
import { useEffect, useReducer } from 'react'
import { initialSliderState, sliderMiddleware } from '../../../store/Slider'
import { resize } from '../../../store/Slider/actions'

export default function Slider() {
  const [sliderState, sliderDispatch] = useReducer(
    sliderMiddleware,
    initialSliderState
  )

  const [innerWidth] = useWindowSize()

  useEffect(() => {
    const options = [
      {
        slideSize: 190,
        slideMargin: 5,
        slidesToShow: 3,
        slidesToShif: 3,
        showButtons: false,
        showPaging: false,
        infinite: false,
        breakpoint: 900,
      },
    ]
      
    // Resize the slider main exhibition properties
    if (sliderState.windowSize !== innerWidth) {
      resize(sliderDispatch, options, innerWidth)
    }

    console.log(sliderState)

  }, [sliderState, innerWidth])

  return (
    <div className='sl'>
      <Wrapper properties={sliderState} dispatch={sliderDispatch}>
        <Slide properties={sliderState}>slider 01</Slide>
        <Slide properties={sliderState}>slider 02</Slide>
        <Slide properties={sliderState}>slider 03</Slide>
        <Slide properties={sliderState}>slider 04</Slide>
        <Slide properties={sliderState}>slider 05</Slide>
        <Slide properties={sliderState}>slider 06</Slide>
        <Slide properties={sliderState}>slider 07</Slide>
        <Slide properties={sliderState}>slider 08</Slide>
        <Slide properties={sliderState}>slider 09</Slide>
      </Wrapper>
    </div>
  )
}
