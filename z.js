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
  while((a = a.previousSibling) != null) {
    i++;
  }
  return i;
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
					if(key === 'transition' || key === 'animation') {
						if (props[key] === '') {
							x[i].style[key] = props[key];
						} else if (x[i].style[key] === '') {
							x[i].style[key] = props[key];
						} else {
							if(x[i].style[key].indexOf(props[key].slice(props[key].indexOf(' '))) === -1) {
								x[i].style[key] += (',' + props[key]);
							} else {
								var start = x[i].style[key].indexOf(props[key].slice(props[key].indexOf(' ')));
								x[i].style[key] = x[i].style[key].slice(start) + props[key] + x[i].style[key].slice(start + props[key].length);
							}
						}
					} else {
						x[i].style[key] = props[key];
					}
				}
			}
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
	xhttp.onerror = function () {
		console.log("AJAX error.");
	};
	xhttp.open(obj.method, obj.url, true);
	xhttp.setRequestHeader('Content-type', obj.content);
	xhttp.send(obj.data);
}