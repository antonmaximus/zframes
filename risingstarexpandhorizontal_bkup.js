if (typeof(RPNS.RisingStarExpandHorizontal) == 'undefined') {
(function(win, doc){
	'use strict';


	var RisingStarExpandHorizontal = function(el, config, animateProperty) {
		RPNS.ResponsiveExpanded.apply(this, arguments);
		// if (this.isMraid()) {
		// 	var expProp = mraid.getExpandProperties();
		// 	RPNS.device.height = expProp.height;
		// }

		this.ap = "left";
		this.mainAd = createExpandableAd(this);

		this.parentDoc = this.parentWin.document;
	}

	RisingStarExpandHorizontal.prototype = Object.create(RPNS.ResponsiveExpanded.prototype);
	var p = RisingStarExpandHorizontal.prototype;
	
	p.buildQueryString = function() {
		var url = RPNS.ResponsiveAd.prototype.buildQueryString.call(this);
		return url + '&expanded=true&clsBtn=true';
	}




	p.launchExpandableAd = function() {
		this.resizeExpandedAd();
		this.parentDoc.body.appendChild(this.mainAd);
	}


	p.translateExpandableAd = function(delta) {
		this.resizeExpandedAd();
		this.mainAd.style[this.ap] = getInnerWidth(this) + delta + 'px';
	}

	p.completeExpansion = function() {
		this.mainAd.style[this.ap] = 0;
	};

	p.close = function () {
		this.parentDoc.body.removeChild(this.mainAd);

		// Reset vertical location, so it's not visible when re-launching.
		this.mainAd.style[this.ap] = -getInnerHeight(this) + "px";
	}


	p.resizeExpandedAd = function() {
		var self = this;
		self.iframe.style.width = getInnerWidth(this) + "px";
		self.iframe.style.height = getInnerHeight(this) + "px";
		
		// If Expandable Ad is not yet expanded, 
		// adjust the position so it's seamless on initial load
		if( parseInt(self.mainAd.style[self.ap]) != 0 ) { 
			self.mainAd.style[self.ap] = getInnerWidth(this) + "px";
		}
	};

	function createExpandableAd(self) {
		// `self.iframe` property is used in ResponsiveExpanded & ResponsiveAd, 
		// which RisingStarExpandHorizontal inherits from
		self.iframe = self.getIframe(); 

		// Set to auto so the iframe can inherit from the div
		self.iframe.style.top = 'auto';
		self.iframe.style.left = 'auto';

		var div = doc.createElement('div');
		div.setAttribute('id', 'rpfso_' + self.pid);
		div.style.cssText = "width:100%; height:100%; position: absolute; "
						+ "opacity: 0.9; " 
						+ "top: 0; "
						+ "left: " + getInnerWidth(self) + "px";

		div.appendChild(self.iframe);
		return div;
	}


	function getInnerWidth(self) {
		return self.parentWin.innerWidth;
	}

	function getInnerHeight(self) {
		return self.parentWin.innerHeight;
	}

	RPNS.RisingStarExpandHorizontal = RisingStarExpandHorizontal;
})(window, document);
}

