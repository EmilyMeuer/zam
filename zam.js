export default class Zam {
	constructor(html) {
		this.children = {};
		this.html = html;
		this.e = document.createElement('div');
		this.e.innerHTML = html
		this.node = this.e.children[0];
		if(this.constructor.name === 'Root') {
			document.querySelectorAll('body')[0].appendChild(this.e);
		}
	}

	append(component, key) {
		component.parent = this;
		this.children[key] = component;
		this.e.children[0].appendChild(component.e);
	}

	prepend(component, key) {
		component.parent = this;
		this.e.children[0].insertBefore(component.e, this.e.children[0].firstChild);
		this.children[key] = component;
	}

	replace(component, key) {
		component.parent = this.parent;
		this.parent.children[key] = component;
		this.e.replaceWith(component.e);
		for(var key in this.parent.children) {
			if(this.parent.children[key] === this) {
				delete this.parent.children[key];
			}
		}
	}

	remove(component) {
		this.e.parentNode.removeChild(this.e);
	}

	setInnerHTML(html) {
		this.node.innerHTML = html;
	}

	getInnerHTML() {
		return this.node.innerHTML;
	}

	style(props) {
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
		if (typeof(props) === 'object') {
			cssObject(props, this.node);
		} else {
			if(props.indexOf('-') !== -1) {
				var idx = props.indexOf('-') + 1;
				props = props.slice(0, idx - 1) + props.slice(idx, idx + 1).toUpperCase() + props.slice(idx+1);
			}
			return this.node.style[props];
		}
	}

	on(event, func) {
		var addListener = function(event, func) {
			this.e.children[0].addEventListener(event, func);
		}.bind(this)

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

	off(event, func) {
		var removeListener = function(event, func) {
			this.e.children[0].removeEventListener(event, func);
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
}