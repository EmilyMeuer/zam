<p align="center"><img src="https://i.imgur.com/xNH3Y7b.png" width="auto" height="230px" /><p/>

<p align="center">
<strong>Fast - Compact - Easy</strong>
</p>
<!--<p align="center">
<img src="https://cdn.worldvectorlogo.com/logos/chrome-7.svg" width="48px" height="48px" alt="Chrome logo">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://www.underconsideration.com/brandnew/archives/firefox_2017_logo.jpg" width="48px" height="48px" alt="Firefox logo">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Microsoft_Edge_logo.svg/2000px-Microsoft_Edge_logo.svg.png" width="48px" height="48px" alt="Edge logo">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://operasoftware.github.io/logo/dest/logo/full-red.svg" width="48px" height="48px" alt="Opera logo">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://www.gfxmag.com/wp-content/uploads/2016/07/safari-icon-vector-logo.jpg" width="48px" height="48px" alt="Safari logo">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot.svg/2000px-Android_robot.svg.png" width="48px" height="48px" alt="Android Browser Logo" >
</p>-->

## Speed Tests

### Event binding

With 2,500 div tags with events mouseover and mouseleave.

Z is 5.38 times faster than jQuery.


| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 8ms | 8ms | 8ms | 10ms | 8ms | 8.4ms | Z |
| 42ms | 50ms | 42ms | 50ms | 42ms | 45.2ms | jQuery |

<br/>

With 10,000 div tags with events mouseover and mouseleave.

Z is 7.09 times faster than jQuery.


| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 20ms | 21ms | 21ms | 21ms | 22ms | 21ms | Z |
| 164ms | 160ms | 153ms | 122ms | 146ms | 149ms | jQuery |

<br/>

With 50,000 div tags events mouseover and mouseleave.

Z is 6.74 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 117ms | 114ms | 106ms | 112ms | 111ms | 112ms | Z |
| 713ms | 766ms | 732ms | 772ms | 794ms | 755.4ms | jQuery |

<img src="https://i.imgur.com/nbtnM9A.png" />

### Setting CSS

With 2,500 div tags setting all divs to font-size: 40px.

Z is 1.47 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 10ms | 9ms | 9ms | 10ms | 11ms | 9.8ms | Z |
| 14ms | 15ms | 14ms | 15ms | 14ms | 14.4ms | jQuery |

<br/>

With 10,000 div tags setting all divs to font-size: 40px.

Z is 1.62 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 38ms | 30ms | 35ms | 26ms | 29ms | 31.6ms | Z |
| 49ms | 48ms | 49ms | 52ms | 58ms | 51.2ms | jQuery |

<br/>

With 50,000 div tags setting all divs to font-size: 40px.

Z is 1.41 times faster than jQuery.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 170ms | 160ms | 166ms | 128ms | 170ms | 158.8ms | Z |
| 219ms | 236ms | 205ms | 201ms | 255ms | 223.2ms | jQuery |

<br/>

With 250,000 div tags setting all divs to font-size: 40px.

jQuery errors out. Z doesn't.

| Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average | Library |
|-------|-------|-------|-------|-------|---------|---------|
| 1496ms | 1484ms | 1471ms | 1480ms | 1478ms | 1481.8ms | Z |
| \* | \* | \* | \* | \* | unknown | jQuery |

\* 'Maximum call stack size exceeded'

<img src="https://i.imgur.com/qET0osb.png" />

## Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/Z@v2.4/z.min.js"></script>
```
```
npm install node-z
```

## Methods

### .e(selector)

String 'selector' -> optional | If undefined then last used selector is used.

Returns Array of DOMElement

### .index(element)

DOMElement 'selector' -> required

Returns index

### .on(event, selector, func);

String 'event' -> required

String 'selector' -> required

Function 'func' -> required

Returns nothing

### .off(event, selector, funct);

String 'event' -> required

String 'selector' -> required

Function 'func' -> required

Returns nothing

### .css(declaration, selector);

String 'declaration' -> required

String or DOMElement 'selector' -> optional | If undefined then last used selector (String) is used.

Returns nothing

### .each(selector, callback);

String 'selector' -> optional | If undefined then last used selector is used.

Function 'callback' -> required

Returns nothing

### .addStyle(innerHTML, id)

String 'innerHTML' -> required

String 'id' -> required

Returns nothing

### .removeStyle(id);

String 'id' -> required

Returns nothing

### .fadeIn(selector, value);

String 'selector' -> optional | If undefined then last used selector is used.

String 'value' -> required

Returns nothing

### .fadeOut(selector, value);

String 'selector' -> optional | If undefined then last used selector is used.

String 'value' -> required

Returns nothing

### .ajax(options, callback);

Object 'options' -> required

Function 'callback' -> required

Returns nothing

## Example

```javascript
var z = new Z();
    
z.on('mousedown', 'div', (e) => {
  z.css({'transition': '3s color', 'color': '#135791'}, 'div:nth-of-type(' + (z.index(e) + 1) + ')');
});
    
z.on('mouseup', 'div', () => {
  z.css({'color': ''});
});
    
z.addStyle('@keyframes example {from {background-color: red;}to {background-color: yellow;}}', 'newStyleId');
z.css({'animation': 'example 3s'}, 'div:nth-of-type(1)');
    
setTimeout(() => {
  z.css({'animation': ''}, 'div:nth-of-type(1)');
  z.removeStyle('newStyleId');
}, 5000);
    
z.each((elem, i) => {
  console.log(elem);
});

z.ajax({method: 'get', url: 'http:\/\/freegeoip.net\/json\/', headers: {'Accept':'application/json'}}, function(data) {
  z.e('.stats')[0].innerHTML = '<span>IP: '+data.ip+' City: '+data.city+'\nZip: '+data.zip_code+'&nbsp;</span><span></span>';
});
```
