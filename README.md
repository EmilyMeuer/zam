<p align="center"><img src="https://i.imgur.com/b4uo72l.png" width="auto" height="75px" /><p/>

<p align="center">
<strong>Fast - Minimal - Easy</strong>
</p>

<p align="center">
http://zamjs.com
</p>

## Overview/Philosophy

A small toolset that simplifies DOM traversal, event handling, and Ajax.

This library was created with one goal in mind — to stay close to vanilla.

## Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@0.4.5/zam.min.js"></script>
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

## Methods

### .e(selector)

String 'selector' -> optional | If undefined then last used selector is used.

Returns static NodeList

### .index(element)

DOMElement 'element' -> required

Returns index

### .html(html, selector)

String 'html' -> required

String or DOMElement 'selector' -> optional | If undefined then last used selector (String) is used.

Returns nothing

### .on(events, selector, func)

String 'events' -> required

String or DOMElement 'selector' -> required

Function or String 'func' -> required

Returns nothing

### .off(events, selector, func)

String 'events' -> required

String or DOMElement 'selector' -> required

Function or String 'func' -> required

Returns nothing

### .css(declarations, selector)

String 'declarations' -> required

String or DOMElement 'selector' -> optional | If undefined then last used selector (String) is used.

Returns nothing

### .each(selector, callback)

String 'selector' -> optional | If undefined then last used selector is used.

Function 'callback' -> required

Returns nothing

### .addStyle(innerHTML, id)

String 'innerHTML' -> required

String 'id' -> required

Returns nothing

### .removeStyle(id)

String 'id' -> required

Returns nothing

### .ajax(options)

Object 'options' -> required

Returns Promise

### .router(routes)

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
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@0.4.1/zam.js"></script>
<script>
var zam = new Zam();
zam.router({
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
