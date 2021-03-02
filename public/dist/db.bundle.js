/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/db.js":
/*!**********************!*\
  !*** ./public/db.js ***!
  \**********************/
/***/ (() => {

eval("const indexedDB =\n  window.indexedDB ||\n  window.mozIndexedDB ||\n  window.webkitIndexedDB ||\n  window.msIndexedDB ||\n  window.shimIndexedDB;\n\nlet db;\nconst request = indexedDB.open(\"budget\", 1);\n\nrequest.onupgradeneeded = ({ target }) => {\n  let db = target.result;\n  db.createObjectStore(\"pending\", { autoIncrement: true });\n};\n\nrequest.onsuccess = ({ target }) => {\n  db = target.result;\n\n  // check if app is online before reading from db\n  if (navigator.onLine) {\n    checkDatabase();\n  }\n};\n\nrequest.onerror = function(event) {\n  console.log(\"Woops! \" + event.target.errorCode);\n};\n\nfunction saveRecord(record) {\n  const transaction = db.transaction([\"pending\"], \"readwrite\");\n  const store = transaction.objectStore(\"pending\");\n\n  store.add(record);\n}\n\nfunction checkDatabase() {\n  const transaction = db.transaction([\"pending\"], \"readwrite\");\n  const store = transaction.objectStore(\"pending\");\n  const getAll = store.getAll();\n\n  getAll.onsuccess = function() {\n    if (getAll.result.length > 0) {\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      })\n      .then(response => {        \n        return response.json();\n      })\n      .then(() => {\n        // delete records if successful\n        const transaction = db.transaction([\"pending\"], \"readwrite\");\n        const store = transaction.objectStore(\"pending\");\n        store.clear();\n      });\n    }\n  };\n}\n\n// listen for app coming back online\nwindow.addEventListener(\"online\", checkDatabase);\n\n//# sourceURL=webpack://budget-app/./public/db.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/db.js"]();
/******/ 	
/******/ })()
;