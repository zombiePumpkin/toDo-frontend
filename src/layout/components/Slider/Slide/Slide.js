import './Slide.css'

export default function Slide(props) {
  const { properties, dispatch, children } = props

  const dragStart = (e) => {
    console.log('Start dragging the element')
    console.log(e)
  }

  return <div className='sl__box__view__wrapper__slide'>{children}</div>
}
