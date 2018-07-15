/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/payment-provider.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/payment-provider.js":
/*!*********************************!*\
  !*** ./src/payment-provider.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// register on load\n$(function()\n{\n  // we need to provide the user id to the payment method\n\tredirectToDashboardOnLogout();\n\n  var paypalIdealForm = $(\".paypal-ideal-form\");\n\n  // form that is active on both paypal and ideal page\n  if (hasPaypalIdealForm()) {\n    getPaypalIdealComponent(\".hidden-user-id\").val(getUserId());\n    getPaypalIdealComponent(\".paypal-ideal-submit\").click(function(){\n      var amount = getPaypalIdealComponent(\".paypal-ideal-amount\").val();\n      var url = generatePaypalBunqReceiveUrl(getPaypalIdealType(), amount)\n      window.open(url);\n    });\n  }\n\n  // SEPA & SWIFT\n  $(\"#personal-reference-code\").text(getUserId());\n\n  // determine if this is a paypal or ideal page\n  function getPaypalIdealType() {\n    if (location.pathname.match('dashboard/payment-instructions/paypal')) {\n      return \"paypal\";\n    }\n    else if (location.pathname.match('dashboard/payment-instructions/ideal')) {\n      return \"ideal\";\n    }\n    else {\n      throw \"unsupported payment page!\";\n    }\n  }\n\n  // generate page for bunq or paypal\n  function generatePaypalBunqReceiveUrl(type, amount) {\n    'https://www.' + type + '.me/proofinc/' + amount;\n  }\n\n  function getPaypalIdealComponent(selector) {\n    return paypalIdealForm.find(selector);\n  }\n\n  function hasPaypalIdealForm() {\n    return paypalIdealForm.length > 0;\n  }\n});\n\n\n//# sourceURL=webpack:///./src/payment-provider.js?");

/***/ })

/******/ });