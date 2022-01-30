// style
import './Slider.css'

// components
import Slide from './Slide/Slide'
import Wrapper from './Wrapper/Wrapper'

// dependencies
import {useWindowSize} from '../../../hooks/useWindowSize'
import { useEffect, useReducer } from 'react'
import { initialSliderState, sliderMiddleware } from '../../../store/Slider'

export default function Slider() {
  const [sliderState, sliderDispatch] = useReducer(
    sliderMiddleware,
    initialSliderState
  )

  const [width] = useWindowSize()

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
        breakpoint: 900
      } 
    ]

    if (!sliderState.isLoaded) {
      // sliderBuild
    }

    console.log(sliderState)

  }, [sliderState, width])

  return (
    <div className='sl'>
      <Wrapper properties={sliderState} dispatch={sliderDispatch}>
        <Slide properties={sliderState}>
          slider 01
        </Slide>
        <Slide properties={sliderState}>
          slider 02
        </Slide>
        <Slide properties={sliderState}>
          slider 03
        </Slide>
        <Slide properties={sliderState}>
          slider 04
        </Slide>
        <Slide properties={sliderState}>
          slider 05
        </Slide>
        <Slide properties={sliderState}>
          slider 06
        </Slide>
        <Slide properties={sliderState}>
          slider 07
        </Slide>
        <Slide properties={sliderState}>
          slider 08
        </Slide>
        <Slide properties={sliderState}>
          slider 09
        </Slide>
      </Wrapper>
    </div>
  )
}
