import './Wrapper.css'
import React from 'react'

export default function Wrapper(props) {
  const { properties, children } = props

  const mouseDown = (event) => {}

  return (
    <div className='sl__box'>
      <div className='sl__box__view'>
        <div
          className='sl__box__view__wrapper'
          onMouseDown={(event) => console.log(event)}
          onMouseMove={() => {}}
          onMouseLeave={() => {}}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
