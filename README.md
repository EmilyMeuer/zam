<p align="center"><img src="https://i.imgur.com/b4uo72l.png" width="auto" height="75px" /><p/>

<p align="center">
<strong>Fast - Minimal - Easy</strong>
</p>

<p align="center">
http://zamjs.com
</p>

## Overview/Philosophy

Simplifies DOM traversal, event handling, Ajax, and encourages single-page applications.

This library was created with one goal in mind — to stay close to vanilla.

## Quickstart

Zam is component based. A component represents a DOMElement or node.

```javascript
class Foo extends Zam.component {
  constructor() {
    super()
    this.setHTML(`
      <div>Hello</div>
      <div>Universe!</div>
    `);
  }
  mounted {}
}
```

When we update a component's innerHTML, we call this.mount(). Then, all of the given element's descendents are re-rendered and mounted (that's why we have the mounted function - so we know when a component has successfully mounted).

```javascript
class Item extends Zam.component {
    constructor() {
        super();
        this.cache(new UISwitch(), 'switch');
        this.cache(new DeleteItemButton(), 'deleteButton');
        this.setHTML(`
	    <div class="item">
                ${this.cache('switch').html}
                <br/>
                <br/>
                ${this.cache('deleteButton').html}
                <div class="moreInfo">
                    More Info
                </div>
            </div>
        `);
    }
    mounted() {
        console.log("Item mounted");
        // ...do stuff like add event listeners here
    }
}

class Items extends Zam.component {
    constructor() {
        super();
        this.itemCnt = 0;
        this.setHTML(`
            <div class="items" id="items">
            </div>
        `);
    }

    createItem() {
        var item = new Item();
        this.cache(item, ('item' + this.itemCnt++));
        this.anchor.children[0].appendChild(item.anchor);
        item.mount();
    }

    mounted() {}
}
```


## Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@4.0/zam.min.js"></script>
```
```
npm install zamjs
```


## Speed Tests

### Event binding

With 2,500 div tags with events mouseover and mouseleave.

Zam is 5.38 times faster than jQuery.


| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 8ms | 8ms | 8ms | 10ms | 8ms | 8.4ms | zam |
| 42ms | 50ms | 42ms | 50ms | 42ms | 45.2ms | jQuery |

<br/>

With 10,000 div tags with events mouseover and mouseleave.

Zam is 7.09 times faster than jQuery.


| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 20ms | 21ms | 21ms | 21ms | 22ms | 21ms | zam |
| 164ms | 160ms | 153ms | 122ms | 146ms | 149ms | jQuery |

<br/>

With 50,000 div tags events mouseover and mouseleave.

Zam is 6.74 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 117ms | 114ms | 106ms | 112ms | 111ms | 112ms | zam |
| 713ms | 766ms | 732ms | 772ms | 794ms | 755.4ms | jQuery |

<img src="https://i.imgur.com/nbtnM9A.png" />

### Setting CSS

jsPerf findings https://jsperf.com/zam-vs-jquery

https://jsperf.com/zam-vs-vue-js-set-css/1

With 2,500 div tags setting all divs to font-size: 40px.

Zam is 1.47 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 10ms | 9ms | 9ms | 10ms | 11ms | 9.8ms | zam |
| 14ms | 15ms | 14ms | 15ms | 14ms | 14.4ms | jQuery |

<br/>

With 10,000 div tags setting all divs to font-size: 40px.

Zam is 1.62 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 38ms | 30ms | 35ms | 26ms | 29ms | 31.6ms | zam |
| 49ms | 48ms | 49ms | 52ms | 58ms | 51.2ms | jQuery |

<br/>

With 50,000 div tags setting all divs to font-size: 40px.

Zam is 1.41 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 170ms | 160ms | 166ms | 128ms | 170ms | 158.8ms | zam |
| 219ms | 236ms | 205ms | 201ms | 255ms | 223.2ms | jQuery |

<br/>

With 250,000 div tags setting all divs to font-size: 40px.

jQuery errors out. Zam doesn't.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 1496ms | 1484ms | 1471ms | 1480ms | 1478ms | 1481.8ms | zam |
| \* | \* | \* | \* | \* | unknown | jQuery |

\* 'Maximum call stack size exceeded'

<img src="https://i.imgur.com/qET0osb.png" />

## Zam.component - Properties

### anchor

The anchor is a DOMElement

Say we created a Zam.component with the following structure

```
this.setHTML(`
    <div>Hello World - 1!<div>
    <div>Hello World - 2!<div>
    <div>Hello World - 3!<div>
`)
```

This Component would be rendered to the following HTML

```
<div id="a0">
    <div>Hello World - 1!<div>
    <div>Hello World - 2!<div>
    <div>Hello World - 3!<div>
</div>
```

The anchor is the DOMElement for

```
<div id="a0">...</div>
```

### html

This property is just the outerHTML of a component's anchor DOMElement

## Zam.component - Methods

### setHTML(string)

returns nothing

### cache(Zam.component, string)

caches Zam.component with specified key 'string'

returns Zam.component

### cache(string)

returns Zam.component associated with key 'string'

### mount(void)

initiates recursive refresh/rendering. All cached descendents 'mounted()' method will be called

returns nothing

### mounted(void)

See 'mount(void)'

returns nothing

## Class Methods

### Zam.on(events, selector, func)

String 'events' -> required

String or DOMElement 'selector' -> required

Function or String 'func' -> required

Returns nothing

### Zam.off(events, selector, func)

String 'events' -> required

String or DOMElement 'selector' -> required

Function or String 'func' -> required

Returns nothing

### Zam.css(declarations, selector)

String 'declarations' -> required

String or DOMElement 'selector' -> required

Returns nothing

### Zam.ajax(options)

Object 'options' -> required

Returns Promise

## Zam.router(routes) - Object

Object 'routes' -> required

See the example below to get a better idea of how .router() works.

## Example

For more examples visit http://zamjs.com/examples

### Router - Frontend

```html
<html>
  <head>
    <style>
      .section {
        position: absolute;
        left: 0;
        top: 60px;
        width:100%
        height: calc(100vh - 60px);
      }
      .bar-tab {
        width: 100%;
        height: 60px;
        display: flex;
        jusitify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
  <div class="bar-tab">
    <div id="home-tab">
      HOME
    </div>
    <div id="stuff-tab">
      STUFF
    </div>
    <div id="about-tab">
      ABOUT
    </div>
  </div>
  <div class="section" id="home">
    ... some content ...
  </div>
  <div class="section" id="stuff">
    ... some content ...
  </div>
  <div class="section" id="about">
    ... some content ...
  </div>
<script type="module">
import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@4.0/zam.min.js";
new Zam.router({
    'home-tab': {view: '#home', 'display': 'flex'}, //the first route will always be the root route. i.e www.somesite.com/
    'stuff-tab': {view: '#stuff', 'display': 'flex'},
    'about-tab': {view: '#about', 'display': 'flex'}
})
</script>
</body>
</html>
```

### Router - Backend

```javascript
const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();

app.get("/*", function(req, res) {
  res.sendFile(__dirname + "/dist/home.html");
});

const httpServer = http.createServer(app);
httpServer.listen(80);
```
