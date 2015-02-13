if (typeof(RPNS.RisingStarSlider) == 'undefined') {
(function(win, doc){
	'use strict';

	var bannerPos; // Tells if banner is placed on top or bottom (i.e., pulldown or pullup)
	var animateProperty; // Property to Animate


	var RisingStarSlider = function(el, config) {
		var self = this;
		RPNS.Ad.apply(this, arguments);

		// Mobile Safari has a special case when the banner is on the bottom of the page.
		self.safariOffset = (RPNS.device.os.ios && bannerPos == "bottom" ) ? 35 : 0;

		bannerPos = (config.unitoptions.expand_type == 'slidebottom') ? 'bottom' : 'top'; 
		animateProperty = 'left';

		// These get instantiated on render
		self.banner;
		self.bannerHolder;
		self.parentDoc = self.parentWin.document;

		// Housekeeping for Expanded Ad
		var data = self.data();
		data.pid += '-e'; // ID convention
		data.unit_id = self.expanded_unit.id;
		data.width = self.expanded_unit.width; 
		data.height = self.expanded_unit.height;
		
		RPNS.loader.ads[data.pid] = new RPNS.RisingStarExpandHorizontal(self.el, data, bannerPos);
		self.expandableAd = RPNS.loader.ads[data.pid];
	};

	RisingStarSlider.prototype = Object.create(RPNS.Ad.prototype);
	var p = RisingStarSlider.prototype;

	p.render = function() {
    	// Create Banner and put in the DOM
		this.banner = createBanner(this);
		this.bannerHolder = this.banner.parentNode;
		this.parentDoc.body.appendChild(this.bannerHolder);

		var self = this;
		if (RPNS.device.mobile) {
			RPNS.lib.requireHammer(function(){
				self.hammertime = new Hammer(self.bannerHolder, {preventDefault: true} );

				tapToExpand_hammer(self, self.hammertime);
				dragLeftToExpandMobile_hammer(self, self.hammertime);
			}); 
		} else {
			dragLeftToExpandDesktop(this);
		}
		attachResizeListener(this);

		// Analytics
		this.fireMdmdImpression();
	};

	function tapToExpand_hammer(self, hammerObj) {
		hammerObj.on('tap', function(event){ 
			self.expandableAd.launchExpandableAd();
			self.expandableAd.completeExpansion();
		});
	}


	function dragLeftToExpandMobile_hammer(self, hammerObj) {
    	var origOverflow = self.parentDoc.body.style.overflow; 
		var initialX;
		var origPropValue;

		hammerObj.on('panstart', function(event){ 
			// Prevent scrolling of the webpage
			self.parentDoc.body.style.overflow = "hidden"; 

			initialX = event.center.x;
			origPropValue = parseInt(win.getComputedStyle(self.bannerHolder)[animateProperty]);
			self.expandableAd.launchExpandableAd();
		});

		hammerObj.on('panmove', function(event){ 
			var deltaX = event.center.x - initialX;
			var newX = origPropValue + deltaX;

			self.bannerHolder.style[animateProperty] = newX + 'px';
			self.expandableAd.translateExpandableAd(deltaX);
		});

		hammerObj.on('panend', function(event){ 
			self.expandableAd.completeExpansion();
			resetBannerPosition(self, "50%");

            self.parentDoc.body.style.overflow = origOverflow;
		});
	}

	function dragLeftToExpandDesktop (self) {
        RPNS.device.attachEvent(self.bannerHolder, 'mousedown', function(event){ 
			var initialX = event.x;
			var origPropValue = parseInt(win.getComputedStyle(self.bannerHolder).left);
			self.expandableAd.launchExpandableAd();

			if(self.bannerHolder.setCapture) { self.bannerHolder.setCapture(); }


			self.parentDoc.onmousemove = function(event) {
				event = event || window.event;
				var deltaX = event.x - initialX;
				var newX = origPropValue + deltaX;

				self.bannerHolder.style[animateProperty] = newX + 'px';
				self.expandableAd.translateExpandableAd(deltaX);
			};

			self.parentDoc.onmouseup = function() {
				self.parentDoc.onmousemove = null;

				if(self.parentDoc.releaseCapture) { self.parentDoc.releaseCapture(); }

				self.expandableAd.completeExpansion();
				resetBannerPosition(self, "50%");
			};

			event.preventDefault();

    	});

	}



	function resetBannerPosition(self, x) {
		self.bannerHolder.style[animateProperty] = x;
	}

	function translateBanner(newPos, self) {
    	self.bannerHolder.style[bannerPos] = newPos + 'px';
	}
	
	function attachResizeListener(self) {
		RPNS.device.onResize(function() {
			self.expandableAd.resizeExpandedAd();
		}, self.parentWin);
	}

	function createBanner(self) {
		var banner = doc.createElement('img'),
			bannerHolder = doc.createElement('div');
			
		banner.src = self.host + self.noscript_image;
		banner.style.cssText = 'cursor: pointer; padding: 0;';
		banner.id = 'rppld_img_' + self.pid;

		bannerHolder.appendChild(banner); //parent of banner is an enclosing DIV
		var css = bannerPos + ": 0; "  // vertical align
				+ "position: fixed;"
				+ "margin-left: " + -self.width/2 + "px; " 
				+ "left: 50%; " 
				+ "height: " + self.height + "px; " 
				+ "width: "  + self.width  + "px; "; 

		if(self.safariOffset != 0) {
			css += "margin-bottom: " + self.safariOffset + "px; "
				+  "-webkit-box-shadow: rgba(0, 0, 0, 0.5) 0px 13px 22px 11px; " ;
				+  "   -moz-box-shadow: rgba(0, 0, 0, 0.5) 0px 13px 22px 11px; " ;
				+  "		box-shadow: rgba(0, 0, 0, 0.5) 0px 13px 22px 11px; " ;
		}

		bannerHolder.style.cssText = css;
		return banner;
	}


	
	RPNS.RisingStarSlider = RisingStarSlider;
})(window, document);
}

