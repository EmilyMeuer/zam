<p align="center"><img src="https://i.imgur.com/b4uo72l.png" width="auto" height="75px" /><p/>

<p align="center">
<strong>Fast - Minimal - Easy</strong>
</p>

<p align="center">
http://zamjs.com
</p>

## Overview

A component based micro-library that encourages single-page applications.

## Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@7.0/zam.min.js"></script>
```
```
npm install zamjs
```

## Quickstart

Zam is component based.

<strong>Every Zam object represents and manages a single DOM Element.</strong>

Not ten elements. Not two elements. ONE.

To make a web application with Zam, <strong>you must always have a Root subclass.</strong>

Example - Hello World!

```html
<html>
<head>
</head>
<body>
    <script type="module">
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@6.2/zam.min.js";

        export class Root extends Zam {
            constructor() {
                super(`<div>Hello World!</div>`);
            }
        }
        
        var root = new Root();
    </script>
</body>
</html>
```

In this case, instance 'root' manages DOM Element...

```html
<div>Hello World!</div>
```

##

Now we will expand on the Hello World Example.

```html
<html>
<head>
</head>
<body>
    <script type="module">
        import Zam from "/zam.min.js";

        export class Root extends Zam {
            constructor() {
            super(`<div></div>`);

            for(var x = 1; x < 11; x++) {
                this.append(new Zam(`<div>${x}</div>`), `num-${x}`);
                    /* Notice how we reference a child component... this['somekey'] */
                    console.log(this[`num-${x}`]);
                }
            }
        }

        var root = new Root();
    </script>
</body>
</html>
```

Here we introduced Zam.append().

<strong>Zam.append(component, key)</strong>

<strong>component</strong> is a Zam instance.

<strong>key</strong> is... well... what we want to name the component we are appending.

##

Before we go into the next example let's talk about all of Zam's methods.

* <strong>Zam.append(component, key)</strong> - We already used this one.

* <strong>Zam.prepend(component, key)</strong> - literally the same as append except we are prepending.

* <strong>Zam.replace(component, key)</strong> - again the same as the last two, but instead we are replacing components.

* <strong>Zam.remove()</strong> - removes component.

* <strong>Zam.on(events, function)</strong> - pretty similar to jQuery's .on().

* <strong>Zam.off(events, function)</strong> - pretty similar to jQuery's .off().

* <strong>Zam.css(value)</strong>

* Example for setting style properties - someComponent.css({'color':'red'})

* Example for fetching style property - someComponent.css('color')

* <strong>Zam.setInnerHTML(value)</strong>

* <strong>Zam.getInnerHTML()</strong>

##

This next example is a bigger one.

<strong>./server.js</strong>

```javascript
const http = require('http');
const express = require('express');
const app = express();
const concat = require('concat-files');
const fs = require('fs');
let componentArray = [];
let componentsPath = './components.js';
let port = 8080;


/* Grab all component file names from directory ./components */
fs.readdir('./components', function(err, items) {
    for (var i=0; i<items.length; i++) {
        componentArray.push('./components/'+items[i]);
    }
});

/* Concatenate those files into a single file 'components.js' */
concat(componentArray, componentsPath, function(err) {
	if (err) {
		throw err
	}
	console.log('Files combined and stored in ' + componentsPath);
});

/* Set routes */
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.get('/main.css', function(req, res) {
  res.sendFile(__dirname + '/main.css');
});

app.get('/zam.min.js', function(req, res) {
  res.sendFile(__dirname + "/zam.min.js");
});

app.get('/components.js', function(req, res) {
  res.sendFile(__dirname + '/components.js');
});

/* Create server instance and listen on port 8080 */
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
	console.log('Application listening on port: ' + port);
});
```

<strong>./home.html</strong>

```html
<html>
<head>
	<link rel="stylesheet" type="text/css" href="main.css" />
</head>
<body>
	<script type="module">
		import { Root } from "/components.js";
		var root = new Root();
	</script>
</body>
</html>
```

<strong>./components/root.js</strong>

```javascript
/* You only need to import the Zam library once.
This is because all component files are combined. */
import Zam from "/zam.min.js";

export class Root extends Zam {
	constructor() {
		super(`<div></div>`);

		this.itemCount = 0;

		this.append(new Zam(`<div class="create-item-button">Create Item</div>`), 'create-item-button');

		this.append(new Zam(`<div class="items" id="items"></div>`), 'items');

		this['create-item-button'].on('click', (function() {
			this['items'].prepend(new Item(), 'item-' + this.itemCount++);
		}).bind(this));
	}
}
```

<strong>./components/item.js</strong>

```javascript
export class Item extends Zam {
	constructor() {
		super(`<div class="item"></div>`);

		this.append(new UISwitch(), 'switch');
		this.append(new Zam(`<div id="deleteItem">Delete</div>`), 'delete-item-button');

		this['delete-item-button'].on('click', function() {
			this.remove();
		}.bind(this));
		
		this['switch']['circle'].on('click', (function() {
			this.style('background-color') === '' ? this.style({'background-color':'#d0d2d3'}) : this.style({'background-color':''}); 
		}.bind(this)));
	}
}
```

<strong>./components/uiswitch.js</strong>

```javascript
export class UISwitch extends Zam {
	constructor() {
		super(`<div class="ui-switch"></div>`);
		this.append(new Zam(`<input type="checkbox" />`), 'checkBox');

		this.append(new Zam(`<span class="ui-switch-text">Off</span>`), 'text');

		this.append(new Zam(`<div class="ui-switch-circle"></div>`), 'circle');

		this['circle'].on('click', (function() {
			var textCur =  this['text'].style('left');
			this['text'].style({'left': textCur === "" ? '10px' : ""});

			var textCur = this['text'].getInnerHTML();
			textCur === "Off" ? (this['text'].setInnerHTML("On")) : (this['text'].setInnerHTML("Off"));

			var circleCur =  this['circle'].style('left');
			this['circle'].style({'left': circleCur === "" ? '45px' : ""});

			var switchCur = this.style('background-color');
			this.style({'background-color': switchCur === "" ? '#4cda63' : ""});

		}.bind(this)));
	}
}
```

<strong>./main.css</strong>

```css
* {
	font-family: sans-serif;
	font-weight: 200;
}

.items-header {
	padding: 15px;
	margin: 10px 0;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 1px 0 rgba(0,0,0,.25), 0 4px 11px 0 rgba(0,0,0,.08), -1px 3px 3px 0 rgba(0,0,0,.14);
}

.item {
	padding: 15px;
	margin: 10px 0;
	box-shadow: 0 0 1px 0 rgba(0,0,0,.25), 0 4px 11px 0 rgba(0,0,0,.08), -1px 3px 3px 0 rgba(0,0,0,.14);
}

.create-item-button {
	margin: 10px 0;
	height: 30px;
	padding: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 1px 0 rgba(0,0,0,.25), 0 4px 11px 0 rgba(0,0,0,.08), -1px 3px 3px 0 rgba(0,0,0,.14);
}

.ui-switch {
	position: relative;
	background-color: #d0d2d3;
	margin: 50px;
	padding: 10px;
	width: 60px;
	height:20px;
	border: 1px solid clear;
	border-radius: 50px;
	text-align: right;
	-webkit-transition: background-color 0.1s ease-out;
	-moz-transition: background-color 0.1s ease-out;
	-ms-transition: background-color 0.1s ease-out;
	-o-transition: background-color 0.1s ease-out;
	transition: background-color 0.1s ease-out;
}

.ui-switch input[type=checkbox] {
	display: none;
}

.ui-switch-circle {
	position: absolute;
	left: 5px;
	top: 5px;
	width: 30px;
	height: 30px;
	background-color: white;
	border: 1px solid clear;
	border-radius: 50px;
	box-shadow: 0 0 1px 0 rgba(0,0,0,.25), 0 4px 11px 0 rgba(0,0,0,.08), -1px 3px 3px 0 rgba(0,0,0,.14);
	-webkit-transition: left 0.1s ease-out;
	-moz-transition: left 0.1s ease-out;
	-ms-transition: left 0.1s ease-out;
	-o-transition: left 0.1s ease-out;
	transition: left 0.1s ease-out;
}

.ui-switch-text {
	position: absolute;
	top: 11px;
	left: 45px;
	-webkit-transition: left 0.1s ease-out;
	-moz-transition: left 0.1s ease-out;
	-ms-transition: left 0.1s ease-out;
	-o-transition: left 0.1s ease-out;
	transition: left 0.1s ease-out;
}
```
