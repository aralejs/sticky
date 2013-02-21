define(function(require, exports, module) {

    // detect position: sticky; 
    // thanks to https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/positionsticky.js

    var createElement = document.createElement.bind(document);
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

    var prop = 'position:';
    var value = 'sticky';
    var el = createElement('modernizr');
    var mStyle = el.style;

    mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, -prop.length);

    return mStyle.position.indexOf(value) !== -1;

});
