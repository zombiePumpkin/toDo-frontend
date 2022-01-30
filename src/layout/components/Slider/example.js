(function (yv, $, undefined) {
  "use strict";
  var njQuery;

  // Main class
yv.Slider = {
  // Slider config options
  slidesToShow: undefined,
  slidesToShift: 1,
  showButtons: undefined,
  showPaging: undefined,
  infinite: undefined,
  breakpoint: undefined,
  breakpoints: undefined,

  // Main slider elements
  container: undefined,
  view: undefined,
  wrapper: undefined,
  slides: undefined,

  // Initial slider position values
  index: 0,
  posX1: 0,
  posX2: 0,
  startPos: 0,
  endPos: 0,
  limit: 50,
  allowShift: true,

  // Initial slider element properties
  slideSize: 0,
  slidesLength: 0,
  slidesToLoad: 0,
  prev: undefined,
  next: undefined,
  paging: undefined,

  // Build the slider with the parameters
  build: function (options, sliderElements, slidesToLoad) {
      if (!options || !sliderElements) return;

      // Save all breakpoints
      this.breakpoints = JSON.parse(JSON.stringify(options));

      // Slider config options
      this.slidesToShow = options[0].slidesToShow;
      this.slidesToShift = options[0].slidesToShift || 1;
      this.showButtons = options[0].showButtons;
      this.showPaging = options[0].showPaging;
      this.infinite = options[0].infinite;
      this.breakpoint = options[0].breakpoint;

      // Main slider elements
      this.container = document.querySelector(sliderElements.container);
      this.view = document.querySelector(sliderElements.view);
      this.wrapper = document.querySelector(sliderElements.wrapper);
      this.slides = this.wrapper.querySelectorAll(sliderElements.slides);

      // Initial slider position values
      this.index = 0;
      this.posX1 = 0;
      this.posX2 = 0;
      this.startPos = 0;
      this.endPos = 0;
      this.limit = 50;
      this.allowShift = true;

      // Initial slider element properties
      this.slideSize = 0;
      this.slidesLength = 0;
      this.slidesToLoad = slidesToLoad || this.slidesLength;

      // Set the slider size
      this.slideSize = (
          Number(getComputedStyle(this.slides[0]).marginLeft.replace('px', '')) +
          Number(getComputedStyle(this.slides[0]).marginRight.replace('px', '')) +
          Number(getComputedStyle(this.slides[0]).width.replace('px', ''))
      );

      // Set the total amount of slides
      this.slidesLength = this.slides.length;

      // Set the total size of the wrapper
      this.wrapper.style.width = String(this.slideSize * this.slidesToLoad) + 'px';

      // Set the max number of slides to load
      if (!isNaN(this.slidesToLoad) && this.slidesToLoad != null) {
          if (this.slidesToLoad < this.slidesLength) {
              for (var i = 0; i < this.slidesLength; i++) {
                  if (i >= this.slidesToLoad) this.slides[i].remove();
              }
              this.slidesLength = this.slidesToLoad;
          }
      }

      // Set initial position of the slider
      this.wrapper.style.left = '0px';

      // Set the size of the view
      this.view.style.width = (this.slideSize * this.slidesToShow) + 'px';

      // Build slider navigation buttons
      if (this.showButtons) {
          this.prev = 'undefined';
          this.next = 'undefined';
          this.buildButtons();
      }

      // Build slider navigation paging
      if (this.showPaging) {
          this.paging = 'undefined';
          this.buildPaging();
      }

      // Automaticaly initialize the slider events
      this.initDragEvents();

      // Adjust the slider view
      this.handleBreakpoints();

      // Slider is loaded
      this.container.classList.add('loaded');
  },

  // Handle breakpoints in the page
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

  // Update slider configurations and properties
  resizeSlider: function (options) {
      this.container.classList.remove('loaded');

      // Slider config options
      this.slidesToShow = options.slidesToShow;
      this.slidesToShift = options.slidesToShift || 1;
      this.showButtons = options.showButtons;
      this.showPaging = options.showPaging;
      this.infinite = options.infinite;
      this.breakpoint = options.breakpoint;

      // Initial slider position values
      this.index = 0;
      this.posX1 = 0;
      this.posX2 = 0;
      this.startPos = 0;
      this.endPos = 0;
      this.limit = 50;
      this.allowShift = true;

      // Initial slider element properties
      this.slideSize = 0;

      // Set the slider size
      this.slideSize = (
          Number(getComputedStyle(this.slides[0]).marginLeft.replace('px', '')) +
          Number(getComputedStyle(this.slides[0]).marginRight.replace('px', '')) +
          Number(getComputedStyle(this.slides[0]).width.replace('px', ''))
      );

      // Set the total size of the wrapper
      this.wrapper.style.width = String(this.slideSize * this.slidesToLoad) + 'px';

      // Set initial position of the slider
      this.wrapper.style.left = '0px';

      // Set the size of the view
      this.view.style.width = (this.slideSize * this.slidesToShow) + 'px';

      // Build slider navigation buttons
      if (this.showButtons) {
          var buttons = this.container.querySelectorAll('.control');
          if (buttons.length) buttons.forEach(function (element) { element.remove() });
          this.buildButtons();
      }

      // Build slider navigation paging
      if (this.showPaging) {
          var paging = this.container.querySelector('.paging');
          if (paging) paging.remove();
          this.buildPaging();
      }

      this.container.classList.add('loaded');
  },

  // Fix problems with keyboard events
  initKeysEvents: function (elementNames) {
      // Fix the tab press on the end of inputs inside forms inside the slider
      this.view.addEventListener('keydown', function (event) {
          if (event.key === 'Tab') {
              var eventInput = event.target;

              elementNames.forEach(function (element) {
                  if (element === eventInput.name) {
                      event.preventDefault();
                      this.shiftSlide(1);
                  }
              })
          }
      })
  },

  // Init drag events with mouse tochscreen
  initDragEvents: function () {
      // Event triggered on press the left mouse button/touch the screen
      var dragStart = function (event) {
          this.view.classList.add('grabbing');

          this.startPos = this.wrapper.offsetLeft;

          if (event.type === 'touchstart') {
              var touchStart = event;

              this.posX1 = touchStart.touches[0].clientX;
          } else if (event.type === 'mousedown') {
              var mouseDown = event;

              this.posX1 = mouseDown.clientX;
              document.addEventListener('mouseup', dragEnd);
              document.addEventListener('mousemove', dragOut);
          }
      }

      // Event triggered on move the mouse/finger across the screen
      var dragOut = function (event) {
          if (event.type === 'touchmove') {
              var touchMove = event;

              this.posX2 = this.posX1 - touchMove.touches[0].clientX;
              this.posX1 = touchMove.touches[0].clientX;
          } else if (event.type === 'mousemove') {
              var mouseMove = event;

              this.posX2 = this.posX1 - mouseMove.clientX;
              this.posX1 = mouseMove.clientX;
          }

          this.wrapper.style.left = (this.wrapper.offsetLeft - this.posX2) + 'px';
      }

      // Event triggered when user release the mouse button/finger from the screen
      var dragEnd = function () {
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

      // Bind this in the handler functions
      dragStart = dragStart.bind(this);
      dragOut = dragOut.bind(this);
      dragEnd = dragEnd.bind(this);

      // Mouse events
      this.view.addEventListener('mousedown', dragStart);

      // Touch events
      this.view.addEventListener('touchstart', dragStart);
      this.view.addEventListener('touchmove', dragOut);
      this.view.addEventListener('touchend', dragEnd);

      // Transition events
      this.view.addEventListener('transitionend', function () { this.checkIndex() }.bind(this));

      // Resize events
      window.addEventListener('resize', function () { this.handleBreakpoints() }.bind(this));
  },

  // Hide slider buttons on the screen depending on position
  hideButton: function () {
      if (!this.infinite) {
          if (this.index == 0) {
              if (this.prev) this.prev.classList.add('hide');
          } else {
              if (this.prev && this.prev.classList.contains('hide')) {
                  this.prev.classList.remove('hide');
              }
          }

          if (this.index == (this.slidesLength - 1) - ((this.slidesLength - 1) % this.slidesToShift)) {
              if (this.next) this.next.classList.add('hide');
          } else {
              if (this.next && this.next.classList.contains('hide')) {
                  this.next.classList.remove('hide');
              }
          }
      }
  },

  // Prevents the slider from going over the limit
  shiftLimit: function () {
      if (this.infinite) {
          if (this.index < 0) {
              if (this.slidesLength % this.slidesToShift != 0) {
                  this.wrapper.style.left = -(
                      (this.slidesLength - (this.slidesLength % this.slidesToShift)) * this.slideSize
                  ) + 'px';

                  this.index = this.slidesLength - (this.slidesLength % this.slidesToShift);
              } else {
                  this.wrapper.style.left = -(
                      (this.slidesLength - this.slidesToShift) * this.slideSize
                  ) + 'px';

                  this.index = this.slidesLength - this.slidesToShift;
              }
          } else if (this.index >= this.slidesLength) {
              this.wrapper.style.left = '0px';
              this.index = 0;
          }
      } else {
          if (this.index < 0) {
              this.wrapper.style.left = '0px';
              this.index = 0;
          } else if (this.index >= this.slidesLength) {
              if (this.slidesLength % this.slidesToShift != 0) {
                  this.wrapper.style.left = -(
                      (this.slidesLength - (this.slidesLength % this.slidesToShift)) * this.slideSize
                  ) + 'px';

                  this.index = this.slidesLength - (this.slidesLength % this.slidesToShift);
              } else {
                  this.wrapper.style.left = -(
                      (this.slidesLength - this.slidesToShift) * this.slideSize
                  ) + 'px';

                  this.index = this.slidesLength - this.slidesToShift;
              }
          }
      }
  },

  // Change the slider depending on the drag/click button event
  shiftSlide: function (dir, action) {
      this.wrapper.classList.add('shifting');

      if (this.allowShift) {
          this.allowShift = false;

          if (!action) { this.startPos = this.wrapper.offsetLeft; }

          if (dir === 1) {
              this.wrapper.style.left = (
                  this.startPos - (this.slideSize * this.slidesToShift)
              ) + 'px'
              this.index += this.slidesToShift;
          } else if (dir == -1) {
              this.wrapper.style.left = (
                  this.startPos + (this.slideSize * this.slidesToShift)
              ) + 'px';
              this.index -= this.slidesToShift;
          }
      }

      this.shiftLimit();
  },

  // Event triggered after slide animations
  checkIndex: function () {
      this.wrapper.classList.remove('shifting');

      if (this.showPaging) this.updatePagingIndex(this.index);

      if (this.showButtons) this.hideButton();

      var leftPosition = parseInt(this.wrapper.style.left);

      if (leftPosition % this.slideSize !== 0) this.jumpSlide(this.index);

      this.allowShift = true;
  },

  // Update index when pass sliders
  updatePagingIndex: function (index) {
      if (this.paging) {
          this.paging.querySelectorAll('.index').forEach(function (element) {
              var elementIndex = Number(
                  element.classList.toString().replace(/\D/g, '')
              );

              if (elementIndex === index) {
                  if (!element.classList.contains('active')) {
                      element.classList.add('active');
                  }
              } else {
                  if (element.classList.contains('active')) {
                      element.classList.remove('active');
                  }
              }
          });
      }
  },

  // Event triggered on the paging navigation
  jumpSlide: function (index) {
      this.wrapper.classList.add('shifting');
      this.allowShift = false;

      if (index < 0 && this.infinite) {
          index = this.slidesLength - 1;
      } else if (index >= this.slidesLength && this.infinite) {
          index = 0;
      } else if (index < 0) {
          index = 0;
      } else if (index >= this.slidesLength) {
          index = this.slidesLength - 1;
      }

      this.wrapper.style.left = -(index * this.slideSize) + 'px';

      this.index = index;
  },

  // Create slider paging navigation
  buildPaging: function () {
      this.paging = document.createElement('div');
      this.paging.classList.add('paging');

      for (var i = 0; i < this.slidesLength; i++) {
          if (i % this.slidesToShift == 0) {
              var pagingItem = document.createElement("span");

              pagingItem.classList.add('index');
              pagingItem.classList.add(i);
              if (i == 0) pagingItem.classList.add('active');

              pagingItem.addEventListener('click', function (pagingItem) {
                  this.jumpSlide(Number(pagingItem.currentTarget.classList.toString().replace(/\D/g, '')))
              }.bind(this));

              this.paging.insertAdjacentElement('beforeend', pagingItem);
          }
      }

      this.container.insertAdjacentElement('beforeend', this.paging);
  },

  // Create slider navigation buttons
  buildButtons: function () {
      // Previous button
      this.prev = document.createElement('span');
      this.prev.setAttribute('id', 'prev');
      this.prev.classList.add('control', 'prev');
      if (!this.infinite) this.prev.classList.add('hide');

      // Next button
      this.next = document.createElement('span');
      this.next.setAttribute('id', 'next');
      this.next.classList.add('control', 'next');

      // Iserting the buttons in slider element
      this.view.insertAdjacentElement('beforebegin', this.prev);
      this.view.insertAdjacentElement('afterend', this.next);

      // Init click events
      this.prev.addEventListener('click', function () { this.shiftSlide(-1) }.bind(this));
      this.next.addEventListener('click', function () { this.shiftSlide(1) }.bind(this));
  }
};

  yv.localization = {
  less: "(menos)",
  more: "(mais)",
  writeReview: "Escrever avaliação...",
  tryAgain: "Tentar novamente" ,
  genericError: "Ocorreu um erro nesta operação. Por favor, Tente novamente mais tarde",
  socialConnect: "Conecte-se com as redes sociais para utilizar sua foto",
  requiredField: "Campo obrigatório",
  invalidEmail: "E-mail inválido"
}

  yv.load = {
  init: function () {
      //Evita script carregando mais de uma vez
      if (window.yvLoaded) return;
      window.yvLoaded = true;

      yv.commom.setInitialData();

      if (typeof yv === 'undefined') {
          yv.utils.safeLog("yv variable not found.");
          return;
      }
      else {
          if (yv.debug && yv.utils.qs["yv-debug"] !== 'true') {
              yv.utils.safeLog("debug mode but no debug tag found. YV will not load.");
              return;
          }
      }
      if (yv.load.canStart()) {
          yv.load.initScriptLoad();
      }
      else {
          //Aguarda os recursos necessários carregarem antes de iniciar o script YV.
          var tmr = setInterval(function () {
              if (yv.load.canStart()) {
                  yv.utils.safeLog("late load");
                  yv.load.initScriptLoad();
                  clearInterval(tmr);
              }
          }, 200);
      }
  },
  initScriptLoad: function () {
      if (typeof (yv.analyticsSupport) !== 'undefined')
          yv.analyticsSupport.init();

      this.loadjQuery();
  },

  canStart: function () {
      if (typeof (yv.vendorCustom.canStart) !== 'undefined')
          return yv.vendorCustom.canStart();

      return typeof window.jQuery !== 'undefined';
  },

  loadjQuery: function () {
      //Let's our own version of jQuery
      var script_tag = document.createElement('script');
      script_tag.setAttribute("type", "text/javascript");
      script_tag.setAttribute("src", yv.staticServiceAddr + "/static/commom/jquery.min.js");
      if (script_tag.readyState) {
          script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState === 'complete' || this.readyState === 'loaded') {
                  yv.load.jQueryLoaded();
              }
          };
      } else {
          script_tag.onload = yv.load.jQueryLoaded;
      }
      // Try to find the head, otherwise default to the documentElement
      (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
  },

  jQueryLoaded: function () { njQuery = window.jQuery.noConflict(true); yv.load.start(); },

  start: function () {
      if (typeof (yv.vendorCustom.preload) !== 'undefined')
          yv.vendorCustom.preload();

      //njQuery(document).ready(function () {
      //TODO: validar que vai carregar review na pagina antes de chamar loadComponents
      yv.libraries.loadComponents();

      yv.vendorCustom.initialSetup();

      if (typeof (yv.analyticsSupport) !== 'undefined' &&
          typeof (yv.analyticsSupport.startABTest) !== 'undefined')
          yv.analyticsSupport.startABTest();

      if (typeof (yv.analytics) !== 'undefined') {
          yv.analytics.start();
      }
      if (typeof (yv.review) !== 'undefined') {
          yv.review.startQuickReviewProductPage();
          yv.review.startReviews();
          yv.review.startReviewForm();
          yv.review.loadReviewShelf();
          yv.review.loadReviewPhotoGrid();
      }
      if (typeof (yv.qa) !== 'undefined') {
          yv.qa.startQa();
      }

      if (typeof (yv.storeReviews) !== 'undefined') {
          yv.storeReviews.startTestimonial();
          yv.storeReviews.startStoreReview();
      }

      if (typeof(yv.review) !== 'undefined' && typeof (yv.review.loadStoreLocationSummary) !== 'undefined')
      {    
          yv.review.loadStoreLocationSummary();
      }
      //});
      yv.utils.debugLog("yv.started");
  }

};

  yv.storeReviews = {
  startTestimonial: function () {
      if (njQuery('.yv-testimonial').length) {
          var element = njQuery('.yv-testimonial');

          //Verifica se está no modo debug
          var debug = element.data('debug');

          if (debug && debug == true) {
              if (yv.utils.qs["yv-debug"] != 'true') //Se estiver e não houver querystring, não carrega
              {
                  yv.utils.safeLog('Debugging mode for Testimonial but no yv-debug querystring. Testimonial will not load');
                  return;
              }
          }

          var qty = element.data('qty') || 9;

          njQuery.jsonpx(yv.uriBuilder.general('/storereview/testimonial', '&qty=' + qty), function (r) {
              element.html(r.html);
              yv.commom.toggleViewMore();
              
              if (element.find('.yv-slide').length > 0) {
                  yv.Slider.build(
                      [
                          {
                              slidesToShow: 3,
                              slidesToShift: 3,
                              showButtons: true,
                              showPaging: true,
                              infinite: true,
                              breakpoint: 9999
                          },
                          {
                              slidesToShow: 2,
                              slidesToShift: 2,
                              showButtons: true,
                              showPaging: true,
                              infinite: true,
                              breakpoint: 990
                          },
                          {
                              slidesToShow: 1,
                              slidesToShift: 1,
                              showButtons: true,
                              showPaging: true,
                              infinite: true,
                              breakpoint: 690
                          }
                      ],
                      {
                          container: '#yv-container',
                          view: '#yv-view',
                          wrapper: '#yv-wrapper',
                          slides: '.yv-slide',
                      },
                      qty
                  );
                  
                  element.show();
              }
          });
      }
  },
  startStoreReview: function () {
      yv.storeReviews.loadStampModal();

      var element = njQuery('.yv-storereviews');

      if (!element || element.length == 0) return;

      //Verifica se está no modo debug
      var debug = element.data('debug');

      if (debug && debug == true) {
          //Se estiver e não houver querystring, não carrega
          if (yv.utils.qs["yv-debug"] != 'true') {
              yv.utils.safeLog('Debugging mode for store reviews but no yv-debug querystring. Store reviews will not load');
              return;
          }
      }

      yv.utils.toggleLoading(false, '.yv-store-review');

      njQuery.jsonpx(yv.uriBuilder.general('/storereview/reviews'), function (r) {
          yv.storeReviews.loadStoreReviewResult(r);
          yv.utils.toggleLoading(true, '.yv-store-review');
      });
  },
  loadStoreReviewResult: function (r) {
      var element = njQuery('.yv-storereviews');
      element.html(r.html);

      yv.commom.loadPaging(yv.storeReviews.loadStoreReviewResult, yv.storeReviews.loadStoreReviewResult, '.yv-store-review');
  },
  loadStoreReview: function () {
      var element = njQuery('.yv-storereviews');

      if (!element || element.length == 0) return;

      //Verifica se está no modo debug
      var debug = element.data('debug');

      if (debug && debug == true) {
          if (yv.utils.qs["yv-debug"] != 'true') //Se estiver e não houver querystring, não carrega
          {
              yv.utils.safeLog('Debugging mode for store reviews but no yv-debug querystring. Store reviews will not load');
              return;
          }
      }

      yv.utils.toggleLoading(false, '.yv-store-review');

      njQuery.jsonpx(yv.uriBuilder.general('/storereview/reviews'), function (r) {
          yv.storeReviews.loadStoreReviewResult(r);
          yv.utils.toggleLoading(true, '.yv-store-review');
      });
  },
  loadStampModal: function () {
      var baseUrl = 'https://www.lojaconfiavel.com/trustedstore/modal/';

      njQuery('[data-lcname],img[title="Loja Confiável"][src*="Footer.jpg"],img[title="Loja ConfiÃ¡vel"][src*="Footer.jpg"]').click(function (event) {
          var storeName = '';
          var tgt = njQuery(event.target);

          if (tgt[0].hasAttribute('data-lcname')) {
              storeName = njQuery(tgt).attr('data-lcname');
          } else {
              var linkElement = njQuery(event.target).parent();

              if (linkElement) {
                  var attrElement = linkElement.attr('href');

                  if (attrElement) {
                      if (attrElement.indexOf('?') > -1) {
                          storeName = attrElement.split('utm_source=')[1];
                      } else {
                          var splitted = attrElement.split('/');
                          storeName = splitted[splitted.length - 1];
                      }
                  }
              }
          }

          if (storeName != '') {
              if (!njQuery('.yv-trustedstore-modal').length) {
                  var modalBody = "<div class='yv-bootstrap'> <div class='yv-trustedstore-modal yv-modal  yv-fade' tabindex='-1' role='dialog' style='display: none;'><div class='yv-modal-dialog' role='document'><div class='yv-modal-content'> <div class='yv-modal-close'><span class='yv-modal-closetext'><img src='" + yv.staticServiceAddr + "/static/images/close_btn_blue.png'></span></div> <div class='yv-modal-body'> <iframe src='" + baseUrl + storeName + "' style='border: 0; width: 100%; height: 100%'>Your browser doesn't support iFrames.</iframe>  </div></div></div></div></div>";
                  njQuery('body').append(modalBody);
                  njQuery('.yv-modal-close,.yv-trustedstore-modal').click(function (r) {
                      njQuery('.yv-trustedstore-modal').modal('hide');
                      njQuery('.yv-modal-backdrop.yv-fade.yv-in').remove();
                  });
              }

              njQuery('.yv-trustedstore-modal').modal('show');
              event.preventDefault();
              return false;
          }
      });
  }
}


  yv.qa = {

  startQa: function () {
      yv.qa.loadAnswered();

      var element = njQuery(yv.vendorCustom.QaElement());
      if (!element.length || !yv.commom.debugIsCorrect(element)) { return; }

      var tpl = '';
      if (yv.utils.qs['yv-qa-template']) {
          tpl = '&yv-qa-template=' + yv.utils.qs['yv-qa-template'];
      }

      njQuery.jsonpx(yv.uriBuilder.generalSecondary('/questionanswer', '&productId=' + yv.productId + tpl), function (r) {
          if (!r.html) return;
          yv.qa.loadQAData(r);

          yv.qa.startQAAnchor();
      });

  },

  loadAnswered: function () {
      if (njQuery('#yv-show-form').length) {
          if (yv.utils.qs['questionId']) {

              yv.analyticsSupport.startReviewFormAnalytics();

              var qid = yv.utils.qs['questionId'];
              var u = yv.utils.qs['yv-u'];
              var param = '&questionId=' + qid + '&yv-u=' + u;

              njQuery.jsonpx(yv.uriBuilder.general('/questionanswer/getquestion', param), function (r) {
                  njQuery('#yv-show-form').html(r.html);

                  if (yv.analyticsSupport.trackAnswer != 'undefined') {
                      var additionalData = '[{localaddr: "' + encodeURIComponent(window.location.href) + '"}]';
                      yv.analyticsSupport.trackAnswer('clickEmail', additionalData);
                  }

                  yv.qa.loadQaActions();
                  njQuery('.yv-qa-focuslogin').focus();
              });
          }
      }
  },

  loadQAData: function (r) {
      if (!r || !r.html) return;

      var element = njQuery(yv.vendorCustom.QaElement());
      element.html(r.html);

      yv.utils.toggleLoading(true, element);

      yv.qa.loadQaActions();

      yv.analyticsSupport.startReviewFormAnalytics();

      //Carrega paginador
      yv.commom.loadPaging(yv.qa.loadQAData, yv.qa.loadQAData, '.yv-qa', '-qa');
  },

  loadQaActions: function () {
      njQuery('[data-action="reply-question"]').click(function () {
          var loginElement = njQuery(this).parents('.yv-begin-question').find('.yv-qa-showlogin');
          var loginLoadElement = loginElement.find('.yv-loadlogin');

          if (loginLoadElement.length) {
              //Novo modelo. Carrega login 'on demand'
              njQuery.jsonpx(yv.uriBuilder.general('/questionanswer/login'), function (r) {
                  loginLoadElement.html(r.html);
                  yv.social.loadSocialLogin();
              });
          }
          loginElement.slideDown();
      });

      njQuery('.yv-qa-focuslogin').one('focus', function () {
          var loginElement = njQuery(this).parent().siblings('.yv-qa-showlogin');
          var loginLoadElement = loginElement.find('.yv-loadlogin');

          if (loginLoadElement.length) {
              //Novo modelo. Carrega login 'on demand'
              yv.utils.toggleLoading(false, '#yv-question-form');
              njQuery.jsonpx(yv.uriBuilder.general('/questionanswer/login'), function (r) {
                  loginLoadElement.html(r.html);
                  yv.social.loadSocialLogin();
              });
          }
          yv.utils.toggleLoading(true, '#yv-question-form');
          loginElement.slideDown();
      });

      njQuery('[data-yv-action="send-question"]').click(function () {
          yv.qa.saveQuestion(this);
      });

      njQuery('[data-yv-action="send-answer"]').click(function () {
          yv.qa.saveAnswer(njQuery(this));
      });

      njQuery('.yv-qa-vote-btn,[data-yv-action="likedislike"]').click(function () {
          yv.qa.likeDislikeQA(this);
      });


      njQuery('[data-yv-action="send-answer-similar"]').click(function () {
          yv.qa.saveQuestionWhithoutSimiliar();
      });

      njQuery('.yv-a-showmore').click(function () {
          var _self = this;
          njQuery(_self).siblings(':hidden').show(500);
          njQuery(_self).hide()
      });

      njQuery('.yv-qa-more').click(function () {
          yv.utils.goTo('.yv-qa');
      });

      if (yv.utils.qs["yv-qa-ask"] == 'true') { //Cliente quer fazer nova pergunta
          setTimeout(function () {
              njQuery('[name="yv-qa-question"]').focus();
          }, 0);
      }

      yv.social.loadSocialLogin();
  },

  saveQuestion: function (ctx) {
      var qContext = njQuery(ctx).parent().siblings('.yv-qa-showlogin');
      var question = qContext.parent().find('[name="yv-qa-question"]').val();
      var user_name = qContext.find('[name="user-name"]:visible,[name="yv-exhibition-name"]:visible').val();
      var user_email = qContext.find('[name="user-email"]').val();

      //Só valida se o elemento existir
      var user_phone_element = qContext.find('[name="yv-user-phone"]:visible');
      var user_phone = user_phone_element.length == 0 || user_phone_element.val().length > 0;

      if (!question || !user_name || !user_email || !user_phone) {
          qContext.parent().find('.yv-question.yv-help-block').show();
          return;
      }

      if (qContext.find('[name="user-name"]:visible').length) {
          var validEle = qContext.find('[name="user-name"]:visible');
          //Digitou e-mail no lugar do nome
          if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(validEle.val())) {
              validEle.parent('div').addClass('yv-has-error');
              validEle.siblings('.yv-help-valid').show();
              return;
          }
      }

      if (qContext.find('[name="user-email"]:visible').length) {
          var validEle = qContext.find('[name="user-email"]:visible');
          //Não digitou e-mail válido
          if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(validEle.val())) {
              validEle.parent('div').addClass('yv-has-error');
              validEle.siblings('.yv-help-valid').show();
              return;
          }
      }

      //Existe campo de telefone
      if (qContext.find('[name="yv-user-phone"]:visible').length) {
          var validEle = qContext.find('[name="yv-user-phone"]:visible');
          //Não digitou e-mail válido
          if (validEle.val().length == 0) {
              validEle.parent('div').addClass('yv-has-error');
              validEle.siblings('.yv-help-valid').show();
              return;
          }
      }

      //Disabilita botão para não enviar duas vezes
      njQuery(this).attr('disabled', 'disabled');

      //Pega dados do formulário
      var data = njQuery('#yv-question-form :input').serialize() + yv.commom.getProductDetails();

      if (yv.categoryForm && yv.categoryForm.length > 0)
          data += njQuery([].concat(yv.categoryForm).reverse()).map(function (i, v) { return "&formId=" + encodeURIComponent(v); }).get().join('');

      //Some com formulário e exibe "carregando"
      yv.utils.toggleLoading(false, '#yv-question-form');
      yv.utils.goTo('#yv-question-form');

      var productId = window.yv.productId || yv.utils.qs["idproduto"];

      if (yv.utils.qs['questionId'] && yv.analyticsSupport.trackAnswer != 'undefined') {
          yv.analyticsSupport.trackAnswer('saveAnswer');
          yv.utils.safeLog('saveAnswer');
      }

      //Envia de fato os dados para salvar
      var uri = yv.uriBuilder.general('/questionanswer/savequestion', '&productId=' + productId + '&' + data);
      njQuery.jsonpx(uri, function (result) {
          //Exibe confirmação
          yv.utils.toggleLoading(true, '#yv-question-form');
          njQuery('#yv-question-form').html(result.html);
          njQuery('[data-yv-action="send-answer-similar"]').click(function () {
              yv.qa.saveQuestionWhithoutSimiliar();
          });

      }).fail(function (jqXHR, textStatus, err) {
          yv.utils.toggleLoading(true, '#yv-question-form');
          njQuery('#yv-question-form').html('<div style="background-color:white; padding:30px; height:300px">' + yv.localization.genericError + '</div>');
      });
  },

  likeDislikeQA: function (ctx) {
      var Id = njQuery(ctx).data('id');
      var action = njQuery(ctx).data('action');
      var uri = '/questionanswer/' + action;
      yv.utils.toggleLoading(false, ctx);
      njQuery.jsonpx(yv.uriBuilder.general(uri, '&id=' + Id), function (r) {
          if (r.html == 'true') {
              var counter = njQuery(ctx).siblings('.yv-qa-vote-text');
              if (!counter || counter.length == 0)
                  counter = njQuery(ctx).find('.yv-qa-vote-text');
              if (!counter || !counter.length)
                  counter = njQuery(ctx).siblings().find('.yv-qa-vote-text');
              var total = parseInt(counter.text());
              if (action.indexOf('dislike') > -1)
                  total--;
              else
                  total++;
              counter.text(total);
          }

          yv.utils.toggleLoading(true, ctx);
      });
  },

  saveQuestionWhithoutSimiliar: function () {
      //Disabilita botão para não enviar duas vezes
      njQuery(this).attr('disabled', 'disabled');

      //Pega dados do formulário
      var data = njQuery('#yv-question-form :input').serialize() + yv.commom.getProductDetails();

      //Some com formulário e exibe "carregando"
      yv.utils.toggleLoading(false, '#yv-question-form');
      yv.utils.goTo('#yv-question-form');

      //Envia de fato os dados para salvar
      var uri = yv.uriBuilder.general('/questionanswer/saveQuestionWithoutSimiliar', '&productId=' + window.yv.productId + '&' + data);
      njQuery.jsonpx(uri, function (result) {
          //Exibe confirmação
          yv.utils.toggleLoading(true, '#yv-question-form');
          njQuery('#yv-question-form').html(result.html);

      }).fail(function (jqXHR, textStatus, err) {
          yv.utils.toggleLoading(true, '#yv-question-form');
          njQuery('#yv-question-form').html('<div style="background-color:white; padding:30px; height:300px">' + yv.localization.genericError + '</div>');
      });
  },

  saveAnswer: function (ctx) {
      var currentQuestion = ctx.parents('.yv-qa-sendanswer');
      var questionId = currentQuestion.attr('data-yv-question');

      var answer = currentQuestion.find('[name="comment"]').val();
      var user_name = currentQuestion.find('[name="user-name"]:visible,[name="yv-exhibition-name"]:visible').val();
      var user_email = currentQuestion.find('[name="user-email"]').val();

      //Só valida se o elemento existir
      var user_phone_element = currentQuestion.find('[name="yv-user-phone"]:visible');
      var user_phone = user_phone_element.length == 0 || user_phone_element.val().length > 0;

      if (!answer || !user_name || !user_email || !user_phone) {
          currentQuestion.find('.yv-question.yv-help-block').show();
          return;
      }

      //Pega dados do formulário
      var data = njQuery(':input', currentQuestion).serialize();

      //Some com formulário e exibe "carregando"
      yv.utils.toggleLoading(false, currentQuestion);
      yv.utils.goTo(currentQuestion);

      var productId = window.yv.productId || yv.utils.qs["idproduto"];

      //Envia de fato os dados para salvar
      var uri = yv.uriBuilder.general('/questionanswer/saveanswer', '&productId=' + productId + '&' + data);
      njQuery.jsonpx(uri, function (result) {
          //Exibe confirmação
          yv.utils.toggleLoading(true, currentQuestion);
          njQuery(currentQuestion).html(result.html);

      }).fail(function (jqXHR, textStatus, err) {
          yv.utils.toggleLoading(true, currentQuestion);
          njQuery('#yv-question-form').html('<div style="background-color:white; padding:30px; height:300px">' + yv.localization.genericError + '</div>');
      });
  },

  startQAAnchor: function () {
      var mainElement = njQuery('.yv-qa-anchor');
      if (mainElement.length) {           
          njQuery.jsonpx(yv.uriBuilder.general('/questionanswer/QuestionAnchor', '&idProductStore=' + yv.productId),
              function (resp) {                    
                  mainElement.html(resp.html);
                  mainElement.click(function () {
                      yv.utils.goTo('.yv-qa');
                      yv.analyticsSupport.trackWriteReview('qa-more');
                  });
              });
      }
  }
}

  yv.quickReview = {

  showQuickReview: function (shelfResult) {
      for (var i = 0; i < shelfResult.length; i++) {
          var current = shelfResult[i];

          if (current && current.productId && current.data) {
              yv.vendorCustom.quickReviewSetResult(current);
          }
      }
  },

  getProductShelf: function (productIds, cb) {
      var allProd = [].concat(productIds);
      if (allProd.length == 0) return;
      var endpoint = yv.uriBuilder.general('/review/productShelf', '&ids=' + allProd.join(','));
      njQuery.jsonpx(endpoint, function (r) {
          if (!r.html)
              return;
          var parsedResp = njQuery.parseJSON(r.html);

          if (parsedResp) {
              if (cb)
                  cb(parsedResp);
              else
                  yv.quickReview.showQuickReview(parsedResp);
          }
      });
  },

  searchExecuteQuickReview: function () {
      window.alreadyLoadedItems = window.alreadyLoadedItems || [];
      var allItems = yv.vendorCustom.quickReviewGetIds();

      allItems = njQuery(allItems).filter(function (i, e) { return njQuery.inArray(e, alreadyLoadedItems) < 0; });

      alreadyLoadedItems = njQuery.merge(alreadyLoadedItems, allItems);
      yv.quickReview.getProductShelf(allItems.toArray());

      njQuery.each(allItems, function (i, v) {
          njQuery('.yv-review-quickreview[value="' + v + '"]').on('mouseenter', function (e) {
              yv.quickReview.searchRelevantReview(njQuery(e.currentTarget));
          });
      });
      
  },

  searchRelevantReview: function (product) {
      var productId = product.attr('value');
      var url = yv.uriBuilder.general('/review/ReviewRelevant', '&productStoreId=' + productId);
      

      if (product.attr('data-content') == undefined) {
          njQuery.jsonpx(url, function (r) {

              if (!r.html)
                  return;


              product.on('shown.bs.popover', function () {
                  setTimeout(function () {
                      product.popover('hide');
                  }, 12000);
              });

              product.popover({
                  content: r.html,
                  trigger: 'hover',
                  html: true,
                  title: 'O que as pessoas acham',
                  placement: "auto yv-bottom",
                  container: '#yv-popover'
              }).popover('show');               

              product.attr('data-content', r.html);
          });
      }
  
  },

  startQuickReview: function () {
      if (njQuery('.yv-review-quickreview').length) {
          yv.quickReview.searchExecuteQuickReview();

          if (!yv.vendorCustom || typeof (yv.vendorCustom.quickReviewSingleExecute) == 'undefined'
              || !yv.vendorCustom.quickReviewSingleExecute()) {
              setInterval(yv.quickReview.searchExecuteQuickReview, 500);
          }
      }
      if (njQuery('#yv-popover').length == 0)
          njQuery('body').append('<div class="yv-bootstrap" id="yv-popover" style="position:absolute;"></div>');
  }

}

  yv.validation = {
  validateSingleEle: function (ele) {
      var ele = njQuery(ele);
      var isValid = true;

      //Elementos do tipo radio e checkbox são validados...
      if (ele.is(':radio,:checkbox')) {
          if (njQuery("[name='" + ele.attr('name') + "']:checked").length == 0)
              isValid = false;
      }

      //Elementos do tipo input são validados...
      if (ele.is('input:text,textarea,select')) {
          //Só valida se o elemento estiver visível na tela
          if (ele.is(':visible') && ele.attr('name') != 'user-name' && ele.val().length == 0)
              isValid = false;
      }

      return isValid
  },

  validateCreateErr: function (element, errmsg) {
      if (element.hasClass('yv-user-email') || element.hasClass('yv-user-name') || element.hasClass('yv-user-phone')) {
          if (element.siblings('.yv-help-block').length == 0)
              element.after(errmsg);
      }
      else if (element.parents('.yv-form-group')) {
          if (njQuery('[name=user-email]').parents('.yv-form-group').find('.yv-help-block').length == 1)
              if (element.parents('.yv-form-group').find('.yv-help-block:visible').length == 0)
                  element.parents('.yv-form-group').append(errmsg);
      }
      else if (element.parent('.yv-radio-inline').length) {
          if (!element.parent().parent().hasClass('yv-form-group'))
              element.parent().parent().append(errmsg);
      } else {
          errmsg.insertAfter(element);
      }
  },

  validateSetErr: function (ele, errmsg) {
      var element = njQuery(ele);
      element.closest('.yv-form-group').addClass('yv-has-error');
      yv.validation.validateCreateErr(element, errmsg);

      element.change(function () {
          if (!yv.validation.validateSingleEle(this))
              element.closest('.yv-form-group').addClass('yv-has-error');
          else {
              element.closest('.yv-form-group').removeClass('yv-has-error');
              element.parents('.yv-form-group').find('.yv-help-block').remove();
          }
      });
  },

  isValidReviewForm: function (start) {
      //Busca a todos os elementos que são obrigatórios (required)
      var requiredElements = njQuery(start + ' [required]');
      var emailElements = njQuery(start + ' .yv-user-email');
      var isValid = true;

      //Valida cada um deles
      var errmsg = '<span class="yv-help-block" style="color:red">' + yv.localization.requiredField + '</span>';
      njQuery.each(requiredElements, function (i, v) {
          if (!yv.validation.validateSingleEle(v)) {
              yv.validation.validateSetErr(v, errmsg);
              isValid = false;
          }
      });

      //Valida campos de e-mail
      var errmsgEmail = '<span class="yv-help-block" style="color:red">' + yv.localization.invalidEmail + '</span>';
      njQuery.each(emailElements, function (i, v) {
          var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          if (!re.test(emailElements.val())) {
              yv.validation.validateSetErr(v, errmsgEmail);
              isValid = false;
          }
      });

      return isValid;
  },

  isValidUser: function () {
      var hasUserName = false;
      var hasEmail = false;
      var phone = njQuery('[name="yv-user-phone"]:visible');
      var hasPhone = phone.length && phone.val();


      njQuery.each(njQuery('[name="user-name"]:visible,[name="yv-exhibition-name"]:visible'), function (i, v) {
          var x = njQuery(v);
          if (x && x.val()) {
              hasUserName = true;
              return false;
          }
      });


      njQuery.each(njQuery('[name="user-email"]'), function (i, v) {
          var x = njQuery(v);
          if (x && x.val()) {
              hasEmail = true;
              return false;
          }
      });

      return hasUserName && hasEmail;
  },

  setInvalid: function (ctx, track) {
      yv.utils.goTo('.yv-help-block:visible');
      njQuery(ctx).removeAttr("disabled");

      //Busca quais campos estão inválidos
      var invalidFieldNames = [];
      njQuery('.yv-has-error:visible').find(':input')
          .each(function (i, v) {
              var itm = njQuery(v).attr('name');
              if (invalidFieldNames.indexOf(itm) == -1) invalidFieldNames.push(itm);
          });
      var invalidResult = JSON.stringify(invalidFieldNames);

      yv.analyticsSupport.trackWriteReview(track, invalidResult);
      
  },

  validateForm: function () {
      var validReviewForm = yv.validation.isValidReviewForm('#yv-show-form');
      var validUser = yv.validation.isValidUser();

      if (!validReviewForm || !validUser) {
          if (!validReviewForm) yv.validation.setInvalid(this, 'errRequiredFields');
          if (!validUser) yv.validation.setInvalid(this, 'errValidateUser');
          return false;
      }

      return true;
  }
}

  yv.review = {
  startQuickReviewProductPage: function () {
      if (njQuery(yv.vendorCustom.quickReviewProdElement()).length) {
          var element = njQuery(yv.vendorCustom.quickReviewProdElement());
          if (element[0]) {
              element.show();
              njQuery.jsonpx(yv.uriBuilder.generalSecondary('/review/getquickreviewproduct', '&productStoreId=' + yv.productId),
                  function (resp) {
                      yv.vendorCustom.quickReviewProdBefore();
                      element.html(resp.html);
                      njQuery(yv.vendorCustom.quickReviewProdElement()).click(function () {
                          yv.utils.goTo(yv.vendorCustom.reviewsElement());
                          yv.analyticsSupport.trackWriteReview('review-more');
                      });

                      njQuery('#yv-writereview,.yv-writereview').click(function (e) {
                          yv.review.showWriteReview();
                      });
                  });
          }
      }
  },
  loadReviewShelf: function () {
      if (njQuery('.yv-reviewshelf').length && yv.categoryIds && yv.categoryIds.length) {
          var tag = njQuery('.yv-reviewshelf').attr('data-tag');
          var qtd = njQuery('.yv-reviewshelf').attr('data-qty');
          var ids = { categories: yv.categoryIds, qty: qtd, tag: tag };
          var uri = yv.uriBuilder.general('/review/reviewshelf', '&' + njQuery.param(ids, true));

          njQuery.jsonpx(uri, function (r) {
              if (r && r.html) {
                  njQuery('.yv-reviewshelf').html(r.html);
                  yv.commom.toggleViewMore();
              }
          });
      }
  },
  loadStoreLocationSummary: function () {
      if (njQuery('.yv-seller-reviews').length && njQuery('.yv-seller-reviews').length > 0 && (njQuery('.yv-seller-reviews').data('yvsellerid') || (yv.idInternalStoreLocation && yv.idInternalStoreLocation != 'undefined'))) {
          if (!yv.idInternalStoreLocation)
              yv.idInternalStoreLocation = njQuery('.yv-seller-reviews').data('yvsellerid');
          var uri = yv.uriBuilder.general('/storelocationsummary/getstorelocationsummary', '&idInternalStoreLocation=' + yv.idInternalStoreLocation);
          njQuery.jsonpx(uri, function (r) {
              if (r && r.html) {
                  njQuery('.yv-seller-reviews').html(r.html);
                  var hasClickEvent = njQuery._data(njQuery('.yv-viewmore-btn').get(0), "events");
                  //verifica se não existe o evento de click na class viewmore, estava bugando o evento caso add no listener de click 2 vezes.
                  if (!hasClickEvent || !hasClickEvent.click) {
                      yv.commom.toggleViewMore();
                  };
              }
          });
      }
  },
  startReviewForm: function () {
      if (njQuery('#yv-show-form').length) {
          if (yv.utils.qs['yv-write-review']) {
              yv.review.showWriteReview();

              var additionalData = '[{localaddr: "' + encodeURIComponent(window.location.href) + '"}]';
              if (yv.utils.qs['yv-sms'])
                  yv.analyticsSupport.trackWriteReview('clickSms', additionalData);
              else
                  yv.analyticsSupport.trackWriteReview('clickEmail', additionalData);
          }
      }
  },

  startReviews: function () {
      if (njQuery(yv.vendorCustom.reviewsElement()).length) {
          this.loadReviews();
      }
  },

  loadReviews: function () {
      yv.vendorCustom.reviewsBefore();

      //TODO: Isso deveria ficar no template
      njQuery(yv.vendorCustom.reviewsElement()).css('clear', 'both');

      var urlImageGif = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'staticfiles.yviews.com.br/static/images/loading.gif'

      //TODO: deve haver um template padrão para isso
      njQuery(yv.vendorCustom.reviewsElement()).html('<div class="bootstrap yv-bootstrap"><div id="yv-show-reviews" ></div><div style="padding-top:30px;padding-bottom:15px;" id="yv-write-review"><button id="yv-writereview" class="yv-btn yv-btn-primary" type="button">' + yv.localization.writeReview + '</button></div><div id="yv-show-form" style="display:none;min-height:300px; background-image:url(' + urlImageGif + ');background-repeat:no-repeat"></div></div>')

      njQuery('#yv-writereview,.yv-writereview').off('click') //Evita duplicidade de click
      njQuery('#yv-writereview,.yv-writereview').click(function (e) {
          this.showWriteReview();
      });

      //Abrir automaticamente o formulário 
      if (njQuery(yv.vendorCustom.reviewsElement()).data('yvopen') == true)
          this.showWriteReview(true);


      this.getReviews();
  },

  getReviews: function () {
      yv.utils.toggleLoading(false, yv.vendorCustom.reviewsElement());

      var querystring = "&extendedField=";
      if (typeof yv.filters != "undefined" && yv.filters.length > 0) {
          var querysFilters = "";

          njQuery.each(yv.filters, function (i, v) {
              if ((typeof v.FilterFieldId != 'undefined') && (typeof v.FilterFieldValueId != 'undefined'))
                  querysFilters += v.FilterFieldId + ":" + v.FilterFieldValueId + ",";
          });

          querystring += querysFilters;
      }

      if (yv.utils.qs['yv-review-template']) {
          querystring += '&yv-review-template=' + yv.utils.qs['yv-review-template'];
      }

      var productId = window.yv.productId;
      njQuery.jsonpx(yv.uriBuilder.generalSecondary('/review/GetReview', '&productStoreId=' + productId + querystring), function (r) {
          yv.review.loadReviewData(r);
      });
  },

  loadShare: function () {
      njQuery('.yv-share').click(function () {

          var reviewId = njQuery(this).attr('data-yv-rid');
          var media = njQuery(this).attr('data-yv-media');

          var action = '/share/index/' + reviewId;
          var parameters = '&media=' + media;
          parameters += '&currentPage=' + window.location.href;

          var link = yv.uriBuilder.generalNoCb(action, parameters);

          window.open(link, 'new', 'height=600,width=600');
      });
  },

  loadUserUploadedImages: function () {
      if (njQuery('[data-yvaction="userimg-reviewshow"]').length) {
          njQuery('.yv-reviewsingleimg a').simpleLightbox(
              {
                  fileExt: false,
                  widthRatio: 0.7,
                  heightRatio: 0.6,
                  additionalHtml: '<div class="yv-revusrimgdlg-handler sl-close"><div><i class="fa fa-close"></div></div>'
              });
      }
  },
  loadFilters: function () {
      window.yv.filters = window.yv.filters || [];

      //Esconde todos os botões "fechar" dos filtros
      njQuery('.yv-filter-close').hide();

      //Para cada filtro existente, exibe o botão "fechar"
      njQuery.each(yv.filters, function (i, v) {
          njQuery('.yv-filter-close[data-yv-efvid="' + v.FilterFieldValueId + '"]').show();
      });

      njQuery('.yv-filter-close').click(function (e) {
          var fieldValueId = njQuery(this).attr('data-yv-efvid');

          //Remove o filtro clicado
          yv.filters = njQuery.grep(yv.filters, function (o) { return o.FilterFieldValueId == fieldValueId }, true);

          yv.review.getReviews();
      });

      njQuery('.yv-filter').click(function (event) {
          event.preventDefault();

          //Busca os valores de Ids do objeto clicado
          var fieldValueId = njQuery(this).attr('data-yv-efvid');
          var fieldId = njQuery(this).siblings('.yv-filter-heading').attr('data-yv-efid');

          //Armazena novo filtro
          window.yv.filters.push({ FilterFieldId: fieldId, FilterFieldValueId: fieldValueId });

          //Recarrega os reviews
          yv.review.getReviews();

          return false;
      });
  },

  loadReviewData: function (r) {
      if (r.html && r.hasResults) {
          njQuery('#yv-show-reviews').html(r.html);
          yv.review.loadRichSnippets();
          yv.commom.loadLikeUnlike();
          yv.review.loadShare();
          yv.review.loadFilters();
          yv.review.loadUserUploadedImages();
          yv.commom.toggleViewMore();
          yv.analyticsSupport.trackScrollReview();
      }
      else if (r.html && !r.hasResults)
          njQuery('#yv-show-reviews').html(r.html);

      njQuery('#yv-writereview,.yv-writereview').off('click') //Evita duplicidade de click
      njQuery('#yv-writereview,.yv-writereview').click(function () {
          yv.review.showWriteReview();
      });

      //Se houver querystring, abre editor de formulário
      yv.review.gotoWriteReview();

      //Carrega paginador
      yv.commom.loadPaging(yv.review.loadReviewData, yv.review.loadReviewData, yv.vendorCustom.reviewsElement());

      yv.utils.toggleLoading(true, yv.vendorCustom.reviewsElement());
  },

  saveReview: function (ctx, r) {
      njQuery(ctx).attr("disabled", true);

      if (!yv.validation.validateForm()) {
          njQuery(ctx).attr("disabled", false);
          yv.utils.goTo('.yv-has-error');
          return;
      }

      //Pega dados do formulário
      var data = njQuery('#yv-form :input').serialize();

      //se for um review proveniente de sms coloca na query string pra tracking
      if (yv.utils.qs["yv-sms"]) {
          data += '&yv-sms=' + encodeURIComponent(yv.utils.qs['yv-sms']);
      }

      //Se houver, pega id da ordem
      if (yv.utils.qs["yv-o"]) {
          data += '&yv-o=' + encodeURIComponent(yv.utils.qs['yv-o']);
      }

      //Se houver, pega id do sku
      if (yv.utils.qs["yv-sku"]) {
          data += '&yv-sku=' + encodeURIComponent(yv.utils.qs['yv-sku']);
      }

      //Se houver, pega id da solicitação
      if (yv.utils.qs["yv-rr"]) {
          data += '&yv-rr=' + encodeURIComponent(yv.utils.qs['yv-rr']);
          njQuery(".yv-login-frame").parent().hide();
      }

      //Pega dados do produto
      data += yv.commom.getProductDetails();

      //Some com formulário e exibe "carregando"
      yv.utils.toggleLoading(false, '#yv-review-form');
      yv.utils.goTo('#yv-show-form');

      //Tracking para quando salvar review
      if (yv.utils.qs['yv-sr']) //Tracking do sistema de "Avaliar também"
          yv.analyticsSupport.trackEvent('saveReview', 'alsoreview');
      else {
          if (yv.utils.qs["yv-sms"]) {
              yv.analyticsSupport.trackWriteReview('saveReviewSms'); //Tracking do sistema sms
          } else {
              yv.analyticsSupport.trackWriteReview('saveReview'); //Tracking do sistema normal
          }

      }


      //Envia de fato os dados para salvar
      var uri = yv.uriBuilder.general('/reviewformsave/SaveReviewForm', '&productId=' + window.yv.productId + '&' + data);

      njQuery.jsonpx(uri, function (result) {
          //Exibe confirmação
          yv.utils.toggleLoading(true, '#yv-review-form');
          njQuery('#yv-review-notfound').hide();
          njQuery('#yv-review-form').html(result.html);
      })
          .fail(function () {
              yv.utils.toggleLoading(true, '#yv-review-form');
              njQuery('#yv-show-form').html('<div style="background-color:white; padding:30px; height:300px">' + yv.localization.genericError + '</div>');
          });

      njQuery(ctx).removeAttr("disabled");
  },

  saveReviewStore: function (ctx, r) {
      njQuery(this).attr("disabled", true);

      if (!yv.validation.validateForm()) {
          yv.utils.goTo('.yv-has-error');
          njQuery(this).attr("disabled", false);
          return;
      }

      //Pega dados do formulário
      var data = njQuery('#yv-form :input').serialize();

      //Se houver, pega id da ordem
      if (yv.utils.qs["yv-o"]) {
          data += '&yv-o=' + encodeURIComponent(yv.utils.qs['yv-o']);
      }

      //Se houver, pega id da solicitação
      if (yv.utils.qs["yv-srr"]) {
          data += '&yv-srr=' + encodeURIComponent(yv.utils.qs['yv-srr']);
      }


      //Some com formulário e exibe "carregando"
      yv.utils.toggleLoading(false, '#yv-review-form');
      yv.utils.goTo('#yv-show-form');

      //Envia de fato os dados para salvar
      var uri = yv.uriBuilder.general('/reviewformsave/SaveStoreReviewForm', '&' + data);

      njQuery.jsonpx(uri, function (result) {
          //Exibe confirmação
          yv.utils.toggleLoading(true, '#yv-review-form');
          njQuery('#yv-review-notfound').hide();
          njQuery('#yv-review-form').html(result.html);
      })
          .fail(function () {
              toggleLoading(true, '#yv-review-form');
              njQuery('#yv-show-form').html('<div style="background-color:white; padding:30px; height:300px">' + yv.localization.genericError + '</div>');
          });

      njQuery(this).removeAttr("disabled");
  },

  showWriteReview: function (doNotScroll) {
      var urlreviewform = '/reviewform/getreviewform';
      njQuery('#yv-show-form').show(400);
      njQuery('#yv-write-review').hide(200);
      if (!doNotScroll)
          yv.utils.goTo('#yv-show-form');

      //#region Busca por querystrings
      var categoriesForm = '';
      if (yv.categoryForm && yv.categoryForm.length > 0)
          categoriesForm = njQuery([].concat(yv.categoryForm).reverse()).map(function (i, v) { return "&formId=" + encodeURIComponent(v); }).get().join('');
      if (yv.utils.qs['yv-u'])
          categoriesForm += "&yv-user=" + yv.utils.qs['yv-u'];
      if (yv.utils.qs['yv-sr'])
          categoriesForm += '&yv-sr=true';
      if (yv.utils.qs['yv-o'])
          categoriesForm += '&yv-o=' + encodeURIComponent(yv.utils.qs['yv-o']);

      if (yv.utils.qs['yv-sms'])
          categoriesForm += '&yv-sms=' + encodeURIComponent(yv.utils.qs['yv-sms']);

      if (yv.utils.qs['yv-nps-score'])
          categoriesForm += '&yv-nps-score=' + encodeURIComponent(yv.utils.qs['yv-nps-score']);

      if (yv.utils.qs['yv-rr'])
          categoriesForm += '&yv-rr=' + encodeURIComponent(yv.utils.qs['yv-rr']);

      if (yv.productId)
          categoriesForm += '&productId=' + yv.productId;
      else {
          if (yv.utils.qs["productId"]) {
              yv.productId = yv.utils.qs["productId"];
              categoriesForm += '&productId=' + yv.productId;
          }
          else if (yv.utils.qs["idproduto"]) {
              yv.productId = yv.utils.qs["idproduto"];
              categoriesForm += '&productId=' + yv.productId;
          }
      }

      if (yv.utils.qs['yv-srr']) {
          categoriesForm += '&yv-srr=' + encodeURIComponent(yv.utils.qs['yv-srr']);
          urlreviewform = '/reviewform/getstorereviewform';
      }
      //#endregion

      njQuery.jsonpx(yv.uriBuilder.general(urlreviewform, categoriesForm), function (r) {

          //Exibe o formulário recebido
          njQuery('#yv-show-form').html(r.html);

          //Inicia tracking de eventos do formulário
          yv.analyticsSupport.startReviewFormAnalytics();

          //Ajusta label das estrelas
          yv.commom.startStarLabel();

          //Carrega social login
          yv.social.loadSocialLogin();

          //Carrega componente de upload
          if (typeof yv.uploader !== 'undefined')
              yv.uploader.startUploader();

          //Exibe/esconde dicas para escrever review
          njQuery(".yv-panel-review-comment").hide();
          njQuery("[name='review-comment']").focus(function () { njQuery(".yv-panel-review-comment").show() });
          njQuery("[name='review-comment']").focusout(function () { njQuery(".yv-panel-review-comment").hide() });

          //Se ainda não foi, faz o scroll para o form aberto
          if (!doNotScroll)
              yv.utils.goTo('#yv-form');

          //Salvar review
          njQuery('#yv-sendform').click(function (r) {
              yv.review.saveReview(this, r);
          });

          njQuery('#yv-sendstoreform').click(function (r) {
              yv.review.saveReviewStore(this, r);

          });

          if (yv.utils.qs['yv-sc'])
              njQuery('#star' + yv.utils.qs['yv-sc']).prop("checked", true);

          if (yv.utils.qs['yv-nps-score']) {
              var input = njQuery('.nps .yv-radio-inline:contains("' + yv.utils.qs['yv-nps-score'] + '"):first input');
              if (input)
                  input.prop("checked", true);
          }
      })
          .fail(function (jqXHR, textStatus, err) {
              njQuery(this).removeAttr("disabled");
              njQuery('#yv-show-form').html('<div class="yv-bootstrap"><div style="background-color:white; padding:30px; height:300px">' + yv.localization.genericError + '<br><br><button onclick="window.location.reload()" class="yv-btn yv-btn-default yv-writereview">' + yv.localization.tryAgain + '</button></div></div>');

              var additionalError = '[{err: "' + encodeURIComponent(textStatus) + '"}]';
              yv.analyticsSupport.trackWriteReview('reviewform-error', additionalError);
          });
  },

  gotoWriteReview: function () {
      if (yv.utils.qs['yv-write-review']) {
          this.showWriteReview();
          yv.analyticsSupport.trackWriteReview('clickEmail');
      }
  },

  loadReviewPhotoGrid: function () {
      var anchor = njQuery('.yv-photogrid-anchor');
      if (anchor.length) {
          var qtd = anchor.attr('data-qty');
          var ids = { qty: qtd };
          var uri = yv.uriBuilder.general('/reviewphotos/photogrid', '&' + njQuery.param(ids, true));

          njQuery.jsonpx(uri, function (r) {
              if (r && r.html) {
                  anchor.html(r.html);
              }
          });
      }
  },

  loadRichSnippets: function () {

      var uri = yv.uriBuilder.generalSecondary('/review/richsnippetsubstitute/').replace('callback=?','') + '&productStoreId=' + yv.productId
      njQuery.ajax({
        url:uri,
        type:"POST",
        data: JSON.stringify({currentJson : encodeURIComponent(njQuery('[type="application/ld+json"]:contains("Product")').text()) }),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(r){
          njQuery('[type="application/ld+json"]:contains("Product")').text(r);
        }
      })
      
  }
}

  yv.social = {
  loadSocialLogin: function () {
      njQuery('.yv-google-login').click(function (event) {
          yv.social.socialLoginClick(this, event, 'google');
      });

      njQuery('.yv-fb-login').click(function (event) {
          yv.social.socialLoginClick(this, event, 'facebook');
      });

      njQuery('.yv-social-logout').click(function (e) {
          e.preventDefault();
          var loadingElement = njQuery(this).parents('.yv-logged');

          //Chama backend para buscar novo cookie de UserCandidate
          yv.utils.toggleLoading(false, loadingElement);
          njQuery.jsonpx(yv.uriBuilder.general('/user/logout'), function (r) {
              //Após logout, exibe login novamente
              yv.social.userLogout(loadingElement.parent());
              yv.utils.toggleLoading(true, loadingElement);
          })
          .fail(function () { yv.utils.toggleLoading(true, loadingElement); loadingElement.text('Erro. Tente novamente mais tarde'); });
      });

      njQuery('.yv-user-name').focus(function (e) {            
          njQuery(this).parents('.yv-login').find('.yv-user-email:hidden').parents('div:hidden').show(500);
      });

      njQuery('[name="user-email"]').focus(function (e) {
          njQuery(this).siblings('.yv-help-valid').hide();
          njQuery(this).parent('div').removeClass('yv-has-error');
      });

      njQuery('[name="yv-user-phone"]').focus(function (e) {
          njQuery(this).siblings('.yv-help-valid').hide();
          njQuery(this).parent('div').removeClass('yv-has-error');
      });

      njQuery('[name="user-name"]').focus(function (e) {
          njQuery(this).siblings('.yv-help-valid').hide();
          njQuery(this).parent('div').removeClass('yv-has-error');
      });

      njQuery('.yv-user-phone').mask('(00) 0000-00009');

      njQuery('.yv-user-image[src*="genericuser."]').tooltip({ placement: 'yv-bottom', title: yv.localization.socialConnect });
  },

  socialLoginClick: function (clicked, e, network) {
      e.preventDefault();


      var listenerSocial = function (message) {
          if (message && message.origin && message.origin.indexOf('service.yourviews.com.br') > -1) {
              if (message.data && message.data.length) {
                  window.removeEventListener("message", listenerSocial, false);
                  localStorage.setItem('__yv_xauth', message.data);

                  var uri = yv.uriBuilder.general('/user/getuser', '&loadsocialnetworks=true');
                  var loadingElement = njQuery(clicked).parents('.yv-login');
                  yv.utils.toggleLoading(false, loadingElement);
                  njQuery.jsonpx(uri, function (res) {
                      if (res && res.hasResults) {
                          localStorage.setItem("__yv_user", res.html);
                          yv.social.socialLoginParse(clicked, njQuery.parseJSON(res.html), network);
                      }
                      yv.utils.toggleLoading(true, loadingElement);
                  });
              }
          }
      }

      window.addEventListener("message", listenerSocial, false);

      var uri = yv.uriBuilder.general('/User/SocialLogin', '&network=' + network);
      var child = window.open(uri, "_blank", "height=600,width=800");
             

   /*   var loginInterval = setInterval(function () {
          if (child.closed) { //Janela de autenticação foi fechada...
              clearInterval(loginInterval);

              //Verifica se tem as informações do usuário...
              var uri = yv.uriBuilder.general('/user/getuser');
              var loadingElement = njQuery(clicked).parents('.yv-login');
              yv.utils.toggleLoading(false, loadingElement);
              njQuery.jsonpx(uri, function (res) {
                  if (res && res.hasResults) {
                      yv.social.socialLoginParse(clicked, njQuery.parseJSON(res.html), network);
                  }
                  yv.utils.toggleLoading(true, loadingElement);
              });
          }
      }, 200); */
  },

  userLogout: function (ctxElement) {
      var userElement = njQuery(ctxElement).find('.yv-login');

      njQuery(userElement).find('[name="user-logintype"]').val('email');

      njQuery(userElement).find('[name="user-name"],[name="yv-exhibition-name"]').val('');
      njQuery(userElement).find('[name="user-email"]').val('');
      njQuery(userElement).find('[name="yv-user-phone"]').val('');
      njQuery(userElement).find('[name="user-image"]').val('');

      

      njQuery(ctxElement).find('[name="yv-exhibition-name"]').val('');

      var userLogged = njQuery(ctxElement).find('.yv-logged');
      njQuery(userLogged).find('.yv-user-image').attr("src", '');

      njQuery(userElement).show();
      njQuery(userLogged).hide();
  },

  socialLoginParse: function (element, user, network) {
      if (user != null && user) {
          var userElement = njQuery(element).parents('.yv-login:visible');
          if (userElement.length) {
              njQuery(userElement).find('[name="user-logintype"]').val(network);

              //Preenche os campos de formulário associado ao clique   
              njQuery(userElement).find('[name="user-email"]').val(user.Email);
              if (user.ImageUrl) {
                  njQuery(userElement).find('[name="user-image"]').val(user.ImageUrl);
                  njQuery(userLogged).find('.yv-user-image').attr("src", user.ImageUrl);
              }
              //Preenche os campos visuais de login
              var userLogged = njQuery(userElement).siblings('.yv-logged');

              //njQuery(userLogged).find('.yv-user-name').text(user.Name);
              //njQuery(userLogged).find('.yv-user-email').text(user.Name);

              //Muda a exibição para usuário logado
              njQuery(userElement).hide();
              njQuery(userLogged).show();
          }

          userElement = njQuery(element).parents('.yv-login-frame:visible');
          if (userElement.length && user.ImageUrl) {
              userElement.find('.yv-user-image').attr("src", user.ImageUrl);
              userElement.find('.yv-show-socialmedia').hide();
              var exhibName = userElement.find('[name="yv-exhibition-name"]');
              if (exhibName.val().length == 0) //Apenas altera nome se não houver escrito algum
                  exhibName.val(user.Name);
          }
      }
  }
}

  yv.commom = {
  toggleViewMore: function () {
      njQuery('.yv-viewmore-btn').click(function () {
          //Seleciona a div "pai" do texto, para redimensioná-la.
          var elemToAct = njQuery(this).parent();

          var expanded = njQuery(elemToAct).data("expanded");
          if (!expanded) {
              njQuery(this).html(yv.localization.less);

              elemToAct.find('.yv-viewmore-expanded').show();

              //Salva o height atual
              var originalHeight = elemToAct.css("height");
              njQuery(elemToAct).data("height", originalHeight);

              //Marca como o elemento como expandido
              njQuery(elemToAct).data("expanded", true);

              //Remove o height do elemento, para revelar o texto inteiro
              elemToAct.css("height", "initial");
          }
          else {
              njQuery(this).html(yv.localization.more);
              elemToAct.find('.yv-viewmore-expanded').hide();

              var Height = elemToAct.css("height");
              njQuery(elemToAct).data("height", Height);
              njQuery(elemToAct).data("expanded", false);
          }
      });
  },
  debugIsCorrect: function (element) {
      //Verifica se está no modo debug
      var debug = element.data('debug');
      if (debug && debug == true) {
          if (yv.utils.qs["yv-debug"] != 'true') //Se estiver e não houver querystring, não carrega
          {
              yv.utils.safeLog('Debugging mode for ' + element + ' but no yv-debug querystring.');
              return false;
          }
      }
      return true;
  },

  loadPaging: function (previousCallb, nextCallb, elementToAct, buttonName) {
      var btn = buttonName || '';
      njQuery('.yv-hasresults[data-action="paging-previous' + btn + '"]').click(function (e) {
          e.preventDefault();
          yv.utils.toggleLoading(false, elementToAct);
          yv.utils.goTo(elementToAct);
          njQuery.jsonpx(njQuery(this).data('href') + "&callback=?", function (r) {
              previousCallb(r);
          });
      });

      njQuery('.yv-hasresults[data-action="paging-next' + btn + '"]').click(function (e) {
          e.preventDefault();
          yv.utils.toggleLoading(false, elementToAct);
          yv.utils.goTo(elementToAct);
          njQuery.jsonpx(njQuery(this).data('href') + "&callback=?", function (r) {
              nextCallb(r);
          });
      });
  },

  loadLikeUnlike: function () {
      njQuery('.yv-like').click(function () {
          yv.utils.toggleLoading(false, njQuery(this).parent());
          var rid = njQuery(this).attr('data-yv-rid');
          var action = njQuery(this).attr('data-yv-action');
          var _self = this;
          var uri = yv.uriBuilder.general('/reviewlike/' + action + '/' + rid);

          njQuery.jsonpx(uri, function (r) {
              yv.utils.toggleLoading(true, njQuery(_self).parent());
              if (!r.html)
                  return;
              var parsedResp = njQuery.parseJSON(r.html);
              if (parsedResp)
                  njQuery(_self).children('.yv-like-count').text(parsedResp.count);
          }).fail(function () {
              yv.utils.toggleLoading(true, njQuery(_self).parent());
          });
      });
  },

  getProductDetails: function () {
      var productData = '&productName=' + yv.utils.safeSubstr(yv.productName, 100);
      productData += '&imageUrl=' + yv.utils.safeSubstr(yv.imageUrl, 200);
      productData += '&productPrice=' + yv.utils.safeSubstr(yv.productPrice, 30);
      productData += '&productId=' + yv.utils.safeSubstr(yv.productId, 97);
      productData += '&productUrl=' + yv.utils.safeSubstr(window.location.href, 200);
      return productData;
  },

  startStarLabel: function () {
      njQuery('.yv-star-lbl').hover(function () {
          var textHovered = njQuery(this).attr('title');
          njQuery(this).parent().siblings('.yv-star-description').html(textHovered);
      }, function () {
        
          var inputProductStore = njQuery(this).parent().find('.inputIdProductStore').val();
          var toSearchInput = ".yv-star-radio:checked ";
          var toSearchStarDescription = ".yv-star-description ";
          if (inputProductStore != undefined && inputProductStore != 0 && inputProductStore != "") {
              toSearchInput += "." + inputProductStore;
              toSearchStarDescription += "." + inputProductStore;
          }
             

          var optionSelected = njQuery(this).parent().find(toSearchInput);
          var starDescription = njQuery(this).parent().siblings(toSearchStarDescription);
          if (optionSelected.length > 0) {
              var textToSet = optionSelected.next().attr('title');
              starDescription.html(textToSet);
          }
          else
              starDescription.html('');
      })
  },

  yvData: function () {
      //window.yv = window.yv || [];
      window.yv.serviceAddr = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'service.yourviews.com.br';
      window.yv.staticServiceAddr = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'staticfiles.yviews.com.br';
      window.yv.productUrl = window.location.href; //TODO: analisar a remoção desse parâmetro
      window.yv.secondaryAddr = 'https://service2.yourviews.com.br';
      yv.uriBuilder = {
          generalNoCb: function (action, parameters) {
              return yv.serviceAddr + action + "?storeKey=" + yv.storeKey + parameters;
          },
          general: function (action, parameters) {
              var caching = '';
              if (yv.utils.qs['yv-cache'])
                  caching = "&yv-cache=" + yv.utils.getRandom();
              
              var templatePreview = '';
              if (yv.utils.qs['yv-preview'])
                  templatePreview = "&yv-preview=" + yv.utils.qs['yv-preview'];

              return yv.serviceAddr + action + "?storeKey=" + yv.storeKey + (parameters ? parameters : '')
                  + caching
                  + templatePreview
                  + '&callback=?';
          },
          generalSecondary: function (action, parameters) {
              var caching = '';
              if (yv.utils.qs['yv-cache'])
                  caching = "&yv-cache=" + yv.utils.getRandom();

              var templatePreview = '';
              if (yv.utils.qs['yv-preview'])
                  templatePreview = "&yv-preview=" + yv.utils.qs['yv-preview'];

              return yv.secondaryAddr + action + "?storeKey=" + yv.storeKey + (parameters ? parameters : '')
                  + caching
                  + templatePreview
                  + '&callback=?';
          }
      };
  },

  setInitialData: function () {
      yv.storeKey = '721d9db9-f39a-40a1-8082-11073f76cb24';
      yv.debug = false;

      yv.commom.yvData();
  }
}

  yv.vendorCustom = {
  quickReviewGetIds: function () {
      var quickReview = yv.vendorCustom.quickReviewSetup()
      var quickReviewAsync = yv.vendorCustom.quickReviewSetupAsync()
      
      if (quickReviewAsync) {
          return jQuery.merge(quickReview, quickReviewAsync)
      } else {
          return quickReview
      }
      
  },
  quickReviewSetResult: function (current) {
      yv.listproduct_destination = yv.listproduct_destination || '.yv-review-quickreview[value="{productid}"]';
      var foundElement = njQuery(yv.listproduct_destination.replace('{productid}', current.productId));
      foundElement.html(current.data);
  },
  quickReviewSetup: function () {
      var allShelfs = jQuery('.product .image img');
  
      if (!allShelfs || allShelfs.length == 0) return;
  
      var allIds = allShelfs.map(function (i, e) {
          var shelf = jQuery(e);
          
          if (shelf && shelf.attr('data-src')) {
              var id = shelf.attr('data-src').split('_').splice(-3, 1).pop()
              
              if (!shelf.parents('.product').find('.yv-review-quickreview').length) {
                  shelf.parents('.product')
                      .find('.product-name')
                      .before('<div class="yv-review-quickreview" value="' + id + '"></div>');    
              }
              
              return id;
          }
      });
      
      return allIds;
  },
  quickReviewSetupAsync: function() {
      var allShelfs = jQuery('.hintup-item .hintup-image img');
  
      if (!allShelfs || allShelfs.length == 0) return;
  
      var allIds = allShelfs.map(function (i, e) {
          var shelf = jQuery(e);
          
          if (shelf && shelf.attr('data-src')) {
              var id = shelf.attr('data-src').split('_').splice(-3, 1).pop()
              
              if (!shelf.parent().siblings('.yv-review-quickreview').length) {
                  shelf.parents()
                      .siblings('.hintup-name')
                      .before('<div class="yv-review-quickreview" value="' + id + '"></div>');    
              }
              
              return id;
          }
      });
      
      return allIds;
  },
  searchQuickReview: function () {
      var quickReviewEvent = new Event('yv-quickreview')
      
      var timer = setInterval(function() {
          var quickReviewShelfs = yv.vendorCustom.quickReviewGetIds()
          var emptyShelfs = jQuery('.yv-review-quickreview:empty')
          window.alreadyLoadedItems = window.alreadyLoadedItems || []
          
          if (emptyShelfs.length > 0 && window.alreadyLoadedItems.length !== quickReviewShelfs.length) {
              window.alreadyLoadedItems = []
              document.dispatchEvent(quickReviewEvent)
          }
      }, 500)        
  },
  quickReviewProdElement: function () {
      return "#yv-review-quickreview";
  },
  reviewsElement: function () {
      return "#yv-reviews";
  },
  QaElement: function () {
      return ".yv-qa";
  },
  quickReviewProdBefore: function () {

  },
  reviewsBefore: function () {

  },
  eventListener: function() {
      document.addEventListener('yv-quickreview', function() {
          if (typeof yv.quickReview !== 'undefined') yv.quickReview.startQuickReview()
      })
  },
  initialSetup: function () {    
      if (jQuery('html.page-product').length) {
          // informações sobre o produto
          yv.productId = jQuery('#form_comprar').attr('action').split('=').splice(-1, 1).pop()
          yv.productName = jQuery('h1.product-name').text().trim()
          yv.productPrice = jQuery('#variacaoPreco').text()
          yv.imageUrl = jQuery('.box-img .zoom img').attr('src')
          yv.categoryForm = jQuery('.breadcrumb-item a').map(function (i, v) { 
              return jQuery(v).text()
          }).get()
          
          // âncora de avaliações
          jQuery('h1.product-name')
              .append('<div id="yv-review-quickreview"></div>')
          
          // avaliações e pergunstas e respostas
          jQuery('.page-product .description')
              .after('<div id="yv-reviews"></div><div class="yv-qa"></div>')
      }
      
      // depoimentos dos clientes
      if (jQuery('.section-avaliacoes').length) {
          jQuery('.section-avaliacoes')
              .html('<div class="yv-testimonial" style="display: none;" data-qty="9"></div>')
              
      } else if (jQuery('main.site-main .page-content .container #product-container').length) {
          jQuery('main.site-main .page-content .container #product-container')
              .append('<div class="section-avaliacoes"><div class="yv-testimonial" style="display: none;" data-qty="9"></div></div>')
      
      } else if (jQuery('main.site-main .page-content .container:first').length) {
          jQuery('main.site-main .page-content .container:first')
              .append('<div class="section-avaliacoes"><div class="yv-testimonial" style="display: none;" data-qty="9"></div></div>')
      }
      
      // faz a busca/insere as estrelas nas prateleiras
      this.eventListener()
      this.searchQuickReview()
      
      // insere selo de loja confiável
      jQuery('.footer ul.foo-seals')
          .append('<a href="https://www.lojaconfiavel.com/dinuevo" class="ts-footerstamp" data-lcname="dinuevo" target="_blank"><img src="//service.yourviews.com.br/Image/721d9db9-f39a-40a1-8082-11073f76cb24/Footer.jpg" title="Loja Confiável" alt="Loja Confiável" style="image-rendering: auto; width: 75px; height: auto;"/></a>')
  },
  sendAnalytics: function () {
      return false;
  }
}

  yv.analytics = {
  supported: function () { //TODO: remover essas dependencias no futuro.
      //Requires IE 8+, jQuery and Tag Manager
      return (typeof (window.jQuery) !== 'undefined' &&
              typeof (yv.vendorCustom.sendAnalytics) !== 'undefined' &&
              yv.vendorCustom.sendAnalytics() &&
              typeof (JSON) !== "undefined" && typeof (JSON.stringify) !== "undefined");
  },

  getData: function () {
      var dataToSend = [];

      //Fetch data from tag manager
      if (typeof (dataLayer) !== 'undefined') {
          jQuery.each(dataLayer, function (i, v) {
              if (!v.event || v.event.indexOf('gtm') == -1) dataToSend.push(v);
          });
      }

      //Send some customized, vendor specific info, if necessary        
      var custom = yv.vendorCustom.getCustomAnalytics ? yv.vendorCustom.getCustomAnalytics() : null;
      if (custom)
          dataToSend.push(custom);

      //Transform into JSON
      var additData = encodeURIComponent(JSON.stringify(dataToSend));

      return additData;
  },

  getCategory: function () {
      var result = null;

      if (typeof dataLayer === 'undefined') return result; //GTM not loaded yet

      if (yv.vendorCustom.getAnalyticsCategory)
          result = yv.vendorCustom.getAnalyticsCategory(dataLayer);
      else {
          jQuery.each(dataLayer, function (i, v) {
              if (typeof v.event != 'undefined' && v.event.indexOf('gtm') == -1)
                  result = v.event;
          });
      }

      return result;
  },

  start: function () {
      if (!yv.analytics.supported()) return;

      var n = null;
      var t = 0;
      //Wait a few time for loading tag manager
      var tmr = window.setInterval(function () {
          n = yv.analytics.getCategory();
          t++;

          if (n != null || t >= 100) { //20 seconds

              window.clearInterval(tmr);
              var url = window.yv.uriBuilder.general('/tracking', '&n=' + yv.analytics.getCategory() + '&ts=analytics&d=' + yv.analytics.getData());
              (new Image()).src = url;               
          }

      }, 200);
  }
};


  yv.analyticsSupport = {
  trackScrollReview: function () {
      njQuery(window).bind('scroll.yvreviewscroll', function () {
          var itm = njQuery('#yv-show-reviews .yv-row:first');
          if (itm.length == 0) return;
          var hT = itm.offset().top,
              hH = itm.outerHeight(),
              wH = njQuery(window).height(),
              wS = njQuery(this).scrollTop();
          if (wS > (hT + hH - wH)) {
              njQuery(window).unbind('.yvreviewscroll');

              var ids = njQuery('*[data-yv-action="like"]').map(function () {
                  return njQuery(this).data('yv-rid');
              }).get();

              var readedReviews = JSON.stringify(ids);
              yv.analyticsSupport.trackEvent('readreview', 'review', null, readedReviews);
          }
      });
  },
  trackEvent: function (trackname, tracksystem, additionalData, readedReviewIds) {
      var dataToSend = '&n=' + trackname + '&ts=' + tracksystem + '&g=' + yv.utils.qs['yv-write-review'];
      if (additionalData)
          dataToSend += '&d=' + additionalData;
      if (readedReviewIds)
          dataToSend += '&rr=' + readedReviewIds;
      (new Image()).src = yv.uriBuilder.general('/Tracking', dataToSend);
  },

  init: function () {
      //var url = yv.uriBuilder.general('/tracking/setup',yv.analyticsSupport.getUtms());
      //(new Image()).src = url;
  },

  getUtms: function () {
      var result = '';
      var utms = yv.utils.qs["utm_source"];
      if (utms) result = "&utms=" + utms;

      var utmm = yv.utils.qs["utm_media"];
      if (utmm) result = "&utmm=" + utmm;

      var utmc = yv.utils.qs["utm_campaign"];
      if (utmc) result = "&utmc=" + utmc;
      return result;
  },

  trackWriteReview: function (trackname, additionalData) {
      var dataToSend = "";
      if (trackname.indexOf("Sms") !== -1) {
          dataToSend = '&n=' + trackname + '&ts=sms&g=' + yv.utils.qs['yv-write-review'];
      }           
      else {
          dataToSend = '&n=' + trackname + '&ts=email&g=' + yv.utils.qs['yv-write-review'];
      }
      if (additionalData)
          dataToSend += '&d=' + additionalData;

      (new Image()).src = yv.uriBuilder.general('/tracking', dataToSend);
  },

  startReviewFormAnalytics: function () {
      njQuery('.yv-bootstrap input, .yv-bootstrap textarea, .yv-bootstrap a, .yv-bootstrap button').bind('click', function (e) {
          var elem = njQuery(e.currentTarget);
          var form = njQuery(elem).parents('form');
          if (elem && form && form.length > 0) {
              var formid = form.attr('id');
              var currentForm = njQuery(form).find('input').serialize();
              var interaction = '[{ name: "' + elem.attr('name') + '", type:"' + e.type + '",id:"' + elem.attr('id') + '" ,currentForm: "' + encodeURIComponent(currentForm) + '"}]'
              yv.analyticsSupport.trackWriteReview(formid, interaction);
          }
      });
  },
  internalWriteToGA: function (eventCategory, eventAction, eventLabel, nonInteraction) {
      //old ga.js
      if (window._gaq && window._gat) {
          var oldTrackers = window._gat._getTrackers();
          for (var i = 0; i < oldTrackers.length ; i++) {
              oldTrackers[i]._trackEvent(eventCategory, eventAction, eventLabel, null, nonInteraction);
          }
      }

      //New analytics.js
      var currentGa = window.ga || window[window.GoogleAnalyticsObject] || null;
      if (!currentGa) return;
      var allGAs = currentGa.getAll();
      var eventType = 'event';
      for (var i = 0; i < allGAs.length; i++) {
          allGAs[i].send(eventType, eventCategory, eventAction, eventLabel, {
              nonInteraction: nonInteraction
          });
      }
  },
  writeToGA: function (eventAction, eventLabel) {
      yv.analyticsSupport.internalWriteToGA("Yourviews", eventAction, eventLabel, false);
  },
  writeToGANonInteractive: function (eventAction, eventLabel) {
      yv.analyticsSupport.internalWriteToGA("Yourviews", eventAction, eventLabel, true);
  },
  startABTest: function () {
      var abTest = window.yv.abTest || {};
      abTest.enabled = '/*replace yv_abtest_enabled/*';

      if (abTest && abTest.enabled == 'true') {
          njQuery.jsonpx(yv.uriBuilder.general('/script/checkabtest'), function (resp) {
              if (resp) {
                  if (resp.html === '2') {
                      if (typeof yv.vendorCustom.runTestGroup != 'undefined') {
                          yv.vendorCustom.runTestGroup();
                      }
                      var custom_css = njQuery("<link>", {
                          rel: "stylesheet",
                          type: "text/css",
                          href: yv.uriBuilder.general("/script/abteststyle")
                      });
                      document.head.appendChild(custom_css[0]);

                      yv.analyticsSupport.writeToGANonInteractive("ABTest", "Test B");
                  }
                  else {
                      yv.analyticsSupport.writeToGANonInteractive("ABTest", "Test A");
                  }
              }
          });
      }
  },
  trackAnswer: function (trackname, additionalData) {
      var dataToSend = "";
      dataToSend = '&n=' + trackname + '&ts=Question&g=' + yv.utils.qs['yv-write-answer'];
      if (additionalData)
          dataToSend += '&d=' + additionalData;
      (new Image()).src = yv.uriBuilder.general('/tracking', dataToSend);
  },
};

  yv.utils = {

  qs: (function (a) {
      if (a === "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
          var p = a[i].split('=');
          if (p.length !== 2) continue;
          var replaced = p[1].replace(/\+/g, " ");
          var decodedVal = '';
          try {
              decodedVal = decodeURIComponent(replaced);
          } catch (e) {
             // safeLog('Error when decoding string. Using default instead.');
          }
          b[p[0]] = decodedVal;
      }
      return b;
  })(window.location.search.substr(1).split('&')),   

  safeLog: function (msg) {
      if (typeof console !== 'undefined' && window.console && window.console.log)
          console.log("[Yourviews] " + msg);
  },

  safeSubstr: function (val, len) {
      var result = '';
      if (typeof val != 'undefined' && val) {
          if (val.length > len)
              result = val.substr(0, len) + '...';
          else
              result = val;
      }
      result = result.replace(/<(?:.|\n)*?>/gm, '');
      result = encodeURIComponent(result);
      return result;
  },

  goTo: function (element) {
      var offset = njQuery(element).offset();
      if (!offset) return;

      njQuery('html, body').animate({
          scrollTop: njQuery(element).offset().top - 200
      }, 500);
  },

  debugLog: function (msg) {
      if (typeof console !== 'undefined' && window.console && window.console.log && yv.utils.qs["yv-debug"] === 'true')
          console.log("[Yourviews debug] " + msg);
  },

  toggleLoading: function (hide, element) {
      var elementToAttach = element || '.yv-main';

      if (!hide) {
          var loadingCss = "<div id='yv-loading-main'><img src='" + yv.staticServiceAddr + "/static/images/loading.gif'/></div>";
          njQuery(loadingCss).css({
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              background: "white",

          }).appendTo(njQuery(elementToAttach).css("position", "relative"));
      }
      else {
          njQuery(elementToAttach).find('#yv-loading-main').remove();
          njQuery(elementToAttach).css("position", "")
      }
  },

  getRandom: function () {
      var min = 1000000000000;
      var max = 9999999999999;
      return Math.round(Math.random() * (max - min) + min);
  }
};

  yv.libraries = {
  loadComponents: function () {
      yv.libraries.BootstrapJS();
      yv.libraries.Css();
  },

  BootstrapJS: function () {
      //#region jsonpx
      (function ($) {
          // ###################### UTILITIES ##

          // Noop
          function noop() {
          }

          // Generic callback
          function genericCallback(data) {
              lastValue = [data];
          }

          // Call if defined
          function callIfDefined(method, object, parameters) {
              return method && method.apply(object.context || object, parameters);
          }

          // Give joining character given url
          function qMarkOrAmp(url) {
              return /\?/.test(url) ? "&" : "?";
          }

          var // String constants (for better minification)
              STR_ASYNC = "async",
              STR_CHARSET = "charset",
              STR_EMPTY = "",
              STR_ERROR = "error",
              STR_INSERT_BEFORE = "insertBefore",
              STR_JQUERY_JSONP = "_jqjsp",
              STR_ON = "on",
              STR_ON_CLICK = STR_ON + "click",
              STR_ON_ERROR = STR_ON + STR_ERROR,
              STR_ON_LOAD = STR_ON + "load",
              STR_ON_READY_STATE_CHANGE = STR_ON + "readystatechange",
              STR_READY_STATE = "readyState",
              STR_REMOVE_CHILD = "removeChild",
              STR_SCRIPT_TAG = "<script>",
              STR_SUCCESS = "success",
              STR_TIMEOUT = "timeout",

              // Window
              win = window,
              // Deferred
              Deferred = $.Deferred,
              // Head element
              head = $("head")[0] || document.documentElement,
              // Page cache
              pageCache = {},
              // Counter
              count = 0,
              // Last returned value
              lastValue,

              // ###################### DEFAULT OPTIONS ##
              xOptionsDefaults = {
                  //beforeSend: undefined,
                  //cache: false,
                  callback: STR_JQUERY_JSONP,
                  //callbackParameter: undefined,
                  //charset: undefined,
                  //complete: undefined,
                  //context: undefined,
                  //data: "",
                  //dataFilter: undefined,
                  //error: undefined,
                  //pageCache: false,
                  //success: undefined,
                  //timeout: 0,
                  //traditional: false,
                  url: location.href
              },

              // opera demands sniffing :/
              opera = win.opera,

              // IE < 10
              oldIE = !!$("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;

          // ###################### MAIN FUNCTION ##
          function jsonp(xOptions) {

              // Build data with default
              xOptions = $.extend({}, xOptionsDefaults, xOptions);

              // References to xOptions members (for better minification)
              var successCallback = xOptions.success,
                  errorCallback = xOptions.error,
                  completeCallback = xOptions.complete,
                  dataFilter = xOptions.dataFilter,
                  callbackParameter = xOptions.callbackParameter,
                  successCallbackName = xOptions.callback,
                  cacheFlag = xOptions.cache,
                  pageCacheFlag = xOptions.pageCache,
                  charset = xOptions.charset,
                  url = xOptions.url,
                  data = xOptions.data,
                  timeout = xOptions.timeout,
                  pageCached,

                  // Abort/done flag
                  done = 0,

                  // Life-cycle functions
                  cleanUp = noop,

                  // Support vars
                  supportOnload,
                  supportOnreadystatechange,

                  // Request execution vars
                  firstChild,
                  script,
                  scriptAfter,
                  timeoutTimer;

              // If we have Deferreds:
              // - substitute callbacks
              // - promote xOptions to a promise
              Deferred && Deferred(function (defer) {
                  defer.done(successCallback).fail(errorCallback);
                  successCallback = defer.resolve;
                  errorCallback = defer.reject;
              }).promise(xOptions);

              // Create the abort method
              xOptions.abort = function () {
                  !(done++) && cleanUp();
              };

              // Call beforeSend if provided (early abort if false returned)
              if (callIfDefined(xOptions.beforeSend, xOptions, [xOptions]) === !1 || done) {
                  return xOptions;
              }

              // Control entries
              url = url || STR_EMPTY;
              data = data ? ((typeof data) === "string" ? data : $.param(data, xOptions.traditional)) : STR_EMPTY;

              // Build final url
              url += data ? (qMarkOrAmp(url) + data) : STR_EMPTY;

              // Add callback parameter if provided as option
              callbackParameter && (url += qMarkOrAmp(url) + encodeURIComponent(callbackParameter) + "=?");

              // Add anticache parameter if needed
              !cacheFlag && !pageCacheFlag && (url += qMarkOrAmp(url) + "_" + (new Date()).getTime() + "=");

              // Replace last ? by callback parameter
              url = url.replace(/=\?(&|$)/, "=" + successCallbackName + "$1");

              // Success notifier
              function notifySuccess(json) {

                  if (!(done++)) {

                      cleanUp();
                      // Pagecache if needed
                      pageCacheFlag && (pageCache[url] = { s: [json] });
                      // Apply the data filter if provided
                      dataFilter && (json = dataFilter.apply(xOptions, [json]));
                      // Call success then complete
                      callIfDefined(successCallback, xOptions, [json, STR_SUCCESS, xOptions]);
                      callIfDefined(completeCallback, xOptions, [xOptions, STR_SUCCESS]);

                  }
              }

              // Error notifier
              function notifyError(type) {

                  if (!(done++)) {

                      // Clean up
                      cleanUp();
                      // If pure error (not timeout), cache if needed
                      pageCacheFlag && type != STR_TIMEOUT && (pageCache[url] = type);
                      // Call error then complete
                      callIfDefined(errorCallback, xOptions, [xOptions, type]);
                      callIfDefined(completeCallback, xOptions, [xOptions, type]);

                  }
              }

              // Check page cache
              if (pageCacheFlag && (pageCached = pageCache[url])) {

                  pageCached.s ? notifySuccess(pageCached.s[0]) : notifyError(pageCached);

              } else {

                  // Install the generic callback
                  // (BEWARE: global namespace pollution ahoy)
                  win[successCallbackName] = genericCallback;

                  // Create the script tag
                  script = $(STR_SCRIPT_TAG)[0];
                  script.id = STR_JQUERY_JSONP + count++;

                  // Set charset if provided
                  if (charset) {
                      script[STR_CHARSET] = charset;
                  }

                  opera && opera.version() < 11.60 ?
                      // onerror is not supported: do not set as async and assume in-order execution.
                      // Add a trailing script to emulate the event
                      ((scriptAfter = $(STR_SCRIPT_TAG)[0]).text = "document.getElementById('" + script.id + "')." + STR_ON_ERROR + "()")
                      :
                      // onerror is supported: set the script as async to avoid requests blocking each others
                      (script[STR_ASYNC] = STR_ASYNC)

                      ;

                  // Internet Explorer: event/htmlFor trick
                  if (oldIE) {
                      script.htmlFor = script.id;
                      script.event = STR_ON_CLICK;
                  }

                  // Attached event handlers
                  script[STR_ON_LOAD] = script[STR_ON_ERROR] = script[STR_ON_READY_STATE_CHANGE] = function (result) {

                      // Test readyState if it exists
                      if (!script[STR_READY_STATE] || !/i/.test(script[STR_READY_STATE])) {

                          try {

                              script[STR_ON_CLICK] && script[STR_ON_CLICK]();

                          } catch (_) { }

                          result = lastValue;
                          lastValue = 0;
                          result ? notifySuccess(result[0]) : notifyError(STR_ERROR);

                      }
                  };

                  // Set source
                  script.src = url;

                  // Re-declare cleanUp function
                  cleanUp = function (i) {
                      timeoutTimer && clearTimeout(timeoutTimer);
                      script[STR_ON_READY_STATE_CHANGE] = script[STR_ON_LOAD] = script[STR_ON_ERROR] = null;
                      head[STR_REMOVE_CHILD](script);
                      scriptAfter && head[STR_REMOVE_CHILD](scriptAfter);
                  };

                  // Append main script
                  head[STR_INSERT_BEFORE](script, (firstChild = head.firstChild));

                  // Append trailing script if needed
                  scriptAfter && head[STR_INSERT_BEFORE](scriptAfter, firstChild);

                  // If a timeout is needed, install it
                  timeoutTimer = timeout > 0 && setTimeout(function () {
                      notifyError(STR_TIMEOUT);
                  }, timeout);

              }

              return xOptions;
          }

          // ###################### SETUP FUNCTION ##
          jsonp.setup = function (xOptions) {
              $.extend(xOptionsDefaults, xOptions);
          };

          // ###################### INSTALL in jQuery ##
          $.jsonp = jsonp;

      })(njQuery);

      njQuery.jsonpx = function (uri, success) {

          uri = uri.replace('&callback=', '&yv__rpl=');

          if (yv.utils.qs["yv-test"] == 'true')
              uri += '&yv-test=true';

          // uri += '&yv_c=' + yv.vendorCustom.rndNumber();

          return njQuery.ajax({
              url: uri,
              beforeSend: function (xhr) {
                  if (localStorage.getItem('__yv_xauth')) {
                      xhr.setRequestHeader('X-YV-Auth', localStorage.getItem('__yv_xauth'));
                  }
              }
          })
              .done(function (r, x, v) {
                  if (v.getResponseHeader('x-yv-auth')) {
                      localStorage.setItem('__yv_xauth', v.getResponseHeader('x-yv-auth'));
                  }
                  success(r);
              });
      };

      //#endregion

      //#region: Bootstrap Dropdrown
      /* ========================================================================
       * Bootstrap: dropdown.js v3.1.1
       * http://getbootstrap.com/javascript/#dropdowns
       * ========================================================================
       * Copyright 2011-2014 Twitter, Inc.
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
       * ======================================================================== */
      +function ($) {
          'use strict';

          // DROPDOWN CLASS DEFINITION
          // =========================

          var backdrop = '.dropdown-backdrop'
          var toggle = '.yv-bootstrap [data-toggle=dropdown]'
          var Dropdown = function (element) {
              $(element).on('click.bs.dropdown', this.toggle)
          }

          Dropdown.prototype.toggle = function (e) {
              var $this = $(this)

              if ($this.is('.disabled, :disabled')) return

              var $parent = getParent($this)
              var isActive = $parent.hasClass('yv-open')

              clearMenus()

              if (!isActive) {
                  if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                      // if mobile we use a backdrop because click events don't delegate
                      $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
                  }

                  var relatedTarget = { relatedTarget: this }
                  $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

                  if (e.isDefaultPrevented()) return

                  $parent
                      .toggleClass('yv-open')
                      .trigger('shown.bs.dropdown', relatedTarget)

                  $this.trigger('focus')
              }

              return false
          }

          Dropdown.prototype.keydown = function (e) {
              if (!/(38|40|27)/.test(e.keyCode)) return

              var $this = $(this)

              e.preventDefault()
              e.stopPropagation()

              if ($this.is('.disabled, :disabled')) return

              var $parent = getParent($this)
              var isActive = $parent.hasClass('yv-open')

              if (!isActive || (isActive && e.keyCode == 27)) {
                  if (e.which == 27) $parent.find(toggle).trigger('focus')
                  return $this.trigger('click')
              }

              var desc = ' li:not(.divider):visible a'
              var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

              if (!$items.length) return

              var index = $items.index($items.filter(':focus'))

              if (e.keyCode == 38 && index > 0) index--                        // up
              if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
              if (!~index) index = 0

              $items.eq(index).trigger('focus')
          }

          function clearMenus(e) {
              $(backdrop).remove()
              $(toggle).each(function () {
                  var $parent = getParent($(this))
                  var relatedTarget = { relatedTarget: this }
                  if (!$parent.hasClass('yv-open')) return
                  $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
                  if (e.isDefaultPrevented()) return
                  $parent.removeClass('yv-open').trigger('hidden.bs.dropdown', relatedTarget)
              })
          }

          function getParent($this) {
              var selector = $this.attr('data-target')

              if (!selector) {
                  selector = $this.attr('href')
                  selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
              }

              var $parent = selector && $(selector)

              return $parent && $parent.length ? $parent : $this.parent()
          }


          // DROPDOWN PLUGIN DEFINITION
          // ==========================

          var old = $.fn.dropdown

          $.fn.dropdown = function (option) {
              return this.each(function () {
                  var $this = $(this)
                  var data = $this.data('bs.dropdown')

                  if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
                  if (typeof option == 'string') data[option].call($this)
              })
          }

          $.fn.dropdown.Constructor = Dropdown


          // DROPDOWN NO CONFLICT
          // ====================

          $.fn.dropdown.noConflict = function () {
              $.fn.dropdown = old
              return this
          }


          // APPLY TO STANDARD DROPDOWN ELEMENTS
          // ===================================

          $(document)
              .on('click.bs.dropdown.data-api', clearMenus)
              .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
              .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
              .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

      }(njQuery);
      //#endregion 

      //#region Bootstrap Tooltip
      /* ========================================================================
       * Bootstrap: tooltip.js v3.3.5
       * http://getbootstrap.com/javascript/#tooltip
       * Inspired by the original jQuery.tipsy by Jason Frame
       * ========================================================================
       * Copyright 2011-2015 Twitter, Inc.
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
       * ======================================================================== */


      +function ($) {
          'use strict';

          // TOOLTIP PUBLIC CLASS DEFINITION
          // ===============================

          var Tooltip = function (element, options) {
              this.type = null
              this.options = null
              this.enabled = null
              this.timeout = null
              this.hoverState = null
              this.$element = null
              this.inState = null

              this.init('tooltip', element, options)
          }

          Tooltip.VERSION = '3.3.5'

          Tooltip.TRANSITION_DURATION = 150

          Tooltip.DEFAULTS = {
              animation: true,
              placement: 'top',
              selector: false,
              template: '<div class="yv-tooltip" role="yv-tooltip"><div class="yv-tooltip-arrow"></div><div class="yv-tooltip-inner"></div></div>',
              trigger: 'hover focus',
              title: '',
              delay: 0,
              html: false,
              container: false,
              viewport: {
                  selector: 'body',
                  padding: 0
              }
          }

          Tooltip.prototype.init = function (type, element, options) {
              this.enabled = true
              this.type = type
              this.$element = $(element)
              this.options = this.getOptions(options)
              this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
              this.inState = { click: false, hover: false, focus: false }

              if (this.$element[0] instanceof document.constructor && !this.options.selector) {
                  throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
              }

              var triggers = this.options.trigger.split(' ')

              for (var i = triggers.length; i--;) {
                  var trigger = triggers[i]

                  if (trigger == 'click') {
                      this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
                  } else if (trigger != 'manual') {
                      var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                      var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                      this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                      this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
                  }
              }

              this.options.selector ?
                  (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
                  this.fixTitle()
          }

          Tooltip.prototype.getDefaults = function () {
              return Tooltip.DEFAULTS
          }

          Tooltip.prototype.getOptions = function (options) {
              options = $.extend({}, this.getDefaults(), this.$element.data(), options)

              if (options.delay && typeof options.delay == 'number') {
                  options.delay = {
                      show: options.delay,
                      hide: options.delay
                  }
              }

              return options
          }

          Tooltip.prototype.getDelegateOptions = function () {
              var options = {}
              var defaults = this.getDefaults()

              this._options && $.each(this._options, function (key, value) {
                  if (defaults[key] != value) options[key] = value
              })

              return options
          }

          Tooltip.prototype.enter = function (obj) {
              var self = obj instanceof this.constructor ?
                  obj : $(obj.currentTarget).data('bs.' + this.type)

              if (!self) {
                  self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
                  $(obj.currentTarget).data('bs.' + this.type, self)
              }

              if (obj instanceof $.Event) {
                  self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
              }

              if (self.tip().hasClass('yv-in') || self.hoverState == 'yv-in') {
                  self.hoverState = 'yv-in'
                  return
              }

              clearTimeout(self.timeout)

              self.hoverState = 'yv-in'

              if (!self.options.delay || !self.options.delay.show) return self.show()

              self.timeout = setTimeout(function () {
                  if (self.hoverState == 'yv-in') self.show()
              }, self.options.delay.show)
          }

          Tooltip.prototype.isInStateTrue = function () {
              for (var key in this.inState) {
                  if (this.inState[key]) return true
              }

              return false
          }

          Tooltip.prototype.leave = function (obj) {
              var self = obj instanceof this.constructor ?
                  obj : $(obj.currentTarget).data('bs.' + this.type)

              if (!self) {
                  self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
                  $(obj.currentTarget).data('bs.' + this.type, self)
              }

              if (obj instanceof $.Event) {
                  self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
              }

              if (self.isInStateTrue()) return

              clearTimeout(self.timeout)

              self.hoverState = 'yv-out'

              if (!self.options.delay || !self.options.delay.hide) return self.hide()

              self.timeout = setTimeout(function () {
                  if (self.hoverState == 'yv-out') self.hide()
              }, self.options.delay.hide)
          }

          Tooltip.prototype.show = function () {
              var e = $.Event('show.bs.' + this.type)

              if (this.hasContent() && this.enabled) {
                  this.$element.trigger(e)

                  var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
                  if (e.isDefaultPrevented() || !inDom) return
                  var that = this

                  var $tip = this.tip()

                  var tipId = this.getUID(this.type)

                  this.setContent()
                  $tip.attr('id', tipId)
                  this.$element.attr('aria-describedby', tipId)

                  if (this.options.animation) $tip.addClass('yv-fade')

                  var placement = typeof this.options.placement == 'function' ?
                      this.options.placement.call(this, $tip[0], this.$element[0]) :
                      this.options.placement

                  var autoToken = /\s?auto?\s?/i
                  var autoPlace = autoToken.test(placement)
                  if (autoPlace) placement = placement.replace(autoToken, '') || 'yv-top'

                  $tip
                      .detach()
                      .css({ top: 0, left: 0, display: 'block' })
                      .addClass(placement)
                      .data('bs.' + this.type, this)

                  this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
                  this.$element.trigger('inserted.bs.' + this.type)

                  var pos = this.getPosition()
                  var actualWidth = $tip[0].offsetWidth
                  var actualHeight = $tip[0].offsetHeight

                  if (autoPlace) {
                      var orgPlacement = placement
                      var viewportDim = this.getPosition(this.$viewport)

                      placement = placement == 'yv-bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'yv-top' :
                          placement == 'yv-top' && pos.top - actualHeight < viewportDim.top ? 'yv-bottom' :
                              placement == 'yv-right' && pos.right + actualWidth > viewportDim.width ? 'yv-left' :
                                  placement == 'yv-left' && pos.left - actualWidth < viewportDim.left ? 'yv-right' :
                                      placement

                      $tip
                          .removeClass(orgPlacement)
                          .addClass(placement)
                  }

                  var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

                  this.applyPlacement(calculatedOffset, placement)

                  var complete = function () {
                      var prevHoverState = that.hoverState
                      that.$element.trigger('shown.bs.' + that.type)
                      that.hoverState = null

                      if (prevHoverState == 'yv-out') that.leave(that)
                  }

                  $.support.transition && this.$tip.hasClass('yv-fade') ?
                      $tip
                          .one('bsTransitionEnd', complete)
                          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                      complete()
              }
          }

          Tooltip.prototype.applyPlacement = function (offset, placement) {
              var $tip = this.tip()
              var width = $tip[0].offsetWidth
              var height = $tip[0].offsetHeight

              // manually read margins because getBoundingClientRect includes difference
              var marginTop = parseInt($tip.css('margin-top'), 10)
              var marginLeft = parseInt($tip.css('margin-left'), 10)

              // we must check for NaN for ie 8/9
              if (isNaN(marginTop)) marginTop = 0
              if (isNaN(marginLeft)) marginLeft = 0

              offset.top += marginTop
              offset.left += marginLeft

              // $.fn.offset doesn't round pixel values
              // so we use setOffset directly with our own function B-0
              $.offset.setOffset($tip[0], $.extend({
                  using: function (props) {
                      $tip.css({
                          top: Math.round(props.top),
                          left: Math.round(props.left)
                      })
                  }
              }, offset), 0)

              $tip.addClass('yv-in')

              // check to see if placing tip in new offset caused the tip to resize itself
              var actualWidth = $tip[0].offsetWidth
              var actualHeight = $tip[0].offsetHeight

              if (placement == 'yv-top' && actualHeight != height) {
                  offset.top = offset.top + height - actualHeight
              }

              var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

              if (delta.left) offset.left += delta.left
              else offset.top += delta.top

              var isVertical = /yv-top|yv-bottom/.test(placement)
              var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
              var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

              $tip.offset(offset)
              this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
          }

          Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
              this.arrow()
                  .css(isVertical ? 'yv-left' : 'yv-top', 50 * (1 - delta / dimension) + '%')
                  .css(isVertical ? 'yv-top' : 'yv-left', '')
          }

          Tooltip.prototype.setContent = function () {
              var $tip = this.tip()
              var title = this.getTitle()

              $tip.find('.yv-tooltip-inner')[this.options.html ? 'html' : 'text'](title)
              $tip.removeClass('yv-fade yv-in yv-top yv-bottom yv-left yv-right')
          }

          Tooltip.prototype.hide = function (callback) {
              var that = this
              var $tip = $(this.$tip)
              var e = $.Event('hide.bs.' + this.type)

              function complete() {
                  if (that.hoverState != 'yv-in') $tip.detach()
                  that.$element
                      .removeAttr('aria-describedby')
                      .trigger('hidden.bs.' + that.type)
                  callback && callback()
              }

              //this.$element.trigger(e)

              if (e.isDefaultPrevented()) return

              $tip.removeClass('yv-in')

              $.support.transition && $tip.hasClass('yv-fade') ?
                  $tip
                      .one('bsTransitionEnd', complete)
                      .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                  complete()

              this.hoverState = null

              return this
          }

          Tooltip.prototype.fixTitle = function () {
              var $e = this.$element
              if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
                  $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
              }
          }

          Tooltip.prototype.hasContent = function () {
              return this.getTitle()
          }

          Tooltip.prototype.getPosition = function ($element) {
              $element = $element || this.$element

              var el = $element[0]
              var isBody = el.tagName == 'BODY'

              var elRect = el.getBoundingClientRect()
              if (elRect.width == null) {
                  // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                  elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
              }
              var elOffset = isBody ? { top: 0, left: 0 } : $element.offset()
              var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
              var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

              return $.extend({}, elRect, scroll, outerDims, elOffset)
          }

          Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
              return placement == 'yv-bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                  placement == 'yv-top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                      placement == 'yv-left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

          }

          Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
              var delta = { top: 0, left: 0 }
              if (!this.$viewport) return delta

              var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
              var viewportDimensions = this.getPosition(this.$viewport)

              if (/yv-right|yv-left/.test(placement)) {
                  var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
                  var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
                  if (topEdgeOffset < viewportDimensions.top) { // top overflow
                      delta.top = viewportDimensions.top - topEdgeOffset
                  } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                      delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
                  }
              } else {
                  var leftEdgeOffset = pos.left - viewportPadding
                  var rightEdgeOffset = pos.left + viewportPadding + actualWidth
                  if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                      delta.left = viewportDimensions.left - leftEdgeOffset
                  } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                      delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
                  }
              }

              return delta
          }

          Tooltip.prototype.getTitle = function () {
              var title
              var $e = this.$element
              var o = this.options

              title = $e.attr('data-original-title')
                  || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

              return title
          }

          Tooltip.prototype.getUID = function (prefix) {
              do prefix += ~~(Math.random() * 1000000)
              while (document.getElementById(prefix))
              return prefix
          }

          Tooltip.prototype.tip = function () {
              if (!this.$tip) {
                  this.$tip = $(this.options.template)
                  if (this.$tip.length != 1) {
                      throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
                  }
              }
              return this.$tip
          }

          Tooltip.prototype.arrow = function () {
              return (this.$arrow = this.$arrow || this.tip().find('.yv-tooltip-arrow'))
          }

          Tooltip.prototype.enable = function () {
              this.enabled = true
          }

          Tooltip.prototype.disable = function () {
              this.enabled = false
          }

          Tooltip.prototype.toggleEnabled = function () {
              this.enabled = !this.enabled
          }

          Tooltip.prototype.toggle = function (e) {
              var self = this
              if (e) {
                  self = $(e.currentTarget).data('bs.' + this.type)
                  if (!self) {
                      self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                      $(e.currentTarget).data('bs.' + this.type, self)
                  }
              }

              if (e) {
                  self.inState.click = !self.inState.click
                  if (self.isInStateTrue()) self.enter(self)
                  else self.leave(self)
              } else {
                  self.tip().hasClass('yv-in') ? self.leave(self) : self.enter(self)
              }
          }

          Tooltip.prototype.destroy = function () {
              var that = this
              clearTimeout(this.timeout)
              this.hide(function () {
                  that.$element.off('.' + that.type).removeData('bs.' + that.type)
                  if (that.$tip) {
                      that.$tip.detach()
                  }
                  that.$tip = null
                  that.$arrow = null
                  that.$viewport = null
              })
          }


          // TOOLTIP PLUGIN DEFINITION
          // =========================

          function Plugin(option) {
              return this.each(function () {
                  var $this = $(this)
                  var data = $this.data('bs.tooltip')
                  var options = typeof option == 'object' && option

                  if (!data && /destroy|hide/.test(option)) return
                  if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
                  if (typeof option == 'string') data[option]()
              })
          }

          var old = $.fn.tooltip

          $.fn.tooltip = Plugin
          $.fn.tooltip.Constructor = Tooltip


          // TOOLTIP NO CONFLICT
          // ===================

          $.fn.tooltip.noConflict = function () {
              $.fn.tooltip = old
              return this
          }

      }(njQuery);
      //#endregion

      //#region Modal

      /*
          By André Rinas, www.andreknieriem.de
          Available for use under the MIT License
      */

      ; (function ($, window, document, undefined) {
          'use strict';

          $.fn.simpleLightbox = function (options) {

              var options = $.extend({
                  overlay: true,
                  spinner: true,
                  nav: true,
                  navText: ['&lsaquo;', '&rsaquo;'],
                  captions: true,
                  captionDelay: 0,
                  captionSelector: 'img',
                  captionType: 'attr',
                  captionsData: 'title',
                  captionPosition: 'bottom',
                  close: true,
                  closeText: '×',
                  swipeClose: true,
                  showCounter: true,
                  fileExt: 'png|jpg|jpeg|gif',
                  animationSlide: true,
                  animationSpeed: 250,
                  preloading: true,
                  enableKeyboard: true,
                  loop: true,
                  docClose: true,
                  swipeTolerance: 50,
                  className: 'simple-lightbox',
                  widthRatio: 0.8,
                  heightRatio: 0.9,
                  disableRightClick: false,
                  disableScroll: true,
                  alertError: true,
                  alertErrorMessage: 'Image not found, next image will be loaded',
                  additionalHtml: false
              }, options);

              // global variables
              var touchDevice = ('ontouchstart' in window),
                  pointerEnabled = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
                  touched = function (event) {
                      if (touchDevice) return true;

                      if (!pointerEnabled || typeof event === 'undefined' || typeof event.pointerType === 'undefined')
                          return false;

                      if (typeof event.MSPOINTER_TYPE_MOUSE !== 'undefined') {
                          if (event.MSPOINTER_TYPE_MOUSE != event.pointerType)
                              return true;
                      }
                      else
                          if (event.pointerType != 'mouse')
                              return true;

                      return false;
                  },
                  swipeDiff = 0,
                  swipeYDiff = 0,
                  curImg = $(),
                  transPrefix = function () {
                      var s = document.body || document.documentElement, s = s.style;
                      if (s.WebkitTransition == '') return '-webkit-';
                      if (s.MozTransition == '') return '-moz-';
                      if (s.OTransition == '') return '-o-';
                      if (s.transition == '') return '';
                      return false;
                  },
                  opened = false,
                  loaded = [],
                  objects = this,
                  transPrefix = transPrefix(),
                  canTransisions = (transPrefix !== false) ? true : false,
                  prefix = 'simplelb',
                  overlay = $('<div>').addClass('sl-overlay'),
                  closeBtn = $('<button>').addClass('sl-close').html(options.closeText),
                  spinner = $('<div>').addClass('sl-spinner').html('<div></div>'),
                  nav = $('<div>').addClass('sl-navigation').html('<button class="sl-prev">' + options.navText[0] + '</button><button class="sl-next">' + options.navText[1] + '</button>'),
                  counter = $('<div>').addClass('sl-counter').html('<span class="sl-current"></span>/<span class="sl-total"></span>'),
                  animating = false,
                  index = 0,
                  caption = $('<div>').addClass('sl-caption pos-' + options.captionPosition),
                  image = $('<div>').addClass('sl-image'),
                  wrapper = $('<div>').addClass('sl-wrapper').addClass(options.className),
                  isValidLink = function (element) {
                      if (!options.fileExt) return true;
                      return $(element).prop('tagName').toLowerCase() == 'a' && (new RegExp('\.(' + options.fileExt + ')$', 'i')).test($(element).attr('href'));
                  },
                  setup = function () {
                      if (options.close) closeBtn.appendTo(wrapper);
                      if (options.showCounter) {
                          if (objects.length > 1) {
                              counter.appendTo(wrapper);
                              counter.find('.sl-total').text(objects.length);
                          }

                      }
                      if (options.nav) nav.appendTo(wrapper);
                      if (options.spinner) spinner.appendTo(wrapper);
                  },
                  openImage = function (elem) {
                      elem.trigger($.Event('show.simplelightbox'));
                      if (options.disableScroll) handleScrollbar('hide');
                      wrapper.appendTo('body');
                      image.appendTo(wrapper);
                      if (options.overlay) overlay.appendTo($('body'));
                      animating = true;
                      index = objects.index(elem);
                      curImg = $('<img/>')
                          .hide()
                          .attr('src', elem.attr('href'));
                      if (loaded.indexOf(elem.attr('href')) == -1) {
                          loaded.push(elem.attr('href'));
                      }
                      image.html('').attr('style', '');
                      curImg.appendTo(image);
                      addEvents();
                      overlay.fadeIn('fast');
                      $('.sl-close').fadeIn('fast');
                      spinner.show();
                      nav.fadeIn('fast');
                      $('.sl-wrapper .sl-counter .sl-current').text(index + 1);
                      counter.fadeIn('fast');
                      adjustImage();
                      if (options.preloading) preload();
                      setTimeout(function () { elem.trigger($.Event('shown.simplelightbox')); }, options.animationSpeed);
                  },
                  adjustImage = function (dir) {
                      if (!curImg.length) return;
                      var tmpImage = new Image(),
                          windowWidth = $(window).width() * options.widthRatio,
                          windowHeight = $(window).height() * options.heightRatio;
                      tmpImage.src = curImg.attr('src');

                      $(tmpImage).bind('error', function (ev) {
                          //no image was found
                          objects.eq(index).trigger($.Event('error.simplelightbox'))
                          animating = false;
                          opened = true;
                          spinner.hide();
                          if (options.alertError) {
                              alert(options.alertErrorMessage);

                              if (dir == 1 || dir == -1) {
                                  loadImage(dir);
                              } else {
                                  loadImage(1);
                              }
                              return;
                          }
                      })
                      tmpImage.onload = function () {
                          if (typeof dir !== 'undefined') {
                              objects.eq(index)
                                  .trigger($.Event('changed.simplelightbox'))
                                  .trigger($.Event((dir === 1 ? 'nextDone' : 'prevDone') + '.simplelightbox'));
                          }

                          if (loaded.indexOf(curImg.attr('src')) == -1) {
                              loaded.push(curImg.attr('src'));
                          }
                          var imageWidth = tmpImage.width,
                              imageHeight = tmpImage.height;

                          if (imageWidth > windowWidth || imageHeight > windowHeight) {
                              var ratio = imageWidth / imageHeight > windowWidth / windowHeight ? imageWidth / windowWidth : imageHeight / windowHeight;
                              imageWidth /= ratio;
                              imageHeight /= ratio;
                          }

                          $('.sl-image').css({
                              'top': ($(window).height() - imageHeight) / 2 + 'px',
                              'left': ($(window).width() - imageWidth) / 2 + 'px'
                          });
                          spinner.hide();
                          curImg
                              .css({
                                  'width': imageWidth + 'px',
                                  'height': imageHeight + 'px'
                              })
                              .fadeIn('fast');
                          opened = true;
                          var cSel = (options.captionSelector == 'self') ? objects.eq(index) : objects.eq(index).find(options.captionSelector);
                          if (options.captionType == 'data') {
                              var captionText = cSel.data(options.captionsData);
                          } else if (options.captionType == 'text') {
                              var captionText = cSel.html();
                          } else {
                              var captionText = cSel.prop(options.captionsData);
                          }

                          if (!options.loop) {
                              if (index == 0) { $('.sl-prev').hide(); }
                              if (index >= objects.length - 1) { $('.sl-next').hide(); }
                              if (index > 0) { $('.sl-prev').show(); }
                              if (index < objects.length - 1) { $('.sl-next').show(); }
                          }

                          if (objects.length == 1) $('.sl-prev, .sl-next').hide();

                          if (dir == 1 || dir == -1) {
                              var css = { 'opacity': 1.0 };
                              if (options.animationSlide) {
                                  if (canTransisions) {
                                      slide(0, 100 * dir + 'px');
                                      setTimeout(function () { slide(options.animationSpeed / 1000, 0 + 'px'), 50 });
                                  }
                                  else {
                                      css.left = parseInt($('.sl-image').css('left')) + 100 * dir + 'px';
                                  }
                              }

                              $('.sl-image').animate(css, options.animationSpeed, function () {
                                  animating = false;
                                  setCaption(captionText);
                              });
                          } else {
                              animating = false;
                              setCaption(captionText);
                          }
                          if (options.additionalHtml && $('.sl-additional-html').length == 0) {
                              $('<div>').html(options.additionalHtml).addClass('sl-additional-html').prependTo($('.sl-image'));
                          }
                      }
                  },
                  setCaption = function (captiontext) {
                      if (captiontext != '' && typeof captiontext !== "undefined" && options.captions) {
                          caption.html(captiontext).hide().appendTo($('.sl-image')).delay(options.captionDelay).fadeIn('fast');
                      }
                  },
                  slide = function (speed, pos) {
                      var styles = {};
                      styles[transPrefix + 'transform'] = 'translateX(' + pos + ')';
                      styles[transPrefix + 'transition'] = transPrefix + 'transform ' + speed + 's linear';
                      $('.sl-image').css(styles);
                  },
                  addEvents = function () {
                      // resize/responsive
                      $(window).on('resize.' + prefix, adjustImage);

                      // close lightbox on close btn
                      $(document).on('click.' + prefix + ' touchstart.' + prefix, '.sl-close', function (e) {
                          e.preventDefault();
                          if (opened) { close(); }
                      });

                      // nav-buttons
                      nav.on('click.' + prefix, 'button', function (e) {
                          e.preventDefault();
                          swipeDiff = 0;
                          loadImage($(this).hasClass('sl-next') ? 1 : -1);
                      });

                      // touchcontrols
                      var swipeStart = 0,
                          swipeEnd = 0,
                          swipeYStart = 0,
                          swipeYEnd = 0,
                          mousedown = false,
                          imageLeft = 0;

                      image
                          .on('touchstart.' + prefix + ' mousedown.' + prefix, function (e) {
                              if (mousedown) return true;
                              if (canTransisions) imageLeft = parseInt(image.css('left'));
                              mousedown = true;
                              swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                              swipeYStart = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
                              return false;
                          })
                          .on('touchmove.' + prefix + ' mousemove.' + prefix + ' pointermove MSPointerMove', function (e) {
                              if (!mousedown) return true;
                              e.preventDefault();
                              swipeEnd = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                              swipeYEnd = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
                              swipeDiff = swipeStart - swipeEnd;
                              swipeYDiff = swipeYStart - swipeYEnd;
                              if (options.animationSlide) {
                                  if (canTransisions) slide(0, -swipeDiff + 'px');
                                  else image.css('left', imageLeft - swipeDiff + 'px');
                              }
                          })
                          .on('touchend.' + prefix + ' mouseup.' + prefix + ' touchcancel.' + prefix + ' mouseleave.' + prefix + ' pointerup pointercancel MSPointerUp MSPointerCancel', function (e) {
                              if (mousedown) {
                                  mousedown = false;
                                  var possibleDir = true;
                                  if (!options.loop) {
                                      if (index == 0 && swipeDiff < 0) { possibleDir = false; }
                                      if (index >= objects.length - 1 && swipeDiff > 0) { possibleDir = false; }
                                  }
                                  if (Math.abs(swipeDiff) > options.swipeTolerance && possibleDir) {
                                      loadImage(swipeDiff > 0 ? 1 : -1);
                                  }
                                  else if (options.animationSlide) {
                                      if (canTransisions) slide(options.animationSpeed / 1000, 0 + 'px');
                                      else image.animate({ 'left': imageLeft + 'px' }, options.animationSpeed / 2);
                                  }

                                  if (options.swipeClose && Math.abs(swipeYDiff) > 50 && Math.abs(swipeDiff) < options.swipeTolerance) {
                                      close();
                                  }
                              }
                          });
                  },
                  removeEvents = function () {
                      nav.off('click', 'button');
                      $(document).off('click.' + prefix, '.sl-close');
                      $(window).off('resize.' + prefix);
                  },
                  preload = function () {
                      var next = (index + 1 < 0) ? objects.length - 1 : (index + 1 >= objects.length - 1) ? 0 : index + 1,
                          prev = (index - 1 < 0) ? objects.length - 1 : (index - 1 >= objects.length - 1) ? 0 : index - 1;
                      $('<img />').attr('src', objects.eq(next).attr('href')).load(function () {
                          if (loaded.indexOf($(this).attr('src')) == -1) {
                              loaded.push($(this).attr('src'));
                          }
                          objects.eq(index).trigger($.Event('nextImageLoaded.simplelightbox'));
                      });
                      $('<img />').attr('src', objects.eq(prev).attr('href')).load(function () {
                          if (loaded.indexOf($(this).attr('src')) == -1) {
                              loaded.push($(this).attr('src'));
                          }
                          objects.eq(index).trigger($.Event('prevImageLoaded.simplelightbox'));
                      });

                  },
                  loadImage = function (dir) {
                      objects.eq(index)
                          .trigger($.Event('change.simplelightbox'))
                          .trigger($.Event((dir === 1 ? 'next' : 'prev') + '.simplelightbox'));

                      var newIndex = index + dir;
                      if (animating || (newIndex < 0 || newIndex >= objects.length) && options.loop == false) return;
                      index = (newIndex < 0) ? objects.length - 1 : (newIndex > objects.length - 1) ? 0 : newIndex;
                      $('.sl-wrapper .sl-counter .sl-current').text(index + 1);
                      var css = { 'opacity': 0 };
                      if (options.animationSlide) {
                          if (canTransisions) slide(options.animationSpeed / 1000, (-100 * dir) - swipeDiff + 'px');
                          else css.left = parseInt($('.sl-image').css('left')) + -100 * dir + 'px';
                      }

                      $('.sl-image').animate(css, options.animationSpeed, function () {
                          setTimeout(function () {
                              // fadeout old image
                              var elem = objects.eq(index);
                              curImg
                                  .attr('src', elem.attr('href'));
                              if (loaded.indexOf(elem.attr('href')) == -1) {
                                  spinner.show();
                              }
                              $('.sl-caption').remove();
                              adjustImage(dir);
                              if (options.preloading) preload();
                          }, 100);
                      });
                  },
                  close = function () {
                      if (animating) return;
                      var elem = objects.eq(index),
                          triggered = false;
                      elem.trigger($.Event('close.simplelightbox'));
                      $('.sl-image img, .sl-overlay, .sl-close, .sl-navigation, .sl-image .sl-caption, .sl-counter').fadeOut('fast', function () {
                          if (options.disableScroll) handleScrollbar('show');
                          $('.sl-wrapper, .sl-overlay').remove();
                          removeEvents();
                          if (!triggered) elem.trigger($.Event('closed.simplelightbox'));
                          triggered = true;
                      });
                      curImg = $();
                      opened = false;
                      animating = false;
                  },
                  handleScrollbar = function (type) {
                      if (type == 'hide') {
                          var fullWindowWidth = window.innerWidth;
                          if (!fullWindowWidth) {
                              var documentElementRect = document.documentElement.getBoundingClientRect()
                              fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
                          }
                          if (document.body.clientWidth < fullWindowWidth) {
                              var scrollDiv = document.createElement('div'),
                                  padding = parseInt($('body').css('padding-right'), 10);
                              scrollDiv.className = 'sl-scrollbar-measure';
                              $('body').append(scrollDiv);
                              var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                              $(document.body)[0].removeChild(scrollDiv);
                              $('body').data('padding', padding);
                              if (scrollbarWidth > 0) {
                                  $('body').addClass('hidden-scroll').css({ 'padding-right': padding + scrollbarWidth });
                              }
                          }
                      } else {
                          $('body').removeClass('hidden-scroll').css({ 'padding-right': $('body').data('padding') });
                      }
                  }

              // events
              setup();



              // open lightbox
              objects.on('click.' + prefix, function (e) {
                  if (isValidLink(this)) {
                      e.preventDefault();
                      if (animating) return false;
                      openImage($(this));
                  }
              });

              // close on click on doc
              $(document).on('click.' + prefix + ' touchstart.' + prefix, function (e) {
                  if (opened) {
                      if ((options.docClose && $(e.target).closest('.sl-image').length == 0 && $(e.target).closest('.sl-navigation').length == 0)) {
                          close();
                      }
                  }
              });

              // disable rightclick
              if (options.disableRightClick) {
                  $(document).on('contextmenu', '.sl-image img', function (e) {
                      return false;
                  });
              }


              // keyboard-control
              if (options.enableKeyboard) {
                  $(document).on('keyup.' + prefix, function (e) {
                      e.preventDefault();
                      swipeDiff = 0;
                      // keyboard control only if lightbox is open
                      if (opened) {
                          var key = e.keyCode;
                          if (key == 27) {
                              close();
                          }
                          if (key == 37 || e.keyCode == 39) {
                              loadImage(e.keyCode == 39 ? 1 : -1);
                          }
                      }
                  });
              }

              // Public methods
              this.open = function (elem) {
                  elem = elem || $(this[0]);
                  openImage(elem);
              }

              this.next = function () {
                  loadImage(1);
              }

              this.prev = function () {
                  loadImage(-1);
              }

              this.close = function () {
                  close();
              }

              this.destroy = function () {
                  $(document).unbind('click.' + prefix).unbind('keyup.' + prefix);
                  close();
                  $('.sl-overlay, .sl-wrapper').remove();
              }

              return this;

          };
      })(njQuery, window, document);

      //#endregion

      //#region Bootstrap Popover
      /* ========================================================================
      * Bootstrap: popover.js v3.3.6
      * http://getbootstrap.com/javascript/#popovers
      * ========================================================================
      * Copyright 2011-2016 Twitter, Inc.
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
      * ======================================================================== */


      +function ($) {
          'use strict';

          // POPOVER PUBLIC CLASS DEFINITION
          // ===============================

          var Popover = function (element, options) {
              this.init('popover', element, options)
          }

          if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

          Popover.VERSION = '3.3.6'

          Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
              placement: 'down',
              trigger: 'click',
              content: '',
              template: '<div class="yv-popover" role="tooltip"><div class="yv-arrow"></div><h3 class="yv-popover-title"></h3><div class="yv-popover-content"></div></div>'
          })


          // NOTE: POPOVER EXTENDS tooltip.js
          // ================================

          Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

          Popover.prototype.constructor = Popover

          Popover.prototype.getDefaults = function () {
              return Popover.DEFAULTS
          }

          Popover.prototype.setContent = function () {
              var $tip = this.tip()
              var title = this.getTitle()
              var content = this.getContent()

              $tip.find('.yv-popover-title')[this.options.html ? 'html' : 'text'](title)
              $tip.find('.yv-popover-content').children().detach().end()[ // we use append for html objects to maintain js events
                  this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
              ](content)

              $tip.removeClass('yv-fade yv-top yv-bottom yv-left yv-right yv-in')

              // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
              // this manually by checking the contents.
              if (!$tip.find('.yv-popover-title').html()) $tip.find('.yv-popover-title').hide()
          }

          Popover.prototype.hasContent = function () {
              return this.getTitle() || this.getContent()
          }

          Popover.prototype.getContent = function () {
              var $e = this.$element
              var o = this.options

              return $e.attr('data-content')
                  || (typeof o.content == 'function' ?
                      o.content.call($e[0]) :
                      o.content)
          }

          Popover.prototype.arrow = function () {
              return (this.$arrow = this.$arrow || this.tip().find('.yv-arrow'))
          }


          // POPOVER PLUGIN DEFINITION
          // =========================

          function Plugin(option) {
              return this.each(function () {
                  var $this = $(this)
                  var data = $this.data('bs.popover')
                  var options = typeof option == 'object' && option

                  if (!data && /destroy|hide/.test(option)) return
                  if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
                  if (typeof option == 'string') data[option]()
              })
          }

          var old = $.fn.popover

          $.fn.popover = Plugin
          $.fn.popover.Constructor = Popover


          // POPOVER NO CONFLICT
          // ===================

          $.fn.popover.noConflict = function () {
              $.fn.popover = old
              return this
          }

      }(njQuery);
      //#endregion 
      //Desabilitado para Core
      if (typeof yv.vendorCustom.disableModalCore !== 'function') {
          //#region Mask       
          //'use strict';
          (function (factory) {

              //if (typeof define === 'function' && define.amd) {
              //    define(['jquery'], factory);
              //} else if (typeof exports === 'object') {
              //    module.exports = factory(require('jquery'));
              //} else {
              factory(njQuery);
              //}

          }(function ($) {

              var Mask = function (el, mask, options) {

                  var p = {
                      invalid: [],
                      getCaret: function () {
                          try {
                              var sel,
                                  pos = 0,
                                  ctrl = el.get(0),
                                  dSel = document.selection,
                                  cSelStart = ctrl.selectionStart;

                              // IE Support
                              if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                                  sel = dSel.createRange();
                                  sel.moveStart('character', -p.val().length);
                                  pos = sel.text.length;
                              }
                              // Firefox support
                              else if (cSelStart || cSelStart === '0') {
                                  pos = cSelStart;
                              }

                              return pos;
                          } catch (e) { }
                      },
                      setCaret: function (pos) {
                          try {
                              if (el.is(':focus')) {
                                  var range, ctrl = el.get(0);

                                  // Firefox, WebKit, etc..
                                  if (ctrl.setSelectionRange) {
                                      ctrl.focus();
                                      ctrl.setSelectionRange(pos, pos);
                                  } else { // IE
                                      range = ctrl.createTextRange();
                                      range.collapse(true);
                                      range.moveEnd('character', pos);
                                      range.moveStart('character', pos);
                                      range.select();
                                  }
                              }
                          } catch (e) { }
                      },
                      events: function () {
                          el
                              .on('keydown.mask', function (e) {
                                  el.data('mask-keycode', e.keyCode || e.which);
                              })
                              .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                              .on('paste.mask drop.mask', function () {
                                  setTimeout(function () {
                                      el.keydown().keyup();
                                  }, 100);
                              })
                              .on('change.mask', function () {
                                  el.data('changed', true);
                              })
                              .on('blur.mask', function () {
                                  if (oldValue !== p.val() && !el.data('changed')) {
                                      el.trigger('change');
                                  }
                                  el.data('changed', false);
                              })
                              // it's very important that this callback remains in this position
                              // otherwhise oldValue it's going to work buggy
                              .on('blur.mask', function () {
                                  oldValue = p.val();
                              })
                              // select all text on focus
                              .on('focus.mask', function (e) {
                                  if (options.selectOnFocus === true) {
                                      $(e.target).select();
                                  }
                              })
                              // clear the value if it not complete the mask
                              .on('focusout.mask', function () {
                                  if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                                      p.val('');
                                  }
                              });
                      },
                      getRegexMask: function () {
                          var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                          for (var i = 0; i < mask.length; i++) {
                              translation = jMask.translation[mask.charAt(i)];

                              if (translation) {

                                  pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                                  optional = translation.optional;
                                  recursive = translation.recursive;

                                  if (recursive) {
                                      maskChunks.push(mask.charAt(i));
                                      oRecursive = { digit: mask.charAt(i), pattern: pattern };
                                  } else {
                                      maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                                  }

                              } else {
                                  maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                              }
                          }

                          r = maskChunks.join('');

                          if (oRecursive) {
                              r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                                  .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                          }

                          return new RegExp(r);
                      },
                      destroyEvents: function () {
                          el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
                      },
                      val: function (v) {
                          var isInput = el.is('input'),
                              method = isInput ? 'val' : 'text',
                              r;

                          if (arguments.length > 0) {
                              if (el[method]() !== v) {
                                  el[method](v);
                              }
                              r = el;
                          } else {
                              r = el[method]();
                          }

                          return r;
                      },
                      getMCharsBeforeCount: function (index, onCleanVal) {
                          for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
                              if (!jMask.translation[mask.charAt(i)]) {
                                  index = onCleanVal ? index + 1 : index;
                                  count++;
                              }
                          }
                          return count;
                      },
                      caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
                          var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

                          return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
                              : Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
                      },
                      behaviour: function (e) {
                          e = e || window.event;
                          p.invalid = [];

                          var keyCode = el.data('mask-keycode');

                          if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                              var caretPos = p.getCaret(),
                                  currVal = p.val(),
                                  currValL = currVal.length,
                                  newVal = p.getMasked(),
                                  newValL = newVal.length,
                                  maskDif = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1),
                                  changeCaret = caretPos < currValL;

                              p.val(newVal);

                              if (changeCaret) {
                                  // Avoid adjusting caret on backspace or delete
                                  if (!(keyCode === 8 || keyCode === 46)) {
                                      caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
                                  }
                                  p.setCaret(caretPos);
                              }

                              return p.callbacks(e);
                          }
                      },
                      getMasked: function (skipMaskChars, val) {
                          var buf = [],
                              value = val === undefined ? p.val() : val + '',
                              m = 0, maskLen = mask.length,
                              v = 0, valLen = value.length,
                              offset = 1, addMethod = 'push',
                              resetPos = -1,
                              lastMaskChar,
                              check;

                          if (options.reverse) {
                              addMethod = 'unshift';
                              offset = -1;
                              lastMaskChar = 0;
                              m = maskLen - 1;
                              v = valLen - 1;
                              check = function () {
                                  return m > -1 && v > -1;
                              };
                          } else {
                              lastMaskChar = maskLen - 1;
                              check = function () {
                                  return m < maskLen && v < valLen;
                              };
                          }

                          while (check()) {
                              var maskDigit = mask.charAt(m),
                                  valDigit = value.charAt(v),
                                  translation = jMask.translation[maskDigit];

                              if (translation) {
                                  if (valDigit.match(translation.pattern)) {
                                      buf[addMethod](valDigit);
                                      if (translation.recursive) {
                                          if (resetPos === -1) {
                                              resetPos = m;
                                          } else if (m === lastMaskChar) {
                                              m = resetPos - offset;
                                          }

                                          if (lastMaskChar === resetPos) {
                                              m -= offset;
                                          }
                                      }
                                      m += offset;
                                  } else if (translation.optional) {
                                      m += offset;
                                      v -= offset;
                                  } else if (translation.fallback) {
                                      buf[addMethod](translation.fallback);
                                      m += offset;
                                      v -= offset;
                                  } else {
                                      p.invalid.push({ p: v, v: valDigit, e: translation.pattern });
                                  }
                                  v += offset;
                              } else {
                                  if (!skipMaskChars) {
                                      buf[addMethod](maskDigit);
                                  }

                                  if (valDigit === maskDigit) {
                                      v += offset;
                                  }

                                  m += offset;
                              }
                          }

                          var lastMaskCharDigit = mask.charAt(lastMaskChar);
                          if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                              buf.push(lastMaskCharDigit);
                          }

                          return buf.join('');
                      },
                      callbacks: function (e) {
                          var val = p.val(),
                              changed = val !== oldValue,
                              defaultArgs = [val, e, el, options],
                              callback = function (name, criteria, args) {
                                  if (typeof options[name] === 'function' && criteria) {
                                      options[name].apply(this, args);
                                  }
                              };

                          callback('onChange', changed === true, defaultArgs);
                          callback('onKeyPress', changed === true, defaultArgs);
                          callback('onComplete', val.length === mask.length, defaultArgs);
                          callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
                      }
                  };

                  el = $(el);
                  var jMask = this, oldValue = p.val(), regexMask;

                  mask = typeof mask === 'function' ? mask(p.val(), undefined, el, options) : mask;


                  // public methods
                  jMask.mask = mask;
                  jMask.options = options;
                  jMask.remove = function () {
                      var caret = p.getCaret();
                      p.destroyEvents();
                      p.val(jMask.getCleanVal());
                      p.setCaret(caret - p.getMCharsBeforeCount(caret));
                      return el;
                  };

                  // get value without mask
                  jMask.getCleanVal = function () {
                      return p.getMasked(true);
                  };

                  // get masked value without the value being in the input or element
                  jMask.getMaskedVal = function (val) {
                      return p.getMasked(false, val);
                  };

                  jMask.init = function (onlyMask) {
                      onlyMask = onlyMask || false;
                      options = options || {};

                      jMask.clearIfNotMatch = $.jMaskGlobals.clearIfNotMatch;
                      jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
                      jMask.translation = $.extend({}, $.jMaskGlobals.translation, options.translation);

                      jMask = $.extend(true, {}, jMask, options);

                      regexMask = p.getRegexMask();

                      if (onlyMask === false) {

                          if (options.placeholder) {
                              el.attr('placeholder', options.placeholder);
                          }

                          // this is necessary, otherwise if the user submit the form
                          // and then press the "back" button, the autocomplete will erase
                          // the data. Works fine on IE9+, FF, Opera, Safari.
                          if (el.data('mask')) {
                              el.attr('autocomplete', 'off');
                          }

                          p.destroyEvents();
                          p.events();

                          var caret = p.getCaret();
                          p.val(p.getMasked());
                          p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

                      } else {
                          p.events();
                          p.val(p.getMasked());
                      }
                  };

                  jMask.init(!el.is('input'));
              };

              $.maskWatchers = {};
              var HTMLAttributes = function () {
                  var input = $(this),
                      options = {},
                      prefix = 'data-mask-',
                      mask = input.attr('data-mask');

                  if (input.attr(prefix + 'reverse')) {
                      options.reverse = true;
                  }

                  if (input.attr(prefix + 'clearifnotmatch')) {
                      options.clearIfNotMatch = true;
                  }

                  if (input.attr(prefix + 'selectonfocus') === 'true') {
                      options.selectOnFocus = true;
                  }

                  if (notSameMaskObject(input, mask, options)) {
                      return input.data('mask', new Mask(this, mask, options));
                  }
              },
                  notSameMaskObject = function (field, mask, options) {
                      options = options || {};
                      var maskObject = $(field).data('mask'),
                          stringify = JSON.stringify,
                          value = $(field).val() || $(field).text();
                      try {
                          if (typeof mask === 'function') {
                              mask = mask(value);
                          }
                          return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
                      } catch (e) { }
                  },
                  eventSupported = function (eventName) {
                      var el = document.createElement('div'), isSupported;

                      eventName = 'on' + eventName;
                      isSupported = (eventName in el);

                      if (!isSupported) {
                          el.setAttribute(eventName, 'return;');
                          isSupported = typeof el[eventName] === 'function';
                      }
                      el = null;

                      return isSupported;
                  };

              $.fn.mask = function (mask, options) {
                  options = options || {};
                  var selector = this.selector,
                      globals = $.jMaskGlobals,
                      interval = globals.watchInterval,
                      watchInputs = options.watchInputs || globals.watchInputs,
                      maskFunction = function () {
                          if (notSameMaskObject(this, mask, options)) {
                              return $(this).data('mask', new Mask(this, mask, options));
                          }
                      };

                  $(this).each(maskFunction);

                  if (selector && selector !== '' && watchInputs) {
                      clearInterval($.maskWatchers[selector]);
                      $.maskWatchers[selector] = setInterval(function () {
                          $(document).find(selector).each(maskFunction);
                      }, interval);
                  }
                  return this;
              };

              $.fn.masked = function (val) {
                  return this.data('mask').getMaskedVal(val);
              };

              $.fn.unmask = function () {
                  clearInterval($.maskWatchers[this.selector]);
                  delete $.maskWatchers[this.selector];
                  return this.each(function () {
                      var dataMask = $(this).data('mask');
                      if (dataMask) {
                          dataMask.remove().removeData('mask');
                      }
                  });
              };

              $.fn.cleanVal = function () {
                  return this.data('mask').getCleanVal();
              };

              $.applyDataMask = function (selector) {
                  selector = selector || $.jMaskGlobals.maskElements;
                  var $selector = (selector instanceof $) ? selector : $(selector);
                  $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
              };

              var globals = {
                  maskElements: 'input,td,span,div',
                  dataMaskAttr: '*[data-mask]',
                  dataMask: true,
                  watchInterval: 300,
                  watchInputs: true,
                  useInput: eventSupported('input'),
                  watchDataMask: false,
                  byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
                  translation: {
                      '0': { pattern: /\d/ },
                      '9': { pattern: /\d/, optional: true },
                      '#': { pattern: /\d/, recursive: true },
                      'A': { pattern: /[a-zA-Z0-9]/ },
                      'S': { pattern: /[a-zA-Z]/ }
                  }
              };

              $.jMaskGlobals = $.jMaskGlobals || {};
              globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

              // looking for inputs with data-mask attribute
              if (globals.dataMask) {
                  $.applyDataMask();
              }

              setInterval(function () {
                  if ($.jMaskGlobals.watchDataMask) {
                      $.applyDataMask();
                  }
              }, globals.watchInterval);
          }));

          //#endregion
      }
      //#region Bootstrap Modal
      //Desabilitado para Core
      if (typeof yv.vendorCustom.disableModalCore !== 'function') {
          +function ($) {
              'use strict';

              // MODAL CLASS DEFINITION
              // ======================

              var Modal = function (element, options) {
                  this.options = options
                  this.$body = $(document.body)
                  this.$element = $(element)
                  this.$dialog = this.$element.find('.yv-modal-dialog')
                  this.$backdrop = null
                  this.isShown = null
                  this.originalBodyPad = null
                  this.scrollbarWidth = 0
                  this.ignoreBackdropClick = false

                  if (this.options.remote) {
                      this.$element
                          .find('.yv-modal-content')
                          .load(this.options.remote, $.proxy(function () {
                              this.$element.trigger('yv.loaded.bs.modal')
                          }, this))
                  }
              }

              Modal.VERSION = '3.3.7'

              Modal.TRANSITION_DURATION = 300
              Modal.BACKDROP_TRANSITION_DURATION = 150

              Modal.DEFAULTS = {
                  backdrop: true,
                  keyboard: true,
                  show: true
              }

              Modal.prototype.toggle = function (_relatedTarget) {
                  return this.isShown ? this.hide() : this.show(_relatedTarget)
              }

              Modal.prototype.show = function (_relatedTarget) {
                  var that = this
                  var e = $.Event('yv.show.bs.modal', { relatedTarget: _relatedTarget })

                  this.$element.trigger(e)

                  if (this.isShown || e.isDefaultPrevented()) return

                  this.isShown = true

                  this.checkScrollbar()
                  this.setScrollbar()
                  this.$body.addClass('yv-modal-open')

                  this.escape()
                  this.resize()

                  this.$element.on('yv.click.dismiss.bs.modal', '[yv-data-dismiss="modal"]', $.proxy(this.hide, this))

                  this.$dialog.on('yv.mousedown.dismiss.bs.modal', function () {
                      that.$element.one('yv.mouseup.dismiss.bs.modal', function (e) {
                          if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
                      })
                  })

                  this.backdrop(function () {
                      var transition = $.support.transition && that.$element.hasClass('yv-fade')

                      if (!that.$element.parent().length) {
                          that.$element.appendTo(that.$body) // don't move modals dom position
                      }

                      that.$element
                          .show()
                          .scrollTop(0)

                      that.adjustDialog()

                      if (transition) {
                          that.$element[0].offsetWidth // force reflow
                      }

                      that.$element.addClass('yv-in')

                      that.enforceFocus()

                      var e = $.Event('yv.shown.bs.modal', { relatedTarget: _relatedTarget })

                      transition ?
                          that.$dialog // wait for modal to slide in
                              .one('bsTransitionEnd', function () {
                                  that.$element.trigger('yv-focus').trigger(e)
                              })
                              .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                          that.$element.trigger('yv-focus').trigger(e)
                  })
              }

              Modal.prototype.hide = function (e) {
                  if (e) e.preventDefault()

                  e = $.Event('yv.hide.bs.modal')

                  this.$element.trigger(e)

                  if (!this.isShown || e.isDefaultPrevented()) return

                  this.isShown = false

                  this.escape()
                  this.resize()

                  $(document).off('yv.focusin.bs.modal')

                  this.$element
                      .removeClass('yv-in')
                      .off('yv.click.dismiss.bs.modal')
                      .off('yv.mouseup.dismiss.bs.modal')

                  this.$dialog.off('yv.mousedown.dismiss.bs.modal')

                  $.support.transition && this.$element.hasClass('yv-fade') ?
                      this.$element
                          .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                      this.hideModal()
              }

              Modal.prototype.enforceFocus = function () {
                  $(document)
                      .off('yv.focusin.bs.modal') // guard against infinite focus loop
                      .on('.yvfocusin.bs.modal', $.proxy(function (e) {
                          if (document !== e.target &&
                              this.$element[0] !== e.target &&
                              !this.$element.has(e.target).length) {
                              this.$element.trigger('yv-focus')
                          }
                      }, this))
              }

              Modal.prototype.escape = function () {
                  if (this.isShown && this.options.keyboard) {
                      this.$element.on('yv.keydown.dismiss.bs.modal', $.proxy(function (e) {
                          e.which == 27 && this.hide()
                      }, this))
                  } else if (!this.isShown) {
                      this.$element.off('yv.keydown.dismiss.bs.modal')
                  }
              }

              Modal.prototype.resize = function () {
                  if (this.isShown) {
                      $(window).on('yv.resize.bs.modal', $.proxy(this.handleUpdate, this))
                  } else {
                      $(window).off('yv.resize.bs.modal')
                  }
              }

              Modal.prototype.hideModal = function () {
                  var that = this
                  this.$element.hide()
                  this.backdrop(function () {
                      that.$body.removeClass('yv-modal-open')
                      that.resetAdjustments()
                      that.resetScrollbar()
                      that.$element.trigger('yv.hidden.bs.modal')
                  })
              }

              Modal.prototype.removeBackdrop = function () {
                  this.$backdrop && this.$backdrop.remove()
                  this.$backdrop = null
              }

              Modal.prototype.backdrop = function (callback) {
                  var that = this
                  var animate = this.$element.hasClass('yv-fade') ? 'yv-fade' : ''

                  if (this.isShown && this.options.backdrop) {
                      var doAnimate = $.support.transition && animate

                      this.$backdrop = $(this.$body)
                          .append('<div class="yv-bootstrap"><div class="yv-modal-backdrop ' + animate + '"></div></div>')
                      //$(document.createElement('div'))
                      //  .addClass('yv-modal-backdrop ' + animate)
                      //  .appendTo(this.$body)

                      this.$backdrop = $(this.$body).find('.yv-bootstrap .yv-modal-backdrop');

                      this.$element.on('yv.click.dismiss.bs.modal', $.proxy(function (e) {
                          if (this.ignoreBackdropClick) {
                              this.ignoreBackdropClick = false
                              return
                          }
                          if (e.target !== e.currentTarget) return
                          this.options.backdrop == 'static'
                              ? this.$element[0].focus()
                              : this.hide()
                      }, this))

                      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

                      this.$backdrop.addClass('yv-in')

                      if (!callback) return

                      doAnimate ?
                          this.$backdrop
                              .one('bsTransitionEnd', callback)
                              .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                          callback()

                  } else if (!this.isShown && this.$backdrop) {
                      this.$backdrop.removeClass('yv-in')

                      var callbackRemove = function () {
                          that.removeBackdrop()
                          callback && callback()
                      }
                      $.support.transition && this.$element.hasClass('yv-fade') ?
                          this.$backdrop
                              .one('bsTransitionEnd', callbackRemove)
                              .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                          callbackRemove()

                  } else if (callback) {
                      callback()
                  }
              }

              // these following methods are used to handle overflowing modals

              Modal.prototype.handleUpdate = function () {
                  this.adjustDialog()
              }

              Modal.prototype.adjustDialog = function () {
                  var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

                  this.$element.css({
                      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
                  })
              }

              Modal.prototype.resetAdjustments = function () {
                  this.$element.css({
                      paddingLeft: '',
                      paddingRight: ''
                  })
              }

              Modal.prototype.checkScrollbar = function () {
                  var fullWindowWidth = window.innerWidth
                  if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                      var documentElementRect = document.documentElement.getBoundingClientRect()
                      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
                  }
                  this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
                  this.scrollbarWidth = this.measureScrollbar()
              }

              Modal.prototype.setScrollbar = function () {
                  var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
                  this.originalBodyPad = document.body.style.paddingRight || ''
                  if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
              }

              Modal.prototype.resetScrollbar = function () {
                  this.$body.css('padding-right', this.originalBodyPad)
              }

              Modal.prototype.measureScrollbar = function () { // thx walsh
                  var scrollDiv = document.createElement('div')
                  scrollDiv.className = 'modal-scrollbar-measure'
                  this.$body.append(scrollDiv)
                  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
                  this.$body[0].removeChild(scrollDiv)
                  return scrollbarWidth
              }


              // MODAL PLUGIN DEFINITION
              // =======================

              function Plugin(option, _relatedTarget) {
                  return this.each(function () {
                      var $this = $(this)
                      var data = $this.data('yv.bs.modal')
                      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

                      if (!data) $this.data('yv.bs.modal', (data = new Modal(this, options)))
                      if (typeof option == 'string') data[option](_relatedTarget)
                      else if (options.show) data.show(_relatedTarget)
                  })
              }

              var old = $.fn.modal

              $.fn.modal = Plugin
              $.fn.modal.Constructor = Modal


              // MODAL NO CONFLICT
              // =================

              $.fn.modal.noConflict = function () {
                  $.fn.modal = old
                  return this
              }


              // MODAL DATA-API
              // ==============

              $(document).on('yv.click.bs.modal.data-api', '[yv-data-toggle="modal"]', function (e) {
                  var $this = $(this)
                  var href = $this.attr('href')
                  var $target = $($this.attr('yv-data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
                  var option = $target.data('yv.bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

                  if ($this.is('a')) e.preventDefault()

                  $target.one('yv.show.bs.modal', function (showEvent) {
                      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
                      $target.one('yv.hidden.bs.modal', function () {
                          $this.is(':visible') && $this.trigger('yv-focus')
                      })
                  })
                  Plugin.call($target, option, this)
              })

          }(njQuery);
      }
      //#endregion
  },

  Css: function () {
      var includeBootstrap = !njQuery('[yv-nobootstrap]').length && !window.yv.nobootstrap;
      var includeFontawesome = !njQuery('[yv-nofa]').length && !window.yv.nofa && !njQuery("link[href*='css/font-awesome']").length;
      var itemsAppend = [];

      var bootstrap_css = njQuery("<link>", {
          rel: "stylesheet",
          type: "text/css",
          href: yv.staticServiceAddr + "/static/commom/bootstrap.min.css"
      });
      if (includeBootstrap)
          itemsAppend.push(bootstrap_css);

      var fontawesome_css = njQuery("<link>", {
          rel: "stylesheet",
          type: "text/css",
          href: "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      });
      if (includeFontawesome)
          itemsAppend.push(fontawesome_css);

      var yv_reviews_css = njQuery("<link>", {
          rel: "stylesheet",
          type: "text/css",
          href: yv.staticServiceAddr + "/static/reviews.min.css?v=v090817"
      });
      itemsAppend.push(yv_reviews_css)

      var custom_css = njQuery("<link>", {
          rel: "stylesheet",
          type: "text/css",
          href: yv.uriBuilder.general("/script/style")
      });
      if (!njQuery("link[href*='yourviews.com.br/script/style']").length)
          itemsAppend.push(custom_css);

      var toAppend = '';
      for (var alldocs = 0; alldocs < itemsAppend.length; alldocs++) {
          document.head.appendChild(itemsAppend[alldocs][0]);
      }
  }
};


  
/*
Aqui são os trechos de configuração da biblioteca e não devem ser alterados em caso de update da mesma
*/
yv.uploader = {
  installPreview: function (widget, list) {
      widget.onChange(function (fileGroup) {
          list.empty();
          if (fileGroup) {
              njQuery.when.apply(null, fileGroup.files()).done(function () {
                  njQuery.each(arguments, function (i, fileInfo) {
                      var src = fileInfo.cdnUrl + '-/scale_crop/160x160/center/';
                      list.append(
                        njQuery('<div/>', { 'class': '_item' }).append(
                          [njQuery('<img/>', { src: src }), fileInfo.name])
                      );
                  });
              });
          }
      });
  },
  addIconToBtn: function () {
      var btn = njQuery('.yv-imageupload-wrapper .uploadcare-widget-button:first');
      btn.html("<i class='fa fa-camera fa-lg'></i> " + btn.html());
  },
  //Hack para forçar a troca de idioma após inicialização do plugin
  reloadWithLang: function () {
      var internalUploadcare;
      uploadcare.plugin(function (internal) {
          internalUploadcare = internal;
      });
      internalUploadcare.locale.rebuild({
          locale: 'pt'
      });

      njQuery('[data-yvaction="fileupload"]').html(njQuery('[data-yvaction="fileupload"] input:eq(0)'));

      uploadcare.initialize(njQuery('[data-yvaction="fileupload"]'));

      yv.uploader.addIconToBtn();
  },



  loaded: function () {
      uploadcare.start({
          publicKey: "1f1e6f53bd2d79c4ed86",
          locale: 'pt',
          multipleMax:5
      });

     //yv.uploader.reloadWithLang();

      njQuery('.yv-imageupload-wrapper').each(function () {
          yv.uploader.installPreview(
            uploadcare.MultipleWidget(njQuery(this).find('input')),
            njQuery(this).children('._list')
          );
      });
  },

  startUploader: function () {
      var upcSettings = "<script>UPLOADCARE_MANUAL_START = true;UPLOADCARE_LIVE = false;</script>";
      njQuery('head').append(upcSettings);

      var scriptUrl = yv.vendorCustom.uploadCareUrl != undefined ? yv.vendorCustom.uploadCareUrl() : "https://ucarecdn.com/widget/2.9.0/uploadcare/uploadcare.full.min.js";

      var script_tag = document.createElement('script');
      script_tag.setAttribute("type", "text/javascript");
      script_tag.setAttribute("src", scriptUrl);
      if (script_tag.readyState) {
          script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState === 'complete' || this.readyState === 'loaded') {
                  yv.uploader.loaded();
              }
          };
      } else {
          script_tag.onload = yv.uploader.loaded;
      }
      (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

  }

}

  yv.load.init();

}(window.yv = window.yv || {}, window.jQuery));
