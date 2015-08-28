# proto-gallery-js

## Table of Contents

- [Usage](#usage)
- [Options](#options)
    - [onAction](#onaction)
    - [onInit](#oninit)
    - [onOpen](#onopen)
    - [onOpened](#onopened)
	- [onClose](#onclose)
	- [onClosed](#onclosed)
    - [onResize](#onresize)
    - [onChangeSlide](#onchangeslide)
    - [onShowSlide](#onshowslide)
- [Methods](#methods)
    - [open](#open)
    - [close](#close)
    - [settings](#settings)
- [Advanced usage](#advanced-usage)
    - [Dialog](#dialog)
    - [Controller](#controller)
- [Samples](#samples)
    - [Static](#static-setup)
    - [Runtime](#dynamic-setup)

## Usage

```html
<link rel="stylesheet" type="text/css" href="proto-gallery.css"/>
<script type="text/javascript" src="jquery.proto-gallery.js"></script>

<!-- ... -->

<div id="proto-gallery">
    <!-- Static Photos -->
    <figure data-photo="<!-- Photo url -->">
        <a href="<!-- Photo link -->">
            <img src="<!-- Thumbnail url -->" alt="<!-- Photo title -->"/>
        </a>
        <figcaption><!-- Thumbnail description --></figcaption>
    </figure>
    
    <!-- More statis photos -->
</div>
```

```javascript
$('#proto-gallery').protoGallery({
    'source' : 'selector',
    'selector': {
        'slide': 'figure',
        'thumbnail': 'img[src]',
        'photo': '[data-photo]',
        'title': 'img[alt]',
        'description': 'figcaption',
        'link': 'a[href]'
    }
});
```

## Options

```javascript
var protoGalleryOptions = {
    'source' : 'selector', // selector, query, collection
    'selector': {
        'slide': 'a',
        'thumbnail': 'img[src]',
        'photo': '[data-photo]',
        'title': 'img[alt]',
        'description': 'div',
        'link': '[href]'
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
    onAction: function(_action, $dialog) {
    },
    onChangeSlide: function(_slide, $dialog) {
        return true;
    },
    onShowSlide: function(_slide, $dialog) {
        return true;
    }
};
```

### source

Type: `String`
Default: `selector`
Values: `selector|query|collection`

#### Selector Source

Define the source where the slides are going to bee looked for. Usually looked in $('#proto-gallery').find(settings.selector.slide)

```javascript
var settings = {
    'source' : 'selector',
    'selector': {
        'slide': 'a',
        'thumbnail': 'img[src]',
        'photo': '[data-photo]',
        'title': 'img[alt]',
        'description': 'div',
        'link': '[href]'
    }
};
```

#### Query Source

Define the source where the slides are going to bee looked for. Usually looked in $('#proto-gallery').find(settings.selector.slide)

```javascript
var settings = {
    'source' : 'query',
    'query': '#proto-gallery a',
    'selector': {
        'slide': 'a', // not used
        'thumbnail': 'img[src]',
        'photo': '[data-photo]',
        'title': 'img[alt]',
        'description': 'div',
        'link': '[href]'
    }
};
```

#### Collection Source

Define the source where the slides are going to bee looked for. Usually looked in $('#proto-gallery').find(settings.selector.slide)

```javascript
var settings = {
    'source' : 'collection',
    'collection': [
        {
            'photo': 'photo url'
            [,'element': $( /*Slide object*/ )]
            [,'link': 'link value]
            [,'thumbnail': 'thumbnail url']
            [,'title': 'title text']
            [,'description': 'description text']
        }
        [, ...]
    ]
};
```

### onInit

Type: `Function`
Default: `function ($dialog) {}`

This method is called when the dialog is initialized for the first time, and it is called one time only from the widget.

```javascript
var onInit: function ($dialog) {
    var protoGalleryContent = $dialog.find('.proto-gallery-content');
    var dialogFooter = $dialog.find('#proto-gallery-footer');
    var dialogHeader = $(this).find('#proto-gallery-header');
};
```

### onOpen

Type: `Function`
Default: `function ($dialog) {}`

This method is called each time before the dialog is to be opened.

### onOpened

Type: `Function`
Default: `function ($dialog) {}`

This method is called each time after the dialog has been opened.

### onClose

Type: `Function`
Default: `function ($dialog) {}`

This method is called each time before the dialog is to be closed.

### onClosed

Type: `Function`
Default: `function ($dialog) {}`

This method is called each time after the dialog has been closed.

### onResize

Type: `Function`
Default: `function ($dialog) {}`

This method is called each time when the screen size changes.

### onChangeSlide

Type: `Function`
Default: `function (slideData, $canvas, oldSlideIndex, newSlideIndex) {}`

This method is called before the slide changing begins. Return FALSE if you want to animate slide changing.

### onShowSlide

Type: `Function`
Default: `function (slideData, $canvas) {}`

This method is called after the slide changing only if `onChangeSlide` is not returning FALSE.

## Methods

Take a look at the list of methods to control the dialog.

### open

This method is called to open a dialog manually.

```javascript
$('#proto-gallery').protoGallery('open', {/* Settings */});
```

### close

This method is called to close a dialog manually.

```javascript
$('#proto-gallery').protoGallery('close');
```

### settings

This method is called when you want to override settings.

```javascript
$('#proto-gallery').protoGallery('settings', {/* Settings */});
```

## Advanced usage

The advanced usage is about taking full control of the dialog.

### Dialog

Take a look at the dialog HTML structure in order to have a better view, and push your ideas further.
When ever you have a `$dialog` variable in a `on***` function, this will be your `$('.proto-gallery-overlay')` object.
The `<!-- Dialog content -->` is replaced by your target object that the widget is applied to.

```html
<div class="proto-gallery-content" id="proto-gallery-content">
    <div class="proto-gallery-loader" id="proto-gallery-loader"></div>
    <div class="proto-gallery-slider" id="proto-gallery-slider">
        <!-- Slides are going to be here -->
    </div>
    <div class="proto-gallery-info" id="proto-gallery-info">
        <h3 class="proto-gallery-slide-title" id="proto-gallery-slide-title"></h3>
        <div class="proto-gallery-slide-description" id="proto-gallery-slide-description"></div>
    </div>
</div>
```

### Controller

```javascript
var controllerInterface = {
    /**
     * Closes the dialog
     */
    'close': function () {},
    /**
     * Openes the dialog
     */
    'open': function () {},
    /**
     * Is dialog opened
     */
    'isOpened': function () {},
    /**
     * Defines new settings
     */
    'setSettings': function (settings) {},
    /**
     * Get current settings
     */
    'getSettings': function () {},
    /**
     * Add collection array
     */
    'addCollection': function (collection) {},
    /**
     * Get item
     */
    'addCollectionItem': function (item) {},
    /**
     * Set photos, clear previous collection
     */
    'setSlides': function ($slides) {},
    /**
     * Attach slides, same as appending
     */
    'attachSlides': function ($slides) {},
    /**
     * Attach slide
     */
    'attachSlide': function ($slide) {},
    /**
     * Remove item
     */
    'removeCollectionItem': function (index) {},
    /**
     * Get slide count
     */
    'getSlideCount': function () {},
    /**
     * Get slide by index
     */
    'getSlide': function (index) {},
    /**
     * Set slide for index
     */
    'setSlide': function (index, slide) {},
    /**
     * Remove all slides from screen
     */
    'noSlide': function () {},
    /**
     * Show first slide
     */
    'firstSlide': function () {},
    /**
     * Show last slide
     */
    'lastSlide': function () {},
    /**
     * Show next slide
     */
    'nextSlide': function () {},
    /**
     * Show previous slide
     */
    'previousSlide': function () {},
    /**
     * Get current slide index
     */
    'getCurrentSlide': function () {},
    /**
     * Set current slide index, only changes the index, use show slide to show it
     * @returns int current slide index
     */
    'setCurrentSlide': function (index) {},
    /**
     * Show slide by index
     */
    'showSlide': function (index) {}
};

/* Get dialog controller instance */
var _data = $('#proto-gallery').data('protoGallery');

// If the widget is initialized
if (_data) {
    var _controller = _data['controller'];
    var _settings = _data['settings'];
    var $target = _data['target']; // === $('#proto-gallery')
}
```

### Samples

#### Static setup

Define an element holding photos, apply widget to it.

```html
<div id="proto-gallery-static" class="proto-gallery">
    <a href="" data-photo="">
        <img src="" title=""/>
        <div></div>
    </a>
    <!-- more photos -->
</div>
<button id="open-gallery" type="button">Open Gallery</button>
```

```javascript
/* ... */

$('.proto-gallery').protoGallery({
    'source' : 'selector',
    'selector': {
        'slide': 'a',
        'thumbnail': 'img[src]',
        'photo': '[data-photo]',
        'title': 'img[alt]',
        'description': 'div',
        'link': '[href]'
    }
});

/* ... */

$('#open-gallery').on('click', function () {
    $('#proto-gallery-static').protoGallery('open');
});

```

#### Runtime setup

You can without initialization call a open method by providing settings,
Use any object for a dynamic gallery

```html
<button type="button" data-gallery="1001" class="dynamic-gallery">Load Gallery 1</button>
<button type="button" data-gallery="1002" class="dynamic-gallery">Load Gallery 2</button>
<button type="button" data-gallery="1003" class="dynamic-gallery">Load Gallery 3</button>
```

```javascript
/* ... */

$('.dynamic-gallery').on('click', function () {
    var galleryID = $(this).attr('data-gallery');

    $.ajax({
        url: queryUrl,
        dataType: 'json',
        data: {
            'gallery_id': galleryID
        },
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            $('body').protoGallery('open', {
                'source': 'collection',
                'collection': data
            });
        }
    });

});

```