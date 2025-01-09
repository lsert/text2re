"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = text2RE;
var _react = _interopRequireWildcard(require("react"));
var _excluded = ["children"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
        return /*#__PURE__*/_react.default.createElement(Fn, _extends({
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
      others = _objectWithoutProperties(props, _excluded);
    var code = [];
    if (children) {
      _react.default.Children.forEach(children, function (child) {
        if (typeof child === 'string') {
          code.push.apply(code, _toConsumableArray(parseHTMLText(child)));
        } else {
          code.push(child);
        }
      });
    }
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, transformCode(code)(Fn, others));
  };
}