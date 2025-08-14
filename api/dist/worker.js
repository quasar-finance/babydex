var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/data/isHex.js"() {
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/data/size.js"() {
    init_isHex();
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/version.js
var version;
var init_version = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/version.js"() {
    version = "2.29.0";
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError;
var init_base = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/base.js"() {
    init_version();
    errorConfig = {
      getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
      version: `viem@${version}`
    };
    BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if (args.cause?.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/data.js
var SizeExceedsPaddingSizeError;
var init_data = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/data.js"() {
    init_base();
    SizeExceedsPaddingSizeError = class extends BaseError {
      constructor({ size: size3, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size3}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size3 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size3 });
  return padBytes(hexOrBytes, { dir, size: size3 });
}
function padHex(hex_, { dir, size: size3 = 32 } = {}) {
  if (size3 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size3 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size3,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size3 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size3 = 32 } = {}) {
  if (size3 === null)
    return bytes;
  if (bytes.length > size3)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size3,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size3);
  for (let i = 0; i < size3; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size3 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/data/pad.js"() {
    init_data();
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/encoding.js
var SizeOverflowError;
var init_encoding = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/encoding.js"() {
    init_base();
    SizeOverflowError = class extends BaseError {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size3 }) {
  if (size(hexOrBytes) > size3)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size3
    });
}
var init_fromHex = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_encoding();
    init_size();
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/encoding/toHex.js
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_pad();
    init_fromHex();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    encoder = /* @__PURE__ */ new TextEncoder();
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/lru.js"() {
    LruMap = class extends Map {
      constructor(size3) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size3;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== void 0) {
          this.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = this.keys().next().value;
          if (firstKey)
            this.delete(firstKey);
        }
        return this;
      }
    };
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}
var init_parseAccount = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/accounts/utils/parseAccount.js"() {
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/stringify.js
var stringify;
var init_stringify = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/stringify.js"() {
    stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space);
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/utils.js
var getUrl;
var init_utils = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/utils.js"() {
    getUrl = (url) => url;
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/request.js
var HttpRequestError, RpcRequestError, TimeoutError;
var init_request = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/request.js"() {
    init_stringify();
    init_base();
    init_utils();
    HttpRequestError = class extends BaseError {
      constructor({ body, cause, details, headers, status, url }) {
        super("HTTP request failed.", {
          cause,
          details,
          metaMessages: [
            status && `Status: ${status}`,
            `URL: ${getUrl(url)}`,
            body && `Request body: ${stringify(body)}`
          ].filter(Boolean),
          name: "HttpRequestError"
        });
        Object.defineProperty(this, "body", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "headers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
      }
    };
    RpcRequestError = class extends BaseError {
      constructor({ body, error, url }) {
        super("RPC Request failed.", {
          cause: error,
          details: error.message,
          metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
          name: "RpcRequestError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.code = error.code;
        this.data = error.data;
      }
    };
    TimeoutError = class extends BaseError {
      constructor({ body, url }) {
        super("The request took too long to respond.", {
          details: "The request timed out.",
          metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
          name: "TimeoutError"
        });
      }
    };
  }
});

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/rpc.js
var unknownErrorCode, RpcError, ProviderRpcError, ParseRpcError, InvalidRequestRpcError, MethodNotFoundRpcError, InvalidParamsRpcError, InternalRpcError, InvalidInputRpcError, ResourceNotFoundRpcError, ResourceUnavailableRpcError, TransactionRejectedRpcError, MethodNotSupportedRpcError, LimitExceededRpcError, JsonRpcVersionUnsupportedError, UserRejectedRequestError, UnauthorizedProviderError, UnsupportedProviderMethodError, ProviderDisconnectedError, ChainDisconnectedError, SwitchChainError, UnsupportedNonOptionalCapabilityError, UnsupportedChainIdError, DuplicateIdError, UnknownBundleIdError, BundleTooLargeError, AtomicReadyWalletRejectedUpgradeError, AtomicityNotSupportedError, UnknownRpcError;
var init_rpc = __esm({
  "../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/rpc.js"() {
    init_base();
    init_request();
    unknownErrorCode = -1;
    RpcError = class extends BaseError {
      constructor(cause, { code, docsPath, metaMessages, name, shortMessage }) {
        super(shortMessage, {
          cause,
          docsPath,
          metaMessages: metaMessages || cause?.metaMessages,
          name: name || "RpcError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = name || cause.name;
        this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
      }
    };
    ProviderRpcError = class extends RpcError {
      constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = options.data;
      }
    };
    ParseRpcError = class _ParseRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ParseRpcError.code,
          name: "ParseRpcError",
          shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
        });
      }
    };
    Object.defineProperty(ParseRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700
    });
    InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidRequestRpcError.code,
          name: "InvalidRequestRpcError",
          shortMessage: "JSON is not a valid request object."
        });
      }
    };
    Object.defineProperty(InvalidRequestRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600
    });
    MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotFoundRpcError.code,
          name: "MethodNotFoundRpcError",
          shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
        });
      }
    };
    Object.defineProperty(MethodNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601
    });
    InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidParamsRpcError.code,
          name: "InvalidParamsRpcError",
          shortMessage: [
            "Invalid parameters were provided to the RPC method.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    Object.defineProperty(InvalidParamsRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602
    });
    InternalRpcError = class _InternalRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InternalRpcError.code,
          name: "InternalRpcError",
          shortMessage: "An internal error was received."
        });
      }
    };
    Object.defineProperty(InternalRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603
    });
    InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidInputRpcError.code,
          name: "InvalidInputRpcError",
          shortMessage: [
            "Missing or invalid parameters.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    Object.defineProperty(InvalidInputRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3
    });
    ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceNotFoundRpcError.code,
          name: "ResourceNotFoundRpcError",
          shortMessage: "Requested resource not found."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ResourceNotFoundRpcError"
        });
      }
    };
    Object.defineProperty(ResourceNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001
    });
    ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceUnavailableRpcError.code,
          name: "ResourceUnavailableRpcError",
          shortMessage: "Requested resource not available."
        });
      }
    };
    Object.defineProperty(ResourceUnavailableRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002
    });
    TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _TransactionRejectedRpcError.code,
          name: "TransactionRejectedRpcError",
          shortMessage: "Transaction creation failed."
        });
      }
    };
    Object.defineProperty(TransactionRejectedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003
    });
    MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotSupportedRpcError.code,
          name: "MethodNotSupportedRpcError",
          shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
        });
      }
    };
    Object.defineProperty(MethodNotSupportedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004
    });
    LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _LimitExceededRpcError.code,
          name: "LimitExceededRpcError",
          shortMessage: "Request exceeds defined limit."
        });
      }
    };
    Object.defineProperty(LimitExceededRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005
    });
    JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _JsonRpcVersionUnsupportedError.code,
          name: "JsonRpcVersionUnsupportedError",
          shortMessage: "Version of JSON-RPC protocol is not supported."
        });
      }
    };
    Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006
    });
    UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UserRejectedRequestError.code,
          name: "UserRejectedRequestError",
          shortMessage: "User rejected the request."
        });
      }
    };
    Object.defineProperty(UserRejectedRequestError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001
    });
    UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnauthorizedProviderError.code,
          name: "UnauthorizedProviderError",
          shortMessage: "The requested method and/or account has not been authorized by the user."
        });
      }
    };
    Object.defineProperty(UnauthorizedProviderError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100
    });
    UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _UnsupportedProviderMethodError.code,
          name: "UnsupportedProviderMethodError",
          shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
        });
      }
    };
    Object.defineProperty(UnsupportedProviderMethodError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200
    });
    ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ProviderDisconnectedError.code,
          name: "ProviderDisconnectedError",
          shortMessage: "The Provider is disconnected from all chains."
        });
      }
    };
    Object.defineProperty(ProviderDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900
    });
    ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ChainDisconnectedError.code,
          name: "ChainDisconnectedError",
          shortMessage: "The Provider is not connected to the requested chain."
        });
      }
    };
    Object.defineProperty(ChainDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901
    });
    SwitchChainError = class _SwitchChainError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _SwitchChainError.code,
          name: "SwitchChainError",
          shortMessage: "An error occurred when attempting to switch chain."
        });
      }
    };
    Object.defineProperty(SwitchChainError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4902
    });
    UnsupportedNonOptionalCapabilityError = class _UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnsupportedNonOptionalCapabilityError.code,
          name: "UnsupportedNonOptionalCapabilityError",
          shortMessage: "This Wallet does not support a capability that was not marked as optional."
        });
      }
    };
    Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5700
    });
    UnsupportedChainIdError = class _UnsupportedChainIdError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnsupportedChainIdError.code,
          name: "UnsupportedChainIdError",
          shortMessage: "This Wallet does not support the requested chain ID."
        });
      }
    };
    Object.defineProperty(UnsupportedChainIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5710
    });
    DuplicateIdError = class _DuplicateIdError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _DuplicateIdError.code,
          name: "DuplicateIdError",
          shortMessage: "There is already a bundle submitted with this ID."
        });
      }
    };
    Object.defineProperty(DuplicateIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5720
    });
    UnknownBundleIdError = class _UnknownBundleIdError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnknownBundleIdError.code,
          name: "UnknownBundleIdError",
          shortMessage: "This bundle id is unknown / has not been submitted"
        });
      }
    };
    Object.defineProperty(UnknownBundleIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5730
    });
    BundleTooLargeError = class _BundleTooLargeError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _BundleTooLargeError.code,
          name: "BundleTooLargeError",
          shortMessage: "The call bundle is too large for the Wallet to process."
        });
      }
    };
    Object.defineProperty(BundleTooLargeError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5740
    });
    AtomicReadyWalletRejectedUpgradeError = class _AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _AtomicReadyWalletRejectedUpgradeError.code,
          name: "AtomicReadyWalletRejectedUpgradeError",
          shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
        });
      }
    };
    Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5750
    });
    AtomicityNotSupportedError = class _AtomicityNotSupportedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _AtomicityNotSupportedError.code,
          name: "AtomicityNotSupportedError",
          shortMessage: "The wallet does not support atomic execution but the request requires it."
        });
      }
    };
    Object.defineProperty(AtomicityNotSupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5760
    });
    UnknownRpcError = class extends RpcError {
      constructor(cause) {
        super(cause, {
          name: "UnknownRpcError",
          shortMessage: "An unknown RPC error occurred."
        });
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/utf8.js
var require_utf8 = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/utf8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utf8Write = exports.utf8Read = exports.utf8Length = void 0;
    function utf8Length(str) {
      let len = 0, c = 0;
      for (let i = 0; i < str.length; ++i) {
        c = str.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    }
    exports.utf8Length = utf8Length;
    function utf8Read(buffer2, start, end) {
      const len = end - start;
      if (len < 1)
        return "";
      const chunk = [];
      let parts = [], i = 0, t;
      while (start < end) {
        t = buffer2[start++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | buffer2[start++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode(...chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode(...chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode(...chunk.slice(0, i));
    }
    exports.utf8Read = utf8Read;
    function utf8Write(str, buffer2, offset) {
      const start = offset;
      let c1, c2;
      for (let i = 0; i < str.length; ++i) {
        c1 = str.charCodeAt(i);
        if (c1 < 128) {
          buffer2[offset++] = c1;
        } else if (c1 < 2048) {
          buffer2[offset++] = c1 >> 6 | 192;
          buffer2[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = str.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer2[offset++] = c1 >> 18 | 240;
          buffer2[offset++] = c1 >> 12 & 63 | 128;
          buffer2[offset++] = c1 >> 6 & 63 | 128;
          buffer2[offset++] = c1 & 63 | 128;
        } else {
          buffer2[offset++] = c1 >> 12 | 224;
          buffer2[offset++] = c1 >> 6 & 63 | 128;
          buffer2[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    }
    exports.utf8Write = utf8Write;
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/varint.js
var require_varint = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/varint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeByte = exports.writeFixed32 = exports.int64Length = exports.writeVarint64 = exports.writeVarint32 = exports.readInt32 = exports.readUInt32 = exports.zzDecode = exports.zzEncode = exports.varint32read = exports.varint32write = exports.uInt64ToString = exports.int64ToString = exports.int64FromString = exports.varint64write = exports.varint64read = void 0;
    function varint64read() {
      let lowBits = 0;
      let highBits = 0;
      for (let shift = 0; shift < 28; shift += 7) {
        let b = this.buf[this.pos++];
        lowBits |= (b & 127) << shift;
        if ((b & 128) == 0) {
          this.assertBounds();
          return [lowBits, highBits];
        }
      }
      let middleByte = this.buf[this.pos++];
      lowBits |= (middleByte & 15) << 28;
      highBits = (middleByte & 112) >> 4;
      if ((middleByte & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
      for (let shift = 3; shift <= 31; shift += 7) {
        let b = this.buf[this.pos++];
        highBits |= (b & 127) << shift;
        if ((b & 128) == 0) {
          this.assertBounds();
          return [lowBits, highBits];
        }
      }
      throw new Error("invalid varint");
    }
    exports.varint64read = varint64read;
    function varint64write(lo, hi, bytes) {
      for (let i = 0; i < 28; i = i + 7) {
        const shift = lo >>> i;
        const hasNext = !(shift >>> 7 == 0 && hi == 0);
        const byte = (hasNext ? shift | 128 : shift) & 255;
        bytes.push(byte);
        if (!hasNext) {
          return;
        }
      }
      const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
      const hasMoreBits = !(hi >> 3 == 0);
      bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
      if (!hasMoreBits) {
        return;
      }
      for (let i = 3; i < 31; i = i + 7) {
        const shift = hi >>> i;
        const hasNext = !(shift >>> 7 == 0);
        const byte = (hasNext ? shift | 128 : shift) & 255;
        bytes.push(byte);
        if (!hasNext) {
          return;
        }
      }
      bytes.push(hi >>> 31 & 1);
    }
    exports.varint64write = varint64write;
    var TWO_PWR_32_DBL = 4294967296;
    function int64FromString(dec) {
      const minus = dec[0] === "-";
      if (minus) {
        dec = dec.slice(1);
      }
      const base = 1e6;
      let lowBits = 0;
      let highBits = 0;
      function add1e6digit(begin, end) {
        const digit1e6 = Number(dec.slice(begin, end));
        highBits *= base;
        lowBits = lowBits * base + digit1e6;
        if (lowBits >= TWO_PWR_32_DBL) {
          highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
          lowBits = lowBits % TWO_PWR_32_DBL;
        }
      }
      add1e6digit(-24, -18);
      add1e6digit(-18, -12);
      add1e6digit(-12, -6);
      add1e6digit(-6);
      return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
    }
    exports.int64FromString = int64FromString;
    function int64ToString(lo, hi) {
      let bits = newBits(lo, hi);
      const negative = bits.hi & 2147483648;
      if (negative) {
        bits = negate(bits.lo, bits.hi);
      }
      const result = uInt64ToString(bits.lo, bits.hi);
      return negative ? "-" + result : result;
    }
    exports.int64ToString = int64ToString;
    function uInt64ToString(lo, hi) {
      ({ lo, hi } = toUnsigned(lo, hi));
      if (hi <= 2097151) {
        return String(TWO_PWR_32_DBL * hi + lo);
      }
      const low = lo & 16777215;
      const mid = (lo >>> 24 | hi << 8) & 16777215;
      const high = hi >> 16 & 65535;
      let digitA = low + mid * 6777216 + high * 6710656;
      let digitB = mid + high * 8147497;
      let digitC = high * 2;
      const base = 1e7;
      if (digitA >= base) {
        digitB += Math.floor(digitA / base);
        digitA %= base;
      }
      if (digitB >= base) {
        digitC += Math.floor(digitB / base);
        digitB %= base;
      }
      return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
    }
    exports.uInt64ToString = uInt64ToString;
    function toUnsigned(lo, hi) {
      return { lo: lo >>> 0, hi: hi >>> 0 };
    }
    function newBits(lo, hi) {
      return { lo: lo | 0, hi: hi | 0 };
    }
    function negate(lowBits, highBits) {
      highBits = ~highBits;
      if (lowBits) {
        lowBits = ~lowBits + 1;
      } else {
        highBits += 1;
      }
      return newBits(lowBits, highBits);
    }
    var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
      const partial = String(digit1e7);
      return "0000000".slice(partial.length) + partial;
    };
    function varint32write(value, bytes) {
      if (value >= 0) {
        while (value > 127) {
          bytes.push(value & 127 | 128);
          value = value >>> 7;
        }
        bytes.push(value);
      } else {
        for (let i = 0; i < 9; i++) {
          bytes.push(value & 127 | 128);
          value = value >> 7;
        }
        bytes.push(1);
      }
    }
    exports.varint32write = varint32write;
    function varint32read() {
      let b = this.buf[this.pos++];
      let result = b & 127;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 127) << 7;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 127) << 14;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 127) << 21;
      if ((b & 128) == 0) {
        this.assertBounds();
        return result;
      }
      b = this.buf[this.pos++];
      result |= (b & 15) << 28;
      for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
        b = this.buf[this.pos++];
      if ((b & 128) != 0)
        throw new Error("invalid varint");
      this.assertBounds();
      return result >>> 0;
    }
    exports.varint32read = varint32read;
    function zzEncode(lo, hi) {
      let mask = hi >> 31;
      hi = ((hi << 1 | lo >>> 31) ^ mask) >>> 0;
      lo = (lo << 1 ^ mask) >>> 0;
      return [lo, hi];
    }
    exports.zzEncode = zzEncode;
    function zzDecode(lo, hi) {
      let mask = -(lo & 1);
      lo = ((lo >>> 1 | hi << 31) ^ mask) >>> 0;
      hi = (hi >>> 1 ^ mask) >>> 0;
      return [lo, hi];
    }
    exports.zzDecode = zzDecode;
    function readUInt32(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + buf[pos + 3] * 16777216;
    }
    exports.readUInt32 = readUInt32;
    function readInt32(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + (buf[pos + 3] << 24);
    }
    exports.readInt32 = readInt32;
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    exports.writeVarint32 = writeVarint32;
    function writeVarint64(val, buf, pos) {
      while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf[pos++] = val.lo;
    }
    exports.writeVarint64 = writeVarint64;
    function int64Length(lo, hi) {
      let part0 = lo, part1 = (lo >>> 28 | hi << 4) >>> 0, part2 = hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    }
    exports.int64Length = int64Length;
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    exports.writeFixed32 = writeFixed32;
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    exports.writeByte = writeByte;
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/binary.js
var require_binary = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/binary.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryWriter = exports.BinaryReader = exports.WireType = void 0;
    var utf8_1 = require_utf8();
    var varint_1 = require_varint();
    var WireType;
    (function(WireType2) {
      WireType2[WireType2["Varint"] = 0] = "Varint";
      WireType2[WireType2["Fixed64"] = 1] = "Fixed64";
      WireType2[WireType2["Bytes"] = 2] = "Bytes";
      WireType2[WireType2["Fixed32"] = 5] = "Fixed32";
    })(WireType || (exports.WireType = WireType = {}));
    var BinaryReader = class {
      assertBounds() {
        if (this.pos > this.len)
          throw new RangeError("premature EOF");
      }
      constructor(buf) {
        this.buf = buf ? new Uint8Array(buf) : new Uint8Array(0);
        this.pos = 0;
        this.type = 0;
        this.len = this.buf.length;
      }
      tag() {
        const tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
        if (fieldNo <= 0 || wireType < 0 || wireType > 5)
          throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
        return [fieldNo, wireType, tag];
      }
      skip(length) {
        if (typeof length === "number") {
          if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
          this.pos += length;
        } else {
          do {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
          } while (this.buf[this.pos++] & 128);
        }
        return this;
      }
      skipType(wireType) {
        switch (wireType) {
          case WireType.Varint:
            this.skip();
            break;
          case WireType.Fixed64:
            this.skip(8);
            break;
          case WireType.Bytes:
            this.skip(this.uint32());
            break;
          case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
              this.skipType(wireType);
            }
            break;
          case WireType.Fixed32:
            this.skip(4);
            break;
          default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
      }
      uint32() {
        return varint_1.varint32read.bind(this)();
      }
      int32() {
        return this.uint32() | 0;
      }
      sint32() {
        const num = this.uint32();
        return num % 2 === 1 ? (num + 1) / -2 : num / 2;
      }
      fixed32() {
        const val = (0, varint_1.readUInt32)(this.buf, this.pos);
        this.pos += 4;
        return val;
      }
      sfixed32() {
        const val = (0, varint_1.readInt32)(this.buf, this.pos);
        this.pos += 4;
        return val;
      }
      int64() {
        const [lo, hi] = varint_1.varint64read.bind(this)();
        return BigInt((0, varint_1.int64ToString)(lo, hi));
      }
      uint64() {
        const [lo, hi] = varint_1.varint64read.bind(this)();
        return BigInt((0, varint_1.uInt64ToString)(lo, hi));
      }
      sint64() {
        let [lo, hi] = varint_1.varint64read.bind(this)();
        [lo, hi] = (0, varint_1.zzDecode)(lo, hi);
        return BigInt((0, varint_1.int64ToString)(lo, hi));
      }
      fixed64() {
        const lo = this.sfixed32();
        const hi = this.sfixed32();
        return BigInt((0, varint_1.uInt64ToString)(lo, hi));
      }
      sfixed64() {
        const lo = this.sfixed32();
        const hi = this.sfixed32();
        return BigInt((0, varint_1.int64ToString)(lo, hi));
      }
      float() {
        throw new Error("float not supported");
      }
      double() {
        throw new Error("double not supported");
      }
      bool() {
        const [lo, hi] = varint_1.varint64read.bind(this)();
        return lo !== 0 || hi !== 0;
      }
      bytes() {
        const len = this.uint32(), start = this.pos;
        this.pos += len;
        this.assertBounds();
        return this.buf.subarray(start, start + len);
      }
      string() {
        const bytes = this.bytes();
        return (0, utf8_1.utf8Read)(bytes, 0, bytes.length);
      }
    };
    exports.BinaryReader = BinaryReader;
    var Op = class {
      constructor(fn, len, val) {
        this.fn = fn;
        this.len = len;
        this.val = val;
      }
      proceed(buf, pos) {
        if (this.fn) {
          this.fn(this.val, buf, pos);
        }
      }
    };
    var State = class {
      constructor(writer) {
        this.head = writer.head;
        this.tail = writer.tail;
        this.len = writer.len;
        this.next = writer.states;
      }
    };
    var BinaryWriter = class _BinaryWriter {
      constructor() {
        this.len = 0;
        this.uint64 = _BinaryWriter.prototype.int64;
        this.sfixed64 = _BinaryWriter.prototype.fixed64;
        this.sfixed32 = _BinaryWriter.prototype.fixed32;
        this.head = new Op(null, 0, 0);
        this.tail = this.head;
        this.states = null;
      }
      static create() {
        return new _BinaryWriter();
      }
      static alloc(size3) {
        if (typeof Uint8Array !== "undefined") {
          return pool((size4) => new Uint8Array(size4), Uint8Array.prototype.subarray)(size3);
        } else {
          return new Array(size3);
        }
      }
      _push(fn, len, val) {
        this.tail = this.tail.next = new Op(fn, len, val);
        this.len += len;
        return this;
      }
      finish() {
        let head = this.head.next, pos = 0;
        const buf = _BinaryWriter.alloc(this.len);
        while (head) {
          head.proceed(buf, pos);
          pos += head.len;
          head = head.next;
        }
        return buf;
      }
      fork() {
        this.states = new State(this);
        this.head = this.tail = new Op(null, 0, 0);
        this.len = 0;
        return this;
      }
      reset() {
        if (this.states) {
          this.head = this.states.head;
          this.tail = this.states.tail;
          this.len = this.states.len;
          this.states = this.states.next;
        } else {
          this.head = this.tail = new Op(null, 0, 0);
          this.len = 0;
        }
        return this;
      }
      ldelim() {
        const head = this.head, tail = this.tail, len = this.len;
        this.reset().uint32(len);
        if (len) {
          this.tail.next = head.next;
          this.tail = tail;
          this.len += len;
        }
        return this;
      }
      tag(fieldNo, type) {
        return this.uint32((fieldNo << 3 | type) >>> 0);
      }
      uint32(value) {
        this.len += (this.tail = this.tail.next = new Op(varint_1.writeVarint32, (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
        return this;
      }
      int32(value) {
        return value < 0 ? this._push(varint_1.writeVarint64, 10, (0, varint_1.int64FromString)(value.toString())) : this.uint32(value);
      }
      sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
      }
      int64(value) {
        const { lo, hi } = (0, varint_1.int64FromString)(value.toString());
        return this._push(varint_1.writeVarint64, (0, varint_1.int64Length)(lo, hi), { lo, hi });
      }
      sint64(value) {
        let { lo, hi } = (0, varint_1.int64FromString)(value.toString());
        [lo, hi] = (0, varint_1.zzEncode)(lo, hi);
        return this._push(varint_1.writeVarint64, (0, varint_1.int64Length)(lo, hi), { lo, hi });
      }
      fixed64(value) {
        const { lo, hi } = (0, varint_1.int64FromString)(value.toString());
        return this._push(varint_1.writeFixed32, 4, lo)._push(varint_1.writeFixed32, 4, hi);
      }
      bool(value) {
        return this._push(varint_1.writeByte, 1, value ? 1 : 0);
      }
      fixed32(value) {
        return this._push(varint_1.writeFixed32, 4, value >>> 0);
      }
      float(value) {
        throw new Error("float not supported" + value);
      }
      double(value) {
        throw new Error("double not supported" + value);
      }
      bytes(value) {
        const len = value.length >>> 0;
        if (!len)
          return this._push(varint_1.writeByte, 1, 0);
        return this.uint32(len)._push(writeBytes, len, value);
      }
      string(value) {
        const len = (0, utf8_1.utf8Length)(value);
        return len ? this.uint32(len)._push(utf8_1.utf8Write, len, value) : this._push(varint_1.writeByte, 1, 0);
      }
    };
    exports.BinaryWriter = BinaryWriter;
    function writeBytes(val, buf, pos) {
      if (typeof Uint8Array !== "undefined") {
        buf.set(val, pos);
      } else {
        for (let i = 0; i < val.length; ++i)
          buf[pos + i] = val[i];
      }
    }
    function pool(alloc, slice, size3) {
      const SIZE = size3 || 8192;
      const MAX = SIZE >>> 1;
      let slab = null;
      let offset = SIZE;
      return function pool_alloc(size4) {
        if (size4 < 1 || size4 > MAX)
          return alloc(size4);
        if (offset + size4 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        const buf = slice.call(slab, offset, offset += size4);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/helpers.js
var require_helpers = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/helpers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromJsonTimestamp = exports.fromTimestamp = exports.toTimestamp = exports.setPaginationParams = exports.isObject = exports.isSet = exports.fromDuration = exports.toDuration = exports.omitDefault = exports.base64FromBytes = exports.bytesFromBase64 = void 0;
    var globalThis2 = (() => {
      if (typeof globalThis2 !== "undefined")
        return globalThis2;
      if (typeof self !== "undefined")
        return self;
      if (typeof window !== "undefined")
        return window;
      if (typeof global !== "undefined")
        return global;
      throw "Unable to locate global object";
    })();
    var atob2 = globalThis2.atob || ((b64) => globalThis2.Buffer.from(b64, "base64").toString("binary"));
    function bytesFromBase64(b64) {
      const bin = atob2(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
      }
      return arr;
    }
    exports.bytesFromBase64 = bytesFromBase64;
    var btoa2 = globalThis2.btoa || ((bin) => globalThis2.Buffer.from(bin, "binary").toString("base64"));
    function base64FromBytes(arr) {
      const bin = [];
      arr.forEach((byte) => {
        bin.push(String.fromCharCode(byte));
      });
      return btoa2(bin.join(""));
    }
    exports.base64FromBytes = base64FromBytes;
    function omitDefault(input) {
      if (typeof input === "string") {
        return input === "" ? void 0 : input;
      }
      if (typeof input === "number") {
        return input === 0 ? void 0 : input;
      }
      if (typeof input === "bigint") {
        return input === BigInt(0) ? void 0 : input;
      }
      throw new Error(`Got unsupported type ${typeof input}`);
    }
    exports.omitDefault = omitDefault;
    function toDuration(duration) {
      return {
        seconds: BigInt(Math.floor(parseInt(duration) / 1e9)),
        nanos: parseInt(duration) % 1e9
      };
    }
    exports.toDuration = toDuration;
    function fromDuration(duration) {
      return (parseInt(duration.seconds.toString()) * 1e9 + duration.nanos).toString();
    }
    exports.fromDuration = fromDuration;
    function isSet(value) {
      return value !== null && value !== void 0;
    }
    exports.isSet = isSet;
    function isObject(value) {
      return typeof value === "object" && value !== null;
    }
    exports.isObject = isObject;
    var setPaginationParams = (options, pagination) => {
      if (!pagination) {
        return options;
      }
      if (typeof pagination?.countTotal !== "undefined") {
        options.params["pagination.count_total"] = pagination.countTotal;
      }
      if (typeof pagination?.key !== "undefined") {
        options.params["pagination.key"] = Buffer.from(pagination.key).toString("base64");
      }
      if (typeof pagination?.limit !== "undefined") {
        options.params["pagination.limit"] = pagination.limit.toString();
      }
      if (typeof pagination?.offset !== "undefined") {
        options.params["pagination.offset"] = pagination.offset.toString();
      }
      if (typeof pagination?.reverse !== "undefined") {
        options.params["pagination.reverse"] = pagination.reverse;
      }
      return options;
    };
    exports.setPaginationParams = setPaginationParams;
    function toTimestamp(date) {
      const seconds = numberToLong(date.getTime() / 1e3);
      const nanos = date.getTime() % 1e3 * 1e6;
      return {
        seconds,
        nanos
      };
    }
    exports.toTimestamp = toTimestamp;
    function fromTimestamp(t) {
      let millis = Number(t.seconds) * 1e3;
      millis += t.nanos / 1e6;
      return new Date(millis);
    }
    exports.fromTimestamp = fromTimestamp;
    var timestampFromJSON = (object) => {
      return {
        seconds: isSet(object.seconds) ? BigInt(object.seconds.toString()) : BigInt(0),
        nanos: isSet(object.nanos) ? Number(object.nanos) : 0
      };
    };
    function fromJsonTimestamp(o) {
      if (o instanceof Date) {
        return toTimestamp(o);
      } else if (typeof o === "string") {
        return toTimestamp(new Date(o));
      } else {
        return timestampFromJSON(o);
      }
    }
    exports.fromJsonTimestamp = fromJsonTimestamp;
    function numberToLong(number) {
      return BigInt(Math.trunc(number));
    }
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/base/query/v1beta1/pagination.js
var require_pagination = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/base/query/v1beta1/pagination.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageResponse = exports.PageRequest = exports.protobufPackage = void 0;
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmos.base.query.v1beta1";
    function createBasePageRequest() {
      return {
        key: new Uint8Array(),
        offset: BigInt(0),
        limit: BigInt(0),
        countTotal: false,
        reverse: false
      };
    }
    exports.PageRequest = {
      typeUrl: "/cosmos.base.query.v1beta1.PageRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.key.length !== 0) {
          writer.uint32(10).bytes(message.key);
        }
        if (message.offset !== BigInt(0)) {
          writer.uint32(16).uint64(message.offset);
        }
        if (message.limit !== BigInt(0)) {
          writer.uint32(24).uint64(message.limit);
        }
        if (message.countTotal === true) {
          writer.uint32(32).bool(message.countTotal);
        }
        if (message.reverse === true) {
          writer.uint32(40).bool(message.reverse);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBasePageRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.key = reader.bytes();
              break;
            case 2:
              message.offset = reader.uint64();
              break;
            case 3:
              message.limit = reader.uint64();
              break;
            case 4:
              message.countTotal = reader.bool();
              break;
            case 5:
              message.reverse = reader.bool();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBasePageRequest();
        if ((0, helpers_1.isSet)(object.key))
          obj.key = (0, helpers_1.bytesFromBase64)(object.key);
        if ((0, helpers_1.isSet)(object.offset))
          obj.offset = BigInt(object.offset.toString());
        if ((0, helpers_1.isSet)(object.limit))
          obj.limit = BigInt(object.limit.toString());
        if ((0, helpers_1.isSet)(object.countTotal))
          obj.countTotal = Boolean(object.countTotal);
        if ((0, helpers_1.isSet)(object.reverse))
          obj.reverse = Boolean(object.reverse);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.key !== void 0 && (obj.key = (0, helpers_1.base64FromBytes)(message.key !== void 0 ? message.key : new Uint8Array()));
        message.offset !== void 0 && (obj.offset = (message.offset || BigInt(0)).toString());
        message.limit !== void 0 && (obj.limit = (message.limit || BigInt(0)).toString());
        message.countTotal !== void 0 && (obj.countTotal = message.countTotal);
        message.reverse !== void 0 && (obj.reverse = message.reverse);
        return obj;
      },
      fromPartial(object) {
        const message = createBasePageRequest();
        message.key = object.key ?? new Uint8Array();
        if (object.offset !== void 0 && object.offset !== null) {
          message.offset = BigInt(object.offset.toString());
        }
        if (object.limit !== void 0 && object.limit !== null) {
          message.limit = BigInt(object.limit.toString());
        }
        message.countTotal = object.countTotal ?? false;
        message.reverse = object.reverse ?? false;
        return message;
      }
    };
    function createBasePageResponse() {
      return {
        nextKey: new Uint8Array(),
        total: BigInt(0)
      };
    }
    exports.PageResponse = {
      typeUrl: "/cosmos.base.query.v1beta1.PageResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.nextKey.length !== 0) {
          writer.uint32(10).bytes(message.nextKey);
        }
        if (message.total !== BigInt(0)) {
          writer.uint32(16).uint64(message.total);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBasePageResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.nextKey = reader.bytes();
              break;
            case 2:
              message.total = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBasePageResponse();
        if ((0, helpers_1.isSet)(object.nextKey))
          obj.nextKey = (0, helpers_1.bytesFromBase64)(object.nextKey);
        if ((0, helpers_1.isSet)(object.total))
          obj.total = BigInt(object.total.toString());
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.nextKey !== void 0 && (obj.nextKey = (0, helpers_1.base64FromBytes)(message.nextKey !== void 0 ? message.nextKey : new Uint8Array()));
        message.total !== void 0 && (obj.total = (message.total || BigInt(0)).toString());
        return obj;
      },
      fromPartial(object) {
        const message = createBasePageResponse();
        message.nextKey = object.nextKey ?? new Uint8Array();
        if (object.total !== void 0 && object.total !== null) {
          message.total = BigInt(object.total.toString());
        }
        return message;
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/google/protobuf/any.js
var require_any = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/google/protobuf/any.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Any = exports.protobufPackage = void 0;
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "google.protobuf";
    function createBaseAny() {
      return {
        typeUrl: "",
        value: new Uint8Array()
      };
    }
    exports.Any = {
      typeUrl: "/google.protobuf.Any",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.typeUrl !== "") {
          writer.uint32(10).string(message.typeUrl);
        }
        if (message.value.length !== 0) {
          writer.uint32(18).bytes(message.value);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAny();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.typeUrl = reader.string();
              break;
            case 2:
              message.value = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAny();
        if ((0, helpers_1.isSet)(object.typeUrl))
          obj.typeUrl = String(object.typeUrl);
        if ((0, helpers_1.isSet)(object.value))
          obj.value = (0, helpers_1.bytesFromBase64)(object.value);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.typeUrl !== void 0 && (obj.typeUrl = message.typeUrl);
        message.value !== void 0 && (obj.value = (0, helpers_1.base64FromBytes)(message.value !== void 0 ? message.value : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAny();
        message.typeUrl = object.typeUrl ?? "";
        message.value = object.value ?? new Uint8Array();
        return message;
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmwasm/wasm/v1/types.js
var require_types = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmwasm/wasm/v1/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = exports.AbsoluteTxPosition = exports.ContractCodeHistoryEntry = exports.ContractInfo = exports.CodeInfo = exports.Params = exports.AccessConfig = exports.AccessTypeParam = exports.contractCodeHistoryOperationTypeToJSON = exports.contractCodeHistoryOperationTypeFromJSON = exports.ContractCodeHistoryOperationType = exports.accessTypeToJSON = exports.accessTypeFromJSON = exports.AccessType = exports.protobufPackage = void 0;
    var any_1 = require_any();
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmwasm.wasm.v1";
    var AccessType;
    (function(AccessType2) {
      AccessType2[AccessType2["ACCESS_TYPE_UNSPECIFIED"] = 0] = "ACCESS_TYPE_UNSPECIFIED";
      AccessType2[AccessType2["ACCESS_TYPE_NOBODY"] = 1] = "ACCESS_TYPE_NOBODY";
      AccessType2[AccessType2["ACCESS_TYPE_ONLY_ADDRESS"] = 2] = "ACCESS_TYPE_ONLY_ADDRESS";
      AccessType2[AccessType2["ACCESS_TYPE_EVERYBODY"] = 3] = "ACCESS_TYPE_EVERYBODY";
      AccessType2[AccessType2["ACCESS_TYPE_ANY_OF_ADDRESSES"] = 4] = "ACCESS_TYPE_ANY_OF_ADDRESSES";
      AccessType2[AccessType2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
    })(AccessType || (exports.AccessType = AccessType = {}));
    function accessTypeFromJSON(object) {
      switch (object) {
        case 0:
        case "ACCESS_TYPE_UNSPECIFIED":
          return AccessType.ACCESS_TYPE_UNSPECIFIED;
        case 1:
        case "ACCESS_TYPE_NOBODY":
          return AccessType.ACCESS_TYPE_NOBODY;
        case 2:
        case "ACCESS_TYPE_ONLY_ADDRESS":
          return AccessType.ACCESS_TYPE_ONLY_ADDRESS;
        case 3:
        case "ACCESS_TYPE_EVERYBODY":
          return AccessType.ACCESS_TYPE_EVERYBODY;
        case 4:
        case "ACCESS_TYPE_ANY_OF_ADDRESSES":
          return AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES;
        case -1:
        case "UNRECOGNIZED":
        default:
          return AccessType.UNRECOGNIZED;
      }
    }
    exports.accessTypeFromJSON = accessTypeFromJSON;
    function accessTypeToJSON(object) {
      switch (object) {
        case AccessType.ACCESS_TYPE_UNSPECIFIED:
          return "ACCESS_TYPE_UNSPECIFIED";
        case AccessType.ACCESS_TYPE_NOBODY:
          return "ACCESS_TYPE_NOBODY";
        case AccessType.ACCESS_TYPE_ONLY_ADDRESS:
          return "ACCESS_TYPE_ONLY_ADDRESS";
        case AccessType.ACCESS_TYPE_EVERYBODY:
          return "ACCESS_TYPE_EVERYBODY";
        case AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES:
          return "ACCESS_TYPE_ANY_OF_ADDRESSES";
        case AccessType.UNRECOGNIZED:
        default:
          return "UNRECOGNIZED";
      }
    }
    exports.accessTypeToJSON = accessTypeToJSON;
    var ContractCodeHistoryOperationType;
    (function(ContractCodeHistoryOperationType2) {
      ContractCodeHistoryOperationType2[ContractCodeHistoryOperationType2["CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED"] = 0] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED";
      ContractCodeHistoryOperationType2[ContractCodeHistoryOperationType2["CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT"] = 1] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT";
      ContractCodeHistoryOperationType2[ContractCodeHistoryOperationType2["CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE"] = 2] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE";
      ContractCodeHistoryOperationType2[ContractCodeHistoryOperationType2["CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS"] = 3] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS";
      ContractCodeHistoryOperationType2[ContractCodeHistoryOperationType2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
    })(ContractCodeHistoryOperationType || (exports.ContractCodeHistoryOperationType = ContractCodeHistoryOperationType = {}));
    function contractCodeHistoryOperationTypeFromJSON(object) {
      switch (object) {
        case 0:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED":
          return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED;
        case 1:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT":
          return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT;
        case 2:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE":
          return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE;
        case 3:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS":
          return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS;
        case -1:
        case "UNRECOGNIZED":
        default:
          return ContractCodeHistoryOperationType.UNRECOGNIZED;
      }
    }
    exports.contractCodeHistoryOperationTypeFromJSON = contractCodeHistoryOperationTypeFromJSON;
    function contractCodeHistoryOperationTypeToJSON(object) {
      switch (object) {
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED:
          return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
          return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
          return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
          return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS";
        case ContractCodeHistoryOperationType.UNRECOGNIZED:
        default:
          return "UNRECOGNIZED";
      }
    }
    exports.contractCodeHistoryOperationTypeToJSON = contractCodeHistoryOperationTypeToJSON;
    function createBaseAccessTypeParam() {
      return {
        value: 0
      };
    }
    exports.AccessTypeParam = {
      typeUrl: "/cosmwasm.wasm.v1.AccessTypeParam",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.value !== 0) {
          writer.uint32(8).int32(message.value);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAccessTypeParam();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.value = reader.int32();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAccessTypeParam();
        if ((0, helpers_1.isSet)(object.value))
          obj.value = accessTypeFromJSON(object.value);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.value !== void 0 && (obj.value = accessTypeToJSON(message.value));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAccessTypeParam();
        message.value = object.value ?? 0;
        return message;
      }
    };
    function createBaseAccessConfig() {
      return {
        permission: 0,
        address: "",
        addresses: []
      };
    }
    exports.AccessConfig = {
      typeUrl: "/cosmwasm.wasm.v1.AccessConfig",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.permission !== 0) {
          writer.uint32(8).int32(message.permission);
        }
        if (message.address !== "") {
          writer.uint32(18).string(message.address);
        }
        for (const v of message.addresses) {
          writer.uint32(26).string(v);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAccessConfig();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.permission = reader.int32();
              break;
            case 2:
              message.address = reader.string();
              break;
            case 3:
              message.addresses.push(reader.string());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAccessConfig();
        if ((0, helpers_1.isSet)(object.permission))
          obj.permission = accessTypeFromJSON(object.permission);
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if (Array.isArray(object?.addresses))
          obj.addresses = object.addresses.map((e) => String(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.permission !== void 0 && (obj.permission = accessTypeToJSON(message.permission));
        message.address !== void 0 && (obj.address = message.address);
        if (message.addresses) {
          obj.addresses = message.addresses.map((e) => e);
        } else {
          obj.addresses = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAccessConfig();
        message.permission = object.permission ?? 0;
        message.address = object.address ?? "";
        message.addresses = object.addresses?.map((e) => e) || [];
        return message;
      }
    };
    function createBaseParams() {
      return {
        codeUploadAccess: exports.AccessConfig.fromPartial({}),
        instantiateDefaultPermission: 0
      };
    }
    exports.Params = {
      typeUrl: "/cosmwasm.wasm.v1.Params",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeUploadAccess !== void 0) {
          exports.AccessConfig.encode(message.codeUploadAccess, writer.uint32(10).fork()).ldelim();
        }
        if (message.instantiateDefaultPermission !== 0) {
          writer.uint32(16).int32(message.instantiateDefaultPermission);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeUploadAccess = exports.AccessConfig.decode(reader, reader.uint32());
              break;
            case 2:
              message.instantiateDefaultPermission = reader.int32();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseParams();
        if ((0, helpers_1.isSet)(object.codeUploadAccess))
          obj.codeUploadAccess = exports.AccessConfig.fromJSON(object.codeUploadAccess);
        if ((0, helpers_1.isSet)(object.instantiateDefaultPermission))
          obj.instantiateDefaultPermission = accessTypeFromJSON(object.instantiateDefaultPermission);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeUploadAccess !== void 0 && (obj.codeUploadAccess = message.codeUploadAccess ? exports.AccessConfig.toJSON(message.codeUploadAccess) : void 0);
        message.instantiateDefaultPermission !== void 0 && (obj.instantiateDefaultPermission = accessTypeToJSON(message.instantiateDefaultPermission));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseParams();
        if (object.codeUploadAccess !== void 0 && object.codeUploadAccess !== null) {
          message.codeUploadAccess = exports.AccessConfig.fromPartial(object.codeUploadAccess);
        }
        message.instantiateDefaultPermission = object.instantiateDefaultPermission ?? 0;
        return message;
      }
    };
    function createBaseCodeInfo() {
      return {
        codeHash: new Uint8Array(),
        creator: "",
        instantiateConfig: exports.AccessConfig.fromPartial({})
      };
    }
    exports.CodeInfo = {
      typeUrl: "/cosmwasm.wasm.v1.CodeInfo",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeHash.length !== 0) {
          writer.uint32(10).bytes(message.codeHash);
        }
        if (message.creator !== "") {
          writer.uint32(18).string(message.creator);
        }
        if (message.instantiateConfig !== void 0) {
          exports.AccessConfig.encode(message.instantiateConfig, writer.uint32(42).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseCodeInfo();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeHash = reader.bytes();
              break;
            case 2:
              message.creator = reader.string();
              break;
            case 5:
              message.instantiateConfig = exports.AccessConfig.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseCodeInfo();
        if ((0, helpers_1.isSet)(object.codeHash))
          obj.codeHash = (0, helpers_1.bytesFromBase64)(object.codeHash);
        if ((0, helpers_1.isSet)(object.creator))
          obj.creator = String(object.creator);
        if ((0, helpers_1.isSet)(object.instantiateConfig))
          obj.instantiateConfig = exports.AccessConfig.fromJSON(object.instantiateConfig);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeHash !== void 0 && (obj.codeHash = (0, helpers_1.base64FromBytes)(message.codeHash !== void 0 ? message.codeHash : new Uint8Array()));
        message.creator !== void 0 && (obj.creator = message.creator);
        message.instantiateConfig !== void 0 && (obj.instantiateConfig = message.instantiateConfig ? exports.AccessConfig.toJSON(message.instantiateConfig) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseCodeInfo();
        message.codeHash = object.codeHash ?? new Uint8Array();
        message.creator = object.creator ?? "";
        if (object.instantiateConfig !== void 0 && object.instantiateConfig !== null) {
          message.instantiateConfig = exports.AccessConfig.fromPartial(object.instantiateConfig);
        }
        return message;
      }
    };
    function createBaseContractInfo() {
      return {
        codeId: BigInt(0),
        creator: "",
        admin: "",
        label: "",
        created: void 0,
        ibcPortId: "",
        extension: void 0
      };
    }
    exports.ContractInfo = {
      typeUrl: "/cosmwasm.wasm.v1.ContractInfo",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeId !== BigInt(0)) {
          writer.uint32(8).uint64(message.codeId);
        }
        if (message.creator !== "") {
          writer.uint32(18).string(message.creator);
        }
        if (message.admin !== "") {
          writer.uint32(26).string(message.admin);
        }
        if (message.label !== "") {
          writer.uint32(34).string(message.label);
        }
        if (message.created !== void 0) {
          exports.AbsoluteTxPosition.encode(message.created, writer.uint32(42).fork()).ldelim();
        }
        if (message.ibcPortId !== "") {
          writer.uint32(50).string(message.ibcPortId);
        }
        if (message.extension !== void 0) {
          any_1.Any.encode(message.extension, writer.uint32(58).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseContractInfo();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeId = reader.uint64();
              break;
            case 2:
              message.creator = reader.string();
              break;
            case 3:
              message.admin = reader.string();
              break;
            case 4:
              message.label = reader.string();
              break;
            case 5:
              message.created = exports.AbsoluteTxPosition.decode(reader, reader.uint32());
              break;
            case 6:
              message.ibcPortId = reader.string();
              break;
            case 7:
              message.extension = any_1.Any.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseContractInfo();
        if ((0, helpers_1.isSet)(object.codeId))
          obj.codeId = BigInt(object.codeId.toString());
        if ((0, helpers_1.isSet)(object.creator))
          obj.creator = String(object.creator);
        if ((0, helpers_1.isSet)(object.admin))
          obj.admin = String(object.admin);
        if ((0, helpers_1.isSet)(object.label))
          obj.label = String(object.label);
        if ((0, helpers_1.isSet)(object.created))
          obj.created = exports.AbsoluteTxPosition.fromJSON(object.created);
        if ((0, helpers_1.isSet)(object.ibcPortId))
          obj.ibcPortId = String(object.ibcPortId);
        if ((0, helpers_1.isSet)(object.extension))
          obj.extension = any_1.Any.fromJSON(object.extension);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeId !== void 0 && (obj.codeId = (message.codeId || BigInt(0)).toString());
        message.creator !== void 0 && (obj.creator = message.creator);
        message.admin !== void 0 && (obj.admin = message.admin);
        message.label !== void 0 && (obj.label = message.label);
        message.created !== void 0 && (obj.created = message.created ? exports.AbsoluteTxPosition.toJSON(message.created) : void 0);
        message.ibcPortId !== void 0 && (obj.ibcPortId = message.ibcPortId);
        message.extension !== void 0 && (obj.extension = message.extension ? any_1.Any.toJSON(message.extension) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseContractInfo();
        if (object.codeId !== void 0 && object.codeId !== null) {
          message.codeId = BigInt(object.codeId.toString());
        }
        message.creator = object.creator ?? "";
        message.admin = object.admin ?? "";
        message.label = object.label ?? "";
        if (object.created !== void 0 && object.created !== null) {
          message.created = exports.AbsoluteTxPosition.fromPartial(object.created);
        }
        message.ibcPortId = object.ibcPortId ?? "";
        if (object.extension !== void 0 && object.extension !== null) {
          message.extension = any_1.Any.fromPartial(object.extension);
        }
        return message;
      }
    };
    function createBaseContractCodeHistoryEntry() {
      return {
        operation: 0,
        codeId: BigInt(0),
        updated: void 0,
        msg: new Uint8Array()
      };
    }
    exports.ContractCodeHistoryEntry = {
      typeUrl: "/cosmwasm.wasm.v1.ContractCodeHistoryEntry",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.operation !== 0) {
          writer.uint32(8).int32(message.operation);
        }
        if (message.codeId !== BigInt(0)) {
          writer.uint32(16).uint64(message.codeId);
        }
        if (message.updated !== void 0) {
          exports.AbsoluteTxPosition.encode(message.updated, writer.uint32(26).fork()).ldelim();
        }
        if (message.msg.length !== 0) {
          writer.uint32(34).bytes(message.msg);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseContractCodeHistoryEntry();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.operation = reader.int32();
              break;
            case 2:
              message.codeId = reader.uint64();
              break;
            case 3:
              message.updated = exports.AbsoluteTxPosition.decode(reader, reader.uint32());
              break;
            case 4:
              message.msg = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseContractCodeHistoryEntry();
        if ((0, helpers_1.isSet)(object.operation))
          obj.operation = contractCodeHistoryOperationTypeFromJSON(object.operation);
        if ((0, helpers_1.isSet)(object.codeId))
          obj.codeId = BigInt(object.codeId.toString());
        if ((0, helpers_1.isSet)(object.updated))
          obj.updated = exports.AbsoluteTxPosition.fromJSON(object.updated);
        if ((0, helpers_1.isSet)(object.msg))
          obj.msg = (0, helpers_1.bytesFromBase64)(object.msg);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.operation !== void 0 && (obj.operation = contractCodeHistoryOperationTypeToJSON(message.operation));
        message.codeId !== void 0 && (obj.codeId = (message.codeId || BigInt(0)).toString());
        message.updated !== void 0 && (obj.updated = message.updated ? exports.AbsoluteTxPosition.toJSON(message.updated) : void 0);
        message.msg !== void 0 && (obj.msg = (0, helpers_1.base64FromBytes)(message.msg !== void 0 ? message.msg : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseContractCodeHistoryEntry();
        message.operation = object.operation ?? 0;
        if (object.codeId !== void 0 && object.codeId !== null) {
          message.codeId = BigInt(object.codeId.toString());
        }
        if (object.updated !== void 0 && object.updated !== null) {
          message.updated = exports.AbsoluteTxPosition.fromPartial(object.updated);
        }
        message.msg = object.msg ?? new Uint8Array();
        return message;
      }
    };
    function createBaseAbsoluteTxPosition() {
      return {
        blockHeight: BigInt(0),
        txIndex: BigInt(0)
      };
    }
    exports.AbsoluteTxPosition = {
      typeUrl: "/cosmwasm.wasm.v1.AbsoluteTxPosition",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.blockHeight !== BigInt(0)) {
          writer.uint32(8).uint64(message.blockHeight);
        }
        if (message.txIndex !== BigInt(0)) {
          writer.uint32(16).uint64(message.txIndex);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAbsoluteTxPosition();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.blockHeight = reader.uint64();
              break;
            case 2:
              message.txIndex = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAbsoluteTxPosition();
        if ((0, helpers_1.isSet)(object.blockHeight))
          obj.blockHeight = BigInt(object.blockHeight.toString());
        if ((0, helpers_1.isSet)(object.txIndex))
          obj.txIndex = BigInt(object.txIndex.toString());
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.blockHeight !== void 0 && (obj.blockHeight = (message.blockHeight || BigInt(0)).toString());
        message.txIndex !== void 0 && (obj.txIndex = (message.txIndex || BigInt(0)).toString());
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAbsoluteTxPosition();
        if (object.blockHeight !== void 0 && object.blockHeight !== null) {
          message.blockHeight = BigInt(object.blockHeight.toString());
        }
        if (object.txIndex !== void 0 && object.txIndex !== null) {
          message.txIndex = BigInt(object.txIndex.toString());
        }
        return message;
      }
    };
    function createBaseModel() {
      return {
        key: new Uint8Array(),
        value: new Uint8Array()
      };
    }
    exports.Model = {
      typeUrl: "/cosmwasm.wasm.v1.Model",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.key.length !== 0) {
          writer.uint32(10).bytes(message.key);
        }
        if (message.value.length !== 0) {
          writer.uint32(18).bytes(message.value);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseModel();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.key = reader.bytes();
              break;
            case 2:
              message.value = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseModel();
        if ((0, helpers_1.isSet)(object.key))
          obj.key = (0, helpers_1.bytesFromBase64)(object.key);
        if ((0, helpers_1.isSet)(object.value))
          obj.value = (0, helpers_1.bytesFromBase64)(object.value);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.key !== void 0 && (obj.key = (0, helpers_1.base64FromBytes)(message.key !== void 0 ? message.key : new Uint8Array()));
        message.value !== void 0 && (obj.value = (0, helpers_1.base64FromBytes)(message.value !== void 0 ? message.value : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseModel();
        message.key = object.key ?? new Uint8Array();
        message.value = object.value ?? new Uint8Array();
        return message;
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmwasm/wasm/v1/query.js
var require_query = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmwasm/wasm/v1/query.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QueryClientImpl = exports.QueryContractsByCreatorResponse = exports.QueryContractsByCreatorRequest = exports.QueryParamsResponse = exports.QueryParamsRequest = exports.QueryPinnedCodesResponse = exports.QueryPinnedCodesRequest = exports.QueryCodesResponse = exports.QueryCodesRequest = exports.QueryCodeResponse = exports.CodeInfoResponse = exports.QueryCodeRequest = exports.QuerySmartContractStateResponse = exports.QuerySmartContractStateRequest = exports.QueryRawContractStateResponse = exports.QueryRawContractStateRequest = exports.QueryAllContractStateResponse = exports.QueryAllContractStateRequest = exports.QueryContractsByCodeResponse = exports.QueryContractsByCodeRequest = exports.QueryContractHistoryResponse = exports.QueryContractHistoryRequest = exports.QueryContractInfoResponse = exports.QueryContractInfoRequest = exports.protobufPackage = void 0;
    var pagination_1 = require_pagination();
    var types_1 = require_types();
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmwasm.wasm.v1";
    function createBaseQueryContractInfoRequest() {
      return {
        address: ""
      };
    }
    exports.QueryContractInfoRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractInfoRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractInfoRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractInfoRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractInfoRequest();
        message.address = object.address ?? "";
        return message;
      }
    };
    function createBaseQueryContractInfoResponse() {
      return {
        address: "",
        contractInfo: types_1.ContractInfo.fromPartial({})
      };
    }
    exports.QueryContractInfoResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractInfoResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.contractInfo !== void 0) {
          types_1.ContractInfo.encode(message.contractInfo, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractInfoResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.contractInfo = types_1.ContractInfo.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractInfoResponse();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.contractInfo))
          obj.contractInfo = types_1.ContractInfo.fromJSON(object.contractInfo);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.contractInfo !== void 0 && (obj.contractInfo = message.contractInfo ? types_1.ContractInfo.toJSON(message.contractInfo) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractInfoResponse();
        message.address = object.address ?? "";
        if (object.contractInfo !== void 0 && object.contractInfo !== null) {
          message.contractInfo = types_1.ContractInfo.fromPartial(object.contractInfo);
        }
        return message;
      }
    };
    function createBaseQueryContractHistoryRequest() {
      return {
        address: "",
        pagination: void 0
      };
    }
    exports.QueryContractHistoryRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractHistoryRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractHistoryRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractHistoryRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractHistoryRequest();
        message.address = object.address ?? "";
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryContractHistoryResponse() {
      return {
        entries: [],
        pagination: void 0
      };
    }
    exports.QueryContractHistoryResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractHistoryResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.entries) {
          types_1.ContractCodeHistoryEntry.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractHistoryResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.entries.push(types_1.ContractCodeHistoryEntry.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractHistoryResponse();
        if (Array.isArray(object?.entries))
          obj.entries = object.entries.map((e) => types_1.ContractCodeHistoryEntry.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.entries) {
          obj.entries = message.entries.map((e) => e ? types_1.ContractCodeHistoryEntry.toJSON(e) : void 0);
        } else {
          obj.entries = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractHistoryResponse();
        message.entries = object.entries?.map((e) => types_1.ContractCodeHistoryEntry.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryContractsByCodeRequest() {
      return {
        codeId: BigInt(0),
        pagination: void 0
      };
    }
    exports.QueryContractsByCodeRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractsByCodeRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeId !== BigInt(0)) {
          writer.uint32(8).uint64(message.codeId);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractsByCodeRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeId = reader.uint64();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractsByCodeRequest();
        if ((0, helpers_1.isSet)(object.codeId))
          obj.codeId = BigInt(object.codeId.toString());
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeId !== void 0 && (obj.codeId = (message.codeId || BigInt(0)).toString());
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractsByCodeRequest();
        if (object.codeId !== void 0 && object.codeId !== null) {
          message.codeId = BigInt(object.codeId.toString());
        }
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryContractsByCodeResponse() {
      return {
        contracts: [],
        pagination: void 0
      };
    }
    exports.QueryContractsByCodeResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractsByCodeResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.contracts) {
          writer.uint32(10).string(v);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractsByCodeResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.contracts.push(reader.string());
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractsByCodeResponse();
        if (Array.isArray(object?.contracts))
          obj.contracts = object.contracts.map((e) => String(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.contracts) {
          obj.contracts = message.contracts.map((e) => e);
        } else {
          obj.contracts = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractsByCodeResponse();
        message.contracts = object.contracts?.map((e) => e) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryAllContractStateRequest() {
      return {
        address: "",
        pagination: void 0
      };
    }
    exports.QueryAllContractStateRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryAllContractStateRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAllContractStateRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAllContractStateRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAllContractStateRequest();
        message.address = object.address ?? "";
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryAllContractStateResponse() {
      return {
        models: [],
        pagination: void 0
      };
    }
    exports.QueryAllContractStateResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryAllContractStateResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.models) {
          types_1.Model.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAllContractStateResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.models.push(types_1.Model.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAllContractStateResponse();
        if (Array.isArray(object?.models))
          obj.models = object.models.map((e) => types_1.Model.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.models) {
          obj.models = message.models.map((e) => e ? types_1.Model.toJSON(e) : void 0);
        } else {
          obj.models = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAllContractStateResponse();
        message.models = object.models?.map((e) => types_1.Model.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryRawContractStateRequest() {
      return {
        address: "",
        queryData: new Uint8Array()
      };
    }
    exports.QueryRawContractStateRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryRawContractStateRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.queryData.length !== 0) {
          writer.uint32(18).bytes(message.queryData);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryRawContractStateRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.queryData = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryRawContractStateRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.queryData))
          obj.queryData = (0, helpers_1.bytesFromBase64)(object.queryData);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.queryData !== void 0 && (obj.queryData = (0, helpers_1.base64FromBytes)(message.queryData !== void 0 ? message.queryData : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryRawContractStateRequest();
        message.address = object.address ?? "";
        message.queryData = object.queryData ?? new Uint8Array();
        return message;
      }
    };
    function createBaseQueryRawContractStateResponse() {
      return {
        data: new Uint8Array()
      };
    }
    exports.QueryRawContractStateResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryRawContractStateResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.data.length !== 0) {
          writer.uint32(10).bytes(message.data);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryRawContractStateResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryRawContractStateResponse();
        if ((0, helpers_1.isSet)(object.data))
          obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.data !== void 0 && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== void 0 ? message.data : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryRawContractStateResponse();
        message.data = object.data ?? new Uint8Array();
        return message;
      }
    };
    function createBaseQuerySmartContractStateRequest() {
      return {
        address: "",
        queryData: new Uint8Array()
      };
    }
    exports.QuerySmartContractStateRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QuerySmartContractStateRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.queryData.length !== 0) {
          writer.uint32(18).bytes(message.queryData);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySmartContractStateRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.queryData = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySmartContractStateRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.queryData))
          obj.queryData = (0, helpers_1.bytesFromBase64)(object.queryData);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.queryData !== void 0 && (obj.queryData = (0, helpers_1.base64FromBytes)(message.queryData !== void 0 ? message.queryData : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySmartContractStateRequest();
        message.address = object.address ?? "";
        message.queryData = object.queryData ?? new Uint8Array();
        return message;
      }
    };
    function createBaseQuerySmartContractStateResponse() {
      return {
        data: new Uint8Array()
      };
    }
    exports.QuerySmartContractStateResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QuerySmartContractStateResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.data.length !== 0) {
          writer.uint32(10).bytes(message.data);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySmartContractStateResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySmartContractStateResponse();
        if ((0, helpers_1.isSet)(object.data))
          obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.data !== void 0 && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== void 0 ? message.data : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySmartContractStateResponse();
        message.data = object.data ?? new Uint8Array();
        return message;
      }
    };
    function createBaseQueryCodeRequest() {
      return {
        codeId: BigInt(0)
      };
    }
    exports.QueryCodeRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryCodeRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeId !== BigInt(0)) {
          writer.uint32(8).uint64(message.codeId);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryCodeRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeId = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryCodeRequest();
        if ((0, helpers_1.isSet)(object.codeId))
          obj.codeId = BigInt(object.codeId.toString());
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeId !== void 0 && (obj.codeId = (message.codeId || BigInt(0)).toString());
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryCodeRequest();
        if (object.codeId !== void 0 && object.codeId !== null) {
          message.codeId = BigInt(object.codeId.toString());
        }
        return message;
      }
    };
    function createBaseCodeInfoResponse() {
      return {
        codeId: BigInt(0),
        creator: "",
        dataHash: new Uint8Array(),
        instantiatePermission: types_1.AccessConfig.fromPartial({})
      };
    }
    exports.CodeInfoResponse = {
      typeUrl: "/cosmwasm.wasm.v1.CodeInfoResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeId !== BigInt(0)) {
          writer.uint32(8).uint64(message.codeId);
        }
        if (message.creator !== "") {
          writer.uint32(18).string(message.creator);
        }
        if (message.dataHash.length !== 0) {
          writer.uint32(26).bytes(message.dataHash);
        }
        if (message.instantiatePermission !== void 0) {
          types_1.AccessConfig.encode(message.instantiatePermission, writer.uint32(50).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseCodeInfoResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeId = reader.uint64();
              break;
            case 2:
              message.creator = reader.string();
              break;
            case 3:
              message.dataHash = reader.bytes();
              break;
            case 6:
              message.instantiatePermission = types_1.AccessConfig.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseCodeInfoResponse();
        if ((0, helpers_1.isSet)(object.codeId))
          obj.codeId = BigInt(object.codeId.toString());
        if ((0, helpers_1.isSet)(object.creator))
          obj.creator = String(object.creator);
        if ((0, helpers_1.isSet)(object.dataHash))
          obj.dataHash = (0, helpers_1.bytesFromBase64)(object.dataHash);
        if ((0, helpers_1.isSet)(object.instantiatePermission))
          obj.instantiatePermission = types_1.AccessConfig.fromJSON(object.instantiatePermission);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeId !== void 0 && (obj.codeId = (message.codeId || BigInt(0)).toString());
        message.creator !== void 0 && (obj.creator = message.creator);
        message.dataHash !== void 0 && (obj.dataHash = (0, helpers_1.base64FromBytes)(message.dataHash !== void 0 ? message.dataHash : new Uint8Array()));
        message.instantiatePermission !== void 0 && (obj.instantiatePermission = message.instantiatePermission ? types_1.AccessConfig.toJSON(message.instantiatePermission) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseCodeInfoResponse();
        if (object.codeId !== void 0 && object.codeId !== null) {
          message.codeId = BigInt(object.codeId.toString());
        }
        message.creator = object.creator ?? "";
        message.dataHash = object.dataHash ?? new Uint8Array();
        if (object.instantiatePermission !== void 0 && object.instantiatePermission !== null) {
          message.instantiatePermission = types_1.AccessConfig.fromPartial(object.instantiatePermission);
        }
        return message;
      }
    };
    function createBaseQueryCodeResponse() {
      return {
        codeInfo: void 0,
        data: new Uint8Array()
      };
    }
    exports.QueryCodeResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryCodeResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.codeInfo !== void 0) {
          exports.CodeInfoResponse.encode(message.codeInfo, writer.uint32(10).fork()).ldelim();
        }
        if (message.data.length !== 0) {
          writer.uint32(18).bytes(message.data);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryCodeResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeInfo = exports.CodeInfoResponse.decode(reader, reader.uint32());
              break;
            case 2:
              message.data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryCodeResponse();
        if ((0, helpers_1.isSet)(object.codeInfo))
          obj.codeInfo = exports.CodeInfoResponse.fromJSON(object.codeInfo);
        if ((0, helpers_1.isSet)(object.data))
          obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.codeInfo !== void 0 && (obj.codeInfo = message.codeInfo ? exports.CodeInfoResponse.toJSON(message.codeInfo) : void 0);
        message.data !== void 0 && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== void 0 ? message.data : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryCodeResponse();
        if (object.codeInfo !== void 0 && object.codeInfo !== null) {
          message.codeInfo = exports.CodeInfoResponse.fromPartial(object.codeInfo);
        }
        message.data = object.data ?? new Uint8Array();
        return message;
      }
    };
    function createBaseQueryCodesRequest() {
      return {
        pagination: void 0
      };
    }
    exports.QueryCodesRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryCodesRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryCodesRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryCodesRequest();
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryCodesRequest();
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryCodesResponse() {
      return {
        codeInfos: [],
        pagination: void 0
      };
    }
    exports.QueryCodesResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryCodesResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.codeInfos) {
          exports.CodeInfoResponse.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryCodesResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.codeInfos.push(exports.CodeInfoResponse.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryCodesResponse();
        if (Array.isArray(object?.codeInfos))
          obj.codeInfos = object.codeInfos.map((e) => exports.CodeInfoResponse.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.codeInfos) {
          obj.codeInfos = message.codeInfos.map((e) => e ? exports.CodeInfoResponse.toJSON(e) : void 0);
        } else {
          obj.codeInfos = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryCodesResponse();
        message.codeInfos = object.codeInfos?.map((e) => exports.CodeInfoResponse.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryPinnedCodesRequest() {
      return {
        pagination: void 0
      };
    }
    exports.QueryPinnedCodesRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryPinnedCodesRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryPinnedCodesRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryPinnedCodesRequest();
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryPinnedCodesRequest();
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryPinnedCodesResponse() {
      return {
        codeIds: [],
        pagination: void 0
      };
    }
    exports.QueryPinnedCodesResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryPinnedCodesResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        writer.uint32(10).fork();
        for (const v of message.codeIds) {
          writer.uint64(v);
        }
        writer.ldelim();
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryPinnedCodesResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              if ((tag & 7) === 2) {
                const end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2) {
                  message.codeIds.push(reader.uint64());
                }
              } else {
                message.codeIds.push(reader.uint64());
              }
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryPinnedCodesResponse();
        if (Array.isArray(object?.codeIds))
          obj.codeIds = object.codeIds.map((e) => BigInt(e.toString()));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.codeIds) {
          obj.codeIds = message.codeIds.map((e) => (e || BigInt(0)).toString());
        } else {
          obj.codeIds = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryPinnedCodesResponse();
        message.codeIds = object.codeIds?.map((e) => BigInt(e.toString())) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryParamsRequest() {
      return {};
    }
    exports.QueryParamsRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryParamsRequest",
      encode(_, writer = binary_1.BinaryWriter.create()) {
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(_) {
        const obj = createBaseQueryParamsRequest();
        return obj;
      },
      toJSON(_) {
        const obj = {};
        return obj;
      },
      fromPartial(_) {
        const message = createBaseQueryParamsRequest();
        return message;
      }
    };
    function createBaseQueryParamsResponse() {
      return {
        params: types_1.Params.fromPartial({})
      };
    }
    exports.QueryParamsResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryParamsResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.params !== void 0) {
          types_1.Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.params = types_1.Params.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryParamsResponse();
        if ((0, helpers_1.isSet)(object.params))
          obj.params = types_1.Params.fromJSON(object.params);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.params !== void 0 && (obj.params = message.params ? types_1.Params.toJSON(message.params) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryParamsResponse();
        if (object.params !== void 0 && object.params !== null) {
          message.params = types_1.Params.fromPartial(object.params);
        }
        return message;
      }
    };
    function createBaseQueryContractsByCreatorRequest() {
      return {
        creatorAddress: "",
        pagination: void 0
      };
    }
    exports.QueryContractsByCreatorRequest = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractsByCreatorRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.creatorAddress !== "") {
          writer.uint32(10).string(message.creatorAddress);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractsByCreatorRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.creatorAddress = reader.string();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractsByCreatorRequest();
        if ((0, helpers_1.isSet)(object.creatorAddress))
          obj.creatorAddress = String(object.creatorAddress);
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.creatorAddress !== void 0 && (obj.creatorAddress = message.creatorAddress);
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractsByCreatorRequest();
        message.creatorAddress = object.creatorAddress ?? "";
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryContractsByCreatorResponse() {
      return {
        contractAddresses: [],
        pagination: void 0
      };
    }
    exports.QueryContractsByCreatorResponse = {
      typeUrl: "/cosmwasm.wasm.v1.QueryContractsByCreatorResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.contractAddresses) {
          writer.uint32(10).string(v);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryContractsByCreatorResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.contractAddresses.push(reader.string());
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryContractsByCreatorResponse();
        if (Array.isArray(object?.contractAddresses))
          obj.contractAddresses = object.contractAddresses.map((e) => String(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.contractAddresses) {
          obj.contractAddresses = message.contractAddresses.map((e) => e);
        } else {
          obj.contractAddresses = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryContractsByCreatorResponse();
        message.contractAddresses = object.contractAddresses?.map((e) => e) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    var QueryClientImpl = class {
      constructor(rpc) {
        this.rpc = rpc;
        this.ContractInfo = this.ContractInfo.bind(this);
        this.ContractHistory = this.ContractHistory.bind(this);
        this.ContractsByCode = this.ContractsByCode.bind(this);
        this.AllContractState = this.AllContractState.bind(this);
        this.RawContractState = this.RawContractState.bind(this);
        this.SmartContractState = this.SmartContractState.bind(this);
        this.Code = this.Code.bind(this);
        this.Codes = this.Codes.bind(this);
        this.PinnedCodes = this.PinnedCodes.bind(this);
        this.Params = this.Params.bind(this);
        this.ContractsByCreator = this.ContractsByCreator.bind(this);
      }
      ContractInfo(request) {
        const data = exports.QueryContractInfoRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "ContractInfo", data);
        return promise.then((data2) => exports.QueryContractInfoResponse.decode(new binary_1.BinaryReader(data2)));
      }
      ContractHistory(request) {
        const data = exports.QueryContractHistoryRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "ContractHistory", data);
        return promise.then((data2) => exports.QueryContractHistoryResponse.decode(new binary_1.BinaryReader(data2)));
      }
      ContractsByCode(request) {
        const data = exports.QueryContractsByCodeRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "ContractsByCode", data);
        return promise.then((data2) => exports.QueryContractsByCodeResponse.decode(new binary_1.BinaryReader(data2)));
      }
      AllContractState(request) {
        const data = exports.QueryAllContractStateRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "AllContractState", data);
        return promise.then((data2) => exports.QueryAllContractStateResponse.decode(new binary_1.BinaryReader(data2)));
      }
      RawContractState(request) {
        const data = exports.QueryRawContractStateRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "RawContractState", data);
        return promise.then((data2) => exports.QueryRawContractStateResponse.decode(new binary_1.BinaryReader(data2)));
      }
      SmartContractState(request) {
        const data = exports.QuerySmartContractStateRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "SmartContractState", data);
        return promise.then((data2) => exports.QuerySmartContractStateResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Code(request) {
        const data = exports.QueryCodeRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "Code", data);
        return promise.then((data2) => exports.QueryCodeResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Codes(request = {
        pagination: pagination_1.PageRequest.fromPartial({})
      }) {
        const data = exports.QueryCodesRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "Codes", data);
        return promise.then((data2) => exports.QueryCodesResponse.decode(new binary_1.BinaryReader(data2)));
      }
      PinnedCodes(request = {
        pagination: pagination_1.PageRequest.fromPartial({})
      }) {
        const data = exports.QueryPinnedCodesRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "PinnedCodes", data);
        return promise.then((data2) => exports.QueryPinnedCodesResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Params(request = {}) {
        const data = exports.QueryParamsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "Params", data);
        return promise.then((data2) => exports.QueryParamsResponse.decode(new binary_1.BinaryReader(data2)));
      }
      ContractsByCreator(request) {
        const data = exports.QueryContractsByCreatorRequest.encode(request).finish();
        const promise = this.rpc.request("cosmwasm.wasm.v1.Query", "ContractsByCreator", data);
        return promise.then((data2) => exports.QueryContractsByCreatorResponse.decode(new binary_1.BinaryReader(data2)));
      }
    };
    exports.QueryClientImpl = QueryClientImpl;
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/auth/v1beta1/auth.js
var require_auth = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/auth/v1beta1/auth.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Params = exports.ModuleCredential = exports.ModuleAccount = exports.BaseAccount = exports.protobufPackage = void 0;
    var any_1 = require_any();
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmos.auth.v1beta1";
    function createBaseBaseAccount() {
      return {
        address: "",
        pubKey: void 0,
        accountNumber: BigInt(0),
        sequence: BigInt(0)
      };
    }
    exports.BaseAccount = {
      typeUrl: "/cosmos.auth.v1beta1.BaseAccount",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.pubKey !== void 0) {
          any_1.Any.encode(message.pubKey, writer.uint32(18).fork()).ldelim();
        }
        if (message.accountNumber !== BigInt(0)) {
          writer.uint32(24).uint64(message.accountNumber);
        }
        if (message.sequence !== BigInt(0)) {
          writer.uint32(32).uint64(message.sequence);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseBaseAccount();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.pubKey = any_1.Any.decode(reader, reader.uint32());
              break;
            case 3:
              message.accountNumber = reader.uint64();
              break;
            case 4:
              message.sequence = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseBaseAccount();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.pubKey))
          obj.pubKey = any_1.Any.fromJSON(object.pubKey);
        if ((0, helpers_1.isSet)(object.accountNumber))
          obj.accountNumber = BigInt(object.accountNumber.toString());
        if ((0, helpers_1.isSet)(object.sequence))
          obj.sequence = BigInt(object.sequence.toString());
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.pubKey !== void 0 && (obj.pubKey = message.pubKey ? any_1.Any.toJSON(message.pubKey) : void 0);
        message.accountNumber !== void 0 && (obj.accountNumber = (message.accountNumber || BigInt(0)).toString());
        message.sequence !== void 0 && (obj.sequence = (message.sequence || BigInt(0)).toString());
        return obj;
      },
      fromPartial(object) {
        const message = createBaseBaseAccount();
        message.address = object.address ?? "";
        if (object.pubKey !== void 0 && object.pubKey !== null) {
          message.pubKey = any_1.Any.fromPartial(object.pubKey);
        }
        if (object.accountNumber !== void 0 && object.accountNumber !== null) {
          message.accountNumber = BigInt(object.accountNumber.toString());
        }
        if (object.sequence !== void 0 && object.sequence !== null) {
          message.sequence = BigInt(object.sequence.toString());
        }
        return message;
      }
    };
    function createBaseModuleAccount() {
      return {
        baseAccount: void 0,
        name: "",
        permissions: []
      };
    }
    exports.ModuleAccount = {
      typeUrl: "/cosmos.auth.v1beta1.ModuleAccount",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.baseAccount !== void 0) {
          exports.BaseAccount.encode(message.baseAccount, writer.uint32(10).fork()).ldelim();
        }
        if (message.name !== "") {
          writer.uint32(18).string(message.name);
        }
        for (const v of message.permissions) {
          writer.uint32(26).string(v);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseModuleAccount();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.baseAccount = exports.BaseAccount.decode(reader, reader.uint32());
              break;
            case 2:
              message.name = reader.string();
              break;
            case 3:
              message.permissions.push(reader.string());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseModuleAccount();
        if ((0, helpers_1.isSet)(object.baseAccount))
          obj.baseAccount = exports.BaseAccount.fromJSON(object.baseAccount);
        if ((0, helpers_1.isSet)(object.name))
          obj.name = String(object.name);
        if (Array.isArray(object?.permissions))
          obj.permissions = object.permissions.map((e) => String(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.baseAccount !== void 0 && (obj.baseAccount = message.baseAccount ? exports.BaseAccount.toJSON(message.baseAccount) : void 0);
        message.name !== void 0 && (obj.name = message.name);
        if (message.permissions) {
          obj.permissions = message.permissions.map((e) => e);
        } else {
          obj.permissions = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseModuleAccount();
        if (object.baseAccount !== void 0 && object.baseAccount !== null) {
          message.baseAccount = exports.BaseAccount.fromPartial(object.baseAccount);
        }
        message.name = object.name ?? "";
        message.permissions = object.permissions?.map((e) => e) || [];
        return message;
      }
    };
    function createBaseModuleCredential() {
      return {
        moduleName: "",
        derivationKeys: []
      };
    }
    exports.ModuleCredential = {
      typeUrl: "/cosmos.auth.v1beta1.ModuleCredential",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.moduleName !== "") {
          writer.uint32(10).string(message.moduleName);
        }
        for (const v of message.derivationKeys) {
          writer.uint32(18).bytes(v);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseModuleCredential();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.moduleName = reader.string();
              break;
            case 2:
              message.derivationKeys.push(reader.bytes());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseModuleCredential();
        if ((0, helpers_1.isSet)(object.moduleName))
          obj.moduleName = String(object.moduleName);
        if (Array.isArray(object?.derivationKeys))
          obj.derivationKeys = object.derivationKeys.map((e) => (0, helpers_1.bytesFromBase64)(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.moduleName !== void 0 && (obj.moduleName = message.moduleName);
        if (message.derivationKeys) {
          obj.derivationKeys = message.derivationKeys.map((e) => (0, helpers_1.base64FromBytes)(e !== void 0 ? e : new Uint8Array()));
        } else {
          obj.derivationKeys = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseModuleCredential();
        message.moduleName = object.moduleName ?? "";
        message.derivationKeys = object.derivationKeys?.map((e) => e) || [];
        return message;
      }
    };
    function createBaseParams() {
      return {
        maxMemoCharacters: BigInt(0),
        txSigLimit: BigInt(0),
        txSizeCostPerByte: BigInt(0),
        sigVerifyCostEd25519: BigInt(0),
        sigVerifyCostSecp256k1: BigInt(0)
      };
    }
    exports.Params = {
      typeUrl: "/cosmos.auth.v1beta1.Params",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.maxMemoCharacters !== BigInt(0)) {
          writer.uint32(8).uint64(message.maxMemoCharacters);
        }
        if (message.txSigLimit !== BigInt(0)) {
          writer.uint32(16).uint64(message.txSigLimit);
        }
        if (message.txSizeCostPerByte !== BigInt(0)) {
          writer.uint32(24).uint64(message.txSizeCostPerByte);
        }
        if (message.sigVerifyCostEd25519 !== BigInt(0)) {
          writer.uint32(32).uint64(message.sigVerifyCostEd25519);
        }
        if (message.sigVerifyCostSecp256k1 !== BigInt(0)) {
          writer.uint32(40).uint64(message.sigVerifyCostSecp256k1);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.maxMemoCharacters = reader.uint64();
              break;
            case 2:
              message.txSigLimit = reader.uint64();
              break;
            case 3:
              message.txSizeCostPerByte = reader.uint64();
              break;
            case 4:
              message.sigVerifyCostEd25519 = reader.uint64();
              break;
            case 5:
              message.sigVerifyCostSecp256k1 = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseParams();
        if ((0, helpers_1.isSet)(object.maxMemoCharacters))
          obj.maxMemoCharacters = BigInt(object.maxMemoCharacters.toString());
        if ((0, helpers_1.isSet)(object.txSigLimit))
          obj.txSigLimit = BigInt(object.txSigLimit.toString());
        if ((0, helpers_1.isSet)(object.txSizeCostPerByte))
          obj.txSizeCostPerByte = BigInt(object.txSizeCostPerByte.toString());
        if ((0, helpers_1.isSet)(object.sigVerifyCostEd25519))
          obj.sigVerifyCostEd25519 = BigInt(object.sigVerifyCostEd25519.toString());
        if ((0, helpers_1.isSet)(object.sigVerifyCostSecp256k1))
          obj.sigVerifyCostSecp256k1 = BigInt(object.sigVerifyCostSecp256k1.toString());
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.maxMemoCharacters !== void 0 && (obj.maxMemoCharacters = (message.maxMemoCharacters || BigInt(0)).toString());
        message.txSigLimit !== void 0 && (obj.txSigLimit = (message.txSigLimit || BigInt(0)).toString());
        message.txSizeCostPerByte !== void 0 && (obj.txSizeCostPerByte = (message.txSizeCostPerByte || BigInt(0)).toString());
        message.sigVerifyCostEd25519 !== void 0 && (obj.sigVerifyCostEd25519 = (message.sigVerifyCostEd25519 || BigInt(0)).toString());
        message.sigVerifyCostSecp256k1 !== void 0 && (obj.sigVerifyCostSecp256k1 = (message.sigVerifyCostSecp256k1 || BigInt(0)).toString());
        return obj;
      },
      fromPartial(object) {
        const message = createBaseParams();
        if (object.maxMemoCharacters !== void 0 && object.maxMemoCharacters !== null) {
          message.maxMemoCharacters = BigInt(object.maxMemoCharacters.toString());
        }
        if (object.txSigLimit !== void 0 && object.txSigLimit !== null) {
          message.txSigLimit = BigInt(object.txSigLimit.toString());
        }
        if (object.txSizeCostPerByte !== void 0 && object.txSizeCostPerByte !== null) {
          message.txSizeCostPerByte = BigInt(object.txSizeCostPerByte.toString());
        }
        if (object.sigVerifyCostEd25519 !== void 0 && object.sigVerifyCostEd25519 !== null) {
          message.sigVerifyCostEd25519 = BigInt(object.sigVerifyCostEd25519.toString());
        }
        if (object.sigVerifyCostSecp256k1 !== void 0 && object.sigVerifyCostSecp256k1 !== null) {
          message.sigVerifyCostSecp256k1 = BigInt(object.sigVerifyCostSecp256k1.toString());
        }
        return message;
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/auth/v1beta1/query.js
var require_query2 = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/auth/v1beta1/query.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QueryClientImpl = exports.QueryAccountInfoResponse = exports.QueryAccountInfoRequest = exports.QueryAccountAddressByIDResponse = exports.QueryAccountAddressByIDRequest = exports.AddressStringToBytesResponse = exports.AddressStringToBytesRequest = exports.AddressBytesToStringResponse = exports.AddressBytesToStringRequest = exports.Bech32PrefixResponse = exports.Bech32PrefixRequest = exports.QueryModuleAccountByNameResponse = exports.QueryModuleAccountByNameRequest = exports.QueryModuleAccountsResponse = exports.QueryModuleAccountsRequest = exports.QueryParamsResponse = exports.QueryParamsRequest = exports.QueryAccountResponse = exports.QueryAccountRequest = exports.QueryAccountsResponse = exports.QueryAccountsRequest = exports.protobufPackage = void 0;
    var pagination_1 = require_pagination();
    var any_1 = require_any();
    var auth_1 = require_auth();
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmos.auth.v1beta1";
    function createBaseQueryAccountsRequest() {
      return {
        pagination: void 0
      };
    }
    exports.QueryAccountsRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountsRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountsRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountsRequest();
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountsRequest();
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryAccountsResponse() {
      return {
        accounts: [],
        pagination: void 0
      };
    }
    exports.QueryAccountsResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountsResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.accounts) {
          any_1.Any.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountsResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.accounts.push(any_1.Any.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountsResponse();
        if (Array.isArray(object?.accounts))
          obj.accounts = object.accounts.map((e) => any_1.Any.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.accounts) {
          obj.accounts = message.accounts.map((e) => e ? any_1.Any.toJSON(e) : void 0);
        } else {
          obj.accounts = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountsResponse();
        message.accounts = object.accounts?.map((e) => any_1.Any.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryAccountRequest() {
      return {
        address: ""
      };
    }
    exports.QueryAccountRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountRequest();
        message.address = object.address ?? "";
        return message;
      }
    };
    function createBaseQueryAccountResponse() {
      return {
        account: void 0
      };
    }
    exports.QueryAccountResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.account !== void 0) {
          any_1.Any.encode(message.account, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.account = any_1.Any.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountResponse();
        if ((0, helpers_1.isSet)(object.account))
          obj.account = any_1.Any.fromJSON(object.account);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.account !== void 0 && (obj.account = message.account ? any_1.Any.toJSON(message.account) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountResponse();
        if (object.account !== void 0 && object.account !== null) {
          message.account = any_1.Any.fromPartial(object.account);
        }
        return message;
      }
    };
    function createBaseQueryParamsRequest() {
      return {};
    }
    exports.QueryParamsRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryParamsRequest",
      encode(_, writer = binary_1.BinaryWriter.create()) {
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(_) {
        const obj = createBaseQueryParamsRequest();
        return obj;
      },
      toJSON(_) {
        const obj = {};
        return obj;
      },
      fromPartial(_) {
        const message = createBaseQueryParamsRequest();
        return message;
      }
    };
    function createBaseQueryParamsResponse() {
      return {
        params: auth_1.Params.fromPartial({})
      };
    }
    exports.QueryParamsResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryParamsResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.params !== void 0) {
          auth_1.Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.params = auth_1.Params.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryParamsResponse();
        if ((0, helpers_1.isSet)(object.params))
          obj.params = auth_1.Params.fromJSON(object.params);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.params !== void 0 && (obj.params = message.params ? auth_1.Params.toJSON(message.params) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryParamsResponse();
        if (object.params !== void 0 && object.params !== null) {
          message.params = auth_1.Params.fromPartial(object.params);
        }
        return message;
      }
    };
    function createBaseQueryModuleAccountsRequest() {
      return {};
    }
    exports.QueryModuleAccountsRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryModuleAccountsRequest",
      encode(_, writer = binary_1.BinaryWriter.create()) {
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryModuleAccountsRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(_) {
        const obj = createBaseQueryModuleAccountsRequest();
        return obj;
      },
      toJSON(_) {
        const obj = {};
        return obj;
      },
      fromPartial(_) {
        const message = createBaseQueryModuleAccountsRequest();
        return message;
      }
    };
    function createBaseQueryModuleAccountsResponse() {
      return {
        accounts: []
      };
    }
    exports.QueryModuleAccountsResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryModuleAccountsResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.accounts) {
          any_1.Any.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryModuleAccountsResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.accounts.push(any_1.Any.decode(reader, reader.uint32()));
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryModuleAccountsResponse();
        if (Array.isArray(object?.accounts))
          obj.accounts = object.accounts.map((e) => any_1.Any.fromJSON(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.accounts) {
          obj.accounts = message.accounts.map((e) => e ? any_1.Any.toJSON(e) : void 0);
        } else {
          obj.accounts = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryModuleAccountsResponse();
        message.accounts = object.accounts?.map((e) => any_1.Any.fromPartial(e)) || [];
        return message;
      }
    };
    function createBaseQueryModuleAccountByNameRequest() {
      return {
        name: ""
      };
    }
    exports.QueryModuleAccountByNameRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryModuleAccountByNameRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.name !== "") {
          writer.uint32(10).string(message.name);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryModuleAccountByNameRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.name = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryModuleAccountByNameRequest();
        if ((0, helpers_1.isSet)(object.name))
          obj.name = String(object.name);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.name !== void 0 && (obj.name = message.name);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryModuleAccountByNameRequest();
        message.name = object.name ?? "";
        return message;
      }
    };
    function createBaseQueryModuleAccountByNameResponse() {
      return {
        account: void 0
      };
    }
    exports.QueryModuleAccountByNameResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryModuleAccountByNameResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.account !== void 0) {
          any_1.Any.encode(message.account, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryModuleAccountByNameResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.account = any_1.Any.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryModuleAccountByNameResponse();
        if ((0, helpers_1.isSet)(object.account))
          obj.account = any_1.Any.fromJSON(object.account);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.account !== void 0 && (obj.account = message.account ? any_1.Any.toJSON(message.account) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryModuleAccountByNameResponse();
        if (object.account !== void 0 && object.account !== null) {
          message.account = any_1.Any.fromPartial(object.account);
        }
        return message;
      }
    };
    function createBaseBech32PrefixRequest() {
      return {};
    }
    exports.Bech32PrefixRequest = {
      typeUrl: "/cosmos.auth.v1beta1.Bech32PrefixRequest",
      encode(_, writer = binary_1.BinaryWriter.create()) {
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseBech32PrefixRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(_) {
        const obj = createBaseBech32PrefixRequest();
        return obj;
      },
      toJSON(_) {
        const obj = {};
        return obj;
      },
      fromPartial(_) {
        const message = createBaseBech32PrefixRequest();
        return message;
      }
    };
    function createBaseBech32PrefixResponse() {
      return {
        bech32Prefix: ""
      };
    }
    exports.Bech32PrefixResponse = {
      typeUrl: "/cosmos.auth.v1beta1.Bech32PrefixResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.bech32Prefix !== "") {
          writer.uint32(10).string(message.bech32Prefix);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseBech32PrefixResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.bech32Prefix = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseBech32PrefixResponse();
        if ((0, helpers_1.isSet)(object.bech32Prefix))
          obj.bech32Prefix = String(object.bech32Prefix);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.bech32Prefix !== void 0 && (obj.bech32Prefix = message.bech32Prefix);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseBech32PrefixResponse();
        message.bech32Prefix = object.bech32Prefix ?? "";
        return message;
      }
    };
    function createBaseAddressBytesToStringRequest() {
      return {
        addressBytes: new Uint8Array()
      };
    }
    exports.AddressBytesToStringRequest = {
      typeUrl: "/cosmos.auth.v1beta1.AddressBytesToStringRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.addressBytes.length !== 0) {
          writer.uint32(10).bytes(message.addressBytes);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAddressBytesToStringRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.addressBytes = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAddressBytesToStringRequest();
        if ((0, helpers_1.isSet)(object.addressBytes))
          obj.addressBytes = (0, helpers_1.bytesFromBase64)(object.addressBytes);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.addressBytes !== void 0 && (obj.addressBytes = (0, helpers_1.base64FromBytes)(message.addressBytes !== void 0 ? message.addressBytes : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAddressBytesToStringRequest();
        message.addressBytes = object.addressBytes ?? new Uint8Array();
        return message;
      }
    };
    function createBaseAddressBytesToStringResponse() {
      return {
        addressString: ""
      };
    }
    exports.AddressBytesToStringResponse = {
      typeUrl: "/cosmos.auth.v1beta1.AddressBytesToStringResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.addressString !== "") {
          writer.uint32(10).string(message.addressString);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAddressBytesToStringResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.addressString = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAddressBytesToStringResponse();
        if ((0, helpers_1.isSet)(object.addressString))
          obj.addressString = String(object.addressString);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.addressString !== void 0 && (obj.addressString = message.addressString);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAddressBytesToStringResponse();
        message.addressString = object.addressString ?? "";
        return message;
      }
    };
    function createBaseAddressStringToBytesRequest() {
      return {
        addressString: ""
      };
    }
    exports.AddressStringToBytesRequest = {
      typeUrl: "/cosmos.auth.v1beta1.AddressStringToBytesRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.addressString !== "") {
          writer.uint32(10).string(message.addressString);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAddressStringToBytesRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.addressString = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAddressStringToBytesRequest();
        if ((0, helpers_1.isSet)(object.addressString))
          obj.addressString = String(object.addressString);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.addressString !== void 0 && (obj.addressString = message.addressString);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAddressStringToBytesRequest();
        message.addressString = object.addressString ?? "";
        return message;
      }
    };
    function createBaseAddressStringToBytesResponse() {
      return {
        addressBytes: new Uint8Array()
      };
    }
    exports.AddressStringToBytesResponse = {
      typeUrl: "/cosmos.auth.v1beta1.AddressStringToBytesResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.addressBytes.length !== 0) {
          writer.uint32(10).bytes(message.addressBytes);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseAddressStringToBytesResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.addressBytes = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseAddressStringToBytesResponse();
        if ((0, helpers_1.isSet)(object.addressBytes))
          obj.addressBytes = (0, helpers_1.bytesFromBase64)(object.addressBytes);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.addressBytes !== void 0 && (obj.addressBytes = (0, helpers_1.base64FromBytes)(message.addressBytes !== void 0 ? message.addressBytes : new Uint8Array()));
        return obj;
      },
      fromPartial(object) {
        const message = createBaseAddressStringToBytesResponse();
        message.addressBytes = object.addressBytes ?? new Uint8Array();
        return message;
      }
    };
    function createBaseQueryAccountAddressByIDRequest() {
      return {
        id: BigInt(0),
        accountId: BigInt(0)
      };
    }
    exports.QueryAccountAddressByIDRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountAddressByIDRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.id !== BigInt(0)) {
          writer.uint32(8).int64(message.id);
        }
        if (message.accountId !== BigInt(0)) {
          writer.uint32(16).uint64(message.accountId);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountAddressByIDRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.id = reader.int64();
              break;
            case 2:
              message.accountId = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountAddressByIDRequest();
        if ((0, helpers_1.isSet)(object.id))
          obj.id = BigInt(object.id.toString());
        if ((0, helpers_1.isSet)(object.accountId))
          obj.accountId = BigInt(object.accountId.toString());
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.id !== void 0 && (obj.id = (message.id || BigInt(0)).toString());
        message.accountId !== void 0 && (obj.accountId = (message.accountId || BigInt(0)).toString());
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountAddressByIDRequest();
        if (object.id !== void 0 && object.id !== null) {
          message.id = BigInt(object.id.toString());
        }
        if (object.accountId !== void 0 && object.accountId !== null) {
          message.accountId = BigInt(object.accountId.toString());
        }
        return message;
      }
    };
    function createBaseQueryAccountAddressByIDResponse() {
      return {
        accountAddress: ""
      };
    }
    exports.QueryAccountAddressByIDResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountAddressByIDResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.accountAddress !== "") {
          writer.uint32(10).string(message.accountAddress);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountAddressByIDResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.accountAddress = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountAddressByIDResponse();
        if ((0, helpers_1.isSet)(object.accountAddress))
          obj.accountAddress = String(object.accountAddress);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.accountAddress !== void 0 && (obj.accountAddress = message.accountAddress);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountAddressByIDResponse();
        message.accountAddress = object.accountAddress ?? "";
        return message;
      }
    };
    function createBaseQueryAccountInfoRequest() {
      return {
        address: ""
      };
    }
    exports.QueryAccountInfoRequest = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountInfoRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountInfoRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountInfoRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountInfoRequest();
        message.address = object.address ?? "";
        return message;
      }
    };
    function createBaseQueryAccountInfoResponse() {
      return {
        info: void 0
      };
    }
    exports.QueryAccountInfoResponse = {
      typeUrl: "/cosmos.auth.v1beta1.QueryAccountInfoResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.info !== void 0) {
          auth_1.BaseAccount.encode(message.info, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAccountInfoResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.info = auth_1.BaseAccount.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAccountInfoResponse();
        if ((0, helpers_1.isSet)(object.info))
          obj.info = auth_1.BaseAccount.fromJSON(object.info);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.info !== void 0 && (obj.info = message.info ? auth_1.BaseAccount.toJSON(message.info) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAccountInfoResponse();
        if (object.info !== void 0 && object.info !== null) {
          message.info = auth_1.BaseAccount.fromPartial(object.info);
        }
        return message;
      }
    };
    var QueryClientImpl = class {
      constructor(rpc) {
        this.rpc = rpc;
        this.Accounts = this.Accounts.bind(this);
        this.Account = this.Account.bind(this);
        this.AccountAddressByID = this.AccountAddressByID.bind(this);
        this.Params = this.Params.bind(this);
        this.ModuleAccounts = this.ModuleAccounts.bind(this);
        this.ModuleAccountByName = this.ModuleAccountByName.bind(this);
        this.Bech32Prefix = this.Bech32Prefix.bind(this);
        this.AddressBytesToString = this.AddressBytesToString.bind(this);
        this.AddressStringToBytes = this.AddressStringToBytes.bind(this);
        this.AccountInfo = this.AccountInfo.bind(this);
      }
      Accounts(request = {
        pagination: pagination_1.PageRequest.fromPartial({})
      }) {
        const data = exports.QueryAccountsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "Accounts", data);
        return promise.then((data2) => exports.QueryAccountsResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Account(request) {
        const data = exports.QueryAccountRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "Account", data);
        return promise.then((data2) => exports.QueryAccountResponse.decode(new binary_1.BinaryReader(data2)));
      }
      AccountAddressByID(request) {
        const data = exports.QueryAccountAddressByIDRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "AccountAddressByID", data);
        return promise.then((data2) => exports.QueryAccountAddressByIDResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Params(request = {}) {
        const data = exports.QueryParamsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "Params", data);
        return promise.then((data2) => exports.QueryParamsResponse.decode(new binary_1.BinaryReader(data2)));
      }
      ModuleAccounts(request = {}) {
        const data = exports.QueryModuleAccountsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "ModuleAccounts", data);
        return promise.then((data2) => exports.QueryModuleAccountsResponse.decode(new binary_1.BinaryReader(data2)));
      }
      ModuleAccountByName(request) {
        const data = exports.QueryModuleAccountByNameRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "ModuleAccountByName", data);
        return promise.then((data2) => exports.QueryModuleAccountByNameResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Bech32Prefix(request = {}) {
        const data = exports.Bech32PrefixRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "Bech32Prefix", data);
        return promise.then((data2) => exports.Bech32PrefixResponse.decode(new binary_1.BinaryReader(data2)));
      }
      AddressBytesToString(request) {
        const data = exports.AddressBytesToStringRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "AddressBytesToString", data);
        return promise.then((data2) => exports.AddressBytesToStringResponse.decode(new binary_1.BinaryReader(data2)));
      }
      AddressStringToBytes(request) {
        const data = exports.AddressStringToBytesRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "AddressStringToBytes", data);
        return promise.then((data2) => exports.AddressStringToBytesResponse.decode(new binary_1.BinaryReader(data2)));
      }
      AccountInfo(request) {
        const data = exports.QueryAccountInfoRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.auth.v1beta1.Query", "AccountInfo", data);
        return promise.then((data2) => exports.QueryAccountInfoResponse.decode(new binary_1.BinaryReader(data2)));
      }
    };
    exports.QueryClientImpl = QueryClientImpl;
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/base/v1beta1/coin.js
var require_coin = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/base/v1beta1/coin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DecProto = exports.IntProto = exports.DecCoin = exports.Coin = exports.protobufPackage = void 0;
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmos.base.v1beta1";
    function createBaseCoin() {
      return {
        denom: "",
        amount: ""
      };
    }
    exports.Coin = {
      typeUrl: "/cosmos.base.v1beta1.Coin",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
          writer.uint32(18).string(message.amount);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseCoin();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            case 2:
              message.amount = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseCoin();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        if ((0, helpers_1.isSet)(object.amount))
          obj.amount = String(object.amount);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        message.amount !== void 0 && (obj.amount = message.amount);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseCoin();
        message.denom = object.denom ?? "";
        message.amount = object.amount ?? "";
        return message;
      }
    };
    function createBaseDecCoin() {
      return {
        denom: "",
        amount: ""
      };
    }
    exports.DecCoin = {
      typeUrl: "/cosmos.base.v1beta1.DecCoin",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
          writer.uint32(18).string(message.amount);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseDecCoin();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            case 2:
              message.amount = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseDecCoin();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        if ((0, helpers_1.isSet)(object.amount))
          obj.amount = String(object.amount);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        message.amount !== void 0 && (obj.amount = message.amount);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseDecCoin();
        message.denom = object.denom ?? "";
        message.amount = object.amount ?? "";
        return message;
      }
    };
    function createBaseIntProto() {
      return {
        int: ""
      };
    }
    exports.IntProto = {
      typeUrl: "/cosmos.base.v1beta1.IntProto",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.int !== "") {
          writer.uint32(10).string(message.int);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseIntProto();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.int = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseIntProto();
        if ((0, helpers_1.isSet)(object.int))
          obj.int = String(object.int);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.int !== void 0 && (obj.int = message.int);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseIntProto();
        message.int = object.int ?? "";
        return message;
      }
    };
    function createBaseDecProto() {
      return {
        dec: ""
      };
    }
    exports.DecProto = {
      typeUrl: "/cosmos.base.v1beta1.DecProto",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.dec !== "") {
          writer.uint32(10).string(message.dec);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseDecProto();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.dec = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseDecProto();
        if ((0, helpers_1.isSet)(object.dec))
          obj.dec = String(object.dec);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.dec !== void 0 && (obj.dec = message.dec);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseDecProto();
        message.dec = object.dec ?? "";
        return message;
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/bank/v1beta1/bank.js
var require_bank = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/bank/v1beta1/bank.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Metadata = exports.DenomUnit = exports.Supply = exports.Output = exports.Input = exports.SendEnabled = exports.Params = exports.protobufPackage = void 0;
    var coin_1 = require_coin();
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmos.bank.v1beta1";
    function createBaseParams() {
      return {
        sendEnabled: [],
        defaultSendEnabled: false
      };
    }
    exports.Params = {
      typeUrl: "/cosmos.bank.v1beta1.Params",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.sendEnabled) {
          exports.SendEnabled.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.defaultSendEnabled === true) {
          writer.uint32(16).bool(message.defaultSendEnabled);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.sendEnabled.push(exports.SendEnabled.decode(reader, reader.uint32()));
              break;
            case 2:
              message.defaultSendEnabled = reader.bool();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseParams();
        if (Array.isArray(object?.sendEnabled))
          obj.sendEnabled = object.sendEnabled.map((e) => exports.SendEnabled.fromJSON(e));
        if ((0, helpers_1.isSet)(object.defaultSendEnabled))
          obj.defaultSendEnabled = Boolean(object.defaultSendEnabled);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.sendEnabled) {
          obj.sendEnabled = message.sendEnabled.map((e) => e ? exports.SendEnabled.toJSON(e) : void 0);
        } else {
          obj.sendEnabled = [];
        }
        message.defaultSendEnabled !== void 0 && (obj.defaultSendEnabled = message.defaultSendEnabled);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseParams();
        message.sendEnabled = object.sendEnabled?.map((e) => exports.SendEnabled.fromPartial(e)) || [];
        message.defaultSendEnabled = object.defaultSendEnabled ?? false;
        return message;
      }
    };
    function createBaseSendEnabled() {
      return {
        denom: "",
        enabled: false
      };
    }
    exports.SendEnabled = {
      typeUrl: "/cosmos.bank.v1beta1.SendEnabled",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        if (message.enabled === true) {
          writer.uint32(16).bool(message.enabled);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseSendEnabled();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            case 2:
              message.enabled = reader.bool();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseSendEnabled();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        if ((0, helpers_1.isSet)(object.enabled))
          obj.enabled = Boolean(object.enabled);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        message.enabled !== void 0 && (obj.enabled = message.enabled);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseSendEnabled();
        message.denom = object.denom ?? "";
        message.enabled = object.enabled ?? false;
        return message;
      }
    };
    function createBaseInput() {
      return {
        address: "",
        coins: []
      };
    }
    exports.Input = {
      typeUrl: "/cosmos.bank.v1beta1.Input",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        for (const v of message.coins) {
          coin_1.Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseInput();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.coins.push(coin_1.Coin.decode(reader, reader.uint32()));
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseInput();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if (Array.isArray(object?.coins))
          obj.coins = object.coins.map((e) => coin_1.Coin.fromJSON(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        if (message.coins) {
          obj.coins = message.coins.map((e) => e ? coin_1.Coin.toJSON(e) : void 0);
        } else {
          obj.coins = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseInput();
        message.address = object.address ?? "";
        message.coins = object.coins?.map((e) => coin_1.Coin.fromPartial(e)) || [];
        return message;
      }
    };
    function createBaseOutput() {
      return {
        address: "",
        coins: []
      };
    }
    exports.Output = {
      typeUrl: "/cosmos.bank.v1beta1.Output",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        for (const v of message.coins) {
          coin_1.Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseOutput();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.coins.push(coin_1.Coin.decode(reader, reader.uint32()));
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseOutput();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if (Array.isArray(object?.coins))
          obj.coins = object.coins.map((e) => coin_1.Coin.fromJSON(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        if (message.coins) {
          obj.coins = message.coins.map((e) => e ? coin_1.Coin.toJSON(e) : void 0);
        } else {
          obj.coins = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseOutput();
        message.address = object.address ?? "";
        message.coins = object.coins?.map((e) => coin_1.Coin.fromPartial(e)) || [];
        return message;
      }
    };
    function createBaseSupply() {
      return {
        total: []
      };
    }
    exports.Supply = {
      typeUrl: "/cosmos.bank.v1beta1.Supply",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.total) {
          coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseSupply();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.total.push(coin_1.Coin.decode(reader, reader.uint32()));
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseSupply();
        if (Array.isArray(object?.total))
          obj.total = object.total.map((e) => coin_1.Coin.fromJSON(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.total) {
          obj.total = message.total.map((e) => e ? coin_1.Coin.toJSON(e) : void 0);
        } else {
          obj.total = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseSupply();
        message.total = object.total?.map((e) => coin_1.Coin.fromPartial(e)) || [];
        return message;
      }
    };
    function createBaseDenomUnit() {
      return {
        denom: "",
        exponent: 0,
        aliases: []
      };
    }
    exports.DenomUnit = {
      typeUrl: "/cosmos.bank.v1beta1.DenomUnit",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        if (message.exponent !== 0) {
          writer.uint32(16).uint32(message.exponent);
        }
        for (const v of message.aliases) {
          writer.uint32(26).string(v);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseDenomUnit();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            case 2:
              message.exponent = reader.uint32();
              break;
            case 3:
              message.aliases.push(reader.string());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseDenomUnit();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        if ((0, helpers_1.isSet)(object.exponent))
          obj.exponent = Number(object.exponent);
        if (Array.isArray(object?.aliases))
          obj.aliases = object.aliases.map((e) => String(e));
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        message.exponent !== void 0 && (obj.exponent = Math.round(message.exponent));
        if (message.aliases) {
          obj.aliases = message.aliases.map((e) => e);
        } else {
          obj.aliases = [];
        }
        return obj;
      },
      fromPartial(object) {
        const message = createBaseDenomUnit();
        message.denom = object.denom ?? "";
        message.exponent = object.exponent ?? 0;
        message.aliases = object.aliases?.map((e) => e) || [];
        return message;
      }
    };
    function createBaseMetadata() {
      return {
        description: "",
        denomUnits: [],
        base: "",
        display: "",
        name: "",
        symbol: "",
        uri: "",
        uriHash: ""
      };
    }
    exports.Metadata = {
      typeUrl: "/cosmos.bank.v1beta1.Metadata",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.description !== "") {
          writer.uint32(10).string(message.description);
        }
        for (const v of message.denomUnits) {
          exports.DenomUnit.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.base !== "") {
          writer.uint32(26).string(message.base);
        }
        if (message.display !== "") {
          writer.uint32(34).string(message.display);
        }
        if (message.name !== "") {
          writer.uint32(42).string(message.name);
        }
        if (message.symbol !== "") {
          writer.uint32(50).string(message.symbol);
        }
        if (message.uri !== "") {
          writer.uint32(58).string(message.uri);
        }
        if (message.uriHash !== "") {
          writer.uint32(66).string(message.uriHash);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseMetadata();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.description = reader.string();
              break;
            case 2:
              message.denomUnits.push(exports.DenomUnit.decode(reader, reader.uint32()));
              break;
            case 3:
              message.base = reader.string();
              break;
            case 4:
              message.display = reader.string();
              break;
            case 5:
              message.name = reader.string();
              break;
            case 6:
              message.symbol = reader.string();
              break;
            case 7:
              message.uri = reader.string();
              break;
            case 8:
              message.uriHash = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseMetadata();
        if ((0, helpers_1.isSet)(object.description))
          obj.description = String(object.description);
        if (Array.isArray(object?.denomUnits))
          obj.denomUnits = object.denomUnits.map((e) => exports.DenomUnit.fromJSON(e));
        if ((0, helpers_1.isSet)(object.base))
          obj.base = String(object.base);
        if ((0, helpers_1.isSet)(object.display))
          obj.display = String(object.display);
        if ((0, helpers_1.isSet)(object.name))
          obj.name = String(object.name);
        if ((0, helpers_1.isSet)(object.symbol))
          obj.symbol = String(object.symbol);
        if ((0, helpers_1.isSet)(object.uri))
          obj.uri = String(object.uri);
        if ((0, helpers_1.isSet)(object.uriHash))
          obj.uriHash = String(object.uriHash);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.description !== void 0 && (obj.description = message.description);
        if (message.denomUnits) {
          obj.denomUnits = message.denomUnits.map((e) => e ? exports.DenomUnit.toJSON(e) : void 0);
        } else {
          obj.denomUnits = [];
        }
        message.base !== void 0 && (obj.base = message.base);
        message.display !== void 0 && (obj.display = message.display);
        message.name !== void 0 && (obj.name = message.name);
        message.symbol !== void 0 && (obj.symbol = message.symbol);
        message.uri !== void 0 && (obj.uri = message.uri);
        message.uriHash !== void 0 && (obj.uriHash = message.uriHash);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseMetadata();
        message.description = object.description ?? "";
        message.denomUnits = object.denomUnits?.map((e) => exports.DenomUnit.fromPartial(e)) || [];
        message.base = object.base ?? "";
        message.display = object.display ?? "";
        message.name = object.name ?? "";
        message.symbol = object.symbol ?? "";
        message.uri = object.uri ?? "";
        message.uriHash = object.uriHash ?? "";
        return message;
      }
    };
  }
});

// ../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/bank/v1beta1/query.js
var require_query3 = __commonJS({
  "../node_modules/.pnpm/cosmjs-types@0.9.0/node_modules/cosmjs-types/cosmos/bank/v1beta1/query.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QueryClientImpl = exports.QuerySendEnabledResponse = exports.QuerySendEnabledRequest = exports.QueryDenomOwnersResponse = exports.DenomOwner = exports.QueryDenomOwnersRequest = exports.QueryDenomMetadataResponse = exports.QueryDenomMetadataRequest = exports.QueryDenomsMetadataResponse = exports.QueryDenomsMetadataRequest = exports.QueryParamsResponse = exports.QueryParamsRequest = exports.QuerySupplyOfResponse = exports.QuerySupplyOfRequest = exports.QueryTotalSupplyResponse = exports.QueryTotalSupplyRequest = exports.QuerySpendableBalanceByDenomResponse = exports.QuerySpendableBalanceByDenomRequest = exports.QuerySpendableBalancesResponse = exports.QuerySpendableBalancesRequest = exports.QueryAllBalancesResponse = exports.QueryAllBalancesRequest = exports.QueryBalanceResponse = exports.QueryBalanceRequest = exports.protobufPackage = void 0;
    var pagination_1 = require_pagination();
    var coin_1 = require_coin();
    var bank_1 = require_bank();
    var binary_1 = require_binary();
    var helpers_1 = require_helpers();
    exports.protobufPackage = "cosmos.bank.v1beta1";
    function createBaseQueryBalanceRequest() {
      return {
        address: "",
        denom: ""
      };
    }
    exports.QueryBalanceRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryBalanceRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.denom !== "") {
          writer.uint32(18).string(message.denom);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryBalanceRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.denom = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryBalanceRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.denom !== void 0 && (obj.denom = message.denom);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryBalanceRequest();
        message.address = object.address ?? "";
        message.denom = object.denom ?? "";
        return message;
      }
    };
    function createBaseQueryBalanceResponse() {
      return {
        balance: void 0
      };
    }
    exports.QueryBalanceResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryBalanceResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.balance !== void 0) {
          coin_1.Coin.encode(message.balance, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryBalanceResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.balance = coin_1.Coin.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryBalanceResponse();
        if ((0, helpers_1.isSet)(object.balance))
          obj.balance = coin_1.Coin.fromJSON(object.balance);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.balance !== void 0 && (obj.balance = message.balance ? coin_1.Coin.toJSON(message.balance) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryBalanceResponse();
        if (object.balance !== void 0 && object.balance !== null) {
          message.balance = coin_1.Coin.fromPartial(object.balance);
        }
        return message;
      }
    };
    function createBaseQueryAllBalancesRequest() {
      return {
        address: "",
        pagination: void 0
      };
    }
    exports.QueryAllBalancesRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryAllBalancesRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAllBalancesRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAllBalancesRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAllBalancesRequest();
        message.address = object.address ?? "";
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryAllBalancesResponse() {
      return {
        balances: [],
        pagination: void 0
      };
    }
    exports.QueryAllBalancesResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryAllBalancesResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.balances) {
          coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryAllBalancesResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.balances.push(coin_1.Coin.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryAllBalancesResponse();
        if (Array.isArray(object?.balances))
          obj.balances = object.balances.map((e) => coin_1.Coin.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.balances) {
          obj.balances = message.balances.map((e) => e ? coin_1.Coin.toJSON(e) : void 0);
        } else {
          obj.balances = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryAllBalancesResponse();
        message.balances = object.balances?.map((e) => coin_1.Coin.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQuerySpendableBalancesRequest() {
      return {
        address: "",
        pagination: void 0
      };
    }
    exports.QuerySpendableBalancesRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySpendableBalancesRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySpendableBalancesRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySpendableBalancesRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySpendableBalancesRequest();
        message.address = object.address ?? "";
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQuerySpendableBalancesResponse() {
      return {
        balances: [],
        pagination: void 0
      };
    }
    exports.QuerySpendableBalancesResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySpendableBalancesResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.balances) {
          coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySpendableBalancesResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.balances.push(coin_1.Coin.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySpendableBalancesResponse();
        if (Array.isArray(object?.balances))
          obj.balances = object.balances.map((e) => coin_1.Coin.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.balances) {
          obj.balances = message.balances.map((e) => e ? coin_1.Coin.toJSON(e) : void 0);
        } else {
          obj.balances = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySpendableBalancesResponse();
        message.balances = object.balances?.map((e) => coin_1.Coin.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQuerySpendableBalanceByDenomRequest() {
      return {
        address: "",
        denom: ""
      };
    }
    exports.QuerySpendableBalanceByDenomRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySpendableBalanceByDenomRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.denom !== "") {
          writer.uint32(18).string(message.denom);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySpendableBalanceByDenomRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.denom = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySpendableBalanceByDenomRequest();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.denom !== void 0 && (obj.denom = message.denom);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySpendableBalanceByDenomRequest();
        message.address = object.address ?? "";
        message.denom = object.denom ?? "";
        return message;
      }
    };
    function createBaseQuerySpendableBalanceByDenomResponse() {
      return {
        balance: void 0
      };
    }
    exports.QuerySpendableBalanceByDenomResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySpendableBalanceByDenomResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.balance !== void 0) {
          coin_1.Coin.encode(message.balance, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySpendableBalanceByDenomResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.balance = coin_1.Coin.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySpendableBalanceByDenomResponse();
        if ((0, helpers_1.isSet)(object.balance))
          obj.balance = coin_1.Coin.fromJSON(object.balance);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.balance !== void 0 && (obj.balance = message.balance ? coin_1.Coin.toJSON(message.balance) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySpendableBalanceByDenomResponse();
        if (object.balance !== void 0 && object.balance !== null) {
          message.balance = coin_1.Coin.fromPartial(object.balance);
        }
        return message;
      }
    };
    function createBaseQueryTotalSupplyRequest() {
      return {
        pagination: void 0
      };
    }
    exports.QueryTotalSupplyRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryTotalSupplyRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryTotalSupplyRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryTotalSupplyRequest();
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryTotalSupplyRequest();
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryTotalSupplyResponse() {
      return {
        supply: [],
        pagination: void 0
      };
    }
    exports.QueryTotalSupplyResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryTotalSupplyResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.supply) {
          coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryTotalSupplyResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.supply.push(coin_1.Coin.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryTotalSupplyResponse();
        if (Array.isArray(object?.supply))
          obj.supply = object.supply.map((e) => coin_1.Coin.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.supply) {
          obj.supply = message.supply.map((e) => e ? coin_1.Coin.toJSON(e) : void 0);
        } else {
          obj.supply = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryTotalSupplyResponse();
        message.supply = object.supply?.map((e) => coin_1.Coin.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQuerySupplyOfRequest() {
      return {
        denom: ""
      };
    }
    exports.QuerySupplyOfRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySupplyOfRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySupplyOfRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySupplyOfRequest();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySupplyOfRequest();
        message.denom = object.denom ?? "";
        return message;
      }
    };
    function createBaseQuerySupplyOfResponse() {
      return {
        amount: coin_1.Coin.fromPartial({})
      };
    }
    exports.QuerySupplyOfResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySupplyOfResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.amount !== void 0) {
          coin_1.Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySupplyOfResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.amount = coin_1.Coin.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySupplyOfResponse();
        if ((0, helpers_1.isSet)(object.amount))
          obj.amount = coin_1.Coin.fromJSON(object.amount);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.amount !== void 0 && (obj.amount = message.amount ? coin_1.Coin.toJSON(message.amount) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySupplyOfResponse();
        if (object.amount !== void 0 && object.amount !== null) {
          message.amount = coin_1.Coin.fromPartial(object.amount);
        }
        return message;
      }
    };
    function createBaseQueryParamsRequest() {
      return {};
    }
    exports.QueryParamsRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryParamsRequest",
      encode(_, writer = binary_1.BinaryWriter.create()) {
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(_) {
        const obj = createBaseQueryParamsRequest();
        return obj;
      },
      toJSON(_) {
        const obj = {};
        return obj;
      },
      fromPartial(_) {
        const message = createBaseQueryParamsRequest();
        return message;
      }
    };
    function createBaseQueryParamsResponse() {
      return {
        params: bank_1.Params.fromPartial({})
      };
    }
    exports.QueryParamsResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryParamsResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.params !== void 0) {
          bank_1.Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.params = bank_1.Params.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryParamsResponse();
        if ((0, helpers_1.isSet)(object.params))
          obj.params = bank_1.Params.fromJSON(object.params);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.params !== void 0 && (obj.params = message.params ? bank_1.Params.toJSON(message.params) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryParamsResponse();
        if (object.params !== void 0 && object.params !== null) {
          message.params = bank_1.Params.fromPartial(object.params);
        }
        return message;
      }
    };
    function createBaseQueryDenomsMetadataRequest() {
      return {
        pagination: void 0
      };
    }
    exports.QueryDenomsMetadataRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryDenomsMetadataRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomsMetadataRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryDenomsMetadataRequest();
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryDenomsMetadataRequest();
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryDenomsMetadataResponse() {
      return {
        metadatas: [],
        pagination: void 0
      };
    }
    exports.QueryDenomsMetadataResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryDenomsMetadataResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.metadatas) {
          bank_1.Metadata.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomsMetadataResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.metadatas.push(bank_1.Metadata.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryDenomsMetadataResponse();
        if (Array.isArray(object?.metadatas))
          obj.metadatas = object.metadatas.map((e) => bank_1.Metadata.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.metadatas) {
          obj.metadatas = message.metadatas.map((e) => e ? bank_1.Metadata.toJSON(e) : void 0);
        } else {
          obj.metadatas = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryDenomsMetadataResponse();
        message.metadatas = object.metadatas?.map((e) => bank_1.Metadata.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQueryDenomMetadataRequest() {
      return {
        denom: ""
      };
    }
    exports.QueryDenomMetadataRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryDenomMetadataRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomMetadataRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryDenomMetadataRequest();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryDenomMetadataRequest();
        message.denom = object.denom ?? "";
        return message;
      }
    };
    function createBaseQueryDenomMetadataResponse() {
      return {
        metadata: bank_1.Metadata.fromPartial({})
      };
    }
    exports.QueryDenomMetadataResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryDenomMetadataResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.metadata !== void 0) {
          bank_1.Metadata.encode(message.metadata, writer.uint32(10).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomMetadataResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.metadata = bank_1.Metadata.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryDenomMetadataResponse();
        if ((0, helpers_1.isSet)(object.metadata))
          obj.metadata = bank_1.Metadata.fromJSON(object.metadata);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.metadata !== void 0 && (obj.metadata = message.metadata ? bank_1.Metadata.toJSON(message.metadata) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryDenomMetadataResponse();
        if (object.metadata !== void 0 && object.metadata !== null) {
          message.metadata = bank_1.Metadata.fromPartial(object.metadata);
        }
        return message;
      }
    };
    function createBaseQueryDenomOwnersRequest() {
      return {
        denom: "",
        pagination: void 0
      };
    }
    exports.QueryDenomOwnersRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QueryDenomOwnersRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.denom !== "") {
          writer.uint32(10).string(message.denom);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomOwnersRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denom = reader.string();
              break;
            case 2:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryDenomOwnersRequest();
        if ((0, helpers_1.isSet)(object.denom))
          obj.denom = String(object.denom);
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.denom !== void 0 && (obj.denom = message.denom);
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryDenomOwnersRequest();
        message.denom = object.denom ?? "";
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseDenomOwner() {
      return {
        address: "",
        balance: coin_1.Coin.fromPartial({})
      };
    }
    exports.DenomOwner = {
      typeUrl: "/cosmos.bank.v1beta1.DenomOwner",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        if (message.address !== "") {
          writer.uint32(10).string(message.address);
        }
        if (message.balance !== void 0) {
          coin_1.Coin.encode(message.balance, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseDenomOwner();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.address = reader.string();
              break;
            case 2:
              message.balance = coin_1.Coin.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseDenomOwner();
        if ((0, helpers_1.isSet)(object.address))
          obj.address = String(object.address);
        if ((0, helpers_1.isSet)(object.balance))
          obj.balance = coin_1.Coin.fromJSON(object.balance);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        message.address !== void 0 && (obj.address = message.address);
        message.balance !== void 0 && (obj.balance = message.balance ? coin_1.Coin.toJSON(message.balance) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseDenomOwner();
        message.address = object.address ?? "";
        if (object.balance !== void 0 && object.balance !== null) {
          message.balance = coin_1.Coin.fromPartial(object.balance);
        }
        return message;
      }
    };
    function createBaseQueryDenomOwnersResponse() {
      return {
        denomOwners: [],
        pagination: void 0
      };
    }
    exports.QueryDenomOwnersResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QueryDenomOwnersResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.denomOwners) {
          exports.DenomOwner.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomOwnersResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denomOwners.push(exports.DenomOwner.decode(reader, reader.uint32()));
              break;
            case 2:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQueryDenomOwnersResponse();
        if (Array.isArray(object?.denomOwners))
          obj.denomOwners = object.denomOwners.map((e) => exports.DenomOwner.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.denomOwners) {
          obj.denomOwners = message.denomOwners.map((e) => e ? exports.DenomOwner.toJSON(e) : void 0);
        } else {
          obj.denomOwners = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQueryDenomOwnersResponse();
        message.denomOwners = object.denomOwners?.map((e) => exports.DenomOwner.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQuerySendEnabledRequest() {
      return {
        denoms: [],
        pagination: void 0
      };
    }
    exports.QuerySendEnabledRequest = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySendEnabledRequest",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.denoms) {
          writer.uint32(10).string(v);
        }
        if (message.pagination !== void 0) {
          pagination_1.PageRequest.encode(message.pagination, writer.uint32(794).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySendEnabledRequest();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.denoms.push(reader.string());
              break;
            case 99:
              message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySendEnabledRequest();
        if (Array.isArray(object?.denoms))
          obj.denoms = object.denoms.map((e) => String(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.denoms) {
          obj.denoms = message.denoms.map((e) => e);
        } else {
          obj.denoms = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySendEnabledRequest();
        message.denoms = object.denoms?.map((e) => e) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        return message;
      }
    };
    function createBaseQuerySendEnabledResponse() {
      return {
        sendEnabled: [],
        pagination: void 0
      };
    }
    exports.QuerySendEnabledResponse = {
      typeUrl: "/cosmos.bank.v1beta1.QuerySendEnabledResponse",
      encode(message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.sendEnabled) {
          bank_1.SendEnabled.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== void 0) {
          pagination_1.PageResponse.encode(message.pagination, writer.uint32(794).fork()).ldelim();
        }
        return writer;
      },
      decode(input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === void 0 ? reader.len : reader.pos + length;
        const message = createBaseQuerySendEnabledResponse();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.sendEnabled.push(bank_1.SendEnabled.decode(reader, reader.uint32()));
              break;
            case 99:
              message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      },
      fromJSON(object) {
        const obj = createBaseQuerySendEnabledResponse();
        if (Array.isArray(object?.sendEnabled))
          obj.sendEnabled = object.sendEnabled.map((e) => bank_1.SendEnabled.fromJSON(e));
        if ((0, helpers_1.isSet)(object.pagination))
          obj.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        return obj;
      },
      toJSON(message) {
        const obj = {};
        if (message.sendEnabled) {
          obj.sendEnabled = message.sendEnabled.map((e) => e ? bank_1.SendEnabled.toJSON(e) : void 0);
        } else {
          obj.sendEnabled = [];
        }
        message.pagination !== void 0 && (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : void 0);
        return obj;
      },
      fromPartial(object) {
        const message = createBaseQuerySendEnabledResponse();
        message.sendEnabled = object.sendEnabled?.map((e) => bank_1.SendEnabled.fromPartial(e)) || [];
        if (object.pagination !== void 0 && object.pagination !== null) {
          message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        return message;
      }
    };
    var QueryClientImpl = class {
      constructor(rpc) {
        this.rpc = rpc;
        this.Balance = this.Balance.bind(this);
        this.AllBalances = this.AllBalances.bind(this);
        this.SpendableBalances = this.SpendableBalances.bind(this);
        this.SpendableBalanceByDenom = this.SpendableBalanceByDenom.bind(this);
        this.TotalSupply = this.TotalSupply.bind(this);
        this.SupplyOf = this.SupplyOf.bind(this);
        this.Params = this.Params.bind(this);
        this.DenomMetadata = this.DenomMetadata.bind(this);
        this.DenomsMetadata = this.DenomsMetadata.bind(this);
        this.DenomOwners = this.DenomOwners.bind(this);
        this.SendEnabled = this.SendEnabled.bind(this);
      }
      Balance(request) {
        const data = exports.QueryBalanceRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "Balance", data);
        return promise.then((data2) => exports.QueryBalanceResponse.decode(new binary_1.BinaryReader(data2)));
      }
      AllBalances(request) {
        const data = exports.QueryAllBalancesRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "AllBalances", data);
        return promise.then((data2) => exports.QueryAllBalancesResponse.decode(new binary_1.BinaryReader(data2)));
      }
      SpendableBalances(request) {
        const data = exports.QuerySpendableBalancesRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "SpendableBalances", data);
        return promise.then((data2) => exports.QuerySpendableBalancesResponse.decode(new binary_1.BinaryReader(data2)));
      }
      SpendableBalanceByDenom(request) {
        const data = exports.QuerySpendableBalanceByDenomRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "SpendableBalanceByDenom", data);
        return promise.then((data2) => exports.QuerySpendableBalanceByDenomResponse.decode(new binary_1.BinaryReader(data2)));
      }
      TotalSupply(request = {
        pagination: pagination_1.PageRequest.fromPartial({})
      }) {
        const data = exports.QueryTotalSupplyRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "TotalSupply", data);
        return promise.then((data2) => exports.QueryTotalSupplyResponse.decode(new binary_1.BinaryReader(data2)));
      }
      SupplyOf(request) {
        const data = exports.QuerySupplyOfRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "SupplyOf", data);
        return promise.then((data2) => exports.QuerySupplyOfResponse.decode(new binary_1.BinaryReader(data2)));
      }
      Params(request = {}) {
        const data = exports.QueryParamsRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "Params", data);
        return promise.then((data2) => exports.QueryParamsResponse.decode(new binary_1.BinaryReader(data2)));
      }
      DenomMetadata(request) {
        const data = exports.QueryDenomMetadataRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "DenomMetadata", data);
        return promise.then((data2) => exports.QueryDenomMetadataResponse.decode(new binary_1.BinaryReader(data2)));
      }
      DenomsMetadata(request = {
        pagination: pagination_1.PageRequest.fromPartial({})
      }) {
        const data = exports.QueryDenomsMetadataRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "DenomsMetadata", data);
        return promise.then((data2) => exports.QueryDenomsMetadataResponse.decode(new binary_1.BinaryReader(data2)));
      }
      DenomOwners(request) {
        const data = exports.QueryDenomOwnersRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "DenomOwners", data);
        return promise.then((data2) => exports.QueryDenomOwnersResponse.decode(new binary_1.BinaryReader(data2)));
      }
      SendEnabled(request) {
        const data = exports.QuerySendEnabledRequest.encode(request).finish();
        const promise = this.rpc.request("cosmos.bank.v1beta1.Query", "SendEnabled", data);
        return promise.then((data2) => exports.QuerySendEnabledResponse.decode(new binary_1.BinaryReader(data2)));
      }
    };
    exports.QueryClientImpl = QueryClientImpl;
  }
});

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index3 = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index3) {
        throw new Error("next() called multiple times");
      }
      index3 = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index3) => {
    if (index3 === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index3) => {
    const mark = `@${index3}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf(
    "/",
    url.charCodeAt(9) === 58 ? 13 : 8
  );
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var _validatedData, _matchResult, _getDecodedParam, getDecodedParam_fn, _getAllDecodedParams, getAllDecodedParams_fn, _getParamValue, getParamValue_fn, _cachedBody, _a;
var HonoRequest = (_a = class {
  constructor(request, path = "/", matchResult = [[]]) {
    __privateAdd(this, _getDecodedParam);
    __privateAdd(this, _getAllDecodedParams);
    __privateAdd(this, _getParamValue);
    __publicField(this, "raw");
    __privateAdd(this, _validatedData, void 0);
    __privateAdd(this, _matchResult, void 0);
    __publicField(this, "routeIndex", 0);
    __publicField(this, "path");
    __publicField(this, "bodyCache", {});
    __privateAdd(this, _cachedBody, (key) => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      const anyCachedKey = Object.keys(bodyCache)[0];
      if (anyCachedKey) {
        return bodyCache[anyCachedKey].then((body) => {
          if (anyCachedKey === "json") {
            body = JSON.stringify(body);
          }
          return new Response(body)[key]();
        });
      }
      return bodyCache[key] = raw2[key]();
    });
    this.raw = request;
    this.path = path;
    __privateSet(this, _matchResult, matchResult);
    __privateSet(this, _validatedData, {});
  }
  param(key) {
    return key ? __privateMethod(this, _getDecodedParam, getDecodedParam_fn).call(this, key) : __privateMethod(this, _getAllDecodedParams, getAllDecodedParams_fn).call(this);
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    var _a10;
    return (_a10 = this.bodyCache).parsedBody ?? (_a10.parsedBody = await parseBody(this, options));
  }
  json() {
    return __privateGet(this, _cachedBody).call(this, "text").then((text2) => JSON.parse(text2));
  }
  text() {
    return __privateGet(this, _cachedBody).call(this, "text");
  }
  arrayBuffer() {
    return __privateGet(this, _cachedBody).call(this, "arrayBuffer");
  }
  blob() {
    return __privateGet(this, _cachedBody).call(this, "blob");
  }
  formData() {
    return __privateGet(this, _cachedBody).call(this, "formData");
  }
  addValidatedData(target, data) {
    __privateGet(this, _validatedData)[target] = data;
  }
  valid(target) {
    return __privateGet(this, _validatedData)[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return __privateGet(this, _matchResult);
  }
  get matchedRoutes() {
    return __privateGet(this, _matchResult)[0].map(([[, route]]) => route);
  }
  get routePath() {
    return __privateGet(this, _matchResult)[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
}, _validatedData = new WeakMap(), _matchResult = new WeakMap(), _getDecodedParam = new WeakSet(), getDecodedParam_fn = function(key) {
  const paramKey = __privateGet(this, _matchResult)[0][this.routeIndex][1][key];
  const param = __privateMethod(this, _getParamValue, getParamValue_fn).call(this, paramKey);
  return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : void 0;
}, _getAllDecodedParams = new WeakSet(), getAllDecodedParams_fn = function() {
  const decoded = {};
  const keys = Object.keys(__privateGet(this, _matchResult)[0][this.routeIndex][1]);
  for (const key of keys) {
    const value = __privateMethod(this, _getParamValue, getParamValue_fn).call(this, __privateGet(this, _matchResult)[0][this.routeIndex][1][key]);
    if (value && typeof value === "string") {
      decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
    }
  }
  return decoded;
}, _getParamValue = new WeakSet(), getParamValue_fn = function(paramKey) {
  return __privateGet(this, _matchResult)[1] ? __privateGet(this, _matchResult)[1][paramKey] : paramKey;
}, _cachedBody = new WeakMap(), _a);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer2) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer2) {
    buffer2[0] += str;
  } else {
    buffer2 = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer: buffer2, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer2))
    ).then(() => buffer2[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var _rawRequest, _req, _var, _status, _executionCtx, _res, _layout, _renderer, _notFoundHandler, _preparedHeaders, _matchResult2, _path, _newResponse, newResponse_fn, _a2;
var Context = (_a2 = class {
  constructor(req, options) {
    __privateAdd(this, _newResponse);
    __privateAdd(this, _rawRequest, void 0);
    __privateAdd(this, _req, void 0);
    __publicField(this, "env", {});
    __privateAdd(this, _var, void 0);
    __publicField(this, "finalized", false);
    __publicField(this, "error");
    __privateAdd(this, _status, void 0);
    __privateAdd(this, _executionCtx, void 0);
    __privateAdd(this, _res, void 0);
    __privateAdd(this, _layout, void 0);
    __privateAdd(this, _renderer, void 0);
    __privateAdd(this, _notFoundHandler, void 0);
    __privateAdd(this, _preparedHeaders, void 0);
    __privateAdd(this, _matchResult2, void 0);
    __privateAdd(this, _path, void 0);
    __publicField(this, "render", (...args) => {
      __privateGet(this, _renderer) ?? __privateSet(this, _renderer, (content) => this.html(content));
      return __privateGet(this, _renderer).call(this, ...args);
    });
    __publicField(this, "setLayout", (layout) => __privateSet(this, _layout, layout));
    __publicField(this, "getLayout", () => __privateGet(this, _layout));
    __publicField(this, "setRenderer", (renderer) => {
      __privateSet(this, _renderer, renderer);
    });
    __publicField(this, "header", (name, value, options) => {
      if (this.finalized) {
        __privateSet(this, _res, new Response(__privateGet(this, _res).body, __privateGet(this, _res)));
      }
      const headers = __privateGet(this, _res) ? __privateGet(this, _res).headers : __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, new Headers());
      if (value === void 0) {
        headers.delete(name);
      } else if (options?.append) {
        headers.append(name, value);
      } else {
        headers.set(name, value);
      }
    });
    __publicField(this, "status", (status) => {
      __privateSet(this, _status, status);
    });
    __publicField(this, "set", (key, value) => {
      __privateGet(this, _var) ?? __privateSet(this, _var, /* @__PURE__ */ new Map());
      __privateGet(this, _var).set(key, value);
    });
    __publicField(this, "get", (key) => {
      return __privateGet(this, _var) ? __privateGet(this, _var).get(key) : void 0;
    });
    __publicField(this, "newResponse", (...args) => __privateMethod(this, _newResponse, newResponse_fn).call(this, ...args));
    __publicField(this, "body", (data, arg, headers) => __privateMethod(this, _newResponse, newResponse_fn).call(this, data, arg, headers));
    __publicField(this, "text", (text2, arg, headers) => {
      return !__privateGet(this, _preparedHeaders) && !__privateGet(this, _status) && !arg && !headers && !this.finalized ? new Response(text2) : __privateMethod(this, _newResponse, newResponse_fn).call(this, text2, arg, setDefaultContentType(TEXT_PLAIN, headers));
    });
    __publicField(this, "json", (object, arg, headers) => {
      return __privateMethod(this, _newResponse, newResponse_fn).call(this, JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
    });
    __publicField(this, "html", (html, arg, headers) => {
      const res = (html2) => __privateMethod(this, _newResponse, newResponse_fn).call(this, html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
      return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
    });
    __publicField(this, "redirect", (location, status) => {
      const locationString = String(location);
      this.header(
        "Location",
        !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
      );
      return this.newResponse(null, status ?? 302);
    });
    __publicField(this, "notFound", () => {
      __privateGet(this, _notFoundHandler) ?? __privateSet(this, _notFoundHandler, () => new Response());
      return __privateGet(this, _notFoundHandler).call(this, this);
    });
    __privateSet(this, _rawRequest, req);
    if (options) {
      __privateSet(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      __privateSet(this, _notFoundHandler, options.notFoundHandler);
      __privateSet(this, _path, options.path);
      __privateSet(this, _matchResult2, options.matchResult);
    }
  }
  get req() {
    __privateGet(this, _req) ?? __privateSet(this, _req, new HonoRequest(__privateGet(this, _rawRequest), __privateGet(this, _path), __privateGet(this, _matchResult2)));
    return __privateGet(this, _req);
  }
  get event() {
    if (__privateGet(this, _executionCtx) && "respondWith" in __privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (__privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return __privateGet(this, _res) || __privateSet(this, _res, new Response(null, {
      headers: __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, new Headers())
    }));
  }
  set res(_res2) {
    if (__privateGet(this, _res) && _res2) {
      _res2 = new Response(_res2.body, _res2);
      for (const [k, v] of __privateGet(this, _res).headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = __privateGet(this, _res).headers.getSetCookie();
          _res2.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res2.headers.append("set-cookie", cookie);
          }
        } else {
          _res2.headers.set(k, v);
        }
      }
    }
    __privateSet(this, _res, _res2);
    this.finalized = true;
  }
  get var() {
    if (!__privateGet(this, _var)) {
      return {};
    }
    return Object.fromEntries(__privateGet(this, _var));
  }
}, _rawRequest = new WeakMap(), _req = new WeakMap(), _var = new WeakMap(), _status = new WeakMap(), _executionCtx = new WeakMap(), _res = new WeakMap(), _layout = new WeakMap(), _renderer = new WeakMap(), _notFoundHandler = new WeakMap(), _preparedHeaders = new WeakMap(), _matchResult2 = new WeakMap(), _path = new WeakMap(), _newResponse = new WeakSet(), newResponse_fn = function(data, arg, headers) {
  const responseHeaders = __privateGet(this, _res) ? new Headers(__privateGet(this, _res).headers) : __privateGet(this, _preparedHeaders) ?? new Headers();
  if (typeof arg === "object" && "headers" in arg) {
    const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
    for (const [key, value] of argHeaders) {
      if (key.toLowerCase() === "set-cookie") {
        responseHeaders.append(key, value);
      } else {
        responseHeaders.set(key, value);
      }
    }
  }
  if (headers) {
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        responseHeaders.set(k, v);
      } else {
        responseHeaders.delete(k);
        for (const v2 of v) {
          responseHeaders.append(k, v2);
        }
      }
    }
  }
  const status = typeof arg === "number" ? arg : arg?.status ?? __privateGet(this, _status);
  return new Response(data, { status, headers: responseHeaders });
}, _a2);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var _path2, _clone, clone_fn, _notFoundHandler2, _addRoute, addRoute_fn, _handleError, handleError_fn, _dispatch, dispatch_fn, _a3;
var Hono = (_a3 = class {
  constructor(options = {}) {
    __privateAdd(this, _clone);
    __privateAdd(this, _addRoute);
    __privateAdd(this, _handleError);
    __privateAdd(this, _dispatch);
    __publicField(this, "get");
    __publicField(this, "post");
    __publicField(this, "put");
    __publicField(this, "delete");
    __publicField(this, "options");
    __publicField(this, "patch");
    __publicField(this, "all");
    __publicField(this, "on");
    __publicField(this, "use");
    __publicField(this, "router");
    __publicField(this, "getPath");
    __publicField(this, "_basePath", "/");
    __privateAdd(this, _path2, "/");
    __publicField(this, "routes", []);
    __privateAdd(this, _notFoundHandler2, notFoundHandler);
    __publicField(this, "errorHandler", errorHandler);
    __publicField(this, "onError", (handler) => {
      this.errorHandler = handler;
      return this;
    });
    __publicField(this, "notFound", (handler) => {
      __privateSet(this, _notFoundHandler2, handler);
      return this;
    });
    __publicField(this, "fetch", (request, ...rest) => {
      return __privateMethod(this, _dispatch, dispatch_fn).call(this, request, rest[1], rest[0], request.method);
    });
    __publicField(this, "request", (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
      }
      input = input.toString();
      return this.fetch(
        new Request(
          /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
          requestInit
        ),
        Env,
        executionCtx
      );
    });
    __publicField(this, "fire", () => {
      addEventListener("fetch", (event) => {
        event.respondWith(__privateMethod(this, _dispatch, dispatch_fn).call(this, event.request, event, void 0, event.request.method));
      });
    });
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          __privateSet(this, _path2, args1);
        } else {
          __privateMethod(this, _addRoute, addRoute_fn).call(this, method, __privateGet(this, _path2), args1);
        }
        args.forEach((handler) => {
          __privateMethod(this, _addRoute, addRoute_fn).call(this, method, __privateGet(this, _path2), handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        __privateSet(this, _path2, p);
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            __privateMethod(this, _addRoute, addRoute_fn).call(this, m.toUpperCase(), __privateGet(this, _path2), handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        __privateSet(this, _path2, arg1);
      } else {
        __privateSet(this, _path2, "*");
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        __privateMethod(this, _addRoute, addRoute_fn).call(this, METHOD_NAME_ALL, __privateGet(this, _path2), handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      var _a10;
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      __privateMethod(_a10 = subApp, _addRoute, addRoute_fn).call(_a10, r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = __privateMethod(this, _clone, clone_fn).call(this);
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest || (replaceRequest = (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })());
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    __privateMethod(this, _addRoute, addRoute_fn).call(this, METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
}, _path2 = new WeakMap(), _clone = new WeakSet(), clone_fn = function() {
  const clone = new Hono({
    router: this.router,
    getPath: this.getPath
  });
  clone.errorHandler = this.errorHandler;
  __privateSet(clone, _notFoundHandler2, __privateGet(this, _notFoundHandler2));
  clone.routes = this.routes;
  return clone;
}, _notFoundHandler2 = new WeakMap(), _addRoute = new WeakSet(), addRoute_fn = function(method, path, handler) {
  method = method.toUpperCase();
  path = mergePath(this._basePath, path);
  const r = { basePath: this._basePath, path, method, handler };
  this.router.add(method, path, [handler, r]);
  this.routes.push(r);
}, _handleError = new WeakSet(), handleError_fn = function(err, c) {
  if (err instanceof Error) {
    return this.errorHandler(err, c);
  }
  throw err;
}, _dispatch = new WeakSet(), dispatch_fn = function(request, executionCtx, env, method) {
  if (method === "HEAD") {
    return (async () => new Response(null, await __privateMethod(this, _dispatch, dispatch_fn).call(this, request, executionCtx, env, "GET")))();
  }
  const path = this.getPath(request, { env });
  const matchResult = this.router.match(method, path);
  const c = new Context(request, {
    path,
    matchResult,
    env,
    executionCtx,
    notFoundHandler: __privateGet(this, _notFoundHandler2)
  });
  if (matchResult[0].length === 1) {
    let res;
    try {
      res = matchResult[0][0][0][0](c, async () => {
        c.res = await __privateGet(this, _notFoundHandler2).call(this, c);
      });
    } catch (err) {
      return __privateMethod(this, _handleError, handleError_fn).call(this, err, c);
    }
    return res instanceof Promise ? res.then(
      (resolved) => resolved || (c.finalized ? c.res : __privateGet(this, _notFoundHandler2).call(this, c))
    ).catch((err) => __privateMethod(this, _handleError, handleError_fn).call(this, err, c)) : res ?? __privateGet(this, _notFoundHandler2).call(this, c);
  }
  const composed = compose(matchResult[0], this.errorHandler, __privateGet(this, _notFoundHandler2));
  return (async () => {
    try {
      const context = await composed(c);
      if (!context.finalized) {
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      }
      return context.res;
    } catch (err) {
      return __privateMethod(this, _handleError, handleError_fn).call(this, err, c);
    }
  })();
}, _a3);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var _index, _varIndex, _children, _a4;
var Node = (_a4 = class {
  constructor() {
    __privateAdd(this, _index, void 0);
    __privateAdd(this, _varIndex, void 0);
    __privateAdd(this, _children, /* @__PURE__ */ Object.create(null));
  }
  insert(tokens, index3, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (__privateGet(this, _index) !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      __privateSet(this, _index, index3);
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = __privateGet(this, _children)[regexpStr];
      if (!node) {
        if (Object.keys(__privateGet(this, _children)).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = __privateGet(this, _children)[regexpStr] = new Node();
        if (name !== "") {
          __privateSet(node, _varIndex, context.varIndex++);
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, __privateGet(node, _varIndex)]);
      }
    } else {
      node = __privateGet(this, _children)[token];
      if (!node) {
        if (Object.keys(__privateGet(this, _children)).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = __privateGet(this, _children)[token] = new Node();
      }
    }
    node.insert(restTokens, index3, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(__privateGet(this, _children)).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = __privateGet(this, _children)[k];
      return (typeof __privateGet(c, _varIndex) === "number" ? `(${k})@${__privateGet(c, _varIndex)}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof __privateGet(this, _index) === "number") {
      strList.unshift(`#${__privateGet(this, _index)}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, _index = new WeakMap(), _varIndex = new WeakMap(), _children = new WeakMap(), _a4);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router/reg-exp-router/trie.js
var _context, _root, _a5;
var Trie = (_a5 = class {
  constructor() {
    __privateAdd(this, _context, { varIndex: 0 });
    __privateAdd(this, _root, new Node());
  }
  insert(path, index3, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    __privateGet(this, _root).insert(tokens, index3, paramAssoc, __privateGet(this, _context), pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = __privateGet(this, _root).buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, _context = new WeakMap(), _root = new WeakMap(), _a5);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ?? (wildcardRegExpCache[path] = new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  ));
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var _middleware, _routes, _buildAllMatchers, buildAllMatchers_fn, _buildMatcher, buildMatcher_fn, _a6;
var RegExpRouter = (_a6 = class {
  constructor() {
    __privateAdd(this, _buildAllMatchers);
    __privateAdd(this, _buildMatcher);
    __publicField(this, "name", "RegExpRouter");
    __privateAdd(this, _middleware, void 0);
    __privateAdd(this, _routes, void 0);
    __privateSet(this, _middleware, { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) });
    __privateSet(this, _routes, { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) });
  }
  add(method, path, handler) {
    var _a10;
    const middleware = __privateGet(this, _middleware);
    const routes = __privateGet(this, _routes);
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          var _a11;
          (_a11 = middleware[m])[path] || (_a11[path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
        });
      } else {
        (_a10 = middleware[method])[path] || (_a10[path] = findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        var _a11;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a11 = routes[m])[path2] || (_a11[path2] = [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ]);
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = __privateMethod(this, _buildAllMatchers, buildAllMatchers_fn).call(this);
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index3 = match.indexOf("", 1);
      return [matcher[1][index3], match];
    };
    return this.match(method, path);
  }
}, _middleware = new WeakMap(), _routes = new WeakMap(), _buildAllMatchers = new WeakSet(), buildAllMatchers_fn = function() {
  const matchers = /* @__PURE__ */ Object.create(null);
  Object.keys(__privateGet(this, _routes)).concat(Object.keys(__privateGet(this, _middleware))).forEach((method) => {
    matchers[method] || (matchers[method] = __privateMethod(this, _buildMatcher, buildMatcher_fn).call(this, method));
  });
  __privateSet(this, _middleware, __privateSet(this, _routes, void 0));
  return matchers;
}, _buildMatcher = new WeakSet(), buildMatcher_fn = function(method) {
  const routes = [];
  let hasOwnRoute = method === METHOD_NAME_ALL;
  [__privateGet(this, _middleware), __privateGet(this, _routes)].forEach((r) => {
    const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
    if (ownRoute.length !== 0) {
      hasOwnRoute || (hasOwnRoute = true);
      routes.push(...ownRoute);
    } else if (method !== METHOD_NAME_ALL) {
      routes.push(
        ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
      );
    }
  });
  if (!hasOwnRoute) {
    return null;
  } else {
    return buildMatcherFromPreprocessedRoutes(routes);
  }
}, _a6);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router/smart-router/router.js
var _routers, _routes2, _a7;
var SmartRouter = (_a7 = class {
  constructor(init) {
    __publicField(this, "name", "SmartRouter");
    __privateAdd(this, _routers, []);
    __privateAdd(this, _routes2, []);
    __privateSet(this, _routers, init.routers);
  }
  add(method, path, handler) {
    if (!__privateGet(this, _routes2)) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    __privateGet(this, _routes2).push([method, path, handler]);
  }
  match(method, path) {
    if (!__privateGet(this, _routes2)) {
      throw new Error("Fatal error");
    }
    const routers = __privateGet(this, _routers);
    const routes = __privateGet(this, _routes2);
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      __privateSet(this, _routers, [router]);
      __privateSet(this, _routes2, void 0);
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (__privateGet(this, _routes2) || __privateGet(this, _routers).length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return __privateGet(this, _routers)[0];
  }
}, _routers = new WeakMap(), _routes2 = new WeakMap(), _a7);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var _methods, _children2, _patterns, _order, _params, _getHandlerSets, getHandlerSets_fn, _a8;
var Node2 = (_a8 = class {
  constructor(method, handler, children) {
    __privateAdd(this, _getHandlerSets);
    __privateAdd(this, _methods, void 0);
    __privateAdd(this, _children2, void 0);
    __privateAdd(this, _patterns, void 0);
    __privateAdd(this, _order, 0);
    __privateAdd(this, _params, emptyParams);
    __privateSet(this, _children2, children || /* @__PURE__ */ Object.create(null));
    __privateSet(this, _methods, []);
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      __privateSet(this, _methods, [m]);
    }
    __privateSet(this, _patterns, []);
  }
  insert(method, path, handler) {
    __privateSet(this, _order, ++__privateWrapper(this, _order)._);
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in __privateGet(curNode, _children2)) {
        curNode = __privateGet(curNode, _children2)[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      __privateGet(curNode, _children2)[key] = new Node2();
      if (pattern) {
        __privateGet(curNode, _patterns).push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = __privateGet(curNode, _children2)[key];
    }
    __privateGet(curNode, _methods).push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: __privateGet(this, _order)
      }
    });
    return curNode;
  }
  search(method, path) {
    const handlerSets = [];
    __privateSet(this, _params, emptyParams);
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = __privateGet(node, _children2)[part];
        if (nextNode) {
          __privateSet(nextNode, _params, __privateGet(node, _params));
          if (isLast) {
            if (__privateGet(nextNode, _children2)["*"]) {
              handlerSets.push(
                ...__privateMethod(this, _getHandlerSets, getHandlerSets_fn).call(this, __privateGet(nextNode, _children2)["*"], method, __privateGet(node, _params))
              );
            }
            handlerSets.push(...__privateMethod(this, _getHandlerSets, getHandlerSets_fn).call(this, nextNode, method, __privateGet(node, _params)));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = __privateGet(node, _patterns).length; k < len3; k++) {
          const pattern = __privateGet(node, _patterns)[k];
          const params = __privateGet(node, _params) === emptyParams ? {} : { ...__privateGet(node, _params) };
          if (pattern === "*") {
            const astNode = __privateGet(node, _children2)["*"];
            if (astNode) {
              handlerSets.push(...__privateMethod(this, _getHandlerSets, getHandlerSets_fn).call(this, astNode, method, __privateGet(node, _params)));
              __privateSet(astNode, _params, params);
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = __privateGet(node, _children2)[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...__privateMethod(this, _getHandlerSets, getHandlerSets_fn).call(this, child, method, __privateGet(node, _params), params));
              if (Object.keys(__privateGet(child, _children2)).length) {
                __privateSet(child, _params, params);
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] || (curNodesQueue[componentCount] = []);
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...__privateMethod(this, _getHandlerSets, getHandlerSets_fn).call(this, child, method, params, __privateGet(node, _params)));
              if (__privateGet(child, _children2)["*"]) {
                handlerSets.push(
                  ...__privateMethod(this, _getHandlerSets, getHandlerSets_fn).call(this, __privateGet(child, _children2)["*"], method, params, __privateGet(node, _params))
                );
              }
            } else {
              __privateSet(child, _params, params);
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
}, _methods = new WeakMap(), _children2 = new WeakMap(), _patterns = new WeakMap(), _order = new WeakMap(), _params = new WeakMap(), _getHandlerSets = new WeakSet(), getHandlerSets_fn = function(node, method, nodeParams, params) {
  const handlerSets = [];
  for (let i = 0, len = __privateGet(node, _methods).length; i < len; i++) {
    const m = __privateGet(node, _methods)[i];
    const handlerSet = m[method] || m[METHOD_NAME_ALL];
    const processedSet = {};
    if (handlerSet !== void 0) {
      handlerSet.params = /* @__PURE__ */ Object.create(null);
      handlerSets.push(handlerSet);
      if (nodeParams !== emptyParams || params && params !== emptyParams) {
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          const processed = processedSet[handlerSet.score];
          handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
          processedSet[handlerSet.score] = true;
        }
      }
    }
  }
  return handlerSets;
}, _a8);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/router/trie-router/router.js
var _node, _a9;
var TrieRouter = (_a9 = class {
  constructor() {
    __publicField(this, "name", "TrieRouter");
    __privateAdd(this, _node, void 0);
    __privateSet(this, _node, new Node2());
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        __privateGet(this, _node).insert(method, results[i], handler);
      }
      return;
    }
    __privateGet(this, _node).insert(method, path, handler);
  }
  match(method, path) {
    return __privateGet(this, _node).search(method, path);
  }
}, _node = new WeakMap(), _a9);

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.origin !== "*") {
      const existingVary = c.req.header("Vary");
      if (existingVary) {
        set("Vary", existingVary);
      } else {
        set("Vary", "Origin");
      }
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
  };
};

// src/services/cache.ts
var CacheService = class {
  constructor(maxSize = 1e3, defaultTTL = 6e4, kv) {
    __publicField(this, "kv");
    __publicField(this, "defaultTTL");
    __publicField(this, "keyPrefix");
    this.kv = kv;
    this.defaultTTL = defaultTTL;
    this.keyPrefix = "astrofork:";
  }
  async get(key) {
    if (!this.kv)
      return null;
    try {
      const value = await this.kv.get(key);
      if (!value)
        return null;
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  async set(key, value, options) {
    if (!this.kv)
      return;
    try {
      const ttl = options?.ttl || this.defaultTTL;
      const serialized = JSON.stringify(value);
      const kvOptions = {};
      if (ttl) {
        kvOptions.expirationTtl = Math.ceil(ttl / 1e3);
      }
      await this.kv.put(key, serialized, kvOptions);
    } catch (error) {
    }
  }
  async delete(key) {
    if (!this.kv)
      return;
    try {
      await this.kv.put(key, "", { expirationTtl: 1 });
    } catch (error) {
    }
  }
  async has(key) {
    if (!this.kv)
      return false;
    try {
      const value = await this.kv.get(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }
  clear() {
  }
  generateKey(...parts) {
    const cleanParts = parts.filter(Boolean).map(
      (part) => part.replace(/[^a-zA-Z0-9_-]/g, "_")
    );
    return `${this.keyPrefix}${cleanParts.join(":")}`;
  }
};

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/wait.js
async function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/clients/createClient.js
init_parseAccount();

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/uid.js
var size2 = 256;
var index = size2;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size2 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0; i < size2; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, cacheTime = parameters.pollingInterval ?? 4e3, ccipRead, key = "base", name = "Base Client", pollingInterval = 4e3, type = "base" } = parameters;
  const chain = parameters.chain;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
  const { config, request, value } = parameters.transport({
    chain,
    pollingInterval
  });
  const transport = { ...config, ...value };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    key,
    name,
    pollingInterval,
    request,
    transport,
    type,
    uid: uid()
  };
  function extend(base) {
    return (extendFn) => {
      const extended = extendFn(base);
      for (const key2 in client)
        delete extended[key2];
      const combined = { ...base, ...extended };
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  return Object.assign(client, { extend: extend(client) });
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/buildRequest.js
init_base();
init_request();
init_rpc();
init_toHex();

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/promise/withDedupe.js
init_lru();
var promiseCache = /* @__PURE__ */ new LruMap(8192);
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache.get(id))
    return promiseCache.get(id);
  const promise = fn().finally(() => promiseCache.delete(id));
  promiseCache.set(id, promise);
  return promise;
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/promise/withRetry.js
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry2 = () => true } = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({ count = 0 } = {}) => {
      const retry = async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay)
          await wait(delay);
        attemptRetry({ count: count + 1 });
      };
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (count < retryCount && await shouldRetry2({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    };
    attemptRetry();
  });
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/buildRequest.js
init_stringify();
function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid: uid2 } = {
      ...options,
      ...overrideOptions
    };
    const { method } = args;
    if (methods?.exclude?.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (methods?.include && !methods.include.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    const requestId = dedupe ? stringToHex(`${uid2}.${stringify(args)}`) : void 0;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args);
      } catch (err_) {
        const err = err_;
        switch (err.code) {
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          case UnsupportedNonOptionalCapabilityError.code:
            throw new UnsupportedNonOptionalCapabilityError(err);
          case UnsupportedChainIdError.code:
            throw new UnsupportedChainIdError(err);
          case DuplicateIdError.code:
            throw new DuplicateIdError(err);
          case UnknownBundleIdError.code:
            throw new UnknownBundleIdError(err);
          case BundleTooLargeError.code:
            throw new BundleTooLargeError(err);
          case AtomicReadyWalletRejectedUpgradeError.code:
            throw new AtomicReadyWalletRejectedUpgradeError(err);
          case AtomicityNotSupportedError.code:
            throw new AtomicityNotSupportedError(err);
          case 5e3:
            throw new UserRejectedRequestError(err);
          default:
            if (err_ instanceof BaseError)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({ count, error }) => {
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get("Retry-After");
          if (retryAfter?.match(/\d/))
            return Number.parseInt(retryAfter) * 1e3;
        }
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      shouldRetry: ({ error }) => shouldRetry(error)
    }), { enabled: dedupe, id: requestId });
  };
}
function shouldRetry(error) {
  if ("code" in error && typeof error.code === "number") {
    if (error.code === -1)
      return true;
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    if (error.status === 403)
      return true;
    if (error.status === 408)
      return true;
    if (error.status === 413)
      return true;
    if (error.status === 429)
      return true;
    if (error.status === 500)
      return true;
    if (error.status === 502)
      return true;
    if (error.status === 503)
      return true;
    if (error.status === 504)
      return true;
    return false;
  }
  return true;
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid2 = uid();
  return {
    config: {
      key,
      methods,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid2 }),
    value
  };
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/errors/transport.js
init_base();
var UrlRequiredError = class extends BaseError {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
};

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/rpc/http.js
init_request();

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/promise/withTimeout.js
function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
  return new Promise((resolve, reject) => {
    ;
    (async () => {
      let timeoutId;
      try {
        const controller = new AbortController();
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        }
        resolve(await fn({ signal: controller?.signal || null }));
      } catch (err) {
        if (err?.name === "AbortError")
          reject(errorInstance);
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/rpc/http.js
init_stringify();

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/rpc/id.js
function createIdStore() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
var idCache = /* @__PURE__ */ createIdStore();

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/utils/rpc/http.js
function getHttpRpcClient(url, options = {}) {
  return {
    async request(params) {
      const { body, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
      const fetchOptions = {
        ...options.fetchOptions ?? {},
        ...params.fetchOptions ?? {}
      };
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const response = await withTimeout(async ({ signal }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? idCache.take(),
              ...body2
            }))) : stringify({
              jsonrpc: "2.0",
              id: body.id ?? idCache.take(),
              ...body
            }),
            headers: {
              "Content-Type": "application/json",
              ...headers
            },
            method: method || "POST",
            signal: signal_ || (timeout > 0 ? signal : null)
          };
          const request = new Request(url, init);
          const args = await onRequest?.(request, init) ?? { ...init, url };
          const response2 = await fetch(args.url ?? url, args);
          return response2;
        }, {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        if (onResponse)
          await onResponse(response);
        let data;
        if (response.headers.get("Content-Type")?.startsWith("application/json"))
          data = await response.json();
        else {
          data = await response.text();
          try {
            data = JSON.parse(data || "{}");
          } catch (err) {
            if (response.ok)
              throw err;
            data = { error: data };
          }
        }
        if (!response.ok) {
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}

// ../node_modules/.pnpm/viem@2.29.0_bufferutil@4.0.9_typescript@5.8.2_utf-8-validate@5.0.10_zod@3.24.2/node_modules/viem/_esm/index.js
init_request();

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/utils/scheduler.js
var schedulerCache = /* @__PURE__ */ new Map();
function createBatchScheduler({ fn, id, shouldSplitBatch, wait: wait2 = 0, sort }) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data) => {
      const isArray = Array.isArray(data);
      if (isArray && sort)
        data.sort(sort);
      for (let i = 0; i < scheduler.length; i++) {
        const { pendingPromise } = scheduler[i];
        pendingPromise.resolve?.(isArray ? [data[i], data] : [data, data]);
      }
    }).catch((err) => {
      for (let i = 0; i < scheduler.length; i++) {
        const { pendingPromise } = scheduler[i];
        pendingPromise.reject?.(err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({ args }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const pendingPromise = {};
      const promise = new Promise((resolve, reject) => {
        pendingPromise.resolve = resolve;
        pendingPromise.reject = reject;
      });
      const split = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, pendingPromise });
        return promise;
      }
      setScheduler({ args, pendingPromise });
      setTimeout(exec, wait2);
      return promise;
    }
  };
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/transports/http.js
function http(url, config = {}) {
  const { batch, fetchOptions, key = "http", methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw: raw2 } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || chain?.rpcUrls.default.http[0];
    if (!url_)
      throw new UrlRequiredError();
    const rpcClient = getHttpRpcClient(url_, {
      fetchOptions,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      methods,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const { schedule } = createBatchScheduler({
          id: url_,
          wait: wait2,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: (body2) => rpcClient.request({
            body: body2
          }),
          sort: (a, b) => a.id - b.id
        });
        const fn = async (body2) => batch ? schedule(body2) : [
          await rpcClient.request({
            body: body2
          })
        ];
        const [{ error, result }] = await fn(body);
        if (raw2)
          return { error, result };
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "http"
    }, {
      fetchOptions,
      url: url_
    });
  };
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/base/queryChainStatus.js
async function queryChainStatus(client) {
  return await client.request({ method: "status" });
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/utils/encoding.js
function toUtf8(str) {
  return new TextEncoder().encode(str);
}
function fromUtf8(data, lossy = false) {
  const fatal = !lossy;
  return new TextDecoder("utf-8", { fatal }).decode(data);
}
function fromBase64(base64) {
  if (!base64.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/)) {
    throw new Error("Invalid base64 string format");
  }
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
function toHex(bytes, prefixed = false) {
  let hexStr = "";
  for (let i = 0; i < bytes.length; i++) {
    hexStr += bytes[i].toString(16).padStart(2, "0");
  }
  return prefixed ? `0x${hexStr}` : hexStr;
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/base/queryAbci.js
async function queryAbci(client, parameters) {
  const { path, data, height = 0 } = parameters;
  const { response } = await client.request({
    method: "abci_query",
    params: {
      path,
      height: height.toString(),
      data: toHex(data),
      prove: false
    }
  });
  if (response.code === 0) {
    return {
      ...response,
      value: fromBase64(response.value ?? "")
    };
  }
  throw new Error(`query failed in codespace: ${response.codespace}, code: ${response.code}, log: ${response.log}`);
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/queryContractSmart.js
var import_query = __toESM(require_query(), 1);
async function queryContractSmart(client, parameters) {
  const { height = 0, address, msg } = parameters;
  const { value } = await queryAbci(client, {
    path: "/cosmwasm.wasm.v1.Query/SmartContractState",
    data: import_query.QuerySmartContractStateRequest.encode({
      address,
      queryData: toUtf8(JSON.stringify(msg))
    }).finish(),
    height,
    prove: false
  });
  const { data } = import_query.QuerySmartContractStateResponse.decode(value);
  return JSON.parse(fromUtf8(data));
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/base/toBaseAccount.js
var import_auth = __toESM(require_auth(), 1);
var ERR_UNKNOWN_ACCOUNT_TYPE = "Unknown account type";
function toBaseAccount({ typeUrl, value }) {
  switch (typeUrl) {
    case "/cosmos.auth.v1beta1.BaseAccount":
      return import_auth.BaseAccount.decode(value);
    default: {
      throw new Error(`${ERR_UNKNOWN_ACCOUNT_TYPE}: ${typeUrl.slice(1)}`);
    }
  }
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/base/queryAccount.js
var import_query2 = __toESM(require_query2(), 1);
async function queryAccount(client, parameters) {
  const { height = 0, address } = parameters;
  const { value } = await queryAbci(client, {
    path: "/cosmos.auth.v1beta1.Query/Account",
    data: import_query2.QueryAccountRequest.encode(import_query2.QueryAccountRequest.fromPartial({ address })).finish(),
    height,
    prove: false
  });
  const { account } = import_query2.QueryAccountResponse.decode(value);
  if (!account)
    throw new Error(`Account not found for address: ${address}`);
  return toBaseAccount(account);
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/queryAllBalances.js
var import_query3 = __toESM(require_query3(), 1);
async function queryAllBalances(client, parameters) {
  const { height = 0, ...query } = parameters;
  const { value } = await queryAbci(client, {
    path: "/cosmos.bank.v1beta1.Query/AllBalances",
    data: import_query3.QueryAllBalancesRequest.encode(query).finish(),
    height,
    prove: false
  });
  const { balances } = import_query3.QueryAllBalancesResponse.decode(value);
  return balances;
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/actions/queryDenomMetadata.js
var import_query4 = __toESM(require_query3(), 1);
async function queryDenomMetadata(client, parameters) {
  const { height = 0, ...query } = parameters;
  const { value } = await queryAbci(client, {
    path: "/cosmos.bank.v1beta1.Query/DenomMetadata",
    data: import_query4.QueryDenomMetadataRequest.encode(query).finish(),
    height,
    prove: false
  });
  return import_query4.QueryDenomMetadataResponse.decode(value);
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/public.js
function publicActions(client) {
  return {
    queryChainStatus: () => queryChainStatus(client),
    queryAbci: (args) => queryAbci(client, args),
    queryAccount: (args) => queryAccount(client, args),
    queryContractSmart: (args) => queryContractSmart(client, args),
    queryAllBalances: (args) => queryAllBalances(client, args),
    queryDenomMetadata: (args) => queryDenomMetadata(client, args)
  };
}

// ../node_modules/.pnpm/cosmi@0.1.0_@tanstack+query-core@5.67.2_@tanstack+react-query@4.36.1_react@19.0.0__@typ_dfe894a3a9fe59b79355d1403debb000/node_modules/cosmi/build/client/clients.js
function createBaseClient(params) {
  return createClient(params);
}
function createPublicClient(parameters) {
  const { key = "public", name = "Public Client" } = parameters;
  const client = createBaseClient({
    ...parameters,
    key,
    name,
    type: "publicClient"
  });
  return client.extend(publicActions);
}

// src/services/contracts.ts
var ContractService = class {
  constructor(rpcEndpoint, contracts, cache) {
    __publicField(this, "client");
    __publicField(this, "cache");
    __publicField(this, "contracts");
    this.client = createPublicClient({
      transport: http(rpcEndpoint)
    });
    this.contracts = contracts;
    this.cache = cache;
  }
  async connect() {
  }
  async disconnect() {
  }
  async getPools(limit = 100, startAfter) {
    const cacheKey = this.cache.generateKey("pools", String(limit), startAfter || "all");
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const pools = await this.client.queryContractSmart({
      address: this.contracts.factory,
      msg: {
        pairs: { limit, start_after: startAfter }
      }
    });
    await this.cache.set(cacheKey, pools, { ttl: 3e4 });
    return pools;
  }
  async getPool(poolAddress) {
    const cacheKey = this.cache.generateKey("pool", poolAddress);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const pool = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        pair: {}
      }
    });
    await this.cache.set(cacheKey, pool, { ttl: 1e4 });
    return pool;
  }
  async getPoolShares(poolAddress) {
    const cacheKey = this.cache.generateKey("pool-shares", poolAddress);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const shares = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        pool: {}
      }
    });
    await this.cache.set(cacheKey, shares, { ttl: 5e3 });
    return shares;
  }
  async getPoolConfig(poolAddress) {
    const cacheKey = this.cache.generateKey("pool-config", poolAddress);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const config = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        config: {}
      }
    });
    await this.cache.set(cacheKey, config, { ttl: 6e4 });
    return config;
  }
  async simulateSwap(poolAddress, offerAsset, askAssetInfo) {
    const cacheKey = this.cache.generateKey(
      "simulate-swap",
      poolAddress,
      JSON.stringify(offerAsset),
      JSON.stringify(askAssetInfo || {})
    );
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        simulation: {
          offer_asset: offerAsset,
          ask_asset_info: askAssetInfo
        }
      }
    });
    await this.cache.set(cacheKey, simulation, { ttl: 3e3 });
    return simulation;
  }
  async reverseSimulateSwap(poolAddress, askAsset, offerAssetInfo) {
    const cacheKey = this.cache.generateKey(
      "reverse-simulate",
      poolAddress,
      JSON.stringify(askAsset),
      JSON.stringify(offerAssetInfo || {})
    );
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        reverse_simulation: {
          ask_asset: askAsset,
          offer_asset_info: offerAssetInfo
        }
      }
    });
    await this.cache.set(cacheKey, simulation, { ttl: 3e3 });
    return simulation;
  }
  async simulateProvide(poolAddress, assets, slippage) {
    const cacheKey = this.cache.generateKey(
      "simulate-provide",
      poolAddress,
      JSON.stringify(assets),
      slippage || "default"
    );
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        simulate_provide: {
          assets,
          slippage_tolerance: slippage
        }
      }
    });
    await this.cache.set(cacheKey, simulation, { ttl: 5e3 });
    return simulation;
  }
  async simulateWithdraw(poolAddress, lpAmount) {
    const cacheKey = this.cache.generateKey(
      "simulate-withdraw",
      poolAddress,
      lpAmount
    );
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        simulate_withdraw: {
          lp_amount: lpAmount
        }
      }
    });
    await this.cache.set(cacheKey, simulation, { ttl: 5e3 });
    return simulation;
  }
  async getIncentives(lpToken, user) {
    const cacheKey = this.cache.generateKey("incentives", lpToken, user || "all");
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const msg = user ? { pending_rewards: { lp_token: lpToken, user } } : { pool_info: { lp_token: lpToken } };
      const incentives = await this.client.queryContractSmart({
        address: this.contracts.incentives,
        msg
      });
      await this.cache.set(cacheKey, incentives, { ttl: 1e4 });
      return incentives;
    } catch {
      return [];
    }
  }
  async getRouterSimulation(offerAmount, operations) {
    const cacheKey = this.cache.generateKey(
      "router-sim",
      offerAmount,
      JSON.stringify(operations)
    );
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const simulation = await this.client.queryContractSmart({
      address: this.contracts.router,
      msg: {
        simulate_swap_operations: {
          offer_amount: offerAmount,
          operations
        }
      }
    });
    await this.cache.set(cacheKey, simulation, { ttl: 3e3 });
    return simulation;
  }
  /**
   * Get token decimals from native coin registry or CW20 contract
   */
  async getTokenDecimals(assetInfo) {
    let cacheKey;
    let tokenId;
    if (assetInfo.native_token) {
      tokenId = assetInfo.native_token.denom;
      cacheKey = this.cache.generateKey("decimals-native", tokenId);
    } else if (assetInfo.token) {
      tokenId = assetInfo.token.contract_addr;
      cacheKey = this.cache.generateKey("decimals-cw20", tokenId);
    } else {
      return 6;
    }
    const cached = await this.cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }
    try {
      let decimals;
      if (assetInfo.native_token) {
        const result = await this.client.queryContractSmart({
          address: this.contracts.coinRegistry,
          msg: {
            native_token: { denom: assetInfo.native_token.denom }
          }
        });
        decimals = result.decimals || 6;
      } else if (assetInfo.token) {
        const result = await this.client.queryContractSmart({
          address: assetInfo.token.contract_addr,
          msg: {
            token_info: {}
          }
        });
        decimals = result.decimals || 6;
      } else {
        decimals = 6;
      }
      await this.cache.set(cacheKey, decimals, { ttl: 36e5 });
      return decimals;
    } catch (error) {
      console.error(`Failed to fetch decimals for ${tokenId}, using default (6):`, error.message);
      await this.cache.set(cacheKey, 6, { ttl: 3e5 });
      return 6;
    }
  }
  /**
   * Batch fetch decimals for multiple tokens
   */
  async getBatchTokenDecimals(assetInfos) {
    const decimalsMap = /* @__PURE__ */ new Map();
    const decimalsPromises = assetInfos.map(async (assetInfo) => {
      const decimals = await this.getTokenDecimals(assetInfo);
      const tokenId = assetInfo.native_token?.denom || assetInfo.token?.contract_addr || "";
      return { tokenId, decimals };
    });
    const results = await Promise.all(decimalsPromises);
    for (const { tokenId, decimals } of results) {
      if (tokenId) {
        decimalsMap.set(tokenId, decimals);
      }
    }
    return decimalsMap;
  }
  /**
   * Get PCL pool configuration (contains amp, gamma, price_scale, fees)
   */
  async getPCLPoolConfig(poolAddress) {
    const cacheKey = this.cache.generateKey("pcl-pool-config", poolAddress);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const config = await this.client.queryContractSmart({
        address: poolAddress,
        msg: {
          config: {}
        }
      });
      await this.cache.set(cacheKey, config, { ttl: 6e4 });
      return config;
    } catch (error) {
      console.error(`Failed to get PCL pool config for ${poolAddress}:`, error);
      return null;
    }
  }
  /**
   * Get PCL pool current D invariant
   */
  async getPCLPoolD(poolAddress) {
    const cacheKey = this.cache.generateKey("pcl-pool-d", poolAddress);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const d = await this.client.queryContractSmart({
        address: poolAddress,
        msg: {
          compute_d: {}
        }
      });
      await this.cache.set(cacheKey, d, { ttl: 1e4 });
      return d;
    } catch (error) {
      console.error(`Failed to get PCL pool D for ${poolAddress}:`, error);
      return null;
    }
  }
};

// src/services/amm-calculator-db.ts
var AMMCalculatorDB = class {
  constructor(databaseService, contractService) {
    __publicField(this, "databaseService");
    __publicField(this, "contractService");
    this.databaseService = databaseService;
    this.contractService = contractService;
  }
  /**
   * Get pool price data from database and calculate bid/ask
   */
  async getPoolPriceData(poolAddress, decimalsMap) {
    try {
      const [poolBalance, volumeData, recentTrades] = await Promise.all([
        this.databaseService.getPoolBalance(poolAddress),
        this.databaseService.get24HourVolume(poolAddress),
        this.databaseService.getHistoricalTrades(poolAddress, 20)
        // For bid/ask calculation
      ]);
      if (!poolBalance) {
        return null;
      }
      const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
      const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;
      const spotPrice = this.calculateSpotPriceFromTradesSync(
        recentTrades,
        poolBalance,
        baseDecimals,
        targetDecimals
      );
      const { bid, ask, spread } = this.calculateBidAskFromTradesSync(
        recentTrades,
        spotPrice,
        baseDecimals,
        targetDecimals
      );
      let priceChange24h = null;
      if (volumeData.high && volumeData.low) {
        const high = parseFloat(volumeData.high);
        const low = parseFloat(volumeData.low);
        if (low > 0) {
          priceChange24h = (high - low) / low * 100;
        }
      }
      return {
        spotPrice,
        bidPrice: bid,
        askPrice: ask,
        spread,
        volume24h: {
          baseVolume: volumeData.baseVolume,
          targetVolume: volumeData.targetVolume
        },
        high24h: volumeData.high ? parseFloat(volumeData.high) : null,
        low24h: volumeData.low ? parseFloat(volumeData.low) : null,
        priceChange24h
      };
    } catch (error) {
      console.error(`Error getting pool price data for ${poolAddress}:`, error);
      return null;
    }
  }
  /**
   * Get pool balance directly from database
   */
  async getPoolBalance(poolAddress) {
    return await this.databaseService.getPoolBalance(poolAddress);
  }
  /**
   * Get pool balances for multiple pools efficiently
   */
  async getBatchPoolBalances(poolAddresses) {
    const balances = await this.databaseService.getBatchPoolBalances(poolAddresses);
    const balanceMap = /* @__PURE__ */ new Map();
    for (const balance of balances) {
      balanceMap.set(balance.poolAddress, balance);
    }
    return balanceMap;
  }
  /**
   * Calculate spot price from the last actual swap
   */
  async calculateSpotPriceFromLastSwap(poolAddress, poolBalance, baseDecimals, targetDecimals) {
    try {
      const lastSwaps = await this.databaseService.getHistoricalTrades(poolAddress, 1);
      if (lastSwaps.length === 0) {
        return this.calculateSpotPriceFromReserves(
          poolBalance.token0Balance,
          poolBalance.token1Balance,
          baseDecimals,
          targetDecimals
        );
      }
      const lastSwap = lastSwaps[0];
      const isToken0Offer = lastSwap.offerAsset === poolBalance.token0Denom;
      const isToken1Offer = lastSwap.offerAsset === poolBalance.token1Denom;
      if (!isToken0Offer && !isToken1Offer) {
        return this.calculateSpotPriceFromReserves(
          poolBalance.token0Balance,
          poolBalance.token1Balance,
          baseDecimals,
          targetDecimals
        );
      }
      const offerAmount = Number(lastSwap.offerAmount);
      const returnAmount = Number(lastSwap.returnAmount);
      if (offerAmount === 0 || returnAmount === 0) {
        return this.calculateSpotPriceFromReserves(
          poolBalance.token0Balance,
          poolBalance.token1Balance,
          baseDecimals,
          targetDecimals
        );
      }
      let spotPrice;
      if (isToken0Offer) {
        const token0AmountNormalized = offerAmount / Math.pow(10, baseDecimals);
        const token1AmountNormalized = returnAmount / Math.pow(10, targetDecimals);
        spotPrice = token1AmountNormalized / token0AmountNormalized;
      } else {
        const token1AmountNormalized = offerAmount / Math.pow(10, targetDecimals);
        const token0AmountNormalized = returnAmount / Math.pow(10, baseDecimals);
        spotPrice = token1AmountNormalized / token0AmountNormalized;
      }
      return spotPrice;
    } catch (error) {
      console.error("Error calculating spot price from last swap:", error);
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }
  }
  /**
   * Fallback: Calculate spot price from pool reserves
   */
  calculateSpotPriceFromReserves(baseReserve, targetReserve, baseDecimals, targetDecimals) {
    const baseAmount = Number(baseReserve) / Math.pow(10, baseDecimals);
    const targetAmount = Number(targetReserve) / Math.pow(10, targetDecimals);
    if (baseAmount === 0)
      return 0;
    return targetAmount / baseAmount;
  }
  /**
   * Calculate bid/ask prices from recent trades or use default spread
   */
  async calculateBidAskFromTrades(poolAddress, spotPrice, baseDecimals, targetDecimals) {
    try {
      const recentTrades = await this.databaseService.getHistoricalTrades(
        poolAddress,
        20
        // Get last 20 trades
      );
      if (recentTrades.length > 0) {
        const prices = [];
        for (const trade of recentTrades) {
          if (trade.offerAmount && trade.returnAmount) {
            const offerAmount = Number(trade.offerAmount) / Math.pow(10, baseDecimals);
            const returnAmount = Number(trade.returnAmount) / Math.pow(10, targetDecimals);
            if (offerAmount > 0) {
              const effectivePrice = returnAmount / offerAmount;
              if (effectivePrice > 0 && isFinite(effectivePrice)) {
                prices.push(effectivePrice);
              }
            }
          }
        }
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const bid = Math.min(minPrice, spotPrice * 0.997);
          const ask = Math.max(maxPrice, spotPrice * 1.003);
          const spread = (ask - bid) / ask;
          return { bid, ask, spread };
        }
      }
      const defaultSpread = 3e-3;
      return {
        bid: spotPrice * (1 - defaultSpread),
        ask: spotPrice * (1 + defaultSpread),
        spread: defaultSpread * 2
      };
    } catch (error) {
      console.error("Error calculating bid/ask from trades:", error);
      const defaultSpread = 3e-3;
      return {
        bid: spotPrice * (1 - defaultSpread),
        ask: spotPrice * (1 + defaultSpread),
        spread: defaultSpread * 2
      };
    }
  }
  /**
   * Calculate liquidity in USD using database prices
   */
  async calculateLiquidityUSD(poolBalance, tokenPrices, decimalsMap) {
    const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
    const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;
    const baseAmount = Number(poolBalance.token0Balance) / Math.pow(10, baseDecimals);
    const targetAmount = Number(poolBalance.token1Balance) / Math.pow(10, targetDecimals);
    const basePrice = tokenPrices?.get(poolBalance.token0Denom) || 0;
    const targetPrice = tokenPrices?.get(poolBalance.token1Denom) || 0;
    return baseAmount * basePrice + targetAmount * targetPrice;
  }
  /**
   * Get historical trades for a pool
   */
  async getHistoricalTrades(poolAddress, limit = 100, startTime, endTime) {
    return await this.databaseService.getHistoricalTrades(
      poolAddress,
      limit,
      startTime,
      endTime
    );
  }
  /**
   * Calculate price impact based on historical trades
   */
  async calculatePriceImpact(poolAddress, tradeAmount, isBase = true, decimalsMap) {
    try {
      const poolBalance = await this.databaseService.getPoolBalance(poolAddress);
      if (!poolBalance)
        return 0;
      const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
      const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;
      const spotPrice = this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
      const recentTrades = await this.databaseService.getHistoricalTrades(
        poolAddress,
        50
      );
      const tradeAmountNum = Number(tradeAmount);
      const similarTrades = recentTrades.filter((trade) => {
        const amount = isBase ? Number(trade.offerAmount) : Number(trade.returnAmount);
        return amount >= tradeAmountNum * 0.5 && amount <= tradeAmountNum * 2;
      });
      if (similarTrades.length > 0) {
        let totalImpact = 0;
        let validTrades = 0;
        for (const trade of similarTrades) {
          if (trade.offerAmount && trade.returnAmount) {
            const offerAmount = Number(trade.offerAmount) / Math.pow(10, baseDecimals);
            const returnAmount = Number(trade.returnAmount) / Math.pow(10, targetDecimals);
            if (offerAmount > 0) {
              const effectivePrice = returnAmount / offerAmount;
              const impact = Math.abs((spotPrice - effectivePrice) / spotPrice);
              if (isFinite(impact)) {
                totalImpact += impact;
                validTrades++;
              }
            }
          }
        }
        if (validTrades > 0) {
          return totalImpact / validTrades;
        }
      }
      const poolSize = isBase ? Number(poolBalance.token0Balance) : Number(poolBalance.token1Balance);
      const tradePercent = tradeAmountNum / poolSize;
      return tradePercent * 0.5;
    } catch (error) {
      console.error("Error calculating price impact:", error);
      return 0;
    }
  }
  /**
   * Get all pools from database
   */
  async getAllPools(limit = 100) {
    return await this.databaseService.getPools(limit);
  }
  /**
   * Calculate spot price from pre-fetched trades (synchronous)
   * This replaces the async calculateSpotPriceFromLastSwap for better performance
   */
  calculateSpotPriceFromTradesSync(recentTrades, poolBalance, baseDecimals, targetDecimals) {
    if (recentTrades.length === 0) {
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }
    const lastSwap = recentTrades[0];
    const isToken0Offer = lastSwap.offerAsset === poolBalance.token0Denom;
    const isToken1Offer = lastSwap.offerAsset === poolBalance.token1Denom;
    if (!isToken0Offer && !isToken1Offer) {
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }
    const offerAmount = Number(lastSwap.offerAmount);
    const returnAmount = Number(lastSwap.returnAmount);
    if (offerAmount === 0 || returnAmount === 0) {
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }
    let spotPrice;
    if (isToken0Offer) {
      const token0AmountNormalized = offerAmount / Math.pow(10, baseDecimals);
      const token1AmountNormalized = returnAmount / Math.pow(10, targetDecimals);
      spotPrice = token1AmountNormalized / token0AmountNormalized;
    } else {
      const token1AmountNormalized = offerAmount / Math.pow(10, targetDecimals);
      const token0AmountNormalized = returnAmount / Math.pow(10, baseDecimals);
      spotPrice = token1AmountNormalized / token0AmountNormalized;
    }
    return spotPrice;
  }
  /**
   * Calculate bid/ask from pre-fetched trades (synchronous)
   * This replaces the async calculateBidAskFromTrades for better performance
   */
  calculateBidAskFromTradesSync(recentTrades, spotPrice, baseDecimals, targetDecimals) {
    if (recentTrades.length === 0) {
      const spread2 = 3e-3;
      return {
        bid: spotPrice * (1 - spread2),
        ask: spotPrice * (1 + spread2),
        spread: spread2
      };
    }
    const prices = [];
    for (const trade of recentTrades) {
      if (trade.offerAmount && trade.returnAmount) {
        const offerAmount = Number(trade.offerAmount) / Math.pow(10, baseDecimals);
        const returnAmount = Number(trade.returnAmount) / Math.pow(10, targetDecimals);
        if (offerAmount > 0) {
          const effectivePrice = returnAmount / offerAmount;
          prices.push(effectivePrice);
        }
      }
    }
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const calculatedSpread = avgPrice > 0 ? (maxPrice - minPrice) / avgPrice : 3e-3;
      const spread2 = Math.max(calculatedSpread, 1e-3);
      return {
        bid: spotPrice * (1 - spread2 / 2),
        ask: spotPrice * (1 + spread2 / 2),
        spread: spread2
      };
    }
    const spread = 3e-3;
    return {
      bid: spotPrice * (1 - spread),
      ask: spotPrice * (1 + spread),
      spread
    };
  }
  /**
   * Get 24-hour volume data
   */
  async get24HourVolume(poolAddress) {
    return await this.databaseService.get24HourVolume(poolAddress);
  }
  /**
   * Format price for display
   */
  static formatPrice(price, significantDigits = 6) {
    if (price === 0)
      return "0";
    if (price < 1e-6) {
      return price.toExponential(significantDigits - 1);
    } else if (price > 1e6) {
      return price.toExponential(significantDigits - 1);
    } else {
      return price.toFixed(significantDigits);
    }
  }
  /**
   * Hybrid approach: Use database for historical data, contracts for real-time
   * This method can fall back to contract queries if database is behind
   */
  async getHybridSpotPrice(poolAddress, baseAssetInfo, targetAssetInfo, decimalsMap) {
    try {
      const poolBalance = await this.databaseService.getPoolBalance(poolAddress);
      if (poolBalance) {
        const baseDecimals2 = decimalsMap?.get(poolBalance.token0Denom) || 6;
        const targetDecimals2 = decimalsMap?.get(poolBalance.token1Denom) || 6;
        return this.calculateSpotPriceFromReserves(
          poolBalance.token0Balance,
          poolBalance.token1Balance,
          baseDecimals2,
          targetDecimals2
        );
      }
      const baseDecimals = decimalsMap?.get(
        baseAssetInfo.native_token?.denom || baseAssetInfo.token?.contract_addr || ""
      ) || 6;
      const testAmount = Math.pow(10, baseDecimals).toString();
      const simulation = await this.contractService.simulateSwap(
        poolAddress,
        {
          info: baseAssetInfo,
          amount: testAmount
        }
      );
      const targetDecimals = decimalsMap?.get(
        targetAssetInfo.native_token?.denom || targetAssetInfo.token?.contract_addr || ""
      ) || 6;
      const baseAmountNormalized = Number(testAmount) / Math.pow(10, baseDecimals);
      const targetAmountNormalized = Number(simulation.return_amount) / Math.pow(10, targetDecimals);
      return targetAmountNormalized / baseAmountNormalized;
    } catch (error) {
      console.error("Error in hybrid spot price calculation:", error);
      return 1;
    }
  }
};

// src/services/database.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { sql as sql2, eq, desc, and, gte, lte, inArray } from "drizzle-orm";
import pg from "pg";

// ../indexer/src/drizzle/schema.ts
import { pgSchema, foreignKey, integer, text, bigint, timestamp, index as index2, serial, boolean, numeric, jsonb, smallint, doublePrecision, json } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
var v1Cosmos = pgSchema("v1_cosmos");
var hubble = pgSchema("hubble");
var poolLpTokensIdSeqInV1Cosmos = v1Cosmos.sequence("pool_lp_tokens_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false });
var contractStatusInHubble = hubble.table("contract_status", {
  internalChainId: integer("internal_chain_id").notNull(),
  address: text().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }).notNull(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull()
}, (table) => [
  foreignKey({
    columns: [table.internalChainId],
    foreignColumns: [chainsInHubble.id],
    name: "fk_internal_chain_id"
  }).onDelete("cascade")
]);
var clientsInHubble = hubble.table("clients", {
  chainId: integer("chain_id").notNull(),
  clientId: text("client_id").notNull(),
  counterpartyChainId: text("counterparty_chain_id").notNull()
}, (table) => [
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "clients_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade")
]);
var blockStatusInHubble = hubble.table("block_status", {
  indexerId: text("indexer_id").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }).notNull(),
  hash: text().notNull(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull()
}, (table) => [
  index2("block_status_height_idx").using("btree", table.height.asc().nullsLast().op("int8_ops"))
]);
var consensusHeightsInHubble = hubble.table("consensus_heights", {
  chainId: integer("chain_id").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  executionHeight: bigint("execution_height", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  consensusHeight: bigint("consensus_height", { mode: "number" }).notNull()
}, (table) => [
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "consensus_heights_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade")
]);
var blockFixInHubble = hubble.table("block_fix", {
  indexerId: text("indexer_id").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  startHeight: bigint("start_height", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  endHeight: bigint("end_height", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull()
});
var chainsInHubble = hubble.table("chains", {
  id: serial().notNull(),
  chainId: text("chain_id").notNull(),
  displayName: text("display_name"),
  testnet: boolean(),
  maxTipAgeSeconds: numeric("max_tip_age_seconds"),
  rpcType: text("rpc_type"),
  addrPrefix: text("addr_prefix"),
  enabled: boolean().default(false).notNull(),
  logoUri: text("logo_uri"),
  enabledStaging: boolean("enabled_staging").default(false).notNull(),
  execution: boolean().default(false).notNull(),
  indexerId: text("indexer_id"),
  maxMappedExecutionHeightGap: integer("max_mapped_execution_height_gap")
}, (table) => [
  index2("chains_chain_id_idx").using("btree", table.chainId.asc().nullsLast().op("text_ops"), table.id.asc().nullsLast().op("text_ops"))
]);
var indexerStatusInHubble = hubble.table("indexer_status", {
  indexerId: text("indexer_id").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }).notNull(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull()
});
var assetsInHubble = hubble.table("assets", {
  chainId: integer("chain_id").notNull(),
  denom: text().notNull(),
  displaySymbol: text("display_symbol"),
  decimals: integer(),
  logoUri: text("logo_uri"),
  displayName: text("display_name"),
  gasToken: boolean("gas_token").default(false).notNull(),
  source: text()
}, (table) => [
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "assets_chain_id_fkey"
  }).onUpdate("set null").onDelete("set null")
]);
var tokenSourcesInHubble = hubble.table("token_sources", {
  id: serial().notNull(),
  sourceUri: text("source_uri").notNull(),
  name: text().notNull(),
  logoUri: text("logo_uri"),
  enabled: boolean().default(true),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull()
});
var eventsInV1Cosmos = v1Cosmos.table("events", {
  chainId: integer("chain_id").notNull(),
  blockHash: text("block_hash").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }).notNull(),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  index: integer().notNull(),
  data: jsonb().notNull(),
  time: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow()
}, (table) => [
  index2("events_height_idx").using("btree", table.height.asc().nullsLast().op("int8_ops")),
  index2("events_recv_packet_by_chain_destination_channel_sequence_idx").using("btree", sql`chain_id`, sql`((attributes(events.*) ->> 'packet_sequence'::text))::numeric`, sql`null`).where(sql`((data ->> 'type'::text) = 'recv_packet'::text)`),
  index2("events_send_packet_by_chain_id_tx_hash_msg_index_idx").using("btree", sql`chain_id`, sql`transaction_hash`, sql`null`).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
  index2("events_send_packet_by_time_idx").using("btree", table.time.desc().nullsFirst().op("timestamptz_ops")).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
  index2("events_send_packet_by_tx_hash_msg_index_idx").using("btree", sql`transaction_hash`, sql`null`).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
  index2("events_transaction_hash_int4_idx").using("btree", sql`transaction_hash`, sql`null`),
  index2("events_update_client_by_chain_id_revision_height_idx").using("btree", sql`chain_id`, sql`'-'::text`).where(sql`((data ->> 'type'::text) = 'update_client'::text)`),
  index2("events_wasm_ibc_transfer_by_time_idx").using("btree", table.time.desc().nullsFirst().op("timestamptz_ops")).where(sql`(((data ->> 'type'::text) = 'wasm-ibc_transfer'::text) AND ((attributes(events.*) ->> 'assets'::text) IS NOT NULL))`),
  index2("idx_events_height").using("btree", table.chainId.asc().nullsLast().op("int8_ops"), table.height.asc().nullsLast().op("int4_ops")),
  index2("idx_events_height_desc").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.desc().nullsFirst().op("int8_ops")),
  index2("idx_events_type").using("btree", sql`(data ->> 'type'::text)`),
  foreignKey({
    columns: [table.chainId, table.blockHash],
    foreignColumns: [blocksInV1Cosmos.chainId, blocksInV1Cosmos.hash],
    name: "events_chain_id_block_hash_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "events_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.chainId, table.transactionHash],
    foreignColumns: [transactionsInV1Cosmos.chainId, transactionsInV1Cosmos.hash],
    name: "events_chain_id_transaction_hash_fkey"
  }).onUpdate("cascade").onDelete("cascade")
]);
var contractsInV1Cosmos = v1Cosmos.table("contracts", {
  internalChainId: integer("internal_chain_id").notNull(),
  address: text().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  startHeight: bigint("start_height", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  endHeight: bigint("end_height", { mode: "number" }).default(sql`'9223372036854775807'`).notNull(),
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull()
}, (table) => [
  foreignKey({
    columns: [table.internalChainId],
    foreignColumns: [chainsInHubble.id],
    name: "contracts_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade")
]);
var tokenInV1Cosmos = v1Cosmos.table("token", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.token_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854776e3, cache: 1 }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  coingeckoId: text("coingecko_id").notNull(),
  denomination: text(),
  tokenName: text("token_name"),
  chainId: integer("chain_id"),
  decimals: smallint()
}, (table) => [
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "token_chain_id_fkey"
  })
]);
var transactionsInV1Cosmos = v1Cosmos.table("transactions", {
  chainId: integer("chain_id").notNull(),
  blockHash: text("block_hash").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }).notNull(),
  data: jsonb().notNull(),
  hash: text().notNull(),
  index: integer().notNull()
}, (table) => [
  index2("transactions_chain_id_height").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.desc().nullsFirst().op("int8_ops")),
  foreignKey({
    columns: [table.chainId, table.blockHash],
    foreignColumns: [blocksInV1Cosmos.chainId, blocksInV1Cosmos.hash],
    name: "transactions_block_hash_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "transactions_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade")
]);
var blocksInV1Cosmos = v1Cosmos.table("blocks", {
  chainId: integer("chain_id").notNull(),
  hash: text().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }).notNull(),
  time: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  data: jsonb().notNull()
}, (table) => [
  index2("blocks_height_idx").using("btree", table.height.asc().nullsLast().op("int8_ops")),
  index2("idx_blocks_height").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.asc().nullsLast().op("int4_ops")),
  index2("idx_blocks_time").using("btree", table.time.asc().nullsLast().op("timestamptz_ops")),
  foreignKey({
    columns: [table.chainId],
    foreignColumns: [chainsInHubble.id],
    name: "blocks_chain_id_fkey"
  }).onUpdate("cascade").onDelete("cascade")
]);
var poolLpTokenInV1Cosmos = v1Cosmos.table("pool_lp_token", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.pool_lp_token_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854776e3, cache: 1 }),
  pool: text().notNull(),
  lpToken: text("lp_token").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull()
}, (table) => [
  index2("idx_pool_lp_token_lp_token").using("btree", table.lpToken.asc().nullsLast().op("text_ops"))
]);
var tokenPricesInV1Cosmos = v1Cosmos.table("token_prices", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.token_prices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854776e3, cache: 1 }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  price: numeric(),
  lastUpdatedAt: numeric("last_updated_at"),
  token: text()
});
var materializedHistoricPoolYieldInV1Cosmos = v1Cosmos.materializedView("materialized_historic_pool_yield", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  poolAddress: text("pool_address"),
  token0Denom: text("token0_denom"),
  token1Denom: text("token1_denom"),
  token0Balance: numeric("token0_balance"),
  token1Balance: numeric("token1_balance"),
  token0ValueUsd: doublePrecision("token0_value_usd"),
  token1ValueUsd: doublePrecision("token1_value_usd"),
  totalLiquidityUsd: doublePrecision("total_liquidity_usd"),
  feeTokens: json("fee_tokens"),
  feesUsd: doublePrecision("fees_usd"),
  incentiveTokens: json("incentive_tokens"),
  incentivesUsd: doublePrecision("incentives_usd"),
  totalEarningsUsd: doublePrecision("total_earnings_usd")
}).as(sql`WITH block_data AS ( SELECT b.height, b."time" AS "timestamp", lead(b."time") OVER (ORDER BY b.height) AS next_timestamp, lead(b.height) OVER (ORDER BY b.height) AS next_height FROM v1_cosmos.blocks b ), token_prices_by_block AS ( SELECT bd_1.height, bd_1."timestamp", bd_1.next_timestamp, bd_1.next_height, EXTRACT(epoch FROM bd_1.next_timestamp - bd_1."timestamp") AS seconds_between_blocks, t.denomination, tp.price, t.decimals, t.token_name FROM block_data bd_1 CROSS JOIN LATERAL ( SELECT DISTINCT token_prices.token FROM v1_cosmos.token_prices) d LEFT JOIN LATERAL ( SELECT token_prices.token, token_prices.price FROM v1_cosmos.token_prices WHERE token_prices.token = d.token ORDER BY (abs(EXTRACT(epoch FROM bd_1."timestamp" - token_prices.created_at))) LIMIT 1) tp ON true LEFT JOIN v1_cosmos.token t ON tp.token = t.token_name WHERE bd_1.next_height IS NOT NULL ), block_fees AS ( SELECT s.height, s.pool_address, s.ask_asset AS fee_token_denom, sum(s.commission_amount) AS fee_amount, sum(s.commission_amount::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS fees_usd FROM v1_cosmos.materialized_swap s LEFT JOIN token_prices_by_block tp ON s.height = tp.height AND s.ask_asset = tp.denomination GROUP BY s.height, s.pool_address, s.ask_asset, tp.price, tp.decimals ), block_incentives AS ( SELECT bp.height, i.lp_token, i.reward AS incentive_token_denom, sum(i.rewards_per_second * tp.seconds_between_blocks) AS incentive_amount, sum((i.rewards_per_second * tp.seconds_between_blocks)::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS incentives_usd FROM block_data bp JOIN v1_cosmos.materialized_incentivize i ON i.start_ts::numeric <= EXTRACT(epoch FROM bp."timestamp") AND i.end_ts::numeric >= EXTRACT(epoch FROM bp."timestamp") LEFT JOIN token_prices_by_block tp ON bp.height = tp.height AND i.reward = tp.denomination GROUP BY bp.height, i.lp_token, i.reward, tp.seconds_between_blocks, tp.price, tp.decimals ), pool_info AS ( SELECT DISTINCT materialized_pool_balance.pool_address, (materialized_pool_balance.token0_denom || ':'::text) || materialized_pool_balance.token1_denom AS lp_token FROM v1_cosmos.materialized_pool_balance ), pool_liquidity AS ( SELECT h.height, a.pool_address, a.token0_denom, a.token1_denom, a.token0_balance, a.token1_balance, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision AS token0_value_usd, a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS token1_value_usd, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision + a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS total_liquidity_usd FROM v1_cosmos.blocks h JOIN v1_cosmos.materialized_pool_balance a ON h.height = a.height LEFT JOIN token_prices_by_block tp0 ON h.height = tp0.height AND a.token0_denom = tp0.denomination LEFT JOIN token_prices_by_block tp1 ON h.height = tp1.height AND a.token1_denom = tp1.denomination ), total_fees_by_pool AS ( SELECT block_fees.height, block_fees.pool_address, json_agg(json_build_object('denom', block_fees.fee_token_denom, 'amount', block_fees.fee_amount, 'usd_value', block_fees.fees_usd)) AS fee_tokens, sum(block_fees.fees_usd) AS total_fees_usd FROM block_fees GROUP BY block_fees.height, block_fees.pool_address ), total_incentives_by_pool AS ( SELECT bi.height, pi.pool_address, json_agg(json_build_object('denom', bi.incentive_token_denom, 'amount', bi.incentive_amount, 'usd_value', bi.incentives_usd)) AS incentive_tokens, sum(bi.incentives_usd) AS total_incentives_usd FROM block_incentives bi LEFT JOIN pool_info pi ON bi.lp_token = pi.lp_token GROUP BY bi.height, pi.pool_address ) SELECT bd.height, bd."timestamp", pl.pool_address, pl.token0_denom, pl.token1_denom, pl.token0_balance, pl.token1_balance, pl.token0_value_usd, pl.token1_value_usd, pl.total_liquidity_usd, tf.fee_tokens, COALESCE(tf.total_fees_usd, 0::double precision) AS fees_usd, ti.incentive_tokens, COALESCE(ti.total_incentives_usd, 0::double precision) AS incentives_usd, COALESCE(tf.total_fees_usd, 0::double precision) + COALESCE(ti.total_incentives_usd, 0::double precision) AS total_earnings_usd FROM block_data bd JOIN pool_liquidity pl ON bd.height = pl.height LEFT JOIN total_fees_by_pool tf ON bd.height = tf.height AND pl.pool_address = tf.pool_address LEFT JOIN total_incentives_by_pool ti ON bd.height = ti.height AND pl.pool_address = ti.pool_address WHERE bd.next_height IS NOT NULL ORDER BY bd.height, pl.pool_address`);
var materializedUnstakeLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_unstake_liquidity", {
  sender: text(),
  owner: text(),
  amount: numeric(),
  lpToken: text("lp_token"),
  pool: text(),
  incentiveAddress: text("incentive_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'sender'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-withdraw'::text`);
var poolBalanceInV1Cosmos = v1Cosmos.view("pool_balance", {
  poolAddress: text("pool_address"),
  token0Denom: text("token0_denom"),
  token0Balance: numeric("token0_balance"),
  token1Denom: text("token1_denom"),
  token1Balance: numeric("token1_balance"),
  share: numeric(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" })
}).as(sql`WITH all_heights AS ( SELECT DISTINCT all_events.pool_address, all_events.height FROM ( SELECT add_liquidity.pool_address, add_liquidity.height FROM v1_cosmos.add_liquidity UNION ALL SELECT withdraw_liquidity.pool_address, withdraw_liquidity.height FROM v1_cosmos.withdraw_liquidity UNION ALL SELECT swap.pool_address, swap.height FROM v1_cosmos.swap) all_events ), add_liquidity AS ( SELECT add_liquidity.pool_address, add_liquidity.token0_denom, sum(add_liquidity.token0_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token0_denom ORDER BY add_liquidity.height) AS total_token0_added, add_liquidity.token1_denom, sum(add_liquidity.token1_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token1_denom ORDER BY add_liquidity.height) AS total_token1_added, sum(add_liquidity.share) OVER (PARTITION BY add_liquidity.pool_address ORDER BY add_liquidity.height) AS total_share_added, add_liquidity.height FROM v1_cosmos.add_liquidity ), withdraw_liquidity AS ( SELECT withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom, sum(withdraw_liquidity.token0_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom ORDER BY withdraw_liquidity.height) AS total_token0_withdrawn, withdraw_liquidity.token1_denom, sum(withdraw_liquidity.token1_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token1_denom ORDER BY withdraw_liquidity.height) AS total_token1_withdrawn, sum(withdraw_liquidity.share) OVER (PARTITION BY withdraw_liquidity.pool_address ORDER BY withdraw_liquidity.height) AS total_share_withdrawn, withdraw_liquidity.height FROM v1_cosmos.withdraw_liquidity ), swap_impact AS ( SELECT s_1.pool_address, s_1.height, CASE WHEN s_1.offer_asset = p.token0_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token0_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token0_swap_impact, CASE WHEN s_1.offer_asset = p.token1_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token1_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token1_swap_impact FROM v1_cosmos.swap s_1 JOIN ( SELECT DISTINCT add_liquidity.pool_address, add_liquidity.token0_denom, add_liquidity.token1_denom FROM v1_cosmos.add_liquidity) p ON s_1.pool_address = p.pool_address ), swap_totals AS ( SELECT swap_impact.pool_address, sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact, sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact, swap_impact.height FROM swap_impact ) SELECT h.pool_address, a.token0_denom, COALESCE(a.total_token0_added, 0::numeric) - COALESCE(w.total_token0_withdrawn, 0::numeric) + COALESCE(s.total_token0_swap_impact, 0::numeric) AS token0_balance, a.token1_denom, COALESCE(a.total_token1_added, 0::numeric) - COALESCE(w.total_token1_withdrawn, 0::numeric) + COALESCE(s.total_token1_swap_impact, 0::numeric) AS token1_balance, COALESCE(a.total_share_added, 0::numeric) - COALESCE(w.total_share_withdrawn, 0::numeric) AS share, h.height FROM all_heights h LEFT JOIN add_liquidity a ON h.pool_address = a.pool_address AND h.height >= a.height AND a.height = (( SELECT max(add_liquidity.height) AS max FROM add_liquidity WHERE add_liquidity.pool_address = h.pool_address AND add_liquidity.height <= h.height)) LEFT JOIN withdraw_liquidity w ON h.pool_address = w.pool_address AND h.height >= w.height AND w.height = (( SELECT max(withdraw_liquidity.height) AS max FROM withdraw_liquidity WHERE withdraw_liquidity.pool_address = h.pool_address AND withdraw_liquidity.height <= h.height)) LEFT JOIN swap_totals s ON h.pool_address = s.pool_address AND h.height >= s.height AND s.height = (( SELECT max(swap_totals.height) AS max FROM swap_totals WHERE swap_totals.pool_address = h.pool_address AND swap_totals.height <= h.height))`);
var swapInV1Cosmos = v1Cosmos.view("swap", {
  sender: text(),
  receiver: text(),
  askAsset: text("ask_asset"),
  commissionAmount: numeric("commission_amount"),
  feeShareAmount: numeric("fee_share_amount"),
  makerFeeAmount: numeric("maker_fee_amount"),
  offerAmount: numeric("offer_amount"),
  offerAsset: text("offer_asset"),
  returnAmount: numeric("return_amount"),
  spreadAmount: numeric("spread_amount"),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  transactionEventIndex: integer("transaction_event_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, attributes(events.*) ->> 'ask_asset'::text AS ask_asset, (attributes(events.*) ->> 'commission_amount'::text)::numeric AS commission_amount, (attributes(events.*) ->> 'fee_share_amount'::text)::numeric AS fee_share_amount, (attributes(events.*) ->> 'maker_fee_amount'::text)::numeric AS maker_fee_amount, (attributes(events.*) ->> 'offer_amount'::text)::numeric AS offer_amount, attributes(events.*) ->> 'offer_asset'::text AS offer_asset, (attributes(events.*) ->> 'return_amount'::text)::numeric AS return_amount, (attributes(events.*) ->> 'spread_amount'::text)::numeric AS spread_amount, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-swap'::text`);
var stakeLiquidityInV1Cosmos = v1Cosmos.view("stake_liquidity", {
  sender: text(),
  owner: text(),
  amount: numeric(),
  lpToken: text("lp_token"),
  pool: text(),
  incentiveAddress: text("incentive_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'user'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-deposit'::text`);
var incentivizeInV1Cosmos = v1Cosmos.view("incentivize", {
  lpToken: text("lp_token"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  startTs: bigint("start_ts", { mode: "number" }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  endTs: bigint("end_ts", { mode: "number" }),
  reward: text(),
  rewardsPerSecond: numeric("rewards_per_second"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  transactionEventIndex: integer("transaction_event_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'lp_token'::text AS lp_token, (attributes(events.*) ->> 'start_ts'::text)::bigint AS start_ts, (attributes(events.*) ->> 'end_ts'::text)::bigint AS end_ts, attributes(events.*) ->> 'reward'::text AS reward, (attributes(events.*) ->> 'rps'::text)::numeric AS rewards_per_second, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-incentivize'::text`);
var unstakeLiquidityInV1Cosmos = v1Cosmos.view("unstake_liquidity", {
  sender: text(),
  owner: text(),
  amount: numeric(),
  lpToken: text("lp_token"),
  pool: text(),
  incentiveAddress: text("incentive_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'sender'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-withdraw'::text`);
var poolsInV1Cosmos = v1Cosmos.view("pools", {
  token0: text(),
  token1: text(),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  createIndex: integer("create_index"),
  registerIndex: integer("register_index"),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  createTransactionIndex: integer("create_transaction_index"),
  registerTransactionIndex: integer("register_transaction_index")
}).as(sql`WITH create_pair AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair'::text AS pair, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-create_pair'::text ), register AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair_contract_addr'::text AS pair_contract_addr, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-register'::text ) SELECT split_part(cp.pair, '-'::text, 1) AS token0, split_part(cp.pair, '-'::text, 2) AS token1, r.pair_contract_addr AS pool_address, cp.msg_index::integer AS msg_index, cp.internal_chain_id, cp.block_hash, cp.height, cp.index AS create_index, r.index AS register_index, cp."timestamp", cp.transaction_hash, cp.transaction_index AS create_transaction_index, r.transaction_index AS register_transaction_index FROM create_pair cp JOIN register r ON cp.transaction_hash = r.transaction_hash`);
var addLiquidityInV1Cosmos = v1Cosmos.view("add_liquidity", {
  sender: text(),
  receiver: text(),
  token0Denom: text("token0_denom"),
  token0Amount: numeric("token0_amount"),
  token1Denom: text("token1_denom"),
  token1Amount: numeric("token1_amount"),
  share: numeric(),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'share'::text)::numeric AS share, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text`);
var poolUserSharesInV1Cosmos = v1Cosmos.view("pool_user_shares", {
  poolAddress: text("pool_address"),
  owner: text(),
  incentiveAddress: text("incentive_address"),
  totalShareAmount: numeric("total_share_amount"),
  stakedShareAmount: numeric("staked_share_amount"),
  unstakedShareAmount: numeric("unstaked_share_amount"),
  lastUpdateTime: timestamp("last_update_time", { withTimezone: true, mode: "string" })
}).as(sql`WITH combined_liquidity_operations AS ( SELECT COALESCE(add_liquidity.receiver, add_liquidity.sender) AS owner, add_liquidity.pool_address, add_liquidity.share AS share_amount, add_liquidity."timestamp" FROM v1_cosmos.add_liquidity UNION ALL SELECT withdraw_liquidity.receiver AS owner, withdraw_liquidity.pool_address, - withdraw_liquidity.share AS share_amount, withdraw_liquidity."timestamp" FROM v1_cosmos.withdraw_liquidity ), user_total_shares AS ( SELECT combined_liquidity_operations.pool_address, combined_liquidity_operations.owner, sum(combined_liquidity_operations.share_amount) AS total_share_amount, max(combined_liquidity_operations."timestamp") AS last_update_time FROM combined_liquidity_operations GROUP BY combined_liquidity_operations.pool_address, combined_liquidity_operations.owner HAVING sum(combined_liquidity_operations.share_amount) > 0::numeric ), user_staked_shares AS ( SELECT stake_liquidity.pool, stake_liquidity.owner, sum(stake_liquidity.amount) AS staked_share_amount, stake_liquidity.incentive_address FROM v1_cosmos.stake_liquidity GROUP BY stake_liquidity.pool, stake_liquidity.owner, stake_liquidity.incentive_address ), user_unstaked_shares AS ( SELECT unstake_liquidity.pool, unstake_liquidity.owner, sum(unstake_liquidity.amount) AS unstaked_share_amount FROM v1_cosmos.unstake_liquidity GROUP BY unstake_liquidity.pool, unstake_liquidity.owner ), final_user_shares AS ( SELECT t.pool_address, t.owner, s.incentive_address, t.total_share_amount, COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric) AS staked_share_amount, t.total_share_amount - (COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric)) AS unstaked_share_amount, t.last_update_time FROM user_total_shares t LEFT JOIN user_staked_shares s ON t.pool_address = s.pool AND t.owner = s.owner LEFT JOIN user_unstaked_shares u ON t.pool_address = u.pool AND t.owner = u.owner ) SELECT final_user_shares.pool_address, final_user_shares.owner, final_user_shares.incentive_address, final_user_shares.total_share_amount, final_user_shares.staked_share_amount, final_user_shares.unstaked_share_amount, final_user_shares.last_update_time FROM final_user_shares ORDER BY final_user_shares.pool_address, final_user_shares.owner`);
var withdrawLiquidityInV1Cosmos = v1Cosmos.view("withdraw_liquidity", {
  sender: text(),
  receiver: text(),
  token0Denom: text("token0_denom"),
  token0Amount: numeric("token0_amount"),
  token1Denom: text("token1_denom"),
  token1Amount: numeric("token1_amount"),
  share: numeric(),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, COALESCE(attributes(events.*) ->> 'receiver'::text, attributes(events.*) ->> 'sender'::text) AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'refund_assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'withdrawn_share'::text)::numeric AS share, ( SELECT plt.pool FROM v1_cosmos.pool_lp_token plt WHERE plt.pool = (attributes(events.*) ->> '_contract_address'::text) OR plt.lp_token = (attributes(events.*) ->> '_contract_address'::text) LIMIT 1) AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text`);
var historicPoolYieldInV1Cosmos = v1Cosmos.view("historic_pool_yield", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  poolAddress: text("pool_address"),
  token0Denom: text("token0_denom"),
  token1Denom: text("token1_denom"),
  token0Balance: numeric("token0_balance"),
  token1Balance: numeric("token1_balance"),
  token0ValueUsd: doublePrecision("token0_value_usd"),
  token1ValueUsd: doublePrecision("token1_value_usd"),
  totalLiquidityUsd: doublePrecision("total_liquidity_usd"),
  feeTokens: json("fee_tokens"),
  feesUsd: doublePrecision("fees_usd"),
  incentiveTokens: json("incentive_tokens"),
  incentivesUsd: doublePrecision("incentives_usd"),
  totalEarningsUsd: doublePrecision("total_earnings_usd")
}).as(sql`WITH block_data AS ( SELECT b.height, b."time" AS "timestamp", lead(b."time") OVER (ORDER BY b.height) AS next_timestamp, lead(b.height) OVER (ORDER BY b.height) AS next_height FROM v1_cosmos.blocks b ), token_prices_by_block AS ( SELECT bd_1.height, bd_1."timestamp", bd_1.next_timestamp, bd_1.next_height, EXTRACT(epoch FROM bd_1.next_timestamp - bd_1."timestamp") AS seconds_between_blocks, t.denomination, tp.price, t.decimals, t.token_name FROM block_data bd_1 CROSS JOIN LATERAL ( SELECT DISTINCT token_prices.token FROM v1_cosmos.token_prices) d LEFT JOIN LATERAL ( SELECT token_prices.token, token_prices.price FROM v1_cosmos.token_prices WHERE token_prices.token = d.token ORDER BY (abs(EXTRACT(epoch FROM bd_1."timestamp" - token_prices.created_at))) LIMIT 1) tp ON true LEFT JOIN v1_cosmos.token t ON tp.token = t.token_name WHERE bd_1.next_height IS NOT NULL ), block_fees AS ( SELECT s.height, s.pool_address, s.ask_asset AS fee_token_denom, sum(s.commission_amount) AS fee_amount, sum(s.commission_amount::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS fees_usd FROM v1_cosmos.swap s LEFT JOIN token_prices_by_block tp ON s.height = tp.height AND s.ask_asset = tp.denomination GROUP BY s.height, s.pool_address, s.ask_asset, tp.price, tp.decimals ), block_incentives AS ( SELECT bp.height, i.lp_token, i.reward AS incentive_token_denom, sum(i.rewards_per_second * tp.seconds_between_blocks) AS incentive_amount, sum((i.rewards_per_second * tp.seconds_between_blocks)::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS incentives_usd FROM block_data bp JOIN v1_cosmos.incentivize i ON i.start_ts::numeric <= EXTRACT(epoch FROM bp."timestamp") AND i.end_ts::numeric >= EXTRACT(epoch FROM bp."timestamp") LEFT JOIN token_prices_by_block tp ON bp.height = tp.height AND i.reward = tp.denomination GROUP BY bp.height, i.lp_token, i.reward, tp.seconds_between_blocks, tp.price, tp.decimals ), pool_info AS ( SELECT DISTINCT pool_balance.pool_address, (pool_balance.token0_denom || ':'::text) || pool_balance.token1_denom AS lp_token FROM v1_cosmos.pool_balance ), pool_liquidity AS ( SELECT h.height, a.pool_address, a.token0_denom, a.token1_denom, a.token0_balance, a.token1_balance, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision AS token0_value_usd, a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS token1_value_usd, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision + a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS total_liquidity_usd FROM v1_cosmos.blocks h JOIN v1_cosmos.pool_balance a ON h.height = a.height LEFT JOIN token_prices_by_block tp0 ON h.height = tp0.height AND a.token0_denom = tp0.denomination LEFT JOIN token_prices_by_block tp1 ON h.height = tp1.height AND a.token1_denom = tp1.denomination ), total_fees_by_pool AS ( SELECT block_fees.height, block_fees.pool_address, json_agg(json_build_object('denom', block_fees.fee_token_denom, 'amount', block_fees.fee_amount, 'usd_value', block_fees.fees_usd)) AS fee_tokens, sum(block_fees.fees_usd) AS total_fees_usd FROM block_fees GROUP BY block_fees.height, block_fees.pool_address ), total_incentives_by_pool AS ( SELECT bi.height, pi.pool_address, json_agg(json_build_object('denom', bi.incentive_token_denom, 'amount', bi.incentive_amount, 'usd_value', bi.incentives_usd)) AS incentive_tokens, sum(bi.incentives_usd) AS total_incentives_usd FROM block_incentives bi LEFT JOIN pool_info pi ON bi.lp_token = pi.lp_token GROUP BY bi.height, pi.pool_address ) SELECT bd.height, bd."timestamp", pl.pool_address, pl.token0_denom, pl.token1_denom, pl.token0_balance, pl.token1_balance, pl.token0_value_usd, pl.token1_value_usd, pl.total_liquidity_usd, tf.fee_tokens, COALESCE(tf.total_fees_usd, 0::double precision) AS fees_usd, ti.incentive_tokens, COALESCE(ti.total_incentives_usd, 0::double precision) AS incentives_usd, COALESCE(tf.total_fees_usd, 0::double precision) + COALESCE(ti.total_incentives_usd, 0::double precision) AS total_earnings_usd FROM block_data bd JOIN pool_liquidity pl ON bd.height = pl.height LEFT JOIN total_fees_by_pool tf ON bd.height = tf.height AND pl.pool_address = tf.pool_address LEFT JOIN total_incentives_by_pool ti ON bd.height = ti.height AND pl.pool_address = ti.pool_address WHERE bd.next_height IS NOT NULL ORDER BY bd.height, pl.pool_address`);
var materializedSwapInV1Cosmos = v1Cosmos.materializedView("materialized_swap", {
  sender: text(),
  receiver: text(),
  askAsset: text("ask_asset"),
  commissionAmount: numeric("commission_amount"),
  feeShareAmount: numeric("fee_share_amount"),
  makerFeeAmount: numeric("maker_fee_amount"),
  offerAmount: numeric("offer_amount"),
  offerAsset: text("offer_asset"),
  returnAmount: numeric("return_amount"),
  spreadAmount: numeric("spread_amount"),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  transactionEventIndex: integer("transaction_event_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, attributes(events.*) ->> 'ask_asset'::text AS ask_asset, (attributes(events.*) ->> 'commission_amount'::text)::numeric AS commission_amount, (attributes(events.*) ->> 'fee_share_amount'::text)::numeric AS fee_share_amount, (attributes(events.*) ->> 'maker_fee_amount'::text)::numeric AS maker_fee_amount, (attributes(events.*) ->> 'offer_amount'::text)::numeric AS offer_amount, attributes(events.*) ->> 'offer_asset'::text AS offer_asset, (attributes(events.*) ->> 'return_amount'::text)::numeric AS return_amount, (attributes(events.*) ->> 'spread_amount'::text)::numeric AS spread_amount, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-swap'::text`);
var materializedPoolsInV1Cosmos = v1Cosmos.materializedView("materialized_pools", {
  token0: text(),
  token1: text(),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  createIndex: integer("create_index"),
  registerIndex: integer("register_index"),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  createTransactionIndex: integer("create_transaction_index"),
  registerTransactionIndex: integer("register_transaction_index")
}).as(sql`WITH create_pair AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair'::text AS pair, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-create_pair'::text ), register AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair_contract_addr'::text AS pair_contract_addr, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-register'::text ) SELECT split_part(cp.pair, '-'::text, 1) AS token0, split_part(cp.pair, '-'::text, 2) AS token1, r.pair_contract_addr AS pool_address, cp.msg_index::integer AS msg_index, cp.internal_chain_id, cp.block_hash, cp.height, cp.index AS create_index, r.index AS register_index, cp."timestamp", cp.transaction_hash, cp.transaction_index AS create_transaction_index, r.transaction_index AS register_transaction_index FROM create_pair cp JOIN register r ON cp.transaction_hash = r.transaction_hash`);
var materializedIncentivizeInV1Cosmos = v1Cosmos.materializedView("materialized_incentivize", {
  lpToken: text("lp_token"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  startTs: bigint("start_ts", { mode: "number" }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  endTs: bigint("end_ts", { mode: "number" }),
  reward: text(),
  rewardsPerSecond: numeric("rewards_per_second"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  transactionEventIndex: integer("transaction_event_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'lp_token'::text AS lp_token, (attributes(events.*) ->> 'start_ts'::text)::bigint AS start_ts, (attributes(events.*) ->> 'end_ts'::text)::bigint AS end_ts, attributes(events.*) ->> 'reward'::text AS reward, (attributes(events.*) ->> 'rps'::text)::numeric AS rewards_per_second, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-incentivize'::text`);
var materializedWithdrawLiquidityTotalsInV1Cosmos = v1Cosmos.materializedView("materialized_withdraw_liquidity_totals", {
  poolAddress: text("pool_address"),
  token0Denom: text("token0_denom"),
  totalToken0Withdrawn: numeric("total_token0_withdrawn"),
  token1Denom: text("token1_denom"),
  totalToken1Withdrawn: numeric("total_token1_withdrawn"),
  totalShareWithdrawn: numeric("total_share_withdrawn"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" })
}).as(sql`SELECT materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token0_denom, sum(materialized_withdraw_liquidity.token0_amount) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token0_denom ORDER BY materialized_withdraw_liquidity.height) AS total_token0_withdrawn, materialized_withdraw_liquidity.token1_denom, sum(materialized_withdraw_liquidity.token1_amount) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token1_denom ORDER BY materialized_withdraw_liquidity.height) AS total_token1_withdrawn, sum(materialized_withdraw_liquidity.share) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address ORDER BY materialized_withdraw_liquidity.height) AS total_share_withdrawn, materialized_withdraw_liquidity.height FROM v1_cosmos.materialized_withdraw_liquidity`);
var materializedAddLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_add_liquidity", {
  sender: text(),
  receiver: text(),
  token0Denom: text("token0_denom"),
  token0Amount: numeric("token0_amount"),
  token1Denom: text("token1_denom"),
  token1Amount: numeric("token1_amount"),
  share: numeric(),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'share'::text)::numeric AS share, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text`);
var materializedWithdrawLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_withdraw_liquidity", {
  sender: text(),
  receiver: text(),
  token0Denom: text("token0_denom"),
  token0Amount: numeric("token0_amount"),
  token1Denom: text("token1_denom"),
  token1Amount: numeric("token1_amount"),
  share: numeric(),
  poolAddress: text("pool_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, COALESCE(attributes(events.*) ->> 'receiver'::text, attributes(events.*) ->> 'sender'::text) AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'refund_assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'withdrawn_share'::text)::numeric AS share, ( SELECT plt.pool FROM v1_cosmos.pool_lp_token plt WHERE plt.pool = (attributes(events.*) ->> '_contract_address'::text) OR plt.lp_token = (attributes(events.*) ->> '_contract_address'::text) LIMIT 1) AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text`);
var materializedAddLiquidityTotalsInV1Cosmos = v1Cosmos.materializedView("materialized_add_liquidity_totals", {
  poolAddress: text("pool_address"),
  token0Denom: text("token0_denom"),
  totalToken0Added: numeric("total_token0_added"),
  token1Denom: text("token1_denom"),
  totalToken1Added: numeric("total_token1_added"),
  totalShareAdded: numeric("total_share_added"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" })
}).as(sql`SELECT materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom, sum(materialized_add_liquidity.token0_amount) OVER (PARTITION BY materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom ORDER BY materialized_add_liquidity.height) AS total_token0_added, materialized_add_liquidity.token1_denom, sum(materialized_add_liquidity.token1_amount) OVER (PARTITION BY materialized_add_liquidity.pool_address, materialized_add_liquidity.token1_denom ORDER BY materialized_add_liquidity.height) AS total_token1_added, sum(materialized_add_liquidity.share) OVER (PARTITION BY materialized_add_liquidity.pool_address ORDER BY materialized_add_liquidity.height) AS total_share_added, materialized_add_liquidity.height FROM v1_cosmos.materialized_add_liquidity`);
var materializedPoolBalanceInV1Cosmos = v1Cosmos.materializedView("materialized_pool_balance", {
  poolAddress: text("pool_address"),
  token0Denom: text("token0_denom"),
  token0Balance: numeric("token0_balance"),
  token1Denom: text("token1_denom"),
  token1Balance: numeric("token1_balance"),
  share: numeric(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" })
}).as(sql`SELECT h.pool_address, a.token0_denom, COALESCE(a.total_token0_added, 0::numeric) - COALESCE(w.total_token0_withdrawn, 0::numeric) + COALESCE(s.total_token0_swap_impact, 0::numeric) AS token0_balance, a.token1_denom, COALESCE(a.total_token1_added, 0::numeric) - COALESCE(w.total_token1_withdrawn, 0::numeric) + COALESCE(s.total_token1_swap_impact, 0::numeric) AS token1_balance, COALESCE(a.total_share_added, 0::numeric) - COALESCE(w.total_share_withdrawn, 0::numeric) AS share, h.height FROM v1_cosmos.materialized_all_heights h LEFT JOIN LATERAL ( SELECT a_1.pool_address, a_1.token0_denom, a_1.total_token0_added, a_1.token1_denom, a_1.total_token1_added, a_1.total_share_added, a_1.height FROM v1_cosmos.materialized_add_liquidity_totals a_1 WHERE a_1.pool_address = h.pool_address AND a_1.height <= h.height ORDER BY a_1.height DESC LIMIT 1) a ON true LEFT JOIN LATERAL ( SELECT w_1.pool_address, w_1.token0_denom, w_1.total_token0_withdrawn, w_1.token1_denom, w_1.total_token1_withdrawn, w_1.total_share_withdrawn, w_1.height FROM v1_cosmos.materialized_withdraw_liquidity_totals w_1 WHERE w_1.pool_address = h.pool_address AND w_1.height <= h.height ORDER BY w_1.height DESC LIMIT 1) w ON true LEFT JOIN LATERAL ( SELECT s_1.pool_address, s_1.total_token0_swap_impact, s_1.total_token1_swap_impact, s_1.height FROM v1_cosmos.materialized_swap_totals s_1 WHERE s_1.pool_address = h.pool_address AND s_1.height <= h.height ORDER BY s_1.height DESC LIMIT 1) s ON true`);
var materializedAllHeightsInV1Cosmos = v1Cosmos.materializedView("materialized_all_heights", {
  poolAddress: text("pool_address"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" })
}).as(sql`SELECT DISTINCT all_events.pool_address, all_events.height FROM ( SELECT materialized_add_liquidity.pool_address, materialized_add_liquidity.height FROM v1_cosmos.materialized_add_liquidity UNION ALL SELECT materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.height FROM v1_cosmos.materialized_withdraw_liquidity UNION ALL SELECT materialized_swap.pool_address, materialized_swap.height FROM v1_cosmos.materialized_swap) all_events`);
var materializedPoolUserSharesInV1Cosmos = v1Cosmos.materializedView("materialized_pool_user_shares", {
  poolAddress: text("pool_address"),
  owner: text(),
  incentiveAddress: text("incentive_address"),
  totalShareAmount: numeric("total_share_amount"),
  stakedShareAmount: numeric("staked_share_amount"),
  unstakedShareAmount: numeric("unstaked_share_amount"),
  lastUpdateTime: timestamp("last_update_time", { withTimezone: true, mode: "string" })
}).as(sql`WITH combined_liquidity_operations AS ( SELECT COALESCE(materialized_add_liquidity.receiver, materialized_add_liquidity.sender) AS owner, materialized_add_liquidity.pool_address, materialized_add_liquidity.share AS share_amount, materialized_add_liquidity."timestamp" FROM v1_cosmos.materialized_add_liquidity UNION ALL SELECT materialized_withdraw_liquidity.receiver AS owner, materialized_withdraw_liquidity.pool_address, - materialized_withdraw_liquidity.share AS share_amount, materialized_withdraw_liquidity."timestamp" FROM v1_cosmos.materialized_withdraw_liquidity ), user_total_shares AS ( SELECT combined_liquidity_operations.pool_address, combined_liquidity_operations.owner, sum(combined_liquidity_operations.share_amount) AS total_share_amount, max(combined_liquidity_operations."timestamp") AS last_update_time FROM combined_liquidity_operations GROUP BY combined_liquidity_operations.pool_address, combined_liquidity_operations.owner HAVING sum(combined_liquidity_operations.share_amount) > 0::numeric ), user_staked_shares AS ( SELECT materialized_stake_liquidity.pool, materialized_stake_liquidity.owner, sum(materialized_stake_liquidity.amount) AS staked_share_amount, materialized_stake_liquidity.incentive_address FROM v1_cosmos.materialized_stake_liquidity GROUP BY materialized_stake_liquidity.pool, materialized_stake_liquidity.owner, materialized_stake_liquidity.incentive_address ), user_unstaked_shares AS ( SELECT materialized_unstake_liquidity.pool, materialized_unstake_liquidity.owner, sum(materialized_unstake_liquidity.amount) AS unstaked_share_amount FROM v1_cosmos.materialized_unstake_liquidity GROUP BY materialized_unstake_liquidity.pool, materialized_unstake_liquidity.owner ), final_user_shares AS ( SELECT t.pool_address, t.owner, s.incentive_address, t.total_share_amount, COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric) AS staked_share_amount, t.total_share_amount - (COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric)) AS unstaked_share_amount, t.last_update_time FROM user_total_shares t LEFT JOIN user_staked_shares s ON t.pool_address = s.pool AND t.owner = s.owner LEFT JOIN user_unstaked_shares u ON t.pool_address = u.pool AND t.owner = u.owner ) SELECT final_user_shares.pool_address, final_user_shares.owner, final_user_shares.incentive_address, final_user_shares.total_share_amount, final_user_shares.staked_share_amount, final_user_shares.unstaked_share_amount, final_user_shares.last_update_time FROM final_user_shares ORDER BY final_user_shares.pool_address, final_user_shares.owner`);
var materializedStakeLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_stake_liquidity", {
  sender: text(),
  owner: text(),
  amount: numeric(),
  lpToken: text("lp_token"),
  pool: text(),
  incentiveAddress: text("incentive_address"),
  msgIndex: integer("msg_index"),
  internalChainId: integer("internal_chain_id"),
  blockHash: text("block_hash"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" }),
  index: integer(),
  timestamp: timestamp({ withTimezone: true, mode: "string" }),
  transactionHash: text("transaction_hash"),
  transactionIndex: integer("transaction_index"),
  data: jsonb()
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'user'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-deposit'::text`);
var materializedSwapTotalsInV1Cosmos = v1Cosmos.materializedView("materialized_swap_totals", {
  poolAddress: text("pool_address"),
  totalToken0SwapImpact: numeric("total_token0_swap_impact"),
  totalToken1SwapImpact: numeric("total_token1_swap_impact"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  height: bigint({ mode: "number" })
}).as(sql`WITH swap_impact AS ( SELECT s_1.pool_address, s_1.height, CASE WHEN s_1.offer_asset = p.token0_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token0_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token0_swap_impact, CASE WHEN s_1.offer_asset = p.token1_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token1_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token1_swap_impact FROM v1_cosmos.materialized_swap s_1 JOIN ( SELECT DISTINCT materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom, materialized_add_liquidity.token1_denom FROM v1_cosmos.materialized_add_liquidity) p ON s_1.pool_address = p.pool_address ) SELECT swap_impact.pool_address, sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact, sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact, swap_impact.height FROM swap_impact`);

// src/services/database.ts
var { Client } = pg;
var DatabaseService = class {
  constructor(config) {
    __publicField(this, "db");
    __publicField(this, "client");
    __publicField(this, "schema");
    __publicField(this, "isConnected", false);
    this.schema = config.schema || "public";
    if (config.hyperdrive) {
      this.client = new Client({
        connectionString: config.hyperdrive.connectionString,
        connectionTimeoutMillis: 1e4
      });
    } else {
      this.client = new Client({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 1e4
      });
    }
  }
  /**
   * Initialize connection - MUST be called before any queries
   */
  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      this.db = drizzle(this.client);
      if (this.schema && this.schema !== "public") {
        await this.db.execute(sql2`SET search_path TO ${sql2.raw(this.schema)}, public`);
      }
    }
  }
  /**
   * Ensure connected before queries
   */
  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }
  /**
   * Get all pools with their token pairs
   */
  async getPools(limit = 100) {
    await this.ensureConnected();
    const pools = await this.db.select({
      poolAddress: materializedPoolsInV1Cosmos.poolAddress,
      token0: materializedPoolsInV1Cosmos.token0,
      token1: materializedPoolsInV1Cosmos.token1,
      timestamp: materializedPoolsInV1Cosmos.timestamp,
      height: materializedPoolsInV1Cosmos.height
    }).from(materializedPoolsInV1Cosmos).orderBy(desc(materializedPoolsInV1Cosmos.height)).limit(limit);
    return pools.map((pool) => ({
      poolAddress: pool.poolAddress || "",
      token0: pool.token0 || "",
      token1: pool.token1 || "",
      timestamp: pool.timestamp || "",
      height: Number(pool.height || 0)
    }));
  }
  /**
   * Get current pool balance for a specific pool
   */
  async getPoolBalance(poolAddress) {
    await this.ensureConnected();
    const result = await this.db.select({
      poolAddress: materializedPoolBalanceInV1Cosmos.poolAddress,
      token0Denom: materializedPoolBalanceInV1Cosmos.token0Denom,
      token0Balance: materializedPoolBalanceInV1Cosmos.token0Balance,
      token1Denom: materializedPoolBalanceInV1Cosmos.token1Denom,
      token1Balance: materializedPoolBalanceInV1Cosmos.token1Balance,
      height: materializedPoolBalanceInV1Cosmos.height
    }).from(materializedPoolBalanceInV1Cosmos).where(eq(materializedPoolBalanceInV1Cosmos.poolAddress, poolAddress)).orderBy(desc(materializedPoolBalanceInV1Cosmos.height)).limit(1);
    if (result.length === 0)
      return null;
    const balance = result[0];
    return {
      poolAddress: balance.poolAddress || "",
      token0Denom: balance.token0Denom || "",
      token0Balance: balance.token0Balance?.toString() || "0",
      token1Denom: balance.token1Denom || "",
      token1Balance: balance.token1Balance?.toString() || "0",
      height: Number(balance.height || 0)
    };
  }
  /**
   * Get pool balances for multiple pools
   */
  async getBatchPoolBalances(poolAddresses) {
    if (poolAddresses.length === 0)
      return [];
    const latestBalances = await this.db.select({
      poolAddress: materializedPoolBalanceInV1Cosmos.poolAddress,
      token0Denom: materializedPoolBalanceInV1Cosmos.token0Denom,
      token0Balance: materializedPoolBalanceInV1Cosmos.token0Balance,
      token1Denom: materializedPoolBalanceInV1Cosmos.token1Denom,
      token1Balance: materializedPoolBalanceInV1Cosmos.token1Balance,
      height: materializedPoolBalanceInV1Cosmos.height,
      maxHeight: sql2`max(${materializedPoolBalanceInV1Cosmos.height}) over (partition by ${materializedPoolBalanceInV1Cosmos.poolAddress})`
    }).from(materializedPoolBalanceInV1Cosmos).where(inArray(materializedPoolBalanceInV1Cosmos.poolAddress, poolAddresses)).orderBy(desc(materializedPoolBalanceInV1Cosmos.height));
    const filteredBalances = latestBalances.filter(
      (balance) => Number(balance.height) === Number(balance.maxHeight)
    );
    return filteredBalances.map((balance) => ({
      poolAddress: balance.poolAddress || "",
      token0Denom: balance.token0Denom || "",
      token0Balance: balance.token0Balance?.toString() || "0",
      token1Denom: balance.token1Denom || "",
      token1Balance: balance.token1Balance?.toString() || "0",
      height: Number(balance.height || 0)
    }));
  }
  /**
   * Get 24-hour trading volume for a pool
   */
  async get24HourVolume(poolAddress) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
    const swaps = await this.db.select({
      offerAsset: materializedSwapInV1Cosmos.offerAsset,
      offerAmount: materializedSwapInV1Cosmos.offerAmount,
      askAsset: materializedSwapInV1Cosmos.askAsset,
      returnAmount: materializedSwapInV1Cosmos.returnAmount
    }).from(materializedSwapInV1Cosmos).where(
      and(
        eq(materializedSwapInV1Cosmos.poolAddress, poolAddress),
        gte(materializedSwapInV1Cosmos.timestamp, oneDayAgo.toISOString())
      )
    );
    const volumeMap = /* @__PURE__ */ new Map();
    let swapCount = 0;
    let prices = [];
    for (const swap of swaps) {
      swapCount++;
      if (swap.offerAsset && swap.offerAmount) {
        const current = volumeMap.get(swap.offerAsset) || 0n;
        volumeMap.set(swap.offerAsset, current + BigInt(swap.offerAmount.toString()));
      }
      if (swap.askAsset && swap.returnAmount) {
        const current = volumeMap.get(swap.askAsset) || 0n;
        volumeMap.set(swap.askAsset, current + BigInt(swap.returnAmount.toString()));
      }
      if (swap.offerAmount && swap.returnAmount) {
        const price = Number(swap.returnAmount.toString()) / Number(swap.offerAmount.toString());
        if (price > 0 && isFinite(price)) {
          prices.push(price);
        }
      }
    }
    const volumes = Array.from(volumeMap.entries());
    const baseVolume = volumes.length > 0 ? volumes[0][1].toString() : "0";
    const targetVolume = volumes.length > 1 ? volumes[1][1].toString() : "0";
    const high = prices.length > 0 ? Math.max(...prices).toString() : null;
    const low = prices.length > 0 ? Math.min(...prices).toString() : null;
    return {
      baseVolume,
      targetVolume,
      high,
      low,
      swapCount
    };
  }
  /**
   * Get historical trades for a pool
   */
  async getHistoricalTrades(poolAddress, limit = 100, startTime, endTime) {
    const conditions = [eq(materializedSwapInV1Cosmos.poolAddress, poolAddress)];
    if (startTime) {
      conditions.push(gte(materializedSwapInV1Cosmos.timestamp, new Date(startTime * 1e3).toISOString()));
    }
    if (endTime) {
      conditions.push(lte(materializedSwapInV1Cosmos.timestamp, new Date(endTime * 1e3).toISOString()));
    }
    const trades = await this.db.select({
      sender: materializedSwapInV1Cosmos.sender,
      receiver: materializedSwapInV1Cosmos.receiver,
      offerAsset: materializedSwapInV1Cosmos.offerAsset,
      offerAmount: materializedSwapInV1Cosmos.offerAmount,
      askAsset: materializedSwapInV1Cosmos.askAsset,
      returnAmount: materializedSwapInV1Cosmos.returnAmount,
      commissionAmount: materializedSwapInV1Cosmos.commissionAmount,
      poolAddress: materializedSwapInV1Cosmos.poolAddress,
      timestamp: materializedSwapInV1Cosmos.timestamp,
      transactionHash: materializedSwapInV1Cosmos.transactionHash,
      height: materializedSwapInV1Cosmos.height
    }).from(materializedSwapInV1Cosmos).where(conditions.length > 1 ? and(...conditions) : conditions[0]).orderBy(desc(materializedSwapInV1Cosmos.timestamp)).limit(limit);
    return trades.map((trade) => ({
      sender: trade.sender || "",
      receiver: trade.receiver,
      offerAsset: trade.offerAsset || "",
      offerAmount: trade.offerAmount?.toString() || "0",
      askAsset: trade.askAsset || "",
      returnAmount: trade.returnAmount?.toString() || "0",
      commissionAmount: trade.commissionAmount?.toString() || null,
      poolAddress: trade.poolAddress || "",
      timestamp: trade.timestamp || "",
      transactionHash: trade.transactionHash,
      height: Number(trade.height || 0)
    }));
  }
  /**
   * Get token prices
   */
  async getTokenPrices(tokens) {
    if (tokens.length === 0)
      return [];
    const latestPrices = await this.db.execute(sql2`
      WITH latest_prices AS (
        SELECT DISTINCT ON (token) token, price, last_updated_at
        FROM v1_cosmos.token_prices 
        WHERE token = ANY(${sql2.raw(`ARRAY[${tokens.map((token) => `'${token.replace(/'/g, "''")}'`).join(",")}]`)})
        ORDER BY token, created_at DESC
      )
      SELECT token, price, last_updated_at 
      FROM latest_prices
    `);
    return latestPrices.rows.map((row) => ({
      token: row.token,
      price: row.price?.toString() || null,
      lastUpdatedAt: row.last_updated_at?.toString() || null
    }));
  }
  /**
   * Get token metadata including decimals by token name
   */
  async getTokenInfo(tokenName) {
    const result = await this.db.select({
      decimals: tokenInV1Cosmos.decimals,
      denomination: tokenInV1Cosmos.denomination,
      coingeckoId: tokenInV1Cosmos.coingeckoId
    }).from(tokenInV1Cosmos).where(eq(tokenInV1Cosmos.tokenName, tokenName)).limit(1);
    if (result.length === 0)
      return null;
    const token = result[0];
    return {
      decimals: token.decimals ? Number(token.decimals) : null,
      denomination: token.denomination,
      coingeckoId: token.coingeckoId
    };
  }
  /**
   * Get token decimals by denomination
   */
  async getTokenDecimals(denomination) {
    const result = await this.db.select({
      decimals: tokenInV1Cosmos.decimals
    }).from(tokenInV1Cosmos).where(eq(tokenInV1Cosmos.denomination, denomination)).limit(1);
    if (result.length === 0)
      return null;
    return result[0].decimals ? Number(result[0].decimals) : null;
  }
  /**
   * Get token symbols for multiple tokens by their denomination/contract address
   */
  async getTokenSymbols(denoms) {
    if (denoms.length === 0)
      return /* @__PURE__ */ new Map();
    const tokens = await this.db.select({
      tokenName: tokenInV1Cosmos.tokenName,
      denomination: tokenInV1Cosmos.denomination
    }).from(tokenInV1Cosmos).where(inArray(tokenInV1Cosmos.denomination, denoms));
    const symbolMap = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      if (token.denomination && token.tokenName) {
        symbolMap.set(token.denomination, token.tokenName);
      }
    }
    for (const denom of denoms) {
      if (!symbolMap.has(denom)) {
        if (denom.startsWith("ibc/")) {
          symbolMap.set(denom, "IBC_" + denom.slice(4, 10));
        } else if (denom.startsWith("u")) {
          symbolMap.set(denom, denom.slice(1).toUpperCase());
        } else {
          symbolMap.set(denom, denom.slice(0, 6) + "..." + denom.slice(-6));
        }
      }
    }
    return symbolMap;
  }
  /**
   * Close database connection
   */
  async disconnect() {
    if (this.isConnected) {
      await this.client.end();
      this.isConnected = false;
    }
  }
  /**
   * Test database connection
   */
  async testConnection() {
    try {
      await this.connect();
      const result = await this.db.execute(sql2`SELECT 1 as test`);
      return Array.isArray(result) ? result.length > 0 : result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Database connection test failed:", error);
      return false;
    }
  }
};

// src/config/database.ts
function isDatabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_HOST && process.env.SUPABASE_USER && process.env.SUPABASE_PW && process.env.SUPABASE_DB
  );
}
function getDatabaseConfig() {
  const isConfigured = isDatabaseConfigured();
  if (!isConfigured) {
    return { enabled: false };
  }
  return {
    enabled: true,
    host: process.env.SUPABASE_HOST,
    port: Number(process.env.SUPABASE_PORT) || 5432,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PW,
    database: process.env.SUPABASE_DB,
    ssl: process.env.SUPABASE_SSL !== "false",
    // Default to true for Supabase
    schema: process.env.SUPABASE_SCHEMA || "public"
  };
}
async function createDatabaseService(hyperdrive) {
  const config = getDatabaseConfig();
  if (!config.enabled && !hyperdrive) {
    return null;
  }
  try {
    let dbService;
    if (hyperdrive) {
      dbService = new DatabaseService({
        hyperdrive,
        schema: config.schema || "v1_cosmos"
        // Use v1_cosmos schema
      });
    } else {
      dbService = new DatabaseService({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl,
        schema: config.schema
      });
    }
    const isWorker = typeof globalThis !== "undefined" && "navigator" in globalThis || process.env.CF_WORKER === "true";
    if (!isWorker && !hyperdrive) {
      const connectionPromise = dbService.testConnection();
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(false), 5e3);
      });
      const isConnected = await Promise.race([connectionPromise, timeoutPromise]);
      if (!isConnected) {
        console.error("Database connection failed or timed out - falling back to contract-only mode");
        try {
          await dbService.disconnect();
        } catch (e) {
        }
        return null;
      }
    }
    return dbService;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return null;
  }
}

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    __publicField(this, "res");
    __publicField(this, "status");
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// src/middleware/error.ts
async function errorHandler2(c, next) {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    if (err instanceof HTTPException) {
      return c.json(
        {
          error: err.message,
          status: err.status
        },
        err.status
      );
    }
    if (err instanceof Error) {
      return c.json(
        {
          error: err.message || "Internal server error",
          status: 500
        },
        500
      );
    }
    return c.json(
      {
        error: "Unknown error occurred",
        status: 500
      },
      500
    );
  }
}

// ../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json2 = JSON.stringify(obj, null, 2);
  return json2.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a10, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a10 = message !== null && message !== void 0 ? message : required_error) !== null && _a10 !== void 0 ? _a10 : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a10;
    const ctx = {
      common: {
        issues: [],
        async: (_a10 = params === null || params === void 0 ? void 0 : params.async) !== null && _a10 !== void 0 ? _a10 : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a10, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a10 = err === null || err === void 0 ? void 0 : err.message) === null || _a10 === void 0 ? void 0 : _a10.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a10) {
    return false;
  }
}
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a10) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a10, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a10 = options === null || options === void 0 ? void 0 : options.offset) !== null && _a10 !== void 0 ? _a10 : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a10;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a10 = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a10 !== void 0 ? _a10 : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a10) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a10;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a10 = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a10 !== void 0 ? _a10 : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a10, _b, _c, _d;
          const defaultError = (_c = (_b = (_a10 = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a10, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index3) {
    return new _ZodObject({
      ...this._def,
      catchall: index3
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index3 = 0; index3 < a.length; index3++) {
      const itemA = a[index3];
      const itemB = b[index3];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index3) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index3, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index3, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size3, message) {
    return this.min(size3, message).max(size3, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params2 = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a10, _b;
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          var _a11, _b2;
          if (!r2) {
            const params = cleanParams(_params2, data);
            const _fatal = (_b2 = (_a11 = params.fatal) !== null && _a11 !== void 0 ? _a11 : fatal) !== null && _b2 !== void 0 ? _b2 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params2, data);
        const _fatal = (_b = (_a10 = params.fatal) !== null && _a10 !== void 0 ? _a10 : fatal) !== null && _b !== void 0 ? _b : true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
  if (name && cookie.indexOf(name) === -1) {
    return {};
  }
  const pairs = cookie.trim().split(";");
  const parsedCookie = {};
  for (let pairStr of pairs) {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      continue;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
      if (name) {
        break;
      }
    }
  }
  return parsedCookie;
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType
    }
  });
  return response.formData();
};

// ../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/validator/validator.js
var jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
var urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !jsonRegex.test(contentType)) {
          break;
        }
        try {
          value = await c.req.json();
        } catch {
          const message = "Malformed JSON in request body";
          throw new HTTPException(400, { message });
        }
        break;
      case "form": {
        if (!contentType || !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))) {
          break;
        }
        let formData;
        if (c.req.bodyCache.formData) {
          formData = await c.req.bodyCache.formData;
        } else {
          try {
            const arrayBuffer = await c.req.arrayBuffer();
            formData = await bufferToFormData(arrayBuffer, contentType);
            c.req.bodyCache.formData = formData;
          } catch (e) {
            let message = "Malformed FormData request.";
            message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
            throw new HTTPException(400, { message });
          }
        }
        const form = {};
        formData.forEach((value2, key) => {
          if (key.endsWith("[]")) {
            ;
            (form[key] ?? (form[key] = [])).push(value2);
          } else if (Array.isArray(form[key])) {
            ;
            form[key].push(value2);
          } else if (key in form) {
            form[key] = [form[key], value2];
          } else {
            form[key] = value2;
          }
        });
        value = form;
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          })
        );
        break;
      case "param":
        value = c.req.param();
        break;
      case "header":
        value = c.req.header();
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    await next();
  };
};

// ../node_modules/.pnpm/@hono+zod-validator@0.4.3_hono@4.9.2_zod@3.24.2/node_modules/@hono/zod-validator/dist/index.js
var zValidator = (target, schema, hook) => (
  // @ts-expect-error not typed well
  validator(target, async (value, c) => {
    let validatorValue = value;
    if (target === "header" && schema instanceof ZodObject) {
      const schemaKeys = Object.keys(schema.shape);
      const caseInsensitiveKeymap = Object.fromEntries(
        schemaKeys.map((key) => [key.toLowerCase(), key])
      );
      validatorValue = Object.fromEntries(
        Object.entries(value).map(([key, value2]) => [caseInsensitiveKeymap[key] || key, value2])
      );
    }
    const result = await schema.safeParseAsync(validatorValue);
    if (hook) {
      const hookResult = await hook({ data: validatorValue, ...result, target }, c);
      if (hookResult) {
        if (hookResult instanceof Response) {
          return hookResult;
        }
        if ("response" in hookResult) {
          return hookResult.response;
        }
      }
    }
    if (!result.success) {
      return c.json(result, 400);
    }
    return result.data;
  })
);

// src/config/excluded-pools.ts
var EXCLUDED_POOLS = /* @__PURE__ */ new Set([
  "bbn1xt4ahzz2x8hpkc0tk6ekte9x6crw4w6u0r67cyt3kz9syh24pd7s4m2t0z",
  "bbn1ma0g752dl0yujasnfs9yrk6uew7d0a2zrgvg62cfnlfftu2y0egqvustk6",
  "bbn1w798gp0zqv3s9hjl3jlnwxtwhykga6rn93p46q2crsdqhaj3y4gsxallqs",
  "bbn1xsmqvl8lqr2uwl50aetu0572rss9hrza5kddpfj9ky3jq80fv2tssfrw9q",
  "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
  "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
  "bbn16slnlmtu7w5hjfwyzucwm75c3kuz40jztckp2766zttdu962tndqy2zks5",
  "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
  // old union pools
  "bbn134wsfa05dzx0xjg3raanxchg5j00hma64570yufpuw4zt6dzffusuj8ekq",
  "bbn17rrvcj20v275r5lcerxa043zmvuhzeucgrv5zlcuaewfp003nzds0kxjhd",
  "bbn1j7wxhf54dsn8a0jhhfnzyr8dk5xpmv53tsxe6fsa3eyj2yhp3gzsvr6waa",
  "bbn15hjqfzaffh0f2tcdgs5tk30fnhdu2e5lre98ef363a72p2pyl2nsfe4ag7",
  "bbn1zz74gvmq6ss3pg5vgahvx47ugpfzr80qu75l97lf2ggdgxq04ddqhawv8s",
  "bbn1apkgj87fgfsq84swvkyfaemrq7t4deuh60887lek0hkgdjh5fj0qvfa8fj",
  "bbn1vdd0h0263cxa4fa5fehl85ekyxl9a4wqa9rq0gldxunyntck4pts9h6x7y",
  "bbn1qew58vlyt7sx0pf73qq56qrl749456c9ft6tyv2w7q6camhkc7cs8stvlk",
  "bbn1naazzhhz5k92m26ap6phqmht5d8js52mg9uke2wynenqzzn6s63qtjgt7e",
  "bbn10rktvmllvgctcmhl5vv8kl3mdksukyqf2tdveh8drpn0sppugwwq2wykr0",
  "bbn1fur82ejcye82qqeah83v2tndt2m2l3y0ceypdkxe50rl0jj8xxys30zhkr",
  "bbn1csgj9nugf2dgq2hu4zmm3986ss038ehr3c82ty6hr00drh37peus4fqz5l",
  "bbn1z2wr8jmxmpe8x3j25rl8360pfl4w9p3ry3dpss90yuek4je4wgxq8526rl",
  "bbn13tt9669vsv5x80ncckykq4gnvv3ex33vumpe8rmlxemgk76mstysf0q3qx",
  "bbn1z7quf5t6g7spjnu2qhcp2x2ksnz4zfut9k73uutpg2q95dd008fqp2q9jt",
  "bbn10l67n20j7cjxu83a6yrdyqqln6mrcq3844c3wccr7qk0vn5j0laq8j32ml",
  "bbn1x4kzffnyd7jkldual9xkp2hu22g5vs0k8kuw847mtkevs8pcec5s0rzqm0",
  "bbn1yset4m9m6lrpyz7s8nlc2r2adretctcjvfzsx9akf2dj6c95xqmq4g4z4r",
  "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
  "bbn1hquvz7s2wm44snh4rcmqe9mx757xgacw3p5h4q23crgwg2n3pk9quhu0fg",
  "bbn1lpxsk8a8dxdpy8r6yqlz0gmjc7427wg9h25sj46c8d6jaglmzxsq6u09de",
  "bbn1pptvg76q2kfhzvpnsadz2ws2y6e0fvafzy3vkyak0fpmyzrc94qqnv0ark",
  "bbn1rdr5nhhcuawc8y34llx3urmtlf9yszfluhyhhj9ctypk4tnkg0nq7ywdxw"
]);

// src/utils/token-utils.ts
function getTokenIdentifier(assetInfo) {
  if (typeof assetInfo === "string") {
    return assetInfo;
  }
  if (assetInfo.token) {
    return assetInfo.token.contract_addr;
  } else if (assetInfo.native_token) {
    return assetInfo.native_token.denom;
  }
  return "";
}
function createTickerId(base, target) {
  const baseId = getTokenIdentifier(base);
  const targetId = getTokenIdentifier(target);
  return `${baseId}_${targetId}`;
}
function getAssetInfo(token) {
  if (token.startsWith("ibc/") || token.startsWith("u")) {
    return { native_token: { denom: token } };
  }
  return { token: { contract_addr: token } };
}

// src/routes/coingecko-db.ts
var coingeckoDBRoute = new Hono2();
async function getTokenDecimals(contracts, denom) {
  try {
    const assetInfo = getAssetInfo(denom);
    return await contracts.getTokenDecimals(assetInfo);
  } catch {
    return 6;
  }
}
async function simulateXYKDepth(poolBalance, currentPrice, targetPrice, baseDecimals, targetDecimals, isPriceIncrease) {
  const x = Number(poolBalance.token0Balance) / Math.pow(10, baseDecimals);
  const y = Number(poolBalance.token1Balance) / Math.pow(10, targetDecimals);
  const k = x * y;
  let swapAmount;
  let swapToken;
  if (isPriceIncrease) {
    const newX = Math.sqrt(k / targetPrice);
    swapAmount = newX - x;
    swapToken = "base";
  } else {
    const newY = targetPrice * Math.sqrt(k * targetPrice);
    swapAmount = newY - y;
    swapToken = "target";
  }
  return {
    swap_amount: swapAmount.toString(),
    swap_token: swapToken,
    impact_on_reserves: {
      base_token_change: isPriceIncrease ? swapAmount.toString() : (-swapAmount / targetPrice).toString(),
      target_token_change: isPriceIncrease ? (-swapAmount * currentPrice).toString() : swapAmount.toString()
    },
    formula: "XYK: x*y=k constant product"
  };
}
async function simulatePCLDepth(contracts, poolId, assetInfos, percentage, baseDecimals, targetDecimals) {
  try {
    const pclConfig = await contracts.getPCLPoolConfig(poolId);
    const poolShares = await contracts.getPoolShares(poolId);
    if (!pclConfig || !poolShares) {
      throw new Error("Unable to fetch PCL pool configuration or balances");
    }
    const b0 = Number(poolShares.assets[0].amount) / Math.pow(10, baseDecimals);
    const b1 = Number(poolShares.assets[1].amount) / Math.pow(10, targetDecimals);
    let pclParams;
    try {
      const paramsJson = Buffer.from(pclConfig.params, "base64").toString();
      pclParams = JSON.parse(paramsJson);
    } catch {
      throw new Error("Unable to decode PCL parameters");
    }
    const priceScale = Number(pclParams.price_scale || 1);
    const A = Number(pclParams.amp || 1);
    const gamma = Number(pclParams.gamma || 1e-3);
    if (b0 === 0 || b1 === 0) {
      throw new Error("Invalid pool reserves");
    }
    const currentSpotPrice = await getCurrentSpotPrice(contracts, poolId, assetInfos, baseDecimals, targetDecimals);
    const targetPrice = currentSpotPrice * (1 + percentage / 100);
    const swapResult = await findSwapAmountForTargetPrice(
      contracts,
      poolId,
      assetInfos,
      currentSpotPrice,
      targetPrice,
      percentage > 0,
      // isPriceIncrease
      baseDecimals,
      targetDecimals
    );
    return {
      pool_params: {
        amp: A,
        gamma,
        price_scale: priceScale
      },
      current_reserves: { base: b0, target: b1 },
      current_spot_price: currentSpotPrice,
      target_price: targetPrice,
      swap_amount: swapResult.swapAmount,
      swap_token: swapResult.swapToken,
      effective_price: swapResult.effectivePrice,
      price_impact: Math.abs((swapResult.effectivePrice - currentSpotPrice) / currentSpotPrice * 100),
      method: "contract_simulation_binary_search",
      formula: "PCL: Contract simulation with binary search"
    };
  } catch (error) {
    console.error("PCL depth simulation error:", error);
    return {
      error: "Unable to simulate PCL depth: " + error.message,
      formula: "PCL: Concentrated liquidity with custom curve"
    };
  }
}
async function getCurrentSpotPrice(contracts, poolId, assetInfos, baseDecimals, targetDecimals) {
  try {
    const testAmount = Math.pow(10, Math.max(baseDecimals - 4, 0)).toString();
    const simulation = await contracts.simulateSwap(poolId, {
      info: assetInfos[0],
      amount: testAmount
    });
    const baseAmountNormalized = Number(testAmount) / Math.pow(10, baseDecimals);
    const targetAmountNormalized = Number(simulation.return_amount) / Math.pow(10, targetDecimals);
    return targetAmountNormalized / baseAmountNormalized;
  } catch (error) {
    console.error("Error getting current spot price:", error);
    throw error;
  }
}
async function findSwapAmountForTargetPrice(contracts, poolId, assetInfos, currentPrice, targetPrice, isPriceIncrease, baseDecimals, targetDecimals) {
  const swapAssetInfo = isPriceIncrease ? assetInfos[1] : assetInfos[0];
  const swapToken = isPriceIncrease ? "asset1" : "asset0";
  const swapDecimals = isPriceIncrease ? targetDecimals : baseDecimals;
  const receiveDecimals = isPriceIncrease ? baseDecimals : targetDecimals;
  const poolShares = await contracts.getPoolShares(poolId);
  const baseReserve = poolShares?.assets[0]?.amount ? Number(poolShares.assets[0].amount) : 0;
  const targetReserve = poolShares?.assets[1]?.amount ? Number(poolShares.assets[1].amount) : 0;
  const swapReserve = isPriceIncrease ? targetReserve : baseReserve;
  const maxReasonableSwap = Math.floor(swapReserve * 0.8);
  const minReasonableMax = Math.pow(10, swapDecimals + 1);
  const finalMaxAmount = Math.max(maxReasonableSwap, minReasonableMax);
  let minAmount = Math.pow(10, swapDecimals);
  let maxAmount = finalMaxAmount;
  const tolerance = 0.01;
  const maxIterations = 50;
  const targetPercentageChange = (targetPrice - currentPrice) / currentPrice * 100;
  let bestAmount = minAmount;
  let bestPrice = currentPrice;
  for (let i = 0; i < maxIterations; i++) {
    const testAmount = Math.floor((minAmount + maxAmount) / 2);
    try {
      const simulation = await contracts.simulateSwap(poolId, {
        info: swapAssetInfo,
        amount: testAmount.toString()
      });
      const swapAmountNormalized = testAmount / Math.pow(10, swapDecimals);
      const returnAmountNormalized = Number(simulation.return_amount) / Math.pow(10, receiveDecimals);
      let effectivePrice;
      if (isPriceIncrease) {
        effectivePrice = swapAmountNormalized / returnAmountNormalized;
      } else {
        effectivePrice = returnAmountNormalized / swapAmountNormalized;
      }
      const actualPercentageChange = (effectivePrice - currentPrice) / currentPrice * 100;
      const percentageError = Math.abs(actualPercentageChange - targetPercentageChange) / Math.abs(targetPercentageChange);
      if (percentageError < tolerance) {
        return {
          swapAmount: swapAmountNormalized,
          swapToken,
          effectivePrice
        };
      }
      const bestActualPercentage = (bestPrice - currentPrice) / currentPrice * 100;
      const bestPercentageError = Math.abs(bestActualPercentage - targetPercentageChange) / Math.abs(targetPercentageChange);
      if (percentageError < bestPercentageError) {
        bestAmount = testAmount;
        bestPrice = effectivePrice;
      }
      if (Math.abs(actualPercentageChange) < Math.abs(targetPercentageChange)) {
        minAmount = testAmount + 1;
      } else {
        maxAmount = testAmount - 1;
      }
      if (minAmount >= maxAmount)
        break;
    } catch (error) {
      maxAmount = testAmount - 1;
      if (minAmount >= maxAmount)
        break;
    }
  }
  return {
    swapAmount: bestAmount / Math.pow(10, swapDecimals),
    swapToken,
    effectivePrice: bestPrice
  };
}
coingeckoDBRoute.get("/tickers", async (c) => {
  const database = c.get("database");
  const contracts = c.get("contracts");
  const ammCalculatorDB = c.get("ammCalculatorDB");
  const cacheKey = "tickers:all";
  const env = c.env;
  const kv = env?.KV_BINDING || env?.CACHE_KV;
  if (kv) {
    try {
      const cached = await kv.get(cacheKey);
      if (cached) {
        return c.json(JSON.parse(cached));
      }
    } catch (e) {
    }
  }
  try {
    const allPools = await database.getPools(100);
    const pools = allPools.filter((pool) => !EXCLUDED_POOLS.has(pool.poolAddress));
    const tickers = [];
    const poolAddresses = pools.map((p) => p.poolAddress);
    const poolBalances = await ammCalculatorDB.getBatchPoolBalances(poolAddresses);
    const uniqueTokens = /* @__PURE__ */ new Set();
    for (const [_, balance] of poolBalances) {
      uniqueTokens.add(balance.token0Denom);
      uniqueTokens.add(balance.token1Denom);
    }
    const decimalsMap = /* @__PURE__ */ new Map();
    const decimalsPromises = Array.from(uniqueTokens).map(async (token) => {
      try {
        const tokenDecimals = await database.getTokenDecimals(token);
        if (tokenDecimals !== null) {
          return { token, decimals: tokenDecimals };
        }
        const assetInfo = token.startsWith("ibc/") ? { native_token: { denom: token } } : token.startsWith("u") ? { native_token: { denom: token } } : { token: { contract_addr: token } };
        const decimals = await contracts.getTokenDecimals(assetInfo);
        return { token, decimals };
      } catch (error) {
        return { token, decimals: 6 };
      }
    });
    const decimalsResults = await Promise.all(decimalsPromises);
    for (const { token, decimals } of decimalsResults) {
      decimalsMap.set(token, decimals);
    }
    const tokenSymbols = await database.getTokenSymbols(Array.from(uniqueTokens));
    const tokenNames = Array.from(tokenSymbols.values());
    const tokenPrices = await database.getTokenPrices(tokenNames);
    const priceMap = /* @__PURE__ */ new Map();
    for (const tokenPrice of tokenPrices) {
      if (tokenPrice.token && tokenPrice.price) {
        const price = parseFloat(tokenPrice.price);
        for (const [denom, tokenName] of tokenSymbols) {
          if (tokenName === tokenPrice.token) {
            priceMap.set(denom, price);
            break;
          }
        }
      }
    }
    const BATCH_SIZE = 10;
    const poolBatches = [];
    for (let i = 0; i < pools.length; i += BATCH_SIZE) {
      poolBatches.push(pools.slice(i, i + BATCH_SIZE));
    }
    for (const batch of poolBatches) {
      const batchPromises = batch.map(async (pool) => {
        const poolBalance = poolBalances.get(pool.poolAddress);
        if (!poolBalance)
          return null;
        try {
          const [priceData, liquidityUSD] = await Promise.all([
            ammCalculatorDB.getPoolPriceData(pool.poolAddress, decimalsMap),
            ammCalculatorDB.calculateLiquidityUSD(poolBalance, priceMap, decimalsMap)
          ]);
          if (!priceData) {
            return null;
          }
          const ticker = {
            ticker_id: createTickerId(poolBalance.token0Denom, poolBalance.token1Denom),
            base_currency: poolBalance.token0Denom,
            target_currency: poolBalance.token1Denom,
            pool_id: pool.poolAddress,
            last_price: priceData.spotPrice.toString(),
            base_volume: priceData.volume24h.baseVolume,
            target_volume: priceData.volume24h.targetVolume,
            liquidity_in_usd: liquidityUSD.toString(),
            bid: priceData.bidPrice.toString(),
            ask: priceData.askPrice.toString(),
            high: priceData.high24h?.toString() || priceData.spotPrice.toString(),
            low: priceData.low24h?.toString() || priceData.spotPrice.toString()
          };
          return ticker;
        } catch (poolError) {
          console.error(`Error processing pool ${pool.poolAddress}:`, poolError);
          return null;
        }
      });
      const batchResults = await Promise.all(batchPromises);
      const validTickers = batchResults.filter((ticker) => ticker !== null);
      tickers.push(...validTickers);
      if (poolBatches.indexOf(batch) < poolBatches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    if (kv && tickers.length > 0) {
      try {
        await kv.put(cacheKey, JSON.stringify(tickers), {
          expirationTtl: 30
          // 30 seconds cache
        });
      } catch (e) {
      }
    }
    return c.json(tickers);
  } catch (error) {
    console.error("Error fetching tickers from database:", error);
    return c.json({ error: "Failed to fetch ticker data" }, 500);
  }
});
var orderbookSchema = z.object({
  ticker_id: z.string(),
  depth: z.string().regex(/^\d+$/).transform(Number).optional().default("100")
});
coingeckoDBRoute.get("/orderbook", zValidator("query", orderbookSchema), async (c) => {
  const { ticker_id } = c.req.valid("query");
  return c.json({
    ticker_id,
    timestamp: Date.now().toString(),
    message: "This is an AMM DEX. Use /simulate_depth endpoint to calculate depth for specific price movements.",
    simulation_endpoint: "/simulate_depth?pool_id={pool_address}&percentage={2|-2}",
    example: "/simulate_depth?pool_id=bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3&percentage=2",
    bids: [],
    asks: []
  });
});
var simulateDepthSchema = z.object({
  pool_id: z.string(),
  percentage: z.string().regex(/^-?\d+(\.\d+)?$/).transform(Number),
  amount_usd: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()
});
coingeckoDBRoute.get("/simulate_depth", zValidator("query", simulateDepthSchema), async (c) => {
  const { pool_id, percentage, amount_usd } = c.req.valid("query");
  const database = c.get("database");
  const contracts = c.get("contracts");
  const ammCalculatorDB = c.get("ammCalculatorDB");
  try {
    if (EXCLUDED_POOLS.has(pool_id)) {
      return c.json({ error: "Pool not available for simulation" }, 404);
    }
    const poolBalance = await database.getPoolBalance(pool_id);
    if (!poolBalance) {
      return c.json({ error: "Pool not found" }, 404);
    }
    const pool = await contracts.getPool(pool_id);
    const poolType = pool.pair_type.xyk ? "XYK" : "PCL";
    const baseDecimals = await getTokenDecimals(contracts, poolBalance.token0Denom);
    const targetDecimals = await getTokenDecimals(contracts, poolBalance.token1Denom);
    const priceData = await ammCalculatorDB.getPoolPriceData(pool_id);
    if (!priceData) {
      return c.json({ error: "Unable to get pool price data" }, 500);
    }
    const currentPrice = priceData.spotPrice;
    const targetPrice = currentPrice * (1 + percentage / 100);
    let depthResult;
    if (poolType === "XYK") {
      depthResult = await simulateXYKDepth(
        poolBalance,
        currentPrice,
        targetPrice,
        baseDecimals,
        targetDecimals,
        percentage > 0
      );
    } else {
      depthResult = await simulatePCLDepth(
        contracts,
        pool_id,
        pool.asset_infos,
        percentage,
        baseDecimals,
        targetDecimals
      );
    }
    return c.json({
      pool_id,
      pool_type: poolType,
      current_price: currentPrice.toString(),
      target_price: targetPrice.toString(),
      percentage_change: percentage,
      depth: depthResult,
      timestamp: Date.now().toString()
    });
  } catch (error) {
    console.error("Error simulating depth:", error);
    return c.json({ error: "Failed to simulate depth" }, 500);
  }
});
var historicalTradesSchema = z.object({
  ticker_id: z.string(),
  type: z.enum(["buy", "sell", "all"]).optional().default("all"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("100"),
  start_time: z.string().regex(/^\d+$/).transform(Number).optional(),
  end_time: z.string().regex(/^\d+$/).transform(Number).optional()
});
coingeckoDBRoute.get("/historical_trades", zValidator("query", historicalTradesSchema), async (c) => {
  const { ticker_id, type, limit, start_time, end_time } = c.req.valid("query");
  const database = c.get("database");
  const contracts = c.get("contracts");
  try {
    const [base, target] = ticker_id.split("_");
    const allPools = await database.getPools(100);
    const pools = allPools.filter((pool) => !EXCLUDED_POOLS.has(pool.poolAddress));
    const poolBalancePromises = pools.map(async (pool) => {
      const balance = await database.getPoolBalance(pool.poolAddress);
      return { pool, balance };
    });
    const poolBalanceResults = await Promise.all(poolBalancePromises);
    const matchingResult = poolBalanceResults.find(
      ({ balance }) => balance && (balance.token0Denom === base && balance.token1Denom === target || balance.token0Denom === target && balance.token1Denom === base)
    );
    const matchingPool = matchingResult?.pool || null;
    const poolBalance = matchingResult?.balance || null;
    if (!matchingPool || !poolBalance) {
      return c.json({ error: "Pool not found" }, 404);
    }
    const baseDecimals = await getTokenDecimals(contracts, base);
    const targetDecimals = await getTokenDecimals(contracts, target);
    const trades = await database.getHistoricalTrades(
      matchingPool.poolAddress,
      limit,
      start_time,
      end_time
    );
    const buyTrades = [];
    const sellTrades = [];
    let tradeIdCounter = 1;
    trades.forEach((trade) => {
      const isBuy = trade.offerAsset === base;
      const offerAmount = Number(trade.offerAmount);
      const returnAmount = Number(trade.returnAmount);
      let price;
      let baseVolume;
      let targetVolume;
      if (isBuy) {
        const normalizedOffer = offerAmount / Math.pow(10, baseDecimals);
        const normalizedReturn = returnAmount / Math.pow(10, targetDecimals);
        price = normalizedReturn / normalizedOffer;
        baseVolume = normalizedOffer.toString();
        targetVolume = normalizedReturn.toString();
      } else {
        const normalizedOffer = offerAmount / Math.pow(10, targetDecimals);
        const normalizedReturn = returnAmount / Math.pow(10, baseDecimals);
        price = normalizedOffer / normalizedReturn;
        baseVolume = normalizedReturn.toString();
        targetVolume = normalizedOffer.toString();
      }
      const formattedTrade = {
        trade_id: trade.transactionHash || tradeIdCounter++,
        price: price.toString(),
        base_volume: baseVolume,
        target_volume: targetVolume,
        trade_timestamp: new Date(trade.timestamp).getTime().toString(),
        type: isBuy ? "buy" : "sell"
      };
      if (formattedTrade.type === "buy" && type !== "sell") {
        buyTrades.push(formattedTrade);
      } else if (formattedTrade.type === "sell" && type !== "buy") {
        sellTrades.push(formattedTrade);
      }
    });
    const response = {
      buy: buyTrades,
      sell: sellTrades
    };
    return c.json(response);
  } catch (error) {
    console.error("Error fetching historical trades:", error);
    return c.json({ error: "Failed to fetch historical trades" }, 500);
  }
});
var coingecko_db_default = coingeckoDBRoute;

// src/worker.ts
var app = new Hono2();
app.use("*", cors());
app.use("*", errorHandler2);
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    worker: "cloudflare"
  });
});
app.get("/", (c) => {
  return c.json({
    name: "Tower Babydex API",
    version: "1.0.0",
    description: "REST API for Babydex DEX for CoinGecko integration",
    deployment: "Cloudflare Workers",
    endpoints: {
      coingecko: {
        "/tickers": "Get 24hr market data for all pools",
        "/orderbook": "Get AMM formula explanation",
        "/historical_trades": "Get historical trade data",
        "/simulate_depth": "Calculate depth for price movements"
      }
    }
  });
});
app.use("*", async (c, next) => {
  const env = c.env;
  const config = {
    port: 3e3,
    rpcEndpoint: env.RPC_ENDPOINT || "https://rpc.babylon.nodestake.org",
    contracts: {
      factory: env.FACTORY_CONTRACT || "",
      router: env.ROUTER_CONTRACT || "",
      incentives: env.INCENTIVES_CONTRACT || "",
      coinRegistry: env.COIN_REGISTRY_CONTRACT || ""
    },
    cache: {
      maxSize: parseInt(env.CACHE_MAX_SIZE || "1000"),
      defaultTTL: parseInt(env.CACHE_DEFAULT_TTL || "60000")
    }
  };
  const kvNamespace = env.KV_BINDING || env.CACHE_KV;
  const cacheService = new CacheService(
    config.cache.maxSize,
    config.cache.defaultTTL,
    kvNamespace
    // Pass Cloudflare KV namespace
  );
  const contractService = new ContractService(
    config.rpcEndpoint,
    config.contracts,
    cacheService
  );
  let databaseService = null;
  let ammCalculator;
  try {
    process.env.SUPABASE_HOST = env.SUPABASE_HOST;
    process.env.SUPABASE_PORT = env.SUPABASE_PORT;
    process.env.SUPABASE_USER = env.SUPABASE_USER;
    process.env.SUPABASE_PW = env.SUPABASE_PW;
    process.env.SUPABASE_DB = env.SUPABASE_DB;
    process.env.SUPABASE_SSL = env.SUPABASE_SSL;
    process.env.API_MODE = env.API_MODE;
    databaseService = await createDatabaseService(env.HYPERDRIVE);
    if (databaseService) {
      ammCalculator = new AMMCalculatorDB(databaseService, contractService);
      c.set("contracts", contractService);
      c.set("ammCalculatorDB", ammCalculator);
      c.set("database", databaseService);
    } else {
      throw new Error("Database not configured");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return c.json({ error: "Database initialization failed" }, 500);
  }
  await next();
});
app.route("/", coingecko_db_default);
app.route("/api/v1", coingecko_db_default);
var worker_default = app;
export {
  worker_default as default
};
