let uniqueID = Symbol('uniqueID');
uniqueID = 0;

export default class Zam {
	constructor(html) {
		this['children'] = [];
		this.uniqueID = uniqueID;
		if (!html) {
			html = '';
		}
		this.origHTML = html;
		let elem = document.createElement(this.constructor.name.toLowerCase());
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
		let origHTML = node.origHTML;
		while(origHTML.indexOf('z-') > -1) {
			let val = origHTML;
			val = val.slice(val.indexOf('z-') + 2)
			let type = val.slice(0, val.indexOf('='));
			val = val.slice(val.indexOf('"') + 1);
			val = val.slice(0, val.indexOf('"'));
			origHTML = origHTML.slice(origHTML.indexOf(val) + val.length + 1);
			switch(type) {
				case 'bind':
				if(Zam.reverseProperties[val + '-' + node.uniqueID] !== undefined) {
					if (!node.bindingFunc) {
						node.bindingFunc = (e) => {
							Zam.reverseProperties[val + '-' + node.uniqueID][0].prop(val, e.target.value);
						}
					}
					Zam.on('keyup', node.e.children[0], node.bindingFunc);
				}
				break;
				default:
				if(!this[type + 'Func']) {
					this[type + 'Func'] = function(e) {
						let obj = {}, expression = '', str = val;
						let results = str.match(new RegExp(`[A-Za-z]{1}[A-Za-z0-9]*`, 'g'));
						let len = results.length;
						for(let i=0; i<len; i++) {
							let components = Zam.reverseProperties[results[i] + '-' + this.uniqueID];
							if(components === undefined) {
								continue;
							}
							obj[val+i] = components[0].prop(results[i]);
							obj[results[i]] = obj[val+i];
							let varToEval = 'obj[\''+results[i]+'\']';
							expression += str.slice(0, str.indexOf(results[i]) + results[i].length).replace(results[i], varToEval);
							str = str.slice(str.indexOf(results[i]) + results[i].length);
						}
						expression += str;
						let evalExp = eval(expression);
						Zam.reverseProperties[results[0] + '-' + this.uniqueID][0].prop(results[0], evalExp);
					}.bind(node);
				}
				Zam.on(type, node.e.children[0], this[type + 'Func']);
				break;
			}
		}

		let len = node.children.length;
		for(let i=0; i<len; i++) {
			node._generateBindings(node.children[i]);
		}
	}

	searchForProperty(node, key) {
		if (node['properties'][key] !== undefined) {
			return node['properties'][key];
		} else {
			let len = node.children.length;
			for(let i=0; i<len; i++) {
				return this.searchForProperty(node['children'][i]);
			}
		}
		return 0;
	}

	_updateDoubleBraces(html) {
		let str = html;
		let newhtml = '';
		while(str.indexOf('{{') > -1) {
			let key = str.slice(str.indexOf('{{') + 2, str.indexOf('}}'));
			newhtml += str.slice(0, str.indexOf('{{'));

			let result = this.searchForProperty(this, key);
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
			let str = html;
			let newhtml = '';
			this['properties-proxy'] = {};

			while(str.indexOf('{{') > -1) {
				let key = str.slice(str.indexOf('{{') + 2, str.indexOf('}}'));
				this['properties-proxy'][key] = '';
				this.linkPropertyToNode(key);
				newhtml += str.slice(0, str.indexOf('{{'));
				str = str.slice(str.indexOf('}}') + 2);
			}
			newhtml += str;

			let _this = this;
			let handler = {
				set(target, key, value) {
					target[key] = value;
					if (value !== undefined) {
						let len = Zam.reverseProperties[key + '-' + _this.uniqueID].length;
						for(let  i=0; i<len; i++) {
							let revProp = Zam.reverseProperties[key + '-' + _this.uniqueID][i];
							revProp.html = _this._updateDoubleBraces(revProp.origHTML);
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

	static render() {
		let elems = document.querySelectorAll(this.name.toLowerCase());
		let len = elems.length;
		let instances = [];
		for(let i=0; i<elems.length; i++) {
			instances.push(new this(...arguments));
			elems[i].replaceWith(instances[i].e);
			instances[i].e = document.querySelectorAll(this.name.toLowerCase())[i];
			instances[i]._generateBindings(instances[i]);
			uniqueID++;
		}
		return instances;
	}

	static shadowRender() {
		let elems = document.querySelectorAll(this.name.toLowerCase());
		let len = elems.length;
		let instances = [];
		for(let i=0; i<len; i++) {
			instances.push(new this(...arguments));
			let div = document.createElement('div');
			let shadowElem = div.attachShadow({mode: 'open'});
			shadowElem.appendChild(instances[i].e);
			instances[i]._generateBindings(instances[i]);
			elems[i].appendChild(div);
			uniqueID++;
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
			let elem = document.querySelectorAll(selector)[0].shadowRoot.querySelectorAll(shadowSelector)[0];
			elem.insertBefore(this.e, elem.firstChild);
		} else {
			let elem = document.querySelectorAll(selector)[0];
			elem.insertBefore(this.e, elem.firstChild);
		}
	}

	append(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.appendChild(component.e);
		this.children.push(component);
		this._generateBindings(this);
		return component;
	}

	prepend(component, key) {
		component.key = key;
		component.parent = this;
		this[key] = component;
		this.e.insertBefore(component.e, this.e.firstChild);
		this.children.push(component);
		this._generateBindings(this);
		return component;
	}

	replace(component, key) {
		component.parent = this.parent;
		delete this.parent[this.key];
		this.parent[key] = component;
		this.e.replaceWith(component.e);
		this._generateBindings(this);
		return component;
	}

	remove(component) {
		this.e.parentNode.removeChild(this.e);
		delete this.parent[this.key];
	}

	on(event, func) {
		let addListener = function(event, func) {
			this.e.children[0].addEventListener(event, func);
		}.bind(this);

		if (event.indexOf(' ') !== -1) {
			let eve = event;
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
		let addListener = function(event, selector, func) {
			if (typeof(selector) === 'string') {
				let elems = document.querySelectorAll(selector);
				let len = elems.length;
				for(let i=0; i<len; i++) {
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
			let eve = event;
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
		let removeListener = function(event, func) {
			this.e.removeEventListener(event, func);
		}.bind(this)

		if (event.indexOf(' ') !== -1) {
			let eve = event;
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
		let removeListener = function(event, selector, func) {
			if (typeof(selector) === 'string') {
				let elems = document.querySelectorAll(selector);
				let len = elems.length;
				for(let i=0; i<len; i++) {
					if (elems[i].shadowRoot) {
						elems[i].shadowRoot.removeEventListener(event, func);
					} else {
						elems[i].removeEventListener(event, func);
					}
				}
			} else {
				if (selector.shadowRoot) {
					selector.shadowRoot.removeEventListener(event, func);
				} else {
					selector.removeEventListener(event, func);
				}
			}
		}

		if (event.indexOf(' ') !== -1) {
			let eve = event;
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

Zam.reverseProperties = {};