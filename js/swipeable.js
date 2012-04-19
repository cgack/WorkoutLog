/*!
 *jQuery Mobile Swipeable Widget
 *Copyright (c) 2012 Cory Gackenheimer
 *Licensed under the MIT license.
 *http://cgack.mit-license.org
 */


;(function( $, undefined ) {

$.widget( "cgack.swipeable", $.mobile.widget, {
	options: {
		heading: "h1,h2,h3,h4,h5,h6,div,p,legend",
		showRight: ":jqmData(show='right')",
		showLeft: ":jqmData(show='left')",
		initSelector: ":jqmData(role='swipeable')",
		swipeLeft: ":jqmData(swipe='left')",
		swipeRight: ":jqmData(swipe='right')",
		swipeBoth: ":jqmData(swipe='both')"
	},
	_create: function() {

		var $el = this.element,
			o = this.options,
			swipeable = $el,
			swipeheader = $el.find( o.heading ).first(),
			swipecontent = swipeable.wrapInner( "<div class='ui-swipeable-content' ></div>" ).find( ".ui-swipeable-content" );
			
		swipeable.addClass( "ui-swipeable" );
		swipeheader.addClass( "ui-swipeable-header" ).insertBefore( swipecontent );
		
		o.showRight = swipeable.find( o.showRight ).length > 0 ? swipeable.find( o.showRight ).insertBefore( swipecontent ) : swipecontent;
		o.showLeft = swipeable.find( o.showLeft ).length > 0 ? swipeable.find( o.showLeft ).insertBefore( swipecontent ) : swipecontent;
		
		o.showRight.addClass( "ui-swipeable-rcontent" ).hide();
		o.showLeft.addClass( "ui-swipeable-lcontent" ).hide();
		//Determine the direction we want to bind our listeners to
		var swiperight = swipeable.is( o.swipeRight ) || o.swipeRight === true,
				swipeleft = swipeable.is( o.swipeLeft ) || o.swipeLeft === true,
				swipeboth = swipeable.is( o.swipeBoth ) || o.swipeBoth === true;

		//Custom event bindings
		swipeable.bind( "showRight", function() {
			if ( o.showRight.is( ":visible" ) ) {
				o.showRight.hide();
				if ( !o.showLeft.is( ":visible" ) ) {
					swipeheader.show();
				}
			} else {
				o.showRight.show();
				swipeheader.hide();
			}
		});
		
		swipeable.bind( "showLeft", function() {
			if ( o.showLeft.is( ":visible" ) ) {
				o.showLeft.hide();
				if ( !o.showRight.is( ":visible" ) ) {
					swipeheader.show();
				}
			} else {
				o.showLeft.show();
				swipeheader.hide();
			}
		});

		swipeable.bind( "noswipe", function() {
			var ishidden = false;
			if ( (swiperight  || swipeboth) && o.showRight.is( ":visible" )) {
				o.showRight.hide()
				ishidden = true;
			} else if ( !swipeleft ){
				o.showRight.show();
			}

			if ( (swipeleft || swipeboth) && o.showLeft.is( ":visible" ) ) {
				o.showLeft.hide();
				ishidden = true;
			} else { 
				o.showLeft.show();
			}

			if ( ishidden ) {
				swipeheader.show();
			} else {
				swipeheader.hide();
			}
		});
		//Bind our listeners fallback to click where there is no touch support
		if ( swiperight ) {
			swipeable.bind( "swiperight", function( event ) { 
				swipeable.trigger( "showRight" ); 
				event.preventDefault(); 
			});
		} else if ( swipeleft ) {
			swipeable.bind( "swipeleft", function( event ) { 
				swipeable.trigger( "showLeft" ); 
				event.preventDefault(); 
			});
		}
		if ( swipeboth ) {
			swipeable.bind( "swipeleft", function( event) { 
				swipeable.trigger( "showLeft" ); 
				event.preventDefault(); 
			});
			swipeable.bind( "swiperight", function( event){ 
				swipeable.trigger( "showRight" ); 
				event.preventDefault(); 
			});
		} 
	  if ( !$.support.touch ) {
			swipeable.bind( "click", function( event ) { 
				swipeable.trigger( "noswipe" ); 
				event.preventDefault(); 
			});
		}
	}
});


//auto self-init widgets
$( document ).bind( "mobileinit pagecreate create", function( e ){
	$( $.cgack.swipeable.prototype.options.initSelector, e.target ).swipeable();
});


})(jQuery);
