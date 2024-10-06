"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/rc-resize-observer";
exports.ids = ["vendor-chunks/rc-resize-observer"];
exports.modules = {

/***/ "(ssr)/./node_modules/rc-resize-observer/es/Collection.js":
/*!**********************************************************!*\
  !*** ./node_modules/rc-resize-observer/es/Collection.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Collection: () => (/* binding */ Collection),\n/* harmony export */   CollectionContext: () => (/* binding */ CollectionContext)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nvar CollectionContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);\n/**\n * Collect all the resize event from children ResizeObserver\n */\nfunction Collection(_ref) {\n  var children = _ref.children,\n    onBatchResize = _ref.onBatchResize;\n  var resizeIdRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);\n  var resizeInfosRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef([]);\n  var onCollectionResize = react__WEBPACK_IMPORTED_MODULE_0__.useContext(CollectionContext);\n  var onResize = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (size, element, data) {\n    resizeIdRef.current += 1;\n    var currentId = resizeIdRef.current;\n    resizeInfosRef.current.push({\n      size: size,\n      element: element,\n      data: data\n    });\n    Promise.resolve().then(function () {\n      if (currentId === resizeIdRef.current) {\n        onBatchResize === null || onBatchResize === void 0 || onBatchResize(resizeInfosRef.current);\n        resizeInfosRef.current = [];\n      }\n    });\n\n    // Continue bubbling if parent exist\n    onCollectionResize === null || onCollectionResize === void 0 || onCollectionResize(size, element, data);\n  }, [onBatchResize, onCollectionResize]);\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(CollectionContext.Provider, {\n    value: onResize\n  }, children);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL0NvbGxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUErQjtBQUN4QixxQ0FBcUMsZ0RBQW1CO0FBQy9EO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLG9CQUFvQix5Q0FBWTtBQUNoQyx1QkFBdUIseUNBQVk7QUFDbkMsMkJBQTJCLDZDQUFnQjtBQUMzQyxpQkFBaUIsOENBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsR0FBRztBQUNILHNCQUFzQixnREFBbUI7QUFDekM7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcm9udGVuZC8uL25vZGVfbW9kdWxlcy9yYy1yZXNpemUtb2JzZXJ2ZXIvZXMvQ29sbGVjdGlvbi5qcz8xMzIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmV4cG9ydCB2YXIgQ29sbGVjdGlvbkNvbnRleHQgPSAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTtcbi8qKlxuICogQ29sbGVjdCBhbGwgdGhlIHJlc2l6ZSBldmVudCBmcm9tIGNoaWxkcmVuIFJlc2l6ZU9ic2VydmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDb2xsZWN0aW9uKF9yZWYpIHtcbiAgdmFyIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbixcbiAgICBvbkJhdGNoUmVzaXplID0gX3JlZi5vbkJhdGNoUmVzaXplO1xuICB2YXIgcmVzaXplSWRSZWYgPSBSZWFjdC51c2VSZWYoMCk7XG4gIHZhciByZXNpemVJbmZvc1JlZiA9IFJlYWN0LnVzZVJlZihbXSk7XG4gIHZhciBvbkNvbGxlY3Rpb25SZXNpemUgPSBSZWFjdC51c2VDb250ZXh0KENvbGxlY3Rpb25Db250ZXh0KTtcbiAgdmFyIG9uUmVzaXplID0gUmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKHNpemUsIGVsZW1lbnQsIGRhdGEpIHtcbiAgICByZXNpemVJZFJlZi5jdXJyZW50ICs9IDE7XG4gICAgdmFyIGN1cnJlbnRJZCA9IHJlc2l6ZUlkUmVmLmN1cnJlbnQ7XG4gICAgcmVzaXplSW5mb3NSZWYuY3VycmVudC5wdXNoKHtcbiAgICAgIHNpemU6IHNpemUsXG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGN1cnJlbnRJZCA9PT0gcmVzaXplSWRSZWYuY3VycmVudCkge1xuICAgICAgICBvbkJhdGNoUmVzaXplID09PSBudWxsIHx8IG9uQmF0Y2hSZXNpemUgPT09IHZvaWQgMCB8fCBvbkJhdGNoUmVzaXplKHJlc2l6ZUluZm9zUmVmLmN1cnJlbnQpO1xuICAgICAgICByZXNpemVJbmZvc1JlZi5jdXJyZW50ID0gW107XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDb250aW51ZSBidWJibGluZyBpZiBwYXJlbnQgZXhpc3RcbiAgICBvbkNvbGxlY3Rpb25SZXNpemUgPT09IG51bGwgfHwgb25Db2xsZWN0aW9uUmVzaXplID09PSB2b2lkIDAgfHwgb25Db2xsZWN0aW9uUmVzaXplKHNpemUsIGVsZW1lbnQsIGRhdGEpO1xuICB9LCBbb25CYXRjaFJlc2l6ZSwgb25Db2xsZWN0aW9uUmVzaXplXSk7XG4gIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChDb2xsZWN0aW9uQ29udGV4dC5Qcm92aWRlciwge1xuICAgIHZhbHVlOiBvblJlc2l6ZVxuICB9LCBjaGlsZHJlbik7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rc-resize-observer/es/Collection.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/rc-resize-observer/es/SingleObserver/DomWrapper.js":
/*!*************************************************************************!*\
  !*** ./node_modules/rc-resize-observer/es/SingleObserver/DomWrapper.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DomWrapper)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/inherits.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createSuper */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/createSuper.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\n/**\n * Fallback to findDOMNode if origin ref do not provide any dom element\n */\nvar DomWrapper = /*#__PURE__*/function (_React$Component) {\n  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(DomWrapper, _React$Component);\n  var _super = (0,_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(DomWrapper);\n  function DomWrapper() {\n    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, DomWrapper);\n    return _super.apply(this, arguments);\n  }\n  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(DomWrapper, [{\n    key: \"render\",\n    value: function render() {\n      return this.props.children;\n    }\n  }]);\n  return DomWrapper;\n}(react__WEBPACK_IMPORTED_MODULE_4__.Component);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL1NpbmdsZU9ic2VydmVyL0RvbVdyYXBwZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUF3RTtBQUNOO0FBQ047QUFDTTtBQUNuQztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsK0VBQVM7QUFDWCxlQUFlLGtGQUFZO0FBQzNCO0FBQ0EsSUFBSSxxRkFBZTtBQUNuQjtBQUNBO0FBQ0EsRUFBRSxrRkFBWTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsQ0FBQyxDQUFDLDRDQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL1NpbmdsZU9ic2VydmVyL0RvbVdyYXBwZXIuanM/NGZlOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX2NsYXNzQ2FsbENoZWNrIGZyb20gXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9jbGFzc0NhbGxDaGVja1wiO1xuaW1wb3J0IF9jcmVhdGVDbGFzcyBmcm9tIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY3JlYXRlQ2xhc3NcIjtcbmltcG9ydCBfaW5oZXJpdHMgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2luaGVyaXRzXCI7XG5pbXBvcnQgX2NyZWF0ZVN1cGVyIGZyb20gXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9jcmVhdGVTdXBlclwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuLyoqXG4gKiBGYWxsYmFjayB0byBmaW5kRE9NTm9kZSBpZiBvcmlnaW4gcmVmIGRvIG5vdCBwcm92aWRlIGFueSBkb20gZWxlbWVudFxuICovXG52YXIgRG9tV3JhcHBlciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoRG9tV3JhcHBlciwgX1JlYWN0JENvbXBvbmVudCk7XG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoRG9tV3JhcHBlcik7XG4gIGZ1bmN0aW9uIERvbVdyYXBwZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERvbVdyYXBwZXIpO1xuICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuICBfY3JlYXRlQ2xhc3MoRG9tV3JhcHBlciwgW3tcbiAgICBrZXk6IFwicmVuZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gRG9tV3JhcHBlcjtcbn0oUmVhY3QuQ29tcG9uZW50KTtcbmV4cG9ydCB7IERvbVdyYXBwZXIgYXMgZGVmYXVsdCB9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rc-resize-observer/es/SingleObserver/DomWrapper.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/rc-resize-observer/es/SingleObserver/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/rc-resize-observer/es/SingleObserver/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/typeof.js\");\n/* harmony import */ var rc_util_es_Dom_findDOMNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rc-util/es/Dom/findDOMNode */ \"(ssr)/./node_modules/rc-util/es/Dom/findDOMNode.js\");\n/* harmony import */ var rc_util_es_ref__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-util/es/ref */ \"(ssr)/./node_modules/rc-util/es/ref.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _Collection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Collection */ \"(ssr)/./node_modules/rc-resize-observer/es/Collection.js\");\n/* harmony import */ var _utils_observerUtil__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/observerUtil */ \"(ssr)/./node_modules/rc-resize-observer/es/utils/observerUtil.js\");\n/* harmony import */ var _DomWrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DomWrapper */ \"(ssr)/./node_modules/rc-resize-observer/es/SingleObserver/DomWrapper.js\");\n\n\n\n\n\n\n\n\nfunction SingleObserver(props, ref) {\n  var children = props.children,\n    disabled = props.disabled;\n  var elementRef = react__WEBPACK_IMPORTED_MODULE_4__.useRef(null);\n  var wrapperRef = react__WEBPACK_IMPORTED_MODULE_4__.useRef(null);\n  var onCollectionResize = react__WEBPACK_IMPORTED_MODULE_4__.useContext(_Collection__WEBPACK_IMPORTED_MODULE_5__.CollectionContext);\n\n  // =========================== Children ===========================\n  var isRenderProps = typeof children === 'function';\n  var mergedChildren = isRenderProps ? children(elementRef) : children;\n\n  // ============================= Size =============================\n  var sizeRef = react__WEBPACK_IMPORTED_MODULE_4__.useRef({\n    width: -1,\n    height: -1,\n    offsetWidth: -1,\n    offsetHeight: -1\n  });\n\n  // ============================= Ref ==============================\n  var canRef = !isRenderProps && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.isValidElement(mergedChildren) && (0,rc_util_es_ref__WEBPACK_IMPORTED_MODULE_3__.supportRef)(mergedChildren);\n  var originRef = canRef ? mergedChildren.ref : null;\n  var mergedRef = (0,rc_util_es_ref__WEBPACK_IMPORTED_MODULE_3__.useComposeRef)(originRef, elementRef);\n  var getDom = function getDom() {\n    var _elementRef$current;\n    return (0,rc_util_es_Dom_findDOMNode__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(elementRef.current) || (\n    // Support `nativeElement` format\n    elementRef.current && (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(elementRef.current) === 'object' ? (0,rc_util_es_Dom_findDOMNode__WEBPACK_IMPORTED_MODULE_2__[\"default\"])((_elementRef$current = elementRef.current) === null || _elementRef$current === void 0 ? void 0 : _elementRef$current.nativeElement) : null) || (0,rc_util_es_Dom_findDOMNode__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(wrapperRef.current);\n  };\n  react__WEBPACK_IMPORTED_MODULE_4__.useImperativeHandle(ref, function () {\n    return getDom();\n  });\n\n  // =========================== Observe ============================\n  var propsRef = react__WEBPACK_IMPORTED_MODULE_4__.useRef(props);\n  propsRef.current = props;\n\n  // Handler\n  var onInternalResize = react__WEBPACK_IMPORTED_MODULE_4__.useCallback(function (target) {\n    var _propsRef$current = propsRef.current,\n      onResize = _propsRef$current.onResize,\n      data = _propsRef$current.data;\n    var _target$getBoundingCl = target.getBoundingClientRect(),\n      width = _target$getBoundingCl.width,\n      height = _target$getBoundingCl.height;\n    var offsetWidth = target.offsetWidth,\n      offsetHeight = target.offsetHeight;\n\n    /**\n     * Resize observer trigger when content size changed.\n     * In most case we just care about element size,\n     * let's use `boundary` instead of `contentRect` here to avoid shaking.\n     */\n    var fixedWidth = Math.floor(width);\n    var fixedHeight = Math.floor(height);\n    if (sizeRef.current.width !== fixedWidth || sizeRef.current.height !== fixedHeight || sizeRef.current.offsetWidth !== offsetWidth || sizeRef.current.offsetHeight !== offsetHeight) {\n      var size = {\n        width: fixedWidth,\n        height: fixedHeight,\n        offsetWidth: offsetWidth,\n        offsetHeight: offsetHeight\n      };\n      sizeRef.current = size;\n\n      // IE is strange, right?\n      var mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;\n      var mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;\n      var sizeInfo = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__[\"default\"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, size), {}, {\n        offsetWidth: mergedOffsetWidth,\n        offsetHeight: mergedOffsetHeight\n      });\n\n      // Let collection know what happened\n      onCollectionResize === null || onCollectionResize === void 0 || onCollectionResize(sizeInfo, target, data);\n      if (onResize) {\n        // defer the callback but not defer to next frame\n        Promise.resolve().then(function () {\n          onResize(sizeInfo, target);\n        });\n      }\n    }\n  }, []);\n\n  // Dynamic observe\n  react__WEBPACK_IMPORTED_MODULE_4__.useEffect(function () {\n    var currentElement = getDom();\n    if (currentElement && !disabled) {\n      (0,_utils_observerUtil__WEBPACK_IMPORTED_MODULE_6__.observe)(currentElement, onInternalResize);\n    }\n    return function () {\n      return (0,_utils_observerUtil__WEBPACK_IMPORTED_MODULE_6__.unobserve)(currentElement, onInternalResize);\n    };\n  }, [elementRef.current, disabled]);\n\n  // ============================ Render ============================\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(_DomWrapper__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n    ref: wrapperRef\n  }, canRef ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.cloneElement(mergedChildren, {\n    ref: mergedRef\n  }) : mergedChildren);\n}\nvar RefSingleObserver = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.forwardRef(SingleObserver);\nif (true) {\n  RefSingleObserver.displayName = 'SingleObserver';\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RefSingleObserver);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL1NpbmdsZU9ic2VydmVyL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBcUU7QUFDYjtBQUNIO0FBQ007QUFDNUI7QUFDbUI7QUFDUztBQUNyQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxtQkFBbUIseUNBQVk7QUFDL0IsbUJBQW1CLHlDQUFZO0FBQy9CLDJCQUEyQiw2Q0FBZ0IsQ0FBQywwREFBaUI7O0FBRTdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQix5Q0FBWTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSw4Q0FBOEMsaURBQW9CLG9CQUFvQiwwREFBVTtBQUNoRztBQUNBLGtCQUFrQiw2REFBYTtBQUMvQjtBQUNBO0FBQ0EsV0FBVyxzRUFBVztBQUN0QjtBQUNBLDBCQUEwQiw2RUFBTyxvQ0FBb0Msc0VBQVcsZ0pBQWdKLHNFQUFXO0FBQzNPO0FBQ0EsRUFBRSxzREFBeUI7QUFDM0I7QUFDQSxHQUFHOztBQUVIO0FBQ0EsaUJBQWlCLHlDQUFZO0FBQzdCOztBQUVBO0FBQ0EseUJBQXlCLDhDQUFpQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsb0ZBQWEsQ0FBQyxvRkFBYSxHQUFHLFdBQVc7QUFDOUQ7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsRUFBRSw0Q0FBZTtBQUNqQjtBQUNBO0FBQ0EsTUFBTSw0REFBTztBQUNiO0FBQ0E7QUFDQSxhQUFhLDhEQUFTO0FBQ3RCO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLHNCQUFzQixnREFBbUIsQ0FBQyxtREFBVTtBQUNwRDtBQUNBLEdBQUcsd0JBQXdCLCtDQUFrQjtBQUM3QztBQUNBLEdBQUc7QUFDSDtBQUNBLHFDQUFxQyw2Q0FBZ0I7QUFDckQsSUFBSSxJQUFxQztBQUN6QztBQUNBO0FBQ0EsaUVBQWUsaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL1NpbmdsZU9ic2VydmVyL2luZGV4LmpzP2E1MTQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9vYmplY3RTcHJlYWQgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFNwcmVhZDJcIjtcbmltcG9ydCBfdHlwZW9mIGZyb20gXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS90eXBlb2ZcIjtcbmltcG9ydCBmaW5kRE9NTm9kZSBmcm9tIFwicmMtdXRpbC9lcy9Eb20vZmluZERPTU5vZGVcIjtcbmltcG9ydCB7IHN1cHBvcnRSZWYsIHVzZUNvbXBvc2VSZWYgfSBmcm9tIFwicmMtdXRpbC9lcy9yZWZcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IENvbGxlY3Rpb25Db250ZXh0IH0gZnJvbSBcIi4uL0NvbGxlY3Rpb25cIjtcbmltcG9ydCB7IG9ic2VydmUsIHVub2JzZXJ2ZSB9IGZyb20gXCIuLi91dGlscy9vYnNlcnZlclV0aWxcIjtcbmltcG9ydCBEb21XcmFwcGVyIGZyb20gXCIuL0RvbVdyYXBwZXJcIjtcbmZ1bmN0aW9uIFNpbmdsZU9ic2VydmVyKHByb3BzLCByZWYpIHtcbiAgdmFyIGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW4sXG4gICAgZGlzYWJsZWQgPSBwcm9wcy5kaXNhYmxlZDtcbiAgdmFyIGVsZW1lbnRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIHZhciB3cmFwcGVyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICB2YXIgb25Db2xsZWN0aW9uUmVzaXplID0gUmVhY3QudXNlQ29udGV4dChDb2xsZWN0aW9uQ29udGV4dCk7XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09IENoaWxkcmVuID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgaXNSZW5kZXJQcm9wcyA9IHR5cGVvZiBjaGlsZHJlbiA9PT0gJ2Z1bmN0aW9uJztcbiAgdmFyIG1lcmdlZENoaWxkcmVuID0gaXNSZW5kZXJQcm9wcyA/IGNoaWxkcmVuKGVsZW1lbnRSZWYpIDogY2hpbGRyZW47XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gU2l6ZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgc2l6ZVJlZiA9IFJlYWN0LnVzZVJlZih7XG4gICAgd2lkdGg6IC0xLFxuICAgIGhlaWdodDogLTEsXG4gICAgb2Zmc2V0V2lkdGg6IC0xLFxuICAgIG9mZnNldEhlaWdodDogLTFcbiAgfSk7XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gUmVmID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgY2FuUmVmID0gIWlzUmVuZGVyUHJvcHMgJiYgLyojX19QVVJFX18qL1JlYWN0LmlzVmFsaWRFbGVtZW50KG1lcmdlZENoaWxkcmVuKSAmJiBzdXBwb3J0UmVmKG1lcmdlZENoaWxkcmVuKTtcbiAgdmFyIG9yaWdpblJlZiA9IGNhblJlZiA/IG1lcmdlZENoaWxkcmVuLnJlZiA6IG51bGw7XG4gIHZhciBtZXJnZWRSZWYgPSB1c2VDb21wb3NlUmVmKG9yaWdpblJlZiwgZWxlbWVudFJlZik7XG4gIHZhciBnZXREb20gPSBmdW5jdGlvbiBnZXREb20oKSB7XG4gICAgdmFyIF9lbGVtZW50UmVmJGN1cnJlbnQ7XG4gICAgcmV0dXJuIGZpbmRET01Ob2RlKGVsZW1lbnRSZWYuY3VycmVudCkgfHwgKFxuICAgIC8vIFN1cHBvcnQgYG5hdGl2ZUVsZW1lbnRgIGZvcm1hdFxuICAgIGVsZW1lbnRSZWYuY3VycmVudCAmJiBfdHlwZW9mKGVsZW1lbnRSZWYuY3VycmVudCkgPT09ICdvYmplY3QnID8gZmluZERPTU5vZGUoKF9lbGVtZW50UmVmJGN1cnJlbnQgPSBlbGVtZW50UmVmLmN1cnJlbnQpID09PSBudWxsIHx8IF9lbGVtZW50UmVmJGN1cnJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lbGVtZW50UmVmJGN1cnJlbnQubmF0aXZlRWxlbWVudCkgOiBudWxsKSB8fCBmaW5kRE9NTm9kZSh3cmFwcGVyUmVmLmN1cnJlbnQpO1xuICB9O1xuICBSZWFjdC51c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZXREb20oKTtcbiAgfSk7XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09IE9ic2VydmUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgcHJvcHNSZWYgPSBSZWFjdC51c2VSZWYocHJvcHMpO1xuICBwcm9wc1JlZi5jdXJyZW50ID0gcHJvcHM7XG5cbiAgLy8gSGFuZGxlclxuICB2YXIgb25JbnRlcm5hbFJlc2l6ZSA9IFJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgX3Byb3BzUmVmJGN1cnJlbnQgPSBwcm9wc1JlZi5jdXJyZW50LFxuICAgICAgb25SZXNpemUgPSBfcHJvcHNSZWYkY3VycmVudC5vblJlc2l6ZSxcbiAgICAgIGRhdGEgPSBfcHJvcHNSZWYkY3VycmVudC5kYXRhO1xuICAgIHZhciBfdGFyZ2V0JGdldEJvdW5kaW5nQ2wgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICB3aWR0aCA9IF90YXJnZXQkZ2V0Qm91bmRpbmdDbC53aWR0aCxcbiAgICAgIGhlaWdodCA9IF90YXJnZXQkZ2V0Qm91bmRpbmdDbC5oZWlnaHQ7XG4gICAgdmFyIG9mZnNldFdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoLFxuICAgICAgb2Zmc2V0SGVpZ2h0ID0gdGFyZ2V0Lm9mZnNldEhlaWdodDtcblxuICAgIC8qKlxuICAgICAqIFJlc2l6ZSBvYnNlcnZlciB0cmlnZ2VyIHdoZW4gY29udGVudCBzaXplIGNoYW5nZWQuXG4gICAgICogSW4gbW9zdCBjYXNlIHdlIGp1c3QgY2FyZSBhYm91dCBlbGVtZW50IHNpemUsXG4gICAgICogbGV0J3MgdXNlIGBib3VuZGFyeWAgaW5zdGVhZCBvZiBgY29udGVudFJlY3RgIGhlcmUgdG8gYXZvaWQgc2hha2luZy5cbiAgICAgKi9cbiAgICB2YXIgZml4ZWRXaWR0aCA9IE1hdGguZmxvb3Iod2lkdGgpO1xuICAgIHZhciBmaXhlZEhlaWdodCA9IE1hdGguZmxvb3IoaGVpZ2h0KTtcbiAgICBpZiAoc2l6ZVJlZi5jdXJyZW50LndpZHRoICE9PSBmaXhlZFdpZHRoIHx8IHNpemVSZWYuY3VycmVudC5oZWlnaHQgIT09IGZpeGVkSGVpZ2h0IHx8IHNpemVSZWYuY3VycmVudC5vZmZzZXRXaWR0aCAhPT0gb2Zmc2V0V2lkdGggfHwgc2l6ZVJlZi5jdXJyZW50Lm9mZnNldEhlaWdodCAhPT0gb2Zmc2V0SGVpZ2h0KSB7XG4gICAgICB2YXIgc2l6ZSA9IHtcbiAgICAgICAgd2lkdGg6IGZpeGVkV2lkdGgsXG4gICAgICAgIGhlaWdodDogZml4ZWRIZWlnaHQsXG4gICAgICAgIG9mZnNldFdpZHRoOiBvZmZzZXRXaWR0aCxcbiAgICAgICAgb2Zmc2V0SGVpZ2h0OiBvZmZzZXRIZWlnaHRcbiAgICAgIH07XG4gICAgICBzaXplUmVmLmN1cnJlbnQgPSBzaXplO1xuXG4gICAgICAvLyBJRSBpcyBzdHJhbmdlLCByaWdodD9cbiAgICAgIHZhciBtZXJnZWRPZmZzZXRXaWR0aCA9IG9mZnNldFdpZHRoID09PSBNYXRoLnJvdW5kKHdpZHRoKSA/IHdpZHRoIDogb2Zmc2V0V2lkdGg7XG4gICAgICB2YXIgbWVyZ2VkT2Zmc2V0SGVpZ2h0ID0gb2Zmc2V0SGVpZ2h0ID09PSBNYXRoLnJvdW5kKGhlaWdodCkgPyBoZWlnaHQgOiBvZmZzZXRIZWlnaHQ7XG4gICAgICB2YXIgc2l6ZUluZm8gPSBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHNpemUpLCB7fSwge1xuICAgICAgICBvZmZzZXRXaWR0aDogbWVyZ2VkT2Zmc2V0V2lkdGgsXG4gICAgICAgIG9mZnNldEhlaWdodDogbWVyZ2VkT2Zmc2V0SGVpZ2h0XG4gICAgICB9KTtcblxuICAgICAgLy8gTGV0IGNvbGxlY3Rpb24ga25vdyB3aGF0IGhhcHBlbmVkXG4gICAgICBvbkNvbGxlY3Rpb25SZXNpemUgPT09IG51bGwgfHwgb25Db2xsZWN0aW9uUmVzaXplID09PSB2b2lkIDAgfHwgb25Db2xsZWN0aW9uUmVzaXplKHNpemVJbmZvLCB0YXJnZXQsIGRhdGEpO1xuICAgICAgaWYgKG9uUmVzaXplKSB7XG4gICAgICAgIC8vIGRlZmVyIHRoZSBjYWxsYmFjayBidXQgbm90IGRlZmVyIHRvIG5leHQgZnJhbWVcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgb25SZXNpemUoc2l6ZUluZm8sIHRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW10pO1xuXG4gIC8vIER5bmFtaWMgb2JzZXJ2ZVxuICBSZWFjdC51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50RWxlbWVudCA9IGdldERvbSgpO1xuICAgIGlmIChjdXJyZW50RWxlbWVudCAmJiAhZGlzYWJsZWQpIHtcbiAgICAgIG9ic2VydmUoY3VycmVudEVsZW1lbnQsIG9uSW50ZXJuYWxSZXNpemUpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHVub2JzZXJ2ZShjdXJyZW50RWxlbWVudCwgb25JbnRlcm5hbFJlc2l6ZSk7XG4gICAgfTtcbiAgfSwgW2VsZW1lbnRSZWYuY3VycmVudCwgZGlzYWJsZWRdKTtcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09IFJlbmRlciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChEb21XcmFwcGVyLCB7XG4gICAgcmVmOiB3cmFwcGVyUmVmXG4gIH0sIGNhblJlZiA/IC8qI19fUFVSRV9fKi9SZWFjdC5jbG9uZUVsZW1lbnQobWVyZ2VkQ2hpbGRyZW4sIHtcbiAgICByZWY6IG1lcmdlZFJlZlxuICB9KSA6IG1lcmdlZENoaWxkcmVuKTtcbn1cbnZhciBSZWZTaW5nbGVPYnNlcnZlciA9IC8qI19fUFVSRV9fKi9SZWFjdC5mb3J3YXJkUmVmKFNpbmdsZU9ic2VydmVyKTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIFJlZlNpbmdsZU9ic2VydmVyLmRpc3BsYXlOYW1lID0gJ1NpbmdsZU9ic2VydmVyJztcbn1cbmV4cG9ydCBkZWZhdWx0IFJlZlNpbmdsZU9ic2VydmVyOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rc-resize-observer/es/SingleObserver/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/rc-resize-observer/es/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/rc-resize-observer/es/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   _rs: () => (/* reexport safe */ _utils_observerUtil__WEBPACK_IMPORTED_MODULE_6__._rs),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ \"(ssr)/./node_modules/@babel/runtime/helpers/esm/extends.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var rc_util_es_Children_toArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rc-util/es/Children/toArray */ \"(ssr)/./node_modules/rc-util/es/Children/toArray.js\");\n/* harmony import */ var rc_util_es_warning__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-util/es/warning */ \"(ssr)/./node_modules/rc-util/es/warning.js\");\n/* harmony import */ var _SingleObserver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SingleObserver */ \"(ssr)/./node_modules/rc-resize-observer/es/SingleObserver/index.js\");\n/* harmony import */ var _Collection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Collection */ \"(ssr)/./node_modules/rc-resize-observer/es/Collection.js\");\n/* harmony import */ var _utils_observerUtil__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/observerUtil */ \"(ssr)/./node_modules/rc-resize-observer/es/utils/observerUtil.js\");\n\n\n\n\n\n\nvar INTERNAL_PREFIX_KEY = 'rc-observer-key';\n\n\nfunction ResizeObserver(props, ref) {\n  var children = props.children;\n  var childNodes = typeof children === 'function' ? [children] : (0,rc_util_es_Children_toArray__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(children);\n  if (true) {\n    if (childNodes.length > 1) {\n      (0,rc_util_es_warning__WEBPACK_IMPORTED_MODULE_3__.warning)(false, 'Find more than one child node with `children` in ResizeObserver. Please use ResizeObserver.Collection instead.');\n    } else if (childNodes.length === 0) {\n      (0,rc_util_es_warning__WEBPACK_IMPORTED_MODULE_3__.warning)(false, '`children` of ResizeObserver is empty. Nothing is in observe.');\n    }\n  }\n  return childNodes.map(function (child, index) {\n    var key = (child === null || child === void 0 ? void 0 : child.key) || \"\".concat(INTERNAL_PREFIX_KEY, \"-\").concat(index);\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_SingleObserver__WEBPACK_IMPORTED_MODULE_4__[\"default\"], (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({}, props, {\n      key: key,\n      ref: index === 0 ? ref : undefined\n    }), child);\n  });\n}\nvar RefResizeObserver = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(ResizeObserver);\nif (true) {\n  RefResizeObserver.displayName = 'ResizeObserver';\n}\nRefResizeObserver.Collection = _Collection__WEBPACK_IMPORTED_MODULE_5__.Collection;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RefResizeObserver);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBMEQ7QUFDM0I7QUFDbUI7QUFDTDtBQUNDO0FBQ0o7QUFDMUM7QUFDMkM7QUFFckM7QUFDTjtBQUNBO0FBQ0EsaUVBQWlFLHVFQUFPO0FBQ3hFLE1BQU0sSUFBcUM7QUFDM0M7QUFDQSxNQUFNLDJEQUFPO0FBQ2IsTUFBTTtBQUNOLE1BQU0sMkRBQU87QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnREFBbUIsQ0FBQyx1REFBYyxFQUFFLDhFQUFRLEdBQUc7QUFDdkU7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxxQ0FBcUMsNkNBQWdCO0FBQ3JELElBQUksSUFBcUM7QUFDekM7QUFDQTtBQUNBLCtCQUErQixtREFBVTtBQUN6QyxpRUFBZSxpQkFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcm9udGVuZC8uL25vZGVfbW9kdWxlcy9yYy1yZXNpemUtb2JzZXJ2ZXIvZXMvaW5kZXguanM/OTlmYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX2V4dGVuZHMgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHNcIjtcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0b0FycmF5IGZyb20gXCJyYy11dGlsL2VzL0NoaWxkcmVuL3RvQXJyYXlcIjtcbmltcG9ydCB7IHdhcm5pbmcgfSBmcm9tIFwicmMtdXRpbC9lcy93YXJuaW5nXCI7XG5pbXBvcnQgU2luZ2xlT2JzZXJ2ZXIgZnJvbSBcIi4vU2luZ2xlT2JzZXJ2ZXJcIjtcbmltcG9ydCB7IENvbGxlY3Rpb24gfSBmcm9tIFwiLi9Db2xsZWN0aW9uXCI7XG52YXIgSU5URVJOQUxfUFJFRklYX0tFWSA9ICdyYy1vYnNlcnZlci1rZXknO1xuaW1wb3J0IHsgX3JzIH0gZnJvbSBcIi4vdXRpbHMvb2JzZXJ2ZXJVdGlsXCI7XG5leHBvcnQgeyAvKiogQHByaXZhdGUgVGVzdCBvbmx5IGZvciBtb2NrIHRyaWdnZXIgcmVzaXplIGV2ZW50ICovXG5fcnMgfTtcbmZ1bmN0aW9uIFJlc2l6ZU9ic2VydmVyKHByb3BzLCByZWYpIHtcbiAgdmFyIGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG4gIHZhciBjaGlsZE5vZGVzID0gdHlwZW9mIGNoaWxkcmVuID09PSAnZnVuY3Rpb24nID8gW2NoaWxkcmVuXSA6IHRvQXJyYXkoY2hpbGRyZW4pO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHdhcm5pbmcoZmFsc2UsICdGaW5kIG1vcmUgdGhhbiBvbmUgY2hpbGQgbm9kZSB3aXRoIGBjaGlsZHJlbmAgaW4gUmVzaXplT2JzZXJ2ZXIuIFBsZWFzZSB1c2UgUmVzaXplT2JzZXJ2ZXIuQ29sbGVjdGlvbiBpbnN0ZWFkLicpO1xuICAgIH0gZWxzZSBpZiAoY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHdhcm5pbmcoZmFsc2UsICdgY2hpbGRyZW5gIG9mIFJlc2l6ZU9ic2VydmVyIGlzIGVtcHR5LiBOb3RoaW5nIGlzIGluIG9ic2VydmUuJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjaGlsZE5vZGVzLm1hcChmdW5jdGlvbiAoY2hpbGQsIGluZGV4KSB7XG4gICAgdmFyIGtleSA9IChjaGlsZCA9PT0gbnVsbCB8fCBjaGlsZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2hpbGQua2V5KSB8fCBcIlwiLmNvbmNhdChJTlRFUk5BTF9QUkVGSVhfS0VZLCBcIi1cIikuY29uY2F0KGluZGV4KTtcbiAgICByZXR1cm4gLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlT2JzZXJ2ZXIsIF9leHRlbmRzKHt9LCBwcm9wcywge1xuICAgICAga2V5OiBrZXksXG4gICAgICByZWY6IGluZGV4ID09PSAwID8gcmVmIDogdW5kZWZpbmVkXG4gICAgfSksIGNoaWxkKTtcbiAgfSk7XG59XG52YXIgUmVmUmVzaXplT2JzZXJ2ZXIgPSAvKiNfX1BVUkVfXyovUmVhY3QuZm9yd2FyZFJlZihSZXNpemVPYnNlcnZlcik7XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBSZWZSZXNpemVPYnNlcnZlci5kaXNwbGF5TmFtZSA9ICdSZXNpemVPYnNlcnZlcic7XG59XG5SZWZSZXNpemVPYnNlcnZlci5Db2xsZWN0aW9uID0gQ29sbGVjdGlvbjtcbmV4cG9ydCBkZWZhdWx0IFJlZlJlc2l6ZU9ic2VydmVyOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rc-resize-observer/es/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/rc-resize-observer/es/utils/observerUtil.js":
/*!******************************************************************!*\
  !*** ./node_modules/rc-resize-observer/es/utils/observerUtil.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   _el: () => (/* binding */ _el),\n/* harmony export */   _rs: () => (/* binding */ _rs),\n/* harmony export */   observe: () => (/* binding */ observe),\n/* harmony export */   unobserve: () => (/* binding */ unobserve)\n/* harmony export */ });\n/* harmony import */ var resize_observer_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! resize-observer-polyfill */ \"(ssr)/./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js\");\n\n// =============================== Const ===============================\nvar elementListeners = new Map();\nfunction onResize(entities) {\n  entities.forEach(function (entity) {\n    var _elementListeners$get;\n    var target = entity.target;\n    (_elementListeners$get = elementListeners.get(target)) === null || _elementListeners$get === void 0 || _elementListeners$get.forEach(function (listener) {\n      return listener(target);\n    });\n  });\n}\n\n// Note: ResizeObserver polyfill not support option to measure border-box resize\nvar resizeObserver = new resize_observer_polyfill__WEBPACK_IMPORTED_MODULE_0__[\"default\"](onResize);\n\n// Dev env only\nvar _el =  true ? elementListeners : 0; // eslint-disable-line\nvar _rs =  true ? onResize : 0; // eslint-disable-line\n\n// ============================== Observe ==============================\nfunction observe(element, callback) {\n  if (!elementListeners.has(element)) {\n    elementListeners.set(element, new Set());\n    resizeObserver.observe(element);\n  }\n  elementListeners.get(element).add(callback);\n}\nfunction unobserve(element, callback) {\n  if (elementListeners.has(element)) {\n    elementListeners.get(element).delete(callback);\n    if (!elementListeners.get(element).size) {\n      resizeObserver.unobserve(element);\n      elementListeners.delete(element);\n    }\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmMtcmVzaXplLW9ic2VydmVyL2VzL3V0aWxzL29ic2VydmVyVXRpbC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBLHlCQUF5QixnRUFBYzs7QUFFdkM7QUFDTyxVQUFVLEtBQXFDLHNCQUFzQixDQUFJLEVBQUU7QUFDM0UsVUFBVSxLQUFxQyxjQUFjLENBQUksRUFBRTs7QUFFMUU7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Zyb250ZW5kLy4vbm9kZV9tb2R1bGVzL3JjLXJlc2l6ZS1vYnNlcnZlci9lcy91dGlscy9vYnNlcnZlclV0aWwuanM/MTNjOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzaXplT2JzZXJ2ZXIgZnJvbSAncmVzaXplLW9ic2VydmVyLXBvbHlmaWxsJztcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gQ29uc3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxudmFyIGVsZW1lbnRMaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBvblJlc2l6ZShlbnRpdGllcykge1xuICBlbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICB2YXIgX2VsZW1lbnRMaXN0ZW5lcnMkZ2V0O1xuICAgIHZhciB0YXJnZXQgPSBlbnRpdHkudGFyZ2V0O1xuICAgIChfZWxlbWVudExpc3RlbmVycyRnZXQgPSBlbGVtZW50TGlzdGVuZXJzLmdldCh0YXJnZXQpKSA9PT0gbnVsbCB8fCBfZWxlbWVudExpc3RlbmVycyRnZXQgPT09IHZvaWQgMCB8fCBfZWxlbWVudExpc3RlbmVycyRnZXQuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcih0YXJnZXQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gTm90ZTogUmVzaXplT2JzZXJ2ZXIgcG9seWZpbGwgbm90IHN1cHBvcnQgb3B0aW9uIHRvIG1lYXN1cmUgYm9yZGVyLWJveCByZXNpemVcbnZhciByZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihvblJlc2l6ZSk7XG5cbi8vIERldiBlbnYgb25seVxuZXhwb3J0IHZhciBfZWwgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gZWxlbWVudExpc3RlbmVycyA6IG51bGw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbmV4cG9ydCB2YXIgX3JzID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IG9uUmVzaXplIDogbnVsbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gT2JzZXJ2ZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gIGlmICghZWxlbWVudExpc3RlbmVycy5oYXMoZWxlbWVudCkpIHtcbiAgICBlbGVtZW50TGlzdGVuZXJzLnNldChlbGVtZW50LCBuZXcgU2V0KCkpO1xuICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gIH1cbiAgZWxlbWVudExpc3RlbmVycy5nZXQoZWxlbWVudCkuYWRkKGNhbGxiYWNrKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bm9ic2VydmUoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgaWYgKGVsZW1lbnRMaXN0ZW5lcnMuaGFzKGVsZW1lbnQpKSB7XG4gICAgZWxlbWVudExpc3RlbmVycy5nZXQoZWxlbWVudCkuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICBpZiAoIWVsZW1lbnRMaXN0ZW5lcnMuZ2V0KGVsZW1lbnQpLnNpemUpIHtcbiAgICAgIHJlc2l6ZU9ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KTtcbiAgICAgIGVsZW1lbnRMaXN0ZW5lcnMuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rc-resize-observer/es/utils/observerUtil.js\n");

/***/ })

};
;