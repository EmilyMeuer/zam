# Z

- Compact: 3KB
- Fast: About twice as fast as jQuery
- Simple: Makes for easier DOM traversal, event handling, and Ajax

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
