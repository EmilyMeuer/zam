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
<script src="https://cdn.jsdelivr.net/gh/roecrew/zam@0.3.8/zam.min.js"></script>
```
```
npm install node-zam
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

Returns Array of DOMElements

### .index(element)

DOMElement 'element' -> required

Returns index

### .html(selector, html)

String or DOMElement 'selector' -> optional | If undefined then last used selector (String) is used.

String 'html' -> required

Returns nothing

### .on(events, selector, func)

String 'events' -> required

String 'selector' -> required

Function or String 'func' -> required

Returns nothing

### .off(events, selector, func)

String 'events' -> required

String 'selector' -> required

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

### .fadeIn(selector, time)

String 'selector' -> optional | If undefined then last used selector is used.

String 'value' -> required

Returns nothing

### .fadeOut(selector, time)

String 'selector' -> optional | If undefined then last used selector is used.

String 'value' -> required

Returns nothing

### .ajax(options, callback)

Object 'options' -> required

Function 'callback' -> required

Returns nothing

## Example

```javascript
var z = new Zam();
    
z.on('mousedown', 'div', (e) => {
  z.css({'transition': '3s color', 'color': '#135791'}, e.target);
});
    
z.on('mouseup', 'div', (mouseup1 = () => { //zam tracks event handlers/methods, so give it a name (mouseup1)!
  z.css({'color': ''}));
});
    
z.addStyle('@keyframes example {from {background-color: red;}to {background-color: yellow;}}', 'newStyleId');
z.css({'animation': 'example 3s'}, 'div:nth-of-type(1)');
    
setTimeout(() => {
  z.css({'animation': ''}, 'div:nth-of-type(1)');
  z.removeStyle('newStyleId');
  z.off('mouseup', 'div', 'mouseup1'); //zam remembers mouseup1
}, 5000);
    
z.each((elem, i) => {
  console.log(elem);
});

z.ajax({method: 'get', url: 'http:\/\/freegeoip.net\/json\/', headers: {'Accept':'application/json'}}, function(data) {
  z.e('.stats')[0].innerHTML = '<span>IP: '+data.ip+' City: '+data.city+'\nZip: '+data.zip_code+'&nbsp;</span><span></span>';
});
```
