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

## Quickstart

```html
<html>
<body>
  <div z-data="myData" id="myComp1">
    <div z-link="myComp1" z-event="mouseover">
      Hover over me!
    </div>
  </div>
  <script type="module">
    import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@1.8/zam.min.js";
    var zam = new Zam({
		myData:
		`
		<div z-link="master" z-event="mouseleave">
		  Nice Job!
		</div>`
    }, (e) => {
      zam.css({'background-color':'yellow'}, e);
    });
  </script>
</body>
</html>
```

Note:

* z-event default value is 'click'.

* z-link="master" links to parent element.

## Event Engine Lifecycle

### What is the Event Engine?

The Event Engine is a really just a loop function that detects new Engine Attributes, and creates an event listener according to those attributes.

### What are Engine Attributes?

They are custom element attributes used to create an event listener.

* z-link : Its value is an id attribute of a element.

* z-data : Its value corresponds to a key in a Zam instance's .data object.

* z-event : It's value corresponds to a event type ('mouseover', 'mouseleave', etc). If the z-event attribute isn't declared, then the event type defaults to 'click'.

* z-append : Its value is nothing. It acts as a flag to tell the Event Engine to append z-data to the given element's innerHTML.

* z-prepend : Its value is nothing. It acts as a flag to tell the Event Engine to prepend z-data to the given element's innerHTML..

* Note : If z-append or z-prepend are not declared on an element. Then z-data's value will replace the innerHTML with z-data's value

### Event Engine Example 1

Consider the following code...

```html
<html>
<body>
  <div z-data="someData" id="someID1">
    <div z-link="someID1">
      Click Me
    </div>
  </div>
  <div z-data="someData" id="someID2">
    <div z-link="someID2">
      Click Me
    </div>
  </div>
  <script>
    import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@1.8/zam.min.js";
    var zam = new Zam({
      someData:`
        <div z-link="master">
  	  Click me again!
        </div>`
    }, (element, event) => {
  
    });
  </script>
</body>
</html>
```
First. Notice that \<div z-link="someID1"\>Click Me\</div\> links to \<div z-data="someData" id="someID1"\>...\</div\>

Since no z-event attribute is declared on \<div z-link="someID1"\>Click Me\</div\>, then it defaults to event type 'click'.

So basically, when we click \<div z-link="someID1"\>Click Me\</div\>, then \<div z-data="someData" id="someID1"\>...\</div\> will have it's innerHTML replaced with "someData".

In this example, "someData" is defined as string \`\<div z-link="master"\>Click me again!\</div\>\`.

You are probably asking yourself -- What is z-link="master"?

z-link="master" will inherit the z-link value of the element that was just replaced. So in this case, z-link="master" will be transformed by the Event Engine to z-link="someID1".

Everything we just stated applies to \<div z-data="someData" id="someID2"\>\<div z-link="someID2"\>Click Me\</div\>\</div\> as well.

##

We literally just created a toggle button.

If we click "Click Me", then "Click Me Again!" will appear.

And if we click "Click Me Again!", then "Click Me" will reappear.

##

Now you may be wondering, "What is that arrow function with the parameters 'element' and 'event'"?

That arrow function is the Event Engine's callback. Everytime the engine cycles (an Engine's assigned event triggers) the callback will execute.

* 'element' is the DOMElement of the html (from 'someData') that was just injected. In this case it's \<div z-link="master"\>...\</div\>.

* 'event' is the DOM Event object that has occured.

##

### Event Engine Example 2

Consider the following code...

```html
<html>
<body>
  <div class="commentForm">
    <input type="text" placeholder="Enter your comment..." id="commentInput" />
    <div z-link="comments" class="addComment">
      Add Comment
    </div>
    <div z-data="newComment" z-append id="comments">
    </div>
  </div>
  <script type="module">
    import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@1.8/zam.min.js";
    var i = 0;
    var createComment = function() {
      return `
        <div z-data="deleteComment" class="comment" id="comment-${i}">
          <span></span>
          <div z-link="comment-${i}" class="deleteComment">
            Delete
          </div>
        </div>`
    }
    var zam = new Zam({
      newComment:createComment(),
      deleteComment: ``
    }, (elem, event) => {
      if(event.target.className === 'addComment') {
        elem.querySelectorAll('span')[0].innerHTML = zam.e('#commentInput')[0].value;
        zam.e('#commentInput')[0].value = '';
        i++;
        zam.data['newComment'] = createComment();
      }
    });
  </script>
</body>
</html>
```

I'm not going to go in-depth on this example. I highly recommend running this html on your browser. This example shows just how powerful the Zam Event Engine can be.

To see this example live, visit http://zamjs.com/examples.

##

## Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@1.8/zam.min.js"></script>
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

String or DOMElement 'selector' -> required

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

String or DOMElement 'selector' -> required

Returns nothing

### .each(selector, callback)

String 'selector' -> required

Function 'callback' -> required

Returns nothing

### .addStyle(ruleSet, id)

String 'ruleSet' -> required

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
<script type="module">
import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@1.8/zam.min.js";
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
