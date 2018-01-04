export default function Zam() {}

Zam.idCounter = 0;

Zam.routes = {};

Zam.getId = function() {
	return Zam.idCounter++;
}

Zam.component = function() {
	this.id = 'a' + Zam.getId();
	this.children = {};
	this.body = function(html) {
		var elem = document.createElement('div');
		elem.id = this.id;
		elem.innerHTML = html;
		this.anchor = elem;
		this.html = elem.outerHTML;
	}
	this.cache = function(component, key) {
		if(key) {
			component.parent = this;
			this.children[key] = component;
			return component;
		} else {
			return this.children[component];
		}
	}
	this.mount = function() {
		this.anchor = document.getElementById(this.id);
		this.html = this.anchor.outerHTML;
		for (var key in this.children) {
			if(document.getElementById(this.children[key].id) !== null) {
				this.children[key].mount();
			} else {
				console.log(key);
				delete this.children[key];
			}
		}
		if (this.mounted !== undefined) {
			this.mounted();
		}
	}
	this.append = function(component, key) {
		this.cache(component, key);
		this.anchor.children[0].appendChild(component.anchor);
		component.mount();
	}
	this.prepend = function(component) {
		this.anchor.children[0].insertBefore(component.anchor, this.anchor.children[0].firstChild);
		component.mount();
	}
	this.replace = function(component) {
		this.anchor.replaceWith(component.anchor);
		component.mount();
	}
	this.remove = function() {
		this.anchor.parentNode.removeChild(this.anchor);
	}
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

	if (e instanceof Zam.component) {
		e = e.anchor.children[0];
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

	if (e instanceof Zam.component) {
		e = e.anchor.children[0];
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