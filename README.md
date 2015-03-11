# Cartie.JS

A simple, lightweight jQuery plugin for cookie based cart basket.


## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/cartie.js"></script>
```

**Do not include the script directly from GitHub

The plugin can also be loaded as AMD or CommonJS module.

## Usage

Set defaults:

```javascript
$.cartie({currency:"USD"});
```

Add Item to cart:

```javascript
$.cartie('add', {id:1,qty:2,price:120,name:"Awesome Product",description:"Red and shiny product"});
```

Remove Item from cart: (You must set id and qty. If qty greater than currently qty, script removes selected item)

```javascript
$.cartie('remove', {id:1,qty:2);
```

Clear cart

```javascript
$.cartie('clear');
```


Get cart total price

```javascript
$.cartie('totalPrice');
```

Read default values;

```javascript
$.cartie("default","currency"); // => "USD"
```

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Authors

[A. Yusuf Besim](https://github.com/yusufbesim)

# Thanks

I am used some code blocks from jquery.cookie plugin for this simple cart plugin

=======
# Cartie.js
A simple, lightweight jQuery plugin for cookie based cart basket.
>>>>>>> b02dd7127b57a8fdef1b7be943c2ff67d5c16c30
