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

Z.prototype.on = function(event, e, func) {
	this.self = e;
	var x = document.querySelectorAll(e);
	var len = x.length;
	for(var i=0;i<len; i++) {
		x[i].addEventListener(event, func);
	}
}

Z.prototype.off = function(event, e, func) {
	this.self = e;
	var x = document.querySelectorAll(e);
	var len = x.length;
	for(var i=0;i<len; i++) {
		x[i].removeEventListener(event, func);
	}
}

Z.prototype.css = function(props, e) {
	if(e === undefined) {
		e = this.self;
	}
	var x = document.querySelectorAll(e);
	var len = x.length;
	for(var i=0;i<len; i++) {
		for (var key in props) {
			if (props.hasOwnProperty(key)) {
				if(key.indexOf('-') !== -1) {
					var val = props[key];
					var idx = key.indexOf('-') + 1;
					key = key.slice(0, idx-1) + key[idx].toUpperCase() + key.slice(idx+1);
					x[i].style[key] = val;
				} else {
					x[i].style[key] = props[key];
				}
			}
		}
	}
}

Z.prototype.ajax = function(obj, func) {
	if(obj.method === undefined) {
		obj.method = 'GET';
	}
	if(obj.data === undefined) {
		obj.data = null;
	}
	if(obj.content === undefined) {
		obj.content = 'application/json';
	}
	if (obj.content === 'application/json') {
		obj.data = JSON.stringify(obj.data);
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		if(obj.content === 'application/json') {
			func(JSON.parse(this.response));
		} else {
			func(this.response);
		}
	}
	xhttp.open(obj.method, obj.url, true);
	xhttp.setRequestHeader('Content-type', obj.content);
	xhttp.send(obj.data);
}