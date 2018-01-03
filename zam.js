export default function Zam() {}

Zam.idCounter = 0;

Zam.routes = {};

Zam.getId = function() {
	return Zam.idCounter++;
}

Zam.component = function() {
	this.id = 'a' + Zam.getId();
	this.childrenCount = 0;
	this.children = {};
	this.setHTML = function(html) {
		var elem = document.createElement('div');
		elem.id = this.id;
		elem.innerHTML = html;
		this.anchor = elem;
		this.html = this.anchor.outerHTML;
	}.bind(this);
	this.cache = function(elem, key) {
		if(key) {
			this.children[key] = elem;
			return elem;
		} else {
			return this.children[elem];
		}
	}.bind(this);
	this.mount = function() {
		this.anchor = document.getElementById(this.id);
		this.html = this.anchor.outerHTML;
		for (var key in this.children) {
			if(document.getElementById(this.children[key].id) !== null) {
				this.children[key].mount();
			} else {
				delete this.children[key];
			}
		}
		this.mounted();
	}.bind(this);
}

Zam.on = function(event, e, func) {
	var bind = function(event, e, func) {
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

	if (event.indexOf(' ') !== -1) {
		var eve = event;
		while(eve.indexOf(' ') !== -1) {
			bind(eve.slice(0, eve.indexOf(' ')), e, func);
			eve = eve.slice(eve.indexOf(' ') + 1);
		}
		bind(eve, e, func);
	} else {
		bind(event, e, func);
	}
}

Zam.off = function(event, e, func) {
	var unbind = function(event, e, func) {
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

	if (event.indexOf(' ') !== -1) {
		var eve = event;
		while(eve.indexOf(' ') !== -1) {
			unbind(eve.slice(0, eve.indexOf(' ')), e, func);
			eve = eve.slice(eve.indexOf(' ') + 1);
		}
		unbind(eve, e, func);
	} else {
		unbind(event, e, func);
	}
}

Zam.css = function(props, e) {
	var cssAddValue = function(x, key, value) {
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

	var cssObject = function(props, x) {
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
								cssAddValue(x, key, value);
								stack = stack.slice(stack.indexOf(',') + 1).trim();
							}
							cssAddValue(x, key, stack);
						}
					} else {
						x.style[key] = props[key];
					}
				}
			}
		}
	}

	var cssSelector = function(props, e) {
		var x = document.querySelectorAll(e);
		var len = x.length;
		for(var i=0;i<len; i++) {
			cssObject(props, x[i]);
		}
	}

	if(typeof(e) === 'object') {
		cssObject(props, e);
	} else {
		cssSelector(props, e);
	}
}

Zam.router = function(routes) {

	this.routes = {};

	var updateURL = function(path) {
		if (history.pushState) {
			window.history.pushState({path:path},'', path);
		}
	}

	var setContent = function() {
		if(window.location.href.lastIndexOf('/') !== window.location.href.length - 1) {
			for(var key in this.routes) {
				if(window.location.href.indexOf('/' + this.routes[key].view.slice(1)) !== -1) {
					Zam.css({'display': this.routes[key].display}, this.routes[key].view);
				} else {
					Zam.css({'display': 'none'}, this.routes[key].view);
				}
			}
		} else {
			for(var key in this.routes) {
				Zam.css({'display': this.routes[key].display}, this.routes[key].view);
				break;
			}
		}
	}.bind(this);

	this.routes = JSON.parse(JSON.stringify(routes));

	setContent();

	Zam.on('popstate', window, () => {
		setContent();
	});

	var ids = '';
	for(var key in this.routes) {
		var event = 'click';
		if(key.event !== undefined) {
			event = key.event;
		}

		Zam.on(event, '#' + key, (e) => {
			updateURL('/' + this.routes[e.target.id].view.slice(1));
			setContent();
		});
	}
}

Zam.ajax = function(obj) {
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