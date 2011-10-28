( function() {
    var trueName = '';
    for (var i = 0; i < 16 ; i++) {
	trueName = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    window[trueName] = {};
    var $ = window[trueName];
    $.f = function() {
	return {
	    get_win: function() {
		var win = window;
		if(navigator.userAgent.toLowerCase().indexOf("msie")>=0 && window["ActiveXObject"]) {
		    // no way to enumerate them, so we brute force them out
		    // inspired by http://www.thomasfrank.se/global_namespace.html
		    var allt="";
		    var x=document.scripts;
		    for (var i=0;i<x.length;i++){
			if (x[i].innerHTML){allt+=x[i].innerHTML}
			else {if((x[i].src+"").indexOf("undefined")<0){allt+=this.getsrc(x[i].src)}}
		    };
		    allt=allt.replace(/\W/g," ").split(" ");
		    var obj={};
		    for(var i=0;i<allt.length;i++){if(window[allt[i]]!==undefined){obj[allt[i]]=true}};
		    for(var i in window){obj[i]=true};
		    win = obj;
		}
		return win;
	    },
		    
	    add_css_link: function(css_link) {
		/* Create a link in the HEAD */
		var head = document.getElementsByTagName('head')[0];
		if (!head) {
		    // the jokes just write themselves
		    // but apparently Opera doesn't have to have a head
		    var body = document.getElementsByTagName('body')[0];
		    head = document.createElement('head');
		    body.parentNode.insertBefore(head, body);
		}
		stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.type = 'text/css';
		stylesheet.href = css_link;
		head.appendChild(stylesheet)
	    },
	    init: function(target, innards, css_links, backwards_compat_prefix) {
		/* Insert the CSS links into the document */
		for (var i = 0 ; i < css_links.length; i++) {
		    $.f.add_css_link(css_links[i]);
		}

		var theScripts = document.getElementsByTagName('SCRIPT');
		for (var i = 0 ; i < theScripts.length; i++) {
		    if (theScripts[i].src.match(target)) {
			$.w = document.createElement('DIV');
			$.a = {};
			
			var variable;

			var old_data = [];
			// if backwards_compat_prefix is not null
			if (backwards_compat_prefix != null) {
			    // attempt to import data from window's global variables (for backwards compatibility)
			    for (variable in $.f.get_win()) {
				// if it starts with the right thing, stash it away
				if (variable.substring(backwards_compat_prefix.length, 0) == backwards_compat_prefix) {
				    old_data[variable.substring(backwards_compat_prefix.length)] = window[variable];
				}
			    }
			}
			
			if (theScripts[i].innerHTML) {
			    $.a = $.f.parseJson(theScripts[i].innerHTML);
			}
			if ($.a.err) {
			    alert('bad json!');
			}

			for (variable in old_data) {
			    if (variable in $.a) {
				// do nothing - we have a version of this datum in new format
			    }  else {
				// jam into $.a
				$.a[variable] = old_data[variable];
			    }
			}
			
			// Take the text replacement stuff from JSON blah blah
			for (variable in $.a) {
                            innards = innards.replace('[[' + variable +']]', $.a[variable]);
                        }
			
			// FIXME: Decide what to do with styles
			$.w.innerHTML = innards;
			
			theScripts[i].parentNode.insertBefore($.w, theScripts[i]);
			theScripts[i].parentNode.removeChild(theScripts[i]);
			break;
		    }
		}
	    },
	    parseJson: function(json) {
		this.parseJson.data = json;
		if (typeof json !== 'string') {
		    return {'err': 'trying to parse non-string as JSON'};
		}
		try {
		    var f = Function(['var document,top,self,window,parent,Number,Date,Object,Function,',
				      'Array,String,Math,RegExp,Image,ActiveXObject;',
				      'return (' , json.replace(/<\!--.+-->/gim,'').replace(/\bfunction\b/g,'function-') , ');'].join(''));
		    return f();
		} catch (e) {
		    return {'err': 'trouble parsing JSON object'};
		}
	    }
	};
    }();
    
    var thisScript = /widget.js/;
    var css_files = ["http://mirrors.creativecommons.org/campaignwidget/campaignwidget.css?2.0"];
    var stuff_inside_the_div = "<div id=\"cc_campaign_widget\" class=\"[[size]]\">\n <div id=\"cc_campaign_widget_bg\"><div id=\"cc_campaign_widget_bg_logo\">\n  <h1 id=\"cc_widget_title\"><span>Creative Commons</span></h1>\n  <p id=\"cc_widget_text\">[[text]]</p>\n  <div id=\"donors\">\n    Help support Creative Commons<br/>\n  </div>\n\n  <form method=\"get\" action=\"http://support.creativecommons.org/civicrm/contribute/transact\">\n\n  $<input id=\"cc_widget_donation\" name=\"donation\" value=\"[[d_amt]]\" size=\"6\" />\n  <input name=\"reset\" value=\"1\" type=\"hidden\" />\n  <input name=\"id\" value=\"7\" type=\"hidden\" />\n\n  &nbsp;<input type=\"submit\" id=\"cc_widget_donation_btn\" value=\"[[d_btn]]\" />\n\n  </form>\n  \n  <div id=\"cc_widget_get\"><a href=\"http://support.creativecommons.org/widget\" id=\"cc_widget_share\">[[share]]</a></div>\n </div></div>\n</div>\n";
    var backwards_compat_prefix = "cc_widget_";
    if (typeof window.addEventListener !== 'undefined') {
	window.addEventListener('load', function() { $.f.init(thisScript, stuff_inside_the_div, css_files, backwards_compat_prefix); }, false);
    } else {
	window.attachEvent('onload', function() { $.f.init(thisScript, stuff_inside_the_div, css_files, backwards_compat_prefix); });
    }
})();
