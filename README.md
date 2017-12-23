# Z

- Compact: 3KB
- Fast: See speed tests.
- Simple: Makes for easier DOM traversal, event handling, and Ajax

# Speed Tests

## Event binding

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

## Setting CSS

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

# Import

```html
<script src="https://cdn.jsdelivr.net/gh/roecrew/Z@v2.3/z.min.js"></script>
```

# Methods

## .e(selector)

String 'selector' -> optional | If undefined then last used selector is used.

Returns Array of DOMElement

## .index(element)

DOMElement 'selector' -> required

Returns index

## .on(event, selector, func);

String 'event' -> required

String 'selector' -> required

Function 'func' -> required

Returns nothing

## .off(event, selector, funct);

String 'event' -> required

String 'selector' -> required

Function 'func' -> required

Returns nothing

## .css(declaration, selector);

String 'declaration' -> required

String or DOMElement 'selector' -> optional | If undefined then last used selector (String) is used.

Returns nothing

## .each(selector, callback);

String 'selector' -> optional | If undefined then last used selector is used.

Function 'callback' -> required

Returns nothing

## .addStyle(innerHTML, id)

String 'innerHTML' -> required

String 'id' -> required

Returns nothing

## .removeStyle(id);

String 'id' -> required

Returns nothing

## .fadeIn(selector, value);

String 'selector' -> optional | If undefined then last used selector is used.

String 'value' -> required

## .fadeOut(selector, value);

String 'selector' -> optional | If undefined then last used selector is used.

String 'value' -> required

## .ajax(options, callback);

Object 'options' -> required

Function 'callback' -> required

# Example

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
