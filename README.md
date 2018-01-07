<p align="center"><img src="https://i.imgur.com/b4uo72l.png" width="auto" height="75px" /><p/>

<p align="center">
<strong>Fast - Minimal - Easy</strong>
</p>

<p align="center">
http://zamjs.com
</p>

<p align="center"><img src="https://travis-ci.org/roecrew/zam.svg?branch=master" /> <a class="badge-align" href="https://www.codacy.com/app/roecrew/zam?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=roecrew/zam&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/b47e18bf79834015842bf7e65ff7d565"/></a></p>

## Overview

Zam is a component-based micro-library (about 3KBs).

Zam objects can be thought of as components. These components generate a specified structure of elements, which are mounted to the DOM.

By confining/compartmentalizing the DOM elements that make up a structure to a Zam component, we create a cleaner coding environment. Through the process of abstraction, a Zam component hides all but the relevant data — in order to reduce complexity and increase efficiency.

##

Basically Zam can build this.

<img src="https://i.imgur.com/zf4gIMp.png" width="auto" height="75px" />

By doing this.
```javascript
import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@8.4/zam.min.js"
import { UISwitch } from "components.js"
var uiSwitch = new UISwitch();
uiSwitch.mount('someSelector');
```

Instead of doing this...

```css
.ui-switch {
  position: relative;
  background-color: #d0d2d3;
  margin: 50px;
  padding: 10px;
  width: 60px;
  height: 20px;
  border: 1px solid clear;
  border-radius: 50px;
  text-align: right;
  transition: background-color 0.1s ease-out;
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
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.25), 0 4px 11px 0 rgba(0, 0, 0, 0.08),
    -1px 3px 3px 0 rgba(0, 0, 0, 0.14);
  transition: left 0.1s ease-out;
  cursor: pointer;
}

.ui-switch-text {
  position: absolute;
  background-color: initial;
  top: 11px;
  left: 45px;
  transition: left 0.1s ease-out;
}
```
```html
<div class="ui-switch">
    <span class="ui-switch-text">
        Off
    </span>
    <div class="ui-switch-circle">
    </div>
</div>
```
```javascript
var circles = document.querySelectorAll('.ui-switch-circle');
var len = circles.length;
for(var i=0; i<len; i++) {
  circles[i].addEventListener('click', function(e) {
    var circleStyle = e.target.style;
    circleStyle.left === '' ? circleStyle.left = '10px' : circleStyle.left = '';
    var switchStyle = e.target.parentNode.style;
    switchStyle.backgroundColor === '' ? switchStyle.backgroundColor = 'rgb(76, 218, 99)' : switchStyle.backgroundColor = '';
    var textStyle = e.target.parentNode.querySelectorAll('.ui-switch-text')[0].style;
    textStyle.left === '' ? textStyle.left = '45px' : textStyle.left = '';
    var textNode = e.target.parentNode.querySelectorAll('.ui-switch-text')[0];
    textNode.innerHTML === 'Off' ? textNode.innerHTML = 'On' : textNode.innerHTML = 'Off';
  });
}
```

## Import

### Current Stable Build is 8.4

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@8.4/zam.min.js"></script>
```
```
npm install zamjs@8.4.0
```

## Quickstart

Zam is component based.

<strong>Every Zam object represents and manages a single DOM Element.</strong>

Example - Hello World!

```html
<html>
<head>
</head>
<body>
    <div id="root">
    </div>
    <script type="module">
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@8.4/zam.min.js";

        export class Foo extends Zam {
            constructor() {
                super(`<div>Hello World!</div>`);
            }
        }
        
        var foo = new Foo();
	foo.mount('#root'); // We mount our 'Foo' instance to the element with id attribute 'root'.
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
    <div id="root">
    </div>
    <script type="module">
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@8.4/zam.min.js";

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
	root.mount('#root');
    </script>
</body>
</html>
```

## Examples

http://zamjs.com/examples

## Instance Methods

* <strong>.mount(selector)</strong>

  * Example: someComponent.mount('someSelector');
  
  * Returns: Nothing.

* <strong>.append(component, key)</strong>

  * Example: someComponent.append(new Zam(`<div>Hello World</div>`), 'hello-world');
  
  * Returns: Component that was appended.

* <strong>.prepend(component, key)</strong>

  * Example: someComponent.prepend(new Zam(`<div>Hello World</div>`), 'hello-world');
  
  * Returns: Component that was prepended.

* <strong>.replace(component, key)</strong>

  * Example: someComponent.replace(new Zam(`<div>Hello World</div>`), 'hello-world');
  
  * Returns: Component that replaced old component.

* <strong>.remove()</strong>

  * Example: someComponent.remove();
  
  * Returns: Nothing.

* <strong>.on(events, function)</strong>

  * Example: someComponent.on('mousedown', someFunction);
  
  * Returns: Nothing.

* <strong>.off(events, function)</strong>

  * Example: someComponent.off('mousedown', someFunction);
  
  * Returns: Nothing.

* <strong>.setCSS(properties-object)</strong>

  * Example: someComponent.setCSS({'background-color':'red', 'color':'blue'});
  
  * Returns: Nothing.

* <strong>.getCSS(property)</strong>

  * Example: someComponent.getCSS('background-color');
  
  * Returns: String.

* <strong>.toggleCSS(property, value1, value2)</strong>

  * Example: someComponent.toggleCSS('background-color', 'red', '');
  
  * Returns: Nothing.

* <strong>.setInnerHTML(value)</strong>

  * Example: someComponent.setInnerHTML('Hello World!');
  
  * Returns: Nothing.

* <strong>.getInnerHTML()</strong>

  * Example: someComponent.getInnerHTML();
  
  * Returns: String.

## Class Methods

* <strong>Zam.on(events, selector, function)</strong>

  * Example: Zam.on('mouseover', 'someSelector', someFunction);
  
  * Returns: Nothing.

* <strong>Zam.off(events, selector, function)</strong>

  * Example: Zam.off('mouseover', 'someSelector', someFunction);

  * Returns: Nothing.

* <strong>Zam.setCSS(properties-object, selector)</strong>

  * Example: Zam.setCSS({'background-color':'red', 'color':'blue'}, 'someSelector');

  * Returns: Nothing.

* <strong>Zam.getCSS(property, selector)</strong>

  * Example: Zam.getCSS('background-color', 'someSelector');

  * Returns: String.
