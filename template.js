( function() {
    var trueName = '';
    for (var i = 0; i < 16 ; i++) {
	trueName = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    window[trueName] = {};
    var $ = window[trueName];
    $.f = function() {
	return {
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
	    init: function(target, innards, css_links) {
		/* Insert the CSS links into the document */
		for (var i = 0 ; i < css_links.length; i++) {
		    $.f.add_css_link(css_links[i]);
		}

		var theScripts = document.getElementsByTagName('SCRIPT');
		for (var i = 0 ; i < theScripts.length; i++) {
		    if (theScripts[i].src.match(target)) {
			$.w = document.createElement('DIV');
			$.a = {};
			
			if (theScripts[i].innerHTML) {
			    $.a = $.f.parseJson(theScripts[i].innerHTML);
			}
			if ($.a.err) {
			    alert('bad json!');
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
		if (typeof jason !== 'string') {
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
    var css_files = ['css_files'];
    var stuff_inside_the_div = 'REPLACEME';
    if (typeof window.addEventListener !== 'undefined') {
	window.addEventListener('load', function() { $.f.init(thisScript, stuff_inside_the_div, css_files); }, false);
    } else {
	window.attachEvent('onload', function() { $.f.init(thisScript, stuff_inside_the_div, css_files); });
    }
})();


    
	     
		    
