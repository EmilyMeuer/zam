function Z() {
	this.self = 'html';
}

Z.prototype.e = function(e) {
	if(e === undefined) {
		e = this.self;
	}
	this.self = e;
	return document.querySelectorAll(e);
}

Z.prototype.index = function(elem) {
	var i = 0;
	var a = elem.target;
	while((a = a.previousElementSibling) != null) {
		if(a.tagName.toLowerCase() === elem.target.tagName.toLowerCase()) {
			i++;
		}
	}
	return i;
}

Z.prototype.d = function(event, e, func) {
	var x = document.querySelectorAll(e);
	var len = x.length;
	for(var i=0;i<len; i++) {
		x[i].removeEventListener(event, func);
	}
}

Z.prototype.c = function(event, e, func) {
	if(typeof(e) !== 'object') {
		var x = document.querySelectorAll(e);
		var len = x.length;
		for(var i=0;i<len; i++) {
			x[i].addEventListener(event, func);
		}
	} else {
		e.addEventListener(event, func);
	}
}

Z.prototype.on = function(event, e, func) {
	if(typeof(e) !== 'object') {
		this.self = e;
	}
	if (event.indexOf(' ') !== -1) {
		var eve = event;
		while(eve.indexOf(' ') !== -1) {
			this.c(eve.slice(0, eve.indexOf(' ')), e, func);
			eve = eve.slice(eve.indexOf(' ') + 1);
		}
		this.c(eve, e, func);
	} else {
		this.c(event, e, func);
	}
}

Z.prototype.off = function(event, e, func) {
	this.self = e;
	if (event.indexOf(' ') !== -1) {
		var eve = event;
		while(eve.indexOf(' ') !== -1) {
			this.d(eve.slice(0, eve.indexOf(' ')), e, func);
			eve = eve.slice(eve.indexOf(' ') + 1);
		}
		this.d(eve, e, func);
	} else {
		this.d(event, e, func);
	}
}

Z.prototype.a = function(props, e) {
	var x = document.querySelectorAll(e);
	var len = x.length;
	for(var i=0;i<len; i++) {
		this.b(props, x[i]);
	}
}

Z.prototype.g = function(x, key, value) {
	if(x.style[key].indexOf(value.slice(0, value.indexOf(' '))) === -1) {
		x.style[key] += (',' + value);
	} else {
		var start = x.style[key].indexOf(value.slice(0, value.indexOf(' ')));
		var before = x.style[key].slice(0, start);
		var middle = value;
		var end = "";
		var after = x.style[key].slice(start).indexOf(',');
		if(after !== -1) {
			end = x.style[key].slice(x.style[key].slice(start).indexOf(',')); 
		}
		x.style[key] = before + middle + end;
	}
}

Z.prototype.b = function(props, x) {
	for (var key in props) {
		if (props.hasOwnProperty(key)) {
			if(key.indexOf('-') !== -1) {
				var val = props[key];
				var idx = key.indexOf('-') + 1;
				key = key.slice(0, idx - 1) + key[idx].toUpperCase() + key.slice(idx+1);
				x.style[key] = val;
			} else {
				if(key === 'transition' || key === 'animation') {
					if (props[key] === '') {
						x.style[key] = props[key];
					} else if (x.style[key] === '') {
						x.style[key] = props[key];
					} else {
						var stack = props[key];
						var value = "";
						while(stack.indexOf(',') !== -1) {
							value = stack.slice(0, stack.indexOf(',')).trim();
							this.g(x, key, value);
							stack = stack.slice(stack.indexOf(',') + 1).trim();
						}
						this.g(x, key, stack);
					}
				} else {
					x.style[key] = props[key];
				}
			}
		}
	}
}

Z.prototype.css = function(props, e) {

	if(e === undefined) {
		e = this.self;
		this.a(props, e);
	} else {
		if(typeof(e) === 'object') {
			this.b(props, e);
		} else {
			this.a(props, e);
		}
	}
}

Z.prototype.fadeIn = function(e, value) {
	if(value === undefined) {
		value = e;
		e = this.self;
	}
	if (value === undefined) {
		value = '1s';
	}
	this.css({'transition': 'opacity ' + value}, e);
	setTimeout(() => {
		this.css({'opacity': '1.0'}, e);
	},1);
}

Z.prototype.fadeOut = function(e, value) {
	if(value === undefined) {
		value = e;
		e = this.self;
	}
	if (value === undefined) {
		value = '1s';
	}
	this.css({'transition': 'opacity ' + value}, e);
	setTimeout(() => {
		this.css({'opacity': '0.0'}, e);
	},1);
}

Z.prototype.each = function(e, func) {
	if(typeof e === "function") {
		func = e;
		e = this.self
	}
	var elems = document.querySelectorAll(e);
	Array.prototype.forEach.call(elems, function(elem, i) {
		func(elem, i);
	});
}

Z.prototype.addStyle = function(val, id) {
	var newStyle = document.createElement("style");
	newStyle.innerHTML = val;
	newStyle.id = id;
	document.getElementsByTagName("head")[0].appendChild(newStyle);
}

Z.prototype.removeStyle = function(id) {
	var elem = document.querySelector('#'+id);
	elem.parentNode.removeChild(elem);
}

Z.prototype.ajax = function(obj, func) {
	if(obj.method === undefined) {
		obj.method = 'GET';
	}
	if(obj.data === undefined) {
		obj.data = null;
	}
	if(obj.headers === undefined) {
		obj.headers = {'Accept':'application/json'};
	}
	if (obj.headers.Accept === 'application/json' && obj.data !== undefined) {
		obj.data = JSON.stringify(obj.data);
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		if(obj.headers.Accept === 'application/json') {
			func(JSON.parse(this.response));
		} else {
			func(this.response);
		}
	}
	xhttp.onerror = function () {
		console.log("AJAX error.");
	};
	xhttp.open(obj.method, obj.url, true);
	for (var prop in obj.headers) {
        if(obj.headers.hasOwnProperty(prop)) {
        	xhttp.setRequestHeader(prop, obj.headers[prop]);
        	console.log(prop + " " +obj.headers[prop])
        }
    }
	xhttp.send(obj.data);
}