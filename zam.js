function Zam(obj, cycled) {
	this.functions = {};
	this.routes = {};
	this.data = (obj === undefined) ? {} : obj;
	this.cycled = cycled;
	this.runEngine();
}

Zam.prototype.runEngine = function() {
	var _this = this;

	var engine = function(e) {
		var bound = document.querySelectorAll('#'+e.target.getAttribute('z-link'))[0];
		var element = bound;
		var oldHTML = bound.innerHTML;
		if(bound.getAttribute('z-data')) {
			if (_this.data[e.target.getAttribute('z-link')] !== undefined) {
				bound.innerHTML = _this.data[e.target.getAttribute('z-link')];
				_this.data[e.target.getAttribute('z-link')] = oldHTML;
			} else {
				var dataName = bound.getAttribute('z-data');
				if (bound.hasAttribute('z-append')) {
					var newElem = document.createElement('div');
					newElem.innerHTML = _this.data[dataName];
					bound.appendChild(newElem);
					element = newElem;
				} else if(bound.hasAttribute('z-prepend')) {
					var newElem = document.createElement('div');
					newElem.innerHTML = _this.data[dataName];
					bound.insertBefore(newElem, bound.firstChild);
					element = newElem;
				} else {
					bound.innerHTML = _this.data[dataName];
					_this.data[e.target.getAttribute('z-link')] = oldHTML;
				}
			}
		}
		var a = bound.querySelectorAll('[z-link=master]');
		for (var i=0;i<a.length; i++) {
			a[i].setAttribute('z-link', e.target.getAttribute('z-link'));
		}
		cycle();
		(_this.cycled !== undefined) ? _this.cycled(element, e) : '';
	}

	var cycle = function() {
		var y = document.querySelectorAll('[z-link]');
		for(var j=0;j<y.length; j++) {
			var event = 'click';
			if (y[j].getAttribute('z-event')) {
				event = y[j].getAttribute('z-event');
			}
			_this.on(event, y[j], engine);
		}
	}
	cycle();
}

Zam.prototype.e = function(e) {
	return document.querySelectorAll(e);
}

Zam.prototype.index = function(elem) {
	var i = 0;
	var a = elem;
	while((a = a.previousElementSibling) != null) {
		if(a.tagName.toLowerCase() === elem.target.tagName.toLowerCase()) {
			i++;
		}
	}
	return i;
}

Zam.prototype.unbind = function(event, e, func) {
	if(typeof(func) === 'string') {
		func = this.functions[func];
	}

	if(typeof(e) !== 'object') {
		var x = document.querySelectorAll(e);
		var len = x.length;
		for(var i=0;i<len; i++) {
			x[i].removeEventListener(event, func);
		}
	} else {
		e.removeEventListener(event, func);
	}
}

Zam.prototype.bind = function(event, e, func) {
	if(typeof(func) === 'string') {
		func = this.functions[func];
	}

	if(typeof(e) !== 'object') {
		var x = document.querySelectorAll(e);
		var len = x.length;
		for(var i=0;i<len; i++) {
			x[i].addEventListener(event, func);
		}
		if(func.name !== 'anonymous') {
			this.functions[func.name] = func;
		}
	} else {
		e.addEventListener(event, func);
		if(func.name !== 'anonymous') {
			this.functions[func.name] = func;
		}
	}
}

Zam.prototype.on = function(event, e, func) {
	if (event.indexOf(' ') !== -1) {
		var eve = event;
		while(eve.indexOf(' ') !== -1) {
			this.bind(eve.slice(0, eve.indexOf(' ')), e, func);
			eve = eve.slice(eve.indexOf(' ') + 1);
		}
		this.bind(eve, e, func);
	} else {
		this.bind(event, e, func);
	}
}

Zam.prototype.off = function(event, e, func) {
	if (event.indexOf(' ') !== -1) {
		var eve = event;
		while(eve.indexOf(' ') !== -1) {
			this.unbind(eve.slice(0, eve.indexOf(' ')), e, func);
			eve = eve.slice(eve.indexOf(' ') + 1);
		}
		this.unbind(eve, e, func);
	} else {
		this.unbind(event, e, func);
	}
}

Zam.prototype.cssSelector = function(props, e) {
	var x = document.querySelectorAll(e);
	var len = x.length;
	for(var i=0;i<len; i++) {
		this.cssObject(props, x[i]);
	}
}

Zam.prototype.cssAddValue = function(x, key, value) {
	var val1 = value.slice(0, value.indexOf(' '));
	var match;
	if((match = x.style[key].match(new RegExp(`(^${val1}|, ${val1})`, 'g'))) === null) {
		x.style[key] += (',' + value);
	} else {
		var start = x.style[key].indexOf(match[0]);
		(match[0].indexOf(',') > -1) ? start += 2 : '';
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

Zam.prototype.cssObject = function(props, x) {
	for (var key in props) {
		if (props.hasOwnProperty(key)) {
			if(key.indexOf('-') !== -1) {
				var val = props[key];
				var idx = key.indexOf('-') + 1;
				key = key.slice(0, idx - 1) + key[idx].toUpperCase() + key.slice(idx+1);
				x.style[key] = val;
			} else {
				if(key === 'transition' || key === 'animation') {
					if (props[key] === '' || x.style[key] === '') {
						x.style[key] = props[key];
					} else {
						var stack = props[key];
						var value = "";
						while(stack.indexOf(',') !== -1) {
							value = stack.slice(0, stack.indexOf(',')).trim();
							this.cssAddValue(x, key, value);
							stack = stack.slice(stack.indexOf(',') + 1).trim();
						}
						this.cssAddValue(x, key, stack);
					}
				} else {
					x.style[key] = props[key];
				}
			}
		}
	}
}

Zam.prototype.css = function(props, e) {
	if(typeof(e) === 'object') {
		this.cssObject(props, e);
	} else {
		this.cssSelector(props, e);
	}
}

Zam.prototype.each = function(e, func) {
	var elems = document.querySelectorAll(e);
	Array.prototype.forEach.call(elems, function(elem, i) {
		func(elem, i);
	});
}

Zam.prototype.addStyle = function(id, val) {
	var newStyle = document.createElement("style");
	newStyle.innerHTML = val;
	newStyle.id = id;
	document.getElementsByTagName("head")[0].appendChild(newStyle);
}

Zam.prototype.removeStyle = function(id) {
	var elem = document.querySelector('#'+id);
	elem.parentNode.removeChild(elem);
}

Zam.prototype.html = function(html, e) {

	html = html.replace(/(?:\r\n|\r|\n)/g, '');

	if(typeof(e) === 'object') {
		e.innerHTML = html;
	} else {
		var x = document.querySelectorAll(e);
		var len = x.length;
		for(var i=0;i<len; i++) {
			x[i].innerHTML = html;
		}
	}
}

Zam.prototype.updateURL = function(path) {
	if (history.pushState) {
		window.history.pushState({path:path},'', path);
	}
}

Zam.prototype.setContent = function() {
	if(window.location.href.lastIndexOf('/') !== window.location.href.length - 1) {
		for(var key in this.routes) {
			if(window.location.href.indexOf('/' + this.routes[key].view.slice(1)) !== -1) {
				this.css({'display': this.routes[key].display}, this.routes[key].view);
			} else {
				this.css({'display': 'none'}, this.routes[key].view);
			}
		}
	} else {
		for(var key in this.routes) {
			this.css({'display': this.routes[key].display}, this.routes[key].view);
			break;
		}
	}
}

Zam.prototype.router = function(routes) {
	this.routes = JSON.parse(JSON.stringify(routes));

	this.setContent();

	this.on('popstate', window, () => {
		this.setContent();
	});

	var ids = '';
	for(var key in this.routes) {
		var event = 'click';
		if(key.event !== undefined) {
			event = key.event;
		}

		this.on(event, '#' + key, (e) => {
			this.updateURL('/' + this.routes[e.target.id].view.slice(1));
			this.setContent();
		});
	}
}

Zam.prototype.ajax = function(obj) {
	if(obj.method === undefined) {
		obj.method = 'GET';
	}
	if(obj.data === undefined) {
		obj.data = null;
	}
	if(obj.headers === undefined) {
		obj.headers = {'Accept':'application/json'};
	}

	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(obj.method, obj.url, true);
		for (var prop in obj.headers) {
			if(obj.headers.hasOwnProperty(prop)) {
				xhr.setRequestHeader(prop, obj.headers[prop]);
			}
		}
		xhr.onload = function(e) {
			if (xhr.status === 200) {
				if(obj.headers['Accept'] === 'appliction/json') {
					resolve(JSON.parse(xhr.responseText));
				} else {
					resolve(xhr.responseText);
				}
			} else {
				reject(Error('ajax failed - error code:' + xhr.statusText));
			}
		},
		xhr.onerror = function(e) {
			reject(Error('ajax failed - error code:' + xhr.statusText));
		},
		xhr.send(obj.data);
	});
}

export default Zam;