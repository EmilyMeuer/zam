export default function Zam() {}

Zam.idCounter = 0;

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

	this.on = function(event, func) {
		var addListener = function(event, func) {
			this.anchor.children[0].addEventListener(event, func);
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

	this.off = function(event, func) {
		var removeListener = function(event, func) {
			this.anchor.children[0].removeEventListener(event, func);
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