import './Slide.css'

export default function Slide(props) {
  const { children } = props

  return <div className='sl__box__view__wrapper__slide'>{children}</div>
}
