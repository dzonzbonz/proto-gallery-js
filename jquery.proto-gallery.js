/**
 * jQuery protoGallery
 * @author dzonz
 */
(function($) {

    var _getSelectorValue = function ($source, _selectorSchema) {
        var _schema = _selectorSchema.split('#');
        if (!_schema[1]) {
            return $source.find(_schema[0]).html();
        } else {
            return $source.find(_schema[0]).attr(_schema[1]);
        }
    };

    var _protoGalleryControllerClass = function($target, _settings) {
        var _instance = _settings;
        var _slides = [];
        var _currentSlide = 0;
        var $currentSlide = null;
        var _slideCounter = 0;
        
        var $canvas =  $("#proto-gallery-canvas");
        var $loader = $('#proto-gallery-loader');
        var $slider = $('#proto-gallery-slider');
        var $info = $('#proto-gallery-slider');
        var $slideTitle = $('#proto-gallery-slider');
        var $slideDescription = $('#proto-gallery-slider');
        
        if ($canvas.length == 0) {
            $canvas =  $('<div class="proto-gallery-content" id="proto-gallery-content"></div>');
            $loader =  $('<div class="proto-gallery-loader" id="proto-gallery-loader"></div>');
            $slider =  $('<div class="proto-gallery-slider" id="proto-gallery-slider"></div>');
            $info =  $('<div class="proto-gallery-info" id="proto-gallery-info"></div>');
            $slideTitle =  $('<h3 class="proto-gallery-slide-title" id="proto-gallery-slide-title"></h3>');
            $slideDescription =  $('<div class="proto-gallery-slide-description" id="proto-gallery-slide-description"></div>');
            
            $info.append($slideTitle).append($slideDescription);
            
            $canvas.append($loader).append($slider).append($info);
            
            $('body').append($canvas);
        }
        
        this.settings = function(newSettings) {
            _instance = newSettings;
        };

        this.open = function() {
            $canvas.protoDialog('open');
//            _instance.onOpen.call($target, $canvas);
//            $canvas.show();
        };

        this.close = function() {
            $canvas.protoDialog('close');
//            _instance.onClose.call($target, $canvas);
//            $canvas.hide();
        };        

        this.addSlide = function($slide) {
            _slideCounter++;
            
            _slides.push({
                'element': $slide,
                'link': _getSelectorValue($slide, _instance.slideLinkSelector),
                'thumbnail': _getSelectorValue($slide, _instance.slideThumbnailSelector),
                'photo': _getSelectorValue($slide, _instance.slidePhotoSelector),
                'title': _getSelectorValue($slide, _instance.slideTitleSelector),
                'description': _getSelectorValue($slide, _instance.slideDescriptionSelector)
            });

            $slide.data('slideIndex', _slideCounter);

            $slide.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                // raise gallery fromthis image
                _this.open();
                _this.showSlide($(this).data('slideIndex'));
                
                return false;
            });
        };

        this.removeSlide = function(_index) {
            _slides.splice(_index, 1);
        };

        this.getSlide = function(_index) {
            return _slides[_index];
        };

        this.setSlide = function(_index, $thumbnail, $full, $width, $height) {
            _slides[_index] = {
                'thumbnail': $thumbnail,
                'full': $full,
                'width': $width,
                'height': $height
            };
        };

        this.firstSlide = function() {
            _currentSlide = 0;
            this.showSlide(_currentSlide);
        };

        this.lastSlide = function() {
            _currentSlide = _slides.length - 1;
            this.showSlide(_currentSlide);
        };

        this.nextSlide = function() {
            _currentSlide++;
            this.showSlide(_currentSlide);
        };

        this.previousSlide = function() {
            _currentSlide--;
            this.showSlide(_currentSlide);
        };

        this.showSlide = function(_index) {
            _currentSlide = _index;
            if (_currentSlide < 0) {
                _currentSlide = _slides.length - 1;
            }
            _currentSlide = _currentSlide % _slides.length;
            if (false !== _instance.onChangeSlide.call($target, _currentSlide, $canvas)) {
                var _slide = _slides[_currentSlide];
                var $slide = $('<img src="' + _slide['photo'] + '"/>');
                $slide.css({
                    'position': 'absolute',
                    'z-index': '1'
                });
                
                $loader.show().fadeIn(0);
                
                var _showSlide = function () {
                    $loader.finish().fadeOut(300, function () {
                        $(this).hide();
                    });
                    $slide.fadeOut(0);
                    //_browserContent.empty();
                    $slider.append($slide);
                    
                    $slide.show().fadeOut(0).fadeIn(500);
                    $currentSlide = $slide;
                    
                    _resizeSlide();
                    
                    $slideTitle.html(_slide.title);
                    $slideDescription.html(_slide.description);
                    
                    _instance.onShowSlide.call($target, _slide, $slider);
                };
                
                $slide.load(function() {
                    var $previous = $slider.find('> *');
                    
                    if ($previous.length > 0) {
//                        $previous.css('z-index', '2').fadeOut(500, function() {
//                            $(this).remove();
//                            _showSlide();
//                        });
                        $previous.css('z-index', '2').animate({
                            'left': '-100%'
                        }, function() {
                            $(this).remove();
                            _showSlide();
                        });
                    } else {
                        _showSlide(_slide);
                    }
                });
            }
        };

        var _this = this;

        var _resizeSlide = function() {
            if ($currentSlide) {
                var _imgWidth = $currentSlide[0].naturalWidth;
                var _imgHeight = $currentSlide[0].naturalHeight;
                var _holderWidth = $slider.width();
                var _holderHeight = $slider.height();

                var _imgRatio = _imgWidth / _imgHeight;
                var _holderRatio = _holderWidth / _holderHeight;

                var _newWidth = 0;
                var _newHeight = 0;

                if (_imgRatio < _holderRatio) {
                    _newWidth = _holderHeight * _imgRatio;
                    _newHeight = _holderHeight;
                    // Height fixed

                } else {
                    // Width fixed
                    _newWidth = _holderWidth;
                    _newHeight = _holderWidth / _imgRatio;
                }

                $currentSlide.css({
                    'width': _newWidth + 'px',
                    'height': _newHeight + ('px'),
                    'left': (_holderWidth - _newWidth) / 2 + 'px',
                    'top': (_holderHeight - _newHeight) / 2 + 'px'
                });
            }
        };

        this.settings(_settings);

        var $slides = $target.find(_instance.slideSelector);
        
        $slides.each(function() {
            _this.addSlide($(this));
        });

        $canvas.protoDialog({
            actions: $.extend({
                'prev': {
                    'label': 'Previous',
                    'class': 'btn btn-default btn-nav btn-nav-previous'
                },
                'next': {
                    'label': 'Next',
                    'class': 'btn btn-default btn-nav btn-nav-next'
                }
            }, _instance.actions),
            onInit: function($dialog) {
                $dialog.addClass('proto-gallery-overlay');
                _instance.onInit.call($target, $dialog, _this)
            },
            onOpen: function($dialog) {
                _instance.onOpen.call($target, $dialog, _this)
            },
            onOpened: function($dialog) {
                _instance.onOpened.call($target, $dialog, _this)
            },
            onClose: function($dialog) {
                _instance.onClose.call($target, $dialog, _this)
            },
            onClosed: function($dialog) {
                _instance.onClosed.call($target, $dialog, _this)
            },
            onResize: function($dialog) {
                _resizeSlide();
                _instance.onResize.call($target, $dialog, _this)
            },
            onAction: function(_action, $dialog, event) {
                switch (_action) {
                    case 'prev':
                        _this.previousSlide();
                        break;
                    case 'next':
                        _this.nextSlide();
                        break;
                    default:
                        break;
                }
            }
        });
    };

    var methods = {
        init: function(options) {
            var _settings = $.extend({
                'slideSelector' : 'figure',
                'slideThumbnailSelector' : 'img#src',
                'slidePhotoSelector' : 'a#data-photo',
                'slideTitleSelector' : 'img#alt',
                'slideDescriptionSelector' : 'div',
                'slideLinkSelector' : 'a#href',
                prevButton: '<',
                nextButton: '>',
                closeButton: 'X',
                actions: {},
                onInit: function($dialog) {
                },
                onOpen: function($dialog) {
                },
                onOpened: function($dialog) {
                },
                onClose: function($dialog) {
                },
                onClosed: function($dialog) {
                },
                onResize: function($dialog) {
                },
                onAction: function(_action, $dialog) {
                },
                onChangeSlide: function(_slide, $dialog) {
                    return true;
                },
                onShowSlide: function(_slide, $dialog) {
                    return true;
                }
            }, options);

            return this.each(function() {
                var $this = $(this);
                var _data = $this.data('protoGallery');

                // If the plugin hasn't been initialized yet
                if (!_data) {
                    // search for elements
                    var _controller = new _protoGalleryControllerClass($this, _settings);

                    _data = {
                        target: $this,
                        settings: _settings,
                        controller: _controller
                    };
                } else {
                    _data = $(this).data('protoGallery');
                    _data['settings'] = _settings;
//                    _data['controller'].settings(_settings);
                }

                $(this).data('protoGallery', _data);
            });
        },
        open: function( ) {
            return this.each(function() {
                var $this = $(this);
                var _data = $this.data('protoGallery');

                // If the plugin hasn't been initialized yet
                if (_data) {
                    // search for elements
                    var _controller = _data['controller'];
                    _controller.open();
                }
            });
        },
        close: function( ) {
            return this.each(function() {
                var $this = $(this);
                var _data = $this.data('protoGallery');

                // If the plugin hasn't been initialized yet
                if (_data) {
                    // search for elements
                    var _controller = _data['controller'];
                    _controller.close();
                }
            });
        },
        settings: function(_settings) {
            return this.each(function() {
                var $this = $(this);
                var _data = $this.data('protoGallery');

                // If the plugin hasn't been initialized yet
                if (_data) {
                    // search for elements
                    var _controller = _data['controller'];
                    _data['settings'] = _settings;
                    $this.data('protoGallery', _data);
                    _controller.settings(_settings);
                }
            });
        }

    };

    $.fn.protoGallery = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.protoGallery');
        }
    };

})(jQuery); // pass the jQuery object to this function