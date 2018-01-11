export default class Zam {
	constructor(html) {
		this['children'] = [];
		this.uniqueID = Zam.uniqueID;
		if (!html) {
			html = '';
		}
		this.origHTML = html;
		var elem = document.createElement(this.constructor.name.toLowerCase());
		elem.innerHTML = this._generateProperties(html);
		this.e = elem.cloneNode(true);
	}

	linkPropertyToNode(key) {
		if (!Zam.reverseProperties[key + '-' + this.uniqueID]) {
			Zam.reverseProperties[key + '-' + this.uniqueID] = [];
		}
		Zam.reverseProperties[key + '-' + this.uniqueID].push(this);
	}

	_generateBindings(node) {

		if (node.origHTML.indexOf('z-bind=') > -1) {
			var key = node.origHTML;
			key = key.slice(key.indexOf('z-bind="') + 8);
			key = key.slice(0, key.indexOf('"'));
			if(Zam.reverseProperties[key + '-' + node.uniqueID] !== undefined) {
				var len = Zam.reverseProperties[key + '-' + node.uniqueID].length;
				for(var i=0; i<len; i++) {
					Zam.on('keyup', node.e.children[0], function(e) {
						Zam.reverseProperties[key + '-' + node.uniqueID][i].prop(key, e.target.value);
					}.bind(node));
				}
			}
		}

		var len = node.children.length;
		for(var i=0; i<len; i++) {
			node._generateBindings(node.children[i]);
		}
	}

	searchForProperty(node, key) {
		if (node['properties'][key] !== undefined) {
			return node['properties'][key];
		} else {
			var len = node.children.length;
			for(var i=0; i<len; i++) {
				return this.searchForProperty(node['children'][i]);
			}
		}
		return 0;
	}

	_updateProperties(html) {
		var str = html;
		var newhtml = '';
		while(str.indexOf('{{') > -1) {
			var key = str.slice(str.indexOf('{{') + 2, str.indexOf('}}'));
			newhtml += str.slice(0, str.indexOf('{{'));

			var result = this.searchForProperty(this, key);
			if (result) {
				newhtml += result;
			}
			str = str.slice(str.indexOf('}}') + 2);
		}
		newhtml += str;
		return newhtml;
	}

	_generateProperties(html) {
		this.properties = {};
		if(html.indexOf('{{') > -1 && html.indexOf('}}') > -1) {
			var str = html;
			var newhtml = '';
			this['properties-proxy'] = {};

			while(str.indexOf('{{') > -1) {
				var key = str.slice(str.indexOf('{{') + 2, str.indexOf('}}'));
				this['properties-proxy'][key] = '';
				this.linkPropertyToNode(key);
				newhtml += str.slice(0, str.indexOf('{{'));
				str = str.slice(str.indexOf('}}') + 2);
			}
			newhtml += str;

			var _this = this;
			var handler = {
				set(target, key, value) {
					target[key] = value;
					if (value !== undefined) {
						var len = Zam.reverseProperties[key + '-' + _this.uniqueID].length;
						for(var  i=0; i<len; i++) {
							var revProp = Zam.reverseProperties[key + '-' + _this.uniqueID][i];
							revProp.html = _this._updateProperties(revProp.origHTML);
							revProp.e.innerHTML = _this.html;
						}
						_this._generateBindings(_this);
					}
					return true;
				}
			};
			this.properties = new Proxy(this['properties-proxy'], handler);

			return newhtml;
		} else {
			return html;
		}
	}

	prop(key, value) {
		if (value !== undefined) {
			this['properties'][key] = value;
		}
		return this['properties'][key];
	}

	// _refreshChildren(node, actualNode) {
	// 	var len = node.children.length;
	// 	for(var i=0; i<len; i++) {
	// 		node._refreshChildren(node.children[i], actualNode.children[i]);
	// 		node.e = actualNode;
	// 	}
	// }

	static render() {
		var elems = document.querySelectorAll(this.name.toLowerCase());
		var len = elems.length;
		var instances = [];
		for(var i=0; i<elems.length; i++) {
			instances.push(new this(...arguments));
			elems[i].replaceWith(instances[i].e);
			instances[i].e = document.querySelectorAll(this.name.toLowerCase())[i];
			instances[i]._generateBindings(instances[i]);
			//instances[i]._refreshChildren(instances[i], instances[i].e);
			Zam.uniqueID++;
		}
		return instances;
	}

	static shadowRender() {
		var elems = document.querySelectorAll(this.name.toLowerCase());
		var len = elems.length;
		var instances = [];
		for(var i=0; i<len; i++) {
			instances.push(new this(...arguments));
			var div = document.createElement('div');
			var shadowElem = div.attachShadow({mode: 'open'});
			shadowElem.appendChild(instances[i].e);
			instances[i]._generateBindings(instances[i]);
			elems[i].appendChild(div);
			Zam.uniqueID++;
		}
		return instances;
	}

	render(selector, shadowSelector) {
		if (shadowSelector) {
			document.querySelectorAll(selector)[0].shadowRoot.querySelectorAll(shadowSelector)[0].appendChild(this.e);
		} else {
			document.querySelectorAll(selector)[0].appendChild(this.e);
		}
	}

	renderPrepend(selector, shadowSelector) {
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
		this.children.push(component);
		return component;
	}

	prepend(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.insertBefore(component.e, this.e.firstChild);
		this.children.push(component);
		return component;
	}

	replace(component, key) {
		component.parent = this.parent;
		delete this.parent[this.key];
		this.parent[key] = component;
		this.e.replaceWith(component.e);
		return component;
	}

	remove(component) {
		this.e.parentNode.removeChild(this.e);
		delete this.parent[this.key];
	}

	on(event, func) {
		var addListener = function(event, func) {
			this.e.children[0].addEventListener(event, func);
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
			if (typeof(selector) === 'string') {
				var elems = document.querySelectorAll(selector);
				var len = elems.length;
				for(var i=0; i<len; i++) {
					if (elems[i].shadowRoot) {
						elems[i].shadowRoot.addEventListener(event, func);
					} else {
						elems[i].addEventListener(event, func);
					}
				}
			} else {
				if (selector.shadowRoot) {
					selector.shadowRoot.addEventListener(event, func);
				} else {
					selector.addEventListener(event, func);
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
			if (typeof(selector) === 'string') {
				var elems = document.querySelectorAll(selector);
				var len = elems.length;
				for(var i=0; i<len; i++) {
					if (elems[i].shadowRoot) {
						elems[i].shadowRoot.removeEventListener(event, func);
					} else {
						elems[i].removeEventListener(event, func);
					}
				}
			} else {
				if (selector[i].shadowRoot) {
					selector[i].shadowRoot.removeEventListener(event, func);
				} else {
					selector[i].removeEventListener(event, func);
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

	customEvent(event) {
		this[event] = new CustomEvent(event, {
			bubbles: true,
			cancelable: false
		});
	}

	dispatchEvent(event) {
		this.e.dispatchEvent(this[event]);
	}
}

Zam.uniqueID = 0;

Zam.reverseProperties = {};