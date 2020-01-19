// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/whatwg-fetch/fetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.fetch = fetch;
exports.DOMException = void 0;
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob: 'FileReader' in self && 'Blob' in self && function () {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  }(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

if (support.arrayBuffer) {
  var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

  var isArrayBufferView = ArrayBuffer.isView || function (obj) {
    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
  };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }

  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name');
  }

  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  return value;
} // Build a destructive iterator for the value list


function iteratorFor(items) {
  var iterator = {
    next: function () {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function (name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

Headers.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};

Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }

  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }

  return chars.join('');
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    this._bodyInit = body;

    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob');
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);

    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
} // HTTP methods whose capitalization should be normalized


var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

function Request(input, options) {
  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read');
    }

    this.url = input.url;
    this.credentials = input.credentials;

    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }

    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;

    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'same-origin';

  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }

  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests');
  }

  this._initBody(body);
}

Request.prototype.clone = function () {
  return new Request(this, {
    body: this._bodyInit
  });
};

function decode(body) {
  var form = new FormData();
  body.trim().split('&').forEach(function (bytes) {
    if (bytes) {
      var split = bytes.split('=');
      var name = split.shift().replace(/\+/g, ' ');
      var value = split.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2

  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
    var parts = line.split(':');
    var key = parts.shift().trim();

    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

Body.call(Request.prototype);

function Response(bodyInit, options) {
  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = 'statusText' in options ? options.statusText : 'OK';
  this.headers = new Headers(options.headers);
  this.url = options.url || '';

  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  });
};

Response.error = function () {
  var response = new Response(null, {
    status: 0,
    statusText: ''
  });
  response.type = 'error';
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code');
  }

  return new Response(null, {
    status: status,
    headers: {
      location: url
    }
  });
};

var DOMException = self.DOMException;
exports.DOMException = DOMException;

try {
  new DOMException();
} catch (err) {
  exports.DOMException = DOMException = function (message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };

  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch(input, init) {
  return new Promise(function (resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function () {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  });
}

fetch.polyfill = true;

if (!self.fetch) {
  self.fetch = fetch;
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;
}
},{}],"node_modules/isomorphic-fetch/fetch-npm-browserify.js":[function(require,module,exports) {
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":"node_modules/whatwg-fetch/fetch.js"}],"node_modules/dropbox/dist/Dropbox-sdk.min.js":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Dropbox=t()}(this,function(){"use strict";function e(){return"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope||"undefined"==typeof module||"undefined"!=typeof window}function t(e){return"https://"+e+".dropboxapi.com/2/"}function r(e){return JSON.stringify(e).replace(/[\u007f-\uffff]/g,function(e){return"\\u"+("000"+e.charCodeAt(0).toString(16)).slice(-4)})}function n(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");return"="===e[t-2]?2:"="===e[t-1]?1:0}var i={};i.authTokenFromOauth1=function(e){return this.request("auth/token/from_oauth1",e,"app","api","rpc")},i.authTokenRevoke=function(e){return this.request("auth/token/revoke",e,"user","api","rpc")},i.contactsDeleteManualContacts=function(e){return this.request("contacts/delete_manual_contacts",e,"user","api","rpc")},i.contactsDeleteManualContactsBatch=function(e){return this.request("contacts/delete_manual_contacts_batch",e,"user","api","rpc")},i.filePropertiesPropertiesAdd=function(e){return this.request("file_properties/properties/add",e,"user","api","rpc")},i.filePropertiesPropertiesOverwrite=function(e){return this.request("file_properties/properties/overwrite",e,"user","api","rpc")},i.filePropertiesPropertiesRemove=function(e){return this.request("file_properties/properties/remove",e,"user","api","rpc")},i.filePropertiesPropertiesSearch=function(e){return this.request("file_properties/properties/search",e,"user","api","rpc")},i.filePropertiesPropertiesSearchContinue=function(e){return this.request("file_properties/properties/search/continue",e,"user","api","rpc")},i.filePropertiesPropertiesUpdate=function(e){return this.request("file_properties/properties/update",e,"user","api","rpc")},i.filePropertiesTemplatesAddForTeam=function(e){return this.request("file_properties/templates/add_for_team",e,"team","api","rpc")},i.filePropertiesTemplatesAddForUser=function(e){return this.request("file_properties/templates/add_for_user",e,"user","api","rpc")},i.filePropertiesTemplatesGetForTeam=function(e){return this.request("file_properties/templates/get_for_team",e,"team","api","rpc")},i.filePropertiesTemplatesGetForUser=function(e){return this.request("file_properties/templates/get_for_user",e,"user","api","rpc")},i.filePropertiesTemplatesListForTeam=function(e){return this.request("file_properties/templates/list_for_team",e,"team","api","rpc")},i.filePropertiesTemplatesListForUser=function(e){return this.request("file_properties/templates/list_for_user",e,"user","api","rpc")},i.filePropertiesTemplatesRemoveForTeam=function(e){return this.request("file_properties/templates/remove_for_team",e,"team","api","rpc")},i.filePropertiesTemplatesRemoveForUser=function(e){return this.request("file_properties/templates/remove_for_user",e,"user","api","rpc")},i.filePropertiesTemplatesUpdateForTeam=function(e){return this.request("file_properties/templates/update_for_team",e,"team","api","rpc")},i.filePropertiesTemplatesUpdateForUser=function(e){return this.request("file_properties/templates/update_for_user",e,"user","api","rpc")},i.fileRequestsCount=function(e){return this.request("file_requests/count",e,"user","api","rpc")},i.fileRequestsCreate=function(e){return this.request("file_requests/create",e,"user","api","rpc")},i.fileRequestsDelete=function(e){return this.request("file_requests/delete",e,"user","api","rpc")},i.fileRequestsDeleteAllClosed=function(e){return this.request("file_requests/delete_all_closed",e,"user","api","rpc")},i.fileRequestsGet=function(e){return this.request("file_requests/get",e,"user","api","rpc")},i.fileRequestsListV2=function(e){return this.request("file_requests/list_v2",e,"user","api","rpc")},i.fileRequestsList=function(e){return this.request("file_requests/list",e,"user","api","rpc")},i.fileRequestsListContinue=function(e){return this.request("file_requests/list/continue",e,"user","api","rpc")},i.fileRequestsUpdate=function(e){return this.request("file_requests/update",e,"user","api","rpc")},i.filesAlphaGetMetadata=function(e){return this.request("files/alpha/get_metadata",e,"user","api","rpc")},i.filesAlphaUpload=function(e){return this.request("files/alpha/upload",e,"user","content","upload")},i.filesCopyV2=function(e){return this.request("files/copy_v2",e,"user","api","rpc")},i.filesCopy=function(e){return this.request("files/copy",e,"user","api","rpc")},i.filesCopyBatchV2=function(e){return this.request("files/copy_batch_v2",e,"user","api","rpc")},i.filesCopyBatch=function(e){return this.request("files/copy_batch",e,"user","api","rpc")},i.filesCopyBatchCheckV2=function(e){return this.request("files/copy_batch/check_v2",e,"user","api","rpc")},i.filesCopyBatchCheck=function(e){return this.request("files/copy_batch/check",e,"user","api","rpc")},i.filesCopyReferenceGet=function(e){return this.request("files/copy_reference/get",e,"user","api","rpc")},i.filesCopyReferenceSave=function(e){return this.request("files/copy_reference/save",e,"user","api","rpc")},i.filesCreateFolderV2=function(e){return this.request("files/create_folder_v2",e,"user","api","rpc")},i.filesCreateFolder=function(e){return this.request("files/create_folder",e,"user","api","rpc")},i.filesCreateFolderBatch=function(e){return this.request("files/create_folder_batch",e,"user","api","rpc")},i.filesCreateFolderBatchCheck=function(e){return this.request("files/create_folder_batch/check",e,"user","api","rpc")},i.filesDeleteV2=function(e){return this.request("files/delete_v2",e,"user","api","rpc")},i.filesDelete=function(e){return this.request("files/delete",e,"user","api","rpc")},i.filesDeleteBatch=function(e){return this.request("files/delete_batch",e,"user","api","rpc")},i.filesDeleteBatchCheck=function(e){return this.request("files/delete_batch/check",e,"user","api","rpc")},i.filesDownload=function(e){return this.request("files/download",e,"user","content","download")},i.filesDownloadZip=function(e){return this.request("files/download_zip",e,"user","content","download")},i.filesExport=function(e){return this.request("files/export",e,"user","content","download")},i.filesGetMetadata=function(e){return this.request("files/get_metadata",e,"user","api","rpc")},i.filesGetPreview=function(e){return this.request("files/get_preview",e,"user","content","download")},i.filesGetTemporaryLink=function(e){return this.request("files/get_temporary_link",e,"user","api","rpc")},i.filesGetTemporaryUploadLink=function(e){return this.request("files/get_temporary_upload_link",e,"user","api","rpc")},i.filesGetThumbnail=function(e){return this.request("files/get_thumbnail",e,"user","content","download")},i.filesGetThumbnailBatch=function(e){return this.request("files/get_thumbnail_batch",e,"user","content","rpc")},i.filesListFolder=function(e){return this.request("files/list_folder",e,"user","api","rpc")},i.filesListFolderContinue=function(e){return this.request("files/list_folder/continue",e,"user","api","rpc")},i.filesListFolderGetLatestCursor=function(e){return this.request("files/list_folder/get_latest_cursor",e,"user","api","rpc")},i.filesListFolderLongpoll=function(e){return this.request("files/list_folder/longpoll",e,"noauth","notify","rpc")},i.filesListRevisions=function(e){return this.request("files/list_revisions",e,"user","api","rpc")},i.filesMoveV2=function(e){return this.request("files/move_v2",e,"user","api","rpc")},i.filesMove=function(e){return this.request("files/move",e,"user","api","rpc")},i.filesMoveBatchV2=function(e){return this.request("files/move_batch_v2",e,"user","api","rpc")},i.filesMoveBatch=function(e){return this.request("files/move_batch",e,"user","api","rpc")},i.filesMoveBatchCheckV2=function(e){return this.request("files/move_batch/check_v2",e,"user","api","rpc")},i.filesMoveBatchCheck=function(e){return this.request("files/move_batch/check",e,"user","api","rpc")},i.filesPermanentlyDelete=function(e){return this.request("files/permanently_delete",e,"user","api","rpc")},i.filesPropertiesAdd=function(e){return this.request("files/properties/add",e,"user","api","rpc")},i.filesPropertiesOverwrite=function(e){return this.request("files/properties/overwrite",e,"user","api","rpc")},i.filesPropertiesRemove=function(e){return this.request("files/properties/remove",e,"user","api","rpc")},i.filesPropertiesTemplateGet=function(e){return this.request("files/properties/template/get",e,"user","api","rpc")},i.filesPropertiesTemplateList=function(e){return this.request("files/properties/template/list",e,"user","api","rpc")},i.filesPropertiesUpdate=function(e){return this.request("files/properties/update",e,"user","api","rpc")},i.filesRestore=function(e){return this.request("files/restore",e,"user","api","rpc")},i.filesSaveUrl=function(e){return this.request("files/save_url",e,"user","api","rpc")},i.filesSaveUrlCheckJobStatus=function(e){return this.request("files/save_url/check_job_status",e,"user","api","rpc")},i.filesSearch=function(e){return this.request("files/search",e,"user","api","rpc")},i.filesUpload=function(e){return this.request("files/upload",e,"user","content","upload")},i.filesUploadSessionAppendV2=function(e){return this.request("files/upload_session/append_v2",e,"user","content","upload")},i.filesUploadSessionAppend=function(e){return this.request("files/upload_session/append",e,"user","content","upload")},i.filesUploadSessionFinish=function(e){return this.request("files/upload_session/finish",e,"user","content","upload")},i.filesUploadSessionFinishBatch=function(e){return this.request("files/upload_session/finish_batch",e,"user","api","rpc")},i.filesUploadSessionFinishBatchCheck=function(e){return this.request("files/upload_session/finish_batch/check",e,"user","api","rpc")},i.filesUploadSessionStart=function(e){return this.request("files/upload_session/start",e,"user","content","upload")},i.paperDocsArchive=function(e){return this.request("paper/docs/archive",e,"user","api","rpc")},i.paperDocsCreate=function(e){return this.request("paper/docs/create",e,"user","api","upload")},i.paperDocsDownload=function(e){return this.request("paper/docs/download",e,"user","api","download")},i.paperDocsFolderUsersList=function(e){return this.request("paper/docs/folder_users/list",e,"user","api","rpc")},i.paperDocsFolderUsersListContinue=function(e){return this.request("paper/docs/folder_users/list/continue",e,"user","api","rpc")},i.paperDocsGetFolderInfo=function(e){return this.request("paper/docs/get_folder_info",e,"user","api","rpc")},i.paperDocsList=function(e){return this.request("paper/docs/list",e,"user","api","rpc")},i.paperDocsListContinue=function(e){return this.request("paper/docs/list/continue",e,"user","api","rpc")},i.paperDocsPermanentlyDelete=function(e){return this.request("paper/docs/permanently_delete",e,"user","api","rpc")},i.paperDocsSharingPolicyGet=function(e){return this.request("paper/docs/sharing_policy/get",e,"user","api","rpc")},i.paperDocsSharingPolicySet=function(e){return this.request("paper/docs/sharing_policy/set",e,"user","api","rpc")},i.paperDocsUpdate=function(e){return this.request("paper/docs/update",e,"user","api","upload")},i.paperDocsUsersAdd=function(e){return this.request("paper/docs/users/add",e,"user","api","rpc")},i.paperDocsUsersList=function(e){return this.request("paper/docs/users/list",e,"user","api","rpc")},i.paperDocsUsersListContinue=function(e){return this.request("paper/docs/users/list/continue",e,"user","api","rpc")},i.paperDocsUsersRemove=function(e){return this.request("paper/docs/users/remove",e,"user","api","rpc")},i.sharingAddFileMember=function(e){return this.request("sharing/add_file_member",e,"user","api","rpc")},i.sharingAddFolderMember=function(e){return this.request("sharing/add_folder_member",e,"user","api","rpc")},i.sharingChangeFileMemberAccess=function(e){return this.request("sharing/change_file_member_access",e,"user","api","rpc")},i.sharingCheckJobStatus=function(e){return this.request("sharing/check_job_status",e,"user","api","rpc")},i.sharingCheckRemoveMemberJobStatus=function(e){return this.request("sharing/check_remove_member_job_status",e,"user","api","rpc")},i.sharingCheckShareJobStatus=function(e){return this.request("sharing/check_share_job_status",e,"user","api","rpc")},i.sharingCreateSharedLink=function(e){return this.request("sharing/create_shared_link",e,"user","api","rpc")},i.sharingCreateSharedLinkWithSettings=function(e){return this.request("sharing/create_shared_link_with_settings",e,"user","api","rpc")},i.sharingGetFileMetadata=function(e){return this.request("sharing/get_file_metadata",e,"user","api","rpc")},i.sharingGetFileMetadataBatch=function(e){return this.request("sharing/get_file_metadata/batch",e,"user","api","rpc")},i.sharingGetFolderMetadata=function(e){return this.request("sharing/get_folder_metadata",e,"user","api","rpc")},i.sharingGetSharedLinkFile=function(e){return this.request("sharing/get_shared_link_file",e,"user","content","download")},i.sharingGetSharedLinkMetadata=function(e){return this.request("sharing/get_shared_link_metadata",e,"user","api","rpc")},i.sharingGetSharedLinks=function(e){return this.request("sharing/get_shared_links",e,"user","api","rpc")},i.sharingListFileMembers=function(e){return this.request("sharing/list_file_members",e,"user","api","rpc")},i.sharingListFileMembersBatch=function(e){return this.request("sharing/list_file_members/batch",e,"user","api","rpc")},i.sharingListFileMembersContinue=function(e){return this.request("sharing/list_file_members/continue",e,"user","api","rpc")},i.sharingListFolderMembers=function(e){return this.request("sharing/list_folder_members",e,"user","api","rpc")},i.sharingListFolderMembersContinue=function(e){return this.request("sharing/list_folder_members/continue",e,"user","api","rpc")},i.sharingListFolders=function(e){return this.request("sharing/list_folders",e,"user","api","rpc")},i.sharingListFoldersContinue=function(e){return this.request("sharing/list_folders/continue",e,"user","api","rpc")},i.sharingListMountableFolders=function(e){return this.request("sharing/list_mountable_folders",e,"user","api","rpc")},i.sharingListMountableFoldersContinue=function(e){return this.request("sharing/list_mountable_folders/continue",e,"user","api","rpc")},i.sharingListReceivedFiles=function(e){return this.request("sharing/list_received_files",e,"user","api","rpc")},i.sharingListReceivedFilesContinue=function(e){return this.request("sharing/list_received_files/continue",e,"user","api","rpc")},i.sharingListSharedLinks=function(e){return this.request("sharing/list_shared_links",e,"user","api","rpc")},i.sharingModifySharedLinkSettings=function(e){return this.request("sharing/modify_shared_link_settings",e,"user","api","rpc")},i.sharingMountFolder=function(e){return this.request("sharing/mount_folder",e,"user","api","rpc")},i.sharingRelinquishFileMembership=function(e){return this.request("sharing/relinquish_file_membership",e,"user","api","rpc")},i.sharingRelinquishFolderMembership=function(e){return this.request("sharing/relinquish_folder_membership",e,"user","api","rpc")},i.sharingRemoveFileMember=function(e){return this.request("sharing/remove_file_member",e,"user","api","rpc")},i.sharingRemoveFileMember2=function(e){return this.request("sharing/remove_file_member_2",e,"user","api","rpc")},i.sharingRemoveFolderMember=function(e){return this.request("sharing/remove_folder_member",e,"user","api","rpc")},i.sharingRevokeSharedLink=function(e){return this.request("sharing/revoke_shared_link",e,"user","api","rpc")},i.sharingSetAccessInheritance=function(e){return this.request("sharing/set_access_inheritance",e,"user","api","rpc")},i.sharingShareFolder=function(e){return this.request("sharing/share_folder",e,"user","api","rpc")},i.sharingTransferFolder=function(e){return this.request("sharing/transfer_folder",e,"user","api","rpc")},i.sharingUnmountFolder=function(e){return this.request("sharing/unmount_folder",e,"user","api","rpc")},i.sharingUnshareFile=function(e){return this.request("sharing/unshare_file",e,"user","api","rpc")},i.sharingUnshareFolder=function(e){return this.request("sharing/unshare_folder",e,"user","api","rpc")},i.sharingUpdateFileMember=function(e){return this.request("sharing/update_file_member",e,"user","api","rpc")},i.sharingUpdateFolderMember=function(e){return this.request("sharing/update_folder_member",e,"user","api","rpc")},i.sharingUpdateFolderPolicy=function(e){return this.request("sharing/update_folder_policy",e,"user","api","rpc")},i.teamLogGetEvents=function(e){return this.request("team_log/get_events",e,"team","api","rpc")},i.teamLogGetEventsContinue=function(e){return this.request("team_log/get_events/continue",e,"team","api","rpc")},i.usersGetAccount=function(e){return this.request("users/get_account",e,"user","api","rpc")},i.usersGetAccountBatch=function(e){return this.request("users/get_account_batch",e,"user","api","rpc")},i.usersGetCurrentAccount=function(e){return this.request("users/get_current_account",e,"user","api","rpc")},i.usersGetSpaceUsage=function(e){return this.request("users/get_space_usage",e,"user","api","rpc")};for(var s=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},o=function(){function e(e,t){for(var r=0;t.length>r;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),u=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},c=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,i=!1,s=void 0;try{for(var o,u=e[Symbol.iterator]();!(n=(o=u.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(e){i=!0,s=e}finally{try{!n&&u.return&&u.return()}finally{if(i)throw s}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),p=function(e){return 3*e.length/4-n(e)},f=function(e){var t,r,i,s,o,u=e.length;s=n(e),o=new d(3*u/4-s),r=s>0?u-4:u;var a=0;for(t=0;r>t;t+=4)i=m[e.charCodeAt(t)]<<18|m[e.charCodeAt(t+1)]<<12|m[e.charCodeAt(t+2)]<<6|m[e.charCodeAt(t+3)],o[a++]=i>>16&255,o[a++]=i>>8&255,o[a++]=255&i;return 2===s?(i=m[e.charCodeAt(t)]<<2|m[e.charCodeAt(t+1)]>>4,o[a++]=255&i):1===s&&(i=m[e.charCodeAt(t)]<<10|m[e.charCodeAt(t+1)]<<4|m[e.charCodeAt(t+2)]>>2,o[a++]=i>>8&255,o[a++]=255&i),o},h=function(e){for(var t,r=e.length,n=r%3,i="",s=[],o=0,u=r-n;u>o;o+=16383)s.push(function(e,t,r){for(var n=[],i=t;r>i;i+=3)n.push(function(e){return l[e>>18&63]+l[e>>12&63]+l[e>>6&63]+l[63&e]}((e[i]<<16)+(e[i+1]<<8)+e[i+2]));return n.join("")}(e,o,o+16383>u?u:o+16383));return 1===n?(i+=l[(t=e[r-1])>>2],i+=l[t<<4&63],i+="=="):2===n&&(i+=l[(t=(e[r-2]<<8)+e[r-1])>>10],i+=l[t>>4&63],i+=l[t<<2&63],i+="="),s.push(i),s.join("")},l=[],m=[],d="undefined"!=typeof Uint8Array?Uint8Array:Array,g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_=0;64>_;++_)l[_]=g[_],m[g.charCodeAt(_)]=_;m[45]=62,m[95]=63;var b={byteLength:p,toByteArray:f,fromByteArray:h},v={read:function(e,t,r,n,i){var s,o,u=8*i-n-1,a=(1<<u)-1,c=a>>1,p=-7,f=r?i-1:0,h=r?-1:1,l=e[t+f];for(f+=h,s=l&(1<<-p)-1,l>>=-p,p+=u;p>0;s=256*s+e[t+f],f+=h,p-=8);for(o=s&(1<<-p)-1,s>>=-p,p+=n;p>0;o=256*o+e[t+f],f+=h,p-=8);if(0===s)s=1-c;else{if(s===a)return o?NaN:1/0*(l?-1:1);o+=Math.pow(2,n),s-=c}return(l?-1:1)*o*Math.pow(2,s-n)},write:function(e,t,r,n,i,s){var o,u,a,c=8*s-i-1,p=(1<<c)-1,f=p>>1,h=23===i?5.960464477539062e-8:0,l=n?0:s-1,m=n?1:-1,d=0>t||0===t&&0>1/t?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(u=isNaN(t)?1:0,o=p):(o=Math.floor(Math.log(t)/Math.LN2),1>t*(a=Math.pow(2,-o))&&(o--,a*=2),2>(t+=1>o+f?h*Math.pow(2,1-f):h/a)*a||(o++,a/=2),p>o+f?1>o+f?(u=t*Math.pow(2,f-1)*Math.pow(2,i),o=0):(u=(t*a-1)*Math.pow(2,i),o+=f):(u=0,o=p));i>=8;e[r+l]=255&u,l+=m,u/=256,i-=8);for(o=o<<i|u,c+=i;c>0;e[r+l]=255&o,l+=m,o/=256,c-=8);e[r+l-m]|=128*d}},y=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e,t){function r(e){if(e>C)throw new RangeError("Invalid typed array length");var t=new Uint8Array(e);return t.__proto__=n.prototype,t}function n(e,t,r){if("number"==typeof e){if("string"==typeof t)throw Error("If encoding is specified then the first argument must be a string");return o(e)}return i(e,t,r)}function i(e,t,i){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return L(e)?function(e,t,r){if(0>t||t>e.byteLength)throw new RangeError("'offset' is out of bounds");if(t+(r||0)>e.byteLength)throw new RangeError("'length' is out of bounds");var i;i=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r);return i.__proto__=n.prototype,i}(e,t,i):"string"==typeof e?function(e,t){"string"==typeof t&&""!==t||(t="utf8");if(!n.isEncoding(t))throw new TypeError('"encoding" must be a valid string encoding');var i=0|c(e,t),s=r(i),o=s.write(e,t);o!==i&&(s=s.slice(0,o));return s}(e,t):function(e){if(n.isBuffer(e)){var t=0|a(e.length),i=r(t);return 0===i.length?i:(e.copy(i,0,0,t),i)}if(e){if(S(e)||"length"in e)return"number"!=typeof e.length||E(e.length)?r(0):u(e);if("Buffer"===e.type&&Array.isArray(e.data))return u(e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(e)}function s(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(0>e)throw new RangeError('"size" argument must not be negative')}function o(e){return s(e),r(0>e?0:0|a(e))}function u(e){for(var t=0>e.length?0:0|a(e.length),n=r(t),i=0;t>i;i+=1)n[i]=255&e[i];return n}function a(e){if(e>=C)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+C.toString(16)+" bytes");return 0|e}function c(e,t){if(n.isBuffer(e))return e.length;if(S(e)||L(e))return e.byteLength;"string"!=typeof e&&(e=""+e);var r=e.length;if(0===r)return 0;for(var i=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return w(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return k(e).length;default:if(i)return w(e).length;t=(""+t).toLowerCase(),i=!0}}function p(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function f(e,t,r,i,s){if(0===e.length)return-1;if("string"==typeof r?(i=r,r=0):r>2147483647?r=2147483647:-2147483648>r&&(r=-2147483648),r=+r,E(r)&&(r=s?0:e.length-1),0>r&&(r=e.length+r),e.length>r){if(0>r){if(!s)return-1;r=0}}else{if(s)return-1;r=e.length-1}if("string"==typeof t&&(t=n.from(t,i)),n.isBuffer(t))return 0===t.length?-1:h(e,t,r,i,s);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?s?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):h(e,[t],r,i,s);throw new TypeError("val must be string, number or Buffer")}function h(e,t,r,n,i){function s(e,t){return 1===o?e[t]:e.readUInt16BE(t*o)}var o=1,u=e.length,a=t.length;if(void 0!==n&&("ucs2"===(n=(n+"").toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(2>e.length||2>t.length)return-1;o=2,u/=2,a/=2,r/=2}var c;if(i){var p=-1;for(c=r;u>c;c++)if(s(e,c)===s(t,-1===p?0:c-p)){if(-1===p&&(p=c),c-p+1===a)return p*o}else-1!==p&&(c-=c-p),p=-1}else for(r+a>u&&(r=u-a),c=r;c>=0;c--){for(var f=!0,h=0;a>h;h++)if(s(e,c+h)!==s(t,h)){f=!1;break}if(f)return c}return-1}function l(e,t,r,n){return A(function(e){for(var t=[],r=0;e.length>r;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,n)}function m(e,t,r){r=Math.min(e.length,r);for(var n=[],i=t;r>i;){var s=e[i],o=null,u=s>239?4:s>223?3:s>191?2:1;if(r>=i+u){var a,c,p,f;switch(u){case 1:128>s&&(o=s);break;case 2:128==(192&(a=e[i+1]))&&(f=(31&s)<<6|63&a)>127&&(o=f);break;case 3:c=e[i+2],128==(192&(a=e[i+1]))&&128==(192&c)&&(f=(15&s)<<12|(63&a)<<6|63&c)>2047&&(55296>f||f>57343)&&(o=f);break;case 4:c=e[i+2],p=e[i+3],128==(192&(a=e[i+1]))&&128==(192&c)&&128==(192&p)&&(f=(15&s)<<18|(63&a)<<12|(63&c)<<6|63&p)>65535&&1114112>f&&(o=f)}}null===o?(o=65533,u=1):o>65535&&(n.push((o-=65536)>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=u}return function(e){var t=e.length;if(R>=t)return String.fromCharCode.apply(String,e);var r="",n=0;for(;t>n;)r+=String.fromCharCode.apply(String,e.slice(n,n+=R));return r}(n)}function d(e,t,r){if(e%1!=0||0>e)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function g(e,t,r,i,s,o){if(!n.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>s||o>t)throw new RangeError('"value" argument is out of bounds');if(r+i>e.length)throw new RangeError("Index out of range")}function _(e,t,r,n,i,s){if(r+n>e.length)throw new RangeError("Index out of range");if(0>r)throw new RangeError("Index out of range")}function y(e,t,r,n,i){return t=+t,r>>>=0,i||_(e,0,r,4),v.write(e,t,r,n,23,4),r+4}function q(e,t,r,n,i){return t=+t,r>>>=0,i||_(e,0,r,8),v.write(e,t,r,n,52,8),r+8}function w(e,t){t=t||1/0;for(var r,n=e.length,i=null,s=[],o=0;n>o;++o){if((r=e.charCodeAt(o))>55295&&57344>r){if(!i){if(r>56319){(t-=3)>-1&&s.push(239,191,189);continue}if(o+1===n){(t-=3)>-1&&s.push(239,191,189);continue}i=r;continue}if(56320>r){(t-=3)>-1&&s.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320)}else i&&(t-=3)>-1&&s.push(239,191,189);if(i=null,128>r){if(0>(t-=1))break;s.push(r)}else if(2048>r){if(0>(t-=2))break;s.push(r>>6|192,63&r|128)}else if(65536>r){if(0>(t-=3))break;s.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(r>=1114112)throw Error("Invalid code point");if(0>(t-=4))break;s.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return s}function k(e){return b.toByteArray(function(e){if(2>(e=e.trim().replace(U,"")).length)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function A(e,t,r,n){for(var i=0;n>i&&(i+r<t.length&&i<e.length);++i)t[i+r]=e[i];return i}function L(e){return e instanceof ArrayBuffer||null!=e&&null!=e.constructor&&"ArrayBuffer"===e.constructor.name&&"number"==typeof e.byteLength}function S(e){return"function"==typeof ArrayBuffer.isView&&ArrayBuffer.isView(e)}function E(e){return e!=e}t.Buffer=n,t.SlowBuffer=function(e){return+e!=e&&(e=0),n.alloc(+e)},t.INSPECT_MAX_BYTES=50;var C=2147483647;t.kMaxLength=C,(n.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()}catch(e){return!1}}())||void 0===console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),"undefined"!=typeof Symbol&&Symbol.species&&n[Symbol.species]===n&&Object.defineProperty(n,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),n.poolSize=8192,n.from=function(e,t,r){return i(e,t,r)},n.prototype.__proto__=Uint8Array.prototype,n.__proto__=Uint8Array,n.alloc=function(e,t,n){return function(e,t,n){return s(e),e>0&&void 0!==t?"string"==typeof n?r(e).fill(t,n):r(e).fill(t):r(e)}(e,t,n)},n.allocUnsafe=function(e){return o(e)},n.allocUnsafeSlow=function(e){return o(e)},n.isBuffer=function(e){return null!=e&&!0===e._isBuffer},n.compare=function(e,t){if(!n.isBuffer(e)||!n.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var r=e.length,i=t.length,s=0,o=Math.min(r,i);o>s;++s)if(e[s]!==t[s]){r=e[s],i=t[s];break}return i>r?-1:r>i?1:0},n.isEncoding=function(e){switch((e+"").toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},n.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return n.alloc(0);var r;if(void 0===t)for(t=0,r=0;e.length>r;++r)t+=e[r].length;var i=n.allocUnsafe(t),s=0;for(r=0;e.length>r;++r){var o=e[r];if(!n.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers');o.copy(i,s),s+=o.length}return i},n.byteLength=c,n.prototype._isBuffer=!0,n.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;e>t;t+=2)p(this,t,t+1);return this},n.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;e>t;t+=4)p(this,t,t+3),p(this,t+1,t+2);return this},n.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;e>t;t+=8)p(this,t,t+7),p(this,t+1,t+6),p(this,t+2,t+5),p(this,t+3,t+4);return this},n.prototype.toString=function(){var e=this.length;return 0===e?"":0===arguments.length?m(this,0,e):function(e,t,r){var n=!1;if((void 0===t||0>t)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),0>=r)return"";if(r>>>=0,(t>>>=0)>=r)return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){var n=e.length;t&&t>=0||(t=0),(!r||0>r||r>n)&&(r=n);for(var i="",s=t;r>s;++s)i+=function(e){return 16>e?"0"+e.toString(16):e.toString(16)}(e[s]);return i}(this,t,r);case"utf8":case"utf-8":return m(this,t,r);case"ascii":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;r>i;++i)n+=String.fromCharCode(127&e[i]);return n}(this,t,r);case"latin1":case"binary":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;r>i;++i)n+=String.fromCharCode(e[i]);return n}(this,t,r);case"base64":return function(e,t,r){return b.fromByteArray(0===t&&r===e.length?e:e.slice(t,r))}(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){for(var n=e.slice(t,r),i="",s=0;n.length>s;s+=2)i+=String.fromCharCode(n[s]+256*n[s+1]);return i}(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}.apply(this,arguments)},n.prototype.equals=function(e){if(!n.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===n.compare(this,e)},n.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(e+=" ... ")),"<Buffer "+e+">"},n.prototype.compare=function(e,t,r,i,s){if(!n.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===i&&(i=0),void 0===s&&(s=this.length),0>t||r>e.length||0>i||s>this.length)throw new RangeError("out of range index");if(i>=s&&t>=r)return 0;if(i>=s)return-1;if(t>=r)return 1;if(t>>>=0,r>>>=0,i>>>=0,s>>>=0,this===e)return 0;for(var o=s-i,u=r-t,a=Math.min(o,u),c=this.slice(i,s),p=e.slice(t,r),f=0;a>f;++f)if(c[f]!==p[f]){o=c[f],u=p[f];break}return u>o?-1:o>u?1:0},n.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},n.prototype.indexOf=function(e,t,r){return f(this,e,t,r,!0)},n.prototype.lastIndexOf=function(e,t,r){return f(this,e,t,r,!1)},n.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var i=this.length-t;if((void 0===r||r>i)&&(r=i),e.length>0&&(0>r||0>t)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var s=!1;;)switch(n){case"hex":return function(e,t,r,n){var i=e.length-(r=+r||0);n?(n=+n)>i&&(n=i):n=i;var s=t.length;if(s%2!=0)throw new TypeError("Invalid hex string");n>s/2&&(n=s/2);for(var o=0;n>o;++o){var u=parseInt(t.substr(2*o,2),16);if(E(u))return o;e[r+o]=u}return o}(this,e,t,r);case"utf8":case"utf-8":return function(e,t,r,n){return A(w(t,e.length-r),e,r,n)}(this,e,t,r);case"ascii":return l(this,e,t,r);case"latin1":case"binary":return function(e,t,r,n){return l(e,t,r,n)}(this,e,t,r);case"base64":return function(e,t,r,n){return A(k(t),e,r,n)}(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r,n){return A(function(e,t){for(var r,n,i=[],s=0;e.length>s&&(t-=2)>=0;++s)r=e.charCodeAt(s),n=r>>8,i.push(r%256),i.push(n);return i}(t,e.length-r),e,r,n)}(this,e,t,r);default:if(s)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),s=!0}},n.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var R=4096;n.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,0>e?0>(e+=r)&&(e=0):e>r&&(e=r),0>t?0>(t+=r)&&(t=0):t>r&&(t=r),e>t&&(t=e);var i=this.subarray(e,t);return i.__proto__=n.prototype,i},n.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||d(e,t,this.length);for(var n=this[e],i=1,s=0;++s<t&&(i*=256);)n+=this[e+s]*i;return n},n.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||d(e,t,this.length);for(var n=this[e+--t],i=1;t>0&&(i*=256);)n+=this[e+--t]*i;return n},n.prototype.readUInt8=function(e,t){return e>>>=0,t||d(e,1,this.length),this[e]},n.prototype.readUInt16LE=function(e,t){return e>>>=0,t||d(e,2,this.length),this[e]|this[e+1]<<8},n.prototype.readUInt16BE=function(e,t){return e>>>=0,t||d(e,2,this.length),this[e]<<8|this[e+1]},n.prototype.readUInt32LE=function(e,t){return e>>>=0,t||d(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},n.prototype.readUInt32BE=function(e,t){return e>>>=0,t||d(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},n.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||d(e,t,this.length);for(var n=this[e],i=1,s=0;++s<t&&(i*=256);)n+=this[e+s]*i;return(i*=128)>n||(n-=Math.pow(2,8*t)),n},n.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||d(e,t,this.length);for(var n=t,i=1,s=this[e+--n];n>0&&(i*=256);)s+=this[e+--n]*i;return(i*=128)>s||(s-=Math.pow(2,8*t)),s},n.prototype.readInt8=function(e,t){return e>>>=0,t||d(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},n.prototype.readInt16LE=function(e,t){e>>>=0,t||d(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},n.prototype.readInt16BE=function(e,t){e>>>=0,t||d(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},n.prototype.readInt32LE=function(e,t){return e>>>=0,t||d(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},n.prototype.readInt32BE=function(e,t){return e>>>=0,t||d(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},n.prototype.readFloatLE=function(e,t){return e>>>=0,t||d(e,4,this.length),v.read(this,e,!0,23,4)},n.prototype.readFloatBE=function(e,t){return e>>>=0,t||d(e,4,this.length),v.read(this,e,!1,23,4)},n.prototype.readDoubleLE=function(e,t){return e>>>=0,t||d(e,8,this.length),v.read(this,e,!0,52,8)},n.prototype.readDoubleBE=function(e,t){return e>>>=0,t||d(e,8,this.length),v.read(this,e,!1,52,8)},n.prototype.writeUIntLE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){g(this,e,t,r,Math.pow(2,8*r)-1,0)}var i=1,s=0;for(this[t]=255&e;++s<r&&(i*=256);)this[t+s]=e/i&255;return t+r},n.prototype.writeUIntBE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){g(this,e,t,r,Math.pow(2,8*r)-1,0)}var i=r-1,s=1;for(this[t+i]=255&e;--i>=0&&(s*=256);)this[t+i]=e/s&255;return t+r},n.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,1,255,0),this[t]=255&e,t+1},n.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},n.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},n.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},n.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},n.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var i=Math.pow(2,8*r-1);g(this,e,t,r,i-1,-i)}var s=0,o=1,u=0;for(this[t]=255&e;++s<r&&(o*=256);)0>e&&0===u&&0!==this[t+s-1]&&(u=1),this[t+s]=(e/o>>0)-u&255;return t+r},n.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var i=Math.pow(2,8*r-1);g(this,e,t,r,i-1,-i)}var s=r-1,o=1,u=0;for(this[t+s]=255&e;--s>=0&&(o*=256);)0>e&&0===u&&0!==this[t+s+1]&&(u=1),this[t+s]=(e/o>>0)-u&255;return t+r},n.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,1,127,-128),0>e&&(e=255+e+1),this[t]=255&e,t+1},n.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},n.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},n.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},n.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||g(this,e,t,4,2147483647,-2147483648),0>e&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},n.prototype.writeFloatLE=function(e,t,r){return y(this,e,t,!0,r)},n.prototype.writeFloatBE=function(e,t,r){return y(this,e,t,!1,r)},n.prototype.writeDoubleLE=function(e,t,r){return q(this,e,t,!0,r)},n.prototype.writeDoubleBE=function(e,t,r){return q(this,e,t,!1,r)},n.prototype.copy=function(e,t,r,n){if(r||(r=0),n||0===n||(n=this.length),e.length>t||(t=e.length),t||(t=0),n>0&&r>n&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(0>t)throw new RangeError("targetStart out of bounds");if(0>r||r>=this.length)throw new RangeError("sourceStart out of bounds");if(0>n)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),n-r>e.length-t&&(n=e.length-t+r);var i,s=n-r;if(this===e&&t>r&&n>t)for(i=s-1;i>=0;--i)e[i+t]=this[i+r];else if(1e3>s)for(i=0;s>i;++i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,r+s),t);return s},n.prototype.fill=function(e,t,r,i){if("string"==typeof e){if("string"==typeof t?(i=t,t=0,r=this.length):"string"==typeof r&&(i=r,r=this.length),1===e.length){var s=e.charCodeAt(0);256>s&&(e=s)}if(void 0!==i&&"string"!=typeof i)throw new TypeError("encoding must be a string");if("string"==typeof i&&!n.isEncoding(i))throw new TypeError("Unknown encoding: "+i)}else"number"==typeof e&&(e&=255);if(0>t||t>this.length||r>this.length)throw new RangeError("Out of range index");if(t>=r)return this;t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0);var o;if("number"==typeof e)for(o=t;r>o;++o)this[o]=e;else{var u=n.isBuffer(e)?e:new n(e,i),a=u.length;for(o=0;r-t>o;++o)this[o+t]=u[o%a]}return this};var U=/[^+/0-9A-Za-z-_]/g}).Buffer;"function"!=typeof Object.assign&&(Object.assign=function(e){var t,r,n,i;if(void 0===e||null===e)throw new TypeError("Cannot convert undefined or null to object");for(t=Object(e),r=1;arguments.length>r;r++)if(void 0!==(n=arguments[r])&&null!==n)for(i in n)n.hasOwnProperty(i)&&(t[i]=n[i]);return t}),Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(e,t){if(null==this)throw new TypeError('"this" is null or not defined');var r=Object(this),n=r.length>>>0;if(0===n)return!1;for(var i=0|t,s=Math.max(0>i?n-Math.abs(i):i,0);n>s;){if(function(e,t){return e===t||"number"==typeof e&&"number"==typeof t&&isNaN(e)&&isNaN(t)}(r[s],e))return!0;s++}return!1}});var q=function(){function n(e){s(this,n),this.accessToken=(e=e||{}).accessToken,this.clientId=e.clientId,this.clientSecret=e.clientSecret,this.selectUser=e.selectUser,this.selectAdmin=e.selectAdmin,this.fetch=e.fetch||fetch,this.pathRoot=e.pathRoot,e.fetch||console.warn("Global fetch is deprecated and will be unsupported in a future version. Please pass fetch function as option when instantiating dropbox instance: new Dropbox({fetch})")}return o(n,[{key:"setAccessToken",value:function(e){this.accessToken=e}},{key:"getAccessToken",value:function(){return this.accessToken}},{key:"setClientId",value:function(e){this.clientId=e}},{key:"getClientId",value:function(){return this.clientId}},{key:"setClientSecret",value:function(e){this.clientSecret=e}},{key:"getClientSecret",value:function(){return this.clientSecret}},{key:"getAuthenticationUrl",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"token",n=this.getClientId(),i="https://www.dropbox.com/oauth2/authorize";if(!n)throw Error("A client id is required. You can set the client id using .setClientId().");if("code"!==r&&!e)throw Error("A redirect uri is required.");if(!["code","token"].includes(r))throw Error("Authorization type must be code or token");var s=void 0;return s="code"===r?i+"?response_type=code&client_id="+n:i+"?response_type=token&client_id="+n,e&&(s+="&redirect_uri="+e),t&&(s+="&state="+t),s}},{key:"getAccessTokenFromCode",value:function(e,t){var r=this.getClientId(),n=this.getClientSecret();if(!r)throw Error("A client id is required. You can set the client id using .setClientId().");if(!n)throw Error("A client secret is required. You can set the client id using .setClientSecret().");return this.fetch("https://api.dropboxapi.com/oauth2/token?code="+t+"&grant_type=authorization_code&redirect_uri="+e+"&client_id="+r+"&client_secret="+n,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(e){return function(e){var t=e.clone();return new Promise(function(r){e.json().then(function(e){return r(e)}).catch(function(){return t.text().then(function(e){return r(e)})})}).then(function(t){return[e,t]})}(e)}).then(function(e){var t=c(e,2),r=t[0],n=t[1];if(!r.ok)throw{error:n,response:r,status:r.status};return n.access_token})}},{key:"authenticateWithCordova",value:function(e,t){function r(e){-999!==e.code&&(window.setTimeout(function(){u.close()},10),t())}function n(r){if(r.url.indexOf("&error=")>-1)window.setTimeout(function(){u.close()},10),t();else{var n=r.url.indexOf("#access_token="),i=r.url.indexOf("&token_type=");if(n>-1){n+=14,window.setTimeout(function(){u.close()},10);var s=r.url.substring(n,i);e(s)}}}function i(){o||(u.removeEventListener("loaderror",r),u.removeEventListener("loadstop",n),u.removeEventListener("exit",i),o=!0)}var s=this.getAuthenticationUrl("https://www.dropbox.com/1/oauth2/redirect_receiver"),o=!1,u=window.open(s,"_blank");u.addEventListener("loaderror",r),u.addEventListener("loadstop",n),u.addEventListener("exit",i)}},{key:"request",value:function(e,t,r,n,i){var s=null;switch(i){case"rpc":s=this.getRpcRequest();break;case"download":s=this.getDownloadRequest();break;case"upload":s=this.getUploadRequest();break;default:throw Error("Invalid request style: "+i)}var o={selectUser:this.selectUser,selectAdmin:this.selectAdmin,clientId:this.getClientId(),clientSecret:this.getClientSecret(),pathRoot:this.pathRoot};return s(e,t,r,n,this.getAccessToken(),o)}},{key:"setRpcRequest",value:function(e){this.rpcRequest=e}},{key:"getRpcRequest",value:function(){return void 0===this.rpcRequest&&(this.rpcRequest=function(e){return function(r,n,i,s,o,u){var a={method:"POST",body:n?JSON.stringify(n):null},p={};n&&(p["Content-Type"]="application/json");var f="";switch(i){case"app":if(!u.clientId||!u.clientSecret)throw Error("A client id and secret is required for this function");f=new y(u.clientId+":"+u.clientSecret).toString("base64"),p.Authorization="Basic "+f;break;case"team":case"user":p.Authorization="Bearer "+o;break;case"noauth":break;default:throw Error("Unhandled auth type: "+i)}return u&&(u.selectUser&&(p["Dropbox-API-Select-User"]=u.selectUser),u.selectAdmin&&(p["Dropbox-API-Select-Admin"]=u.selectAdmin),u.pathRoot&&(p["Dropbox-API-Path-Root"]=u.pathRoot)),a.headers=p,e(t(s)+r,a).then(function(e){return function(e){return"application/json"===e.headers.get("Content-Type")?e.json().then(function(t){return[e,t]}):e.text().then(function(t){return[e,t]})}(e)}).then(function(e){var t=c(e,2),r=t[0],n=t[1];if(!r.ok)throw{error:n,response:r,status:r.status};return n})}}(this.fetch)),this.rpcRequest}},{key:"setDownloadRequest",value:function(e){this.downloadRequest=e}},{key:"getDownloadRequest",value:function(){return void 0===this.downloadRequest&&(this.downloadRequest=function(n){return function(i,s,o,u,a,p){if("user"!==o)throw Error("Unexpected auth type: "+o);var f={method:"POST",headers:{Authorization:"Bearer "+a,"Dropbox-API-Arg":r(s)}};return p&&(p.selectUser&&(f.headers["Dropbox-API-Select-User"]=p.selectUser),p.selectAdmin&&(f.headers["Dropbox-API-Select-Admin"]=p.selectAdmin),p.pathRoot&&(f.headers["Dropbox-API-Path-Root"]=p.pathRoot)),n(t(u)+i,f).then(function(t){return function(t){return t.ok?e()?t.blob():t.buffer():t.text()}(t).then(function(e){return[t,e]})}).then(function(t){var r=c(t,2);return function(t,r){if(!t.ok)throw{error:r,response:t,status:t.status};var n=JSON.parse(t.headers.get("dropbox-api-result"));return e()?n.fileBlob=r:n.fileBinary=r,n}(r[0],r[1])})}}(this.fetch)),this.downloadRequest}},{key:"setUploadRequest",value:function(e){this.uploadRequest=e}},{key:"getUploadRequest",value:function(){return void 0===this.uploadRequest&&(this.uploadRequest=function(e){return function(n,i,s,o,u,a){if("user"!==s)throw Error("Unexpected auth type: "+s);var p=i.contents;delete i.contents;var f={body:p,method:"POST",headers:{Authorization:"Bearer "+u,"Content-Type":"application/octet-stream","Dropbox-API-Arg":r(i)}};return a&&(a.selectUser&&(f.headers["Dropbox-API-Select-User"]=a.selectUser),a.selectAdmin&&(f.headers["Dropbox-API-Select-Admin"]=a.selectAdmin),a.pathRoot&&(f.headers["Dropbox-API-Path-Root"]=a.pathRoot)),e(t(o)+n,f).then(function(e){return function(e){var t=e.clone();return new Promise(function(r){e.json().then(function(e){return r(e)}).catch(function(){return t.text().then(function(e){return r(e)})})}).then(function(t){return[e,t]})}(e)}).then(function(e){var t=c(e,2),r=t[0],n=t[1];if(!r.ok)throw{error:n,response:r,status:r.status};return n})}}(this.fetch)),this.uploadRequest}}]),n}(),w=function(e){function t(e){s(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return Object.assign(r,i),r}return u(t,q),o(t,[{key:"filesGetSharedLinkFile",value:function(e){return this.request("sharing/get_shared_link_file",e,"api","download")}}]),t}(),k=Object.freeze({Dropbox:w}),A={};A.teamDevicesListMemberDevices=function(e){return this.request("team/devices/list_member_devices",e,"team","api","rpc")},A.teamDevicesListMembersDevices=function(e){return this.request("team/devices/list_members_devices",e,"team","api","rpc")},A.teamDevicesListTeamDevices=function(e){return this.request("team/devices/list_team_devices",e,"team","api","rpc")},A.teamDevicesRevokeDeviceSession=function(e){return this.request("team/devices/revoke_device_session",e,"team","api","rpc")},A.teamDevicesRevokeDeviceSessionBatch=function(e){return this.request("team/devices/revoke_device_session_batch",e,"team","api","rpc")},A.teamFeaturesGetValues=function(e){return this.request("team/features/get_values",e,"team","api","rpc")},A.teamGetInfo=function(e){return this.request("team/get_info",e,"team","api","rpc")},A.teamGroupsCreate=function(e){return this.request("team/groups/create",e,"team","api","rpc")},A.teamGroupsDelete=function(e){return this.request("team/groups/delete",e,"team","api","rpc")},A.teamGroupsGetInfo=function(e){return this.request("team/groups/get_info",e,"team","api","rpc")},A.teamGroupsJobStatusGet=function(e){return this.request("team/groups/job_status/get",e,"team","api","rpc")},A.teamGroupsList=function(e){return this.request("team/groups/list",e,"team","api","rpc")},A.teamGroupsListContinue=function(e){return this.request("team/groups/list/continue",e,"team","api","rpc")},A.teamGroupsMembersAdd=function(e){return this.request("team/groups/members/add",e,"team","api","rpc")},A.teamGroupsMembersList=function(e){return this.request("team/groups/members/list",e,"team","api","rpc")},A.teamGroupsMembersListContinue=function(e){return this.request("team/groups/members/list/continue",e,"team","api","rpc")},A.teamGroupsMembersRemove=function(e){return this.request("team/groups/members/remove",e,"team","api","rpc")},A.teamGroupsMembersSetAccessType=function(e){return this.request("team/groups/members/set_access_type",e,"team","api","rpc")},A.teamGroupsUpdate=function(e){return this.request("team/groups/update",e,"team","api","rpc")},A.teamLinkedAppsListMemberLinkedApps=function(e){return this.request("team/linked_apps/list_member_linked_apps",e,"team","api","rpc")},A.teamLinkedAppsListMembersLinkedApps=function(e){return this.request("team/linked_apps/list_members_linked_apps",e,"team","api","rpc")},A.teamLinkedAppsListTeamLinkedApps=function(e){return this.request("team/linked_apps/list_team_linked_apps",e,"team","api","rpc")},A.teamLinkedAppsRevokeLinkedApp=function(e){return this.request("team/linked_apps/revoke_linked_app",e,"team","api","rpc")},A.teamLinkedAppsRevokeLinkedAppBatch=function(e){return this.request("team/linked_apps/revoke_linked_app_batch",e,"team","api","rpc")},A.teamMemberSpaceLimitsExcludedUsersAdd=function(e){return this.request("team/member_space_limits/excluded_users/add",e,"team","api","rpc")},A.teamMemberSpaceLimitsExcludedUsersList=function(e){return this.request("team/member_space_limits/excluded_users/list",e,"team","api","rpc")},A.teamMemberSpaceLimitsExcludedUsersListContinue=function(e){return this.request("team/member_space_limits/excluded_users/list/continue",e,"team","api","rpc")},A.teamMemberSpaceLimitsExcludedUsersRemove=function(e){return this.request("team/member_space_limits/excluded_users/remove",e,"team","api","rpc")},A.teamMemberSpaceLimitsGetCustomQuota=function(e){return this.request("team/member_space_limits/get_custom_quota",e,"team","api","rpc")},A.teamMemberSpaceLimitsRemoveCustomQuota=function(e){return this.request("team/member_space_limits/remove_custom_quota",e,"team","api","rpc")},A.teamMemberSpaceLimitsSetCustomQuota=function(e){return this.request("team/member_space_limits/set_custom_quota",e,"team","api","rpc")},A.teamMembersAdd=function(e){return this.request("team/members/add",e,"team","api","rpc")},A.teamMembersAddJobStatusGet=function(e){return this.request("team/members/add/job_status/get",e,"team","api","rpc")},A.teamMembersGetInfo=function(e){return this.request("team/members/get_info",e,"team","api","rpc")},A.teamMembersList=function(e){return this.request("team/members/list",e,"team","api","rpc")},A.teamMembersListContinue=function(e){return this.request("team/members/list/continue",e,"team","api","rpc")},A.teamMembersMoveFormerMemberFiles=function(e){return this.request("team/members/move_former_member_files",e,"team","api","rpc")},A.teamMembersMoveFormerMemberFilesJobStatusCheck=function(e){return this.request("team/members/move_former_member_files/job_status/check",e,"team","api","rpc")},A.teamMembersRecover=function(e){return this.request("team/members/recover",e,"team","api","rpc")},A.teamMembersRemove=function(e){return this.request("team/members/remove",e,"team","api","rpc")},A.teamMembersRemoveJobStatusGet=function(e){return this.request("team/members/remove/job_status/get",e,"team","api","rpc")},A.teamMembersSendWelcomeEmail=function(e){return this.request("team/members/send_welcome_email",e,"team","api","rpc")},A.teamMembersSetAdminPermissions=function(e){return this.request("team/members/set_admin_permissions",e,"team","api","rpc")},A.teamMembersSetProfile=function(e){return this.request("team/members/set_profile",e,"team","api","rpc")},A.teamMembersSuspend=function(e){return this.request("team/members/suspend",e,"team","api","rpc")},A.teamMembersUnsuspend=function(e){return this.request("team/members/unsuspend",e,"team","api","rpc")},A.teamNamespacesList=function(e){return this.request("team/namespaces/list",e,"team","api","rpc")},A.teamNamespacesListContinue=function(e){return this.request("team/namespaces/list/continue",e,"team","api","rpc")},A.teamPropertiesTemplateAdd=function(e){return this.request("team/properties/template/add",e,"team","api","rpc")},A.teamPropertiesTemplateGet=function(e){return this.request("team/properties/template/get",e,"team","api","rpc")},A.teamPropertiesTemplateList=function(e){return this.request("team/properties/template/list",e,"team","api","rpc")},A.teamPropertiesTemplateUpdate=function(e){return this.request("team/properties/template/update",e,"team","api","rpc")},A.teamReportsGetActivity=function(e){return this.request("team/reports/get_activity",e,"team","api","rpc")},A.teamReportsGetDevices=function(e){return this.request("team/reports/get_devices",e,"team","api","rpc")},A.teamReportsGetMembership=function(e){return this.request("team/reports/get_membership",e,"team","api","rpc")},A.teamReportsGetStorage=function(e){return this.request("team/reports/get_storage",e,"team","api","rpc")},A.teamTeamFolderActivate=function(e){return this.request("team/team_folder/activate",e,"team","api","rpc")},A.teamTeamFolderArchive=function(e){return this.request("team/team_folder/archive",e,"team","api","rpc")},A.teamTeamFolderArchiveCheck=function(e){return this.request("team/team_folder/archive/check",e,"team","api","rpc")},A.teamTeamFolderCreate=function(e){return this.request("team/team_folder/create",e,"team","api","rpc")},A.teamTeamFolderGetInfo=function(e){return this.request("team/team_folder/get_info",e,"team","api","rpc")},A.teamTeamFolderList=function(e){return this.request("team/team_folder/list",e,"team","api","rpc")},A.teamTeamFolderListContinue=function(e){return this.request("team/team_folder/list/continue",e,"team","api","rpc")},A.teamTeamFolderPermanentlyDelete=function(e){return this.request("team/team_folder/permanently_delete",e,"team","api","rpc")},A.teamTeamFolderRename=function(e){return this.request("team/team_folder/rename",e,"team","api","rpc")},A.teamTeamFolderUpdateSyncSettings=function(e){return this.request("team/team_folder/update_sync_settings",e,"team","api","rpc")},A.teamTokenGetAuthenticatedAdmin=function(e){return this.request("team/token/get_authenticated_admin",e,"team","api","rpc")};var L=function(e){function t(e){s(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return Object.assign(r,A),r}return u(t,q),o(t,[{key:"actAsUser",value:function(e){return new w({accessToken:this.accessToken,clientId:this.clientId,selectUser:e})}}]),t}(),S=Object.freeze({DropboxTeam:L});return{Dropbox:k.Dropbox,DropboxTeam:S.DropboxTeam}});

},{}],"script.ts":[function(require,module,exports) {
document.getElementById('meteo').onsubmit = buttonClickGET;

var callBackGetSuccess = function callBackGetSuccess(data) {
  var element = document.getElementById("zone_meteo");
  element.innerHTML = "La temperature est de " + data.main.temp;
};

function buttonClickGET() {
  var url = "https://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric";
  $.get(url, callBackGetSuccess).done(function () {//alert( "second success" );
  }).fail(function () {
    alert("error");
  }).always(function () {//alert( "finished" );
  });
}

document.getElementById('fileForm').onsubmit = uploadFile;

var fetch = require('isomorphic-fetch'); // or another library of choice.


var Dropbox = require('dropbox').Dropbox;

var dbx = new Dropbox({
  accessToken: 'VIGIWk8djhAAAAAAAAAA-4GG6KPuMmO_tEdHis5blKLHocA8rruGL0Ywms65hSND',
  fetch: fetch
});
dbx.filesListFolder({
  path: ''
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});

function uploadFile() {
  var UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
  var ACCESS_TOKEN = document.getElementById('access-token').value;
  var dbx = new Dropbox({
    accessToken: 'VIGIWk8djhAAAAAAAAAA-4GG6KPuMmO_tEdHis5blKLHocA8rruGL0Ywms65hSND'
  });
  var fileInput = document.getElementById('file-upload');
  var file = fileInput.files[0];

  if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
    // File is smaller than 150 Mb - use filesUpload API
    dbx.filesUpload({
      path: '/' + file.name,
      contents: file
    }).then(function (response) {
      var results = document.getElementById('results');
      results.appendChild(document.createTextNode('File uploaded!'));
      console.log(response);
    }).catch(function (error) {
      console.error(error);
    });
  } else {
    // File is bigger than 150 Mb - use filesUploadSession* API
    var maxBlob_1 = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size

    var workItems = [];
    var offset = 0;

    while (offset < file.size) {
      var chunkSize = Math.min(maxBlob_1, file.size - offset);
      workItems.push(file.slice(offset, offset + chunkSize));
      offset += chunkSize;
    }

    var task = workItems.reduce(function (acc, blob, idx, items) {
      if (idx == 0) {
        // Starting multipart upload of file
        return acc.then(function () {
          return dbx.filesUploadSessionStart({
            close: false,
            contents: blob
          }).then(function (response) {
            return response.session_id;
          });
        });
      } else if (idx < items.length - 1) {
        // Append part to the upload session
        return acc.then(function (sessionId) {
          var cursor = {
            session_id: sessionId,
            offset: idx * maxBlob_1
          };
          return dbx.filesUploadSessionAppendV2({
            cursor: cursor,
            close: false,
            contents: blob
          }).then(function () {
            return sessionId;
          });
        });
      } else {
        // Last chunk of data, close session
        return acc.then(function (sessionId) {
          var cursor = {
            session_id: sessionId,
            offset: file.size - blob.size
          };
          var commit = {
            path: '/' + file.name,
            mode: 'add',
            autorename: true,
            mute: false
          };
          return dbx.filesUploadSessionFinish({
            cursor: cursor,
            commit: commit,
            contents: blob
          });
        });
      }
    }, Promise.resolve());
    task.then(function (result) {
      var results = document.getElementById('results');
      results.appendChild(document.createTextNode('File uploaded!'));
    }).catch(function (error) {
      console.error(error);
    });
  }

  return false;
}
},{"isomorphic-fetch":"node_modules/isomorphic-fetch/fetch-npm-browserify.js","dropbox":"node_modules/dropbox/dist/Dropbox-sdk.min.js"}],"../../../Users/flora/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55357" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../Users/flora/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.ts"], null)
//# sourceMappingURL=/script.221c08a2.js.map