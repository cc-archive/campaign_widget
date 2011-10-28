// CC Donation Widget 2.0
// Minified size limit goal: 10k

var recurringAmount = 0.0;

// set a default premium id
var premiumId = 26;

// Mini jQuery replacement - q
var q = function(selector) {
	return new q.fn.init(selector);
}

q.fn = q.prototype = {
	selector: "",
	
	init: function(selector) {
		this.selector = [];
		
		if (!selector) return;
	
		if (typeof selector == "object") {
			this.selector.push(selector);
			return;
		}
		
		if (selector.match(/^#/)) {
			this.selector.push(document.getElementById(selector.substring(1, selector.length)));
			return;
		}
		if (selector.match(/^\./)) {
			this.selector.push(document.getElementsByClassName(selector.substring(1, selector.length)));
			return;
		}
		if (selector.match(/^name=/)) {
			this.selector = document.getElementsByName(selector.substring(5, selector.length));
			return;
		}

		//if (selector.match(/^:/)) {
		this.selector = document.getElementsByTagName(selector);
		
	},
	
	first: function() {
		return new q.fn.init(this.selector[0]);
	},
	
	length: function() {
		return this.selector.length;
	},
	
	nth: function(n) {
		return this.selector[n];
	},
	
	each: function(callback) {
		if (typeof callback != "function") return;
		
		l = this.selector.length;
		for (i = 0; i < l; i++) {
			callback.call(this.selector[i]);
		}
	},
	
	show: function(fade) {
		this.each(function() { 
			if (this.style.display == "block") return;
			
			this.style.display = "block"; 
			if (fade) q(this).fadeIn(300);
		});
	},
	
	hide: function(fade) {
		this.each(function() { 
			if (this.style.display == "none") return;

			if (fade) {
				q(this).fadeOut(300);
				return;
			}
			this.style.display = "none"; 
		});
	},
	
	toggle: function() {
		this.each(function() {
			if (this.style.display == "none") {
				this.style.display = "block";
			} else {
				this.style.display = "none";
			}
		});
	},
	
	checked: function(setIsChecked) {
		if (!setIsChecked) {
			return this.selector[0].checked;
		}
		this.each(function() { this.checked = setIsChecked; });
	},
	
	html: function(value) {
		if (!value) {
			return this.selector[0].innerHTML;
		}
		this.each(function() { this.innerHTML = value; });
	},
	
	value: function(value) {
		if (!value) {
			return this.selector[0].value;
		}
		this.each(function() { this.value = value; });
	},
	
	// Build a querystring out of an object
	// No selector required (ie, "q().queryStringBuilder(Object)")
	queryStringBuilder: function(queryObject) {
		var keys = [];
		for (var key in queryObject) {
			if ((typeof queryObject[key] == "string") || (typeof queryObject[key] == "number")) {
				keys.push(key);
				keys.push(queryObject[key]);
			}
		}
		
		var length = keys.length;
		var queryString = "";
		for (i = 0; i < length; i++) {
			queryString += escape(keys[i]);
			
			if (i < (length - 1)) {
				if (i % 2) {
					queryString += "&";
				} else {
					queryString += "=";
				}
			}
		}
		
		return queryString;
	},
	
	fadeIn: function(duration) {
		this._fade (0.0, 1.0, duration);
	},
	
	fadeOut: function(duration) {
		this._fade (1.0, 0.0, duration);
	},
	
	_fade: function(start, end, duration) {
		e = this.selector[0];
		
		if (e.fadeInterval) clearInterval(e.fadeInterval);
		e.style.opacity = start;
		e.style.filter = "alpha(opacity=" + (start * 100) + ")";
		
		var fps = duration / 30;
		var incr = (end - start) / fps;
		var level = start;
		var time = 0;
	
		e.fadeInterval = setInterval(function() {
			level += incr;
			e.style.opacity = level; 
			e.style.filter = "alpha(opacity=" + (level * 100) + ")";
			
			time += fps;
			if (time > duration) { 
				clearInterval(e.fadeInterval); 
			
				if (e.style.opacity <= 0) {
					e.style.display = "none";
				}
			}
		}, fps);
	}
	
};
q.fn.init.prototype = q.fn;

function cc_hidePremiums(e) {
	q('#cc_widget_dialog_tshirtSize').toggle();
}

// cc_d: popup dialog
// cc_w: embedded widget
var cc_d = function() {
	return {
		href: "https://support.creativecommons.org/sites/default/modules/civicrm/bin/OneClick.php?oc_action=donate&&source=Widget+Contribution:+Superhero+Campaign&",
		premiumId: 26,
		
		_create: function(name, _parent, _type, _typeName) {
			if (!cc_d.dialog) return;
			
			var parent = cc_d.dialog;
			if (_parent) {
				//alert(_parent);
				//parent = document.getElementById("cc_widget_" + _parent);
				parent = cc_d.dialog[_parent];
			}
			
			var type = "div";
			if (_type) {
				type = _type;
			}
			
			
			var e = document.createElement(type);
			e = e.cloneNode(false);
			//if (type == "button") e.type = "button";
			
			if (_typeName) e.type = _typeName;
			
			e.id = "cc_widget_dialog_" + name;
			parent.appendChild(e);
			
			cc_d.dialog[name] = e;
		},
		
		_showHideGifts: function(amount, fade) {
			(amount < 75) ? q("#cc_widget_dialog_noPremiums").show() : q("#cc_widget_dialog_noPremiums").hide();
			(amount >= 75) ? q("#cc_widget_dialog_premiums").show(fade) : q("#cc_widget_dialog_premiums").hide(fade);
			(amount >= 75) ? q("#cc_widget_dialog_giftCheck").value("yes") : q("#cc_widget_dialog_giftCheck").value("no");
			(amount >= 75) ? q("#cc_widget_dialog_giftCheck").checked(true) : q("#cc_widget_dialog_giftCheck").checked(false);
			(amount >= 75) ? q("#cc_widget_dialog_tshirtSize").show() : q("#cc_widget_dialog_tshirtSize").hide();
		},
		
		// Prepare the OneClick popup for display
		
		_prepare: function () {
			cc_d.queryString = Object();
			
			var amount = cc_d.queryString.amount = cc_w.widget.donation_amount.value;
			cc_d._showHideGifts(amount);
		
			q("#cc_widget_dialog_recur_annual").checked(false);
			q("#cc_widget_dialog_recur_inf").checked(false);
			q("#cc_widget_dialog_recur_none").checked(true);
			
			if (amount > 5) {
				if ((amount / 12) < 5) {
					recurringAmount = amount;
				} else {
					recurringAmount = parseFloat(amount / 12).toFixed(2);
				}
		
				// Fill in the popup's spans with the monthly amount
				q("#cc_widget_dialog_recurringAmountMonthly").html(recurringAmount);
				q("#cc_widget_dialog_recurringAmountInf").html(recurringAmount);
				q("#cc_widget_dialog_amount").html(amount);
		
				q("#cc_widget_dialog_recurring").show();
			} else {
				q("#cc_widget_dialog_recurring").hide();
			}
		
			q("#cc_widget_dialog_shirtError").html("");
		
			q("#cc_widget_dialog_optout").checked(false);
		
		},
		
		_process: function() {
			// Recurring donation options
			var recurring = "";
			q("name=cc_widget_dialog_recur").each(function() { if (this.checked && (this.value != "on")) recurring = this.value; });
			if (recurring) {
				console.log(recurring);
				cc_d.queryString.recur = recurring;
				cc_d.queryString.amount = recurringAmount;
			}
			
			if ((q("#cc_widget_dialog_giftCheck").checked() == true) && ((cc_d.queryString.amount >= 75) || (cc_d.queryString.recur && (cc_d.queryString.amount * 12 >= 75)))) {
				// premiumId is defined in a <script> block at the top of the donate page
				cc_d.queryString.premium = premiumId;
		
				// Validation
				// Can't continue if no shirt size is selected
				var shirtSize = q("name=cc_widget_dialog_size").value();
				if (shirtSize == "") {
					q("#cc_widget_dialog_shirtError").html("Please select a size!");
					return -1;
				}
				cc_d.queryString.size = shirtSize;
			}
		
			// Select all the checked checkboxes with the name 'lists', add their value to an array.
			var groups = new Array();
			q("name=cc_widget_dialog_groups").each(function() { if (this.checked) groups.push(this.value); });
			if (groups.length) cc_d.queryString.groups = groups.join(":");
		
			// Check if user is opting out of appearing on any lists
			if (q("name=cc_widget_dialog_optout").checked()) {
				cc_d.queryString.sloptout = "IChooseToSloptOut"; 
			}
		},
				
		init: function(title, bodyContent) {
			if (cc_d.dialog) return;
			
			cc_d.dialog = document.createElement("div");
			cc_d.dialog.id = "cc_widget_dialog";
			cc_d.dialog.style.display = "none";
			
			cc_d._create("header");
			cc_d.dialog.header.innerHTML = "<h2>" + title + "</h2>";
			
			cc_d._create("body");
			cc_d.dialog.body.innerHTML = "<p>" + bodyContent + "</p>";
			
			cc_d._create("footer");
			cc_d._create("paypal_button", "footer", "button");
			cc_d.dialog.paypal_button.innerHTML = "<span>Paypal</span>";
			cc_d.dialog.paypal_button.onclick = cc_d.paypalClick();
			
			
			cc_d._create("google_button", "footer", "button");
			cc_d.dialog.google_button.innerHTML = "<span>Google Checkout</span>";
			cc_d.dialog.google_button.onclick = cc_d.googleClick();
			
			cc_d._create("cancel_button", "footer", "button");
			cc_d.dialog.cancel_button.innerHTML = "I've changed my mind";
			cc_d.dialog.cancel_button.onclick = function() { cc_d.close() };

			q("body").nth(0).appendChild(cc_d.dialog);
			
			q("#cc_widget_dialog_recur_annual").nth(0).onclick = function() { cc_d.recurCheck(1); };
			q("#cc_widget_dialog_recur_inf").nth(0).onclick = function() { cc_d.recurCheck(2); };
			q("#cc_widget_dialog_recur_none").nth(0).onclick = function() { cc_d.recurCheck(); };
								
		},
		
		paypalClick: function() {
			return function() {
				//
				// PAYPAL
				
				if (cc_d._process() == -1) {
					console.log("error");
					return;
				}
				
				cc_d.queryString.pp = "paypal";
				
				href = cc_d.href + q(null).queryStringBuilder(cc_d.queryString);
								
				cc_d.close();
//				q("#ocResult").html(href);
				location.href = href;
			};
		},
		
		googleClick: function() {
			return function() {
				//
				// Google Checkout
				//
				
				if (cc_d._process() == -1) {
					console.log("error");
					return;
				}
				
				cc_d.queryString.pp = "gc";
				
				href = cc_d.href + q(null).queryStringBuilder(cc_d.queryString);
				
				cc_d.close();
	//			q("#ocResult").html(href);
				location.href = href;	
			};
		},
		
		recurCheck: function(recurType) {
			switch(recurType) {
				case 1:
				case 2:
					cc_d._showHideGifts(cc_d.queryString.amount * 12, true);
					break;
				default:
					cc_d._showHideGifts(cc_d.queryString.amount, true);
			}
		},
		
		open: function() {
			if (!cc_d.dialog) {
				alert("run cc_w.init method first");
				return;
			}
			
			if (cc_d.dialog.style.display == "block") return;
			
			cc_d._prepare();
			
			// go go go!
			cc_d.dialog.style.display = "block";
			
			// reposition
			t = (document.documentElement.clientHeight / 2) - (cc_d.dialog.clientHeight / 2) + document.body.scrollTop;
			if (t < 0) t = 10;
			
			cc_d.dialog.style.top = t + "px";
			cc_d.dialog.style.left = (document.documentElement.clientWidth / 2) - (cc_d.dialog.clientWidth / 2) + "px";
			
			q(cc_d.dialog).fadeIn(200);
		},
		
		close: function() {
			//this.dialog.style.display = "none";
			q(cc_d.dialog).fadeOut(200);
		},
		
		toggle: function() {
			if (cc_d.dialog.style.display == "block") {
				cc_d.close();
				return;
			}
			cc_d.open();
		}
	};
} ();


var cc_w = function() {
	return {
		_create: function(name, _parent, _type, _typeName) {
			if (!cc_w.widget) return;
			
			var parent = cc_w.widget;
			if (_parent) {
				parent = cc_w.widget[_parent];
			}
			
			var type = "div";
			if (_type) {
				type = _type;
			}
			
			var e = document.createElement(type);
			e = e.cloneNode(false);
			if (_typeName) e.type = _typeName;
			
			e.id = "cc_widget_" + name;
			parent.appendChild(e);
			
			cc_w.widget[name] = e;
		},
		
		init: function (scriptTag, text, donation, donateButton, size) {
			if (text == null) text = "Be a hero and support Creative Commons!";
			if (donation == null) donation = "25";
			if (size == null) size = "normal";
			if (donateButton == null) donateButton = "Donate";
			
			cc_w.widget = document.createElement("div");
			cc_w.widget.id = "cc_widget";
			cc_w.widget.className = "cc_widget_size_" + size;
			scriptTag.parentNode.insertBefore(cc_w.widget, scriptTag.nextSibling);
			
			cc_w._create("widget_base");
			cc_w._create("widget_title", "widget_base", "h1");
			q("#cc_widget_widget_title").html("<span>Creative Commons</span>");
			
			cc_w._create("widget_text", "widget_base", "p");
			q("#cc_widget_widget_text").html(text);
			
			cc_w._create("widget_form", "widget_base", "form");
			q("#cc_widget_widget_form").html("$");
			
			cc_w._create("donation_amount", "widget_form", "input");
			cc_w.widget.donation_amount.value = donation;
			cc_w.widget.donation_amount.size = 6;
			
			cc_w._create("donation_donate", "widget_form", "input", "submit");
			cc_w.widget.donation_donate.value = donateButton;
				
			cc_w._create("share", "widget_base");
			q("#cc_widget_share").html('<a href="https://support.creativecommons.org/widget">Share</a>');
						
		}
	};
} ();

(function() {
	// Insert necessary stylesheet file to the page <head>
	function insertCSS() {
		var head = q("head").selector[0];
	    if (!head) {
			// the jokes just write themselves
			// but apparently Opera doesn't have to have a head
			// -asheesh
			var body = q("body").selector[0];
			head = document.createElement('head');
			body.parentNode.insertBefore(head, body);
	    }
	    
	    stylesheet = document.createElement('link');
	    stylesheet.rel = 'stylesheet';
	    stylesheet.type = 'text/css';
	    stylesheet.href = "http://creativecommons.org/includes/widget.css?2.0";
	    head.appendChild(stylesheet);
	}
	
	// Find where the script tag we're loading from is in the page
	// When a script tag is encountered it is always the last, we can leverage this
	// and save our position for later
	var pageScripts = document.getElementsByTagName("script");
	var ccWidgetScriptTag = pageScripts[pageScripts.length - 1];
	
	// Add link tag to head ASAP to avoid any flickering
	insertCSS();
	
	function thundercatsHo() {
		widgetText = null;
		widgetDonate = null;
		widgetDonateButton = null;
		widgetSize = null;
		
		// simple scripting attack protection; official options string contains no semi-colons.
		// semi-colons would allow for other values, or manipulation inside the eval()
		if (!ccWidgetScriptTag.innerHTML.match(/;/)) {
			try {
				eval("json = " + ccWidgetScriptTag.innerHTML);
		
				if (json) {
					if (json.text) widgetText = json.text;
					if (json.d_amt) widgetDonate = json.d_amt;
					if (json.d_btn) widgetDonateButton = json.d_btn;
					if (json.size) widgetSize = json.size;
				}
			} catch (e) {}
		}	
		
		cc_d.init("Donate to Creative Commons", '<div id="cc_widget_dialog_moreOptions"><p style="float: right"><img src="https://support.creativecommons.org/sites/default/files/cc-shirt-ft.png" alt="Supporter Shirt"><br><small>Supporter T-Shirt<br>CC-BY <a href="http://www.flickr.com/photos/franktobia/3722933771">Frank Tobia</a></small></p><form name="donateOptions" id="cc_widget_dialog_donateOptions"><div id="cc_widget_dialog_noPremiums" style="display:block;"><p><strong>Note:</strong> You will not receive any premiums, including the campaign t-shirt, at this donation&nbsp;level.</p></div><div id="cc_widget_dialog_recurring" style="display:block;"><h5>Monthly Donation <small>(Optional)</small></h5><p><input type="radio" name="cc_widget_dialog_recur" value="1" id="cc_widget_dialog_recur_annual"> $<span name="cc_widget_dialog_recurringAmount" id="cc_widget_dialog_recurringAmountMonthly"></span> per month <em>for the next year</em>.<br><input type="radio" name="cc_widget_dialog_recur" value="2" id="cc_widget_dialog_recur_inf"> $<span name="cc_widget_dialog_recurringAmount" id="cc_widget_dialog_recurringAmountInf"></span> per month <em>until I choose to cancel</em>.<br><input type="radio" name="cc_widget_dialog_recur" id="cc_widget_dialog_recur_none"> A single donation of $<span id="cc_widget_dialog_amount"></span>.</p></div><div id="cc_widget_dialog_premiums" style="display:block;"><h5>Gift Options</h5><p><input id="cc_widget_dialog_giftCheck" onchange="cc_hidePremiums(this);" name="giftCheck" type="checkbox" checked value="yes" class="cc_widget_dialog_form-checkbox"><label for="giftCheck">I would like to receive a gift for my donation.</label></p><div id="cc_widget_dialog_tshirtSize"><h5>Tshirt Size</h5><select name="cc_widget_dialog_size"><option value="">-- Select Size --</option><option value="Women\'s Medium">Women\'s Medium</option><option value="Adult Small">Adult Small</option><option value="Adult Medium">Adult Medium</option><option value="Adult Large">Adult Large</option><option value="Adult X-Large">Adult X-Large</option><option value="Adult XX-Large">Adult XX-Large</option></select><span id="cc_widget_dialog_shirtError"></span></div></div><h5>Mailing List Opt-in</h5><p><input id="cc_widget_dialog_newsletterGroup" name="cc_widget_dialog_groups" type="checkbox" value="CC Newsletter" class="cc_widget_dialog_form-checkbox"><label for="newsletterGroup">Yes, I would like to receive CC Newsletters.</label><br><input id="cc_widget_dialog_eventsGroup" name="cc_widget_dialog_groups" type="checkbox" value="CC Events" class="cc_widget_dialog_form-checkbox"><label for="eventsGroup">Yes, I would like to be notified about CC events.</label></p><h5>Supporter Listing Opt-out</h5><p><input id="cc_widget_dialog_optout" name="cc_widget_dialog_optout" type="checkbox" value="Supporters" class="cc_widget_dialog_form-checkbox"><label for="optout">Do not include my name in any supporter lists.</label></p><div class="cc_widget_dialog_paymentOptions"><h5>Payment Options</h5><ul><li><strong>PayPal</strong> — Use your credit card or PayPal account.</li><li><strong>Google Checkout</strong> — Requires a Checkout account.</li></ul></div></form></div>');
		cc_w.init(ccWidgetScriptTag, widgetText, widgetDonate, widgetDonateButton, widgetSize);
			
		q("#cc_widget_donation_donate").selector[0].onclick = function() { 
			cc_d.open(); 
			return false;
		} 
	}
	
	if (typeof window.addEventListener !== 'undefined') {
		window.addEventListener('load', thundercatsHo(), false);
	} else {
		window.attachEvent('onload', thundercatsHo);
	}
})();
