<p align="center"><img src="https://i.imgur.com/b4uo72l.png" width="auto" height="75px" /><p/>

<p align="center">
<strong>Fast - Minimal - Easy</strong>
</p>

<p align="center">
http://zamjs.com
</p>

## Overview/Philosophy

Encourages single-page applications.

This library was created with one goal in mind — to stay close to vanilla.

## Quickstart

Zam is component based.

## Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@5.1/zam.min.js"></script>
```
```
npm install zamjs
```

## Router Example

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
import Zam from "https://cdn.jsdelivr.net/gh/roecrew/zam@5.1/zam.min.js";
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
