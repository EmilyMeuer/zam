export default class Zam {
	constructor(html) {
		this.html = html;
		var elem = document.createElement('div');
		elem.innerHTML = html;
		this.e = elem.children[0].cloneNode(true);
	}

	static render() {
		var elems = document.querySelectorAll(this.name.toLowerCase());
		var len = elems.length;
		for(var i=0; i<elems.length; i++) {
			var instance = new this(...arguments);
			elems[i].appendChild(instance.e);
		}
	}

	static shadowRender() {
		var elems = document.querySelectorAll(this.name.toLowerCase());
		var len = elems.length;
		for(var i=0; i<len; i++) {
			var instance = new this(...arguments);
			var div = document.createElement('div');
			var shadowElem = div.attachShadow({mode: 'open'});
			shadowElem.appendChild(instance.e);
			elems[i].appendChild(div);
		}
	}

	customEvent(event) {
		this[event] = new CustomEvent(event, {
			bubbles: true,
			cancelable: false
		});
	}

	dispatchEvent(event) {
		this.e.dispatchEvent(this[event]);
	}

	mount(selector, shadowSelector) {
		if (shadowSelector) {
			document.querySelectorAll(selector)[0].shadowRoot.querySelectorAll(shadowSelector)[0].appendChild(this.e);
		} else {
			document.querySelectorAll(selector)[0].appendChild(this.e);
		}
	}

	mountPrepend(selector, shadowSelector) {
		if (shadowSelector) {
			var elem = document.querySelectorAll(selector)[0].shadowRoot.querySelectorAll(shadowSelector)[0];
			elem.insertBefore(this.e, elem.firstChild);
		} else {
			var elem = document.querySelectorAll(selector)[0];
			elem.insertBefore(this.e, elem.firstChild);
		}
	}

	append(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.appendChild(component.e);
		return component;
	}

	prepend(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.insertBefore(component.e, this.e.firstChild);
		return component;
	}

	replace(component, key) {
		component.parent = this.parent;
		this.parent[key] = component;
		this.e.replaceWith(component.e);
		delete this.parent[this.key];
		return component;
	}

	remove(component) {
		this.e.parentNode.removeChild(this.e);
		delete this.parent[this.key];
	}

	setInnerHTML(html) {
		this.e.innerHTML = html;
		return this;
	}

	getInnerHTML() {
		return this.e.innerHTML;
	}

	setCSS(props) {
		Zam._cssObject(props, this.e);
		return this;
	}

	getCSS(property) {
		if(property.indexOf('-') > -1) {
			var idx = property.indexOf('-') + 1;
			property = property.slice(0, idx - 1) + property.slice(idx, idx + 1).toUpperCase() + property.slice(idx+1);
		}
		return this.e.style[property];
	}

	toggleCSS(property, valOn, valOff) {
		var prop = {}
		prop[property] = this.getCSS(property) !== valOn ? valOn : valOff;
		return this.setCSS(prop);
	}

	static setCSS(props, selector) {
		if (typeof(selector) === 'object') {
			Zam._cssObject(props, selector);
		} else {
			var elems = document.querySelectorAll(selector);
			var len = elems.length;
			for(var i=0; i<len; i++) {
				Zam._cssObject(props, elems[i]);
			}
		}
	}

	static getCSS(property, selector) {
		if (typeof(selector) === 'object') {
			return selector.e.style[property];
		} else {
			return document.querySelectorAll(selector)[0].style[property];
		}
	}

	static _cssAddValue(x, key, value) {
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

	static _cssObject(props, x) {
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
								Zam._cssAddValue(x, key, value);
								stack = stack.slice(stack.indexOf(',') + 1).trim();
							}
							Zam._cssAddValue(x, key, stack);
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
		return this;
	}

	static on(event, selector, func) {
		var addListener = function(event, selector, func) {
			var elems = document.querySelectorAll(selector);
			var len = elems.length;
			for(var i=0; i<len; i++) {
				if (elems[i].shadowRoot) {
					elems[i].shadowRoot.addEventListener(event, func);
				} else {
					elems[i].addEventListener(event, func);
				}
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
		return this;
	}

	static off(event, selector, func) {
		var removeListener = function(event, selector, func) {
			var elems = document.querySelectorAll(selector);
			var len = elems.length;
			for(var i=0; i<len; i++) {
				if (elems[i].shadowRoot) {
					elems[i].shadowRoot.removeEventListener(event, func);
				} else {
					elems[i].removeEventListener(event, func);
				}
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