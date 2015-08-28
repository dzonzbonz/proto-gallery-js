/**
 * jQuery protoGallery
 * @author dzonz
 */
(function($) {
// Generate a single only dialog
    var $canvas =  $("#proto-gallery-canvas");
    var $loader = $('#proto-gallery-loader');
    var $slider = $('#proto-gallery-slider');
    var $info = $('#proto-gallery-slider');
    var $slideTitle = $('#proto-gallery-slider');
    var $slideDescription = $('#proto-gallery-slider');

    $(document).ready(function () {
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

        $($canvas).protoDialog();
    });
     
// selector finder
    var _getSelectorValue = function ($source, _selectorSchema) {
        var _schemaTriger = _selectorSchema.split(']');
        
        var _schema = [];
        if (_schemaTriger[0] !== _selectorSchema) {
            _schema = _schemaTriger[0].split('[');
        }
        else {
            _schema.push(_schemaTriger[0]);
            _schema.push(false);
        }
        
        if (!_schema[1]) {
            return $source.find(_schema[0]).html();
        } else if (_schema[0].length == 0 && _schema[1]) {
            return $source.attr(_schema[1]);
        } else if (_schema[0] && _schema[1]) {
            return $source.find(_schema[0]).attr(_schema[1]);
        }
        
        return false;
    };

// gallery controller
    var _protoGalleryControllerClass = function($target, _settings) {
        var _instance = null;
        var _slides = [];
        var _currentSlide = 0;
        var $currentSlide = null;
        var _slideCounter = 0;
        
        this.setSettings = function(newSettings) {
            var oldSettings = _instance;
            
            _instance = newSettings;
            
            if (_instance['source']) {
                switch (_instance['source']) {
                    case 'selector':
                        this.setSlides($target.find(_instance.selector.slide));
                        break;
                    case 'query':
                        this.setSlides($(_instance.query));
                        break;
                    case 'collection':
                        this.setCollection(_instance.collection);
                        break;
                }
            } 
        };

        this.getSettings = function () {
            return _instance;
        };

        this.open = function() {
            
            $canvas.protoDialog('open', {
                actions: $.extend({
                    'prev': {
                        'label': _instance.prevButton,
                        'class': 'btn btn-default btn-nav btn-nav-previous'
                    },
                    'next': {
                        'label': _instance.nextButton,
                        'class': 'btn btn-default btn-nav btn-nav-next'
                    }
                }, _instance.actions),
                animation: _instance.animation,
                onInit: function($dialog) {                    
                    _instance.onInit.call($target, $dialog, _this);
                },
                onOpen: function($dialog) {
                    _this.noSlide();
                    $dialog.addClass('proto-gallery-overlay');
                    _instance.onOpen.call($target, $dialog, _this);
                },
                onOpened: function($dialog) {
                    _instance.onOpened.call($target, $dialog, _this);
                },
                onClose: function($dialog) {
                    _this.noSlide();
                    _instance.onClose.call($target, $dialog, _this);
                },
                onClosed: function($dialog) {
                    _instance.onClosed.call($target, $dialog, _this);
                },
                onResize: function($dialog) {
                    _resizeSlide();
                    _instance.onResize.call($target, $dialog, _this);
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
//            _instance.onOpen.call($target, $canvas);
//            $canvas.show();
        };

        this.close = function() {
            this.noSlide();
            
            $canvas.protoDialog('close');
        };
        
        this.isOpened = function () {
            var dialogData = $canvas.data('protoDialog');
                
            return dialogData.controller.isOpened();;
        };
        
        this.setCollection = function (_collection) {
            _slides = [];
            _currentSlide = 0;
            $currentSlide = null;
            _slideCounter = 0;
            
            this.addCollection(_collection);
        };
        
        this.addCollection = function (_collection) {
            for (var _itemIndex in _collection) {
                var _itemData = _collection[_itemIndex];
                this.addCollectionItem(_itemData);
            }
        };
        
        this.addCollectionItem = function (_item) {
            _slideCounter++;
            
            _slides.push(_item);
        };
        
        this.setSlides = function ($slides) {
            _slides = [];
            _currentSlide = 0;
            $currentSlide = null;
            _slideCounter = 0;
        
            this.attachSlides($slides);
        };
        
        this.attachSlides = function ($slides) {
            $slides.each(function() {
                $(this).off('click');
                _this.attachSlide($(this));
            });
        };
        
        this.attachSlide = function($slide) {
            this.addCollectionItem({
                'element': $slide,
                'link': _getSelectorValue($slide, _instance.selector.link),
                'thumbnail': _getSelectorValue($slide, _instance.selector.thumbnail),
                'photo': _getSelectorValue($slide, _instance.selector.photo),
                'title': _getSelectorValue($slide, _instance.selector.title),
                'description': _getSelectorValue($slide, _instance.selector.description)
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

        this.removeCollectionItem = function(_index) {
            _slides.splice(_index, 1);
        };

        this.getSlideCount = function() {
            return _slides.length;
        };

        this.getSlide = function(_index) {
            return _slides[_index];
        };

        this.setSlide = function(_index, _slideData) {
            _slides[_index] = _slideData;
        };

        this.noSlide = function () {
            $slider.find('> *').remove();
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

        this.getCurrentSlide = function () {
            return _currentSlide;
        };

        this.setCurrentSlide = function (_index) {
            _currentSlide = _index;
            
            if (_currentSlide < 0) {
                _currentSlide = _slides.length - 1;
            }
            
            _currentSlide = _currentSlide % _slides.length;
            
            return _currentSlide;
        };

        this.showSlide = function(_index) {
            var _oldSlide = _currentSlide;
            
            this.setCurrentSlide(_index);
            
            var _slide = _slides[_currentSlide];
            
            if (false !== _instance.onChangeSlide.call($target, _slide, $canvas, _oldSlide, _currentSlide)) {
                
                var $slide = $('<img src="' + _slide['photo'] + '"/>');
                $slide.css({
                    'position': 'absolute',
                    'z-index': '1'
                });
                
                $loader.hide();
                $loader.show().fadeIn(0);
//                alert(_index);
                var _showSlide = function () {
                    
                    $loader.finish().fadeOut(500, function () {
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
                        $previous.css('z-index', '2').animate({
                            'left': '-100%'
                        }, function() {
                            $(this).remove();
                        });
                        _showSlide();
                    } else {
//                        alert(_slide);
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

        this.setSettings(_settings);
        
    };

    var methods = {
        init: function(options) {
            var _settings = $.extend({
                'source' : 'selector', // selector, query, collection
                'selector': {
                    'slide': 'a',
                    'thumbnail': 'img[src]',
                    'photo': '[data-photo]',
                    'title': 'img[alt]',
                    'description': 'div',
                    'link': '[href]'
                },
                animation: {
                    'open': false,
                    'close': false,
                    'prev': false,
                    'next': false
                },
                'collection': null,
                'query': null,
                prevButton: '<',
                nextButton: '>',
                closeButton: 'X',
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
        open: function(_settings) {
            return this.each(function() {
                var $this = $(this);
                var _data = $this.data('protoGallery');

                // If the plugin hasn't been initialized yet
                if (_data) {
                    // search for elements
                    
                    var _controller = _data['controller'];
                    
                    if (_settings) {
                        _data['settings'] = $.extend(true, _controller.getSettings(), _settings);
                        
                        _controller.setSettings(_data['settings']);
                        
                        $this.data('protoGallery', _data);
                    }
                    
                    _controller.open();
                    
                    _controller.firstSlide();
                }
                else {
                    methods.init.call($(this), _settings);
                    
                    $(this).protoGallery('open');
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
                    
                    _data['settings'] = $.extend(true, _controller.getSettings(), _settings);
                    
                    $this.data('protoGallery', _data);
                    
                    _controller.setSettings(_data['settings']);
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