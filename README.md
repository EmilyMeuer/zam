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
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@7.2/zam.min.js"></script>
```
```
npm install zamjs
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
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@7.2/zam.min.js";

        export class Root extends Zam {
            constructor() {
                super(`<div>Hello World!</div>`);
            }
        }
        
        var root = new Root();
	root.mount('#root');
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
        import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@7.2/zam.min.js";

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
