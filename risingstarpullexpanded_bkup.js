if (typeof(RPNS.RisingStarPullExpanded) == 'undefined') {
(function(win, doc){
	'use strict';

	var bannerPos;

	var RisingStarPullExpanded = function(el, config, bannerPosParam) {
		RPNS.ResponsiveExpanded.apply(this, arguments);
		// if (this.isMraid()) {
		// 	var expProp = mraid.getExpandProperties();
		// 	RPNS.device.height = expProp.height;
		// }


		this.mainAd = createExpandableAd(this);
		bannerPos = bannerPosParam;


		this.parentDoc = this.parentWin.document;
	}

	RisingStarPullExpanded.prototype = Object.create(RPNS.ResponsiveExpanded.prototype);
	var p = RisingStarPullExpanded.prototype;
	
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
		this.mainAd.style[bannerPos] = (-this.parentWin.innerHeight + delta + 'px');
	}

	p.completeExpansion = function() {
		this.mainAd.style[bannerPos] = 0;
	};

	p.close = function () {
		this.parentDoc.body.removeChild(this.mainAd);

		// Reset vertical location, so it's not visible when re-launching.
		this.mainAd.style[bannerPos] = (-this.parentWin.innerHeight) + "px";
	}


	p.resizeExpandedAd = function() {
		var self = this;

		self.iframe.style.width = self.parentWin.innerWidth + "px";
		self.iframe.style.height = self.parentWin.innerHeight + "px";
		
		// If MainAd is not completely expanded
		if( parseInt(self.mainAd.style[bannerPos]) != 0 ) { 
			self.mainAd.style[bannerPos] = (-self.parentWin.innerHeight) + "px";
		}
	};

	function createExpandableAd(self) {
		// `self.iframe` property is used in ResponsiveExpanded & ResponsiveAd, 
		// which RisingStarPullExpanded inherits from
		self.iframe = self.getIframe(); 
		self.iframe.style.top = 'auto';


		var div = doc.createElement('div');
		div.setAttribute('id', 'rpfso_' + self.pid);
		div.style.cssText = "width:100%; height:100%; position: absolute; left: 0; "
						+ "opacity: 0.9; " 
						+ bannerPos + ": " + (-self.parentWin.innerHeight) + "px";
		div.appendChild(self.iframe);
		return div;
	}

	RPNS.RisingStarPullExpanded = RisingStarPullExpanded;
})(window, document);
}

