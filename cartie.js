/*!
 * Cartie.js - jQuery Cookie Cart Plugin
 * https://github.com/yusufbesim/cartie.js
 *
 * Copyright 2015
 * Released under the MIT license
 *
 * Thanks to Klaus Hartl for cookie manage jquery cookie plugin. This plugins cookie managment code blocks from him
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) { // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') { // CommonJS
        factory(require('jquery'));
    } else { // Browser Globals
        factory(jQuery);
    }
}(function ($) {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }
    function cookieManage(key, value, options){
        // Write Cart Data
        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read Cart Data
        var result = key ? undefined : {};
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }
        return result;
    }
    function calculateCart(){
        var totalPrice = 0;
        var items = config.cart.items;
        for(var index in items) {
            totalPrice += items[index].price * items[index].qty;
        }
        return Math.ceil(totalPrice * 100) / 100;
    }
    var config = $.cartie = function (action, options) {
        options = (options=="undefined"?{}:options);
        var result = false;
        if(typeof(action) === "object"){ // IF set defaults
            for(var index in action) {
                config.defaults[index] = action[index];
                if(index == "currency"){config.cart["currency"] = action["currency"]}
            }
            result = true;
        } else { // IF actions fired
            switch(action){
                case "default":
                    result = config.defaults[options.option];
                    break;
                case "items":
                    return config.cart.items;
                    break;
                case "totalProduct":
                    result = config.cart.items.length;
                    break;
                case "totalPrice":
                    result = config.cart.total;
                    break;
                case "add":
                    result = true;
                    var alreadyInCart = false;
                    var items = config.cart.items;
                    for(var index in items) {
                        if(items[index].id == options.id){
                            config.cart.items[index].qty += parseInt(options.qty);
                            alreadyInCart = true;
                        }
                    }
                    if(!alreadyInCart){
                        if(options.id !== undefined && options.price !== undefined){
                            config.cart.items.push({
                                id:options.id,
                                qty:parseInt(options.qty === undefined?0:options.qty),
                                price:parseFloat(options.price),
                                name:options.name,
                                image:options.image,
                                description:options.description
                            });
                        } else {
                            result = false;
                        }
                    }
                    config.cart.total = calculateCart();
                    break;
                case "remove":
                    var items = config.cart.items;
                    for(var index in items) {
                        if(items[index].id == options.id){
                            config.cart.items[index].qty -= options.qty;
                            if(config.cart.items[index].qty < 1){
                              config.cart.items.splice(index, 1);
                            }
                        }
                    }
                    config.cart.total = calculateCart();
                    result = true;
                    break;
                case "clear":
                    config.cart = {
                        items:[],
                        total:0,
                        currency:config.defaults.currency
                    }
                    return true;
                    break;
                default:
                    break;
            }
        }
        cookieManage("cartie",JSON.stringify(config.cart));
        return result;
    };

    config.defaults = {
        currency:"USD"
    };
    config.cart = {
        items:[],
        total:0,
        currency:config.defaults.currency
    }
    try {
        var cartTMP = cookieManage("cartie");
        cartTMP = JSON.parse(cartTMP);
        if(typeof(cartTMP) === "object"){
            config.cart = cartTMP;
        }
    } catch(e) {
        cookieManage("cartie",JSON.stringify(config.cart));
    }
}));
