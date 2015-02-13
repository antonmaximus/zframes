if (typeof(RPNS.RisingStarAd) == 'undefined') {
	(function(win, doc){
		var RisingStarAd = function(el, config) {
			
			this.expand_type = this.deriveExpandableType(config.unitoptions);
			
			RPNS.ExpandableAd.apply(this, arguments);
		}
		RisingStarAd.prototype = Object.create(RPNS.ExpandableAd.prototype);
		var p = RisingStarAd.prototype;
		
		RisingStarAd.Formats = {
			PULL: 0,
			ADHESION: 1,
			SLIDER: 2,
			FPFLEX: 3
		}
		
		p.deriveExpandableType = function(unitoptions) {
			if (unitoptions.format == RisingStarAd.Formats.ADHESION) {
				return 'adhesion';
			} else {
				return unitoptions.expand_type;
			}
		}
		
		p.render = function() {
			if ( ! RPNS.device.supports('risingstar') && this.expand_type != 'adhesion') {
				return this.renderFallback();
			}
			
			var img = doc.createElement('img');
			img.width = this.width;
			img.height = this.height;
			img.src = this.host + this.noscript_image;
			img.style.cssText = 'cursor:pointer;padding:0;';
			img.id = 'rppld_img_' + this.pid;
			
			var el = doc.createElement('div');
			el.appendChild(img);
			this.setBannerPosition(el);			
			this.parentNode.appendChild(el);
			this.attachExpandTrigger(img);
		}
		
		p.renderFallback = function() {
			var el = RPNS.ExpandableAd.prototype.renderFallback.call(this);
			this.setBannerPosition(el);
		}
		
		p.setBannerPosition = function (el) {
			var css = 'height:' + this.height + 'px;width:' + this.width + 'px;left:50%;margin-left:-' + (this.width / 2) + 'px;z-index:999999;',
				self = this;
			switch (this.expand_type) {
				case 'pullup':
					css += 'position:fixed; bottom:0';
					break; 
				case 'pulldown':
				case 'slidetop':
					css += 'position:fixed; top:0';
					break;
				case 'slidebottom':
					css += 'position:fixed; bottom:0';
					break;
				case 'adhesion':
					css += 'bottom:0;-webkit-backface-visibility: hidden;';
					if (RPNS.device.supports('position.fixed')) {
						css += 'position:fixed;';
					} else {
						css += 'position:absolute;';
						RPNS.device.attachEvent(window, 'scroll', function(e){
							el.style.top = (window.pageYOffset + window.innerHeight - self.height) + 'px';
						});
					}
					break;
				default:
					css += 'position:absolute;bottom:0';
			}
			
			el.style.cssText = css;
		}
		
		p.attachExpandTrigger = function (el) {
			var that = this;
			RPNS.device.attachEvent(el, 'dragstart', function(e){
				e.preventDefault();
			});
			
			switch (this.expand_type) {
				case 'pullup':
					el.style.cssText += 'position:absolute;top:0;left:0;';
					that.expand();
				break;
				case 'pulldown':
					el.style.cssText += 'position:absolute;bottom:0;left:0;';
					that.expand();
				break;
				case 'slidetop':
					that.expand();
				break;
				case 'slidebottom':
					that.expand();
				break;
				case 'adhesion':
					this.fireMdmdImpression();
					RPNS.device.attachEvent(el, 'click', function(e){
						if ( ! RPNS.device.supports('risingstar')) {
							that.handleExit(unescape(that.click_macro) + that.click_tracker_url);
						} else {
							win.scrollTo(0, 0);
							that.expand();
						}
					});
					
					
					RPNS.lib.requireHammer(function(){
						
						var touchTarget = that.getBodyTag();
						if(RPNS.device.preview) {
							touchTarget = doc.body;
							el.parentNode.style.bottom = 'auto';
						}
						
						var hammertime = new that.parentWin.Hammer(touchTarget, {preventDefault: true, dragMinDistance: 0, dragLockMinDistance: 0, cssProps: {userDrag: 'auto'}});
						var onDragEnd = function(ev) {
							try {
								el.parentNode.style.display = 'block';
							} catch (e) { }
						}
						var onDrag = function(ev) {
							try {
								el.parentNode.style.display = 'none';
								if ( ! RPNS.device.supports('dragend')) {
									RPNS.device.recognizeDragEnd(onDragEnd);
								}
							} catch (e) { }
						}
						hammertime.on('pan', function(ev) {
							onDrag(ev);
						});
						hammertime.on('hammer.input', function(ev) {
							if (ev.isFinal) {
								onDragEnd(ev);
							} else if (Math.abs(ev.velocity) > 0) {
								onDrag(ev);
							}
						});
						hammertime.on('panend', function(ev) {
							onDragEnd(ev);
						});
					});
					
					console.log(el.parentNode);
					debugger;
					this.attachCloseButton(el.parentNode);
					var _s = this.closeButton.style;
					_s.position = "absolute";
					_s.top = "-11px";
					_s.right = "2px";
					_s.backgroundPosition = "top right";
					_s.backgroundSize = "24px auto";
					_s.padding = "0 0 10px 10px";
				break;
				default:
					RPNS.ExpandableAd.apply(this, arguments);
				break;
			}
		}
		
		p.expand = function(expanded_unit) {
			expanded_unit = expanded_unit || this.expanded_unit;
			
			var data = this.data();
			data.pid = data.pid + '-e';
			if (typeof(expanded_unit) =='undefined' || typeof(RPNS.loader.ads[data.pid]) != 'undefined') {
				return;
			}
			
			data.unit_id = expanded_unit.id;
			data.width = expanded_unit.width;
			data.height = expanded_unit.height;
			if (this.expand_type == 'adhesion') {
				RPNS.loader.ads[data.pid] = new RPNS.ResponsiveExpanded(this.el, data);
			} else {
				RPNS.loader.ads[data.pid] = new RPNS.RisingStarExpanded(this.el, data);
			}
			RPNS.loader.ads[data.pid].render();
		}
		
		RPNS.RisingStarAd = RisingStarAd;
	})(window, document);
}

