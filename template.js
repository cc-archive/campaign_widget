( function() {
    var trueName = '';
    for (var i = 0; i < 16 ; i++) {
	trueName = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    window[trueName] = {};
    var $ = window[trueName];
    $.f = function() {
	return {
	    init: function(target, innards) {
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
			var my_div = document.createElement('DIV');
			my_div.innerHTML = innards;
			
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
    
    var thisScript = /contribute.js/;
    var stuff_inside_the_div = 'REPLACEME';
    if (typeof window.addEventListener !== 'undefined') {
	window.addEventListener('load', function() { $.f.init(thisScript, stuff_inside_the_div); }, false);
    } else {
	window.attachEvent('onload', function() { $.f.init(thisScript, stuff_inside_the_div); });
    }
})();


    
	     
		    
