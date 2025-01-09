"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = text2RE;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

function loop(elem) {
  if (elem.nodeType === 3) {
    return elem.nodeValue;
  } else if (elem.nodeType === 1) {
    var elems = elem;
    var props = {};

    for (var i = 0; i < elems.attributes.length; i++) {
      var attr = elems.attributes.item(i);

      if (attr) {
        props[attr.nodeName] = attr.nodeValue || '';
      }
    }

    return {
      types: elems.tagName.toLowerCase(),
      props: props,
      children: elem.childNodes.length === 0 ? [] : function () {
        var childNodes = elem.childNodes;
        var childArr = [];

        for (var _i = 0; _i < childNodes.length; _i++) {
          var child = childNodes.item(_i);
          childArr.push(loop(child));
        }

        return childArr;
      }()
    };
  }

  return null;
}

function parseHTMLText(text) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(text, 'text/html');
  var childNodes = doc.body.childNodes;
  var childArr = [];

  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes.item(i);
    childArr.push(loop(child));
  }

  return childArr;
}

function isSimpleDOMProps(props) {
  return !!(props && props.hasOwnProperty('types'));
}

function transformCode(code) {
  return function Tag(Fn) {
    var Props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return code.map(function (item, index) {
      if (isSimpleDOMProps(item)) {
        return _react.default.createElement(Fn, (0, _extends2.default)({
          key: index,
          name: item.types
        }, item.props, Props), transformCode(item.children)(Fn, Props));
      }

      return item;
    });
  };
}

function text2RE(Fn) {
  return function (props) {
    var children = props.children,
        others = (0, _objectWithoutProperties2.default)(props, ["children"]);
    var code = [];

    if (children) {
      _react.default.Children.forEach(children, function (child) {
        if (typeof child === 'string') {
          code.push.apply(code, (0, _toConsumableArray2.default)(parseHTMLText(child)));
        } else {
          code.push(child);
        }
      });
    }

    return _react.default.createElement(_react.Fragment, null, transformCode(code)(Fn, others));
  };
}