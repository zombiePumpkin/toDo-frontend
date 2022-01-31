function build(dispatch, options) {
  const  initialOption = options[0]

  return dispatch({
    type: 'build',
    payload: {
      slideSize: initialOption.slideSize,
      windowSize: window.innerWidth,
      slideMargin: initialOption.slideMargin,
      slidesToShow: initialOption.slidesToShow,
      slidesToShift: initialOption.slidesToShift,
      showButtons: initialOption.showButtons,
      showPaging: initialOption.showPaging,
      isInfinite: initialOption.isInfinite,
      isLoaded: initialOption.isLoaded,
      breakpoints: options,
    }
  })
}

// Handle breakpoints in the page
export function resize(dispatch, options, innerWidth) {
  handleBreakpoints: function () {
    if (this.breakpoints.length > 1) {
        for (var i = 0; i < this.breakpoints.length; i++) {
            if (this.breakpoints[i + 1] != undefined) {
                if (
                    window.innerWidth <= this.breakpoints[i].breakpoint &&
                    window.innerWidth > this.breakpoints[i + 1].breakpoint
                ) {
                    var breakpoint = JSON.parse(JSON.stringify(this.breakpoints[i]));
                    this.resizeSlider(breakpoint);
                }
            } else {
                if (
                    window.innerWidth <= this.breakpoints[i].breakpoint &&
                    window.innerWidth > 0
                ) {
                    var breakpoint = JSON.parse(JSON.stringify(this.breakpoints[i]));
                    this.resizeSlider(breakpoint);
                }
            }
        }
    } else {
        this.breakpoints.push({
            slidesToShow: 1,
            slidesToShift: 1,
            showButtons: this.showButtons,
            showPaging: this.showPaging,
            infinite: this.infinite,
            breakpoint: 500
        });

        this.handleBreakpoints();
    }
},
}
