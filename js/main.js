/*
 * Author: Matthijs Molhoek, 66Themes
 * URL: http://themeforest.net/user/66themes
 *
 * Project Name: Fragment -  Site Template
 * Version: 1.1
 * Date: 08-07-2013
 * URL: -
 */

(function () {
    /*global $:false */
    "use strict";

     // Init main header slides
     // SlitSlider by CoDrops | Plugin URL: http://tympanus.net/Tutorials/FullscreenSlitSlider/index2.html
     function initMainSlider() {
         var mainSlider = $( '.main-slider' ).slitslider({
            // transitions speed
            speed : 1500,
            // if true the item's slices will also animate the opacity value
            optOpacity : false,
            // amount (%) to translate both slices - adjust as necessary
            translateFactor : 230,
            // maximum possible angle
            maxAngle : 25,
            // maximum possible scale
            maxScale : 2,
            // slideshow on / off
            autoplay : true,
            // keyboard navigation
            keyboard : false,
            // time between transitions
            interval : 5000,
            // callbacks
            onBeforeChange : function( slide, idx ) { return false; },
            onAfterChange : function( slide, idx ) { return false; }
         });

         // Pause slider when out of view for performance
         window.onscroll = function() {
             var targetOffset = $(".wrap").offset().top-200;
             ($(window).scrollTop() <= targetOffset) ? (mainSlider.play()) : (mainSlider.pause());
         };
     }


     // Toggle nav-active class, show/hide main menu
     $(document).on("click", ".nav-trigger, .main-nav .button-close a", function(){
        $('body').toggleClass('nav-active');
     });

     // Scroll to section on nav item click
     $(document).on("click", '.main-nav a[href*="#"]', function(e){
        if ( !$(this).parent().hasClass('social-icons') ) {
            $('body').toggleClass('nav-active');

            e.preventDefault();

            $('html, body').animate({
                 scrollTop: $($(this).attr("href")).offset().top
             }, 1000);
        }
     });

     // Main header enter button click, move wrap to top
     $(document).on("click", ".state-enter", function(){
        $('html, body').animate({
            scrollTop: $(".wrap").offset().top - $('.top-bar').height()
        }, 1000);
     });

     // Move to top of tab content on tab item click
     $(document).on("click", ".tabs-nav a", function(e){
        e.preventDefault();

        $(this).on('shown', function (e) {
            $('html, body').animate({
                scrollTop: $(this).closest('.container').find('.tab-content').offset().top - $('.top-bar').height()
            }, 200, function(){
                // Refresh waypoints
                $.waypoints('refresh');
            });
        });
     });

     // Handle appear event for animated elements
     var wpOffset = 80;
     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        wpOffset = 100;
     }
     $.fn.waypoint.defaults = {
        context: window,
        continuous: true,
        enabled: true,
        horizontal: false,
        offset: 0,
        triggerOnce: false
     };
     $('.animated').waypoint(function(direction) {
        var elem = $(this);
        var animation = elem.data('animation');
        if ( !elem.hasClass('visible') ) {
            if ( elem.attr('data-animation-delay') !== undefined ) {
                var timeout = elem.data('animation-delay');

                setTimeout(function(){
                    elem.addClass( animation + " visible" );
                }, timeout);
            } else {
                elem.addClass( elem.data('animation') + " visible" );
            }
        }
     }, { offset: wpOffset+'%' });

     // HTML5 Placeholder attribute polyfill for non-supporting browsers(IE)
     $('input, textarea').placeholder();

     // Init Bootstrap tabs visible for sliders to init, will be hidden afterwards
     $('.tab-pane .flexslider').closest('.tab-pane').css('display', 'block');

     // Add odd class to odd counted section wraps
     $(".section-wrap:odd").addClass('odd');

     // AJAX page load for Portfolio/Blog and whatever needs to be loaded
     $(document).on("click", ".portfolio-link, .article-link, .modal-page-load", function(e) {
        // Disable default anchor beviour
        e.preventDefault();

        // Disable body scrolling
        $('body').addClass('modal-active');

        // Remove Content from Modal
        $('.modal-content').html();

        // Set loading state for page modal
        $('.modal-page').addClass('modal-loading');

        // Create and show loading spinner
        var spinnerOpts = {
            lines: 9, // The number of lines to draw
            length: 0, // The length of each line
            width: 5, // The line thickness
            radius: 11, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '0', // Top position relative to parent in px
            left: '0' // Left position relative to parent in px
        };
        var modalSpinner = new Spinner(spinnerOpts).spin( $('.modal-spinner')[0] );

        // Load page into modal
        $('.modal-page .modal-content').load($(this).attr('href'), function() {
            // Load success function

            // Remove loading state for page modal
            $('.modal-page').removeClass('modal-loading').addClass('modal-loaded');

            // Remove Spinner
            $('.modal-spinner').html('');

            initFlexSliders();

            cbpBGSlideshow.init();

            // Create and show slideshow loading spinner
            var spinnerOpts = {
                lines: 9, // The number of lines to draw
                length: 0, // The length of each line
                width: 10, // The line thickness
                radius: 11, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#fff', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 99, // The z-index (defaults to 2000000000)
                top: '0', // Top position relative to parent in px
                left: '0' // Left position relative to parent in px
            };
            var slideshowSpinner = new Spinner(spinnerOpts).spin( $('.portfolio-slider')[0] );
        });
     });


     // Modal close button click
     $(document).on("click", ".modal-top-bar .button-close", function(e) {
        // Disable default anchor beviour
        e.preventDefault();
        $(this).closest('.modal-page').removeClass('slider-active');

        $('.modal-content').html('');

        // Enable body scrolling
        $('body').removeClass('modal-active');
        $('.modal-page').removeClass('modal-loading modal-loaded');

        // Refresh waypoints
        $.waypoints('refresh');
     });


     // Modal content switcher click
     $(document).on("click", ".modal-page .content-switcher a", function(e) {
        var clickedElem = $(this);
        var containerModal = clickedElem.closest('.modal-page');

        // Disable default anchor beviour
        e.preventDefault();

        clickedElem.closest('.content-switcher').find('.active').removeClass('active');
        clickedElem.addClass('active');

        if( clickedElem.hasClass('switcher-slider') ) {
            containerModal.find('.portfolio-slider').addClass('visible');

            containerModal.addClass('slider-active');
        }
        else {
            containerModal.find('.portfolio-slider').removeClass('visible');

            containerModal.removeClass('slider-active');
        }
     });



     // Setup toggles
     $('.wrap').find('.toggle .toggle-content').stop().slideToggle(0);
     $('.wrap').find('.toggle-open').find('.toggle-content').stop().slideToggle(0);

     $('.toggle .toggle-header').click(function(){
        $(this).parent().toggleClass('toggle-open').find('.toggle-content').stop().slideToggle(200);
     });



     // Expandables, calculate and set height
     // Set height of any active exandable holders
     setupExpandable($('.expandable-active'));
     $(document).on("click", ".expandable-trigger", function(){
        setupExpandable( $(this) );
     });

     function setupExpandable(obj) {
        // Get all relevant elements
        var exHolder = obj.closest('.expandable-holder');
        var exElem = obj.closest('.expandable');
        var exContent = exElem.find('.expandable-content');

        // Deactivate all active expandables and remove holder margin
        $('.expandable-active').closest('.expandable-holder').attr('style', '').removeAttr('style');
        $('.expandable-active').toggleClass('expandable-active');

        exElem.toggleClass('expandable-active');

        // Get expandable holder and expandable content area height
        var exHolderHeight = exHolder.height();
        var exContentHeight = exContent.height();

        // Postion expandable content area below holder
        exContent.css('top', exHolderHeight + 'px');

        // Set expandable holder bottom offset
        exHolder.css('margin-bottom', exContentHeight+45 + 'px');
     }

     $(window).load(function(){
        // Init any defined slider
        // FlexSlider by WooThemes | http://www.woothemes.com/flexslider/
        initFlexSliders();


        // Init main header slides
        // SlitSlider by CoDrops | Plugin URL: http://tympanus.net/Tutorials/FullscreenSlitSlider/index2.html
        initMainSlider();


        // Init Isotope
        initIsotope();
        widthIsotope();


        // Init Contact Map Overlay
        if ( $('#contact-map').length > 0 ) {
            var myLatlng = new google.maps.LatLng(45.048852, 35.374903);
            var mapOptions = {
                center: myLatlng,
                // disableDefaultUI: true,
                zoom: 16,
                scrollwheel: false
                //mapTypeId: google.maps.MapTypeId.SATELLITE
            };
            var map = new google.maps.Map(document.getElementById("contact-map"),mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'г.Феодосия, ТЦ "Аквамарин" 2 этаж'
            });
        }


        // Setup Content Overlay
        $('.overlay-trigger').each(function(){
            $(this).setupContentOverlay();
        });


        // Refresh Page ScrollSpy
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this).scrollspy('refresh');
        });

        $('.button-status').removeClass('state-loading').addClass('state-enter');
     });

     $(window).resize(function(){
        reLayoutIsotope();


        $('.overlay-trigger').recalculateClip();

        // Refresh Page ScrollSpy
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this).scrollspy('refresh');
        });

        // Refresh waypoints
        $.waypoints('refresh');
         widthIsotope();
     });

     jQuery.fn.setupContentOverlay = function() {
        // Store required data
        var triggerElem = $(this);
        var overlayId = $(this).data('trigger-overlay');
        var overlayElem = $('#' + overlayId);

        $(this).fadeIn(0, function(){
            // Trigger clip values [top, right, bottom, left]
            var clipRect =
            [
                triggerElem.position().top,
                triggerElem.position().left+triggerElem.outerWidth(),
                triggerElem.position().top+triggerElem.outerHeight(),
                triggerElem.position().left
            ];
            // Set clip rectangle for content overlay
            if ( !$('html').hasClass('cssanimations') ) {
                overlayElem.animate({
                    clip: 'rect('+ clipRect[0] +'px, '+ clipRect[1] +'px, '+ clipRect[2] +'px, '+ clipRect[3] +'px)'
                }, 400);
            } else {
                overlayElem.css('clip', 'rect('+ clipRect[0] +'px, '+ clipRect[1] +'px, '+ clipRect[2] +'px, '+ clipRect[3] +'px)');
            }
        }).hide().delay(400).fadeIn(500, function(){
            overlayElem.removeClass('overlay-active');
        });
    };

    // Enlarge overlay on trigger click
    $(document).on("click", ".overlay-trigger", function(){
        // Store required data
        var triggerElem = $(this);
        var overlayId = $(this).data('trigger-overlay');
        var overlayElem = $('#' + overlayId);
        var overlayElemContainer = overlayElem.closest('.section-divider');

        overlayElem.addClass('overlay-active');

        // Trigger clip values [top, right, bottom, left]
        var clipRect =
        [
            0,
            overlayElemContainer.outerWidth(),
            overlayElemContainer.outerHeight(),
            0
        ];
        $(this).fadeOut(500, function(){
            // Set clip rectangle for content overlay
            if ( !$('html').hasClass('cssanimations') ) {
                overlayElem.animate({
                    clip: 'rect('+ clipRect[0] +'px, '+ clipRect[1] +'px, '+ clipRect[2] +'px, '+ clipRect[3] +'px)'
                }, 400);
            } else {
                overlayElem.css('clip', 'rect('+ clipRect[0] +'px, '+ clipRect[1] +'px, '+ clipRect[2] +'px, '+ clipRect[3] +'px)');
            }
        });

        // If vimeo has autoplay, start playing!
        var videoElem = overlayElem.find('.vimeo-autoplay');
        if(videoElem.length > 0) {
            setTimeout(
                function playVimeo() {
                    var iframe = videoElem[0],
                    player = $f(iframe);
                    player.api('play');
                },
            900);
        }
    });

    // Minimize overlay on close click
    $(document).on("click", ".container-overlay .button-close", function(){
        var overlayElem = $(this).closest('.overlay-active');
        $(this).closest('.section-divider').find('.overlay-trigger').setupContentOverlay();

        // If vimeo has autoplay, pause playing!
        var videoElem = overlayElem.find('.vimeo-autoplay');
        if(videoElem.length > 0) {
            setTimeout(
                function pauseVimeo() {
                    var iframe = videoElem[0],
                    player = $f(iframe);
                    player.api('pause');
                },
            400);
        }
    });

    jQuery.fn.recalculateClip = function() {
        return this.each(function() {
            // Store required data
            var triggerElem = $(this);
            var overlayId = triggerElem.data('trigger-overlay');
            var overlayElem = $('#' + overlayId);
            var overlayElemContainer = overlayElem.closest('.section-divider');
            var clipRect;

            if(overlayElem.hasClass('overlay-active')) {
                // Trigger clip values [top, right, bottom, left]
                clipRect =
                [
                    0,
                    overlayElemContainer.outerWidth(),
                    overlayElemContainer.outerHeight(),
                    0
                ];
            }
            else {
                // Trigger clip values [top, right, bottom, left]
                clipRect =
                [
                    triggerElem.position().top,
                    triggerElem.position().left+triggerElem.outerWidth(),
                    triggerElem.position().top+triggerElem.outerHeight(),
                    triggerElem.position().left
                ];
            }

            // Set clip rectangle for content overlay
            overlayElem.css('clip', 'rect('+ clipRect[0] +'px, '+ clipRect[1] +'px, '+ clipRect[2] +'px, '+ clipRect[3] +'px)');
        });
     };

     function initFlexSliders() {
        $('.flexslider').flexslider({
            animation: "slide",
            nextText: "",
            prevText: "",
            keyboard: false,
            slideshow: false,
            smoothHeight: true,
            start: function(){
                $('.tab-content>.tab-pane, .pill-content>.pill-pane').attr('style', '').removeAttr('style');
                $.waypoints('refresh');
                reLayoutIsotope();
            },
            after: function(){
                // Init Isotope
                reLayoutIsotope();
            }
        });
    }

    function initIsotope() {
        // Init Portfolio masonry
        var $container = $('.portfolio-container');
        $container.isotope({
            resizable: false,
            masonry: {
                columnWidth: 1
            }
        });

        $(document).on("click", ".filter-portfolio a", function(e) {
            e.preventDefault();
            $(this).closest('.filters').find('a').removeClass('selected');
            $(this).toggleClass('selected');

            var selector = $(this).attr('data-filter');
            $('.portfolio-container').isotope({
                filter: selector,
                masonry: {
                    columnWidth: 1
                }
            }, function() {
                // Refresh waypoints
                $.waypoints('refresh');
            });

            return false;
        });


        // Init Portfolio masonry
        $('.entries-container').isotope({
            itemSelector : '.blog-entry'
        });
    }

    function reLayoutIsotope() {
        $('.isotope').isotope( 'reLayout' );
    }

    function widthIsotope() {
        //alert($(".portfolio-container").parent().width())
        //alert($(".portfolio-item").width())
        var itemWidth = $(".portfolio-item").width();
        var itemMargin = $(".portfolio-item").css("margin-left");
        if(itemMargin == "10px"){
            itemWidth = itemWidth + 20
        } else {
            itemWidth = itemWidth + 30
        }

        var containerWidth = $(".portfolio-container").parent().width();
        if(itemWidth && containerWidth){
            if(containerWidth < itemWidth*2){
                var dif = (containerWidth - itemWidth)/2;
                $(".portfolio-container").css("margin-left",dif+"px");
            } else if(containerWidth < itemWidth*3){
                var dif = (containerWidth - itemWidth*2)/2;
                $(".portfolio-container").css("margin-left",dif+"px");
            } else if(containerWidth < itemWidth*4){
                var dif = (containerWidth - itemWidth*3)/2;
                $(".portfolio-container").css("margin-left",dif+"px");
            } else {
                var dif = ( containerWidth-itemWidth*4)/2;
                $(".portfolio-container").css("margin-left",dif+"px");
            }
        }
        //alert($(".portfolio-container").width())
    }

    // Contact form validation & AJAX submit
    // Create loading spinner
    var spinnerOpts = {
        lines: 9, // The number of lines to draw
        length: 0, // The length of each line
        width: 5, // The line thickness
        radius: 11, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '0', // Top position relative to parent in px
        left: '0' // Left position relative to parent in px
    };
    var targetSpinner = $('.spinner-holder').hide();
    var spinner = new Spinner(spinnerOpts).spin(targetSpinner[0]);

    // Validate the contact form
    var v = $("#contactForm").validate({
        submitHandler: function(form) {
            var feedbackElem = $(form).find('.feedback-text').hide();
            var spinnerElem = $(form).find('.spinner-holder').fadeIn(300);

            // If it validates, send the form
            jQuery(form).ajaxSubmit({
                //target: "#loader",
                success: function() {
                    // Fade out the spinner and show the succes text
                    spinnerElem.fadeOut(300, function(){
                        feedbackElem.fadeIn(300).text("Thank you for your message, we'll get back to you ASAP!");
                    });

                    $(form).find('input[type="submit"]').attr('disabled', 'disabled');
                }
            });

            return false;
        }
    });
}());