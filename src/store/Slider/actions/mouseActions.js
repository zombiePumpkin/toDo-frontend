// Event triggered on press the button
const dragStart = event => {
  this.view.classList.add('grabbing');

  this.startPos = this.wrapper.offsetLeft;

  if (event.type === 'touchstart') {
    const touchStart = event;

    this.posX1 = touchStart.touches[0].clientX;
  } else if (event.type === 'mousedown') {
    const mouseDown = event;

    this.posX1 = mouseDown.clientX;
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', dragOut);
  }
}

// Event triggered on move the mouse pressed around the screen
const dragOut = event => {
  if (event.type === 'touchmove') {
    const touchMove = event;

    this.posX2 = this.posX1 - touchMove.touches[0].clientX;
    this.posX1 = touchMove.touches[0].clientX;
  } else if (event.type === 'mousemove') {
    const mouseMove = event;

    this.posX2 = this.posX1 - mouseMove.clientX;
    this.posX1 = mouseMove.clientX;
  }

  this.wrapper.style.left = (this.wrapper.offsetLeft - this.posX2) + 'px';
}

// Event triggered when user release the mouse button
const dragEnd = () => {
  this.view.classList.remove('grabbing');

  this.endPos = this.wrapper.offsetLeft;

  if (this.endPos - this.startPos < -this.limit) {
    this.shiftSlide(1, 'drag');
  } else if (this.endPos - this.startPos > this.limit) {
    this.shiftSlide(-1, 'drag');
  } else {
    this.wrapper.style.left = (this.startPos) + 'px';
  }

  document.removeEventListener('mouseup', dragEnd);
  document.removeEventListener('mousemove', dragOut);
}
