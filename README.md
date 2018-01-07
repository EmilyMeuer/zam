<p align="center"><img src="https://i.imgur.com/b4uo72l.png" width="auto" height="75px" /><p/>

<p align="center">
<strong>Fast - Minimal - Easy</strong>
</p>

<p align="center">
http://zamjs.com
</p>

<p align="center"><img src="https://travis-ci.org/roecrew/zam.svg?branch=master" /></p>

## Overview

Zam is a component-based micro-library (about 3KBs).

Zam objects can be thought of as components. These components generate a specified structure of elements, which are mounted to the DOM.

By confining/compartmentalizing the DOM elements that make up a structure to a Zam component, we create a cleaner coding environment. Through the process of abstraction, a Zam component hides all but the relevant data — in order to reduce complexity and increase efficiency.

##

Basically, Zam does this...

```javascript
export class UISwitch extends Zam {
  switchCSS() {
    return {'position': 'relative','background-color': '#d0d2d3','margin':'50px','padding':'10px','width': '60px','height':'20px','border':'1px solid clear','border-radius':'50px','text-align':'right','transition':'background-color 0.1s ease-out'}
  }

  textCSS() {
    return {'position': 'absolute','top': '11px','left': '45px','transition': 'left 0.1s ease-out'}
  }

  circleCSS() {
    return {'position': 'absolute','left': '5px','top': '5px','width': '30px','height': '30px','background-color': 'white','border': '1px solid clear','border-radius': '50px','box-shadow': '0 0 1px 0 rgba(0,0,0,.25), 0 4px 11px 0 rgba(0,0,0,.08), -1px 3px 3px 0 rgba(0,0,0,.14)','transition': 'left 0.1s ease-out'}
  }

  constructor() {
    super(`<div></div>`).setCSS(this.switchCSS());
    this.append(new Zam(`<span>Off</span>`), 'text').setCSS(this.textCSS());
    this.append(new Zam(`<div></div>`), 'circle').setCSS(this.circleCSS());
    this['circle'].on('click', (function() {
      this['text'].setCSS({'left': this['text'].getCSS('left') !== "10px" ? '10px' : "45px"});
      this['text'].getInnerHTML() === "Off" ? (this['text'].setInnerHTML("On")) : (this['text'].setInnerHTML("Off"));
      this['circle'].setCSS({'left': this['circle'].getCSS('left') !== "45px" ? '45px' : "5px"});
      this.setCSS({'background-color': this.getCSS('background-color') !== "rgb(76, 218, 99)" ? 'rgb(76, 218, 99)' : "#d0d2d3"});
    }.bind(this)));
  }
}

var uiSwitch = new UISwitch();
uiSwitch.mount('someSelector');
```

Instead of this...

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
var circles = document.querySelector('.ui-switch-circle');
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

### Current Stable Build is 8.1

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@8.1/zam.min.js"></script>
```
```
npm install zamjs@8.1.0
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
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@8.1/zam.min.js";

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
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@8.1/zam.min.js";

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

Here we introduced Zam.append().

<strong>Zam.append(component, key)</strong>

<strong>component</strong> is a Zam instance.

<strong>key</strong> is... well... what we want to name the component we are appending.

##

Before we go into the next example let's talk about all of Zam's methods.

## Instance Methods

* <strong>.mount(selector)</strong> - We already used this one. It replaces the first child of 'selector' with the given component.

* <strong>.append(component, key)</strong> - We already used this one.

* <strong>.prepend(component, key)</strong> - literally the same as append except we are prepending.

* <strong>.replace(component, key)</strong> - again the same as the last two, but instead we are replacing components.

* <strong>.remove()</strong> - removes component.

* <strong>.on(events, function)</strong> - pretty similar to jQuery's .on().

* <strong>.off(events, function)</strong> - pretty similar to jQuery's .off().

* <strong>.setCSS(properties-object)</strong> pretty similar to jQuery's .css().

* Example - someComponent.setCSS({'color':'red', 'background-color':'blue'})

* <strong>.getCSS(property)</strong>

* Example - someComponent.getCSS('background-color')

* <strong>.setInnerHTML(value)</strong>

* <strong>.getInnerHTML()</strong>

## Class Methods

* <strong>Zam.on(events, selector, function)</strong>

* <strong>Zam.off(events, selector, function)</strong>

* <strong>Zam.setCSS(properties-object, selector)</strong>

* <strong>Zam.getCSS(property, selector)</strong>
