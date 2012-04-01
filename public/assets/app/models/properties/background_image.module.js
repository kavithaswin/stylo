(function() {
  if (!this.require) {
    var modules = {}, cache = {};

    var require = function(name, root) {
      var path = expand(root, name), indexPath = expand(path, './index'), module, fn;
      module   = cache[path] || cache[indexPath];
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = indexPath]) {
        module = {id: path, exports: {}};
        cache[path] = module.exports;
        fn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        return cache[path] = module.exports;
      } else {
        throw 'module ' + name + ' not found';
      }
    };

    var expand = function(root, name) {
      var results = [], parts, part;
      // If path is relative
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.define = function(bundle) {
      for (var key in bundle) {
        modules[key] = bundle[key];
      }
    };

    this.require.modules = modules;
    this.require.cache   = cache;
  }

  return this.require;
}).call(this);
this.require.define({"app/models/properties/background_image":function(exports, require, module){(function() {
  var BackgroundImage, Color, ColorStop, LinearGradient, Position, Property, Pure, URL,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Property = require('app/models/property');

  Color = require('./color');

  Position = (function() {

    function Position(angle) {
      this.angle = angle != null ? angle : 0;
    }

    Position.prototype.toString = function() {
      return "" + this.angle + "deg";
    };

    return Position;

  })();

  ColorStop = (function() {

    function ColorStop(color, length) {
      this.color = color;
      this.length = length;
      this.color || (this.color = new Color);
    }

    ColorStop.prototype.toString = function() {
      if (this.length) {
        return "" + this.color + " " + this.length + "%";
      } else {
        return "" + this.color;
      }
    };

    return ColorStop;

  })();

  BackgroundImage = (function(_super) {

    __extends(BackgroundImage, _super);

    function BackgroundImage() {
      BackgroundImage.__super__.constructor.apply(this, arguments);
    }

    return BackgroundImage;

  })(Property);

  LinearGradient = (function(_super) {

    __extends(LinearGradient, _super);

    function LinearGradient(position, stops) {
      this.position = position != null ? position : new Position;
      this.stops = stops != null ? stops : [];
    }

    LinearGradient.prototype.toString = function() {
      return "-webkit-linear-gradient(" + ([this.position].concat(__slice.call(this.stops)).join(',')) + ")";
    };

    LinearGradient.prototype.addStop = function(stop) {
      return this.stops.push(stop);
    };

    LinearGradient.prototype.removeStop = function(stop) {
      var index;
      index = this.stops.indexOf(colorStop);
      return this.stops.splice(index, 1);
    };

    return LinearGradient;

  })(BackgroundImage);

  URL = (function(_super) {

    __extends(URL, _super);

    function URL(url) {
      this.url = url;
    }

    URL.prototype.toString = function() {
      return "url('" + this.url + "')";
    };

    return URL;

  })(BackgroundImage);

  Pure = (function(_super) {

    __extends(Pure, _super);

    function Pure(color) {
      this.color = color;
    }

    Pure.prototype.toString = function() {
      return "" + this.color;
    };

    return Pure;

  })(BackgroundImage);

  module.exports = BackgroundImage;

  module.exports.LinearGradient = LinearGradient;

  module.exports.URL = URL;

  module.exports.Position = Position;

  module.exports.ColorStop = ColorStop;

  module.exports.Pure = Pure;

}).call(this);
;}});
