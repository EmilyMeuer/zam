# Z
A fast 1KB micro library that simplifies DOM traversal, event handling, and Ajax.

# Methods

## .e(selector)

String 'selector' -> optional | If undefined then last used selector is used.

Returns Array of Elements

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

String 'selector' -> optional | If undefined then last used selector is used.

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

## .ajax(options, callback);

Object 'options' -> required

Function 'callback' -> required

# Example

```javascript
var z = new Z();
    
z.on('mousedown', 'div', () => {
  z.css({'transition': '3s color', 'color': '#135791'}, 'div:nth-child(1)');
});
    
z.on('mouseup', 'div', () => {
  z.css({'color': ''});
});
    
z.addStyle('@keyframes example {from {background-color: red;}to {background-color: yellow;}}', 'newStyleId');
z.css({'animation': 'example 3s'}, 'div:nth-child(1)');
    
setTimeout(() => {
  z.css({'animation': ''}, 'div:nth-child(1)');
  z.removeStyle('newStyleId');
}, 5000);
    
z.each((elem, i) => {
  console.log(elem);
});
```
