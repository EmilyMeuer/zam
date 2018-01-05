export default class Zam {
	constructor(html) {
		this.html = html;
		this.e = this._generator(this.html);
		if(this.constructor.name === 'Root') {
			this.key = 'root';
			document.querySelectorAll('body')[0].appendChild(this.e);
		}
	}

	_generator(html) {

		var tag = html.match(/<[A-Za-z0-9]*(\ |\/|>)/g)[0];
		tag = tag.slice(1, tag.length - 1);
		var elem = document.createElement(tag);

		var attr = html.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);
		if(attr !== null) {
			var len = attr.length;
			for(var i=0; i<len; i++) {
				elem.setAttribute(attr[i].slice(0, attr[i].indexOf('=')), attr[i].slice(attr[i].indexOf('"') + 1, attr[i].length - 1));
			}
		}
		var start = html.slice(html.indexOf('>') + 1);
		if(start.indexOf('<') > -1) {
			elem.innerHTML = start.slice(0, start.indexOf('<'));
		}
		return elem;
	}

	append(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.appendChild(component.e);
	}

	prepend(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.insertBefore(component.e, this.e.firstChild);
	}

	replace(component, key) {
		component.parent = this.parent;
		this.parent[key] = component;
		this.e.replaceWith(component.e);
		delete this.parent[this.key];
	}

	remove(component) {
		this.e.parentNode.removeChild(this.e);
		delete this.parent[this.key];
	}

	setInnerHTML(html) {
		this.e.innerHTML = html;
	}

	getInnerHTML() {
		return this.e.innerHTML;
	}

	style(props) {
		if (typeof(props) === 'object') {
			this._cssObject(props, this.e);
		} else {
			if(props.indexOf('-') !== -1) {
				var idx = props.indexOf('-') + 1;
				props = props.slice(0, idx - 1) + props.slice(idx, idx + 1).toUpperCase() + props.slice(idx+1);
			}
			return this.e.style[props];
		}
	}

	static style(props, selector) {
		if (typeof(selector) === 'object') {
			this._cssObject(props, selector);
		} else {
			var elems = document.querySelectorAll(selector);
			var len = elems.length;
			for(var i=0; i<len; i++) {
				this._cssObject(props, elem[i]);
			}
		}
	}

	_cssAddValue(x, key, value) {
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

	_cssObject(props, x) {
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
								this._cssAddValue(x, key, value);
								stack = stack.slice(stack.indexOf(',') + 1).trim();
							}
							this._cssAddValue(x, key, stack);
						}
					} else {
						x.style[key] = props[key];
					}
				}
			}
		}
	}


	on(event, func) {
		var addListener = function(event, func) {
			this.e.addEventListener(event, func);
		}.bind(this);

		if (event.indexOf(' ') !== -1) {
			var eve = event;
			while(eve.indexOf(' ') !== -1) {
				addListener(eve.slice(0, eve.indexOf(' ')), func);
				eve = eve.slice(eve.indexOf(' ') + 1);
			}
			addListener(eve, func);
		} else {
			addListener(event, func);
		}
	}

	static on(event, selector, func) {
		var addListener = function(event, selector, func) {
			var elems = document.querySelectorAll(selector);
			var len = elems.length;
			for(var i=0; i<len; i++) {
				elems[i].addEventListener(event, func);
			}
		}

		if (event.indexOf(' ') !== -1) {
			var eve = event;
			while(eve.indexOf(' ') !== -1) {
				addListener(eve.slice(0, eve.indexOf(' ')), selector, func);
				eve = eve.slice(eve.indexOf(' ') + 1);
			}
			addListener(eve, selector, func);
		} else {
			addListener(event, selector, func);
		}
	}

	off(event, func) {
		var removeListener = function(event, func) {
			this.e.removeEventListener(event, func);
		}.bind(this)

		if (event.indexOf(' ') !== -1) {
			var eve = event;
			while(eve.indexOf(' ') !== -1) {
				removeListener(eve.slice(0, eve.indexOf(' ')), func);
				eve = eve.slice(eve.indexOf(' ') + 1);
			}
			removeListener(eve, func);
		} else {
			removeListener(event, func);
		}
	}

	static off(event, selector, func) {
		var removeListener = function(event, selector, func) {
			var elems = document.querySelectorAll(selector);
			var len = elems.length;
			for(var i=0; i<len; i++) {
				elems[i].removeEventListener(event, func);
			}
		}

		if (event.indexOf(' ') !== -1) {
			var eve = event;
			while(eve.indexOf(' ') !== -1) {
				removeListener(eve.slice(0, eve.indexOf(' ')), selector, func);
				eve = eve.slice(eve.indexOf(' ') + 1);
			}
			removeListener(eve, selector, func);
		} else {
			removeListener(event, selector, func);
		}
	}
}