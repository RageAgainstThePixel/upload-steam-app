require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
const undici_1 = __nccwpck_require__(1773);
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes || (exports.HttpCodes = HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers || (exports.Headers = Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes || (exports.MediaTypes = MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    getAgentDispatcher(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (!useProxy) {
            return;
        }
        return this._getProxyAgentDispatcher(parsedUrl, proxyUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (!useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if tunneling agent isn't assigned create a new agent
        if (!agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _getProxyAgentDispatcher(parsedUrl, proxyUrl) {
        let proxyAgent;
        if (this._keepAlive) {
            proxyAgent = this._proxyAgentDispatcher;
        }
        // if agent is already assigned use that agent.
        if (proxyAgent) {
            return proxyAgent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        proxyAgent = new undici_1.ProxyAgent(Object.assign({ uri: proxyUrl.href, pipelining: !this._keepAlive ? 0 : 1 }, ((proxyUrl.username || proxyUrl.password) && {
            token: `${proxyUrl.username}:${proxyUrl.password}`
        })));
        this._proxyAgentDispatcher = proxyAgent;
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            proxyAgent.options = Object.assign(proxyAgent.options.requestTls || {}, {
                rejectUnauthorized: false
            });
        }
        return proxyAgent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises
// export const {open} = 'fs'
, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
exports.UV_FS_O_EXLOCK = 0x10000000;
exports.READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const path = __importStar(__nccwpck_require__(1017));
const ioUtil = __importStar(__nccwpck_require__(1962));
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 3627:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Crypto = __nccwpck_require__(6113);

/**
 * Returns the current local Unix time
 * @param {number} [timeOffset=0] - This many seconds will be added to the returned time
 * @returns {number}
 */
exports.time = function(timeOffset) {
	return Math.floor(Date.now() / 1000) + (timeOffset || 0);
};

/**
 * Generate a Steam-style TOTP authentication code.
 * @param {Buffer|string} secret - Your TOTP shared_secret as a Buffer, hex, or base64
 * @param {number} [timeOffset=0] - If you know how far off your clock is from the Steam servers, put the offset here in seconds
 * @returns {string}
 */
exports.generateAuthCode = exports.getAuthCode = function(secret, timeOffset) {
	if (typeof timeOffset === 'function') {
		exports.getTimeOffset((err, offset, latency) => {
			if (err) {
				timeOffset(err);
				return;
			}

			let code = exports.generateAuthCode(secret, offset);
			timeOffset(null, code, offset, latency);
		});

		return;
	}

	secret = bufferizeSecret(secret);

	let time = exports.time(timeOffset);

	let buffer = Buffer.allocUnsafe(8);
	// The first 4 bytes are the high 4 bytes of a 64-bit integer. To make things easier on ourselves, let's just pretend
	// that it's a 32-bit int and write 0 for the high bytes. Since we're dividing by 30, this won't cause a problem
	// until the year 6053.
	buffer.writeUInt32BE(0, 0);
	buffer.writeUInt32BE(Math.floor(time / 30), 4);

	let hmac = Crypto.createHmac('sha1', secret);
	hmac = hmac.update(buffer).digest();

	let start = hmac[19] & 0x0F;
	hmac = hmac.slice(start, start + 4);

	let fullcode = hmac.readUInt32BE(0) & 0x7FFFFFFF;

	const chars = '23456789BCDFGHJKMNPQRTVWXY';

	let code = '';
	for (let i = 0; i < 5; i++) {
		code += chars.charAt(fullcode % chars.length);
		fullcode /= chars.length;
	}

	return code;
};

/**
 * Generate a base64 confirmation key for use with mobile trade confirmations. The key can only be used once.
 * @param {Buffer|string} identitySecret - The identity_secret that you received when enabling two-factor authentication
 * @param {number} time - The Unix time for which you are generating this secret. Generally should be the current time.
 * @param {string} tag - The tag which identifies what this request (and therefore key) will be for. "conf" to load the confirmations page, "details" to load details about a trade, "allow" to confirm a trade, "cancel" to cancel it.
 * @returns {string}
 */
exports.generateConfirmationKey = exports.getConfirmationKey = function(identitySecret, time, tag) {
	identitySecret = bufferizeSecret(identitySecret);

	let dataLen = 8;

	if (tag) {
		if (tag.length > 32) {
			dataLen += 32;
		} else {
			dataLen += tag.length;
		}
	}

	let buffer = Buffer.allocUnsafe(dataLen);

	// Auto-detect whether we have support for Buffer#writeUInt64BE and use it if we can. If we have writeUInt64BE
	// then we also definitely have BigInt.
	if (buffer.writeBigUInt64BE) {
		buffer.writeBigUInt64BE(BigInt(time), 0);
	} else {
		// Fall back to old Y2K38-unsafe behavior.
		// If you're still using Node.js <10.20.0 in 2038, you only have yourself to blame.
		buffer.writeUInt32BE(0, 0);
		buffer.writeUInt32BE(time, 4);
	}

	if (tag) {
		buffer.write(tag, 8);
	}

	let hmac = Crypto.createHmac('sha1', identitySecret);
	return hmac.update(buffer).digest('base64');
};

exports.getTimeOffset = function(callback) {
	let start = Date.now();
	let req = (__nccwpck_require__(5687).request)({
		"hostname": "api.steampowered.com",
		"path": "/ITwoFactorService/QueryTime/v1/",
		"method": "POST",
		"headers": {
			"Content-Length": 0
		}
	}, (res) => {
		if (res.statusCode != 200) {
			callback(new Error("HTTP error " + res.statusCode));
			return;
		}

		let response = '';
		res.on('data', (chunk) => {
			response += chunk;
		});

		res.on('end', () => {
			try {
				response = JSON.parse(response).response;
			} catch(e) {
				callback(new Error("Malformed response"));
			}

			if (!response || !response.server_time) {
				callback(new Error("Malformed response"));
			}

			let end = Date.now();
			let offset = response.server_time - exports.time();

			callback(null, offset, end - start);
		});
	});

	req.on('error', callback);

	req.end();
};

/**
 * Get a standardized device ID based on your SteamID.
 * @param {string|object} steamID - Your SteamID, either as a string or as an object which has a toString() method that returns the SteamID
 * @returns {string}
 */
exports.getDeviceID = function(steamID) {
	let salt = process.env.STEAM_TOTP_SALT || '';
	return "android:" + Crypto.createHash('sha1').update(steamID.toString() + salt).digest('hex')
			.replace(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12}).*$/, '$1-$2-$3-$4-$5');
};

function bufferizeSecret(secret) {
	if (typeof secret === 'string') {
		// Check if it's hex
		if (secret.match(/[0-9a-f]{40}/i)) {
			return Buffer.from(secret, 'hex');
		} else {
			// Looks like it's base64
			return Buffer.from(secret, 'base64');
		}
	}

	return secret;
}


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 1773:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Client = __nccwpck_require__(3598)
const Dispatcher = __nccwpck_require__(412)
const errors = __nccwpck_require__(8045)
const Pool = __nccwpck_require__(4634)
const BalancedPool = __nccwpck_require__(7931)
const Agent = __nccwpck_require__(7890)
const util = __nccwpck_require__(3983)
const { InvalidArgumentError } = errors
const api = __nccwpck_require__(4059)
const buildConnector = __nccwpck_require__(2067)
const MockClient = __nccwpck_require__(8687)
const MockAgent = __nccwpck_require__(6771)
const MockPool = __nccwpck_require__(6193)
const mockErrors = __nccwpck_require__(888)
const ProxyAgent = __nccwpck_require__(7858)
const RetryHandler = __nccwpck_require__(2286)
const { getGlobalDispatcher, setGlobalDispatcher } = __nccwpck_require__(1892)
const DecoratorHandler = __nccwpck_require__(6930)
const RedirectHandler = __nccwpck_require__(2860)
const createRedirectInterceptor = __nccwpck_require__(8861)

let hasCrypto
try {
  __nccwpck_require__(6113)
  hasCrypto = true
} catch {
  hasCrypto = false
}

Object.assign(Dispatcher.prototype, api)

module.exports.Dispatcher = Dispatcher
module.exports.Client = Client
module.exports.Pool = Pool
module.exports.BalancedPool = BalancedPool
module.exports.Agent = Agent
module.exports.ProxyAgent = ProxyAgent
module.exports.RetryHandler = RetryHandler

module.exports.DecoratorHandler = DecoratorHandler
module.exports.RedirectHandler = RedirectHandler
module.exports.createRedirectInterceptor = createRedirectInterceptor

module.exports.buildConnector = buildConnector
module.exports.errors = errors

function makeDispatcher (fn) {
  return (url, opts, handler) => {
    if (typeof opts === 'function') {
      handler = opts
      opts = null
    }

    if (!url || (typeof url !== 'string' && typeof url !== 'object' && !(url instanceof URL))) {
      throw new InvalidArgumentError('invalid url')
    }

    if (opts != null && typeof opts !== 'object') {
      throw new InvalidArgumentError('invalid opts')
    }

    if (opts && opts.path != null) {
      if (typeof opts.path !== 'string') {
        throw new InvalidArgumentError('invalid opts.path')
      }

      let path = opts.path
      if (!opts.path.startsWith('/')) {
        path = `/${path}`
      }

      url = new URL(util.parseOrigin(url).origin + path)
    } else {
      if (!opts) {
        opts = typeof url === 'object' ? url : {}
      }

      url = util.parseURL(url)
    }

    const { agent, dispatcher = getGlobalDispatcher() } = opts

    if (agent) {
      throw new InvalidArgumentError('unsupported opts.agent. Did you mean opts.client?')
    }

    return fn.call(dispatcher, {
      ...opts,
      origin: url.origin,
      path: url.search ? `${url.pathname}${url.search}` : url.pathname,
      method: opts.method || (opts.body ? 'PUT' : 'GET')
    }, handler)
  }
}

module.exports.setGlobalDispatcher = setGlobalDispatcher
module.exports.getGlobalDispatcher = getGlobalDispatcher

if (util.nodeMajor > 16 || (util.nodeMajor === 16 && util.nodeMinor >= 8)) {
  let fetchImpl = null
  module.exports.fetch = async function fetch (resource) {
    if (!fetchImpl) {
      fetchImpl = (__nccwpck_require__(4881).fetch)
    }

    try {
      return await fetchImpl(...arguments)
    } catch (err) {
      if (typeof err === 'object') {
        Error.captureStackTrace(err, this)
      }

      throw err
    }
  }
  module.exports.Headers = __nccwpck_require__(554).Headers
  module.exports.Response = __nccwpck_require__(7823).Response
  module.exports.Request = __nccwpck_require__(8359).Request
  module.exports.FormData = __nccwpck_require__(2015).FormData
  module.exports.File = __nccwpck_require__(8511).File
  module.exports.FileReader = __nccwpck_require__(1446).FileReader

  const { setGlobalOrigin, getGlobalOrigin } = __nccwpck_require__(1246)

  module.exports.setGlobalOrigin = setGlobalOrigin
  module.exports.getGlobalOrigin = getGlobalOrigin

  const { CacheStorage } = __nccwpck_require__(7907)
  const { kConstruct } = __nccwpck_require__(9174)

  // Cache & CacheStorage are tightly coupled with fetch. Even if it may run
  // in an older version of Node, it doesn't have any use without fetch.
  module.exports.caches = new CacheStorage(kConstruct)
}

if (util.nodeMajor >= 16) {
  const { deleteCookie, getCookies, getSetCookies, setCookie } = __nccwpck_require__(1724)

  module.exports.deleteCookie = deleteCookie
  module.exports.getCookies = getCookies
  module.exports.getSetCookies = getSetCookies
  module.exports.setCookie = setCookie

  const { parseMIMEType, serializeAMimeType } = __nccwpck_require__(685)

  module.exports.parseMIMEType = parseMIMEType
  module.exports.serializeAMimeType = serializeAMimeType
}

if (util.nodeMajor >= 18 && hasCrypto) {
  const { WebSocket } = __nccwpck_require__(4284)

  module.exports.WebSocket = WebSocket
}

module.exports.request = makeDispatcher(api.request)
module.exports.stream = makeDispatcher(api.stream)
module.exports.pipeline = makeDispatcher(api.pipeline)
module.exports.connect = makeDispatcher(api.connect)
module.exports.upgrade = makeDispatcher(api.upgrade)

module.exports.MockClient = MockClient
module.exports.MockPool = MockPool
module.exports.MockAgent = MockAgent
module.exports.mockErrors = mockErrors


/***/ }),

/***/ 7890:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { InvalidArgumentError } = __nccwpck_require__(8045)
const { kClients, kRunning, kClose, kDestroy, kDispatch, kInterceptors } = __nccwpck_require__(2785)
const DispatcherBase = __nccwpck_require__(4839)
const Pool = __nccwpck_require__(4634)
const Client = __nccwpck_require__(3598)
const util = __nccwpck_require__(3983)
const createRedirectInterceptor = __nccwpck_require__(8861)
const { WeakRef, FinalizationRegistry } = __nccwpck_require__(6436)()

const kOnConnect = Symbol('onConnect')
const kOnDisconnect = Symbol('onDisconnect')
const kOnConnectionError = Symbol('onConnectionError')
const kMaxRedirections = Symbol('maxRedirections')
const kOnDrain = Symbol('onDrain')
const kFactory = Symbol('factory')
const kFinalizer = Symbol('finalizer')
const kOptions = Symbol('options')

function defaultFactory (origin, opts) {
  return opts && opts.connections === 1
    ? new Client(origin, opts)
    : new Pool(origin, opts)
}

class Agent extends DispatcherBase {
  constructor ({ factory = defaultFactory, maxRedirections = 0, connect, ...options } = {}) {
    super()

    if (typeof factory !== 'function') {
      throw new InvalidArgumentError('factory must be a function.')
    }

    if (connect != null && typeof connect !== 'function' && typeof connect !== 'object') {
      throw new InvalidArgumentError('connect must be a function or an object')
    }

    if (!Number.isInteger(maxRedirections) || maxRedirections < 0) {
      throw new InvalidArgumentError('maxRedirections must be a positive number')
    }

    if (connect && typeof connect !== 'function') {
      connect = { ...connect }
    }

    this[kInterceptors] = options.interceptors && options.interceptors.Agent && Array.isArray(options.interceptors.Agent)
      ? options.interceptors.Agent
      : [createRedirectInterceptor({ maxRedirections })]

    this[kOptions] = { ...util.deepClone(options), connect }
    this[kOptions].interceptors = options.interceptors
      ? { ...options.interceptors }
      : undefined
    this[kMaxRedirections] = maxRedirections
    this[kFactory] = factory
    this[kClients] = new Map()
    this[kFinalizer] = new FinalizationRegistry(/* istanbul ignore next: gc is undeterministic */ key => {
      const ref = this[kClients].get(key)
      if (ref !== undefined && ref.deref() === undefined) {
        this[kClients].delete(key)
      }
    })

    const agent = this

    this[kOnDrain] = (origin, targets) => {
      agent.emit('drain', origin, [agent, ...targets])
    }

    this[kOnConnect] = (origin, targets) => {
      agent.emit('connect', origin, [agent, ...targets])
    }

    this[kOnDisconnect] = (origin, targets, err) => {
      agent.emit('disconnect', origin, [agent, ...targets], err)
    }

    this[kOnConnectionError] = (origin, targets, err) => {
      agent.emit('connectionError', origin, [agent, ...targets], err)
    }
  }

  get [kRunning] () {
    let ret = 0
    for (const ref of this[kClients].values()) {
      const client = ref.deref()
      /* istanbul ignore next: gc is undeterministic */
      if (client) {
        ret += client[kRunning]
      }
    }
    return ret
  }

  [kDispatch] (opts, handler) {
    let key
    if (opts.origin && (typeof opts.origin === 'string' || opts.origin instanceof URL)) {
      key = String(opts.origin)
    } else {
      throw new InvalidArgumentError('opts.origin must be a non-empty string or URL.')
    }

    const ref = this[kClients].get(key)

    let dispatcher = ref ? ref.deref() : null
    if (!dispatcher) {
      dispatcher = this[kFactory](opts.origin, this[kOptions])
        .on('drain', this[kOnDrain])
        .on('connect', this[kOnConnect])
        .on('disconnect', this[kOnDisconnect])
        .on('connectionError', this[kOnConnectionError])

      this[kClients].set(key, new WeakRef(dispatcher))
      this[kFinalizer].register(dispatcher, key)
    }

    return dispatcher.dispatch(opts, handler)
  }

  async [kClose] () {
    const closePromises = []
    for (const ref of this[kClients].values()) {
      const client = ref.deref()
      /* istanbul ignore else: gc is undeterministic */
      if (client) {
        closePromises.push(client.close())
      }
    }

    await Promise.all(closePromises)
  }

  async [kDestroy] (err) {
    const destroyPromises = []
    for (const ref of this[kClients].values()) {
      const client = ref.deref()
      /* istanbul ignore else: gc is undeterministic */
      if (client) {
        destroyPromises.push(client.destroy(err))
      }
    }

    await Promise.all(destroyPromises)
  }
}

module.exports = Agent


/***/ }),

/***/ 7032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { addAbortListener } = __nccwpck_require__(3983)
const { RequestAbortedError } = __nccwpck_require__(8045)

const kListener = Symbol('kListener')
const kSignal = Symbol('kSignal')

function abort (self) {
  if (self.abort) {
    self.abort()
  } else {
    self.onError(new RequestAbortedError())
  }
}

function addSignal (self, signal) {
  self[kSignal] = null
  self[kListener] = null

  if (!signal) {
    return
  }

  if (signal.aborted) {
    abort(self)
    return
  }

  self[kSignal] = signal
  self[kListener] = () => {
    abort(self)
  }

  addAbortListener(self[kSignal], self[kListener])
}

function removeSignal (self) {
  if (!self[kSignal]) {
    return
  }

  if ('removeEventListener' in self[kSignal]) {
    self[kSignal].removeEventListener('abort', self[kListener])
  } else {
    self[kSignal].removeListener('abort', self[kListener])
  }

  self[kSignal] = null
  self[kListener] = null
}

module.exports = {
  addSignal,
  removeSignal
}


/***/ }),

/***/ 9744:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { AsyncResource } = __nccwpck_require__(852)
const { InvalidArgumentError, RequestAbortedError, SocketError } = __nccwpck_require__(8045)
const util = __nccwpck_require__(3983)
const { addSignal, removeSignal } = __nccwpck_require__(7032)

class ConnectHandler extends AsyncResource {
  constructor (opts, callback) {
    if (!opts || typeof opts !== 'object') {
      throw new InvalidArgumentError('invalid opts')
    }

    if (typeof callback !== 'function') {
      throw new InvalidArgumentError('invalid callback')
    }

    const { signal, opaque, responseHeaders } = opts

    if (signal && typeof signal.on !== 'function' && typeof signal.addEventListener !== 'function') {
      throw new InvalidArgumentError('signal must be an EventEmitter or EventTarget')
    }

    super('UNDICI_CONNECT')

    this.opaque = opaque || null
    this.responseHeaders = responseHeaders || null
    this.callback = callback
    this.abort = null

    addSignal(this, signal)
  }

  onConnect (abort, context) {
    if (!this.callback) {
      throw new RequestAbortedError()
    }

    this.abort = abort
    this.context = context
  }

  onHeaders () {
    throw new SocketError('bad connect', null)
  }

  onUpgrade (statusCode, rawHeaders, socket) {
    const { callback, opaque, context } = this

    removeSignal(this)

    this.callback = null

    let headers = rawHeaders
    // Indicates is an HTTP2Session
    if (headers != null) {
      headers = this.responseHeaders === 'raw' ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders)
    }

    this.runInAsyncScope(callback, null, null, {
      statusCode,
      headers,
      socket,
      opaque,
      context
    })
  }

  onError (err) {
    const { callback, opaque } = this

    removeSignal(this)

    if (callback) {
      this.callback = null
      queueMicrotask(() => {
        this.runInAsyncScope(callback, null, err, { opaque })
      })
    }
  }
}

function connect (opts, callback) {
  if (callback === undefined) {
    return new Promise((resolve, reject) => {
      connect.call(this, opts, (err, data) => {
        return err ? reject(err) : resolve(data)
      })
    })
  }

  try {
    const connectHandler = new ConnectHandler(opts, callback)
    this.dispatch({ ...opts, method: 'CONNECT' }, connectHandler)
  } catch (err) {
    if (typeof callback !== 'function') {
      throw err
    }
    const opaque = opts && opts.opaque
    queueMicrotask(() => callback(err, { opaque }))
  }
}

module.exports = connect


/***/ }),

/***/ 8752:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  Readable,
  Duplex,
  PassThrough
} = __nccwpck_require__(2781)
const {
  InvalidArgumentError,
  InvalidReturnValueError,
  RequestAbortedError
} = __nccwpck_require__(8045)
const util = __nccwpck_require__(3983)
const { AsyncResource } = __nccwpck_require__(852)
const { addSignal, removeSignal } = __nccwpck_require__(7032)
const assert = __nccwpck_require__(9491)

const kResume = Symbol('resume')

class PipelineRequest extends Readable {
  constructor () {
    super({ autoDestroy: true })

    this[kResume] = null
  }

  _read () {
    const { [kResume]: resume } = this

    if (resume) {
      this[kResume] = null
      resume()
    }
  }

  _destroy (err, callback) {
    this._read()

    callback(err)
  }
}

class PipelineResponse extends Readable {
  constructor (resume) {
    super({ autoDestroy: true })
    this[kResume] = resume
  }

  _read () {
    this[kResume]()
  }

  _destroy (err, callback) {
    if (!err && !this._readableState.endEmitted) {
      err = new RequestAbortedError()
    }

    callback(err)
  }
}

class PipelineHandler extends AsyncResource {
  constructor (opts, handler) {
    if (!opts || typeof opts !== 'object') {
      throw new InvalidArgumentError('invalid opts')
    }

    if (typeof handler !== 'function') {
      throw new InvalidArgumentError('invalid handler')
    }

    const { signal, method, opaque, onInfo, responseHeaders } = opts

    if (signal && typeof signal.on !== 'function' && typeof signal.addEventListener !== 'function') {
      throw new InvalidArgumentError('signal must be an EventEmitter or EventTarget')
    }

    if (method === 'CONNECT') {
      throw new InvalidArgumentError('invalid method')
    }

    if (onInfo && typeof onInfo !== 'function') {
      throw new InvalidArgumentError('invalid onInfo callback')
    }

    super('UNDICI_PIPELINE')

    this.opaque = opaque || null
    this.responseHeaders = responseHeaders || null
    this.handler = handler
    this.abort = null
    this.context = null
    this.onInfo = onInfo || null

    this.req = new PipelineRequest().on('error', util.nop)

    this.ret = new Duplex({
      readableObjectMode: opts.objectMode,
      autoDestroy: true,
      read: () => {
        const { body } = this

        if (body && body.resume) {
          body.resume()
        }
      },
      write: (chunk, encoding, callback) => {
        const { req } = this

        if (req.push(chunk, encoding) || req._readableState.destroyed) {
          callback()
        } else {
          req[kResume] = callback
        }
      },
      destroy: (err, callback) => {
        const { body, req, res, ret, abort } = this

        if (!err && !ret._readableState.endEmitted) {
          err = new RequestAbortedError()
        }

        if (abort && err) {
          abort()
        }

        util.destroy(body, err)
        util.destroy(req, err)
        util.destroy(res, err)

        removeSignal(this)

        callback(err)
      }
    }).on('prefinish', () => {
      const { req } = this

      // Node < 15 does not call _final in same tick.
      req.push(null)
    })

    this.res = null

    addSignal(this, signal)
  }

  onConnect (abort, context) {
    const { ret, res } = this

    assert(!res, 'pipeline cannot be retried')

    if (ret.destroyed) {
      throw new RequestAbortedError()
    }

    this.abort = abort
    this.context = context
  }

  onHeaders (statusCode, rawHeaders, resume) {
    const { opaque, handler, context } = this

    if (statusCode < 200) {
      if (this.onInfo) {
        const headers = this.responseHeaders === 'raw' ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders)
        this.onInfo({ statusCode, headers })
      }
      return
    }

    this.res = new PipelineResponse(resume)

    let body
    try {
      this.handler = null
      const headers = this.responseHeaders === 'raw' ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders)
      body = this.runInAsyncScope(handler, null, {
        statusCode,
        headers,
        opaque,
        body: this.res,
        context
      })
    } catch (err) {
      this.res.on('error', util.nop)
      throw err
    }

    if (!body || typeof body.on !== 'function') {
      throw new InvalidReturnValueError('expected Readable')
    }

    body
      .on('data', (chunk) => {
        const { ret, body } = this

        if (!ret.push(chunk) && body.pause) {
          body.pause()
        }
      })
      .on('error', (err) => {
        const { ret } = this

        util.destroy(ret, err)
      })
      .on('end', () => {
        const { ret } = this

        ret.push(null)
      })
      .on('close', () => {
        const { ret } = this

        if (!ret._readableState.ended) {
          util.destroy(ret, new RequestAbortedError())
        }
      })

    this.body = body
  }

  onData (chunk) {
    const { res } = this
    return res.push(chunk)
  }

  onComplete (trailers) {
    const { res } = this
    res.push(null)
  }

  onError (err) {
    const { ret } = this
    this.handler = null
    util.destroy(ret, err)
  }
}

function pipeline (opts, handler) {
  try {
    const pipelineHandler = new PipelineHandler(opts, handler)
    this.dispatch({ ...opts, body: pipelineHandler.req }, pipelineHandler)
    return pipelineHandler.ret
  } catch (err) {
    return new PassThrough().destroy(err)
  }
}

module.exports = pipeline


/***/ }),

/***/ 5448:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Readable = __nccwpck_require__(3858)
const {
  InvalidArgumentError,
  RequestAbortedError
} = __nccwpck_require__(8045)
const util = __nccwpck_require__(3983)
const { getResolveErrorBodyCallback } = __nccwpck_require__(7474)
const { AsyncResource } = __nccwpck_require__(852)
const { addSignal, removeSignal } = __nccwpck_require__(7032)

class RequestHandler extends AsyncResource {
  constructor (opts, callback) {
    if (!opts || typeof opts !== 'object') {
      throw new InvalidArgumentError('invalid opts')
    }

    const { signal, method, opaque, body, onInfo, responseHeaders, throwOnError, highWaterMark } = opts

    try {
      if (typeof callback !== 'function') {
        throw new InvalidArgumentError('invalid callback')
      }

      if (highWaterMark && (typeof highWaterMark !== 'number' || highWaterMark < 0)) {
        throw new InvalidArgumentError('invalid highWaterMark')
      }

      if (signal && typeof signal.on !== 'function' && typeof signal.addEventListener !== 'function') {
        throw new InvalidArgumentError('signal must be an EventEmitter or EventTarget')
      }

      if (method === 'CONNECT') {
        throw new InvalidArgumentError('invalid method')
      }

      if (onInfo && typeof onInfo !== 'function') {
        throw new InvalidArgumentError('invalid onInfo callback')
      }

      super('UNDICI_REQUEST')
    } catch (err) {
      if (util.isStream(body)) {
        util.destroy(body.on('error', util.nop), err)
      }
      throw err
    }

    this.responseHeaders = responseHeaders || null
    this.opaque = opaque || null
    this.callback = callback
    this.res = null
    this.abort = null
    this.body = body
    this.trailers = {}
    this.context = null
    this.onInfo = onInfo || null
    this.throwOnError = throwOnError
    this.highWaterMark = highWaterMark

    if (util.isStream(body)) {
      body.on('error', (err) => {
        this.onError(err)
      })
    }

    addSignal(this, signal)
  }

  onConnect (abort, context) {
    if (!this.callback) {
      throw new RequestAbortedError()
    }

    this.abort = abort
    this.context = context
  }

  onHeaders (statusCode, rawHeaders, resume, statusMessage) {
    const { callback, opaque, abort, context, responseHeaders, highWaterMark } = this

    const headers = responseHeaders === 'raw' ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders)

    if (statusCode < 200) {
      if (this.onInfo) {
        this.onInfo({ statusCode, headers })
      }
      return
    }

    const parsedHeaders = responseHeaders === 'raw' ? util.parseHeaders(rawHeaders) : headers
    const contentType = parsedHeaders['content-type']
    const body = new Readable({ resume, abort, contentType, highWaterMark })

    this.callback = null
    this.res = body
    if (callback !== null) {
      if (this.throwOnError && statusCode >= 400) {
        this.runInAsyncScope(getResolveErrorBodyCallback, null,
          { callback, body, contentType, statusCode, statusMessage, headers }
        )
      } else {
        this.runInAsyncScope(callback, null, null, {
          statusCode,
          headers,
          trailers: this.trailers,
          opaque,
          body,
          context
        })
      }
    }
  }

  onData (chunk) {
    const { res } = this
    return res.push(chunk)
  }

  onComplete (trailers) {
    const { res } = this

    removeSignal(this)

    util.parseHeaders(trailers, this.trailers)

    res.push(null)
  }

  onError (err) {
    const { res, callback, body, opaque } = this

    removeSignal(this)

    if (callback) {
      // TODO: Does this need queueMicrotask?
      this.callback = null
      queueMicrotask(() => {
        this.runInAsyncScope(callback, null, err, { opaque })
      })
    }

    if (res) {
      this.res = null
      // Ensure all queued handlers are invoked before destroying res.
      queueMicrotask(() => {
        util.destroy(res, err)
      })
    }

    if (body) {
      this.body = null
      util.destroy(body, err)
    }
  }
}

function request (opts, callback) {
  if (callback === undefined) {
    return new Promise((resolve, reject) => {
      request.call(this, opts, (err, data) => {
        return err ? reject(err) : resolve(data)
      })
    })
  }

  try {
    this.dispatch(opts, new RequestHandler(opts, callback))
  } catch (err) {
    if (typeof callback !== 'function') {
      throw err
    }
    const opaque = opts && opts.opaque
    queueMicrotask(() => callback(err, { opaque }))
  }
}

module.exports = request
module.exports.RequestHandler = RequestHandler


/***/ }),

/***/ 5395:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { finished, PassThrough } = __nccwpck_require__(2781)
const {
  InvalidArgumentError,
  InvalidReturnValueError,
  RequestAbortedError
} = __nccwpck_require__(8045)
const util = __nccwpck_require__(3983)
const { getResolveErrorBodyCallback } = __nccwpck_require__(7474)
const { AsyncResource } = __nccwpck_require__(852)
const { addSignal, removeSignal } = __nccwpck_require__(7032)

class StreamHandler extends AsyncResource {
  constructor (opts, factory, callback) {
    if (!opts || typeof opts !== 'object') {
      throw new InvalidArgumentError('invalid opts')
    }

    const { signal, method, opaque, body, onInfo, responseHeaders, throwOnError } = opts

    try {
      if (typeof callback !== 'function') {
        throw new InvalidArgumentError('invalid callback')
      }

      if (typeof factory !== 'function') {
        throw new InvalidArgumentError('invalid factory')
      }

      if (signal && typeof signal.on !== 'function' && typeof signal.addEventListener !== 'function') {
        throw new InvalidArgumentError('signal must be an EventEmitter or EventTarget')
      }

      if (method === 'CONNECT') {
        throw new InvalidArgumentError('invalid method')
      }

      if (onInfo && typeof onInfo !== 'function') {
        throw new InvalidArgumentError('invalid onInfo callback')
      }

      super('UNDICI_STREAM')
    } catch (err) {
      if (util.isStream(body)) {
        util.destroy(body.on('error', util.nop), err)
      }
      throw err
    }

    this.responseHeaders = responseHeaders || null
    this.opaque = opaque || null
    this.factory = factory
    this.callback = callback
    this.res = null
    this.abort = null
    this.context = null
    this.trailers = null
    this.body = body
    this.onInfo = onInfo || null
    this.throwOnError = throwOnError || false

    if (util.isStream(body)) {
      body.on('error', (err) => {
        this.onError(err)
      })
    }

    addSignal(this, signal)
  }

  onConnect (abort, context) {
    if (!this.callback) {
      throw new RequestAbortedError()
    }

    this.abort = abort
    this.context = context
  }

  onHeaders (statusCode, rawHeaders, resume, statusMessage) {
    const { factory, opaque, context, callback, responseHeaders } = this

    const headers = responseHeaders === 'raw' ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders)

    if (statusCode < 200) {
      if (this.onInfo) {
        this.onInfo({ statusCode, headers })
      }
      return
    }

    this.factory = null

    let res

    if (this.throwOnError && statusCode >= 400) {
      const parsedHeaders = responseHeaders === 'raw' ? util.parseHeaders(rawHeaders) : headers
      const contentType = parsedHeaders['content-type']
      res = new PassThrough()

      this.callback = null
      this.runInAsyncScope(getResolveErrorBodyCallback, null,
        { callback, body: res, contentType, statusCode, statusMessage, headers }
      )
    } else {
      if (factory === null) {
        return
      }

      res = this.runInAsyncScope(factory, null, {
        statusCode,
        headers,
        opaque,
        context
      })

      if (
        !res ||
        typeof res.write !== 'function' ||
        typeof res.end !== 'function' ||
        typeof res.on !== 'function'
      ) {
        throw new InvalidReturnValueError('expected Writable')
      }

      // TODO: Avoid finished. It registers an unnecessary amount of listeners.
      finished(res, { readable: false }, (err) => {
        const { callback, res, opaque, trailers, abort } = this

        this.res = null
        if (err || !res.readable) {
          util.destroy(res, err)
        }

        this.callback = null
        this.runInAsyncScope(callback, null, err || null, { opaque, trailers })

        if (err) {
          abort()
        }
      })
    }

    res.on('drain', resume)

    this.res = res

    const needDrain = res.writableNeedDrain !== undefined
      ? res.writableNeedDrain
      : res._writableState && res._writableState.needDrain

    return needDrain !== true
  }

  onData (chunk) {
    const { res } = this

    return res ? res.write(chunk) : true
  }

  onComplete (trailers) {
    const { res } = this

    removeSignal(this)

    if (!res) {
      return
    }

    this.trailers = util.parseHeaders(trailers)

    res.end()
  }

  onError (err) {
    const { res, callback, opaque, body } = this

    removeSignal(this)

    this.factory = null

    if (res) {
      this.res = null
      util.destroy(res, err)
    } else if (callback) {
      this.callback = null
      queueMicrotask(() => {
        this.runInAsyncScope(callback, null, err, { opaque })
      })
    }

    if (body) {
      this.body = null
      util.destroy(body, err)
    }
  }
}

function stream (opts, factory, callback) {
  if (callback === undefined) {
    return new Promise((resolve, reject) => {
      stream.call(this, opts, factory, (err, data) => {
        return err ? reject(err) : resolve(data)
      })
    })
  }

  try {
    this.dispatch(opts, new StreamHandler(opts, factory, callback))
  } catch (err) {
    if (typeof callback !== 'function') {
      throw err
    }
    const opaque = opts && opts.opaque
    queueMicrotask(() => callback(err, { opaque }))
  }
}

module.exports = stream


/***/ }),

/***/ 6923:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { InvalidArgumentError, RequestAbortedError, SocketError } = __nccwpck_require__(8045)
const { AsyncResource } = __nccwpck_require__(852)
const util = __nccwpck_require__(3983)
const { addSignal, removeSignal } = __nccwpck_require__(7032)
const assert = __nccwpck_require__(9491)

class UpgradeHandler extends AsyncResource {
  constructor (opts, callback) {
    if (!opts || typeof opts !== 'object') {
      throw new InvalidArgumentError('invalid opts')
    }

    if (typeof callback !== 'function') {
      throw new InvalidArgumentError('invalid callback')
    }

    const { signal, opaque, responseHeaders } = opts

    if (signal && typeof signal.on !== 'function' && typeof signal.addEventListener !== 'function') {
      throw new InvalidArgumentError('signal must be an EventEmitter or EventTarget')
    }

    super('UNDICI_UPGRADE')

    this.responseHeaders = responseHeaders || null
    this.opaque = opaque || null
    this.callback = callback
    this.abort = null
    this.context = null

    addSignal(this, signal)
  }

  onConnect (abort, context) {
    if (!this.callback) {
      throw new RequestAbortedError()
    }

    this.abort = abort
    this.context = null
  }

  onHeaders () {
    throw new SocketError('bad upgrade', null)
  }

  onUpgrade (statusCode, rawHeaders, socket) {
    const { callback, opaque, context } = this

    assert.strictEqual(statusCode, 101)

    removeSignal(this)

    this.callback = null
    const headers = this.responseHeaders === 'raw' ? util.parseRawHeaders(rawHeaders) : util.parseHeaders(rawHeaders)
    this.runInAsyncScope(callback, null, null, {
      headers,
      socket,
      opaque,
      context
    })
  }

  onError (err) {
    const { callback, opaque } = this

    removeSignal(this)

    if (callback) {
      this.callback = null
      queueMicrotask(() => {
        this.runInAsyncScope(callback, null, err, { opaque })
      })
    }
  }
}

function upgrade (opts, callback) {
  if (callback === undefined) {
    return new Promise((resolve, reject) => {
      upgrade.call(this, opts, (err, data) => {
        return err ? reject(err) : resolve(data)
      })
    })
  }

  try {
    const upgradeHandler = new UpgradeHandler(opts, callback)
    this.dispatch({
      ...opts,
      method: opts.method || 'GET',
      upgrade: opts.protocol || 'Websocket'
    }, upgradeHandler)
  } catch (err) {
    if (typeof callback !== 'function') {
      throw err
    }
    const opaque = opts && opts.opaque
    queueMicrotask(() => callback(err, { opaque }))
  }
}

module.exports = upgrade


/***/ }),

/***/ 4059:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports.request = __nccwpck_require__(5448)
module.exports.stream = __nccwpck_require__(5395)
module.exports.pipeline = __nccwpck_require__(8752)
module.exports.upgrade = __nccwpck_require__(6923)
module.exports.connect = __nccwpck_require__(9744)


/***/ }),

/***/ 3858:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Ported from https://github.com/nodejs/undici/pull/907



const assert = __nccwpck_require__(9491)
const { Readable } = __nccwpck_require__(2781)
const { RequestAbortedError, NotSupportedError, InvalidArgumentError } = __nccwpck_require__(8045)
const util = __nccwpck_require__(3983)
const { ReadableStreamFrom, toUSVString } = __nccwpck_require__(3983)

let Blob

const kConsume = Symbol('kConsume')
const kReading = Symbol('kReading')
const kBody = Symbol('kBody')
const kAbort = Symbol('abort')
const kContentType = Symbol('kContentType')

const noop = () => {}

module.exports = class BodyReadable extends Readable {
  constructor ({
    resume,
    abort,
    contentType = '',
    highWaterMark = 64 * 1024 // Same as nodejs fs streams.
  }) {
    super({
      autoDestroy: true,
      read: resume,
      highWaterMark
    })

    this._readableState.dataEmitted = false

    this[kAbort] = abort
    this[kConsume] = null
    this[kBody] = null
    this[kContentType] = contentType

    // Is stream being consumed through Readable API?
    // This is an optimization so that we avoid checking
    // for 'data' and 'readable' listeners in the hot path
    // inside push().
    this[kReading] = false
  }

  destroy (err) {
    if (this.destroyed) {
      // Node < 16
      return this
    }

    if (!err && !this._readableState.endEmitted) {
      err = new RequestAbortedError()
    }

    if (err) {
      this[kAbort]()
    }

    return super.destroy(err)
  }

  emit (ev, ...args) {
    if (ev === 'data') {
      // Node < 16.7
      this._readableState.dataEmitted = true
    } else if (ev === 'error') {
      // Node < 16
      this._readableState.errorEmitted = true
    }
    return super.emit(ev, ...args)
  }

  on (ev, ...args) {
    if (ev === 'data' || ev === 'readable') {
      this[kReading] = true
    }
    return super.on(ev, ...args)
  }

  addListener (ev, ...args) {
    return this.on(ev, ...args)
  }

  off (ev, ...args) {
    const ret = super.off(ev, ...args)
    if (ev === 'data' || ev === 'readable') {
      this[kReading] = (
        this.listenerCount('data') > 0 ||
        this.listenerCount('readable') > 0
      )
    }
    return ret
  }

  removeListener (ev, ...args) {
    return this.off(ev, ...args)
  }

  push (chunk) {
    if (this[kConsume] && chunk !== null && this.readableLength === 0) {
      consumePush(this[kConsume], chunk)
      return this[kReading] ? super.push(chunk) : true
    }
    return super.push(chunk)
  }

  // https://fetch.spec.whatwg.org/#dom-body-text
  async text () {
    return consume(this, 'text')
  }

  // https://fetch.spec.whatwg.org/#dom-body-json
  async json () {
    return consume(this, 'json')
  }

  // https://fetch.spec.whatwg.org/#dom-body-blob
  async blob () {
    return consume(this, 'blob')
  }

  // https://fetch.spec.whatwg.org/#dom-body-arraybuffer
  async arrayBuffer () {
    return consume(this, 'arrayBuffer')
  }

  // https://fetch.spec.whatwg.org/#dom-body-formdata
  async formData () {
    // TODO: Implement.
    throw new NotSupportedError()
  }

  // https://fetch.spec.whatwg.org/#dom-body-bodyused
  get bodyUsed () {
    return util.isDisturbed(this)
  }

  // https://fetch.spec.whatwg.org/#dom-body-body
  get body () {
    if (!this[kBody]) {
      this[kBody] = ReadableStreamFrom(this)
      if (this[kConsume]) {
        // TODO: Is this the best way to force a lock?
        this[kBody].getReader() // Ensure stream is locked.
        assert(this[kBody].locked)
      }
    }
    return this[kBody]
  }

  dump (opts) {
    let limit = opts && Number.isFinite(opts.limit) ? opts.limit : 262144
    const signal = opts && opts.signal

    if (signal) {
      try {
        if (typeof signal !== 'object' || !('aborted' in signal)) {
          throw new InvalidArgumentError('signal must be an AbortSignal')
        }
        util.throwIfAborted(signal)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    if (this.closed) {
      return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
      const signalListenerCleanup = signal
        ? util.addAbortListener(signal, () => {
          this.destroy()
        })
        : noop

      this
        .on('close', function () {
          signalListenerCleanup()
          if (signal && signal.aborted) {
            reject(signal.reason || Object.assign(new Error('The operation was aborted'), { name: 'AbortError' }))
          } else {
            resolve(null)
          }
        })
        .on('error', noop)
        .on('data', function (chunk) {
          limit -= chunk.length
          if (limit <= 0) {
            this.destroy()
          }
        })
        .resume()
    })
  }
}

// https://streams.spec.whatwg.org/#readablestream-locked
function isLocked (self) {
  // Consume is an implicit lock.
  return (self[kBody] && self[kBody].locked === true) || self[kConsume]
}

// https://fetch.spec.whatwg.org/#body-unusable
function isUnusable (self) {
  return util.isDisturbed(self) || isLocked(self)
}

async function consume (stream, type) {
  if (isUnusable(stream)) {
    throw new TypeError('unusable')
  }

  assert(!stream[kConsume])

  return new Promise((resolve, reject) => {
    stream[kConsume] = {
      type,
      stream,
      resolve,
      reject,
      length: 0,
      body: []
    }

    stream
      .on('error', function (err) {
        consumeFinish(this[kConsume], err)
      })
      .on('close', function () {
        if (this[kConsume].body !== null) {
          consumeFinish(this[kConsume], new RequestAbortedError())
        }
      })

    process.nextTick(consumeStart, stream[kConsume])
  })
}

function consumeStart (consume) {
  if (consume.body === null) {
    return
  }

  const { _readableState: state } = consume.stream

  for (const chunk of state.buffer) {
    consumePush(consume, chunk)
  }

  if (state.endEmitted) {
    consumeEnd(this[kConsume])
  } else {
    consume.stream.on('end', function () {
      consumeEnd(this[kConsume])
    })
  }

  consume.stream.resume()

  while (consume.stream.read() != null) {
    // Loop
  }
}

function consumeEnd (consume) {
  const { type, body, resolve, stream, length } = consume

  try {
    if (type === 'text') {
      resolve(toUSVString(Buffer.concat(body)))
    } else if (type === 'json') {
      resolve(JSON.parse(Buffer.concat(body)))
    } else if (type === 'arrayBuffer') {
      const dst = new Uint8Array(length)

      let pos = 0
      for (const buf of body) {
        dst.set(buf, pos)
        pos += buf.byteLength
      }

      resolve(dst.buffer)
    } else if (type === 'blob') {
      if (!Blob) {
        Blob = (__nccwpck_require__(4300).Blob)
      }
      resolve(new Blob(body, { type: stream[kContentType] }))
    }

    consumeFinish(consume)
  } catch (err) {
    stream.destroy(err)
  }
}

function consumePush (consume, chunk) {
  consume.length += chunk.length
  consume.body.push(chunk)
}

function consumeFinish (consume, err) {
  if (consume.body === null) {
    return
  }

  if (err) {
    consume.reject(err)
  } else {
    consume.resolve()
  }

  consume.type = null
  consume.stream = null
  consume.resolve = null
  consume.reject = null
  consume.length = 0
  consume.body = null
}


/***/ }),

/***/ 7474:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const assert = __nccwpck_require__(9491)
const {
  ResponseStatusCodeError
} = __nccwpck_require__(8045)
const { toUSVString } = __nccwpck_require__(3983)

async function getResolveErrorBodyCallback ({ callback, body, contentType, statusCode, statusMessage, headers }) {
  assert(body)

  let chunks = []
  let limit = 0

  for await (const chunk of body) {
    chunks.push(chunk)
    limit += chunk.length
    if (limit > 128 * 1024) {
      chunks = null
      break
    }
  }

  if (statusCode === 204 || !contentType || !chunks) {
    process.nextTick(callback, new ResponseStatusCodeError(`Response status code ${statusCode}${statusMessage ? `: ${statusMessage}` : ''}`, statusCode, headers))
    return
  }

  try {
    if (contentType.startsWith('application/json')) {
      const payload = JSON.parse(toUSVString(Buffer.concat(chunks)))
      process.nextTick(callback, new ResponseStatusCodeError(`Response status code ${statusCode}${statusMessage ? `: ${statusMessage}` : ''}`, statusCode, headers, payload))
      return
    }

    if (contentType.startsWith('text/')) {
      const payload = toUSVString(Buffer.concat(chunks))
      process.nextTick(callback, new ResponseStatusCodeError(`Response status code ${statusCode}${statusMessage ? `: ${statusMessage}` : ''}`, statusCode, headers, payload))
      return
    }
  } catch (err) {
    // Process in a fallback if error
  }

  process.nextTick(callback, new ResponseStatusCodeError(`Response status code ${statusCode}${statusMessage ? `: ${statusMessage}` : ''}`, statusCode, headers))
}

module.exports = { getResolveErrorBodyCallback }


/***/ }),

/***/ 7931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  BalancedPoolMissingUpstreamError,
  InvalidArgumentError
} = __nccwpck_require__(8045)
const {
  PoolBase,
  kClients,
  kNeedDrain,
  kAddClient,
  kRemoveClient,
  kGetDispatcher
} = __nccwpck_require__(3198)
const Pool = __nccwpck_require__(4634)
const { kUrl, kInterceptors } = __nccwpck_require__(2785)
const { parseOrigin } = __nccwpck_require__(3983)
const kFactory = Symbol('factory')

const kOptions = Symbol('options')
const kGreatestCommonDivisor = Symbol('kGreatestCommonDivisor')
const kCurrentWeight = Symbol('kCurrentWeight')
const kIndex = Symbol('kIndex')
const kWeight = Symbol('kWeight')
const kMaxWeightPerServer = Symbol('kMaxWeightPerServer')
const kErrorPenalty = Symbol('kErrorPenalty')

function getGreatestCommonDivisor (a, b) {
  if (b === 0) return a
  return getGreatestCommonDivisor(b, a % b)
}

function defaultFactory (origin, opts) {
  return new Pool(origin, opts)
}

class BalancedPool extends PoolBase {
  constructor (upstreams = [], { factory = defaultFactory, ...opts } = {}) {
    super()

    this[kOptions] = opts
    this[kIndex] = -1
    this[kCurrentWeight] = 0

    this[kMaxWeightPerServer] = this[kOptions].maxWeightPerServer || 100
    this[kErrorPenalty] = this[kOptions].errorPenalty || 15

    if (!Array.isArray(upstreams)) {
      upstreams = [upstreams]
    }

    if (typeof factory !== 'function') {
      throw new InvalidArgumentError('factory must be a function.')
    }

    this[kInterceptors] = opts.interceptors && opts.interceptors.BalancedPool && Array.isArray(opts.interceptors.BalancedPool)
      ? opts.interceptors.BalancedPool
      : []
    this[kFactory] = factory

    for (const upstream of upstreams) {
      this.addUpstream(upstream)
    }
    this._updateBalancedPoolStats()
  }

  addUpstream (upstream) {
    const upstreamOrigin = parseOrigin(upstream).origin

    if (this[kClients].find((pool) => (
      pool[kUrl].origin === upstreamOrigin &&
      pool.closed !== true &&
      pool.destroyed !== true
    ))) {
      return this
    }
    const pool = this[kFactory](upstreamOrigin, Object.assign({}, this[kOptions]))

    this[kAddClient](pool)
    pool.on('connect', () => {
      pool[kWeight] = Math.min(this[kMaxWeightPerServer], pool[kWeight] + this[kErrorPenalty])
    })

    pool.on('connectionError', () => {
      pool[kWeight] = Math.max(1, pool[kWeight] - this[kErrorPenalty])
      this._updateBalancedPoolStats()
    })

    pool.on('disconnect', (...args) => {
      const err = args[2]
      if (err && err.code === 'UND_ERR_SOCKET') {
        // decrease the weight of the pool.
        pool[kWeight] = Math.max(1, pool[kWeight] - this[kErrorPenalty])
        this._updateBalancedPoolStats()
      }
    })

    for (const client of this[kClients]) {
      client[kWeight] = this[kMaxWeightPerServer]
    }

    this._updateBalancedPoolStats()

    return this
  }

  _updateBalancedPoolStats () {
    this[kGreatestCommonDivisor] = this[kClients].map(p => p[kWeight]).reduce(getGreatestCommonDivisor, 0)
  }

  removeUpstream (upstream) {
    const upstreamOrigin = parseOrigin(upstream).origin

    const pool = this[kClients].find((pool) => (
      pool[kUrl].origin === upstreamOrigin &&
      pool.closed !== true &&
      pool.destroyed !== true
    ))

    if (pool) {
      this[kRemoveClient](pool)
    }

    return this
  }

  get upstreams () {
    return this[kClients]
      .filter(dispatcher => dispatcher.closed !== true && dispatcher.destroyed !== true)
      .map((p) => p[kUrl].origin)
  }

  [kGetDispatcher] () {
    // We validate that pools is greater than 0,
    // otherwise we would have to wait until an upstream
    // is added, which might never happen.
    if (this[kClients].length === 0) {
      throw new BalancedPoolMissingUpstreamError()
    }

    const dispatcher = this[kClients].find(dispatcher => (
      !dispatcher[kNeedDrain] &&
      dispatcher.closed !== true &&
      dispatcher.destroyed !== true
    ))

    if (!dispatcher) {
      return
    }

    const allClientsBusy = this[kClients].map(pool => pool[kNeedDrain]).reduce((a, b) => a && b, true)

    if (allClientsBusy) {
      return
    }

    let counter = 0

    let maxWeightIndex = this[kClients].findIndex(pool => !pool[kNeedDrain])

    while (counter++ < this[kClients].length) {
      this[kIndex] = (this[kIndex] + 1) % this[kClients].length
      const pool = this[kClients][this[kIndex]]

      // find pool index with the largest weight
      if (pool[kWeight] > this[kClients][maxWeightIndex][kWeight] && !pool[kNeedDrain]) {
        maxWeightIndex = this[kIndex]
      }

      // decrease the current weight every `this[kClients].length`.
      if (this[kIndex] === 0) {
        // Set the current weight to the next lower weight.
        this[kCurrentWeight] = this[kCurrentWeight] - this[kGreatestCommonDivisor]

        if (this[kCurrentWeight] <= 0) {
          this[kCurrentWeight] = this[kMaxWeightPerServer]
        }
      }
      if (pool[kWeight] >= this[kCurrentWeight] && (!pool[kNeedDrain])) {
        return pool
      }
    }

    this[kCurrentWeight] = this[kClients][maxWeightIndex][kWeight]
    this[kIndex] = maxWeightIndex
    return this[kClients][maxWeightIndex]
  }
}

module.exports = BalancedPool


/***/ }),

/***/ 6101:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { kConstruct } = __nccwpck_require__(9174)
const { urlEquals, fieldValues: getFieldValues } = __nccwpck_require__(2396)
const { kEnumerableProperty, isDisturbed } = __nccwpck_require__(3983)
const { kHeadersList } = __nccwpck_require__(2785)
const { webidl } = __nccwpck_require__(1744)
const { Response, cloneResponse } = __nccwpck_require__(7823)
const { Request } = __nccwpck_require__(8359)
const { kState, kHeaders, kGuard, kRealm } = __nccwpck_require__(5861)
const { fetching } = __nccwpck_require__(4881)
const { urlIsHttpHttpsScheme, createDeferredPromise, readAllBytes } = __nccwpck_require__(2538)
const assert = __nccwpck_require__(9491)
const { getGlobalDispatcher } = __nccwpck_require__(1892)

/**
 * @see https://w3c.github.io/ServiceWorker/#dfn-cache-batch-operation
 * @typedef {Object} CacheBatchOperation
 * @property {'delete' | 'put'} type
 * @property {any} request
 * @property {any} response
 * @property {import('../../types/cache').CacheQueryOptions} options
 */

/**
 * @see https://w3c.github.io/ServiceWorker/#dfn-request-response-list
 * @typedef {[any, any][]} requestResponseList
 */

class Cache {
  /**
   * @see https://w3c.github.io/ServiceWorker/#dfn-relevant-request-response-list
   * @type {requestResponseList}
   */
  #relevantRequestResponseList

  constructor () {
    if (arguments[0] !== kConstruct) {
      webidl.illegalConstructor()
    }

    this.#relevantRequestResponseList = arguments[1]
  }

  async match (request, options = {}) {
    webidl.brandCheck(this, Cache)
    webidl.argumentLengthCheck(arguments, 1, { header: 'Cache.match' })

    request = webidl.converters.RequestInfo(request)
    options = webidl.converters.CacheQueryOptions(options)

    const p = await this.matchAll(request, options)

    if (p.length === 0) {
      return
    }

    return p[0]
  }

  async matchAll (request = undefined, options = {}) {
    webidl.brandCheck(this, Cache)

    if (request !== undefined) request = webidl.converters.RequestInfo(request)
    options = webidl.converters.CacheQueryOptions(options)

    // 1.
    let r = null

    // 2.
    if (request !== undefined) {
      if (request instanceof Request) {
        // 2.1.1
        r = request[kState]

        // 2.1.2
        if (r.method !== 'GET' && !options.ignoreMethod) {
          return []
        }
      } else if (typeof request === 'string') {
        // 2.2.1
        r = new Request(request)[kState]
      }
    }

    // 5.
    // 5.1
    const responses = []

    // 5.2
    if (request === undefined) {
      // 5.2.1
      for (const requestResponse of this.#relevantRequestResponseList) {
        responses.push(requestResponse[1])
      }
    } else { // 5.3
      // 5.3.1
      const requestResponses = this.#queryCache(r, options)

      // 5.3.2
      for (const requestResponse of requestResponses) {
        responses.push(requestResponse[1])
      }
    }

    // 5.4
    // We don't implement CORs so we don't need to loop over the responses, yay!

    // 5.5.1
    const responseList = []

    // 5.5.2
    for (const response of responses) {
      // 5.5.2.1
      const responseObject = new Response(response.body?.source ?? null)
      const body = responseObject[kState].body
      responseObject[kState] = response
      responseObject[kState].body = body
      responseObject[kHeaders][kHeadersList] = response.headersList
      responseObject[kHeaders][kGuard] = 'immutable'

      responseList.push(responseObject)
    }

    // 6.
    return Object.freeze(responseList)
  }

  async add (request) {
    webidl.brandCheck(this, Cache)
    webidl.argumentLengthCheck(arguments, 1, { header: 'Cache.add' })

    request = webidl.converters.RequestInfo(request)

    // 1.
    const requests = [request]

    // 2.
    const responseArrayPromise = this.addAll(requests)

    // 3.
    return await responseArrayPromise
  }

  async addAll (requests) {
    webidl.brandCheck(this, Cache)
    webidl.argumentLengthCheck(arguments, 1, { header: 'Cache.addAll' })

    requests = webidl.converters['sequence<RequestInfo>'](requests)

    // 1.
    const responsePromises = []

    // 2.
    const requestList = []

    // 3.
    for (const request of requests) {
      if (typeof request === 'string') {
        continue
      }

      // 3.1
      const r = request[kState]

      // 3.2
      if (!urlIsHttpHttpsScheme(r.url) || r.method !== 'GET') {
        throw webidl.errors.exception({
          header: 'Cache.addAll',
          message: 'Expected http/s scheme when method is not GET.'
        })
      }
    }

    // 4.
    /** @type {ReturnType<typeof fetching>[]} */
    const fetchControllers = []

    // 5.
    for (const request of requests) {
      // 5.1
      const r = new Request(request)[kState]

      // 5.2
      if (!urlIsHttpHttpsScheme(r.url)) {
        throw webidl.errors.exception({
          header: 'Cache.addAll',
          message: 'Expected http/s scheme.'
        })
      }

      // 5.4
      r.initiator = 'fetch'
      r.destination = 'subresource'

      // 5.5
      requestList.push(r)

      // 5.6
      const responsePromise = createDeferredPromise()

      // 5.7
      fetchControllers.push(fetching({
        request: r,
        dispatcher: getGlobalDispatcher(),
        processResponse (response) {
          // 1.
          if (response.type === 'error' || response.status === 206 || response.status < 200 || response.status > 299) {
            responsePromise.reject(webidl.errors.exception({
              header: 'Cache.addAll',
              message: 'Received an invalid status code or the request failed.'
            }))
          } else if (response.headersList.contains('vary')) { // 2.
            // 2.1
            const fieldValues = getFieldValues(response.headersList.get('vary'))

            // 2.2
            for (const fieldValue of fieldValues) {
              // 2.2.1
              if (fieldValue === '*') {
                responsePromise.reject(webidl.errors.exception({
                  header: 'Cache.addAll',
                  message: 'invalid vary field value'
                }))

                for (const controller of fetchControllers) {
                  controller.abort()
                }

                return
              }
            }
          }
        },
        processResponseEndOfBody (response) {
          // 1.
          if (response.aborted) {
            responsePromise.reject(new DOMException('aborted', 'AbortError'))
            return
          }

          // 2.
          responsePromise.resolve(response)
        }
      }))

      // 5.8
      responsePromises.push(responsePromise.promise)
    }

    // 6.
    const p = Promise.all(responsePromises)

    // 7.
    const responses = await p

    // 7.1
    const operations = []

    // 7.2
    let index = 0

    // 7.3
    for (const response of responses) {
      // 7.3.1
      /** @type {CacheBatchOperation} */
      const operation = {
        type: 'put', // 7.3.2
        request: requestList[index], // 7.3.3
        response // 7.3.4
      }

      operations.push(operation) // 7.3.5

      index++ // 7.3.6
    }

    // 7.5
    const cacheJobPromise = createDeferredPromise()

    // 7.6.1
    let errorData = null

    // 7.6.2
    try {
      this.#batchCacheOperations(operations)
    } catch (e) {
      errorData = e
    }

    // 7.6.3
    queueMicrotask(() => {
      // 7.6.3.1
      if (errorData === null) {
        cacheJobPromise.resolve(undefined)
      } else {
        // 7.6.3.2
        cacheJobPromise.reject(errorData)
      }
    })

    // 7.7
    return cacheJobPromise.promise
  }

  async put (request, response) {
    webidl.brandCheck(this, Cache)
    webidl.argumentLengthCheck(arguments, 2, { header: 'Cache.put' })

    request = webidl.converters.RequestInfo(request)
    response = webidl.converters.Response(response)

    // 1.
    let innerRequest = null

    // 2.
    if (request instanceof Request) {
      innerRequest = request[kState]
    } else { // 3.
      innerRequest = new Request(request)[kState]
    }

    // 4.
    if (!urlIsHttpHttpsScheme(innerRequest.url) || innerRequest.method !== 'GET') {
      throw webidl.errors.exception({
        header: 'Cache.put',
        message: 'Expected an http/s scheme when method is not GET'
      })
    }

    // 5.
    const innerResponse = response[kState]

    // 6.
    if (innerResponse.status === 206) {
      throw webidl.errors.exception({
        header: 'Cache.put',
        message: 'Got 206 status'
      })
    }

    // 7.
    if (innerResponse.headersList.contains('vary')) {
      // 7.1.
      const fieldValues = getFieldValues(innerResponse.headersList.get('vary'))

      // 7.2.
      for (const fieldValue of fieldValues) {
        // 7.2.1
        if (fieldValue === '*') {
          throw webidl.errors.exception({
            header: 'Cache.put',
            message: 'Got * vary field value'
          })
        }
      }
    }

    // 8.
    if (innerResponse.body && (isDisturbed(innerResponse.body.stream) || innerResponse.body.stream.locked)) {
      throw webidl.errors.exception({
        header: 'Cache.put',
        message: 'Response body is locked or disturbed'
      })
    }

    // 9.
    const clonedResponse = cloneResponse(innerResponse)

    // 10.
    const bodyReadPromise = createDeferredPromise()

    // 11.
    if (innerResponse.body != null) {
      // 11.1
      const stream = innerResponse.body.stream

      // 11.2
      const reader = stream.getReader()

      // 11.3
      readAllBytes(reader).then(bodyReadPromise.resolve, bodyReadPromise.reject)
    } else {
      bodyReadPromise.resolve(undefined)
    }

    // 12.
    /** @type {CacheBatchOperation[]} */
    const operations = []

    // 13.
    /** @type {CacheBatchOperation} */
    const operation = {
      type: 'put', // 14.
      request: innerRequest, // 15.
      response: clonedResponse // 16.
    }

    // 17.
    operations.push(operation)

    // 19.
    const bytes = await bodyReadPromise.promise

    if (clonedResponse.body != null) {
      clonedResponse.body.source = bytes
    }

    // 19.1
    const cacheJobPromise = createDeferredPromise()

    // 19.2.1
    let errorData = null

    // 19.2.2
    try {
      this.#batchCacheOperations(operations)
    } catch (e) {
      errorData = e
    }

    // 19.2.3
    queueMicrotask(() => {
      // 19.2.3.1
      if (errorData === null) {
        cacheJobPromise.resolve()
      } else { // 19.2.3.2
        cacheJobPromise.reject(errorData)
      }
    })

    return cacheJobPromise.promise
  }

  async delete (request, options = {}) {
    webidl.brandCheck(this, Cache)
    webidl.argumentLengthCheck(arguments, 1, { header: 'Cache.delete' })

    request = webidl.converters.RequestInfo(request)
    options = webidl.converters.CacheQueryOptions(options)

    /**
     * @type {Request}
     */
    let r = null

    if (request instanceof Request) {
      r = request[kState]

      if (r.method !== 'GET' && !options.ignoreMethod) {
        return false
      }
    } else {
      assert(typeof request === 'string')

      r = new Request(request)[kState]
    }

    /** @type {CacheBatchOperation[]} */
    const operations = []

    /** @type {CacheBatchOperation} */
    const operation = {
      type: 'delete',
      request: r,
      options
    }

    operations.push(operation)

    const cacheJobPromise = createDeferredPromise()

    let errorData = null
    let requestResponses

    try {
      requestResponses = this.#batchCacheOperations(operations)
    } catch (e) {
      errorData = e
    }

    queueMicrotask(() => {
      if (errorData === null) {
        cacheJobPromise.resolve(!!requestResponses?.length)
      } else {
        cacheJobPromise.reject(errorData)
      }
    })

    return cacheJobPromise.promise
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#dom-cache-keys
   * @param {any} request
   * @param {import('../../types/cache').CacheQueryOptions} options
   * @returns {readonly Request[]}
   */
  async keys (request = undefined, options = {}) {
    webidl.brandCheck(this, Cache)

    if (request !== undefined) request = webidl.converters.RequestInfo(request)
    options = webidl.converters.CacheQueryOptions(options)

    // 1.
    let r = null

    // 2.
    if (request !== undefined) {
      // 2.1
      if (request instanceof Request) {
        // 2.1.1
        r = request[kState]

        // 2.1.2
        if (r.method !== 'GET' && !options.ignoreMethod) {
          return []
        }
      } else if (typeof request === 'string') { // 2.2
        r = new Request(request)[kState]
      }
    }

    // 4.
    const promise = createDeferredPromise()

    // 5.
    // 5.1
    const requests = []

    // 5.2
    if (request === undefined) {
      // 5.2.1
      for (const requestResponse of this.#relevantRequestResponseList) {
        // 5.2.1.1
        requests.push(requestResponse[0])
      }
    } else { // 5.3
      // 5.3.1
      const requestResponses = this.#queryCache(r, options)

      // 5.3.2
      for (const requestResponse of requestResponses) {
        // 5.3.2.1
        requests.push(requestResponse[0])
      }
    }

    // 5.4
    queueMicrotask(() => {
      // 5.4.1
      const requestList = []

      // 5.4.2
      for (const request of requests) {
        const requestObject = new Request('https://a')
        requestObject[kState] = request
        requestObject[kHeaders][kHeadersList] = request.headersList
        requestObject[kHeaders][kGuard] = 'immutable'
        requestObject[kRealm] = request.client

        // 5.4.2.1
        requestList.push(requestObject)
      }

      // 5.4.3
      promise.resolve(Object.freeze(requestList))
    })

    return promise.promise
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#batch-cache-operations-algorithm
   * @param {CacheBatchOperation[]} operations
   * @returns {requestResponseList}
   */
  #batchCacheOperations (operations) {
    // 1.
    const cache = this.#relevantRequestResponseList

    // 2.
    const backupCache = [...cache]

    // 3.
    const addedItems = []

    // 4.1
    const resultList = []

    try {
      // 4.2
      for (const operation of operations) {
        // 4.2.1
        if (operation.type !== 'delete' && operation.type !== 'put') {
          throw webidl.errors.exception({
            header: 'Cache.#batchCacheOperations',
            message: 'operation type does not match "delete" or "put"'
          })
        }

        // 4.2.2
        if (operation.type === 'delete' && operation.response != null) {
          throw webidl.errors.exception({
            header: 'Cache.#batchCacheOperations',
            message: 'delete operation should not have an associated response'
          })
        }

        // 4.2.3
        if (this.#queryCache(operation.request, operation.options, addedItems).length) {
          throw new DOMException('???', 'InvalidStateError')
        }

        // 4.2.4
        let requestResponses

        // 4.2.5
        if (operation.type === 'delete') {
          // 4.2.5.1
          requestResponses = this.#queryCache(operation.request, operation.options)

          // TODO: the spec is wrong, this is needed to pass WPTs
          if (requestResponses.length === 0) {
            return []
          }

          // 4.2.5.2
          for (const requestResponse of requestResponses) {
            const idx = cache.indexOf(requestResponse)
            assert(idx !== -1)

            // 4.2.5.2.1
            cache.splice(idx, 1)
          }
        } else if (operation.type === 'put') { // 4.2.6
          // 4.2.6.1
          if (operation.response == null) {
            throw webidl.errors.exception({
              header: 'Cache.#batchCacheOperations',
              message: 'put operation should have an associated response'
            })
          }

          // 4.2.6.2
          const r = operation.request

          // 4.2.6.3
          if (!urlIsHttpHttpsScheme(r.url)) {
            throw webidl.errors.exception({
              header: 'Cache.#batchCacheOperations',
              message: 'expected http or https scheme'
            })
          }

          // 4.2.6.4
          if (r.method !== 'GET') {
            throw webidl.errors.exception({
              header: 'Cache.#batchCacheOperations',
              message: 'not get method'
            })
          }

          // 4.2.6.5
          if (operation.options != null) {
            throw webidl.errors.exception({
              header: 'Cache.#batchCacheOperations',
              message: 'options must not be defined'
            })
          }

          // 4.2.6.6
          requestResponses = this.#queryCache(operation.request)

          // 4.2.6.7
          for (const requestResponse of requestResponses) {
            const idx = cache.indexOf(requestResponse)
            assert(idx !== -1)

            // 4.2.6.7.1
            cache.splice(idx, 1)
          }

          // 4.2.6.8
          cache.push([operation.request, operation.response])

          // 4.2.6.10
          addedItems.push([operation.request, operation.response])
        }

        // 4.2.7
        resultList.push([operation.request, operation.response])
      }

      // 4.3
      return resultList
    } catch (e) { // 5.
      // 5.1
      this.#relevantRequestResponseList.length = 0

      // 5.2
      this.#relevantRequestResponseList = backupCache

      // 5.3
      throw e
    }
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#query-cache
   * @param {any} requestQuery
   * @param {import('../../types/cache').CacheQueryOptions} options
   * @param {requestResponseList} targetStorage
   * @returns {requestResponseList}
   */
  #queryCache (requestQuery, options, targetStorage) {
    /** @type {requestResponseList} */
    const resultList = []

    const storage = targetStorage ?? this.#relevantRequestResponseList

    for (const requestResponse of storage) {
      const [cachedRequest, cachedResponse] = requestResponse
      if (this.#requestMatchesCachedItem(requestQuery, cachedRequest, cachedResponse, options)) {
        resultList.push(requestResponse)
      }
    }

    return resultList
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#request-matches-cached-item-algorithm
   * @param {any} requestQuery
   * @param {any} request
   * @param {any | null} response
   * @param {import('../../types/cache').CacheQueryOptions | undefined} options
   * @returns {boolean}
   */
  #requestMatchesCachedItem (requestQuery, request, response = null, options) {
    // if (options?.ignoreMethod === false && request.method === 'GET') {
    //   return false
    // }

    const queryURL = new URL(requestQuery.url)

    const cachedURL = new URL(request.url)

    if (options?.ignoreSearch) {
      cachedURL.search = ''

      queryURL.search = ''
    }

    if (!urlEquals(queryURL, cachedURL, true)) {
      return false
    }

    if (
      response == null ||
      options?.ignoreVary ||
      !response.headersList.contains('vary')
    ) {
      return true
    }

    const fieldValues = getFieldValues(response.headersList.get('vary'))

    for (const fieldValue of fieldValues) {
      if (fieldValue === '*') {
        return false
      }

      const requestValue = request.headersList.get(fieldValue)
      const queryValue = requestQuery.headersList.get(fieldValue)

      // If one has the header and the other doesn't, or one has
      // a different value than the other, return false
      if (requestValue !== queryValue) {
        return false
      }
    }

    return true
  }
}

Object.defineProperties(Cache.prototype, {
  [Symbol.toStringTag]: {
    value: 'Cache',
    configurable: true
  },
  match: kEnumerableProperty,
  matchAll: kEnumerableProperty,
  add: kEnumerableProperty,
  addAll: kEnumerableProperty,
  put: kEnumerableProperty,
  delete: kEnumerableProperty,
  keys: kEnumerableProperty
})

const cacheQueryOptionConverters = [
  {
    key: 'ignoreSearch',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'ignoreMethod',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'ignoreVary',
    converter: webidl.converters.boolean,
    defaultValue: false
  }
]

webidl.converters.CacheQueryOptions = webidl.dictionaryConverter(cacheQueryOptionConverters)

webidl.converters.MultiCacheQueryOptions = webidl.dictionaryConverter([
  ...cacheQueryOptionConverters,
  {
    key: 'cacheName',
    converter: webidl.converters.DOMString
  }
])

webidl.converters.Response = webidl.interfaceConverter(Response)

webidl.converters['sequence<RequestInfo>'] = webidl.sequenceConverter(
  webidl.converters.RequestInfo
)

module.exports = {
  Cache
}


/***/ }),

/***/ 7907:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { kConstruct } = __nccwpck_require__(9174)
const { Cache } = __nccwpck_require__(6101)
const { webidl } = __nccwpck_require__(1744)
const { kEnumerableProperty } = __nccwpck_require__(3983)

class CacheStorage {
  /**
   * @see https://w3c.github.io/ServiceWorker/#dfn-relevant-name-to-cache-map
   * @type {Map<string, import('./cache').requestResponseList}
   */
  #caches = new Map()

  constructor () {
    if (arguments[0] !== kConstruct) {
      webidl.illegalConstructor()
    }
  }

  async match (request, options = {}) {
    webidl.brandCheck(this, CacheStorage)
    webidl.argumentLengthCheck(arguments, 1, { header: 'CacheStorage.match' })

    request = webidl.converters.RequestInfo(request)
    options = webidl.converters.MultiCacheQueryOptions(options)

    // 1.
    if (options.cacheName != null) {
      // 1.1.1.1
      if (this.#caches.has(options.cacheName)) {
        // 1.1.1.1.1
        const cacheList = this.#caches.get(options.cacheName)
        const cache = new Cache(kConstruct, cacheList)

        return await cache.match(request, options)
      }
    } else { // 2.
      // 2.2
      for (const cacheList of this.#caches.values()) {
        const cache = new Cache(kConstruct, cacheList)

        // 2.2.1.2
        const response = await cache.match(request, options)

        if (response !== undefined) {
          return response
        }
      }
    }
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#cache-storage-has
   * @param {string} cacheName
   * @returns {Promise<boolean>}
   */
  async has (cacheName) {
    webidl.brandCheck(this, CacheStorage)
    webidl.argumentLengthCheck(arguments, 1, { header: 'CacheStorage.has' })

    cacheName = webidl.converters.DOMString(cacheName)

    // 2.1.1
    // 2.2
    return this.#caches.has(cacheName)
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#dom-cachestorage-open
   * @param {string} cacheName
   * @returns {Promise<Cache>}
   */
  async open (cacheName) {
    webidl.brandCheck(this, CacheStorage)
    webidl.argumentLengthCheck(arguments, 1, { header: 'CacheStorage.open' })

    cacheName = webidl.converters.DOMString(cacheName)

    // 2.1
    if (this.#caches.has(cacheName)) {
      // await caches.open('v1') !== await caches.open('v1')

      // 2.1.1
      const cache = this.#caches.get(cacheName)

      // 2.1.1.1
      return new Cache(kConstruct, cache)
    }

    // 2.2
    const cache = []

    // 2.3
    this.#caches.set(cacheName, cache)

    // 2.4
    return new Cache(kConstruct, cache)
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#cache-storage-delete
   * @param {string} cacheName
   * @returns {Promise<boolean>}
   */
  async delete (cacheName) {
    webidl.brandCheck(this, CacheStorage)
    webidl.argumentLengthCheck(arguments, 1, { header: 'CacheStorage.delete' })

    cacheName = webidl.converters.DOMString(cacheName)

    return this.#caches.delete(cacheName)
  }

  /**
   * @see https://w3c.github.io/ServiceWorker/#cache-storage-keys
   * @returns {string[]}
   */
  async keys () {
    webidl.brandCheck(this, CacheStorage)

    // 2.1
    const keys = this.#caches.keys()

    // 2.2
    return [...keys]
  }
}

Object.defineProperties(CacheStorage.prototype, {
  [Symbol.toStringTag]: {
    value: 'CacheStorage',
    configurable: true
  },
  match: kEnumerableProperty,
  has: kEnumerableProperty,
  open: kEnumerableProperty,
  delete: kEnumerableProperty,
  keys: kEnumerableProperty
})

module.exports = {
  CacheStorage
}


/***/ }),

/***/ 9174:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  kConstruct: (__nccwpck_require__(2785).kConstruct)
}


/***/ }),

/***/ 2396:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const assert = __nccwpck_require__(9491)
const { URLSerializer } = __nccwpck_require__(685)
const { isValidHeaderName } = __nccwpck_require__(2538)

/**
 * @see https://url.spec.whatwg.org/#concept-url-equals
 * @param {URL} A
 * @param {URL} B
 * @param {boolean | undefined} excludeFragment
 * @returns {boolean}
 */
function urlEquals (A, B, excludeFragment = false) {
  const serializedA = URLSerializer(A, excludeFragment)

  const serializedB = URLSerializer(B, excludeFragment)

  return serializedA === serializedB
}

/**
 * @see https://github.com/chromium/chromium/blob/694d20d134cb553d8d89e5500b9148012b1ba299/content/browser/cache_storage/cache_storage_cache.cc#L260-L262
 * @param {string} header
 */
function fieldValues (header) {
  assert(header !== null)

  const values = []

  for (let value of header.split(',')) {
    value = value.trim()

    if (!value.length) {
      continue
    } else if (!isValidHeaderName(value)) {
      continue
    }

    values.push(value)
  }

  return values
}

module.exports = {
  urlEquals,
  fieldValues
}


/***/ }),

/***/ 3598:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// @ts-check



/* global WebAssembly */

const assert = __nccwpck_require__(9491)
const net = __nccwpck_require__(1808)
const http = __nccwpck_require__(3685)
const { pipeline } = __nccwpck_require__(2781)
const util = __nccwpck_require__(3983)
const timers = __nccwpck_require__(9459)
const Request = __nccwpck_require__(2905)
const DispatcherBase = __nccwpck_require__(4839)
const {
  RequestContentLengthMismatchError,
  ResponseContentLengthMismatchError,
  InvalidArgumentError,
  RequestAbortedError,
  HeadersTimeoutError,
  HeadersOverflowError,
  SocketError,
  InformationalError,
  BodyTimeoutError,
  HTTPParserError,
  ResponseExceededMaxSizeError,
  ClientDestroyedError
} = __nccwpck_require__(8045)
const buildConnector = __nccwpck_require__(2067)
const {
  kUrl,
  kReset,
  kServerName,
  kClient,
  kBusy,
  kParser,
  kConnect,
  kBlocking,
  kResuming,
  kRunning,
  kPending,
  kSize,
  kWriting,
  kQueue,
  kConnected,
  kConnecting,
  kNeedDrain,
  kNoRef,
  kKeepAliveDefaultTimeout,
  kHostHeader,
  kPendingIdx,
  kRunningIdx,
  kError,
  kPipelining,
  kSocket,
  kKeepAliveTimeoutValue,
  kMaxHeadersSize,
  kKeepAliveMaxTimeout,
  kKeepAliveTimeoutThreshold,
  kHeadersTimeout,
  kBodyTimeout,
  kStrictContentLength,
  kConnector,
  kMaxRedirections,
  kMaxRequests,
  kCounter,
  kClose,
  kDestroy,
  kDispatch,
  kInterceptors,
  kLocalAddress,
  kMaxResponseSize,
  kHTTPConnVersion,
  // HTTP2
  kHost,
  kHTTP2Session,
  kHTTP2SessionState,
  kHTTP2BuildRequest,
  kHTTP2CopyHeaders,
  kHTTP1BuildRequest
} = __nccwpck_require__(2785)

/** @type {import('http2')} */
let http2
try {
  http2 = __nccwpck_require__(5158)
} catch {
  // @ts-ignore
  http2 = { constants: {} }
}

const {
  constants: {
    HTTP2_HEADER_AUTHORITY,
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_SCHEME,
    HTTP2_HEADER_CONTENT_LENGTH,
    HTTP2_HEADER_EXPECT,
    HTTP2_HEADER_STATUS
  }
} = http2

// Experimental
let h2ExperimentalWarned = false

const FastBuffer = Buffer[Symbol.species]

const kClosedResolve = Symbol('kClosedResolve')

const channels = {}

try {
  const diagnosticsChannel = __nccwpck_require__(7643)
  channels.sendHeaders = diagnosticsChannel.channel('undici:client:sendHeaders')
  channels.beforeConnect = diagnosticsChannel.channel('undici:client:beforeConnect')
  channels.connectError = diagnosticsChannel.channel('undici:client:connectError')
  channels.connected = diagnosticsChannel.channel('undici:client:connected')
} catch {
  channels.sendHeaders = { hasSubscribers: false }
  channels.beforeConnect = { hasSubscribers: false }
  channels.connectError = { hasSubscribers: false }
  channels.connected = { hasSubscribers: false }
}

/**
 * @type {import('../types/client').default}
 */
class Client extends DispatcherBase {
  /**
   *
   * @param {string|URL} url
   * @param {import('../types/client').Client.Options} options
   */
  constructor (url, {
    interceptors,
    maxHeaderSize,
    headersTimeout,
    socketTimeout,
    requestTimeout,
    connectTimeout,
    bodyTimeout,
    idleTimeout,
    keepAlive,
    keepAliveTimeout,
    maxKeepAliveTimeout,
    keepAliveMaxTimeout,
    keepAliveTimeoutThreshold,
    socketPath,
    pipelining,
    tls,
    strictContentLength,
    maxCachedSessions,
    maxRedirections,
    connect,
    maxRequestsPerClient,
    localAddress,
    maxResponseSize,
    autoSelectFamily,
    autoSelectFamilyAttemptTimeout,
    // h2
    allowH2,
    maxConcurrentStreams
  } = {}) {
    super()

    if (keepAlive !== undefined) {
      throw new InvalidArgumentError('unsupported keepAlive, use pipelining=0 instead')
    }

    if (socketTimeout !== undefined) {
      throw new InvalidArgumentError('unsupported socketTimeout, use headersTimeout & bodyTimeout instead')
    }

    if (requestTimeout !== undefined) {
      throw new InvalidArgumentError('unsupported requestTimeout, use headersTimeout & bodyTimeout instead')
    }

    if (idleTimeout !== undefined) {
      throw new InvalidArgumentError('unsupported idleTimeout, use keepAliveTimeout instead')
    }

    if (maxKeepAliveTimeout !== undefined) {
      throw new InvalidArgumentError('unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead')
    }

    if (maxHeaderSize != null && !Number.isFinite(maxHeaderSize)) {
      throw new InvalidArgumentError('invalid maxHeaderSize')
    }

    if (socketPath != null && typeof socketPath !== 'string') {
      throw new InvalidArgumentError('invalid socketPath')
    }

    if (connectTimeout != null && (!Number.isFinite(connectTimeout) || connectTimeout < 0)) {
      throw new InvalidArgumentError('invalid connectTimeout')
    }

    if (keepAliveTimeout != null && (!Number.isFinite(keepAliveTimeout) || keepAliveTimeout <= 0)) {
      throw new InvalidArgumentError('invalid keepAliveTimeout')
    }

    if (keepAliveMaxTimeout != null && (!Number.isFinite(keepAliveMaxTimeout) || keepAliveMaxTimeout <= 0)) {
      throw new InvalidArgumentError('invalid keepAliveMaxTimeout')
    }

    if (keepAliveTimeoutThreshold != null && !Number.isFinite(keepAliveTimeoutThreshold)) {
      throw new InvalidArgumentError('invalid keepAliveTimeoutThreshold')
    }

    if (headersTimeout != null && (!Number.isInteger(headersTimeout) || headersTimeout < 0)) {
      throw new InvalidArgumentError('headersTimeout must be a positive integer or zero')
    }

    if (bodyTimeout != null && (!Number.isInteger(bodyTimeout) || bodyTimeout < 0)) {
      throw new InvalidArgumentError('bodyTimeout must be a positive integer or zero')
    }

    if (connect != null && typeof connect !== 'function' && typeof connect !== 'object') {
      throw new InvalidArgumentError('connect must be a function or an object')
    }

    if (maxRedirections != null && (!Number.isInteger(maxRedirections) || maxRedirections < 0)) {
      throw new InvalidArgumentError('maxRedirections must be a positive number')
    }

    if (maxRequestsPerClient != null && (!Number.isInteger(maxRequestsPerClient) || maxRequestsPerClient < 0)) {
      throw new InvalidArgumentError('maxRequestsPerClient must be a positive number')
    }

    if (localAddress != null && (typeof localAddress !== 'string' || net.isIP(localAddress) === 0)) {
      throw new InvalidArgumentError('localAddress must be valid string IP address')
    }

    if (maxResponseSize != null && (!Number.isInteger(maxResponseSize) || maxResponseSize < -1)) {
      throw new InvalidArgumentError('maxResponseSize must be a positive number')
    }

    if (
      autoSelectFamilyAttemptTimeout != null &&
      (!Number.isInteger(autoSelectFamilyAttemptTimeout) || autoSelectFamilyAttemptTimeout < -1)
    ) {
      throw new InvalidArgumentError('autoSelectFamilyAttemptTimeout must be a positive number')
    }

    // h2
    if (allowH2 != null && typeof allowH2 !== 'boolean') {
      throw new InvalidArgumentError('allowH2 must be a valid boolean value')
    }

    if (maxConcurrentStreams != null && (typeof maxConcurrentStreams !== 'number' || maxConcurrentStreams < 1)) {
      throw new InvalidArgumentError('maxConcurrentStreams must be a possitive integer, greater than 0')
    }

    if (typeof connect !== 'function') {
      connect = buildConnector({
        ...tls,
        maxCachedSessions,
        allowH2,
        socketPath,
        timeout: connectTimeout,
        ...(util.nodeHasAutoSelectFamily && autoSelectFamily ? { autoSelectFamily, autoSelectFamilyAttemptTimeout } : undefined),
        ...connect
      })
    }

    this[kInterceptors] = interceptors && interceptors.Client && Array.isArray(interceptors.Client)
      ? interceptors.Client
      : [createRedirectInterceptor({ maxRedirections })]
    this[kUrl] = util.parseOrigin(url)
    this[kConnector] = connect
    this[kSocket] = null
    this[kPipelining] = pipelining != null ? pipelining : 1
    this[kMaxHeadersSize] = maxHeaderSize || http.maxHeaderSize
    this[kKeepAliveDefaultTimeout] = keepAliveTimeout == null ? 4e3 : keepAliveTimeout
    this[kKeepAliveMaxTimeout] = keepAliveMaxTimeout == null ? 600e3 : keepAliveMaxTimeout
    this[kKeepAliveTimeoutThreshold] = keepAliveTimeoutThreshold == null ? 1e3 : keepAliveTimeoutThreshold
    this[kKeepAliveTimeoutValue] = this[kKeepAliveDefaultTimeout]
    this[kServerName] = null
    this[kLocalAddress] = localAddress != null ? localAddress : null
    this[kResuming] = 0 // 0, idle, 1, scheduled, 2 resuming
    this[kNeedDrain] = 0 // 0, idle, 1, scheduled, 2 resuming
    this[kHostHeader] = `host: ${this[kUrl].hostname}${this[kUrl].port ? `:${this[kUrl].port}` : ''}\r\n`
    this[kBodyTimeout] = bodyTimeout != null ? bodyTimeout : 300e3
    this[kHeadersTimeout] = headersTimeout != null ? headersTimeout : 300e3
    this[kStrictContentLength] = strictContentLength == null ? true : strictContentLength
    this[kMaxRedirections] = maxRedirections
    this[kMaxRequests] = maxRequestsPerClient
    this[kClosedResolve] = null
    this[kMaxResponseSize] = maxResponseSize > -1 ? maxResponseSize : -1
    this[kHTTPConnVersion] = 'h1'

    // HTTP/2
    this[kHTTP2Session] = null
    this[kHTTP2SessionState] = !allowH2
      ? null
      : {
        // streams: null, // Fixed queue of streams - For future support of `push`
          openStreams: 0, // Keep track of them to decide wether or not unref the session
          maxConcurrentStreams: maxConcurrentStreams != null ? maxConcurrentStreams : 100 // Max peerConcurrentStreams for a Node h2 server
        }
    this[kHost] = `${this[kUrl].hostname}${this[kUrl].port ? `:${this[kUrl].port}` : ''}`

    // kQueue is built up of 3 sections separated by
    // the kRunningIdx and kPendingIdx indices.
    // |   complete   |   running   |   pending   |
    //                ^ kRunningIdx ^ kPendingIdx ^ kQueue.length
    // kRunningIdx points to the first running element.
    // kPendingIdx points to the first pending element.
    // This implements a fast queue with an amortized
    // time of O(1).

    this[kQueue] = []
    this[kRunningIdx] = 0
    this[kPendingIdx] = 0
  }

  get pipelining () {
    return this[kPipelining]
  }

  set pipelining (value) {
    this[kPipelining] = value
    resume(this, true)
  }

  get [kPending] () {
    return this[kQueue].length - this[kPendingIdx]
  }

  get [kRunning] () {
    return this[kPendingIdx] - this[kRunningIdx]
  }

  get [kSize] () {
    return this[kQueue].length - this[kRunningIdx]
  }

  get [kConnected] () {
    return !!this[kSocket] && !this[kConnecting] && !this[kSocket].destroyed
  }

  get [kBusy] () {
    const socket = this[kSocket]
    return (
      (socket && (socket[kReset] || socket[kWriting] || socket[kBlocking])) ||
      (this[kSize] >= (this[kPipelining] || 1)) ||
      this[kPending] > 0
    )
  }

  /* istanbul ignore: only used for test */
  [kConnect] (cb) {
    connect(this)
    this.once('connect', cb)
  }

  [kDispatch] (opts, handler) {
    const origin = opts.origin || this[kUrl].origin

    const request = this[kHTTPConnVersion] === 'h2'
      ? Request[kHTTP2BuildRequest](origin, opts, handler)
      : Request[kHTTP1BuildRequest](origin, opts, handler)

    this[kQueue].push(request)
    if (this[kResuming]) {
      // Do nothing.
    } else if (util.bodyLength(request.body) == null && util.isIterable(request.body)) {
      // Wait a tick in case stream/iterator is ended in the same tick.
      this[kResuming] = 1
      process.nextTick(resume, this)
    } else {
      resume(this, true)
    }

    if (this[kResuming] && this[kNeedDrain] !== 2 && this[kBusy]) {
      this[kNeedDrain] = 2
    }

    return this[kNeedDrain] < 2
  }

  async [kClose] () {
    // TODO: for H2 we need to gracefully flush the remaining enqueued
    // request and close each stream.
    return new Promise((resolve) => {
      if (!this[kSize]) {
        resolve(null)
      } else {
        this[kClosedResolve] = resolve
      }
    })
  }

  async [kDestroy] (err) {
    return new Promise((resolve) => {
      const requests = this[kQueue].splice(this[kPendingIdx])
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i]
        errorRequest(this, request, err)
      }

      const callback = () => {
        if (this[kClosedResolve]) {
          // TODO (fix): Should we error here with ClientDestroyedError?
          this[kClosedResolve]()
          this[kClosedResolve] = null
        }
        resolve()
      }

      if (this[kHTTP2Session] != null) {
        util.destroy(this[kHTTP2Session], err)
        this[kHTTP2Session] = null
        this[kHTTP2SessionState] = null
      }

      if (!this[kSocket]) {
        queueMicrotask(callback)
      } else {
        util.destroy(this[kSocket].on('close', callback), err)
      }

      resume(this)
    })
  }
}

function onHttp2SessionError (err) {
  assert(err.code !== 'ERR_TLS_CERT_ALTNAME_INVALID')

  this[kSocket][kError] = err

  onError(this[kClient], err)
}

function onHttp2FrameError (type, code, id) {
  const err = new InformationalError(`HTTP/2: "frameError" received - type ${type}, code ${code}`)

  if (id === 0) {
    this[kSocket][kError] = err
    onError(this[kClient], err)
  }
}

function onHttp2SessionEnd () {
  util.destroy(this, new SocketError('other side closed'))
  util.destroy(this[kSocket], new SocketError('other side closed'))
}

function onHTTP2GoAway (code) {
  const client = this[kClient]
  const err = new InformationalError(`HTTP/2: "GOAWAY" frame received with code ${code}`)
  client[kSocket] = null
  client[kHTTP2Session] = null

  if (client.destroyed) {
    assert(this[kPending] === 0)

    // Fail entire queue.
    const requests = client[kQueue].splice(client[kRunningIdx])
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i]
      errorRequest(this, request, err)
    }
  } else if (client[kRunning] > 0) {
    // Fail head of pipeline.
    const request = client[kQueue][client[kRunningIdx]]
    client[kQueue][client[kRunningIdx]++] = null

    errorRequest(client, request, err)
  }

  client[kPendingIdx] = client[kRunningIdx]

  assert(client[kRunning] === 0)

  client.emit('disconnect',
    client[kUrl],
    [client],
    err
  )

  resume(client)
}

const constants = __nccwpck_require__(953)
const createRedirectInterceptor = __nccwpck_require__(8861)
const EMPTY_BUF = Buffer.alloc(0)

async function lazyllhttp () {
  const llhttpWasmData = process.env.JEST_WORKER_ID ? __nccwpck_require__(1145) : undefined

  let mod
  try {
    mod = await WebAssembly.compile(Buffer.from(__nccwpck_require__(5627), 'base64'))
  } catch (e) {
    /* istanbul ignore next */

    // We could check if the error was caused by the simd option not
    // being enabled, but the occurring of this other error
    // * https://github.com/emscripten-core/emscripten/issues/11495
    // got me to remove that check to avoid breaking Node 12.
    mod = await WebAssembly.compile(Buffer.from(llhttpWasmData || __nccwpck_require__(1145), 'base64'))
  }

  return await WebAssembly.instantiate(mod, {
    env: {
      /* eslint-disable camelcase */

      wasm_on_url: (p, at, len) => {
        /* istanbul ignore next */
        return 0
      },
      wasm_on_status: (p, at, len) => {
        assert.strictEqual(currentParser.ptr, p)
        const start = at - currentBufferPtr + currentBufferRef.byteOffset
        return currentParser.onStatus(new FastBuffer(currentBufferRef.buffer, start, len)) || 0
      },
      wasm_on_message_begin: (p) => {
        assert.strictEqual(currentParser.ptr, p)
        return currentParser.onMessageBegin() || 0
      },
      wasm_on_header_field: (p, at, len) => {
        assert.strictEqual(currentParser.ptr, p)
        const start = at - currentBufferPtr + currentBufferRef.byteOffset
        return currentParser.onHeaderField(new FastBuffer(currentBufferRef.buffer, start, len)) || 0
      },
      wasm_on_header_value: (p, at, len) => {
        assert.strictEqual(currentParser.ptr, p)
        const start = at - currentBufferPtr + currentBufferRef.byteOffset
        return currentParser.onHeaderValue(new FastBuffer(currentBufferRef.buffer, start, len)) || 0
      },
      wasm_on_headers_complete: (p, statusCode, upgrade, shouldKeepAlive) => {
        assert.strictEqual(currentParser.ptr, p)
        return currentParser.onHeadersComplete(statusCode, Boolean(upgrade), Boolean(shouldKeepAlive)) || 0
      },
      wasm_on_body: (p, at, len) => {
        assert.strictEqual(currentParser.ptr, p)
        const start = at - currentBufferPtr + currentBufferRef.byteOffset
        return currentParser.onBody(new FastBuffer(currentBufferRef.buffer, start, len)) || 0
      },
      wasm_on_message_complete: (p) => {
        assert.strictEqual(currentParser.ptr, p)
        return currentParser.onMessageComplete() || 0
      }

      /* eslint-enable camelcase */
    }
  })
}

let llhttpInstance = null
let llhttpPromise = lazyllhttp()
llhttpPromise.catch()

let currentParser = null
let currentBufferRef = null
let currentBufferSize = 0
let currentBufferPtr = null

const TIMEOUT_HEADERS = 1
const TIMEOUT_BODY = 2
const TIMEOUT_IDLE = 3

class Parser {
  constructor (client, socket, { exports }) {
    assert(Number.isFinite(client[kMaxHeadersSize]) && client[kMaxHeadersSize] > 0)

    this.llhttp = exports
    this.ptr = this.llhttp.llhttp_alloc(constants.TYPE.RESPONSE)
    this.client = client
    this.socket = socket
    this.timeout = null
    this.timeoutValue = null
    this.timeoutType = null
    this.statusCode = null
    this.statusText = ''
    this.upgrade = false
    this.headers = []
    this.headersSize = 0
    this.headersMaxSize = client[kMaxHeadersSize]
    this.shouldKeepAlive = false
    this.paused = false
    this.resume = this.resume.bind(this)

    this.bytesRead = 0

    this.keepAlive = ''
    this.contentLength = ''
    this.connection = ''
    this.maxResponseSize = client[kMaxResponseSize]
  }

  setTimeout (value, type) {
    this.timeoutType = type
    if (value !== this.timeoutValue) {
      timers.clearTimeout(this.timeout)
      if (value) {
        this.timeout = timers.setTimeout(onParserTimeout, value, this)
        // istanbul ignore else: only for jest
        if (this.timeout.unref) {
          this.timeout.unref()
        }
      } else {
        this.timeout = null
      }
      this.timeoutValue = value
    } else if (this.timeout) {
      // istanbul ignore else: only for jest
      if (this.timeout.refresh) {
        this.timeout.refresh()
      }
    }
  }

  resume () {
    if (this.socket.destroyed || !this.paused) {
      return
    }

    assert(this.ptr != null)
    assert(currentParser == null)

    this.llhttp.llhttp_resume(this.ptr)

    assert(this.timeoutType === TIMEOUT_BODY)
    if (this.timeout) {
      // istanbul ignore else: only for jest
      if (this.timeout.refresh) {
        this.timeout.refresh()
      }
    }

    this.paused = false
    this.execute(this.socket.read() || EMPTY_BUF) // Flush parser.
    this.readMore()
  }

  readMore () {
    while (!this.paused && this.ptr) {
      const chunk = this.socket.read()
      if (chunk === null) {
        break
      }
      this.execute(chunk)
    }
  }

  execute (data) {
    assert(this.ptr != null)
    assert(currentParser == null)
    assert(!this.paused)

    const { socket, llhttp } = this

    if (data.length > currentBufferSize) {
      if (currentBufferPtr) {
        llhttp.free(currentBufferPtr)
      }
      currentBufferSize = Math.ceil(data.length / 4096) * 4096
      currentBufferPtr = llhttp.malloc(currentBufferSize)
    }

    new Uint8Array(llhttp.memory.buffer, currentBufferPtr, currentBufferSize).set(data)

    // Call `execute` on the wasm parser.
    // We pass the `llhttp_parser` pointer address, the pointer address of buffer view data,
    // and finally the length of bytes to parse.
    // The return value is an error code or `constants.ERROR.OK`.
    try {
      let ret

      try {
        currentBufferRef = data
        currentParser = this
        ret = llhttp.llhttp_execute(this.ptr, currentBufferPtr, data.length)
        /* eslint-disable-next-line no-useless-catch */
      } catch (err) {
        /* istanbul ignore next: difficult to make a test case for */
        throw err
      } finally {
        currentParser = null
        currentBufferRef = null
      }

      const offset = llhttp.llhttp_get_error_pos(this.ptr) - currentBufferPtr

      if (ret === constants.ERROR.PAUSED_UPGRADE) {
        this.onUpgrade(data.slice(offset))
      } else if (ret === constants.ERROR.PAUSED) {
        this.paused = true
        socket.unshift(data.slice(offset))
      } else if (ret !== constants.ERROR.OK) {
        const ptr = llhttp.llhttp_get_error_reason(this.ptr)
        let message = ''
        /* istanbul ignore else: difficult to make a test case for */
        if (ptr) {
          const len = new Uint8Array(llhttp.memory.buffer, ptr).indexOf(0)
          message =
            'Response does not match the HTTP/1.1 protocol (' +
            Buffer.from(llhttp.memory.buffer, ptr, len).toString() +
            ')'
        }
        throw new HTTPParserError(message, constants.ERROR[ret], data.slice(offset))
      }
    } catch (err) {
      util.destroy(socket, err)
    }
  }

  destroy () {
    assert(this.ptr != null)
    assert(currentParser == null)

    this.llhttp.llhttp_free(this.ptr)
    this.ptr = null

    timers.clearTimeout(this.timeout)
    this.timeout = null
    this.timeoutValue = null
    this.timeoutType = null

    this.paused = false
  }

  onStatus (buf) {
    this.statusText = buf.toString()
  }

  onMessageBegin () {
    const { socket, client } = this

    /* istanbul ignore next: difficult to make a test case for */
    if (socket.destroyed) {
      return -1
    }

    const request = client[kQueue][client[kRunningIdx]]
    if (!request) {
      return -1
    }
  }

  onHeaderField (buf) {
    const len = this.headers.length

    if ((len & 1) === 0) {
      this.headers.push(buf)
    } else {
      this.headers[len - 1] = Buffer.concat([this.headers[len - 1], buf])
    }

    this.trackHeader(buf.length)
  }

  onHeaderValue (buf) {
    let len = this.headers.length

    if ((len & 1) === 1) {
      this.headers.push(buf)
      len += 1
    } else {
      this.headers[len - 1] = Buffer.concat([this.headers[len - 1], buf])
    }

    const key = this.headers[len - 2]
    if (key.length === 10 && key.toString().toLowerCase() === 'keep-alive') {
      this.keepAlive += buf.toString()
    } else if (key.length === 10 && key.toString().toLowerCase() === 'connection') {
      this.connection += buf.toString()
    } else if (key.length === 14 && key.toString().toLowerCase() === 'content-length') {
      this.contentLength += buf.toString()
    }

    this.trackHeader(buf.length)
  }

  trackHeader (len) {
    this.headersSize += len
    if (this.headersSize >= this.headersMaxSize) {
      util.destroy(this.socket, new HeadersOverflowError())
    }
  }

  onUpgrade (head) {
    const { upgrade, client, socket, headers, statusCode } = this

    assert(upgrade)

    const request = client[kQueue][client[kRunningIdx]]
    assert(request)

    assert(!socket.destroyed)
    assert(socket === client[kSocket])
    assert(!this.paused)
    assert(request.upgrade || request.method === 'CONNECT')

    this.statusCode = null
    this.statusText = ''
    this.shouldKeepAlive = null

    assert(this.headers.length % 2 === 0)
    this.headers = []
    this.headersSize = 0

    socket.unshift(head)

    socket[kParser].destroy()
    socket[kParser] = null

    socket[kClient] = null
    socket[kError] = null
    socket
      .removeListener('error', onSocketError)
      .removeListener('readable', onSocketReadable)
      .removeListener('end', onSocketEnd)
      .removeListener('close', onSocketClose)

    client[kSocket] = null
    client[kQueue][client[kRunningIdx]++] = null
    client.emit('disconnect', client[kUrl], [client], new InformationalError('upgrade'))

    try {
      request.onUpgrade(statusCode, headers, socket)
    } catch (err) {
      util.destroy(socket, err)
    }

    resume(client)
  }

  onHeadersComplete (statusCode, upgrade, shouldKeepAlive) {
    const { client, socket, headers, statusText } = this

    /* istanbul ignore next: difficult to make a test case for */
    if (socket.destroyed) {
      return -1
    }

    const request = client[kQueue][client[kRunningIdx]]

    /* istanbul ignore next: difficult to make a test case for */
    if (!request) {
      return -1
    }

    assert(!this.upgrade)
    assert(this.statusCode < 200)

    if (statusCode === 100) {
      util.destroy(socket, new SocketError('bad response', util.getSocketInfo(socket)))
      return -1
    }

    /* this can only happen if server is misbehaving */
    if (upgrade && !request.upgrade) {
      util.destroy(socket, new SocketError('bad upgrade', util.getSocketInfo(socket)))
      return -1
    }

    assert.strictEqual(this.timeoutType, TIMEOUT_HEADERS)

    this.statusCode = statusCode
    this.shouldKeepAlive = (
      shouldKeepAlive ||
      // Override llhttp value which does not allow keepAlive for HEAD.
      (request.method === 'HEAD' && !socket[kReset] && this.connection.toLowerCase() === 'keep-alive')
    )

    if (this.statusCode >= 200) {
      const bodyTimeout = request.bodyTimeout != null
        ? request.bodyTimeout
        : client[kBodyTimeout]
      this.setTimeout(bodyTimeout, TIMEOUT_BODY)
    } else if (this.timeout) {
      // istanbul ignore else: only for jest
      if (this.timeout.refresh) {
        this.timeout.refresh()
      }
    }

    if (request.method === 'CONNECT') {
      assert(client[kRunning] === 1)
      this.upgrade = true
      return 2
    }

    if (upgrade) {
      assert(client[kRunning] === 1)
      this.upgrade = true
      return 2
    }

    assert(this.headers.length % 2 === 0)
    this.headers = []
    this.headersSize = 0

    if (this.shouldKeepAlive && client[kPipelining]) {
      const keepAliveTimeout = this.keepAlive ? util.parseKeepAliveTimeout(this.keepAlive) : null

      if (keepAliveTimeout != null) {
        const timeout = Math.min(
          keepAliveTimeout - client[kKeepAliveTimeoutThreshold],
          client[kKeepAliveMaxTimeout]
        )
        if (timeout <= 0) {
          socket[kReset] = true
        } else {
          client[kKeepAliveTimeoutValue] = timeout
        }
      } else {
        client[kKeepAliveTimeoutValue] = client[kKeepAliveDefaultTimeout]
      }
    } else {
      // Stop more requests from being dispatched.
      socket[kReset] = true
    }

    const pause = request.onHeaders(statusCode, headers, this.resume, statusText) === false

    if (request.aborted) {
      return -1
    }

    if (request.method === 'HEAD') {
      return 1
    }

    if (statusCode < 200) {
      return 1
    }

    if (socket[kBlocking]) {
      socket[kBlocking] = false
      resume(client)
    }

    return pause ? constants.ERROR.PAUSED : 0
  }

  onBody (buf) {
    const { client, socket, statusCode, maxResponseSize } = this

    if (socket.destroyed) {
      return -1
    }

    const request = client[kQueue][client[kRunningIdx]]
    assert(request)

    assert.strictEqual(this.timeoutType, TIMEOUT_BODY)
    if (this.timeout) {
      // istanbul ignore else: only for jest
      if (this.timeout.refresh) {
        this.timeout.refresh()
      }
    }

    assert(statusCode >= 200)

    if (maxResponseSize > -1 && this.bytesRead + buf.length > maxResponseSize) {
      util.destroy(socket, new ResponseExceededMaxSizeError())
      return -1
    }

    this.bytesRead += buf.length

    if (request.onData(buf) === false) {
      return constants.ERROR.PAUSED
    }
  }

  onMessageComplete () {
    const { client, socket, statusCode, upgrade, headers, contentLength, bytesRead, shouldKeepAlive } = this

    if (socket.destroyed && (!statusCode || shouldKeepAlive)) {
      return -1
    }

    if (upgrade) {
      return
    }

    const request = client[kQueue][client[kRunningIdx]]
    assert(request)

    assert(statusCode >= 100)

    this.statusCode = null
    this.statusText = ''
    this.bytesRead = 0
    this.contentLength = ''
    this.keepAlive = ''
    this.connection = ''

    assert(this.headers.length % 2 === 0)
    this.headers = []
    this.headersSize = 0

    if (statusCode < 200) {
      return
    }

    /* istanbul ignore next: should be handled by llhttp? */
    if (request.method !== 'HEAD' && contentLength && bytesRead !== parseInt(contentLength, 10)) {
      util.destroy(socket, new ResponseContentLengthMismatchError())
      return -1
    }

    request.onComplete(headers)

    client[kQueue][client[kRunningIdx]++] = null

    if (socket[kWriting]) {
      assert.strictEqual(client[kRunning], 0)
      // Response completed before request.
      util.destroy(socket, new InformationalError('reset'))
      return constants.ERROR.PAUSED
    } else if (!shouldKeepAlive) {
      util.destroy(socket, new InformationalError('reset'))
      return constants.ERROR.PAUSED
    } else if (socket[kReset] && client[kRunning] === 0) {
      // Destroy socket once all requests have completed.
      // The request at the tail of the pipeline is the one
      // that requested reset and no further requests should
      // have been queued since then.
      util.destroy(socket, new InformationalError('reset'))
      return constants.ERROR.PAUSED
    } else if (client[kPipelining] === 1) {
      // We must wait a full event loop cycle to reuse this socket to make sure
      // that non-spec compliant servers are not closing the connection even if they
      // said they won't.
      setImmediate(resume, client)
    } else {
      resume(client)
    }
  }
}

function onParserTimeout (parser) {
  const { socket, timeoutType, client } = parser

  /* istanbul ignore else */
  if (timeoutType === TIMEOUT_HEADERS) {
    if (!socket[kWriting] || socket.writableNeedDrain || client[kRunning] > 1) {
      assert(!parser.paused, 'cannot be paused while waiting for headers')
      util.destroy(socket, new HeadersTimeoutError())
    }
  } else if (timeoutType === TIMEOUT_BODY) {
    if (!parser.paused) {
      util.destroy(socket, new BodyTimeoutError())
    }
  } else if (timeoutType === TIMEOUT_IDLE) {
    assert(client[kRunning] === 0 && client[kKeepAliveTimeoutValue])
    util.destroy(socket, new InformationalError('socket idle timeout'))
  }
}

function onSocketReadable () {
  const { [kParser]: parser } = this
  if (parser) {
    parser.readMore()
  }
}

function onSocketError (err) {
  const { [kClient]: client, [kParser]: parser } = this

  assert(err.code !== 'ERR_TLS_CERT_ALTNAME_INVALID')

  if (client[kHTTPConnVersion] !== 'h2') {
    // On Mac OS, we get an ECONNRESET even if there is a full body to be forwarded
    // to the user.
    if (err.code === 'ECONNRESET' && parser.statusCode && !parser.shouldKeepAlive) {
      // We treat all incoming data so for as a valid response.
      parser.onMessageComplete()
      return
    }
  }

  this[kError] = err

  onError(this[kClient], err)
}

function onError (client, err) {
  if (
    client[kRunning] === 0 &&
    err.code !== 'UND_ERR_INFO' &&
    err.code !== 'UND_ERR_SOCKET'
  ) {
    // Error is not caused by running request and not a recoverable
    // socket error.

    assert(client[kPendingIdx] === client[kRunningIdx])

    const requests = client[kQueue].splice(client[kRunningIdx])
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i]
      errorRequest(client, request, err)
    }
    assert(client[kSize] === 0)
  }
}

function onSocketEnd () {
  const { [kParser]: parser, [kClient]: client } = this

  if (client[kHTTPConnVersion] !== 'h2') {
    if (parser.statusCode && !parser.shouldKeepAlive) {
      // We treat all incoming data so far as a valid response.
      parser.onMessageComplete()
      return
    }
  }

  util.destroy(this, new SocketError('other side closed', util.getSocketInfo(this)))
}

function onSocketClose () {
  const { [kClient]: client, [kParser]: parser } = this

  if (client[kHTTPConnVersion] === 'h1' && parser) {
    if (!this[kError] && parser.statusCode && !parser.shouldKeepAlive) {
      // We treat all incoming data so far as a valid response.
      parser.onMessageComplete()
    }

    this[kParser].destroy()
    this[kParser] = null
  }

  const err = this[kError] || new SocketError('closed', util.getSocketInfo(this))

  client[kSocket] = null

  if (client.destroyed) {
    assert(client[kPending] === 0)

    // Fail entire queue.
    const requests = client[kQueue].splice(client[kRunningIdx])
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i]
      errorRequest(client, request, err)
    }
  } else if (client[kRunning] > 0 && err.code !== 'UND_ERR_INFO') {
    // Fail head of pipeline.
    const request = client[kQueue][client[kRunningIdx]]
    client[kQueue][client[kRunningIdx]++] = null

    errorRequest(client, request, err)
  }

  client[kPendingIdx] = client[kRunningIdx]

  assert(client[kRunning] === 0)

  client.emit('disconnect', client[kUrl], [client], err)

  resume(client)
}

async function connect (client) {
  assert(!client[kConnecting])
  assert(!client[kSocket])

  let { host, hostname, protocol, port } = client[kUrl]

  // Resolve ipv6
  if (hostname[0] === '[') {
    const idx = hostname.indexOf(']')

    assert(idx !== -1)
    const ip = hostname.substring(1, idx)

    assert(net.isIP(ip))
    hostname = ip
  }

  client[kConnecting] = true

  if (channels.beforeConnect.hasSubscribers) {
    channels.beforeConnect.publish({
      connectParams: {
        host,
        hostname,
        protocol,
        port,
        servername: client[kServerName],
        localAddress: client[kLocalAddress]
      },
      connector: client[kConnector]
    })
  }

  try {
    const socket = await new Promise((resolve, reject) => {
      client[kConnector]({
        host,
        hostname,
        protocol,
        port,
        servername: client[kServerName],
        localAddress: client[kLocalAddress]
      }, (err, socket) => {
        if (err) {
          reject(err)
        } else {
          resolve(socket)
        }
      })
    })

    if (client.destroyed) {
      util.destroy(socket.on('error', () => {}), new ClientDestroyedError())
      return
    }

    client[kConnecting] = false

    assert(socket)

    const isH2 = socket.alpnProtocol === 'h2'
    if (isH2) {
      if (!h2ExperimentalWarned) {
        h2ExperimentalWarned = true
        process.emitWarning('H2 support is experimental, expect them to change at any time.', {
          code: 'UNDICI-H2'
        })
      }

      const session = http2.connect(client[kUrl], {
        createConnection: () => socket,
        peerMaxConcurrentStreams: client[kHTTP2SessionState].maxConcurrentStreams
      })

      client[kHTTPConnVersion] = 'h2'
      session[kClient] = client
      session[kSocket] = socket
      session.on('error', onHttp2SessionError)
      session.on('frameError', onHttp2FrameError)
      session.on('end', onHttp2SessionEnd)
      session.on('goaway', onHTTP2GoAway)
      session.on('close', onSocketClose)
      session.unref()

      client[kHTTP2Session] = session
      socket[kHTTP2Session] = session
    } else {
      if (!llhttpInstance) {
        llhttpInstance = await llhttpPromise
        llhttpPromise = null
      }

      socket[kNoRef] = false
      socket[kWriting] = false
      socket[kReset] = false
      socket[kBlocking] = false
      socket[kParser] = new Parser(client, socket, llhttpInstance)
    }

    socket[kCounter] = 0
    socket[kMaxRequests] = client[kMaxRequests]
    socket[kClient] = client
    socket[kError] = null

    socket
      .on('error', onSocketError)
      .on('readable', onSocketReadable)
      .on('end', onSocketEnd)
      .on('close', onSocketClose)

    client[kSocket] = socket

    if (channels.connected.hasSubscribers) {
      channels.connected.publish({
        connectParams: {
          host,
          hostname,
          protocol,
          port,
          servername: client[kServerName],
          localAddress: client[kLocalAddress]
        },
        connector: client[kConnector],
        socket
      })
    }
    client.emit('connect', client[kUrl], [client])
  } catch (err) {
    if (client.destroyed) {
      return
    }

    client[kConnecting] = false

    if (channels.connectError.hasSubscribers) {
      channels.connectError.publish({
        connectParams: {
          host,
          hostname,
          protocol,
          port,
          servername: client[kServerName],
          localAddress: client[kLocalAddress]
        },
        connector: client[kConnector],
        error: err
      })
    }

    if (err.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
      assert(client[kRunning] === 0)
      while (client[kPending] > 0 && client[kQueue][client[kPendingIdx]].servername === client[kServerName]) {
        const request = client[kQueue][client[kPendingIdx]++]
        errorRequest(client, request, err)
      }
    } else {
      onError(client, err)
    }

    client.emit('connectionError', client[kUrl], [client], err)
  }

  resume(client)
}

function emitDrain (client) {
  client[kNeedDrain] = 0
  client.emit('drain', client[kUrl], [client])
}

function resume (client, sync) {
  if (client[kResuming] === 2) {
    return
  }

  client[kResuming] = 2

  _resume(client, sync)
  client[kResuming] = 0

  if (client[kRunningIdx] > 256) {
    client[kQueue].splice(0, client[kRunningIdx])
    client[kPendingIdx] -= client[kRunningIdx]
    client[kRunningIdx] = 0
  }
}

function _resume (client, sync) {
  while (true) {
    if (client.destroyed) {
      assert(client[kPending] === 0)
      return
    }

    if (client[kClosedResolve] && !client[kSize]) {
      client[kClosedResolve]()
      client[kClosedResolve] = null
      return
    }

    const socket = client[kSocket]

    if (socket && !socket.destroyed && socket.alpnProtocol !== 'h2') {
      if (client[kSize] === 0) {
        if (!socket[kNoRef] && socket.unref) {
          socket.unref()
          socket[kNoRef] = true
        }
      } else if (socket[kNoRef] && socket.ref) {
        socket.ref()
        socket[kNoRef] = false
      }

      if (client[kSize] === 0) {
        if (socket[kParser].timeoutType !== TIMEOUT_IDLE) {
          socket[kParser].setTimeout(client[kKeepAliveTimeoutValue], TIMEOUT_IDLE)
        }
      } else if (client[kRunning] > 0 && socket[kParser].statusCode < 200) {
        if (socket[kParser].timeoutType !== TIMEOUT_HEADERS) {
          const request = client[kQueue][client[kRunningIdx]]
          const headersTimeout = request.headersTimeout != null
            ? request.headersTimeout
            : client[kHeadersTimeout]
          socket[kParser].setTimeout(headersTimeout, TIMEOUT_HEADERS)
        }
      }
    }

    if (client[kBusy]) {
      client[kNeedDrain] = 2
    } else if (client[kNeedDrain] === 2) {
      if (sync) {
        client[kNeedDrain] = 1
        process.nextTick(emitDrain, client)
      } else {
        emitDrain(client)
      }
      continue
    }

    if (client[kPending] === 0) {
      return
    }

    if (client[kRunning] >= (client[kPipelining] || 1)) {
      return
    }

    const request = client[kQueue][client[kPendingIdx]]

    if (client[kUrl].protocol === 'https:' && client[kServerName] !== request.servername) {
      if (client[kRunning] > 0) {
        return
      }

      client[kServerName] = request.servername

      if (socket && socket.servername !== request.servername) {
        util.destroy(socket, new InformationalError('servername changed'))
        return
      }
    }

    if (client[kConnecting]) {
      return
    }

    if (!socket && !client[kHTTP2Session]) {
      connect(client)
      return
    }

    if (socket.destroyed || socket[kWriting] || socket[kReset] || socket[kBlocking]) {
      return
    }

    if (client[kRunning] > 0 && !request.idempotent) {
      // Non-idempotent request cannot be retried.
      // Ensure that no other requests are inflight and
      // could cause failure.
      return
    }

    if (client[kRunning] > 0 && (request.upgrade || request.method === 'CONNECT')) {
      // Don't dispatch an upgrade until all preceding requests have completed.
      // A misbehaving server might upgrade the connection before all pipelined
      // request has completed.
      return
    }

    if (client[kRunning] > 0 && util.bodyLength(request.body) !== 0 &&
      (util.isStream(request.body) || util.isAsyncIterable(request.body))) {
      // Request with stream or iterator body can error while other requests
      // are inflight and indirectly error those as well.
      // Ensure this doesn't happen by waiting for inflight
      // to complete before dispatching.

      // Request with stream or iterator body cannot be retried.
      // Ensure that no other requests are inflight and
      // could cause failure.
      return
    }

    if (!request.aborted && write(client, request)) {
      client[kPendingIdx]++
    } else {
      client[kQueue].splice(client[kPendingIdx], 1)
    }
  }
}

// https://www.rfc-editor.org/rfc/rfc7230#section-3.3.2
function shouldSendContentLength (method) {
  return method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS' && method !== 'TRACE' && method !== 'CONNECT'
}

function write (client, request) {
  if (client[kHTTPConnVersion] === 'h2') {
    writeH2(client, client[kHTTP2Session], request)
    return
  }

  const { body, method, path, host, upgrade, headers, blocking, reset } = request

  // https://tools.ietf.org/html/rfc7231#section-4.3.1
  // https://tools.ietf.org/html/rfc7231#section-4.3.2
  // https://tools.ietf.org/html/rfc7231#section-4.3.5

  // Sending a payload body on a request that does not
  // expect it can cause undefined behavior on some
  // servers and corrupt connection state. Do not
  // re-use the connection for further requests.

  const expectsPayload = (
    method === 'PUT' ||
    method === 'POST' ||
    method === 'PATCH'
  )

  if (body && typeof body.read === 'function') {
    // Try to read EOF in order to get length.
    body.read(0)
  }

  const bodyLength = util.bodyLength(body)

  let contentLength = bodyLength

  if (contentLength === null) {
    contentLength = request.contentLength
  }

  if (contentLength === 0 && !expectsPayload) {
    // https://tools.ietf.org/html/rfc7230#section-3.3.2
    // A user agent SHOULD NOT send a Content-Length header field when
    // the request message does not contain a payload body and the method
    // semantics do not anticipate such a body.

    contentLength = null
  }

  // https://github.com/nodejs/undici/issues/2046
  // A user agent may send a Content-Length header with 0 value, this should be allowed.
  if (shouldSendContentLength(method) && contentLength > 0 && request.contentLength !== null && request.contentLength !== contentLength) {
    if (client[kStrictContentLength]) {
      errorRequest(client, request, new RequestContentLengthMismatchError())
      return false
    }

    process.emitWarning(new RequestContentLengthMismatchError())
  }

  const socket = client[kSocket]

  try {
    request.onConnect((err) => {
      if (request.aborted || request.completed) {
        return
      }

      errorRequest(client, request, err || new RequestAbortedError())

      util.destroy(socket, new InformationalError('aborted'))
    })
  } catch (err) {
    errorRequest(client, request, err)
  }

  if (request.aborted) {
    return false
  }

  if (method === 'HEAD') {
    // https://github.com/mcollina/undici/issues/258
    // Close after a HEAD request to interop with misbehaving servers
    // that may send a body in the response.

    socket[kReset] = true
  }

  if (upgrade || method === 'CONNECT') {
    // On CONNECT or upgrade, block pipeline from dispatching further
    // requests on this connection.

    socket[kReset] = true
  }

  if (reset != null) {
    socket[kReset] = reset
  }

  if (client[kMaxRequests] && socket[kCounter]++ >= client[kMaxRequests]) {
    socket[kReset] = true
  }

  if (blocking) {
    socket[kBlocking] = true
  }

  let header = `${method} ${path} HTTP/1.1\r\n`

  if (typeof host === 'string') {
    header += `host: ${host}\r\n`
  } else {
    header += client[kHostHeader]
  }

  if (upgrade) {
    header += `connection: upgrade\r\nupgrade: ${upgrade}\r\n`
  } else if (client[kPipelining] && !socket[kReset]) {
    header += 'connection: keep-alive\r\n'
  } else {
    header += 'connection: close\r\n'
  }

  if (headers) {
    header += headers
  }

  if (channels.sendHeaders.hasSubscribers) {
    channels.sendHeaders.publish({ request, headers: header, socket })
  }

  /* istanbul ignore else: assertion */
  if (!body || bodyLength === 0) {
    if (contentLength === 0) {
      socket.write(`${header}content-length: 0\r\n\r\n`, 'latin1')
    } else {
      assert(contentLength === null, 'no body must not have content length')
      socket.write(`${header}\r\n`, 'latin1')
    }
    request.onRequestSent()
  } else if (util.isBuffer(body)) {
    assert(contentLength === body.byteLength, 'buffer body must have content length')

    socket.cork()
    socket.write(`${header}content-length: ${contentLength}\r\n\r\n`, 'latin1')
    socket.write(body)
    socket.uncork()
    request.onBodySent(body)
    request.onRequestSent()
    if (!expectsPayload) {
      socket[kReset] = true
    }
  } else if (util.isBlobLike(body)) {
    if (typeof body.stream === 'function') {
      writeIterable({ body: body.stream(), client, request, socket, contentLength, header, expectsPayload })
    } else {
      writeBlob({ body, client, request, socket, contentLength, header, expectsPayload })
    }
  } else if (util.isStream(body)) {
    writeStream({ body, client, request, socket, contentLength, header, expectsPayload })
  } else if (util.isIterable(body)) {
    writeIterable({ body, client, request, socket, contentLength, header, expectsPayload })
  } else {
    assert(false)
  }

  return true
}

function writeH2 (client, session, request) {
  const { body, method, path, host, upgrade, expectContinue, signal, headers: reqHeaders } = request

  let headers
  if (typeof reqHeaders === 'string') headers = Request[kHTTP2CopyHeaders](reqHeaders.trim())
  else headers = reqHeaders

  if (upgrade) {
    errorRequest(client, request, new Error('Upgrade not supported for H2'))
    return false
  }

  try {
    // TODO(HTTP/2): Should we call onConnect immediately or on stream ready event?
    request.onConnect((err) => {
      if (request.aborted || request.completed) {
        return
      }

      errorRequest(client, request, err || new RequestAbortedError())
    })
  } catch (err) {
    errorRequest(client, request, err)
  }

  if (request.aborted) {
    return false
  }

  /** @type {import('node:http2').ClientHttp2Stream} */
  let stream
  const h2State = client[kHTTP2SessionState]

  headers[HTTP2_HEADER_AUTHORITY] = host || client[kHost]
  headers[HTTP2_HEADER_METHOD] = method

  if (method === 'CONNECT') {
    session.ref()
    // we are already connected, streams are pending, first request
    // will create a new stream. We trigger a request to create the stream and wait until
    // `ready` event is triggered
    // We disabled endStream to allow the user to write to the stream
    stream = session.request(headers, { endStream: false, signal })

    if (stream.id && !stream.pending) {
      request.onUpgrade(null, null, stream)
      ++h2State.openStreams
    } else {
      stream.once('ready', () => {
        request.onUpgrade(null, null, stream)
        ++h2State.openStreams
      })
    }

    stream.once('close', () => {
      h2State.openStreams -= 1
      // TODO(HTTP/2): unref only if current streams count is 0
      if (h2State.openStreams === 0) session.unref()
    })

    return true
  }

  // https://tools.ietf.org/html/rfc7540#section-8.3
  // :path and :scheme headers must be omited when sending CONNECT

  headers[HTTP2_HEADER_PATH] = path
  headers[HTTP2_HEADER_SCHEME] = 'https'

  // https://tools.ietf.org/html/rfc7231#section-4.3.1
  // https://tools.ietf.org/html/rfc7231#section-4.3.2
  // https://tools.ietf.org/html/rfc7231#section-4.3.5

  // Sending a payload body on a request that does not
  // expect it can cause undefined behavior on some
  // servers and corrupt connection state. Do not
  // re-use the connection for further requests.

  const expectsPayload = (
    method === 'PUT' ||
    method === 'POST' ||
    method === 'PATCH'
  )

  if (body && typeof body.read === 'function') {
    // Try to read EOF in order to get length.
    body.read(0)
  }

  let contentLength = util.bodyLength(body)

  if (contentLength == null) {
    contentLength = request.contentLength
  }

  if (contentLength === 0 || !expectsPayload) {
    // https://tools.ietf.org/html/rfc7230#section-3.3.2
    // A user agent SHOULD NOT send a Content-Length header field when
    // the request message does not contain a payload body and the method
    // semantics do not anticipate such a body.

    contentLength = null
  }

  // https://github.com/nodejs/undici/issues/2046
  // A user agent may send a Content-Length header with 0 value, this should be allowed.
  if (shouldSendContentLength(method) && contentLength > 0 && request.contentLength != null && request.contentLength !== contentLength) {
    if (client[kStrictContentLength]) {
      errorRequest(client, request, new RequestContentLengthMismatchError())
      return false
    }

    process.emitWarning(new RequestContentLengthMismatchError())
  }

  if (contentLength != null) {
    assert(body, 'no body must not have content length')
    headers[HTTP2_HEADER_CONTENT_LENGTH] = `${contentLength}`
  }

  session.ref()

  const shouldEndStream = method === 'GET' || method === 'HEAD'
  if (expectContinue) {
    headers[HTTP2_HEADER_EXPECT] = '100-continue'
    stream = session.request(headers, { endStream: shouldEndStream, signal })

    stream.once('continue', writeBodyH2)
  } else {
    stream = session.request(headers, {
      endStream: shouldEndStream,
      signal
    })
    writeBodyH2()
  }

  // Increment counter as we have new several streams open
  ++h2State.openStreams

  stream.once('response', headers => {
    const { [HTTP2_HEADER_STATUS]: statusCode, ...realHeaders } = headers

    if (request.onHeaders(Number(statusCode), realHeaders, stream.resume.bind(stream), '') === false) {
      stream.pause()
    }
  })

  stream.once('end', () => {
    request.onComplete([])
  })

  stream.on('data', (chunk) => {
    if (request.onData(chunk) === false) {
      stream.pause()
    }
  })

  stream.once('close', () => {
    h2State.openStreams -= 1
    // TODO(HTTP/2): unref only if current streams count is 0
    if (h2State.openStreams === 0) {
      session.unref()
    }
  })

  stream.once('error', function (err) {
    if (client[kHTTP2Session] && !client[kHTTP2Session].destroyed && !this.closed && !this.destroyed) {
      h2State.streams -= 1
      util.destroy(stream, err)
    }
  })

  stream.once('frameError', (type, code) => {
    const err = new InformationalError(`HTTP/2: "frameError" received - type ${type}, code ${code}`)
    errorRequest(client, request, err)

    if (client[kHTTP2Session] && !client[kHTTP2Session].destroyed && !this.closed && !this.destroyed) {
      h2State.streams -= 1
      util.destroy(stream, err)
    }
  })

  // stream.on('aborted', () => {
  //   // TODO(HTTP/2): Support aborted
  // })

  // stream.on('timeout', () => {
  //   // TODO(HTTP/2): Support timeout
  // })

  // stream.on('push', headers => {
  //   // TODO(HTTP/2): Suppor push
  // })

  // stream.on('trailers', headers => {
  //   // TODO(HTTP/2): Support trailers
  // })

  return true

  function writeBodyH2 () {
    /* istanbul ignore else: assertion */
    if (!body) {
      request.onRequestSent()
    } else if (util.isBuffer(body)) {
      assert(contentLength === body.byteLength, 'buffer body must have content length')
      stream.cork()
      stream.write(body)
      stream.uncork()
      stream.end()
      request.onBodySent(body)
      request.onRequestSent()
    } else if (util.isBlobLike(body)) {
      if (typeof body.stream === 'function') {
        writeIterable({
          client,
          request,
          contentLength,
          h2stream: stream,
          expectsPayload,
          body: body.stream(),
          socket: client[kSocket],
          header: ''
        })
      } else {
        writeBlob({
          body,
          client,
          request,
          contentLength,
          expectsPayload,
          h2stream: stream,
          header: '',
          socket: client[kSocket]
        })
      }
    } else if (util.isStream(body)) {
      writeStream({
        body,
        client,
        request,
        contentLength,
        expectsPayload,
        socket: client[kSocket],
        h2stream: stream,
        header: ''
      })
    } else if (util.isIterable(body)) {
      writeIterable({
        body,
        client,
        request,
        contentLength,
        expectsPayload,
        header: '',
        h2stream: stream,
        socket: client[kSocket]
      })
    } else {
      assert(false)
    }
  }
}

function writeStream ({ h2stream, body, client, request, socket, contentLength, header, expectsPayload }) {
  assert(contentLength !== 0 || client[kRunning] === 0, 'stream body cannot be pipelined')

  if (client[kHTTPConnVersion] === 'h2') {
    // For HTTP/2, is enough to pipe the stream
    const pipe = pipeline(
      body,
      h2stream,
      (err) => {
        if (err) {
          util.destroy(body, err)
          util.destroy(h2stream, err)
        } else {
          request.onRequestSent()
        }
      }
    )

    pipe.on('data', onPipeData)
    pipe.once('end', () => {
      pipe.removeListener('data', onPipeData)
      util.destroy(pipe)
    })

    function onPipeData (chunk) {
      request.onBodySent(chunk)
    }

    return
  }

  let finished = false

  const writer = new AsyncWriter({ socket, request, contentLength, client, expectsPayload, header })

  const onData = function (chunk) {
    if (finished) {
      return
    }

    try {
      if (!writer.write(chunk) && this.pause) {
        this.pause()
      }
    } catch (err) {
      util.destroy(this, err)
    }
  }
  const onDrain = function () {
    if (finished) {
      return
    }

    if (body.resume) {
      body.resume()
    }
  }
  const onAbort = function () {
    if (finished) {
      return
    }
    const err = new RequestAbortedError()
    queueMicrotask(() => onFinished(err))
  }
  const onFinished = function (err) {
    if (finished) {
      return
    }

    finished = true

    assert(socket.destroyed || (socket[kWriting] && client[kRunning] <= 1))

    socket
      .off('drain', onDrain)
      .off('error', onFinished)

    body
      .removeListener('data', onData)
      .removeListener('end', onFinished)
      .removeListener('error', onFinished)
      .removeListener('close', onAbort)

    if (!err) {
      try {
        writer.end()
      } catch (er) {
        err = er
      }
    }

    writer.destroy(err)

    if (err && (err.code !== 'UND_ERR_INFO' || err.message !== 'reset')) {
      util.destroy(body, err)
    } else {
      util.destroy(body)
    }
  }

  body
    .on('data', onData)
    .on('end', onFinished)
    .on('error', onFinished)
    .on('close', onAbort)

  if (body.resume) {
    body.resume()
  }

  socket
    .on('drain', onDrain)
    .on('error', onFinished)
}

async function writeBlob ({ h2stream, body, client, request, socket, contentLength, header, expectsPayload }) {
  assert(contentLength === body.size, 'blob body must have content length')

  const isH2 = client[kHTTPConnVersion] === 'h2'
  try {
    if (contentLength != null && contentLength !== body.size) {
      throw new RequestContentLengthMismatchError()
    }

    const buffer = Buffer.from(await body.arrayBuffer())

    if (isH2) {
      h2stream.cork()
      h2stream.write(buffer)
      h2stream.uncork()
    } else {
      socket.cork()
      socket.write(`${header}content-length: ${contentLength}\r\n\r\n`, 'latin1')
      socket.write(buffer)
      socket.uncork()
    }

    request.onBodySent(buffer)
    request.onRequestSent()

    if (!expectsPayload) {
      socket[kReset] = true
    }

    resume(client)
  } catch (err) {
    util.destroy(isH2 ? h2stream : socket, err)
  }
}

async function writeIterable ({ h2stream, body, client, request, socket, contentLength, header, expectsPayload }) {
  assert(contentLength !== 0 || client[kRunning] === 0, 'iterator body cannot be pipelined')

  let callback = null
  function onDrain () {
    if (callback) {
      const cb = callback
      callback = null
      cb()
    }
  }

  const waitForDrain = () => new Promise((resolve, reject) => {
    assert(callback === null)

    if (socket[kError]) {
      reject(socket[kError])
    } else {
      callback = resolve
    }
  })

  if (client[kHTTPConnVersion] === 'h2') {
    h2stream
      .on('close', onDrain)
      .on('drain', onDrain)

    try {
      // It's up to the user to somehow abort the async iterable.
      for await (const chunk of body) {
        if (socket[kError]) {
          throw socket[kError]
        }

        const res = h2stream.write(chunk)
        request.onBodySent(chunk)
        if (!res) {
          await waitForDrain()
        }
      }
    } catch (err) {
      h2stream.destroy(err)
    } finally {
      request.onRequestSent()
      h2stream.end()
      h2stream
        .off('close', onDrain)
        .off('drain', onDrain)
    }

    return
  }

  socket
    .on('close', onDrain)
    .on('drain', onDrain)

  const writer = new AsyncWriter({ socket, request, contentLength, client, expectsPayload, header })
  try {
    // It's up to the user to somehow abort the async iterable.
    for await (const chunk of body) {
      if (socket[kError]) {
        throw socket[kError]
      }

      if (!writer.write(chunk)) {
        await waitForDrain()
      }
    }

    writer.end()
  } catch (err) {
    writer.destroy(err)
  } finally {
    socket
      .off('close', onDrain)
      .off('drain', onDrain)
  }
}

class AsyncWriter {
  constructor ({ socket, request, contentLength, client, expectsPayload, header }) {
    this.socket = socket
    this.request = request
    this.contentLength = contentLength
    this.client = client
    this.bytesWritten = 0
    this.expectsPayload = expectsPayload
    this.header = header

    socket[kWriting] = true
  }

  write (chunk) {
    const { socket, request, contentLength, client, bytesWritten, expectsPayload, header } = this

    if (socket[kError]) {
      throw socket[kError]
    }

    if (socket.destroyed) {
      return false
    }

    const len = Buffer.byteLength(chunk)
    if (!len) {
      return true
    }

    // We should defer writing chunks.
    if (contentLength !== null && bytesWritten + len > contentLength) {
      if (client[kStrictContentLength]) {
        throw new RequestContentLengthMismatchError()
      }

      process.emitWarning(new RequestContentLengthMismatchError())
    }

    socket.cork()

    if (bytesWritten === 0) {
      if (!expectsPayload) {
        socket[kReset] = true
      }

      if (contentLength === null) {
        socket.write(`${header}transfer-encoding: chunked\r\n`, 'latin1')
      } else {
        socket.write(`${header}content-length: ${contentLength}\r\n\r\n`, 'latin1')
      }
    }

    if (contentLength === null) {
      socket.write(`\r\n${len.toString(16)}\r\n`, 'latin1')
    }

    this.bytesWritten += len

    const ret = socket.write(chunk)

    socket.uncork()

    request.onBodySent(chunk)

    if (!ret) {
      if (socket[kParser].timeout && socket[kParser].timeoutType === TIMEOUT_HEADERS) {
        // istanbul ignore else: only for jest
        if (socket[kParser].timeout.refresh) {
          socket[kParser].timeout.refresh()
        }
      }
    }

    return ret
  }

  end () {
    const { socket, contentLength, client, bytesWritten, expectsPayload, header, request } = this
    request.onRequestSent()

    socket[kWriting] = false

    if (socket[kError]) {
      throw socket[kError]
    }

    if (socket.destroyed) {
      return
    }

    if (bytesWritten === 0) {
      if (expectsPayload) {
        // https://tools.ietf.org/html/rfc7230#section-3.3.2
        // A user agent SHOULD send a Content-Length in a request message when
        // no Transfer-Encoding is sent and the request method defines a meaning
        // for an enclosed payload body.

        socket.write(`${header}content-length: 0\r\n\r\n`, 'latin1')
      } else {
        socket.write(`${header}\r\n`, 'latin1')
      }
    } else if (contentLength === null) {
      socket.write('\r\n0\r\n\r\n', 'latin1')
    }

    if (contentLength !== null && bytesWritten !== contentLength) {
      if (client[kStrictContentLength]) {
        throw new RequestContentLengthMismatchError()
      } else {
        process.emitWarning(new RequestContentLengthMismatchError())
      }
    }

    if (socket[kParser].timeout && socket[kParser].timeoutType === TIMEOUT_HEADERS) {
      // istanbul ignore else: only for jest
      if (socket[kParser].timeout.refresh) {
        socket[kParser].timeout.refresh()
      }
    }

    resume(client)
  }

  destroy (err) {
    const { socket, client } = this

    socket[kWriting] = false

    if (err) {
      assert(client[kRunning] <= 1, 'pipeline should only contain this request')
      util.destroy(socket, err)
    }
  }
}

function errorRequest (client, request, err) {
  try {
    request.onError(err)
    assert(request.aborted)
  } catch (err) {
    client.emit('error', err)
  }
}

module.exports = Client


/***/ }),

/***/ 6436:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/* istanbul ignore file: only for Node 12 */

const { kConnected, kSize } = __nccwpck_require__(2785)

class CompatWeakRef {
  constructor (value) {
    this.value = value
  }

  deref () {
    return this.value[kConnected] === 0 && this.value[kSize] === 0
      ? undefined
      : this.value
  }
}

class CompatFinalizer {
  constructor (finalizer) {
    this.finalizer = finalizer
  }

  register (dispatcher, key) {
    if (dispatcher.on) {
      dispatcher.on('disconnect', () => {
        if (dispatcher[kConnected] === 0 && dispatcher[kSize] === 0) {
          this.finalizer(key)
        }
      })
    }
  }
}

module.exports = function () {
  // FIXME: remove workaround when the Node bug is fixed
  // https://github.com/nodejs/node/issues/49344#issuecomment-1741776308
  if (process.env.NODE_V8_COVERAGE) {
    return {
      WeakRef: CompatWeakRef,
      FinalizationRegistry: CompatFinalizer
    }
  }
  return {
    WeakRef: global.WeakRef || CompatWeakRef,
    FinalizationRegistry: global.FinalizationRegistry || CompatFinalizer
  }
}


/***/ }),

/***/ 663:
/***/ ((module) => {

"use strict";


// https://wicg.github.io/cookie-store/#cookie-maximum-attribute-value-size
const maxAttributeValueSize = 1024

// https://wicg.github.io/cookie-store/#cookie-maximum-name-value-pair-size
const maxNameValuePairSize = 4096

module.exports = {
  maxAttributeValueSize,
  maxNameValuePairSize
}


/***/ }),

/***/ 1724:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { parseSetCookie } = __nccwpck_require__(4408)
const { stringify, getHeadersList } = __nccwpck_require__(3121)
const { webidl } = __nccwpck_require__(1744)
const { Headers } = __nccwpck_require__(554)

/**
 * @typedef {Object} Cookie
 * @property {string} name
 * @property {string} value
 * @property {Date|number|undefined} expires
 * @property {number|undefined} maxAge
 * @property {string|undefined} domain
 * @property {string|undefined} path
 * @property {boolean|undefined} secure
 * @property {boolean|undefined} httpOnly
 * @property {'Strict'|'Lax'|'None'} sameSite
 * @property {string[]} unparsed
 */

/**
 * @param {Headers} headers
 * @returns {Record<string, string>}
 */
function getCookies (headers) {
  webidl.argumentLengthCheck(arguments, 1, { header: 'getCookies' })

  webidl.brandCheck(headers, Headers, { strict: false })

  const cookie = headers.get('cookie')
  const out = {}

  if (!cookie) {
    return out
  }

  for (const piece of cookie.split(';')) {
    const [name, ...value] = piece.split('=')

    out[name.trim()] = value.join('=')
  }

  return out
}

/**
 * @param {Headers} headers
 * @param {string} name
 * @param {{ path?: string, domain?: string }|undefined} attributes
 * @returns {void}
 */
function deleteCookie (headers, name, attributes) {
  webidl.argumentLengthCheck(arguments, 2, { header: 'deleteCookie' })

  webidl.brandCheck(headers, Headers, { strict: false })

  name = webidl.converters.DOMString(name)
  attributes = webidl.converters.DeleteCookieAttributes(attributes)

  // Matches behavior of
  // https://github.com/denoland/deno_std/blob/63827b16330b82489a04614027c33b7904e08be5/http/cookie.ts#L278
  setCookie(headers, {
    name,
    value: '',
    expires: new Date(0),
    ...attributes
  })
}

/**
 * @param {Headers} headers
 * @returns {Cookie[]}
 */
function getSetCookies (headers) {
  webidl.argumentLengthCheck(arguments, 1, { header: 'getSetCookies' })

  webidl.brandCheck(headers, Headers, { strict: false })

  const cookies = getHeadersList(headers).cookies

  if (!cookies) {
    return []
  }

  // In older versions of undici, cookies is a list of name:value.
  return cookies.map((pair) => parseSetCookie(Array.isArray(pair) ? pair[1] : pair))
}

/**
 * @param {Headers} headers
 * @param {Cookie} cookie
 * @returns {void}
 */
function setCookie (headers, cookie) {
  webidl.argumentLengthCheck(arguments, 2, { header: 'setCookie' })

  webidl.brandCheck(headers, Headers, { strict: false })

  cookie = webidl.converters.Cookie(cookie)

  const str = stringify(cookie)

  if (str) {
    headers.append('Set-Cookie', stringify(cookie))
  }
}

webidl.converters.DeleteCookieAttributes = webidl.dictionaryConverter([
  {
    converter: webidl.nullableConverter(webidl.converters.DOMString),
    key: 'path',
    defaultValue: null
  },
  {
    converter: webidl.nullableConverter(webidl.converters.DOMString),
    key: 'domain',
    defaultValue: null
  }
])

webidl.converters.Cookie = webidl.dictionaryConverter([
  {
    converter: webidl.converters.DOMString,
    key: 'name'
  },
  {
    converter: webidl.converters.DOMString,
    key: 'value'
  },
  {
    converter: webidl.nullableConverter((value) => {
      if (typeof value === 'number') {
        return webidl.converters['unsigned long long'](value)
      }

      return new Date(value)
    }),
    key: 'expires',
    defaultValue: null
  },
  {
    converter: webidl.nullableConverter(webidl.converters['long long']),
    key: 'maxAge',
    defaultValue: null
  },
  {
    converter: webidl.nullableConverter(webidl.converters.DOMString),
    key: 'domain',
    defaultValue: null
  },
  {
    converter: webidl.nullableConverter(webidl.converters.DOMString),
    key: 'path',
    defaultValue: null
  },
  {
    converter: webidl.nullableConverter(webidl.converters.boolean),
    key: 'secure',
    defaultValue: null
  },
  {
    converter: webidl.nullableConverter(webidl.converters.boolean),
    key: 'httpOnly',
    defaultValue: null
  },
  {
    converter: webidl.converters.USVString,
    key: 'sameSite',
    allowedValues: ['Strict', 'Lax', 'None']
  },
  {
    converter: webidl.sequenceConverter(webidl.converters.DOMString),
    key: 'unparsed',
    defaultValue: []
  }
])

module.exports = {
  getCookies,
  deleteCookie,
  getSetCookies,
  setCookie
}


/***/ }),

/***/ 4408:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { maxNameValuePairSize, maxAttributeValueSize } = __nccwpck_require__(663)
const { isCTLExcludingHtab } = __nccwpck_require__(3121)
const { collectASequenceOfCodePointsFast } = __nccwpck_require__(685)
const assert = __nccwpck_require__(9491)

/**
 * @description Parses the field-value attributes of a set-cookie header string.
 * @see https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4
 * @param {string} header
 * @returns if the header is invalid, null will be returned
 */
function parseSetCookie (header) {
  // 1. If the set-cookie-string contains a %x00-08 / %x0A-1F / %x7F
  //    character (CTL characters excluding HTAB): Abort these steps and
  //    ignore the set-cookie-string entirely.
  if (isCTLExcludingHtab(header)) {
    return null
  }

  let nameValuePair = ''
  let unparsedAttributes = ''
  let name = ''
  let value = ''

  // 2. If the set-cookie-string contains a %x3B (";") character:
  if (header.includes(';')) {
    // 1. The name-value-pair string consists of the characters up to,
    //    but not including, the first %x3B (";"), and the unparsed-
    //    attributes consist of the remainder of the set-cookie-string
    //    (including the %x3B (";") in question).
    const position = { position: 0 }

    nameValuePair = collectASequenceOfCodePointsFast(';', header, position)
    unparsedAttributes = header.slice(position.position)
  } else {
    // Otherwise:

    // 1. The name-value-pair string consists of all the characters
    //    contained in the set-cookie-string, and the unparsed-
    //    attributes is the empty string.
    nameValuePair = header
  }

  // 3. If the name-value-pair string lacks a %x3D ("=") character, then
  //    the name string is empty, and the value string is the value of
  //    name-value-pair.
  if (!nameValuePair.includes('=')) {
    value = nameValuePair
  } else {
    //    Otherwise, the name string consists of the characters up to, but
    //    not including, the first %x3D ("=") character, and the (possibly
    //    empty) value string consists of the characters after the first
    //    %x3D ("=") character.
    const position = { position: 0 }
    name = collectASequenceOfCodePointsFast(
      '=',
      nameValuePair,
      position
    )
    value = nameValuePair.slice(position.position + 1)
  }

  // 4. Remove any leading or trailing WSP characters from the name
  //    string and the value string.
  name = name.trim()
  value = value.trim()

  // 5. If the sum of the lengths of the name string and the value string
  //    is more than 4096 octets, abort these steps and ignore the set-
  //    cookie-string entirely.
  if (name.length + value.length > maxNameValuePairSize) {
    return null
  }

  // 6. The cookie-name is the name string, and the cookie-value is the
  //    value string.
  return {
    name, value, ...parseUnparsedAttributes(unparsedAttributes)
  }
}

/**
 * Parses the remaining attributes of a set-cookie header
 * @see https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4
 * @param {string} unparsedAttributes
 * @param {[Object.<string, unknown>]={}} cookieAttributeList
 */
function parseUnparsedAttributes (unparsedAttributes, cookieAttributeList = {}) {
  // 1. If the unparsed-attributes string is empty, skip the rest of
  //    these steps.
  if (unparsedAttributes.length === 0) {
    return cookieAttributeList
  }

  // 2. Discard the first character of the unparsed-attributes (which
  //    will be a %x3B (";") character).
  assert(unparsedAttributes[0] === ';')
  unparsedAttributes = unparsedAttributes.slice(1)

  let cookieAv = ''

  // 3. If the remaining unparsed-attributes contains a %x3B (";")
  //    character:
  if (unparsedAttributes.includes(';')) {
    // 1. Consume the characters of the unparsed-attributes up to, but
    //    not including, the first %x3B (";") character.
    cookieAv = collectASequenceOfCodePointsFast(
      ';',
      unparsedAttributes,
      { position: 0 }
    )
    unparsedAttributes = unparsedAttributes.slice(cookieAv.length)
  } else {
    // Otherwise:

    // 1. Consume the remainder of the unparsed-attributes.
    cookieAv = unparsedAttributes
    unparsedAttributes = ''
  }

  // Let the cookie-av string be the characters consumed in this step.

  let attributeName = ''
  let attributeValue = ''

  // 4. If the cookie-av string contains a %x3D ("=") character:
  if (cookieAv.includes('=')) {
    // 1. The (possibly empty) attribute-name string consists of the
    //    characters up to, but not including, the first %x3D ("=")
    //    character, and the (possibly empty) attribute-value string
    //    consists of the characters after the first %x3D ("=")
    //    character.
    const position = { position: 0 }

    attributeName = collectASequenceOfCodePointsFast(
      '=',
      cookieAv,
      position
    )
    attributeValue = cookieAv.slice(position.position + 1)
  } else {
    // Otherwise:

    // 1. The attribute-name string consists of the entire cookie-av
    //    string, and the attribute-value string is empty.
    attributeName = cookieAv
  }

  // 5. Remove any leading or trailing WSP characters from the attribute-
  //    name string and the attribute-value string.
  attributeName = attributeName.trim()
  attributeValue = attributeValue.trim()

  // 6. If the attribute-value is longer than 1024 octets, ignore the
  //    cookie-av string and return to Step 1 of this algorithm.
  if (attributeValue.length > maxAttributeValueSize) {
    return parseUnparsedAttributes(unparsedAttributes, cookieAttributeList)
  }

  // 7. Process the attribute-name and attribute-value according to the
  //    requirements in the following subsections.  (Notice that
  //    attributes with unrecognized attribute-names are ignored.)
  const attributeNameLowercase = attributeName.toLowerCase()

  // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.1
  // If the attribute-name case-insensitively matches the string
  // "Expires", the user agent MUST process the cookie-av as follows.
  if (attributeNameLowercase === 'expires') {
    // 1. Let the expiry-time be the result of parsing the attribute-value
    //    as cookie-date (see Section 5.1.1).
    const expiryTime = new Date(attributeValue)

    // 2. If the attribute-value failed to parse as a cookie date, ignore
    //    the cookie-av.

    cookieAttributeList.expires = expiryTime
  } else if (attributeNameLowercase === 'max-age') {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.2
    // If the attribute-name case-insensitively matches the string "Max-
    // Age", the user agent MUST process the cookie-av as follows.

    // 1. If the first character of the attribute-value is not a DIGIT or a
    //    "-" character, ignore the cookie-av.
    const charCode = attributeValue.charCodeAt(0)

    if ((charCode < 48 || charCode > 57) && attributeValue[0] !== '-') {
      return parseUnparsedAttributes(unparsedAttributes, cookieAttributeList)
    }

    // 2. If the remainder of attribute-value contains a non-DIGIT
    //    character, ignore the cookie-av.
    if (!/^\d+$/.test(attributeValue)) {
      return parseUnparsedAttributes(unparsedAttributes, cookieAttributeList)
    }

    // 3. Let delta-seconds be the attribute-value converted to an integer.
    const deltaSeconds = Number(attributeValue)

    // 4. Let cookie-age-limit be the maximum age of the cookie (which
    //    SHOULD be 400 days or less, see Section 4.1.2.2).

    // 5. Set delta-seconds to the smaller of its present value and cookie-
    //    age-limit.
    // deltaSeconds = Math.min(deltaSeconds * 1000, maxExpiresMs)

    // 6. If delta-seconds is less than or equal to zero (0), let expiry-
    //    time be the earliest representable date and time.  Otherwise, let
    //    the expiry-time be the current date and time plus delta-seconds
    //    seconds.
    // const expiryTime = deltaSeconds <= 0 ? Date.now() : Date.now() + deltaSeconds

    // 7. Append an attribute to the cookie-attribute-list with an
    //    attribute-name of Max-Age and an attribute-value of expiry-time.
    cookieAttributeList.maxAge = deltaSeconds
  } else if (attributeNameLowercase === 'domain') {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.3
    // If the attribute-name case-insensitively matches the string "Domain",
    // the user agent MUST process the cookie-av as follows.

    // 1. Let cookie-domain be the attribute-value.
    let cookieDomain = attributeValue

    // 2. If cookie-domain starts with %x2E ("."), let cookie-domain be
    //    cookie-domain without its leading %x2E (".").
    if (cookieDomain[0] === '.') {
      cookieDomain = cookieDomain.slice(1)
    }

    // 3. Convert the cookie-domain to lower case.
    cookieDomain = cookieDomain.toLowerCase()

    // 4. Append an attribute to the cookie-attribute-list with an
    //    attribute-name of Domain and an attribute-value of cookie-domain.
    cookieAttributeList.domain = cookieDomain
  } else if (attributeNameLowercase === 'path') {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.4
    // If the attribute-name case-insensitively matches the string "Path",
    // the user agent MUST process the cookie-av as follows.

    // 1. If the attribute-value is empty or if the first character of the
    //    attribute-value is not %x2F ("/"):
    let cookiePath = ''
    if (attributeValue.length === 0 || attributeValue[0] !== '/') {
      // 1. Let cookie-path be the default-path.
      cookiePath = '/'
    } else {
      // Otherwise:

      // 1. Let cookie-path be the attribute-value.
      cookiePath = attributeValue
    }

    // 2. Append an attribute to the cookie-attribute-list with an
    //    attribute-name of Path and an attribute-value of cookie-path.
    cookieAttributeList.path = cookiePath
  } else if (attributeNameLowercase === 'secure') {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.5
    // If the attribute-name case-insensitively matches the string "Secure",
    // the user agent MUST append an attribute to the cookie-attribute-list
    // with an attribute-name of Secure and an empty attribute-value.

    cookieAttributeList.secure = true
  } else if (attributeNameLowercase === 'httponly') {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.6
    // If the attribute-name case-insensitively matches the string
    // "HttpOnly", the user agent MUST append an attribute to the cookie-
    // attribute-list with an attribute-name of HttpOnly and an empty
    // attribute-value.

    cookieAttributeList.httpOnly = true
  } else if (attributeNameLowercase === 'samesite') {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.4.7
    // If the attribute-name case-insensitively matches the string
    // "SameSite", the user agent MUST process the cookie-av as follows:

    // 1. Let enforcement be "Default".
    let enforcement = 'Default'

    const attributeValueLowercase = attributeValue.toLowerCase()
    // 2. If cookie-av's attribute-value is a case-insensitive match for
    //    "None", set enforcement to "None".
    if (attributeValueLowercase.includes('none')) {
      enforcement = 'None'
    }

    // 3. If cookie-av's attribute-value is a case-insensitive match for
    //    "Strict", set enforcement to "Strict".
    if (attributeValueLowercase.includes('strict')) {
      enforcement = 'Strict'
    }

    // 4. If cookie-av's attribute-value is a case-insensitive match for
    //    "Lax", set enforcement to "Lax".
    if (attributeValueLowercase.includes('lax')) {
      enforcement = 'Lax'
    }

    // 5. Append an attribute to the cookie-attribute-list with an
    //    attribute-name of "SameSite" and an attribute-value of
    //    enforcement.
    cookieAttributeList.sameSite = enforcement
  } else {
    cookieAttributeList.unparsed ??= []

    cookieAttributeList.unparsed.push(`${attributeName}=${attributeValue}`)
  }

  // 8. Return to Step 1 of this algorithm.
  return parseUnparsedAttributes(unparsedAttributes, cookieAttributeList)
}

module.exports = {
  parseSetCookie,
  parseUnparsedAttributes
}


/***/ }),

/***/ 3121:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const assert = __nccwpck_require__(9491)
const { kHeadersList } = __nccwpck_require__(2785)

function isCTLExcludingHtab (value) {
  if (value.length === 0) {
    return false
  }

  for (const char of value) {
    const code = char.charCodeAt(0)

    if (
      (code >= 0x00 || code <= 0x08) ||
      (code >= 0x0A || code <= 0x1F) ||
      code === 0x7F
    ) {
      return false
    }
  }
}

/**
 CHAR           = <any US-ASCII character (octets 0 - 127)>
 token          = 1*<any CHAR except CTLs or separators>
 separators     = "(" | ")" | "<" | ">" | "@"
                | "," | ";" | ":" | "\" | <">
                | "/" | "[" | "]" | "?" | "="
                | "{" | "}" | SP | HT
 * @param {string} name
 */
function validateCookieName (name) {
  for (const char of name) {
    const code = char.charCodeAt(0)

    if (
      (code <= 0x20 || code > 0x7F) ||
      char === '(' ||
      char === ')' ||
      char === '>' ||
      char === '<' ||
      char === '@' ||
      char === ',' ||
      char === ';' ||
      char === ':' ||
      char === '\\' ||
      char === '"' ||
      char === '/' ||
      char === '[' ||
      char === ']' ||
      char === '?' ||
      char === '=' ||
      char === '{' ||
      char === '}'
    ) {
      throw new Error('Invalid cookie name')
    }
  }
}

/**
 cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
                       ; US-ASCII characters excluding CTLs,
                       ; whitespace DQUOTE, comma, semicolon,
                       ; and backslash
 * @param {string} value
 */
function validateCookieValue (value) {
  for (const char of value) {
    const code = char.charCodeAt(0)

    if (
      code < 0x21 || // exclude CTLs (0-31)
      code === 0x22 ||
      code === 0x2C ||
      code === 0x3B ||
      code === 0x5C ||
      code > 0x7E // non-ascii
    ) {
      throw new Error('Invalid header value')
    }
  }
}

/**
 * path-value        = <any CHAR except CTLs or ";">
 * @param {string} path
 */
function validateCookiePath (path) {
  for (const char of path) {
    const code = char.charCodeAt(0)

    if (code < 0x21 || char === ';') {
      throw new Error('Invalid cookie path')
    }
  }
}

/**
 * I have no idea why these values aren't allowed to be honest,
 * but Deno tests these. - Khafra
 * @param {string} domain
 */
function validateCookieDomain (domain) {
  if (
    domain.startsWith('-') ||
    domain.endsWith('.') ||
    domain.endsWith('-')
  ) {
    throw new Error('Invalid cookie domain')
  }
}

/**
 * @see https://www.rfc-editor.org/rfc/rfc7231#section-7.1.1.1
 * @param {number|Date} date
  IMF-fixdate  = day-name "," SP date1 SP time-of-day SP GMT
  ; fixed length/zone/capitalization subset of the format
  ; see Section 3.3 of [RFC5322]

  day-name     = %x4D.6F.6E ; "Mon", case-sensitive
              / %x54.75.65 ; "Tue", case-sensitive
              / %x57.65.64 ; "Wed", case-sensitive
              / %x54.68.75 ; "Thu", case-sensitive
              / %x46.72.69 ; "Fri", case-sensitive
              / %x53.61.74 ; "Sat", case-sensitive
              / %x53.75.6E ; "Sun", case-sensitive
  date1        = day SP month SP year
                  ; e.g., 02 Jun 1982

  day          = 2DIGIT
  month        = %x4A.61.6E ; "Jan", case-sensitive
              / %x46.65.62 ; "Feb", case-sensitive
              / %x4D.61.72 ; "Mar", case-sensitive
              / %x41.70.72 ; "Apr", case-sensitive
              / %x4D.61.79 ; "May", case-sensitive
              / %x4A.75.6E ; "Jun", case-sensitive
              / %x4A.75.6C ; "Jul", case-sensitive
              / %x41.75.67 ; "Aug", case-sensitive
              / %x53.65.70 ; "Sep", case-sensitive
              / %x4F.63.74 ; "Oct", case-sensitive
              / %x4E.6F.76 ; "Nov", case-sensitive
              / %x44.65.63 ; "Dec", case-sensitive
  year         = 4DIGIT

  GMT          = %x47.4D.54 ; "GMT", case-sensitive

  time-of-day  = hour ":" minute ":" second
              ; 00:00:00 - 23:59:60 (leap second)

  hour         = 2DIGIT
  minute       = 2DIGIT
  second       = 2DIGIT
 */
function toIMFDate (date) {
  if (typeof date === 'number') {
    date = new Date(date)
  }

  const days = [
    'Sun', 'Mon', 'Tue', 'Wed',
    'Thu', 'Fri', 'Sat'
  ]

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const dayName = days[date.getUTCDay()]
  const day = date.getUTCDate().toString().padStart(2, '0')
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const hour = date.getUTCHours().toString().padStart(2, '0')
  const minute = date.getUTCMinutes().toString().padStart(2, '0')
  const second = date.getUTCSeconds().toString().padStart(2, '0')

  return `${dayName}, ${day} ${month} ${year} ${hour}:${minute}:${second} GMT`
}

/**
 max-age-av        = "Max-Age=" non-zero-digit *DIGIT
                       ; In practice, both expires-av and max-age-av
                       ; are limited to dates representable by the
                       ; user agent.
 * @param {number} maxAge
 */
function validateCookieMaxAge (maxAge) {
  if (maxAge < 0) {
    throw new Error('Invalid cookie max-age')
  }
}

/**
 * @see https://www.rfc-editor.org/rfc/rfc6265#section-4.1.1
 * @param {import('./index').Cookie} cookie
 */
function stringify (cookie) {
  if (cookie.name.length === 0) {
    return null
  }

  validateCookieName(cookie.name)
  validateCookieValue(cookie.value)

  const out = [`${cookie.name}=${cookie.value}`]

  // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
  // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.2
  if (cookie.name.startsWith('__Secure-')) {
    cookie.secure = true
  }

  if (cookie.name.startsWith('__Host-')) {
    cookie.secure = true
    cookie.domain = null
    cookie.path = '/'
  }

  if (cookie.secure) {
    out.push('Secure')
  }

  if (cookie.httpOnly) {
    out.push('HttpOnly')
  }

  if (typeof cookie.maxAge === 'number') {
    validateCookieMaxAge(cookie.maxAge)
    out.push(`Max-Age=${cookie.maxAge}`)
  }

  if (cookie.domain) {
    validateCookieDomain(cookie.domain)
    out.push(`Domain=${cookie.domain}`)
  }

  if (cookie.path) {
    validateCookiePath(cookie.path)
    out.push(`Path=${cookie.path}`)
  }

  if (cookie.expires && cookie.expires.toString() !== 'Invalid Date') {
    out.push(`Expires=${toIMFDate(cookie.expires)}`)
  }

  if (cookie.sameSite) {
    out.push(`SameSite=${cookie.sameSite}`)
  }

  for (const part of cookie.unparsed) {
    if (!part.includes('=')) {
      throw new Error('Invalid unparsed')
    }

    const [key, ...value] = part.split('=')

    out.push(`${key.trim()}=${value.join('=')}`)
  }

  return out.join('; ')
}

let kHeadersListNode

function getHeadersList (headers) {
  if (headers[kHeadersList]) {
    return headers[kHeadersList]
  }

  if (!kHeadersListNode) {
    kHeadersListNode = Object.getOwnPropertySymbols(headers).find(
      (symbol) => symbol.description === 'headers list'
    )

    assert(kHeadersListNode, 'Headers cannot be parsed')
  }

  const headersList = headers[kHeadersListNode]
  assert(headersList)

  return headersList
}

module.exports = {
  isCTLExcludingHtab,
  stringify,
  getHeadersList
}


/***/ }),

/***/ 2067:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const net = __nccwpck_require__(1808)
const assert = __nccwpck_require__(9491)
const util = __nccwpck_require__(3983)
const { InvalidArgumentError, ConnectTimeoutError } = __nccwpck_require__(8045)

let tls // include tls conditionally since it is not always available

// TODO: session re-use does not wait for the first
// connection to resolve the session and might therefore
// resolve the same servername multiple times even when
// re-use is enabled.

let SessionCache
// FIXME: remove workaround when the Node bug is fixed
// https://github.com/nodejs/node/issues/49344#issuecomment-1741776308
if (global.FinalizationRegistry && !process.env.NODE_V8_COVERAGE) {
  SessionCache = class WeakSessionCache {
    constructor (maxCachedSessions) {
      this._maxCachedSessions = maxCachedSessions
      this._sessionCache = new Map()
      this._sessionRegistry = new global.FinalizationRegistry((key) => {
        if (this._sessionCache.size < this._maxCachedSessions) {
          return
        }

        const ref = this._sessionCache.get(key)
        if (ref !== undefined && ref.deref() === undefined) {
          this._sessionCache.delete(key)
        }
      })
    }

    get (sessionKey) {
      const ref = this._sessionCache.get(sessionKey)
      return ref ? ref.deref() : null
    }

    set (sessionKey, session) {
      if (this._maxCachedSessions === 0) {
        return
      }

      this._sessionCache.set(sessionKey, new WeakRef(session))
      this._sessionRegistry.register(session, sessionKey)
    }
  }
} else {
  SessionCache = class SimpleSessionCache {
    constructor (maxCachedSessions) {
      this._maxCachedSessions = maxCachedSessions
      this._sessionCache = new Map()
    }

    get (sessionKey) {
      return this._sessionCache.get(sessionKey)
    }

    set (sessionKey, session) {
      if (this._maxCachedSessions === 0) {
        return
      }

      if (this._sessionCache.size >= this._maxCachedSessions) {
        // remove the oldest session
        const { value: oldestKey } = this._sessionCache.keys().next()
        this._sessionCache.delete(oldestKey)
      }

      this._sessionCache.set(sessionKey, session)
    }
  }
}

function buildConnector ({ allowH2, maxCachedSessions, socketPath, timeout, ...opts }) {
  if (maxCachedSessions != null && (!Number.isInteger(maxCachedSessions) || maxCachedSessions < 0)) {
    throw new InvalidArgumentError('maxCachedSessions must be a positive integer or zero')
  }

  const options = { path: socketPath, ...opts }
  const sessionCache = new SessionCache(maxCachedSessions == null ? 100 : maxCachedSessions)
  timeout = timeout == null ? 10e3 : timeout
  allowH2 = allowH2 != null ? allowH2 : false
  return function connect ({ hostname, host, protocol, port, servername, localAddress, httpSocket }, callback) {
    let socket
    if (protocol === 'https:') {
      if (!tls) {
        tls = __nccwpck_require__(4404)
      }
      servername = servername || options.servername || util.getServerName(host) || null

      const sessionKey = servername || hostname
      const session = sessionCache.get(sessionKey) || null

      assert(sessionKey)

      socket = tls.connect({
        highWaterMark: 16384, // TLS in node can't have bigger HWM anyway...
        ...options,
        servername,
        session,
        localAddress,
        // TODO(HTTP/2): Add support for h2c
        ALPNProtocols: allowH2 ? ['http/1.1', 'h2'] : ['http/1.1'],
        socket: httpSocket, // upgrade socket connection
        port: port || 443,
        host: hostname
      })

      socket
        .on('session', function (session) {
          // TODO (fix): Can a session become invalid once established? Don't think so?
          sessionCache.set(sessionKey, session)
        })
    } else {
      assert(!httpSocket, 'httpSocket can only be sent on TLS update')
      socket = net.connect({
        highWaterMark: 64 * 1024, // Same as nodejs fs streams.
        ...options,
        localAddress,
        port: port || 80,
        host: hostname
      })
    }

    // Set TCP keep alive options on the socket here instead of in connect() for the case of assigning the socket
    if (options.keepAlive == null || options.keepAlive) {
      const keepAliveInitialDelay = options.keepAliveInitialDelay === undefined ? 60e3 : options.keepAliveInitialDelay
      socket.setKeepAlive(true, keepAliveInitialDelay)
    }

    const cancelTimeout = setupTimeout(() => onConnectTimeout(socket), timeout)

    socket
      .setNoDelay(true)
      .once(protocol === 'https:' ? 'secureConnect' : 'connect', function () {
        cancelTimeout()

        if (callback) {
          const cb = callback
          callback = null
          cb(null, this)
        }
      })
      .on('error', function (err) {
        cancelTimeout()

        if (callback) {
          const cb = callback
          callback = null
          cb(err)
        }
      })

    return socket
  }
}

function setupTimeout (onConnectTimeout, timeout) {
  if (!timeout) {
    return () => {}
  }

  let s1 = null
  let s2 = null
  const timeoutId = setTimeout(() => {
    // setImmediate is added to make sure that we priotorise socket error events over timeouts
    s1 = setImmediate(() => {
      if (process.platform === 'win32') {
        // Windows needs an extra setImmediate probably due to implementation differences in the socket logic
        s2 = setImmediate(() => onConnectTimeout())
      } else {
        onConnectTimeout()
      }
    })
  }, timeout)
  return () => {
    clearTimeout(timeoutId)
    clearImmediate(s1)
    clearImmediate(s2)
  }
}

function onConnectTimeout (socket) {
  util.destroy(socket, new ConnectTimeoutError())
}

module.exports = buildConnector


/***/ }),

/***/ 4462:
/***/ ((module) => {

"use strict";


/** @type {Record<string, string | undefined>} */
const headerNameLowerCasedRecord = {}

// https://developer.mozilla.org/docs/Web/HTTP/Headers
const wellknownHeaderNames = [
  'Accept',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Ranges',
  'Access-Control-Allow-Credentials',
  'Access-Control-Allow-Headers',
  'Access-Control-Allow-Methods',
  'Access-Control-Allow-Origin',
  'Access-Control-Expose-Headers',
  'Access-Control-Max-Age',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Method',
  'Age',
  'Allow',
  'Alt-Svc',
  'Alt-Used',
  'Authorization',
  'Cache-Control',
  'Clear-Site-Data',
  'Connection',
  'Content-Disposition',
  'Content-Encoding',
  'Content-Language',
  'Content-Length',
  'Content-Location',
  'Content-Range',
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
  'Content-Type',
  'Cookie',
  'Cross-Origin-Embedder-Policy',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Date',
  'Device-Memory',
  'Downlink',
  'ECT',
  'ETag',
  'Expect',
  'Expect-CT',
  'Expires',
  'Forwarded',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Keep-Alive',
  'Last-Modified',
  'Link',
  'Location',
  'Max-Forwards',
  'Origin',
  'Permissions-Policy',
  'Pragma',
  'Proxy-Authenticate',
  'Proxy-Authorization',
  'RTT',
  'Range',
  'Referer',
  'Referrer-Policy',
  'Refresh',
  'Retry-After',
  'Sec-WebSocket-Accept',
  'Sec-WebSocket-Extensions',
  'Sec-WebSocket-Key',
  'Sec-WebSocket-Protocol',
  'Sec-WebSocket-Version',
  'Server',
  'Server-Timing',
  'Service-Worker-Allowed',
  'Service-Worker-Navigation-Preload',
  'Set-Cookie',
  'SourceMap',
  'Strict-Transport-Security',
  'Supports-Loading-Mode',
  'TE',
  'Timing-Allow-Origin',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade',
  'Upgrade-Insecure-Requests',
  'User-Agent',
  'Vary',
  'Via',
  'WWW-Authenticate',
  'X-Content-Type-Options',
  'X-DNS-Prefetch-Control',
  'X-Frame-Options',
  'X-Permitted-Cross-Domain-Policies',
  'X-Powered-By',
  'X-Requested-With',
  'X-XSS-Protection'
]

for (let i = 0; i < wellknownHeaderNames.length; ++i) {
  const key = wellknownHeaderNames[i]
  const lowerCasedKey = key.toLowerCase()
  headerNameLowerCasedRecord[key] = headerNameLowerCasedRecord[lowerCasedKey] =
    lowerCasedKey
}

// Note: object prototypes should not be able to be referenced. e.g. `Object#hasOwnProperty`.
Object.setPrototypeOf(headerNameLowerCasedRecord, null)

module.exports = {
  wellknownHeaderNames,
  headerNameLowerCasedRecord
}


/***/ }),

/***/ 8045:
/***/ ((module) => {

"use strict";


class UndiciError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UndiciError'
    this.code = 'UND_ERR'
  }
}

class ConnectTimeoutError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ConnectTimeoutError)
    this.name = 'ConnectTimeoutError'
    this.message = message || 'Connect Timeout Error'
    this.code = 'UND_ERR_CONNECT_TIMEOUT'
  }
}

class HeadersTimeoutError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, HeadersTimeoutError)
    this.name = 'HeadersTimeoutError'
    this.message = message || 'Headers Timeout Error'
    this.code = 'UND_ERR_HEADERS_TIMEOUT'
  }
}

class HeadersOverflowError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, HeadersOverflowError)
    this.name = 'HeadersOverflowError'
    this.message = message || 'Headers Overflow Error'
    this.code = 'UND_ERR_HEADERS_OVERFLOW'
  }
}

class BodyTimeoutError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, BodyTimeoutError)
    this.name = 'BodyTimeoutError'
    this.message = message || 'Body Timeout Error'
    this.code = 'UND_ERR_BODY_TIMEOUT'
  }
}

class ResponseStatusCodeError extends UndiciError {
  constructor (message, statusCode, headers, body) {
    super(message)
    Error.captureStackTrace(this, ResponseStatusCodeError)
    this.name = 'ResponseStatusCodeError'
    this.message = message || 'Response Status Code Error'
    this.code = 'UND_ERR_RESPONSE_STATUS_CODE'
    this.body = body
    this.status = statusCode
    this.statusCode = statusCode
    this.headers = headers
  }
}

class InvalidArgumentError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, InvalidArgumentError)
    this.name = 'InvalidArgumentError'
    this.message = message || 'Invalid Argument Error'
    this.code = 'UND_ERR_INVALID_ARG'
  }
}

class InvalidReturnValueError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, InvalidReturnValueError)
    this.name = 'InvalidReturnValueError'
    this.message = message || 'Invalid Return Value Error'
    this.code = 'UND_ERR_INVALID_RETURN_VALUE'
  }
}

class RequestAbortedError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, RequestAbortedError)
    this.name = 'AbortError'
    this.message = message || 'Request aborted'
    this.code = 'UND_ERR_ABORTED'
  }
}

class InformationalError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, InformationalError)
    this.name = 'InformationalError'
    this.message = message || 'Request information'
    this.code = 'UND_ERR_INFO'
  }
}

class RequestContentLengthMismatchError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, RequestContentLengthMismatchError)
    this.name = 'RequestContentLengthMismatchError'
    this.message = message || 'Request body length does not match content-length header'
    this.code = 'UND_ERR_REQ_CONTENT_LENGTH_MISMATCH'
  }
}

class ResponseContentLengthMismatchError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ResponseContentLengthMismatchError)
    this.name = 'ResponseContentLengthMismatchError'
    this.message = message || 'Response body length does not match content-length header'
    this.code = 'UND_ERR_RES_CONTENT_LENGTH_MISMATCH'
  }
}

class ClientDestroyedError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ClientDestroyedError)
    this.name = 'ClientDestroyedError'
    this.message = message || 'The client is destroyed'
    this.code = 'UND_ERR_DESTROYED'
  }
}

class ClientClosedError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ClientClosedError)
    this.name = 'ClientClosedError'
    this.message = message || 'The client is closed'
    this.code = 'UND_ERR_CLOSED'
  }
}

class SocketError extends UndiciError {
  constructor (message, socket) {
    super(message)
    Error.captureStackTrace(this, SocketError)
    this.name = 'SocketError'
    this.message = message || 'Socket error'
    this.code = 'UND_ERR_SOCKET'
    this.socket = socket
  }
}

class NotSupportedError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, NotSupportedError)
    this.name = 'NotSupportedError'
    this.message = message || 'Not supported error'
    this.code = 'UND_ERR_NOT_SUPPORTED'
  }
}

class BalancedPoolMissingUpstreamError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, NotSupportedError)
    this.name = 'MissingUpstreamError'
    this.message = message || 'No upstream has been added to the BalancedPool'
    this.code = 'UND_ERR_BPL_MISSING_UPSTREAM'
  }
}

class HTTPParserError extends Error {
  constructor (message, code, data) {
    super(message)
    Error.captureStackTrace(this, HTTPParserError)
    this.name = 'HTTPParserError'
    this.code = code ? `HPE_${code}` : undefined
    this.data = data ? data.toString() : undefined
  }
}

class ResponseExceededMaxSizeError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ResponseExceededMaxSizeError)
    this.name = 'ResponseExceededMaxSizeError'
    this.message = message || 'Response content exceeded max size'
    this.code = 'UND_ERR_RES_EXCEEDED_MAX_SIZE'
  }
}

class RequestRetryError extends UndiciError {
  constructor (message, code, { headers, data }) {
    super(message)
    Error.captureStackTrace(this, RequestRetryError)
    this.name = 'RequestRetryError'
    this.message = message || 'Request retry error'
    this.code = 'UND_ERR_REQ_RETRY'
    this.statusCode = code
    this.data = data
    this.headers = headers
  }
}

module.exports = {
  HTTPParserError,
  UndiciError,
  HeadersTimeoutError,
  HeadersOverflowError,
  BodyTimeoutError,
  RequestContentLengthMismatchError,
  ConnectTimeoutError,
  ResponseStatusCodeError,
  InvalidArgumentError,
  InvalidReturnValueError,
  RequestAbortedError,
  ClientDestroyedError,
  ClientClosedError,
  InformationalError,
  SocketError,
  NotSupportedError,
  ResponseContentLengthMismatchError,
  BalancedPoolMissingUpstreamError,
  ResponseExceededMaxSizeError,
  RequestRetryError
}


/***/ }),

/***/ 2905:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  InvalidArgumentError,
  NotSupportedError
} = __nccwpck_require__(8045)
const assert = __nccwpck_require__(9491)
const { kHTTP2BuildRequest, kHTTP2CopyHeaders, kHTTP1BuildRequest } = __nccwpck_require__(2785)
const util = __nccwpck_require__(3983)

// tokenRegExp and headerCharRegex have been lifted from
// https://github.com/nodejs/node/blob/main/lib/_http_common.js

/**
 * Verifies that the given val is a valid HTTP token
 * per the rules defined in RFC 7230
 * See https://tools.ietf.org/html/rfc7230#section-3.2.6
 */
const tokenRegExp = /^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]+$/

/**
 * Matches if val contains an invalid field-vchar
 *  field-value    = *( field-content / obs-fold )
 *  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *  field-vchar    = VCHAR / obs-text
 */
const headerCharRegex = /[^\t\x20-\x7e\x80-\xff]/

// Verifies that a given path is valid does not contain control chars \x00 to \x20
const invalidPathRegex = /[^\u0021-\u00ff]/

const kHandler = Symbol('handler')

const channels = {}

let extractBody

try {
  const diagnosticsChannel = __nccwpck_require__(7643)
  channels.create = diagnosticsChannel.channel('undici:request:create')
  channels.bodySent = diagnosticsChannel.channel('undici:request:bodySent')
  channels.headers = diagnosticsChannel.channel('undici:request:headers')
  channels.trailers = diagnosticsChannel.channel('undici:request:trailers')
  channels.error = diagnosticsChannel.channel('undici:request:error')
} catch {
  channels.create = { hasSubscribers: false }
  channels.bodySent = { hasSubscribers: false }
  channels.headers = { hasSubscribers: false }
  channels.trailers = { hasSubscribers: false }
  channels.error = { hasSubscribers: false }
}

class Request {
  constructor (origin, {
    path,
    method,
    body,
    headers,
    query,
    idempotent,
    blocking,
    upgrade,
    headersTimeout,
    bodyTimeout,
    reset,
    throwOnError,
    expectContinue
  }, handler) {
    if (typeof path !== 'string') {
      throw new InvalidArgumentError('path must be a string')
    } else if (
      path[0] !== '/' &&
      !(path.startsWith('http://') || path.startsWith('https://')) &&
      method !== 'CONNECT'
    ) {
      throw new InvalidArgumentError('path must be an absolute URL or start with a slash')
    } else if (invalidPathRegex.exec(path) !== null) {
      throw new InvalidArgumentError('invalid request path')
    }

    if (typeof method !== 'string') {
      throw new InvalidArgumentError('method must be a string')
    } else if (tokenRegExp.exec(method) === null) {
      throw new InvalidArgumentError('invalid request method')
    }

    if (upgrade && typeof upgrade !== 'string') {
      throw new InvalidArgumentError('upgrade must be a string')
    }

    if (headersTimeout != null && (!Number.isFinite(headersTimeout) || headersTimeout < 0)) {
      throw new InvalidArgumentError('invalid headersTimeout')
    }

    if (bodyTimeout != null && (!Number.isFinite(bodyTimeout) || bodyTimeout < 0)) {
      throw new InvalidArgumentError('invalid bodyTimeout')
    }

    if (reset != null && typeof reset !== 'boolean') {
      throw new InvalidArgumentError('invalid reset')
    }

    if (expectContinue != null && typeof expectContinue !== 'boolean') {
      throw new InvalidArgumentError('invalid expectContinue')
    }

    this.headersTimeout = headersTimeout

    this.bodyTimeout = bodyTimeout

    this.throwOnError = throwOnError === true

    this.method = method

    this.abort = null

    if (body == null) {
      this.body = null
    } else if (util.isStream(body)) {
      this.body = body

      const rState = this.body._readableState
      if (!rState || !rState.autoDestroy) {
        this.endHandler = function autoDestroy () {
          util.destroy(this)
        }
        this.body.on('end', this.endHandler)
      }

      this.errorHandler = err => {
        if (this.abort) {
          this.abort(err)
        } else {
          this.error = err
        }
      }
      this.body.on('error', this.errorHandler)
    } else if (util.isBuffer(body)) {
      this.body = body.byteLength ? body : null
    } else if (ArrayBuffer.isView(body)) {
      this.body = body.buffer.byteLength ? Buffer.from(body.buffer, body.byteOffset, body.byteLength) : null
    } else if (body instanceof ArrayBuffer) {
      this.body = body.byteLength ? Buffer.from(body) : null
    } else if (typeof body === 'string') {
      this.body = body.length ? Buffer.from(body) : null
    } else if (util.isFormDataLike(body) || util.isIterable(body) || util.isBlobLike(body)) {
      this.body = body
    } else {
      throw new InvalidArgumentError('body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable')
    }

    this.completed = false

    this.aborted = false

    this.upgrade = upgrade || null

    this.path = query ? util.buildURL(path, query) : path

    this.origin = origin

    this.idempotent = idempotent == null
      ? method === 'HEAD' || method === 'GET'
      : idempotent

    this.blocking = blocking == null ? false : blocking

    this.reset = reset == null ? null : reset

    this.host = null

    this.contentLength = null

    this.contentType = null

    this.headers = ''

    // Only for H2
    this.expectContinue = expectContinue != null ? expectContinue : false

    if (Array.isArray(headers)) {
      if (headers.length % 2 !== 0) {
        throw new InvalidArgumentError('headers array must be even')
      }
      for (let i = 0; i < headers.length; i += 2) {
        processHeader(this, headers[i], headers[i + 1])
      }
    } else if (headers && typeof headers === 'object') {
      const keys = Object.keys(headers)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        processHeader(this, key, headers[key])
      }
    } else if (headers != null) {
      throw new InvalidArgumentError('headers must be an object or an array')
    }

    if (util.isFormDataLike(this.body)) {
      if (util.nodeMajor < 16 || (util.nodeMajor === 16 && util.nodeMinor < 8)) {
        throw new InvalidArgumentError('Form-Data bodies are only supported in node v16.8 and newer.')
      }

      if (!extractBody) {
        extractBody = (__nccwpck_require__(1472).extractBody)
      }

      const [bodyStream, contentType] = extractBody(body)
      if (this.contentType == null) {
        this.contentType = contentType
        this.headers += `content-type: ${contentType}\r\n`
      }
      this.body = bodyStream.stream
      this.contentLength = bodyStream.length
    } else if (util.isBlobLike(body) && this.contentType == null && body.type) {
      this.contentType = body.type
      this.headers += `content-type: ${body.type}\r\n`
    }

    util.validateHandler(handler, method, upgrade)

    this.servername = util.getServerName(this.host)

    this[kHandler] = handler

    if (channels.create.hasSubscribers) {
      channels.create.publish({ request: this })
    }
  }

  onBodySent (chunk) {
    if (this[kHandler].onBodySent) {
      try {
        return this[kHandler].onBodySent(chunk)
      } catch (err) {
        this.abort(err)
      }
    }
  }

  onRequestSent () {
    if (channels.bodySent.hasSubscribers) {
      channels.bodySent.publish({ request: this })
    }

    if (this[kHandler].onRequestSent) {
      try {
        return this[kHandler].onRequestSent()
      } catch (err) {
        this.abort(err)
      }
    }
  }

  onConnect (abort) {
    assert(!this.aborted)
    assert(!this.completed)

    if (this.error) {
      abort(this.error)
    } else {
      this.abort = abort
      return this[kHandler].onConnect(abort)
    }
  }

  onHeaders (statusCode, headers, resume, statusText) {
    assert(!this.aborted)
    assert(!this.completed)

    if (channels.headers.hasSubscribers) {
      channels.headers.publish({ request: this, response: { statusCode, headers, statusText } })
    }

    try {
      return this[kHandler].onHeaders(statusCode, headers, resume, statusText)
    } catch (err) {
      this.abort(err)
    }
  }

  onData (chunk) {
    assert(!this.aborted)
    assert(!this.completed)

    try {
      return this[kHandler].onData(chunk)
    } catch (err) {
      this.abort(err)
      return false
    }
  }

  onUpgrade (statusCode, headers, socket) {
    assert(!this.aborted)
    assert(!this.completed)

    return this[kHandler].onUpgrade(statusCode, headers, socket)
  }

  onComplete (trailers) {
    this.onFinally()

    assert(!this.aborted)

    this.completed = true
    if (channels.trailers.hasSubscribers) {
      channels.trailers.publish({ request: this, trailers })
    }

    try {
      return this[kHandler].onComplete(trailers)
    } catch (err) {
      // TODO (fix): This might be a bad idea?
      this.onError(err)
    }
  }

  onError (error) {
    this.onFinally()

    if (channels.error.hasSubscribers) {
      channels.error.publish({ request: this, error })
    }

    if (this.aborted) {
      return
    }
    this.aborted = true

    return this[kHandler].onError(error)
  }

  onFinally () {
    if (this.errorHandler) {
      this.body.off('error', this.errorHandler)
      this.errorHandler = null
    }

    if (this.endHandler) {
      this.body.off('end', this.endHandler)
      this.endHandler = null
    }
  }

  // TODO: adjust to support H2
  addHeader (key, value) {
    processHeader(this, key, value)
    return this
  }

  static [kHTTP1BuildRequest] (origin, opts, handler) {
    // TODO: Migrate header parsing here, to make Requests
    // HTTP agnostic
    return new Request(origin, opts, handler)
  }

  static [kHTTP2BuildRequest] (origin, opts, handler) {
    const headers = opts.headers
    opts = { ...opts, headers: null }

    const request = new Request(origin, opts, handler)

    request.headers = {}

    if (Array.isArray(headers)) {
      if (headers.length % 2 !== 0) {
        throw new InvalidArgumentError('headers array must be even')
      }
      for (let i = 0; i < headers.length; i += 2) {
        processHeader(request, headers[i], headers[i + 1], true)
      }
    } else if (headers && typeof headers === 'object') {
      const keys = Object.keys(headers)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        processHeader(request, key, headers[key], true)
      }
    } else if (headers != null) {
      throw new InvalidArgumentError('headers must be an object or an array')
    }

    return request
  }

  static [kHTTP2CopyHeaders] (raw) {
    const rawHeaders = raw.split('\r\n')
    const headers = {}

    for (const header of rawHeaders) {
      const [key, value] = header.split(': ')

      if (value == null || value.length === 0) continue

      if (headers[key]) headers[key] += `,${value}`
      else headers[key] = value
    }

    return headers
  }
}

function processHeaderValue (key, val, skipAppend) {
  if (val && typeof val === 'object') {
    throw new InvalidArgumentError(`invalid ${key} header`)
  }

  val = val != null ? `${val}` : ''

  if (headerCharRegex.exec(val) !== null) {
    throw new InvalidArgumentError(`invalid ${key} header`)
  }

  return skipAppend ? val : `${key}: ${val}\r\n`
}

function processHeader (request, key, val, skipAppend = false) {
  if (val && (typeof val === 'object' && !Array.isArray(val))) {
    throw new InvalidArgumentError(`invalid ${key} header`)
  } else if (val === undefined) {
    return
  }

  if (
    request.host === null &&
    key.length === 4 &&
    key.toLowerCase() === 'host'
  ) {
    if (headerCharRegex.exec(val) !== null) {
      throw new InvalidArgumentError(`invalid ${key} header`)
    }
    // Consumed by Client
    request.host = val
  } else if (
    request.contentLength === null &&
    key.length === 14 &&
    key.toLowerCase() === 'content-length'
  ) {
    request.contentLength = parseInt(val, 10)
    if (!Number.isFinite(request.contentLength)) {
      throw new InvalidArgumentError('invalid content-length header')
    }
  } else if (
    request.contentType === null &&
    key.length === 12 &&
    key.toLowerCase() === 'content-type'
  ) {
    request.contentType = val
    if (skipAppend) request.headers[key] = processHeaderValue(key, val, skipAppend)
    else request.headers += processHeaderValue(key, val)
  } else if (
    key.length === 17 &&
    key.toLowerCase() === 'transfer-encoding'
  ) {
    throw new InvalidArgumentError('invalid transfer-encoding header')
  } else if (
    key.length === 10 &&
    key.toLowerCase() === 'connection'
  ) {
    const value = typeof val === 'string' ? val.toLowerCase() : null
    if (value !== 'close' && value !== 'keep-alive') {
      throw new InvalidArgumentError('invalid connection header')
    } else if (value === 'close') {
      request.reset = true
    }
  } else if (
    key.length === 10 &&
    key.toLowerCase() === 'keep-alive'
  ) {
    throw new InvalidArgumentError('invalid keep-alive header')
  } else if (
    key.length === 7 &&
    key.toLowerCase() === 'upgrade'
  ) {
    throw new InvalidArgumentError('invalid upgrade header')
  } else if (
    key.length === 6 &&
    key.toLowerCase() === 'expect'
  ) {
    throw new NotSupportedError('expect header not supported')
  } else if (tokenRegExp.exec(key) === null) {
    throw new InvalidArgumentError('invalid header key')
  } else {
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        if (skipAppend) {
          if (request.headers[key]) request.headers[key] += `,${processHeaderValue(key, val[i], skipAppend)}`
          else request.headers[key] = processHeaderValue(key, val[i], skipAppend)
        } else {
          request.headers += processHeaderValue(key, val[i])
        }
      }
    } else {
      if (skipAppend) request.headers[key] = processHeaderValue(key, val, skipAppend)
      else request.headers += processHeaderValue(key, val)
    }
  }
}

module.exports = Request


/***/ }),

/***/ 2785:
/***/ ((module) => {

module.exports = {
  kClose: Symbol('close'),
  kDestroy: Symbol('destroy'),
  kDispatch: Symbol('dispatch'),
  kUrl: Symbol('url'),
  kWriting: Symbol('writing'),
  kResuming: Symbol('resuming'),
  kQueue: Symbol('queue'),
  kConnect: Symbol('connect'),
  kConnecting: Symbol('connecting'),
  kHeadersList: Symbol('headers list'),
  kKeepAliveDefaultTimeout: Symbol('default keep alive timeout'),
  kKeepAliveMaxTimeout: Symbol('max keep alive timeout'),
  kKeepAliveTimeoutThreshold: Symbol('keep alive timeout threshold'),
  kKeepAliveTimeoutValue: Symbol('keep alive timeout'),
  kKeepAlive: Symbol('keep alive'),
  kHeadersTimeout: Symbol('headers timeout'),
  kBodyTimeout: Symbol('body timeout'),
  kServerName: Symbol('server name'),
  kLocalAddress: Symbol('local address'),
  kHost: Symbol('host'),
  kNoRef: Symbol('no ref'),
  kBodyUsed: Symbol('used'),
  kRunning: Symbol('running'),
  kBlocking: Symbol('blocking'),
  kPending: Symbol('pending'),
  kSize: Symbol('size'),
  kBusy: Symbol('busy'),
  kQueued: Symbol('queued'),
  kFree: Symbol('free'),
  kConnected: Symbol('connected'),
  kClosed: Symbol('closed'),
  kNeedDrain: Symbol('need drain'),
  kReset: Symbol('reset'),
  kDestroyed: Symbol.for('nodejs.stream.destroyed'),
  kMaxHeadersSize: Symbol('max headers size'),
  kRunningIdx: Symbol('running index'),
  kPendingIdx: Symbol('pending index'),
  kError: Symbol('error'),
  kClients: Symbol('clients'),
  kClient: Symbol('client'),
  kParser: Symbol('parser'),
  kOnDestroyed: Symbol('destroy callbacks'),
  kPipelining: Symbol('pipelining'),
  kSocket: Symbol('socket'),
  kHostHeader: Symbol('host header'),
  kConnector: Symbol('connector'),
  kStrictContentLength: Symbol('strict content length'),
  kMaxRedirections: Symbol('maxRedirections'),
  kMaxRequests: Symbol('maxRequestsPerClient'),
  kProxy: Symbol('proxy agent options'),
  kCounter: Symbol('socket request counter'),
  kInterceptors: Symbol('dispatch interceptors'),
  kMaxResponseSize: Symbol('max response size'),
  kHTTP2Session: Symbol('http2Session'),
  kHTTP2SessionState: Symbol('http2Session state'),
  kHTTP2BuildRequest: Symbol('http2 build request'),
  kHTTP1BuildRequest: Symbol('http1 build request'),
  kHTTP2CopyHeaders: Symbol('http2 copy headers'),
  kHTTPConnVersion: Symbol('http connection version'),
  kRetryHandlerDefaultRetry: Symbol('retry agent default retry'),
  kConstruct: Symbol('constructable')
}


/***/ }),

/***/ 3983:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const assert = __nccwpck_require__(9491)
const { kDestroyed, kBodyUsed } = __nccwpck_require__(2785)
const { IncomingMessage } = __nccwpck_require__(3685)
const stream = __nccwpck_require__(2781)
const net = __nccwpck_require__(1808)
const { InvalidArgumentError } = __nccwpck_require__(8045)
const { Blob } = __nccwpck_require__(4300)
const nodeUtil = __nccwpck_require__(3837)
const { stringify } = __nccwpck_require__(3477)
const { headerNameLowerCasedRecord } = __nccwpck_require__(4462)

const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(v => Number(v))

function nop () {}

function isStream (obj) {
  return obj && typeof obj === 'object' && typeof obj.pipe === 'function' && typeof obj.on === 'function'
}

// based on https://github.com/node-fetch/fetch-blob/blob/8ab587d34080de94140b54f07168451e7d0b655e/index.js#L229-L241 (MIT License)
function isBlobLike (object) {
  return (Blob && object instanceof Blob) || (
    object &&
    typeof object === 'object' &&
    (typeof object.stream === 'function' ||
      typeof object.arrayBuffer === 'function') &&
    /^(Blob|File)$/.test(object[Symbol.toStringTag])
  )
}

function buildURL (url, queryParams) {
  if (url.includes('?') || url.includes('#')) {
    throw new Error('Query params cannot be passed when url already contains "?" or "#".')
  }

  const stringified = stringify(queryParams)

  if (stringified) {
    url += '?' + stringified
  }

  return url
}

function parseURL (url) {
  if (typeof url === 'string') {
    url = new URL(url)

    if (!/^https?:/.test(url.origin || url.protocol)) {
      throw new InvalidArgumentError('Invalid URL protocol: the URL must start with `http:` or `https:`.')
    }

    return url
  }

  if (!url || typeof url !== 'object') {
    throw new InvalidArgumentError('Invalid URL: The URL argument must be a non-null object.')
  }

  if (!/^https?:/.test(url.origin || url.protocol)) {
    throw new InvalidArgumentError('Invalid URL protocol: the URL must start with `http:` or `https:`.')
  }

  if (!(url instanceof URL)) {
    if (url.port != null && url.port !== '' && !Number.isFinite(parseInt(url.port))) {
      throw new InvalidArgumentError('Invalid URL: port must be a valid integer or a string representation of an integer.')
    }

    if (url.path != null && typeof url.path !== 'string') {
      throw new InvalidArgumentError('Invalid URL path: the path must be a string or null/undefined.')
    }

    if (url.pathname != null && typeof url.pathname !== 'string') {
      throw new InvalidArgumentError('Invalid URL pathname: the pathname must be a string or null/undefined.')
    }

    if (url.hostname != null && typeof url.hostname !== 'string') {
      throw new InvalidArgumentError('Invalid URL hostname: the hostname must be a string or null/undefined.')
    }

    if (url.origin != null && typeof url.origin !== 'string') {
      throw new InvalidArgumentError('Invalid URL origin: the origin must be a string or null/undefined.')
    }

    const port = url.port != null
      ? url.port
      : (url.protocol === 'https:' ? 443 : 80)
    let origin = url.origin != null
      ? url.origin
      : `${url.protocol}//${url.hostname}:${port}`
    let path = url.path != null
      ? url.path
      : `${url.pathname || ''}${url.search || ''}`

    if (origin.endsWith('/')) {
      origin = origin.substring(0, origin.length - 1)
    }

    if (path && !path.startsWith('/')) {
      path = `/${path}`
    }
    // new URL(path, origin) is unsafe when `path` contains an absolute URL
    // From https://developer.mozilla.org/en-US/docs/Web/API/URL/URL:
    // If first parameter is a relative URL, second param is required, and will be used as the base URL.
    // If first parameter is an absolute URL, a given second param will be ignored.
    url = new URL(origin + path)
  }

  return url
}

function parseOrigin (url) {
  url = parseURL(url)

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new InvalidArgumentError('invalid url')
  }

  return url
}

function getHostname (host) {
  if (host[0] === '[') {
    const idx = host.indexOf(']')

    assert(idx !== -1)
    return host.substring(1, idx)
  }

  const idx = host.indexOf(':')
  if (idx === -1) return host

  return host.substring(0, idx)
}

// IP addresses are not valid server names per RFC6066
// > Currently, the only server names supported are DNS hostnames
function getServerName (host) {
  if (!host) {
    return null
  }

  assert.strictEqual(typeof host, 'string')

  const servername = getHostname(host)
  if (net.isIP(servername)) {
    return ''
  }

  return servername
}

function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function isAsyncIterable (obj) {
  return !!(obj != null && typeof obj[Symbol.asyncIterator] === 'function')
}

function isIterable (obj) {
  return !!(obj != null && (typeof obj[Symbol.iterator] === 'function' || typeof obj[Symbol.asyncIterator] === 'function'))
}

function bodyLength (body) {
  if (body == null) {
    return 0
  } else if (isStream(body)) {
    const state = body._readableState
    return state && state.objectMode === false && state.ended === true && Number.isFinite(state.length)
      ? state.length
      : null
  } else if (isBlobLike(body)) {
    return body.size != null ? body.size : null
  } else if (isBuffer(body)) {
    return body.byteLength
  }

  return null
}

function isDestroyed (stream) {
  return !stream || !!(stream.destroyed || stream[kDestroyed])
}

function isReadableAborted (stream) {
  const state = stream && stream._readableState
  return isDestroyed(stream) && state && !state.endEmitted
}

function destroy (stream, err) {
  if (stream == null || !isStream(stream) || isDestroyed(stream)) {
    return
  }

  if (typeof stream.destroy === 'function') {
    if (Object.getPrototypeOf(stream).constructor === IncomingMessage) {
      // See: https://github.com/nodejs/node/pull/38505/files
      stream.socket = null
    }

    stream.destroy(err)
  } else if (err) {
    process.nextTick((stream, err) => {
      stream.emit('error', err)
    }, stream, err)
  }

  if (stream.destroyed !== true) {
    stream[kDestroyed] = true
  }
}

const KEEPALIVE_TIMEOUT_EXPR = /timeout=(\d+)/
function parseKeepAliveTimeout (val) {
  const m = val.toString().match(KEEPALIVE_TIMEOUT_EXPR)
  return m ? parseInt(m[1], 10) * 1000 : null
}

/**
 * Retrieves a header name and returns its lowercase value.
 * @param {string | Buffer} value Header name
 * @returns {string}
 */
function headerNameToString (value) {
  return headerNameLowerCasedRecord[value] || value.toLowerCase()
}

function parseHeaders (headers, obj = {}) {
  // For H2 support
  if (!Array.isArray(headers)) return headers

  for (let i = 0; i < headers.length; i += 2) {
    const key = headers[i].toString().toLowerCase()
    let val = obj[key]

    if (!val) {
      if (Array.isArray(headers[i + 1])) {
        obj[key] = headers[i + 1].map(x => x.toString('utf8'))
      } else {
        obj[key] = headers[i + 1].toString('utf8')
      }
    } else {
      if (!Array.isArray(val)) {
        val = [val]
        obj[key] = val
      }
      val.push(headers[i + 1].toString('utf8'))
    }
  }

  // See https://github.com/nodejs/node/pull/46528
  if ('content-length' in obj && 'content-disposition' in obj) {
    obj['content-disposition'] = Buffer.from(obj['content-disposition']).toString('latin1')
  }

  return obj
}

function parseRawHeaders (headers) {
  const ret = []
  let hasContentLength = false
  let contentDispositionIdx = -1

  for (let n = 0; n < headers.length; n += 2) {
    const key = headers[n + 0].toString()
    const val = headers[n + 1].toString('utf8')

    if (key.length === 14 && (key === 'content-length' || key.toLowerCase() === 'content-length')) {
      ret.push(key, val)
      hasContentLength = true
    } else if (key.length === 19 && (key === 'content-disposition' || key.toLowerCase() === 'content-disposition')) {
      contentDispositionIdx = ret.push(key, val) - 1
    } else {
      ret.push(key, val)
    }
  }

  // See https://github.com/nodejs/node/pull/46528
  if (hasContentLength && contentDispositionIdx !== -1) {
    ret[contentDispositionIdx] = Buffer.from(ret[contentDispositionIdx]).toString('latin1')
  }

  return ret
}

function isBuffer (buffer) {
  // See, https://github.com/mcollina/undici/pull/319
  return buffer instanceof Uint8Array || Buffer.isBuffer(buffer)
}

function validateHandler (handler, method, upgrade) {
  if (!handler || typeof handler !== 'object') {
    throw new InvalidArgumentError('handler must be an object')
  }

  if (typeof handler.onConnect !== 'function') {
    throw new InvalidArgumentError('invalid onConnect method')
  }

  if (typeof handler.onError !== 'function') {
    throw new InvalidArgumentError('invalid onError method')
  }

  if (typeof handler.onBodySent !== 'function' && handler.onBodySent !== undefined) {
    throw new InvalidArgumentError('invalid onBodySent method')
  }

  if (upgrade || method === 'CONNECT') {
    if (typeof handler.onUpgrade !== 'function') {
      throw new InvalidArgumentError('invalid onUpgrade method')
    }
  } else {
    if (typeof handler.onHeaders !== 'function') {
      throw new InvalidArgumentError('invalid onHeaders method')
    }

    if (typeof handler.onData !== 'function') {
      throw new InvalidArgumentError('invalid onData method')
    }

    if (typeof handler.onComplete !== 'function') {
      throw new InvalidArgumentError('invalid onComplete method')
    }
  }
}

// A body is disturbed if it has been read from and it cannot
// be re-used without losing state or data.
function isDisturbed (body) {
  return !!(body && (
    stream.isDisturbed
      ? stream.isDisturbed(body) || body[kBodyUsed] // TODO (fix): Why is body[kBodyUsed] needed?
      : body[kBodyUsed] ||
        body.readableDidRead ||
        (body._readableState && body._readableState.dataEmitted) ||
        isReadableAborted(body)
  ))
}

function isErrored (body) {
  return !!(body && (
    stream.isErrored
      ? stream.isErrored(body)
      : /state: 'errored'/.test(nodeUtil.inspect(body)
      )))
}

function isReadable (body) {
  return !!(body && (
    stream.isReadable
      ? stream.isReadable(body)
      : /state: 'readable'/.test(nodeUtil.inspect(body)
      )))
}

function getSocketInfo (socket) {
  return {
    localAddress: socket.localAddress,
    localPort: socket.localPort,
    remoteAddress: socket.remoteAddress,
    remotePort: socket.remotePort,
    remoteFamily: socket.remoteFamily,
    timeout: socket.timeout,
    bytesWritten: socket.bytesWritten,
    bytesRead: socket.bytesRead
  }
}

async function * convertIterableToBuffer (iterable) {
  for await (const chunk of iterable) {
    yield Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
  }
}

let ReadableStream
function ReadableStreamFrom (iterable) {
  if (!ReadableStream) {
    ReadableStream = (__nccwpck_require__(5356).ReadableStream)
  }

  if (ReadableStream.from) {
    return ReadableStream.from(convertIterableToBuffer(iterable))
  }

  let iterator
  return new ReadableStream(
    {
      async start () {
        iterator = iterable[Symbol.asyncIterator]()
      },
      async pull (controller) {
        const { done, value } = await iterator.next()
        if (done) {
          queueMicrotask(() => {
            controller.close()
          })
        } else {
          const buf = Buffer.isBuffer(value) ? value : Buffer.from(value)
          controller.enqueue(new Uint8Array(buf))
        }
        return controller.desiredSize > 0
      },
      async cancel (reason) {
        await iterator.return()
      }
    },
    0
  )
}

// The chunk should be a FormData instance and contains
// all the required methods.
function isFormDataLike (object) {
  return (
    object &&
    typeof object === 'object' &&
    typeof object.append === 'function' &&
    typeof object.delete === 'function' &&
    typeof object.get === 'function' &&
    typeof object.getAll === 'function' &&
    typeof object.has === 'function' &&
    typeof object.set === 'function' &&
    object[Symbol.toStringTag] === 'FormData'
  )
}

function throwIfAborted (signal) {
  if (!signal) { return }
  if (typeof signal.throwIfAborted === 'function') {
    signal.throwIfAborted()
  } else {
    if (signal.aborted) {
      // DOMException not available < v17.0.0
      const err = new Error('The operation was aborted')
      err.name = 'AbortError'
      throw err
    }
  }
}

function addAbortListener (signal, listener) {
  if ('addEventListener' in signal) {
    signal.addEventListener('abort', listener, { once: true })
    return () => signal.removeEventListener('abort', listener)
  }
  signal.addListener('abort', listener)
  return () => signal.removeListener('abort', listener)
}

const hasToWellFormed = !!String.prototype.toWellFormed

/**
 * @param {string} val
 */
function toUSVString (val) {
  if (hasToWellFormed) {
    return `${val}`.toWellFormed()
  } else if (nodeUtil.toUSVString) {
    return nodeUtil.toUSVString(val)
  }

  return `${val}`
}

// Parsed accordingly to RFC 9110
// https://www.rfc-editor.org/rfc/rfc9110#field.content-range
function parseRangeHeader (range) {
  if (range == null || range === '') return { start: 0, end: null, size: null }

  const m = range ? range.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null
  return m
    ? {
        start: parseInt(m[1]),
        end: m[2] ? parseInt(m[2]) : null,
        size: m[3] ? parseInt(m[3]) : null
      }
    : null
}

const kEnumerableProperty = Object.create(null)
kEnumerableProperty.enumerable = true

module.exports = {
  kEnumerableProperty,
  nop,
  isDisturbed,
  isErrored,
  isReadable,
  toUSVString,
  isReadableAborted,
  isBlobLike,
  parseOrigin,
  parseURL,
  getServerName,
  isStream,
  isIterable,
  isAsyncIterable,
  isDestroyed,
  headerNameToString,
  parseRawHeaders,
  parseHeaders,
  parseKeepAliveTimeout,
  destroy,
  bodyLength,
  deepClone,
  ReadableStreamFrom,
  isBuffer,
  validateHandler,
  getSocketInfo,
  isFormDataLike,
  buildURL,
  throwIfAborted,
  addAbortListener,
  parseRangeHeader,
  nodeMajor,
  nodeMinor,
  nodeHasAutoSelectFamily: nodeMajor > 18 || (nodeMajor === 18 && nodeMinor >= 13),
  safeHTTPMethods: ['GET', 'HEAD', 'OPTIONS', 'TRACE']
}


/***/ }),

/***/ 4839:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Dispatcher = __nccwpck_require__(412)
const {
  ClientDestroyedError,
  ClientClosedError,
  InvalidArgumentError
} = __nccwpck_require__(8045)
const { kDestroy, kClose, kDispatch, kInterceptors } = __nccwpck_require__(2785)

const kDestroyed = Symbol('destroyed')
const kClosed = Symbol('closed')
const kOnDestroyed = Symbol('onDestroyed')
const kOnClosed = Symbol('onClosed')
const kInterceptedDispatch = Symbol('Intercepted Dispatch')

class DispatcherBase extends Dispatcher {
  constructor () {
    super()

    this[kDestroyed] = false
    this[kOnDestroyed] = null
    this[kClosed] = false
    this[kOnClosed] = []
  }

  get destroyed () {
    return this[kDestroyed]
  }

  get closed () {
    return this[kClosed]
  }

  get interceptors () {
    return this[kInterceptors]
  }

  set interceptors (newInterceptors) {
    if (newInterceptors) {
      for (let i = newInterceptors.length - 1; i >= 0; i--) {
        const interceptor = this[kInterceptors][i]
        if (typeof interceptor !== 'function') {
          throw new InvalidArgumentError('interceptor must be an function')
        }
      }
    }

    this[kInterceptors] = newInterceptors
  }

  close (callback) {
    if (callback === undefined) {
      return new Promise((resolve, reject) => {
        this.close((err, data) => {
          return err ? reject(err) : resolve(data)
        })
      })
    }

    if (typeof callback !== 'function') {
      throw new InvalidArgumentError('invalid callback')
    }

    if (this[kDestroyed]) {
      queueMicrotask(() => callback(new ClientDestroyedError(), null))
      return
    }

    if (this[kClosed]) {
      if (this[kOnClosed]) {
        this[kOnClosed].push(callback)
      } else {
        queueMicrotask(() => callback(null, null))
      }
      return
    }

    this[kClosed] = true
    this[kOnClosed].push(callback)

    const onClosed = () => {
      const callbacks = this[kOnClosed]
      this[kOnClosed] = null
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](null, null)
      }
    }

    // Should not error.
    this[kClose]()
      .then(() => this.destroy())
      .then(() => {
        queueMicrotask(onClosed)
      })
  }

  destroy (err, callback) {
    if (typeof err === 'function') {
      callback = err
      err = null
    }

    if (callback === undefined) {
      return new Promise((resolve, reject) => {
        this.destroy(err, (err, data) => {
          return err ? /* istanbul ignore next: should never error */ reject(err) : resolve(data)
        })
      })
    }

    if (typeof callback !== 'function') {
      throw new InvalidArgumentError('invalid callback')
    }

    if (this[kDestroyed]) {
      if (this[kOnDestroyed]) {
        this[kOnDestroyed].push(callback)
      } else {
        queueMicrotask(() => callback(null, null))
      }
      return
    }

    if (!err) {
      err = new ClientDestroyedError()
    }

    this[kDestroyed] = true
    this[kOnDestroyed] = this[kOnDestroyed] || []
    this[kOnDestroyed].push(callback)

    const onDestroyed = () => {
      const callbacks = this[kOnDestroyed]
      this[kOnDestroyed] = null
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](null, null)
      }
    }

    // Should not error.
    this[kDestroy](err).then(() => {
      queueMicrotask(onDestroyed)
    })
  }

  [kInterceptedDispatch] (opts, handler) {
    if (!this[kInterceptors] || this[kInterceptors].length === 0) {
      this[kInterceptedDispatch] = this[kDispatch]
      return this[kDispatch](opts, handler)
    }

    let dispatch = this[kDispatch].bind(this)
    for (let i = this[kInterceptors].length - 1; i >= 0; i--) {
      dispatch = this[kInterceptors][i](dispatch)
    }
    this[kInterceptedDispatch] = dispatch
    return dispatch(opts, handler)
  }

  dispatch (opts, handler) {
    if (!handler || typeof handler !== 'object') {
      throw new InvalidArgumentError('handler must be an object')
    }

    try {
      if (!opts || typeof opts !== 'object') {
        throw new InvalidArgumentError('opts must be an object.')
      }

      if (this[kDestroyed] || this[kOnDestroyed]) {
        throw new ClientDestroyedError()
      }

      if (this[kClosed]) {
        throw new ClientClosedError()
      }

      return this[kInterceptedDispatch](opts, handler)
    } catch (err) {
      if (typeof handler.onError !== 'function') {
        throw new InvalidArgumentError('invalid onError method')
      }

      handler.onError(err)

      return false
    }
  }
}

module.exports = DispatcherBase


/***/ }),

/***/ 412:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const EventEmitter = __nccwpck_require__(2361)

class Dispatcher extends EventEmitter {
  dispatch () {
    throw new Error('not implemented')
  }

  close () {
    throw new Error('not implemented')
  }

  destroy () {
    throw new Error('not implemented')
  }
}

module.exports = Dispatcher


/***/ }),

/***/ 1472:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Busboy = __nccwpck_require__(727)
const util = __nccwpck_require__(3983)
const {
  ReadableStreamFrom,
  isBlobLike,
  isReadableStreamLike,
  readableStreamClose,
  createDeferredPromise,
  fullyReadBody
} = __nccwpck_require__(2538)
const { FormData } = __nccwpck_require__(2015)
const { kState } = __nccwpck_require__(5861)
const { webidl } = __nccwpck_require__(1744)
const { DOMException, structuredClone } = __nccwpck_require__(1037)
const { Blob, File: NativeFile } = __nccwpck_require__(4300)
const { kBodyUsed } = __nccwpck_require__(2785)
const assert = __nccwpck_require__(9491)
const { isErrored } = __nccwpck_require__(3983)
const { isUint8Array, isArrayBuffer } = __nccwpck_require__(4978)
const { File: UndiciFile } = __nccwpck_require__(8511)
const { parseMIMEType, serializeAMimeType } = __nccwpck_require__(685)

let ReadableStream = globalThis.ReadableStream

/** @type {globalThis['File']} */
const File = NativeFile ?? UndiciFile
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

// https://fetch.spec.whatwg.org/#concept-bodyinit-extract
function extractBody (object, keepalive = false) {
  if (!ReadableStream) {
    ReadableStream = (__nccwpck_require__(5356).ReadableStream)
  }

  // 1. Let stream be null.
  let stream = null

  // 2. If object is a ReadableStream object, then set stream to object.
  if (object instanceof ReadableStream) {
    stream = object
  } else if (isBlobLike(object)) {
    // 3. Otherwise, if object is a Blob object, set stream to the
    //    result of running object’s get stream.
    stream = object.stream()
  } else {
    // 4. Otherwise, set stream to a new ReadableStream object, and set
    //    up stream.
    stream = new ReadableStream({
      async pull (controller) {
        controller.enqueue(
          typeof source === 'string' ? textEncoder.encode(source) : source
        )
        queueMicrotask(() => readableStreamClose(controller))
      },
      start () {},
      type: undefined
    })
  }

  // 5. Assert: stream is a ReadableStream object.
  assert(isReadableStreamLike(stream))

  // 6. Let action be null.
  let action = null

  // 7. Let source be null.
  let source = null

  // 8. Let length be null.
  let length = null

  // 9. Let type be null.
  let type = null

  // 10. Switch on object:
  if (typeof object === 'string') {
    // Set source to the UTF-8 encoding of object.
    // Note: setting source to a Uint8Array here breaks some mocking assumptions.
    source = object

    // Set type to `text/plain;charset=UTF-8`.
    type = 'text/plain;charset=UTF-8'
  } else if (object instanceof URLSearchParams) {
    // URLSearchParams

    // spec says to run application/x-www-form-urlencoded on body.list
    // this is implemented in Node.js as apart of an URLSearchParams instance toString method
    // See: https://github.com/nodejs/node/blob/e46c680bf2b211bbd52cf959ca17ee98c7f657f5/lib/internal/url.js#L490
    // and https://github.com/nodejs/node/blob/e46c680bf2b211bbd52cf959ca17ee98c7f657f5/lib/internal/url.js#L1100

    // Set source to the result of running the application/x-www-form-urlencoded serializer with object’s list.
    source = object.toString()

    // Set type to `application/x-www-form-urlencoded;charset=UTF-8`.
    type = 'application/x-www-form-urlencoded;charset=UTF-8'
  } else if (isArrayBuffer(object)) {
    // BufferSource/ArrayBuffer

    // Set source to a copy of the bytes held by object.
    source = new Uint8Array(object.slice())
  } else if (ArrayBuffer.isView(object)) {
    // BufferSource/ArrayBufferView

    // Set source to a copy of the bytes held by object.
    source = new Uint8Array(object.buffer.slice(object.byteOffset, object.byteOffset + object.byteLength))
  } else if (util.isFormDataLike(object)) {
    const boundary = `----formdata-undici-0${`${Math.floor(Math.random() * 1e11)}`.padStart(11, '0')}`
    const prefix = `--${boundary}\r\nContent-Disposition: form-data`

    /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
    const escape = (str) =>
      str.replace(/\n/g, '%0A').replace(/\r/g, '%0D').replace(/"/g, '%22')
    const normalizeLinefeeds = (value) => value.replace(/\r?\n|\r/g, '\r\n')

    // Set action to this step: run the multipart/form-data
    // encoding algorithm, with object’s entry list and UTF-8.
    // - This ensures that the body is immutable and can't be changed afterwords
    // - That the content-length is calculated in advance.
    // - And that all parts are pre-encoded and ready to be sent.

    const blobParts = []
    const rn = new Uint8Array([13, 10]) // '\r\n'
    length = 0
    let hasUnknownSizeValue = false

    for (const [name, value] of object) {
      if (typeof value === 'string') {
        const chunk = textEncoder.encode(prefix +
          `; name="${escape(normalizeLinefeeds(name))}"` +
          `\r\n\r\n${normalizeLinefeeds(value)}\r\n`)
        blobParts.push(chunk)
        length += chunk.byteLength
      } else {
        const chunk = textEncoder.encode(`${prefix}; name="${escape(normalizeLinefeeds(name))}"` +
          (value.name ? `; filename="${escape(value.name)}"` : '') + '\r\n' +
          `Content-Type: ${
            value.type || 'application/octet-stream'
          }\r\n\r\n`)
        blobParts.push(chunk, value, rn)
        if (typeof value.size === 'number') {
          length += chunk.byteLength + value.size + rn.byteLength
        } else {
          hasUnknownSizeValue = true
        }
      }
    }

    const chunk = textEncoder.encode(`--${boundary}--`)
    blobParts.push(chunk)
    length += chunk.byteLength
    if (hasUnknownSizeValue) {
      length = null
    }

    // Set source to object.
    source = object

    action = async function * () {
      for (const part of blobParts) {
        if (part.stream) {
          yield * part.stream()
        } else {
          yield part
        }
      }
    }

    // Set type to `multipart/form-data; boundary=`,
    // followed by the multipart/form-data boundary string generated
    // by the multipart/form-data encoding algorithm.
    type = 'multipart/form-data; boundary=' + boundary
  } else if (isBlobLike(object)) {
    // Blob

    // Set source to object.
    source = object

    // Set length to object’s size.
    length = object.size

    // If object’s type attribute is not the empty byte sequence, set
    // type to its value.
    if (object.type) {
      type = object.type
    }
  } else if (typeof object[Symbol.asyncIterator] === 'function') {
    // If keepalive is true, then throw a TypeError.
    if (keepalive) {
      throw new TypeError('keepalive')
    }

    // If object is disturbed or locked, then throw a TypeError.
    if (util.isDisturbed(object) || object.locked) {
      throw new TypeError(
        'Response body object should not be disturbed or locked'
      )
    }

    stream =
      object instanceof ReadableStream ? object : ReadableStreamFrom(object)
  }

  // 11. If source is a byte sequence, then set action to a
  // step that returns source and length to source’s length.
  if (typeof source === 'string' || util.isBuffer(source)) {
    length = Buffer.byteLength(source)
  }

  // 12. If action is non-null, then run these steps in in parallel:
  if (action != null) {
    // Run action.
    let iterator
    stream = new ReadableStream({
      async start () {
        iterator = action(object)[Symbol.asyncIterator]()
      },
      async pull (controller) {
        const { value, done } = await iterator.next()
        if (done) {
          // When running action is done, close stream.
          queueMicrotask(() => {
            controller.close()
          })
        } else {
          // Whenever one or more bytes are available and stream is not errored,
          // enqueue a Uint8Array wrapping an ArrayBuffer containing the available
          // bytes into stream.
          if (!isErrored(stream)) {
            controller.enqueue(new Uint8Array(value))
          }
        }
        return controller.desiredSize > 0
      },
      async cancel (reason) {
        await iterator.return()
      },
      type: undefined
    })
  }

  // 13. Let body be a body whose stream is stream, source is source,
  // and length is length.
  const body = { stream, source, length }

  // 14. Return (body, type).
  return [body, type]
}

// https://fetch.spec.whatwg.org/#bodyinit-safely-extract
function safelyExtractBody (object, keepalive = false) {
  if (!ReadableStream) {
    // istanbul ignore next
    ReadableStream = (__nccwpck_require__(5356).ReadableStream)
  }

  // To safely extract a body and a `Content-Type` value from
  // a byte sequence or BodyInit object object, run these steps:

  // 1. If object is a ReadableStream object, then:
  if (object instanceof ReadableStream) {
    // Assert: object is neither disturbed nor locked.
    // istanbul ignore next
    assert(!util.isDisturbed(object), 'The body has already been consumed.')
    // istanbul ignore next
    assert(!object.locked, 'The stream is locked.')
  }

  // 2. Return the results of extracting object.
  return extractBody(object, keepalive)
}

function cloneBody (body) {
  // To clone a body body, run these steps:

  // https://fetch.spec.whatwg.org/#concept-body-clone

  // 1. Let « out1, out2 » be the result of teeing body’s stream.
  const [out1, out2] = body.stream.tee()
  const out2Clone = structuredClone(out2, { transfer: [out2] })
  // This, for whatever reasons, unrefs out2Clone which allows
  // the process to exit by itself.
  const [, finalClone] = out2Clone.tee()

  // 2. Set body’s stream to out1.
  body.stream = out1

  // 3. Return a body whose stream is out2 and other members are copied from body.
  return {
    stream: finalClone,
    length: body.length,
    source: body.source
  }
}

async function * consumeBody (body) {
  if (body) {
    if (isUint8Array(body)) {
      yield body
    } else {
      const stream = body.stream

      if (util.isDisturbed(stream)) {
        throw new TypeError('The body has already been consumed.')
      }

      if (stream.locked) {
        throw new TypeError('The stream is locked.')
      }

      // Compat.
      stream[kBodyUsed] = true

      yield * stream
    }
  }
}

function throwIfAborted (state) {
  if (state.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError')
  }
}

function bodyMixinMethods (instance) {
  const methods = {
    blob () {
      // The blob() method steps are to return the result of
      // running consume body with this and the following step
      // given a byte sequence bytes: return a Blob whose
      // contents are bytes and whose type attribute is this’s
      // MIME type.
      return specConsumeBody(this, (bytes) => {
        let mimeType = bodyMimeType(this)

        if (mimeType === 'failure') {
          mimeType = ''
        } else if (mimeType) {
          mimeType = serializeAMimeType(mimeType)
        }

        // Return a Blob whose contents are bytes and type attribute
        // is mimeType.
        return new Blob([bytes], { type: mimeType })
      }, instance)
    },

    arrayBuffer () {
      // The arrayBuffer() method steps are to return the result
      // of running consume body with this and the following step
      // given a byte sequence bytes: return a new ArrayBuffer
      // whose contents are bytes.
      return specConsumeBody(this, (bytes) => {
        return new Uint8Array(bytes).buffer
      }, instance)
    },

    text () {
      // The text() method steps are to return the result of running
      // consume body with this and UTF-8 decode.
      return specConsumeBody(this, utf8DecodeBytes, instance)
    },

    json () {
      // The json() method steps are to return the result of running
      // consume body with this and parse JSON from bytes.
      return specConsumeBody(this, parseJSONFromBytes, instance)
    },

    async formData () {
      webidl.brandCheck(this, instance)

      throwIfAborted(this[kState])

      const contentType = this.headers.get('Content-Type')

      // If mimeType’s essence is "multipart/form-data", then:
      if (/multipart\/form-data/.test(contentType)) {
        const headers = {}
        for (const [key, value] of this.headers) headers[key.toLowerCase()] = value

        const responseFormData = new FormData()

        let busboy

        try {
          busboy = new Busboy({
            headers,
            preservePath: true
          })
        } catch (err) {
          throw new DOMException(`${err}`, 'AbortError')
        }

        busboy.on('field', (name, value) => {
          responseFormData.append(name, value)
        })
        busboy.on('file', (name, value, filename, encoding, mimeType) => {
          const chunks = []

          if (encoding === 'base64' || encoding.toLowerCase() === 'base64') {
            let base64chunk = ''

            value.on('data', (chunk) => {
              base64chunk += chunk.toString().replace(/[\r\n]/gm, '')

              const end = base64chunk.length - base64chunk.length % 4
              chunks.push(Buffer.from(base64chunk.slice(0, end), 'base64'))

              base64chunk = base64chunk.slice(end)
            })
            value.on('end', () => {
              chunks.push(Buffer.from(base64chunk, 'base64'))
              responseFormData.append(name, new File(chunks, filename, { type: mimeType }))
            })
          } else {
            value.on('data', (chunk) => {
              chunks.push(chunk)
            })
            value.on('end', () => {
              responseFormData.append(name, new File(chunks, filename, { type: mimeType }))
            })
          }
        })

        const busboyResolve = new Promise((resolve, reject) => {
          busboy.on('finish', resolve)
          busboy.on('error', (err) => reject(new TypeError(err)))
        })

        if (this.body !== null) for await (const chunk of consumeBody(this[kState].body)) busboy.write(chunk)
        busboy.end()
        await busboyResolve

        return responseFormData
      } else if (/application\/x-www-form-urlencoded/.test(contentType)) {
        // Otherwise, if mimeType’s essence is "application/x-www-form-urlencoded", then:

        // 1. Let entries be the result of parsing bytes.
        let entries
        try {
          let text = ''
          // application/x-www-form-urlencoded parser will keep the BOM.
          // https://url.spec.whatwg.org/#concept-urlencoded-parser
          // Note that streaming decoder is stateful and cannot be reused
          const streamingDecoder = new TextDecoder('utf-8', { ignoreBOM: true })

          for await (const chunk of consumeBody(this[kState].body)) {
            if (!isUint8Array(chunk)) {
              throw new TypeError('Expected Uint8Array chunk')
            }
            text += streamingDecoder.decode(chunk, { stream: true })
          }
          text += streamingDecoder.decode()
          entries = new URLSearchParams(text)
        } catch (err) {
          // istanbul ignore next: Unclear when new URLSearchParams can fail on a string.
          // 2. If entries is failure, then throw a TypeError.
          throw Object.assign(new TypeError(), { cause: err })
        }

        // 3. Return a new FormData object whose entries are entries.
        const formData = new FormData()
        for (const [name, value] of entries) {
          formData.append(name, value)
        }
        return formData
      } else {
        // Wait a tick before checking if the request has been aborted.
        // Otherwise, a TypeError can be thrown when an AbortError should.
        await Promise.resolve()

        throwIfAborted(this[kState])

        // Otherwise, throw a TypeError.
        throw webidl.errors.exception({
          header: `${instance.name}.formData`,
          message: 'Could not parse content as FormData.'
        })
      }
    }
  }

  return methods
}

function mixinBody (prototype) {
  Object.assign(prototype.prototype, bodyMixinMethods(prototype))
}

/**
 * @see https://fetch.spec.whatwg.org/#concept-body-consume-body
 * @param {Response|Request} object
 * @param {(value: unknown) => unknown} convertBytesToJSValue
 * @param {Response|Request} instance
 */
async function specConsumeBody (object, convertBytesToJSValue, instance) {
  webidl.brandCheck(object, instance)

  throwIfAborted(object[kState])

  // 1. If object is unusable, then return a promise rejected
  //    with a TypeError.
  if (bodyUnusable(object[kState].body)) {
    throw new TypeError('Body is unusable')
  }

  // 2. Let promise be a new promise.
  const promise = createDeferredPromise()

  // 3. Let errorSteps given error be to reject promise with error.
  const errorSteps = (error) => promise.reject(error)

  // 4. Let successSteps given a byte sequence data be to resolve
  //    promise with the result of running convertBytesToJSValue
  //    with data. If that threw an exception, then run errorSteps
  //    with that exception.
  const successSteps = (data) => {
    try {
      promise.resolve(convertBytesToJSValue(data))
    } catch (e) {
      errorSteps(e)
    }
  }

  // 5. If object’s body is null, then run successSteps with an
  //    empty byte sequence.
  if (object[kState].body == null) {
    successSteps(new Uint8Array())
    return promise.promise
  }

  // 6. Otherwise, fully read object’s body given successSteps,
  //    errorSteps, and object’s relevant global object.
  await fullyReadBody(object[kState].body, successSteps, errorSteps)

  // 7. Return promise.
  return promise.promise
}

// https://fetch.spec.whatwg.org/#body-unusable
function bodyUnusable (body) {
  // An object including the Body interface mixin is
  // said to be unusable if its body is non-null and
  // its body’s stream is disturbed or locked.
  return body != null && (body.stream.locked || util.isDisturbed(body.stream))
}

/**
 * @see https://encoding.spec.whatwg.org/#utf-8-decode
 * @param {Buffer} buffer
 */
function utf8DecodeBytes (buffer) {
  if (buffer.length === 0) {
    return ''
  }

  // 1. Let buffer be the result of peeking three bytes from
  //    ioQueue, converted to a byte sequence.

  // 2. If buffer is 0xEF 0xBB 0xBF, then read three
  //    bytes from ioQueue. (Do nothing with those bytes.)
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    buffer = buffer.subarray(3)
  }

  // 3. Process a queue with an instance of UTF-8’s
  //    decoder, ioQueue, output, and "replacement".
  const output = textDecoder.decode(buffer)

  // 4. Return output.
  return output
}

/**
 * @see https://infra.spec.whatwg.org/#parse-json-bytes-to-a-javascript-value
 * @param {Uint8Array} bytes
 */
function parseJSONFromBytes (bytes) {
  return JSON.parse(utf8DecodeBytes(bytes))
}

/**
 * @see https://fetch.spec.whatwg.org/#concept-body-mime-type
 * @param {import('./response').Response|import('./request').Request} object
 */
function bodyMimeType (object) {
  const { headersList } = object[kState]
  const contentType = headersList.get('content-type')

  if (contentType === null) {
    return 'failure'
  }

  return parseMIMEType(contentType)
}

module.exports = {
  extractBody,
  safelyExtractBody,
  cloneBody,
  mixinBody
}


/***/ }),

/***/ 1037:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { MessageChannel, receiveMessageOnPort } = __nccwpck_require__(1267)

const corsSafeListedMethods = ['GET', 'HEAD', 'POST']
const corsSafeListedMethodsSet = new Set(corsSafeListedMethods)

const nullBodyStatus = [101, 204, 205, 304]

const redirectStatus = [301, 302, 303, 307, 308]
const redirectStatusSet = new Set(redirectStatus)

// https://fetch.spec.whatwg.org/#block-bad-port
const badPorts = [
  '1', '7', '9', '11', '13', '15', '17', '19', '20', '21', '22', '23', '25', '37', '42', '43', '53', '69', '77', '79',
  '87', '95', '101', '102', '103', '104', '109', '110', '111', '113', '115', '117', '119', '123', '135', '137',
  '139', '143', '161', '179', '389', '427', '465', '512', '513', '514', '515', '526', '530', '531', '532',
  '540', '548', '554', '556', '563', '587', '601', '636', '989', '990', '993', '995', '1719', '1720', '1723',
  '2049', '3659', '4045', '5060', '5061', '6000', '6566', '6665', '6666', '6667', '6668', '6669', '6697',
  '10080'
]

const badPortsSet = new Set(badPorts)

// https://w3c.github.io/webappsec-referrer-policy/#referrer-policies
const referrerPolicy = [
  '',
  'no-referrer',
  'no-referrer-when-downgrade',
  'same-origin',
  'origin',
  'strict-origin',
  'origin-when-cross-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url'
]
const referrerPolicySet = new Set(referrerPolicy)

const requestRedirect = ['follow', 'manual', 'error']

const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE']
const safeMethodsSet = new Set(safeMethods)

const requestMode = ['navigate', 'same-origin', 'no-cors', 'cors']

const requestCredentials = ['omit', 'same-origin', 'include']

const requestCache = [
  'default',
  'no-store',
  'reload',
  'no-cache',
  'force-cache',
  'only-if-cached'
]

// https://fetch.spec.whatwg.org/#request-body-header-name
const requestBodyHeader = [
  'content-encoding',
  'content-language',
  'content-location',
  'content-type',
  // See https://github.com/nodejs/undici/issues/2021
  // 'Content-Length' is a forbidden header name, which is typically
  // removed in the Headers implementation. However, undici doesn't
  // filter out headers, so we add it here.
  'content-length'
]

// https://fetch.spec.whatwg.org/#enumdef-requestduplex
const requestDuplex = [
  'half'
]

// http://fetch.spec.whatwg.org/#forbidden-method
const forbiddenMethods = ['CONNECT', 'TRACE', 'TRACK']
const forbiddenMethodsSet = new Set(forbiddenMethods)

const subresource = [
  'audio',
  'audioworklet',
  'font',
  'image',
  'manifest',
  'paintworklet',
  'script',
  'style',
  'track',
  'video',
  'xslt',
  ''
]
const subresourceSet = new Set(subresource)

/** @type {globalThis['DOMException']} */
const DOMException = globalThis.DOMException ?? (() => {
  // DOMException was only made a global in Node v17.0.0,
  // but fetch supports >= v16.8.
  try {
    atob('~')
  } catch (err) {
    return Object.getPrototypeOf(err).constructor
  }
})()

let channel

/** @type {globalThis['structuredClone']} */
const structuredClone =
  globalThis.structuredClone ??
  // https://github.com/nodejs/node/blob/b27ae24dcc4251bad726d9d84baf678d1f707fed/lib/internal/structured_clone.js
  // structuredClone was added in v17.0.0, but fetch supports v16.8
  function structuredClone (value, options = undefined) {
    if (arguments.length === 0) {
      throw new TypeError('missing argument')
    }

    if (!channel) {
      channel = new MessageChannel()
    }
    channel.port1.unref()
    channel.port2.unref()
    channel.port1.postMessage(value, options?.transfer)
    return receiveMessageOnPort(channel.port2).message
  }

module.exports = {
  DOMException,
  structuredClone,
  subresource,
  forbiddenMethods,
  requestBodyHeader,
  referrerPolicy,
  requestRedirect,
  requestMode,
  requestCredentials,
  requestCache,
  redirectStatus,
  corsSafeListedMethods,
  nullBodyStatus,
  safeMethods,
  badPorts,
  requestDuplex,
  subresourceSet,
  badPortsSet,
  redirectStatusSet,
  corsSafeListedMethodsSet,
  safeMethodsSet,
  forbiddenMethodsSet,
  referrerPolicySet
}


/***/ }),

/***/ 685:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const assert = __nccwpck_require__(9491)
const { atob } = __nccwpck_require__(4300)
const { isomorphicDecode } = __nccwpck_require__(2538)

const encoder = new TextEncoder()

/**
 * @see https://mimesniff.spec.whatwg.org/#http-token-code-point
 */
const HTTP_TOKEN_CODEPOINTS = /^[!#$%&'*+-.^_|~A-Za-z0-9]+$/
const HTTP_WHITESPACE_REGEX = /(\u000A|\u000D|\u0009|\u0020)/ // eslint-disable-line
/**
 * @see https://mimesniff.spec.whatwg.org/#http-quoted-string-token-code-point
 */
const HTTP_QUOTED_STRING_TOKENS = /[\u0009|\u0020-\u007E|\u0080-\u00FF]/ // eslint-disable-line

// https://fetch.spec.whatwg.org/#data-url-processor
/** @param {URL} dataURL */
function dataURLProcessor (dataURL) {
  // 1. Assert: dataURL’s scheme is "data".
  assert(dataURL.protocol === 'data:')

  // 2. Let input be the result of running the URL
  // serializer on dataURL with exclude fragment
  // set to true.
  let input = URLSerializer(dataURL, true)

  // 3. Remove the leading "data:" string from input.
  input = input.slice(5)

  // 4. Let position point at the start of input.
  const position = { position: 0 }

  // 5. Let mimeType be the result of collecting a
  // sequence of code points that are not equal
  // to U+002C (,), given position.
  let mimeType = collectASequenceOfCodePointsFast(
    ',',
    input,
    position
  )

  // 6. Strip leading and trailing ASCII whitespace
  // from mimeType.
  // Undici implementation note: we need to store the
  // length because if the mimetype has spaces removed,
  // the wrong amount will be sliced from the input in
  // step #9
  const mimeTypeLength = mimeType.length
  mimeType = removeASCIIWhitespace(mimeType, true, true)

  // 7. If position is past the end of input, then
  // return failure
  if (position.position >= input.length) {
    return 'failure'
  }

  // 8. Advance position by 1.
  position.position++

  // 9. Let encodedBody be the remainder of input.
  const encodedBody = input.slice(mimeTypeLength + 1)

  // 10. Let body be the percent-decoding of encodedBody.
  let body = stringPercentDecode(encodedBody)

  // 11. If mimeType ends with U+003B (;), followed by
  // zero or more U+0020 SPACE, followed by an ASCII
  // case-insensitive match for "base64", then:
  if (/;(\u0020){0,}base64$/i.test(mimeType)) {
    // 1. Let stringBody be the isomorphic decode of body.
    const stringBody = isomorphicDecode(body)

    // 2. Set body to the forgiving-base64 decode of
    // stringBody.
    body = forgivingBase64(stringBody)

    // 3. If body is failure, then return failure.
    if (body === 'failure') {
      return 'failure'
    }

    // 4. Remove the last 6 code points from mimeType.
    mimeType = mimeType.slice(0, -6)

    // 5. Remove trailing U+0020 SPACE code points from mimeType,
    // if any.
    mimeType = mimeType.replace(/(\u0020)+$/, '')

    // 6. Remove the last U+003B (;) code point from mimeType.
    mimeType = mimeType.slice(0, -1)
  }

  // 12. If mimeType starts with U+003B (;), then prepend
  // "text/plain" to mimeType.
  if (mimeType.startsWith(';')) {
    mimeType = 'text/plain' + mimeType
  }

  // 13. Let mimeTypeRecord be the result of parsing
  // mimeType.
  let mimeTypeRecord = parseMIMEType(mimeType)

  // 14. If mimeTypeRecord is failure, then set
  // mimeTypeRecord to text/plain;charset=US-ASCII.
  if (mimeTypeRecord === 'failure') {
    mimeTypeRecord = parseMIMEType('text/plain;charset=US-ASCII')
  }

  // 15. Return a new data: URL struct whose MIME
  // type is mimeTypeRecord and body is body.
  // https://fetch.spec.whatwg.org/#data-url-struct
  return { mimeType: mimeTypeRecord, body }
}

// https://url.spec.whatwg.org/#concept-url-serializer
/**
 * @param {URL} url
 * @param {boolean} excludeFragment
 */
function URLSerializer (url, excludeFragment = false) {
  if (!excludeFragment) {
    return url.href
  }

  const href = url.href
  const hashLength = url.hash.length

  return hashLength === 0 ? href : href.substring(0, href.length - hashLength)
}

// https://infra.spec.whatwg.org/#collect-a-sequence-of-code-points
/**
 * @param {(char: string) => boolean} condition
 * @param {string} input
 * @param {{ position: number }} position
 */
function collectASequenceOfCodePoints (condition, input, position) {
  // 1. Let result be the empty string.
  let result = ''

  // 2. While position doesn’t point past the end of input and the
  // code point at position within input meets the condition condition:
  while (position.position < input.length && condition(input[position.position])) {
    // 1. Append that code point to the end of result.
    result += input[position.position]

    // 2. Advance position by 1.
    position.position++
  }

  // 3. Return result.
  return result
}

/**
 * A faster collectASequenceOfCodePoints that only works when comparing a single character.
 * @param {string} char
 * @param {string} input
 * @param {{ position: number }} position
 */
function collectASequenceOfCodePointsFast (char, input, position) {
  const idx = input.indexOf(char, position.position)
  const start = position.position

  if (idx === -1) {
    position.position = input.length
    return input.slice(start)
  }

  position.position = idx
  return input.slice(start, position.position)
}

// https://url.spec.whatwg.org/#string-percent-decode
/** @param {string} input */
function stringPercentDecode (input) {
  // 1. Let bytes be the UTF-8 encoding of input.
  const bytes = encoder.encode(input)

  // 2. Return the percent-decoding of bytes.
  return percentDecode(bytes)
}

// https://url.spec.whatwg.org/#percent-decode
/** @param {Uint8Array} input */
function percentDecode (input) {
  // 1. Let output be an empty byte sequence.
  /** @type {number[]} */
  const output = []

  // 2. For each byte byte in input:
  for (let i = 0; i < input.length; i++) {
    const byte = input[i]

    // 1. If byte is not 0x25 (%), then append byte to output.
    if (byte !== 0x25) {
      output.push(byte)

    // 2. Otherwise, if byte is 0x25 (%) and the next two bytes
    // after byte in input are not in the ranges
    // 0x30 (0) to 0x39 (9), 0x41 (A) to 0x46 (F),
    // and 0x61 (a) to 0x66 (f), all inclusive, append byte
    // to output.
    } else if (
      byte === 0x25 &&
      !/^[0-9A-Fa-f]{2}$/i.test(String.fromCharCode(input[i + 1], input[i + 2]))
    ) {
      output.push(0x25)

    // 3. Otherwise:
    } else {
      // 1. Let bytePoint be the two bytes after byte in input,
      // decoded, and then interpreted as hexadecimal number.
      const nextTwoBytes = String.fromCharCode(input[i + 1], input[i + 2])
      const bytePoint = Number.parseInt(nextTwoBytes, 16)

      // 2. Append a byte whose value is bytePoint to output.
      output.push(bytePoint)

      // 3. Skip the next two bytes in input.
      i += 2
    }
  }

  // 3. Return output.
  return Uint8Array.from(output)
}

// https://mimesniff.spec.whatwg.org/#parse-a-mime-type
/** @param {string} input */
function parseMIMEType (input) {
  // 1. Remove any leading and trailing HTTP whitespace
  // from input.
  input = removeHTTPWhitespace(input, true, true)

  // 2. Let position be a position variable for input,
  // initially pointing at the start of input.
  const position = { position: 0 }

  // 3. Let type be the result of collecting a sequence
  // of code points that are not U+002F (/) from
  // input, given position.
  const type = collectASequenceOfCodePointsFast(
    '/',
    input,
    position
  )

  // 4. If type is the empty string or does not solely
  // contain HTTP token code points, then return failure.
  // https://mimesniff.spec.whatwg.org/#http-token-code-point
  if (type.length === 0 || !HTTP_TOKEN_CODEPOINTS.test(type)) {
    return 'failure'
  }

  // 5. If position is past the end of input, then return
  // failure
  if (position.position > input.length) {
    return 'failure'
  }

  // 6. Advance position by 1. (This skips past U+002F (/).)
  position.position++

  // 7. Let subtype be the result of collecting a sequence of
  // code points that are not U+003B (;) from input, given
  // position.
  let subtype = collectASequenceOfCodePointsFast(
    ';',
    input,
    position
  )

  // 8. Remove any trailing HTTP whitespace from subtype.
  subtype = removeHTTPWhitespace(subtype, false, true)

  // 9. If subtype is the empty string or does not solely
  // contain HTTP token code points, then return failure.
  if (subtype.length === 0 || !HTTP_TOKEN_CODEPOINTS.test(subtype)) {
    return 'failure'
  }

  const typeLowercase = type.toLowerCase()
  const subtypeLowercase = subtype.toLowerCase()

  // 10. Let mimeType be a new MIME type record whose type
  // is type, in ASCII lowercase, and subtype is subtype,
  // in ASCII lowercase.
  // https://mimesniff.spec.whatwg.org/#mime-type
  const mimeType = {
    type: typeLowercase,
    subtype: subtypeLowercase,
    /** @type {Map<string, string>} */
    parameters: new Map(),
    // https://mimesniff.spec.whatwg.org/#mime-type-essence
    essence: `${typeLowercase}/${subtypeLowercase}`
  }

  // 11. While position is not past the end of input:
  while (position.position < input.length) {
    // 1. Advance position by 1. (This skips past U+003B (;).)
    position.position++

    // 2. Collect a sequence of code points that are HTTP
    // whitespace from input given position.
    collectASequenceOfCodePoints(
      // https://fetch.spec.whatwg.org/#http-whitespace
      char => HTTP_WHITESPACE_REGEX.test(char),
      input,
      position
    )

    // 3. Let parameterName be the result of collecting a
    // sequence of code points that are not U+003B (;)
    // or U+003D (=) from input, given position.
    let parameterName = collectASequenceOfCodePoints(
      (char) => char !== ';' && char !== '=',
      input,
      position
    )

    // 4. Set parameterName to parameterName, in ASCII
    // lowercase.
    parameterName = parameterName.toLowerCase()

    // 5. If position is not past the end of input, then:
    if (position.position < input.length) {
      // 1. If the code point at position within input is
      // U+003B (;), then continue.
      if (input[position.position] === ';') {
        continue
      }

      // 2. Advance position by 1. (This skips past U+003D (=).)
      position.position++
    }

    // 6. If position is past the end of input, then break.
    if (position.position > input.length) {
      break
    }

    // 7. Let parameterValue be null.
    let parameterValue = null

    // 8. If the code point at position within input is
    // U+0022 ("), then:
    if (input[position.position] === '"') {
      // 1. Set parameterValue to the result of collecting
      // an HTTP quoted string from input, given position
      // and the extract-value flag.
      parameterValue = collectAnHTTPQuotedString(input, position, true)

      // 2. Collect a sequence of code points that are not
      // U+003B (;) from input, given position.
      collectASequenceOfCodePointsFast(
        ';',
        input,
        position
      )

    // 9. Otherwise:
    } else {
      // 1. Set parameterValue to the result of collecting
      // a sequence of code points that are not U+003B (;)
      // from input, given position.
      parameterValue = collectASequenceOfCodePointsFast(
        ';',
        input,
        position
      )

      // 2. Remove any trailing HTTP whitespace from parameterValue.
      parameterValue = removeHTTPWhitespace(parameterValue, false, true)

      // 3. If parameterValue is the empty string, then continue.
      if (parameterValue.length === 0) {
        continue
      }
    }

    // 10. If all of the following are true
    // - parameterName is not the empty string
    // - parameterName solely contains HTTP token code points
    // - parameterValue solely contains HTTP quoted-string token code points
    // - mimeType’s parameters[parameterName] does not exist
    // then set mimeType’s parameters[parameterName] to parameterValue.
    if (
      parameterName.length !== 0 &&
      HTTP_TOKEN_CODEPOINTS.test(parameterName) &&
      (parameterValue.length === 0 || HTTP_QUOTED_STRING_TOKENS.test(parameterValue)) &&
      !mimeType.parameters.has(parameterName)
    ) {
      mimeType.parameters.set(parameterName, parameterValue)
    }
  }

  // 12. Return mimeType.
  return mimeType
}

// https://infra.spec.whatwg.org/#forgiving-base64-decode
/** @param {string} data */
function forgivingBase64 (data) {
  // 1. Remove all ASCII whitespace from data.
  data = data.replace(/[\u0009\u000A\u000C\u000D\u0020]/g, '')  // eslint-disable-line

  // 2. If data’s code point length divides by 4 leaving
  // no remainder, then:
  if (data.length % 4 === 0) {
    // 1. If data ends with one or two U+003D (=) code points,
    // then remove them from data.
    data = data.replace(/=?=$/, '')
  }

  // 3. If data’s code point length divides by 4 leaving
  // a remainder of 1, then return failure.
  if (data.length % 4 === 1) {
    return 'failure'
  }

  // 4. If data contains a code point that is not one of
  //  U+002B (+)
  //  U+002F (/)
  //  ASCII alphanumeric
  // then return failure.
  if (/[^+/0-9A-Za-z]/.test(data)) {
    return 'failure'
  }

  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)

  for (let byte = 0; byte < binary.length; byte++) {
    bytes[byte] = binary.charCodeAt(byte)
  }

  return bytes
}

// https://fetch.spec.whatwg.org/#collect-an-http-quoted-string
// tests: https://fetch.spec.whatwg.org/#example-http-quoted-string
/**
 * @param {string} input
 * @param {{ position: number }} position
 * @param {boolean?} extractValue
 */
function collectAnHTTPQuotedString (input, position, extractValue) {
  // 1. Let positionStart be position.
  const positionStart = position.position

  // 2. Let value be the empty string.
  let value = ''

  // 3. Assert: the code point at position within input
  // is U+0022 (").
  assert(input[position.position] === '"')

  // 4. Advance position by 1.
  position.position++

  // 5. While true:
  while (true) {
    // 1. Append the result of collecting a sequence of code points
    // that are not U+0022 (") or U+005C (\) from input, given
    // position, to value.
    value += collectASequenceOfCodePoints(
      (char) => char !== '"' && char !== '\\',
      input,
      position
    )

    // 2. If position is past the end of input, then break.
    if (position.position >= input.length) {
      break
    }

    // 3. Let quoteOrBackslash be the code point at position within
    // input.
    const quoteOrBackslash = input[position.position]

    // 4. Advance position by 1.
    position.position++

    // 5. If quoteOrBackslash is U+005C (\), then:
    if (quoteOrBackslash === '\\') {
      // 1. If position is past the end of input, then append
      // U+005C (\) to value and break.
      if (position.position >= input.length) {
        value += '\\'
        break
      }

      // 2. Append the code point at position within input to value.
      value += input[position.position]

      // 3. Advance position by 1.
      position.position++

    // 6. Otherwise:
    } else {
      // 1. Assert: quoteOrBackslash is U+0022 (").
      assert(quoteOrBackslash === '"')

      // 2. Break.
      break
    }
  }

  // 6. If the extract-value flag is set, then return value.
  if (extractValue) {
    return value
  }

  // 7. Return the code points from positionStart to position,
  // inclusive, within input.
  return input.slice(positionStart, position.position)
}

/**
 * @see https://mimesniff.spec.whatwg.org/#serialize-a-mime-type
 */
function serializeAMimeType (mimeType) {
  assert(mimeType !== 'failure')
  const { parameters, essence } = mimeType

  // 1. Let serialization be the concatenation of mimeType’s
  //    type, U+002F (/), and mimeType’s subtype.
  let serialization = essence

  // 2. For each name → value of mimeType’s parameters:
  for (let [name, value] of parameters.entries()) {
    // 1. Append U+003B (;) to serialization.
    serialization += ';'

    // 2. Append name to serialization.
    serialization += name

    // 3. Append U+003D (=) to serialization.
    serialization += '='

    // 4. If value does not solely contain HTTP token code
    //    points or value is the empty string, then:
    if (!HTTP_TOKEN_CODEPOINTS.test(value)) {
      // 1. Precede each occurence of U+0022 (") or
      //    U+005C (\) in value with U+005C (\).
      value = value.replace(/(\\|")/g, '\\$1')

      // 2. Prepend U+0022 (") to value.
      value = '"' + value

      // 3. Append U+0022 (") to value.
      value += '"'
    }

    // 5. Append value to serialization.
    serialization += value
  }

  // 3. Return serialization.
  return serialization
}

/**
 * @see https://fetch.spec.whatwg.org/#http-whitespace
 * @param {string} char
 */
function isHTTPWhiteSpace (char) {
  return char === '\r' || char === '\n' || char === '\t' || char === ' '
}

/**
 * @see https://fetch.spec.whatwg.org/#http-whitespace
 * @param {string} str
 */
function removeHTTPWhitespace (str, leading = true, trailing = true) {
  let lead = 0
  let trail = str.length - 1

  if (leading) {
    for (; lead < str.length && isHTTPWhiteSpace(str[lead]); lead++);
  }

  if (trailing) {
    for (; trail > 0 && isHTTPWhiteSpace(str[trail]); trail--);
  }

  return str.slice(lead, trail + 1)
}

/**
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 * @param {string} char
 */
function isASCIIWhitespace (char) {
  return char === '\r' || char === '\n' || char === '\t' || char === '\f' || char === ' '
}

/**
 * @see https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace
 */
function removeASCIIWhitespace (str, leading = true, trailing = true) {
  let lead = 0
  let trail = str.length - 1

  if (leading) {
    for (; lead < str.length && isASCIIWhitespace(str[lead]); lead++);
  }

  if (trailing) {
    for (; trail > 0 && isASCIIWhitespace(str[trail]); trail--);
  }

  return str.slice(lead, trail + 1)
}

module.exports = {
  dataURLProcessor,
  URLSerializer,
  collectASequenceOfCodePoints,
  collectASequenceOfCodePointsFast,
  stringPercentDecode,
  parseMIMEType,
  collectAnHTTPQuotedString,
  serializeAMimeType
}


/***/ }),

/***/ 8511:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { Blob, File: NativeFile } = __nccwpck_require__(4300)
const { types } = __nccwpck_require__(3837)
const { kState } = __nccwpck_require__(5861)
const { isBlobLike } = __nccwpck_require__(2538)
const { webidl } = __nccwpck_require__(1744)
const { parseMIMEType, serializeAMimeType } = __nccwpck_require__(685)
const { kEnumerableProperty } = __nccwpck_require__(3983)
const encoder = new TextEncoder()

class File extends Blob {
  constructor (fileBits, fileName, options = {}) {
    // The File constructor is invoked with two or three parameters, depending
    // on whether the optional dictionary parameter is used. When the File()
    // constructor is invoked, user agents must run the following steps:
    webidl.argumentLengthCheck(arguments, 2, { header: 'File constructor' })

    fileBits = webidl.converters['sequence<BlobPart>'](fileBits)
    fileName = webidl.converters.USVString(fileName)
    options = webidl.converters.FilePropertyBag(options)

    // 1. Let bytes be the result of processing blob parts given fileBits and
    // options.
    // Note: Blob handles this for us

    // 2. Let n be the fileName argument to the constructor.
    const n = fileName

    // 3. Process FilePropertyBag dictionary argument by running the following
    // substeps:

    //    1. If the type member is provided and is not the empty string, let t
    //    be set to the type dictionary member. If t contains any characters
    //    outside the range U+0020 to U+007E, then set t to the empty string
    //    and return from these substeps.
    //    2. Convert every character in t to ASCII lowercase.
    let t = options.type
    let d

    // eslint-disable-next-line no-labels
    substep: {
      if (t) {
        t = parseMIMEType(t)

        if (t === 'failure') {
          t = ''
          // eslint-disable-next-line no-labels
          break substep
        }

        t = serializeAMimeType(t).toLowerCase()
      }

      //    3. If the lastModified member is provided, let d be set to the
      //    lastModified dictionary member. If it is not provided, set d to the
      //    current date and time represented as the number of milliseconds since
      //    the Unix Epoch (which is the equivalent of Date.now() [ECMA-262]).
      d = options.lastModified
    }

    // 4. Return a new File object F such that:
    // F refers to the bytes byte sequence.
    // F.size is set to the number of total bytes in bytes.
    // F.name is set to n.
    // F.type is set to t.
    // F.lastModified is set to d.

    super(processBlobParts(fileBits, options), { type: t })
    this[kState] = {
      name: n,
      lastModified: d,
      type: t
    }
  }

  get name () {
    webidl.brandCheck(this, File)

    return this[kState].name
  }

  get lastModified () {
    webidl.brandCheck(this, File)

    return this[kState].lastModified
  }

  get type () {
    webidl.brandCheck(this, File)

    return this[kState].type
  }
}

class FileLike {
  constructor (blobLike, fileName, options = {}) {
    // TODO: argument idl type check

    // The File constructor is invoked with two or three parameters, depending
    // on whether the optional dictionary parameter is used. When the File()
    // constructor is invoked, user agents must run the following steps:

    // 1. Let bytes be the result of processing blob parts given fileBits and
    // options.

    // 2. Let n be the fileName argument to the constructor.
    const n = fileName

    // 3. Process FilePropertyBag dictionary argument by running the following
    // substeps:

    //    1. If the type member is provided and is not the empty string, let t
    //    be set to the type dictionary member. If t contains any characters
    //    outside the range U+0020 to U+007E, then set t to the empty string
    //    and return from these substeps.
    //    TODO
    const t = options.type

    //    2. Convert every character in t to ASCII lowercase.
    //    TODO

    //    3. If the lastModified member is provided, let d be set to the
    //    lastModified dictionary member. If it is not provided, set d to the
    //    current date and time represented as the number of milliseconds since
    //    the Unix Epoch (which is the equivalent of Date.now() [ECMA-262]).
    const d = options.lastModified ?? Date.now()

    // 4. Return a new File object F such that:
    // F refers to the bytes byte sequence.
    // F.size is set to the number of total bytes in bytes.
    // F.name is set to n.
    // F.type is set to t.
    // F.lastModified is set to d.

    this[kState] = {
      blobLike,
      name: n,
      type: t,
      lastModified: d
    }
  }

  stream (...args) {
    webidl.brandCheck(this, FileLike)

    return this[kState].blobLike.stream(...args)
  }

  arrayBuffer (...args) {
    webidl.brandCheck(this, FileLike)

    return this[kState].blobLike.arrayBuffer(...args)
  }

  slice (...args) {
    webidl.brandCheck(this, FileLike)

    return this[kState].blobLike.slice(...args)
  }

  text (...args) {
    webidl.brandCheck(this, FileLike)

    return this[kState].blobLike.text(...args)
  }

  get size () {
    webidl.brandCheck(this, FileLike)

    return this[kState].blobLike.size
  }

  get type () {
    webidl.brandCheck(this, FileLike)

    return this[kState].blobLike.type
  }

  get name () {
    webidl.brandCheck(this, FileLike)

    return this[kState].name
  }

  get lastModified () {
    webidl.brandCheck(this, FileLike)

    return this[kState].lastModified
  }

  get [Symbol.toStringTag] () {
    return 'File'
  }
}

Object.defineProperties(File.prototype, {
  [Symbol.toStringTag]: {
    value: 'File',
    configurable: true
  },
  name: kEnumerableProperty,
  lastModified: kEnumerableProperty
})

webidl.converters.Blob = webidl.interfaceConverter(Blob)

webidl.converters.BlobPart = function (V, opts) {
  if (webidl.util.Type(V) === 'Object') {
    if (isBlobLike(V)) {
      return webidl.converters.Blob(V, { strict: false })
    }

    if (
      ArrayBuffer.isView(V) ||
      types.isAnyArrayBuffer(V)
    ) {
      return webidl.converters.BufferSource(V, opts)
    }
  }

  return webidl.converters.USVString(V, opts)
}

webidl.converters['sequence<BlobPart>'] = webidl.sequenceConverter(
  webidl.converters.BlobPart
)

// https://www.w3.org/TR/FileAPI/#dfn-FilePropertyBag
webidl.converters.FilePropertyBag = webidl.dictionaryConverter([
  {
    key: 'lastModified',
    converter: webidl.converters['long long'],
    get defaultValue () {
      return Date.now()
    }
  },
  {
    key: 'type',
    converter: webidl.converters.DOMString,
    defaultValue: ''
  },
  {
    key: 'endings',
    converter: (value) => {
      value = webidl.converters.DOMString(value)
      value = value.toLowerCase()

      if (value !== 'native') {
        value = 'transparent'
      }

      return value
    },
    defaultValue: 'transparent'
  }
])

/**
 * @see https://www.w3.org/TR/FileAPI/#process-blob-parts
 * @param {(NodeJS.TypedArray|Blob|string)[]} parts
 * @param {{ type: string, endings: string }} options
 */
function processBlobParts (parts, options) {
  // 1. Let bytes be an empty sequence of bytes.
  /** @type {NodeJS.TypedArray[]} */
  const bytes = []

  // 2. For each element in parts:
  for (const element of parts) {
    // 1. If element is a USVString, run the following substeps:
    if (typeof element === 'string') {
      // 1. Let s be element.
      let s = element

      // 2. If the endings member of options is "native", set s
      //    to the result of converting line endings to native
      //    of element.
      if (options.endings === 'native') {
        s = convertLineEndingsNative(s)
      }

      // 3. Append the result of UTF-8 encoding s to bytes.
      bytes.push(encoder.encode(s))
    } else if (
      types.isAnyArrayBuffer(element) ||
      types.isTypedArray(element)
    ) {
      // 2. If element is a BufferSource, get a copy of the
      //    bytes held by the buffer source, and append those
      //    bytes to bytes.
      if (!element.buffer) { // ArrayBuffer
        bytes.push(new Uint8Array(element))
      } else {
        bytes.push(
          new Uint8Array(element.buffer, element.byteOffset, element.byteLength)
        )
      }
    } else if (isBlobLike(element)) {
      // 3. If element is a Blob, append the bytes it represents
      //    to bytes.
      bytes.push(element)
    }
  }

  // 3. Return bytes.
  return bytes
}

/**
 * @see https://www.w3.org/TR/FileAPI/#convert-line-endings-to-native
 * @param {string} s
 */
function convertLineEndingsNative (s) {
  // 1. Let native line ending be be the code point U+000A LF.
  let nativeLineEnding = '\n'

  // 2. If the underlying platform’s conventions are to
  //    represent newlines as a carriage return and line feed
  //    sequence, set native line ending to the code point
  //    U+000D CR followed by the code point U+000A LF.
  if (process.platform === 'win32') {
    nativeLineEnding = '\r\n'
  }

  return s.replace(/\r?\n/g, nativeLineEnding)
}

// If this function is moved to ./util.js, some tools (such as
// rollup) will warn about circular dependencies. See:
// https://github.com/nodejs/undici/issues/1629
function isFileLike (object) {
  return (
    (NativeFile && object instanceof NativeFile) ||
    object instanceof File || (
      object &&
      (typeof object.stream === 'function' ||
      typeof object.arrayBuffer === 'function') &&
      object[Symbol.toStringTag] === 'File'
    )
  )
}

module.exports = { File, FileLike, isFileLike }


/***/ }),

/***/ 2015:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { isBlobLike, toUSVString, makeIterator } = __nccwpck_require__(2538)
const { kState } = __nccwpck_require__(5861)
const { File: UndiciFile, FileLike, isFileLike } = __nccwpck_require__(8511)
const { webidl } = __nccwpck_require__(1744)
const { Blob, File: NativeFile } = __nccwpck_require__(4300)

/** @type {globalThis['File']} */
const File = NativeFile ?? UndiciFile

// https://xhr.spec.whatwg.org/#formdata
class FormData {
  constructor (form) {
    if (form !== undefined) {
      throw webidl.errors.conversionFailed({
        prefix: 'FormData constructor',
        argument: 'Argument 1',
        types: ['undefined']
      })
    }

    this[kState] = []
  }

  append (name, value, filename = undefined) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 2, { header: 'FormData.append' })

    if (arguments.length === 3 && !isBlobLike(value)) {
      throw new TypeError(
        "Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'"
      )
    }

    // 1. Let value be value if given; otherwise blobValue.

    name = webidl.converters.USVString(name)
    value = isBlobLike(value)
      ? webidl.converters.Blob(value, { strict: false })
      : webidl.converters.USVString(value)
    filename = arguments.length === 3
      ? webidl.converters.USVString(filename)
      : undefined

    // 2. Let entry be the result of creating an entry with
    // name, value, and filename if given.
    const entry = makeEntry(name, value, filename)

    // 3. Append entry to this’s entry list.
    this[kState].push(entry)
  }

  delete (name) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FormData.delete' })

    name = webidl.converters.USVString(name)

    // The delete(name) method steps are to remove all entries whose name
    // is name from this’s entry list.
    this[kState] = this[kState].filter(entry => entry.name !== name)
  }

  get (name) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FormData.get' })

    name = webidl.converters.USVString(name)

    // 1. If there is no entry whose name is name in this’s entry list,
    // then return null.
    const idx = this[kState].findIndex((entry) => entry.name === name)
    if (idx === -1) {
      return null
    }

    // 2. Return the value of the first entry whose name is name from
    // this’s entry list.
    return this[kState][idx].value
  }

  getAll (name) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FormData.getAll' })

    name = webidl.converters.USVString(name)

    // 1. If there is no entry whose name is name in this’s entry list,
    // then return the empty list.
    // 2. Return the values of all entries whose name is name, in order,
    // from this’s entry list.
    return this[kState]
      .filter((entry) => entry.name === name)
      .map((entry) => entry.value)
  }

  has (name) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FormData.has' })

    name = webidl.converters.USVString(name)

    // The has(name) method steps are to return true if there is an entry
    // whose name is name in this’s entry list; otherwise false.
    return this[kState].findIndex((entry) => entry.name === name) !== -1
  }

  set (name, value, filename = undefined) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 2, { header: 'FormData.set' })

    if (arguments.length === 3 && !isBlobLike(value)) {
      throw new TypeError(
        "Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'"
      )
    }

    // The set(name, value) and set(name, blobValue, filename) method steps
    // are:

    // 1. Let value be value if given; otherwise blobValue.

    name = webidl.converters.USVString(name)
    value = isBlobLike(value)
      ? webidl.converters.Blob(value, { strict: false })
      : webidl.converters.USVString(value)
    filename = arguments.length === 3
      ? toUSVString(filename)
      : undefined

    // 2. Let entry be the result of creating an entry with name, value, and
    // filename if given.
    const entry = makeEntry(name, value, filename)

    // 3. If there are entries in this’s entry list whose name is name, then
    // replace the first such entry with entry and remove the others.
    const idx = this[kState].findIndex((entry) => entry.name === name)
    if (idx !== -1) {
      this[kState] = [
        ...this[kState].slice(0, idx),
        entry,
        ...this[kState].slice(idx + 1).filter((entry) => entry.name !== name)
      ]
    } else {
      // 4. Otherwise, append entry to this’s entry list.
      this[kState].push(entry)
    }
  }

  entries () {
    webidl.brandCheck(this, FormData)

    return makeIterator(
      () => this[kState].map(pair => [pair.name, pair.value]),
      'FormData',
      'key+value'
    )
  }

  keys () {
    webidl.brandCheck(this, FormData)

    return makeIterator(
      () => this[kState].map(pair => [pair.name, pair.value]),
      'FormData',
      'key'
    )
  }

  values () {
    webidl.brandCheck(this, FormData)

    return makeIterator(
      () => this[kState].map(pair => [pair.name, pair.value]),
      'FormData',
      'value'
    )
  }

  /**
   * @param {(value: string, key: string, self: FormData) => void} callbackFn
   * @param {unknown} thisArg
   */
  forEach (callbackFn, thisArg = globalThis) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FormData.forEach' })

    if (typeof callbackFn !== 'function') {
      throw new TypeError(
        "Failed to execute 'forEach' on 'FormData': parameter 1 is not of type 'Function'."
      )
    }

    for (const [key, value] of this) {
      callbackFn.apply(thisArg, [value, key, this])
    }
  }
}

FormData.prototype[Symbol.iterator] = FormData.prototype.entries

Object.defineProperties(FormData.prototype, {
  [Symbol.toStringTag]: {
    value: 'FormData',
    configurable: true
  }
})

/**
 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#create-an-entry
 * @param {string} name
 * @param {string|Blob} value
 * @param {?string} filename
 * @returns
 */
function makeEntry (name, value, filename) {
  // 1. Set name to the result of converting name into a scalar value string.
  // "To convert a string into a scalar value string, replace any surrogates
  //  with U+FFFD."
  // see: https://nodejs.org/dist/latest-v18.x/docs/api/buffer.html#buftostringencoding-start-end
  name = Buffer.from(name).toString('utf8')

  // 2. If value is a string, then set value to the result of converting
  //    value into a scalar value string.
  if (typeof value === 'string') {
    value = Buffer.from(value).toString('utf8')
  } else {
    // 3. Otherwise:

    // 1. If value is not a File object, then set value to a new File object,
    //    representing the same bytes, whose name attribute value is "blob"
    if (!isFileLike(value)) {
      value = value instanceof Blob
        ? new File([value], 'blob', { type: value.type })
        : new FileLike(value, 'blob', { type: value.type })
    }

    // 2. If filename is given, then set value to a new File object,
    //    representing the same bytes, whose name attribute is filename.
    if (filename !== undefined) {
      /** @type {FilePropertyBag} */
      const options = {
        type: value.type,
        lastModified: value.lastModified
      }

      value = (NativeFile && value instanceof NativeFile) || value instanceof UndiciFile
        ? new File([value], filename, options)
        : new FileLike(value, filename, options)
    }
  }

  // 4. Return an entry whose name is name and whose value is value.
  return { name, value }
}

module.exports = { FormData }


/***/ }),

/***/ 1246:
/***/ ((module) => {

"use strict";


// In case of breaking changes, increase the version
// number to avoid conflicts.
const globalOrigin = Symbol.for('undici.globalOrigin.1')

function getGlobalOrigin () {
  return globalThis[globalOrigin]
}

function setGlobalOrigin (newOrigin) {
  if (newOrigin === undefined) {
    Object.defineProperty(globalThis, globalOrigin, {
      value: undefined,
      writable: true,
      enumerable: false,
      configurable: false
    })

    return
  }

  const parsedURL = new URL(newOrigin)

  if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
    throw new TypeError(`Only http & https urls are allowed, received ${parsedURL.protocol}`)
  }

  Object.defineProperty(globalThis, globalOrigin, {
    value: parsedURL,
    writable: true,
    enumerable: false,
    configurable: false
  })
}

module.exports = {
  getGlobalOrigin,
  setGlobalOrigin
}


/***/ }),

/***/ 554:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// https://github.com/Ethan-Arrowood/undici-fetch



const { kHeadersList, kConstruct } = __nccwpck_require__(2785)
const { kGuard } = __nccwpck_require__(5861)
const { kEnumerableProperty } = __nccwpck_require__(3983)
const {
  makeIterator,
  isValidHeaderName,
  isValidHeaderValue
} = __nccwpck_require__(2538)
const { webidl } = __nccwpck_require__(1744)
const assert = __nccwpck_require__(9491)

const kHeadersMap = Symbol('headers map')
const kHeadersSortedMap = Symbol('headers map sorted')

/**
 * @param {number} code
 */
function isHTTPWhiteSpaceCharCode (code) {
  return code === 0x00a || code === 0x00d || code === 0x009 || code === 0x020
}

/**
 * @see https://fetch.spec.whatwg.org/#concept-header-value-normalize
 * @param {string} potentialValue
 */
function headerValueNormalize (potentialValue) {
  //  To normalize a byte sequence potentialValue, remove
  //  any leading and trailing HTTP whitespace bytes from
  //  potentialValue.
  let i = 0; let j = potentialValue.length

  while (j > i && isHTTPWhiteSpaceCharCode(potentialValue.charCodeAt(j - 1))) --j
  while (j > i && isHTTPWhiteSpaceCharCode(potentialValue.charCodeAt(i))) ++i

  return i === 0 && j === potentialValue.length ? potentialValue : potentialValue.substring(i, j)
}

function fill (headers, object) {
  // To fill a Headers object headers with a given object object, run these steps:

  // 1. If object is a sequence, then for each header in object:
  // Note: webidl conversion to array has already been done.
  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; ++i) {
      const header = object[i]
      // 1. If header does not contain exactly two items, then throw a TypeError.
      if (header.length !== 2) {
        throw webidl.errors.exception({
          header: 'Headers constructor',
          message: `expected name/value pair to be length 2, found ${header.length}.`
        })
      }

      // 2. Append (header’s first item, header’s second item) to headers.
      appendHeader(headers, header[0], header[1])
    }
  } else if (typeof object === 'object' && object !== null) {
    // Note: null should throw

    // 2. Otherwise, object is a record, then for each key → value in object,
    //    append (key, value) to headers
    const keys = Object.keys(object)
    for (let i = 0; i < keys.length; ++i) {
      appendHeader(headers, keys[i], object[keys[i]])
    }
  } else {
    throw webidl.errors.conversionFailed({
      prefix: 'Headers constructor',
      argument: 'Argument 1',
      types: ['sequence<sequence<ByteString>>', 'record<ByteString, ByteString>']
    })
  }
}

/**
 * @see https://fetch.spec.whatwg.org/#concept-headers-append
 */
function appendHeader (headers, name, value) {
  // 1. Normalize value.
  value = headerValueNormalize(value)

  // 2. If name is not a header name or value is not a
  //    header value, then throw a TypeError.
  if (!isValidHeaderName(name)) {
    throw webidl.errors.invalidArgument({
      prefix: 'Headers.append',
      value: name,
      type: 'header name'
    })
  } else if (!isValidHeaderValue(value)) {
    throw webidl.errors.invalidArgument({
      prefix: 'Headers.append',
      value,
      type: 'header value'
    })
  }

  // 3. If headers’s guard is "immutable", then throw a TypeError.
  // 4. Otherwise, if headers’s guard is "request" and name is a
  //    forbidden header name, return.
  // Note: undici does not implement forbidden header names
  if (headers[kGuard] === 'immutable') {
    throw new TypeError('immutable')
  } else if (headers[kGuard] === 'request-no-cors') {
    // 5. Otherwise, if headers’s guard is "request-no-cors":
    // TODO
  }

  // 6. Otherwise, if headers’s guard is "response" and name is a
  //    forbidden response-header name, return.

  // 7. Append (name, value) to headers’s header list.
  return headers[kHeadersList].append(name, value)

  // 8. If headers’s guard is "request-no-cors", then remove
  //    privileged no-CORS request headers from headers
}

class HeadersList {
  /** @type {[string, string][]|null} */
  cookies = null

  constructor (init) {
    if (init instanceof HeadersList) {
      this[kHeadersMap] = new Map(init[kHeadersMap])
      this[kHeadersSortedMap] = init[kHeadersSortedMap]
      this.cookies = init.cookies === null ? null : [...init.cookies]
    } else {
      this[kHeadersMap] = new Map(init)
      this[kHeadersSortedMap] = null
    }
  }

  // https://fetch.spec.whatwg.org/#header-list-contains
  contains (name) {
    // A header list list contains a header name name if list
    // contains a header whose name is a byte-case-insensitive
    // match for name.
    name = name.toLowerCase()

    return this[kHeadersMap].has(name)
  }

  clear () {
    this[kHeadersMap].clear()
    this[kHeadersSortedMap] = null
    this.cookies = null
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-append
  append (name, value) {
    this[kHeadersSortedMap] = null

    // 1. If list contains name, then set name to the first such
    //    header’s name.
    const lowercaseName = name.toLowerCase()
    const exists = this[kHeadersMap].get(lowercaseName)

    // 2. Append (name, value) to list.
    if (exists) {
      const delimiter = lowercaseName === 'cookie' ? '; ' : ', '
      this[kHeadersMap].set(lowercaseName, {
        name: exists.name,
        value: `${exists.value}${delimiter}${value}`
      })
    } else {
      this[kHeadersMap].set(lowercaseName, { name, value })
    }

    if (lowercaseName === 'set-cookie') {
      this.cookies ??= []
      this.cookies.push(value)
    }
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-set
  set (name, value) {
    this[kHeadersSortedMap] = null
    const lowercaseName = name.toLowerCase()

    if (lowercaseName === 'set-cookie') {
      this.cookies = [value]
    }

    // 1. If list contains name, then set the value of
    //    the first such header to value and remove the
    //    others.
    // 2. Otherwise, append header (name, value) to list.
    this[kHeadersMap].set(lowercaseName, { name, value })
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-delete
  delete (name) {
    this[kHeadersSortedMap] = null

    name = name.toLowerCase()

    if (name === 'set-cookie') {
      this.cookies = null
    }

    this[kHeadersMap].delete(name)
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-get
  get (name) {
    const value = this[kHeadersMap].get(name.toLowerCase())

    // 1. If list does not contain name, then return null.
    // 2. Return the values of all headers in list whose name
    //    is a byte-case-insensitive match for name,
    //    separated from each other by 0x2C 0x20, in order.
    return value === undefined ? null : value.value
  }

  * [Symbol.iterator] () {
    // use the lowercased name
    for (const [name, { value }] of this[kHeadersMap]) {
      yield [name, value]
    }
  }

  get entries () {
    const headers = {}

    if (this[kHeadersMap].size) {
      for (const { name, value } of this[kHeadersMap].values()) {
        headers[name] = value
      }
    }

    return headers
  }
}

// https://fetch.spec.whatwg.org/#headers-class
class Headers {
  constructor (init = undefined) {
    if (init === kConstruct) {
      return
    }
    this[kHeadersList] = new HeadersList()

    // The new Headers(init) constructor steps are:

    // 1. Set this’s guard to "none".
    this[kGuard] = 'none'

    // 2. If init is given, then fill this with init.
    if (init !== undefined) {
      init = webidl.converters.HeadersInit(init)
      fill(this, init)
    }
  }

  // https://fetch.spec.whatwg.org/#dom-headers-append
  append (name, value) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 2, { header: 'Headers.append' })

    name = webidl.converters.ByteString(name)
    value = webidl.converters.ByteString(value)

    return appendHeader(this, name, value)
  }

  // https://fetch.spec.whatwg.org/#dom-headers-delete
  delete (name) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 1, { header: 'Headers.delete' })

    name = webidl.converters.ByteString(name)

    // 1. If name is not a header name, then throw a TypeError.
    if (!isValidHeaderName(name)) {
      throw webidl.errors.invalidArgument({
        prefix: 'Headers.delete',
        value: name,
        type: 'header name'
      })
    }

    // 2. If this’s guard is "immutable", then throw a TypeError.
    // 3. Otherwise, if this’s guard is "request" and name is a
    //    forbidden header name, return.
    // 4. Otherwise, if this’s guard is "request-no-cors", name
    //    is not a no-CORS-safelisted request-header name, and
    //    name is not a privileged no-CORS request-header name,
    //    return.
    // 5. Otherwise, if this’s guard is "response" and name is
    //    a forbidden response-header name, return.
    // Note: undici does not implement forbidden header names
    if (this[kGuard] === 'immutable') {
      throw new TypeError('immutable')
    } else if (this[kGuard] === 'request-no-cors') {
      // TODO
    }

    // 6. If this’s header list does not contain name, then
    //    return.
    if (!this[kHeadersList].contains(name)) {
      return
    }

    // 7. Delete name from this’s header list.
    // 8. If this’s guard is "request-no-cors", then remove
    //    privileged no-CORS request headers from this.
    this[kHeadersList].delete(name)
  }

  // https://fetch.spec.whatwg.org/#dom-headers-get
  get (name) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 1, { header: 'Headers.get' })

    name = webidl.converters.ByteString(name)

    // 1. If name is not a header name, then throw a TypeError.
    if (!isValidHeaderName(name)) {
      throw webidl.errors.invalidArgument({
        prefix: 'Headers.get',
        value: name,
        type: 'header name'
      })
    }

    // 2. Return the result of getting name from this’s header
    //    list.
    return this[kHeadersList].get(name)
  }

  // https://fetch.spec.whatwg.org/#dom-headers-has
  has (name) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 1, { header: 'Headers.has' })

    name = webidl.converters.ByteString(name)

    // 1. If name is not a header name, then throw a TypeError.
    if (!isValidHeaderName(name)) {
      throw webidl.errors.invalidArgument({
        prefix: 'Headers.has',
        value: name,
        type: 'header name'
      })
    }

    // 2. Return true if this’s header list contains name;
    //    otherwise false.
    return this[kHeadersList].contains(name)
  }

  // https://fetch.spec.whatwg.org/#dom-headers-set
  set (name, value) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 2, { header: 'Headers.set' })

    name = webidl.converters.ByteString(name)
    value = webidl.converters.ByteString(value)

    // 1. Normalize value.
    value = headerValueNormalize(value)

    // 2. If name is not a header name or value is not a
    //    header value, then throw a TypeError.
    if (!isValidHeaderName(name)) {
      throw webidl.errors.invalidArgument({
        prefix: 'Headers.set',
        value: name,
        type: 'header name'
      })
    } else if (!isValidHeaderValue(value)) {
      throw webidl.errors.invalidArgument({
        prefix: 'Headers.set',
        value,
        type: 'header value'
      })
    }

    // 3. If this’s guard is "immutable", then throw a TypeError.
    // 4. Otherwise, if this’s guard is "request" and name is a
    //    forbidden header name, return.
    // 5. Otherwise, if this’s guard is "request-no-cors" and
    //    name/value is not a no-CORS-safelisted request-header,
    //    return.
    // 6. Otherwise, if this’s guard is "response" and name is a
    //    forbidden response-header name, return.
    // Note: undici does not implement forbidden header names
    if (this[kGuard] === 'immutable') {
      throw new TypeError('immutable')
    } else if (this[kGuard] === 'request-no-cors') {
      // TODO
    }

    // 7. Set (name, value) in this’s header list.
    // 8. If this’s guard is "request-no-cors", then remove
    //    privileged no-CORS request headers from this
    this[kHeadersList].set(name, value)
  }

  // https://fetch.spec.whatwg.org/#dom-headers-getsetcookie
  getSetCookie () {
    webidl.brandCheck(this, Headers)

    // 1. If this’s header list does not contain `Set-Cookie`, then return « ».
    // 2. Return the values of all headers in this’s header list whose name is
    //    a byte-case-insensitive match for `Set-Cookie`, in order.

    const list = this[kHeadersList].cookies

    if (list) {
      return [...list]
    }

    return []
  }

  // https://fetch.spec.whatwg.org/#concept-header-list-sort-and-combine
  get [kHeadersSortedMap] () {
    if (this[kHeadersList][kHeadersSortedMap]) {
      return this[kHeadersList][kHeadersSortedMap]
    }

    // 1. Let headers be an empty list of headers with the key being the name
    //    and value the value.
    const headers = []

    // 2. Let names be the result of convert header names to a sorted-lowercase
    //    set with all the names of the headers in list.
    const names = [...this[kHeadersList]].sort((a, b) => a[0] < b[0] ? -1 : 1)
    const cookies = this[kHeadersList].cookies

    // 3. For each name of names:
    for (let i = 0; i < names.length; ++i) {
      const [name, value] = names[i]
      // 1. If name is `set-cookie`, then:
      if (name === 'set-cookie') {
        // 1. Let values be a list of all values of headers in list whose name
        //    is a byte-case-insensitive match for name, in order.

        // 2. For each value of values:
        // 1. Append (name, value) to headers.
        for (let j = 0; j < cookies.length; ++j) {
          headers.push([name, cookies[j]])
        }
      } else {
        // 2. Otherwise:

        // 1. Let value be the result of getting name from list.

        // 2. Assert: value is non-null.
        assert(value !== null)

        // 3. Append (name, value) to headers.
        headers.push([name, value])
      }
    }

    this[kHeadersList][kHeadersSortedMap] = headers

    // 4. Return headers.
    return headers
  }

  keys () {
    webidl.brandCheck(this, Headers)

    if (this[kGuard] === 'immutable') {
      const value = this[kHeadersSortedMap]
      return makeIterator(() => value, 'Headers',
        'key')
    }

    return makeIterator(
      () => [...this[kHeadersSortedMap].values()],
      'Headers',
      'key'
    )
  }

  values () {
    webidl.brandCheck(this, Headers)

    if (this[kGuard] === 'immutable') {
      const value = this[kHeadersSortedMap]
      return makeIterator(() => value, 'Headers',
        'value')
    }

    return makeIterator(
      () => [...this[kHeadersSortedMap].values()],
      'Headers',
      'value'
    )
  }

  entries () {
    webidl.brandCheck(this, Headers)

    if (this[kGuard] === 'immutable') {
      const value = this[kHeadersSortedMap]
      return makeIterator(() => value, 'Headers',
        'key+value')
    }

    return makeIterator(
      () => [...this[kHeadersSortedMap].values()],
      'Headers',
      'key+value'
    )
  }

  /**
   * @param {(value: string, key: string, self: Headers) => void} callbackFn
   * @param {unknown} thisArg
   */
  forEach (callbackFn, thisArg = globalThis) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 1, { header: 'Headers.forEach' })

    if (typeof callbackFn !== 'function') {
      throw new TypeError(
        "Failed to execute 'forEach' on 'Headers': parameter 1 is not of type 'Function'."
      )
    }

    for (const [key, value] of this) {
      callbackFn.apply(thisArg, [value, key, this])
    }
  }

  [Symbol.for('nodejs.util.inspect.custom')] () {
    webidl.brandCheck(this, Headers)

    return this[kHeadersList]
  }
}

Headers.prototype[Symbol.iterator] = Headers.prototype.entries

Object.defineProperties(Headers.prototype, {
  append: kEnumerableProperty,
  delete: kEnumerableProperty,
  get: kEnumerableProperty,
  has: kEnumerableProperty,
  set: kEnumerableProperty,
  getSetCookie: kEnumerableProperty,
  keys: kEnumerableProperty,
  values: kEnumerableProperty,
  entries: kEnumerableProperty,
  forEach: kEnumerableProperty,
  [Symbol.iterator]: { enumerable: false },
  [Symbol.toStringTag]: {
    value: 'Headers',
    configurable: true
  }
})

webidl.converters.HeadersInit = function (V) {
  if (webidl.util.Type(V) === 'Object') {
    if (V[Symbol.iterator]) {
      return webidl.converters['sequence<sequence<ByteString>>'](V)
    }

    return webidl.converters['record<ByteString, ByteString>'](V)
  }

  throw webidl.errors.conversionFailed({
    prefix: 'Headers constructor',
    argument: 'Argument 1',
    types: ['sequence<sequence<ByteString>>', 'record<ByteString, ByteString>']
  })
}

module.exports = {
  fill,
  Headers,
  HeadersList
}


/***/ }),

/***/ 4881:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// https://github.com/Ethan-Arrowood/undici-fetch



const {
  Response,
  makeNetworkError,
  makeAppropriateNetworkError,
  filterResponse,
  makeResponse
} = __nccwpck_require__(7823)
const { Headers } = __nccwpck_require__(554)
const { Request, makeRequest } = __nccwpck_require__(8359)
const zlib = __nccwpck_require__(9796)
const {
  bytesMatch,
  makePolicyContainer,
  clonePolicyContainer,
  requestBadPort,
  TAOCheck,
  appendRequestOriginHeader,
  responseLocationURL,
  requestCurrentURL,
  setRequestReferrerPolicyOnRedirect,
  tryUpgradeRequestToAPotentiallyTrustworthyURL,
  createOpaqueTimingInfo,
  appendFetchMetadata,
  corsCheck,
  crossOriginResourcePolicyCheck,
  determineRequestsReferrer,
  coarsenedSharedCurrentTime,
  createDeferredPromise,
  isBlobLike,
  sameOrigin,
  isCancelled,
  isAborted,
  isErrorLike,
  fullyReadBody,
  readableStreamClose,
  isomorphicEncode,
  urlIsLocal,
  urlIsHttpHttpsScheme,
  urlHasHttpsScheme
} = __nccwpck_require__(2538)
const { kState, kHeaders, kGuard, kRealm } = __nccwpck_require__(5861)
const assert = __nccwpck_require__(9491)
const { safelyExtractBody } = __nccwpck_require__(1472)
const {
  redirectStatusSet,
  nullBodyStatus,
  safeMethodsSet,
  requestBodyHeader,
  subresourceSet,
  DOMException
} = __nccwpck_require__(1037)
const { kHeadersList } = __nccwpck_require__(2785)
const EE = __nccwpck_require__(2361)
const { Readable, pipeline } = __nccwpck_require__(2781)
const { addAbortListener, isErrored, isReadable, nodeMajor, nodeMinor } = __nccwpck_require__(3983)
const { dataURLProcessor, serializeAMimeType } = __nccwpck_require__(685)
const { TransformStream } = __nccwpck_require__(5356)
const { getGlobalDispatcher } = __nccwpck_require__(1892)
const { webidl } = __nccwpck_require__(1744)
const { STATUS_CODES } = __nccwpck_require__(3685)
const GET_OR_HEAD = ['GET', 'HEAD']

/** @type {import('buffer').resolveObjectURL} */
let resolveObjectURL
let ReadableStream = globalThis.ReadableStream

class Fetch extends EE {
  constructor (dispatcher) {
    super()

    this.dispatcher = dispatcher
    this.connection = null
    this.dump = false
    this.state = 'ongoing'
    // 2 terminated listeners get added per request,
    // but only 1 gets removed. If there are 20 redirects,
    // 21 listeners will be added.
    // See https://github.com/nodejs/undici/issues/1711
    // TODO (fix): Find and fix root cause for leaked listener.
    this.setMaxListeners(21)
  }

  terminate (reason) {
    if (this.state !== 'ongoing') {
      return
    }

    this.state = 'terminated'
    this.connection?.destroy(reason)
    this.emit('terminated', reason)
  }

  // https://fetch.spec.whatwg.org/#fetch-controller-abort
  abort (error) {
    if (this.state !== 'ongoing') {
      return
    }

    // 1. Set controller’s state to "aborted".
    this.state = 'aborted'

    // 2. Let fallbackError be an "AbortError" DOMException.
    // 3. Set error to fallbackError if it is not given.
    if (!error) {
      error = new DOMException('The operation was aborted.', 'AbortError')
    }

    // 4. Let serializedError be StructuredSerialize(error).
    //    If that threw an exception, catch it, and let
    //    serializedError be StructuredSerialize(fallbackError).

    // 5. Set controller’s serialized abort reason to serializedError.
    this.serializedAbortReason = error

    this.connection?.destroy(error)
    this.emit('terminated', error)
  }
}

// https://fetch.spec.whatwg.org/#fetch-method
function fetch (input, init = {}) {
  webidl.argumentLengthCheck(arguments, 1, { header: 'globalThis.fetch' })

  // 1. Let p be a new promise.
  const p = createDeferredPromise()

  // 2. Let requestObject be the result of invoking the initial value of
  // Request as constructor with input and init as arguments. If this throws
  // an exception, reject p with it and return p.
  let requestObject

  try {
    requestObject = new Request(input, init)
  } catch (e) {
    p.reject(e)
    return p.promise
  }

  // 3. Let request be requestObject’s request.
  const request = requestObject[kState]

  // 4. If requestObject’s signal’s aborted flag is set, then:
  if (requestObject.signal.aborted) {
    // 1. Abort the fetch() call with p, request, null, and
    //    requestObject’s signal’s abort reason.
    abortFetch(p, request, null, requestObject.signal.reason)

    // 2. Return p.
    return p.promise
  }

  // 5. Let globalObject be request’s client’s global object.
  const globalObject = request.client.globalObject

  // 6. If globalObject is a ServiceWorkerGlobalScope object, then set
  // request’s service-workers mode to "none".
  if (globalObject?.constructor?.name === 'ServiceWorkerGlobalScope') {
    request.serviceWorkers = 'none'
  }

  // 7. Let responseObject be null.
  let responseObject = null

  // 8. Let relevantRealm be this’s relevant Realm.
  const relevantRealm = null

  // 9. Let locallyAborted be false.
  let locallyAborted = false

  // 10. Let controller be null.
  let controller = null

  // 11. Add the following abort steps to requestObject’s signal:
  addAbortListener(
    requestObject.signal,
    () => {
      // 1. Set locallyAborted to true.
      locallyAborted = true

      // 2. Assert: controller is non-null.
      assert(controller != null)

      // 3. Abort controller with requestObject’s signal’s abort reason.
      controller.abort(requestObject.signal.reason)

      // 4. Abort the fetch() call with p, request, responseObject,
      //    and requestObject’s signal’s abort reason.
      abortFetch(p, request, responseObject, requestObject.signal.reason)
    }
  )

  // 12. Let handleFetchDone given response response be to finalize and
  // report timing with response, globalObject, and "fetch".
  const handleFetchDone = (response) =>
    finalizeAndReportTiming(response, 'fetch')

  // 13. Set controller to the result of calling fetch given request,
  // with processResponseEndOfBody set to handleFetchDone, and processResponse
  // given response being these substeps:

  const processResponse = (response) => {
    // 1. If locallyAborted is true, terminate these substeps.
    if (locallyAborted) {
      return Promise.resolve()
    }

    // 2. If response’s aborted flag is set, then:
    if (response.aborted) {
      // 1. Let deserializedError be the result of deserialize a serialized
      //    abort reason given controller’s serialized abort reason and
      //    relevantRealm.

      // 2. Abort the fetch() call with p, request, responseObject, and
      //    deserializedError.

      abortFetch(p, request, responseObject, controller.serializedAbortReason)
      return Promise.resolve()
    }

    // 3. If response is a network error, then reject p with a TypeError
    // and terminate these substeps.
    if (response.type === 'error') {
      p.reject(
        Object.assign(new TypeError('fetch failed'), { cause: response.error })
      )
      return Promise.resolve()
    }

    // 4. Set responseObject to the result of creating a Response object,
    // given response, "immutable", and relevantRealm.
    responseObject = new Response()
    responseObject[kState] = response
    responseObject[kRealm] = relevantRealm
    responseObject[kHeaders][kHeadersList] = response.headersList
    responseObject[kHeaders][kGuard] = 'immutable'
    responseObject[kHeaders][kRealm] = relevantRealm

    // 5. Resolve p with responseObject.
    p.resolve(responseObject)
  }

  controller = fetching({
    request,
    processResponseEndOfBody: handleFetchDone,
    processResponse,
    dispatcher: init.dispatcher ?? getGlobalDispatcher() // undici
  })

  // 14. Return p.
  return p.promise
}

// https://fetch.spec.whatwg.org/#finalize-and-report-timing
function finalizeAndReportTiming (response, initiatorType = 'other') {
  // 1. If response is an aborted network error, then return.
  if (response.type === 'error' && response.aborted) {
    return
  }

  // 2. If response’s URL list is null or empty, then return.
  if (!response.urlList?.length) {
    return
  }

  // 3. Let originalURL be response’s URL list[0].
  const originalURL = response.urlList[0]

  // 4. Let timingInfo be response’s timing info.
  let timingInfo = response.timingInfo

  // 5. Let cacheState be response’s cache state.
  let cacheState = response.cacheState

  // 6. If originalURL’s scheme is not an HTTP(S) scheme, then return.
  if (!urlIsHttpHttpsScheme(originalURL)) {
    return
  }

  // 7. If timingInfo is null, then return.
  if (timingInfo === null) {
    return
  }

  // 8. If response’s timing allow passed flag is not set, then:
  if (!response.timingAllowPassed) {
    //  1. Set timingInfo to a the result of creating an opaque timing info for timingInfo.
    timingInfo = createOpaqueTimingInfo({
      startTime: timingInfo.startTime
    })

    //  2. Set cacheState to the empty string.
    cacheState = ''
  }

  // 9. Set timingInfo’s end time to the coarsened shared current time
  // given global’s relevant settings object’s cross-origin isolated
  // capability.
  // TODO: given global’s relevant settings object’s cross-origin isolated
  // capability?
  timingInfo.endTime = coarsenedSharedCurrentTime()

  // 10. Set response’s timing info to timingInfo.
  response.timingInfo = timingInfo

  // 11. Mark resource timing for timingInfo, originalURL, initiatorType,
  // global, and cacheState.
  markResourceTiming(
    timingInfo,
    originalURL,
    initiatorType,
    globalThis,
    cacheState
  )
}

// https://w3c.github.io/resource-timing/#dfn-mark-resource-timing
function markResourceTiming (timingInfo, originalURL, initiatorType, globalThis, cacheState) {
  if (nodeMajor > 18 || (nodeMajor === 18 && nodeMinor >= 2)) {
    performance.markResourceTiming(timingInfo, originalURL.href, initiatorType, globalThis, cacheState)
  }
}

// https://fetch.spec.whatwg.org/#abort-fetch
function abortFetch (p, request, responseObject, error) {
  // Note: AbortSignal.reason was added in node v17.2.0
  // which would give us an undefined error to reject with.
  // Remove this once node v16 is no longer supported.
  if (!error) {
    error = new DOMException('The operation was aborted.', 'AbortError')
  }

  // 1. Reject promise with error.
  p.reject(error)

  // 2. If request’s body is not null and is readable, then cancel request’s
  // body with error.
  if (request.body != null && isReadable(request.body?.stream)) {
    request.body.stream.cancel(error).catch((err) => {
      if (err.code === 'ERR_INVALID_STATE') {
        // Node bug?
        return
      }
      throw err
    })
  }

  // 3. If responseObject is null, then return.
  if (responseObject == null) {
    return
  }

  // 4. Let response be responseObject’s response.
  const response = responseObject[kState]

  // 5. If response’s body is not null and is readable, then error response’s
  // body with error.
  if (response.body != null && isReadable(response.body?.stream)) {
    response.body.stream.cancel(error).catch((err) => {
      if (err.code === 'ERR_INVALID_STATE') {
        // Node bug?
        return
      }
      throw err
    })
  }
}

// https://fetch.spec.whatwg.org/#fetching
function fetching ({
  request,
  processRequestBodyChunkLength,
  processRequestEndOfBody,
  processResponse,
  processResponseEndOfBody,
  processResponseConsumeBody,
  useParallelQueue = false,
  dispatcher // undici
}) {
  // 1. Let taskDestination be null.
  let taskDestination = null

  // 2. Let crossOriginIsolatedCapability be false.
  let crossOriginIsolatedCapability = false

  // 3. If request’s client is non-null, then:
  if (request.client != null) {
    // 1. Set taskDestination to request’s client’s global object.
    taskDestination = request.client.globalObject

    // 2. Set crossOriginIsolatedCapability to request’s client’s cross-origin
    // isolated capability.
    crossOriginIsolatedCapability =
      request.client.crossOriginIsolatedCapability
  }

  // 4. If useParallelQueue is true, then set taskDestination to the result of
  // starting a new parallel queue.
  // TODO

  // 5. Let timingInfo be a new fetch timing info whose start time and
  // post-redirect start time are the coarsened shared current time given
  // crossOriginIsolatedCapability.
  const currenTime = coarsenedSharedCurrentTime(crossOriginIsolatedCapability)
  const timingInfo = createOpaqueTimingInfo({
    startTime: currenTime
  })

  // 6. Let fetchParams be a new fetch params whose
  // request is request,
  // timing info is timingInfo,
  // process request body chunk length is processRequestBodyChunkLength,
  // process request end-of-body is processRequestEndOfBody,
  // process response is processResponse,
  // process response consume body is processResponseConsumeBody,
  // process response end-of-body is processResponseEndOfBody,
  // task destination is taskDestination,
  // and cross-origin isolated capability is crossOriginIsolatedCapability.
  const fetchParams = {
    controller: new Fetch(dispatcher),
    request,
    timingInfo,
    processRequestBodyChunkLength,
    processRequestEndOfBody,
    processResponse,
    processResponseConsumeBody,
    processResponseEndOfBody,
    taskDestination,
    crossOriginIsolatedCapability
  }

  // 7. If request’s body is a byte sequence, then set request’s body to
  //    request’s body as a body.
  // NOTE: Since fetching is only called from fetch, body should already be
  // extracted.
  assert(!request.body || request.body.stream)

  // 8. If request’s window is "client", then set request’s window to request’s
  // client, if request’s client’s global object is a Window object; otherwise
  // "no-window".
  if (request.window === 'client') {
    // TODO: What if request.client is null?
    request.window =
      request.client?.globalObject?.constructor?.name === 'Window'
        ? request.client
        : 'no-window'
  }

  // 9. If request’s origin is "client", then set request’s origin to request’s
  // client’s origin.
  if (request.origin === 'client') {
    // TODO: What if request.client is null?
    request.origin = request.client?.origin
  }

  // 10. If all of the following conditions are true:
  // TODO

  // 11. If request’s policy container is "client", then:
  if (request.policyContainer === 'client') {
    // 1. If request’s client is non-null, then set request’s policy
    // container to a clone of request’s client’s policy container. [HTML]
    if (request.client != null) {
      request.policyContainer = clonePolicyContainer(
        request.client.policyContainer
      )
    } else {
      // 2. Otherwise, set request’s policy container to a new policy
      // container.
      request.policyContainer = makePolicyContainer()
    }
  }

  // 12. If request’s header list does not contain `Accept`, then:
  if (!request.headersList.contains('accept')) {
    // 1. Let value be `*/*`.
    const value = '*/*'

    // 2. A user agent should set value to the first matching statement, if
    // any, switching on request’s destination:
    // "document"
    // "frame"
    // "iframe"
    // `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`
    // "image"
    // `image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5`
    // "style"
    // `text/css,*/*;q=0.1`
    // TODO

    // 3. Append `Accept`/value to request’s header list.
    request.headersList.append('accept', value)
  }

  // 13. If request’s header list does not contain `Accept-Language`, then
  // user agents should append `Accept-Language`/an appropriate value to
  // request’s header list.
  if (!request.headersList.contains('accept-language')) {
    request.headersList.append('accept-language', '*')
  }

  // 14. If request’s priority is null, then use request’s initiator and
  // destination appropriately in setting request’s priority to a
  // user-agent-defined object.
  if (request.priority === null) {
    // TODO
  }

  // 15. If request is a subresource request, then:
  if (subresourceSet.has(request.destination)) {
    // TODO
  }

  // 16. Run main fetch given fetchParams.
  mainFetch(fetchParams)
    .catch(err => {
      fetchParams.controller.terminate(err)
    })

  // 17. Return fetchParam's controller
  return fetchParams.controller
}

// https://fetch.spec.whatwg.org/#concept-main-fetch
async function mainFetch (fetchParams, recursive = false) {
  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request

  // 2. Let response be null.
  let response = null

  // 3. If request’s local-URLs-only flag is set and request’s current URL is
  // not local, then set response to a network error.
  if (request.localURLsOnly && !urlIsLocal(requestCurrentURL(request))) {
    response = makeNetworkError('local URLs only')
  }

  // 4. Run report Content Security Policy violations for request.
  // TODO

  // 5. Upgrade request to a potentially trustworthy URL, if appropriate.
  tryUpgradeRequestToAPotentiallyTrustworthyURL(request)

  // 6. If should request be blocked due to a bad port, should fetching request
  // be blocked as mixed content, or should request be blocked by Content
  // Security Policy returns blocked, then set response to a network error.
  if (requestBadPort(request) === 'blocked') {
    response = makeNetworkError('bad port')
  }
  // TODO: should fetching request be blocked as mixed content?
  // TODO: should request be blocked by Content Security Policy?

  // 7. If request’s referrer policy is the empty string, then set request’s
  // referrer policy to request’s policy container’s referrer policy.
  if (request.referrerPolicy === '') {
    request.referrerPolicy = request.policyContainer.referrerPolicy
  }

  // 8. If request’s referrer is not "no-referrer", then set request’s
  // referrer to the result of invoking determine request’s referrer.
  if (request.referrer !== 'no-referrer') {
    request.referrer = determineRequestsReferrer(request)
  }

  // 9. Set request’s current URL’s scheme to "https" if all of the following
  // conditions are true:
  // - request’s current URL’s scheme is "http"
  // - request’s current URL’s host is a domain
  // - Matching request’s current URL’s host per Known HSTS Host Domain Name
  //   Matching results in either a superdomain match with an asserted
  //   includeSubDomains directive or a congruent match (with or without an
  //   asserted includeSubDomains directive). [HSTS]
  // TODO

  // 10. If recursive is false, then run the remaining steps in parallel.
  // TODO

  // 11. If response is null, then set response to the result of running
  // the steps corresponding to the first matching statement:
  if (response === null) {
    response = await (async () => {
      const currentURL = requestCurrentURL(request)

      if (
        // - request’s current URL’s origin is same origin with request’s origin,
        //   and request’s response tainting is "basic"
        (sameOrigin(currentURL, request.url) && request.responseTainting === 'basic') ||
        // request’s current URL’s scheme is "data"
        (currentURL.protocol === 'data:') ||
        // - request’s mode is "navigate" or "websocket"
        (request.mode === 'navigate' || request.mode === 'websocket')
      ) {
        // 1. Set request’s response tainting to "basic".
        request.responseTainting = 'basic'

        // 2. Return the result of running scheme fetch given fetchParams.
        return await schemeFetch(fetchParams)
      }

      // request’s mode is "same-origin"
      if (request.mode === 'same-origin') {
        // 1. Return a network error.
        return makeNetworkError('request mode cannot be "same-origin"')
      }

      // request’s mode is "no-cors"
      if (request.mode === 'no-cors') {
        // 1. If request’s redirect mode is not "follow", then return a network
        // error.
        if (request.redirect !== 'follow') {
          return makeNetworkError(
            'redirect mode cannot be "follow" for "no-cors" request'
          )
        }

        // 2. Set request’s response tainting to "opaque".
        request.responseTainting = 'opaque'

        // 3. Return the result of running scheme fetch given fetchParams.
        return await schemeFetch(fetchParams)
      }

      // request’s current URL’s scheme is not an HTTP(S) scheme
      if (!urlIsHttpHttpsScheme(requestCurrentURL(request))) {
        // Return a network error.
        return makeNetworkError('URL scheme must be a HTTP(S) scheme')
      }

      // - request’s use-CORS-preflight flag is set
      // - request’s unsafe-request flag is set and either request’s method is
      //   not a CORS-safelisted method or CORS-unsafe request-header names with
      //   request’s header list is not empty
      //    1. Set request’s response tainting to "cors".
      //    2. Let corsWithPreflightResponse be the result of running HTTP fetch
      //    given fetchParams and true.
      //    3. If corsWithPreflightResponse is a network error, then clear cache
      //    entries using request.
      //    4. Return corsWithPreflightResponse.
      // TODO

      // Otherwise
      //    1. Set request’s response tainting to "cors".
      request.responseTainting = 'cors'

      //    2. Return the result of running HTTP fetch given fetchParams.
      return await httpFetch(fetchParams)
    })()
  }

  // 12. If recursive is true, then return response.
  if (recursive) {
    return response
  }

  // 13. If response is not a network error and response is not a filtered
  // response, then:
  if (response.status !== 0 && !response.internalResponse) {
    // If request’s response tainting is "cors", then:
    if (request.responseTainting === 'cors') {
      // 1. Let headerNames be the result of extracting header list values
      // given `Access-Control-Expose-Headers` and response’s header list.
      // TODO
      // 2. If request’s credentials mode is not "include" and headerNames
      // contains `*`, then set response’s CORS-exposed header-name list to
      // all unique header names in response’s header list.
      // TODO
      // 3. Otherwise, if headerNames is not null or failure, then set
      // response’s CORS-exposed header-name list to headerNames.
      // TODO
    }

    // Set response to the following filtered response with response as its
    // internal response, depending on request’s response tainting:
    if (request.responseTainting === 'basic') {
      response = filterResponse(response, 'basic')
    } else if (request.responseTainting === 'cors') {
      response = filterResponse(response, 'cors')
    } else if (request.responseTainting === 'opaque') {
      response = filterResponse(response, 'opaque')
    } else {
      assert(false)
    }
  }

  // 14. Let internalResponse be response, if response is a network error,
  // and response’s internal response otherwise.
  let internalResponse =
    response.status === 0 ? response : response.internalResponse

  // 15. If internalResponse’s URL list is empty, then set it to a clone of
  // request’s URL list.
  if (internalResponse.urlList.length === 0) {
    internalResponse.urlList.push(...request.urlList)
  }

  // 16. If request’s timing allow failed flag is unset, then set
  // internalResponse’s timing allow passed flag.
  if (!request.timingAllowFailed) {
    response.timingAllowPassed = true
  }

  // 17. If response is not a network error and any of the following returns
  // blocked
  // - should internalResponse to request be blocked as mixed content
  // - should internalResponse to request be blocked by Content Security Policy
  // - should internalResponse to request be blocked due to its MIME type
  // - should internalResponse to request be blocked due to nosniff
  // TODO

  // 18. If response’s type is "opaque", internalResponse’s status is 206,
  // internalResponse’s range-requested flag is set, and request’s header
  // list does not contain `Range`, then set response and internalResponse
  // to a network error.
  if (
    response.type === 'opaque' &&
    internalResponse.status === 206 &&
    internalResponse.rangeRequested &&
    !request.headers.contains('range')
  ) {
    response = internalResponse = makeNetworkError()
  }

  // 19. If response is not a network error and either request’s method is
  // `HEAD` or `CONNECT`, or internalResponse’s status is a null body status,
  // set internalResponse’s body to null and disregard any enqueuing toward
  // it (if any).
  if (
    response.status !== 0 &&
    (request.method === 'HEAD' ||
      request.method === 'CONNECT' ||
      nullBodyStatus.includes(internalResponse.status))
  ) {
    internalResponse.body = null
    fetchParams.controller.dump = true
  }

  // 20. If request’s integrity metadata is not the empty string, then:
  if (request.integrity) {
    // 1. Let processBodyError be this step: run fetch finale given fetchParams
    // and a network error.
    const processBodyError = (reason) =>
      fetchFinale(fetchParams, makeNetworkError(reason))

    // 2. If request’s response tainting is "opaque", or response’s body is null,
    // then run processBodyError and abort these steps.
    if (request.responseTainting === 'opaque' || response.body == null) {
      processBodyError(response.error)
      return
    }

    // 3. Let processBody given bytes be these steps:
    const processBody = (bytes) => {
      // 1. If bytes do not match request’s integrity metadata,
      // then run processBodyError and abort these steps. [SRI]
      if (!bytesMatch(bytes, request.integrity)) {
        processBodyError('integrity mismatch')
        return
      }

      // 2. Set response’s body to bytes as a body.
      response.body = safelyExtractBody(bytes)[0]

      // 3. Run fetch finale given fetchParams and response.
      fetchFinale(fetchParams, response)
    }

    // 4. Fully read response’s body given processBody and processBodyError.
    await fullyReadBody(response.body, processBody, processBodyError)
  } else {
    // 21. Otherwise, run fetch finale given fetchParams and response.
    fetchFinale(fetchParams, response)
  }
}

// https://fetch.spec.whatwg.org/#concept-scheme-fetch
// given a fetch params fetchParams
function schemeFetch (fetchParams) {
  // Note: since the connection is destroyed on redirect, which sets fetchParams to a
  // cancelled state, we do not want this condition to trigger *unless* there have been
  // no redirects. See https://github.com/nodejs/undici/issues/1776
  // 1. If fetchParams is canceled, then return the appropriate network error for fetchParams.
  if (isCancelled(fetchParams) && fetchParams.request.redirectCount === 0) {
    return Promise.resolve(makeAppropriateNetworkError(fetchParams))
  }

  // 2. Let request be fetchParams’s request.
  const { request } = fetchParams

  const { protocol: scheme } = requestCurrentURL(request)

  // 3. Switch on request’s current URL’s scheme and run the associated steps:
  switch (scheme) {
    case 'about:': {
      // If request’s current URL’s path is the string "blank", then return a new response
      // whose status message is `OK`, header list is « (`Content-Type`, `text/html;charset=utf-8`) »,
      // and body is the empty byte sequence as a body.

      // Otherwise, return a network error.
      return Promise.resolve(makeNetworkError('about scheme is not supported'))
    }
    case 'blob:': {
      if (!resolveObjectURL) {
        resolveObjectURL = (__nccwpck_require__(4300).resolveObjectURL)
      }

      // 1. Let blobURLEntry be request’s current URL’s blob URL entry.
      const blobURLEntry = requestCurrentURL(request)

      // https://github.com/web-platform-tests/wpt/blob/7b0ebaccc62b566a1965396e5be7bb2bc06f841f/FileAPI/url/resources/fetch-tests.js#L52-L56
      // Buffer.resolveObjectURL does not ignore URL queries.
      if (blobURLEntry.search.length !== 0) {
        return Promise.resolve(makeNetworkError('NetworkError when attempting to fetch resource.'))
      }

      const blobURLEntryObject = resolveObjectURL(blobURLEntry.toString())

      // 2. If request’s method is not `GET`, blobURLEntry is null, or blobURLEntry’s
      //    object is not a Blob object, then return a network error.
      if (request.method !== 'GET' || !isBlobLike(blobURLEntryObject)) {
        return Promise.resolve(makeNetworkError('invalid method'))
      }

      // 3. Let bodyWithType be the result of safely extracting blobURLEntry’s object.
      const bodyWithType = safelyExtractBody(blobURLEntryObject)

      // 4. Let body be bodyWithType’s body.
      const body = bodyWithType[0]

      // 5. Let length be body’s length, serialized and isomorphic encoded.
      const length = isomorphicEncode(`${body.length}`)

      // 6. Let type be bodyWithType’s type if it is non-null; otherwise the empty byte sequence.
      const type = bodyWithType[1] ?? ''

      // 7. Return a new response whose status message is `OK`, header list is
      //    « (`Content-Length`, length), (`Content-Type`, type) », and body is body.
      const response = makeResponse({
        statusText: 'OK',
        headersList: [
          ['content-length', { name: 'Content-Length', value: length }],
          ['content-type', { name: 'Content-Type', value: type }]
        ]
      })

      response.body = body

      return Promise.resolve(response)
    }
    case 'data:': {
      // 1. Let dataURLStruct be the result of running the
      //    data: URL processor on request’s current URL.
      const currentURL = requestCurrentURL(request)
      const dataURLStruct = dataURLProcessor(currentURL)

      // 2. If dataURLStruct is failure, then return a
      //    network error.
      if (dataURLStruct === 'failure') {
        return Promise.resolve(makeNetworkError('failed to fetch the data URL'))
      }

      // 3. Let mimeType be dataURLStruct’s MIME type, serialized.
      const mimeType = serializeAMimeType(dataURLStruct.mimeType)

      // 4. Return a response whose status message is `OK`,
      //    header list is « (`Content-Type`, mimeType) »,
      //    and body is dataURLStruct’s body as a body.
      return Promise.resolve(makeResponse({
        statusText: 'OK',
        headersList: [
          ['content-type', { name: 'Content-Type', value: mimeType }]
        ],
        body: safelyExtractBody(dataURLStruct.body)[0]
      }))
    }
    case 'file:': {
      // For now, unfortunate as it is, file URLs are left as an exercise for the reader.
      // When in doubt, return a network error.
      return Promise.resolve(makeNetworkError('not implemented... yet...'))
    }
    case 'http:':
    case 'https:': {
      // Return the result of running HTTP fetch given fetchParams.

      return httpFetch(fetchParams)
        .catch((err) => makeNetworkError(err))
    }
    default: {
      return Promise.resolve(makeNetworkError('unknown scheme'))
    }
  }
}

// https://fetch.spec.whatwg.org/#finalize-response
function finalizeResponse (fetchParams, response) {
  // 1. Set fetchParams’s request’s done flag.
  fetchParams.request.done = true

  // 2, If fetchParams’s process response done is not null, then queue a fetch
  // task to run fetchParams’s process response done given response, with
  // fetchParams’s task destination.
  if (fetchParams.processResponseDone != null) {
    queueMicrotask(() => fetchParams.processResponseDone(response))
  }
}

// https://fetch.spec.whatwg.org/#fetch-finale
function fetchFinale (fetchParams, response) {
  // 1. If response is a network error, then:
  if (response.type === 'error') {
    // 1. Set response’s URL list to « fetchParams’s request’s URL list[0] ».
    response.urlList = [fetchParams.request.urlList[0]]

    // 2. Set response’s timing info to the result of creating an opaque timing
    // info for fetchParams’s timing info.
    response.timingInfo = createOpaqueTimingInfo({
      startTime: fetchParams.timingInfo.startTime
    })
  }

  // 2. Let processResponseEndOfBody be the following steps:
  const processResponseEndOfBody = () => {
    // 1. Set fetchParams’s request’s done flag.
    fetchParams.request.done = true

    // If fetchParams’s process response end-of-body is not null,
    // then queue a fetch task to run fetchParams’s process response
    // end-of-body given response with fetchParams’s task destination.
    if (fetchParams.processResponseEndOfBody != null) {
      queueMicrotask(() => fetchParams.processResponseEndOfBody(response))
    }
  }

  // 3. If fetchParams’s process response is non-null, then queue a fetch task
  // to run fetchParams’s process response given response, with fetchParams’s
  // task destination.
  if (fetchParams.processResponse != null) {
    queueMicrotask(() => fetchParams.processResponse(response))
  }

  // 4. If response’s body is null, then run processResponseEndOfBody.
  if (response.body == null) {
    processResponseEndOfBody()
  } else {
  // 5. Otherwise:

    // 1. Let transformStream be a new a TransformStream.

    // 2. Let identityTransformAlgorithm be an algorithm which, given chunk,
    // enqueues chunk in transformStream.
    const identityTransformAlgorithm = (chunk, controller) => {
      controller.enqueue(chunk)
    }

    // 3. Set up transformStream with transformAlgorithm set to identityTransformAlgorithm
    // and flushAlgorithm set to processResponseEndOfBody.
    const transformStream = new TransformStream({
      start () {},
      transform: identityTransformAlgorithm,
      flush: processResponseEndOfBody
    }, {
      size () {
        return 1
      }
    }, {
      size () {
        return 1
      }
    })

    // 4. Set response’s body to the result of piping response’s body through transformStream.
    response.body = { stream: response.body.stream.pipeThrough(transformStream) }
  }

  // 6. If fetchParams’s process response consume body is non-null, then:
  if (fetchParams.processResponseConsumeBody != null) {
    // 1. Let processBody given nullOrBytes be this step: run fetchParams’s
    // process response consume body given response and nullOrBytes.
    const processBody = (nullOrBytes) => fetchParams.processResponseConsumeBody(response, nullOrBytes)

    // 2. Let processBodyError be this step: run fetchParams’s process
    // response consume body given response and failure.
    const processBodyError = (failure) => fetchParams.processResponseConsumeBody(response, failure)

    // 3. If response’s body is null, then queue a fetch task to run processBody
    // given null, with fetchParams’s task destination.
    if (response.body == null) {
      queueMicrotask(() => processBody(null))
    } else {
      // 4. Otherwise, fully read response’s body given processBody, processBodyError,
      // and fetchParams’s task destination.
      return fullyReadBody(response.body, processBody, processBodyError)
    }
    return Promise.resolve()
  }
}

// https://fetch.spec.whatwg.org/#http-fetch
async function httpFetch (fetchParams) {
  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request

  // 2. Let response be null.
  let response = null

  // 3. Let actualResponse be null.
  let actualResponse = null

  // 4. Let timingInfo be fetchParams’s timing info.
  const timingInfo = fetchParams.timingInfo

  // 5. If request’s service-workers mode is "all", then:
  if (request.serviceWorkers === 'all') {
    // TODO
  }

  // 6. If response is null, then:
  if (response === null) {
    // 1. If makeCORSPreflight is true and one of these conditions is true:
    // TODO

    // 2. If request’s redirect mode is "follow", then set request’s
    // service-workers mode to "none".
    if (request.redirect === 'follow') {
      request.serviceWorkers = 'none'
    }

    // 3. Set response and actualResponse to the result of running
    // HTTP-network-or-cache fetch given fetchParams.
    actualResponse = response = await httpNetworkOrCacheFetch(fetchParams)

    // 4. If request’s response tainting is "cors" and a CORS check
    // for request and response returns failure, then return a network error.
    if (
      request.responseTainting === 'cors' &&
      corsCheck(request, response) === 'failure'
    ) {
      return makeNetworkError('cors failure')
    }

    // 5. If the TAO check for request and response returns failure, then set
    // request’s timing allow failed flag.
    if (TAOCheck(request, response) === 'failure') {
      request.timingAllowFailed = true
    }
  }

  // 7. If either request’s response tainting or response’s type
  // is "opaque", and the cross-origin resource policy check with
  // request’s origin, request’s client, request’s destination,
  // and actualResponse returns blocked, then return a network error.
  if (
    (request.responseTainting === 'opaque' || response.type === 'opaque') &&
    crossOriginResourcePolicyCheck(
      request.origin,
      request.client,
      request.destination,
      actualResponse
    ) === 'blocked'
  ) {
    return makeNetworkError('blocked')
  }

  // 8. If actualResponse’s status is a redirect status, then:
  if (redirectStatusSet.has(actualResponse.status)) {
    // 1. If actualResponse’s status is not 303, request’s body is not null,
    // and the connection uses HTTP/2, then user agents may, and are even
    // encouraged to, transmit an RST_STREAM frame.
    // See, https://github.com/whatwg/fetch/issues/1288
    if (request.redirect !== 'manual') {
      fetchParams.controller.connection.destroy()
    }

    // 2. Switch on request’s redirect mode:
    if (request.redirect === 'error') {
      // Set response to a network error.
      response = makeNetworkError('unexpected redirect')
    } else if (request.redirect === 'manual') {
      // Set response to an opaque-redirect filtered response whose internal
      // response is actualResponse.
      // NOTE(spec): On the web this would return an `opaqueredirect` response,
      // but that doesn't make sense server side.
      // See https://github.com/nodejs/undici/issues/1193.
      response = actualResponse
    } else if (request.redirect === 'follow') {
      // Set response to the result of running HTTP-redirect fetch given
      // fetchParams and response.
      response = await httpRedirectFetch(fetchParams, response)
    } else {
      assert(false)
    }
  }

  // 9. Set response’s timing info to timingInfo.
  response.timingInfo = timingInfo

  // 10. Return response.
  return response
}

// https://fetch.spec.whatwg.org/#http-redirect-fetch
function httpRedirectFetch (fetchParams, response) {
  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request

  // 2. Let actualResponse be response, if response is not a filtered response,
  // and response’s internal response otherwise.
  const actualResponse = response.internalResponse
    ? response.internalResponse
    : response

  // 3. Let locationURL be actualResponse’s location URL given request’s current
  // URL’s fragment.
  let locationURL

  try {
    locationURL = responseLocationURL(
      actualResponse,
      requestCurrentURL(request).hash
    )

    // 4. If locationURL is null, then return response.
    if (locationURL == null) {
      return response
    }
  } catch (err) {
    // 5. If locationURL is failure, then return a network error.
    return Promise.resolve(makeNetworkError(err))
  }

  // 6. If locationURL’s scheme is not an HTTP(S) scheme, then return a network
  // error.
  if (!urlIsHttpHttpsScheme(locationURL)) {
    return Promise.resolve(makeNetworkError('URL scheme must be a HTTP(S) scheme'))
  }

  // 7. If request’s redirect count is 20, then return a network error.
  if (request.redirectCount === 20) {
    return Promise.resolve(makeNetworkError('redirect count exceeded'))
  }

  // 8. Increase request’s redirect count by 1.
  request.redirectCount += 1

  // 9. If request’s mode is "cors", locationURL includes credentials, and
  // request’s origin is not same origin with locationURL’s origin, then return
  //  a network error.
  if (
    request.mode === 'cors' &&
    (locationURL.username || locationURL.password) &&
    !sameOrigin(request, locationURL)
  ) {
    return Promise.resolve(makeNetworkError('cross origin not allowed for request mode "cors"'))
  }

  // 10. If request’s response tainting is "cors" and locationURL includes
  // credentials, then return a network error.
  if (
    request.responseTainting === 'cors' &&
    (locationURL.username || locationURL.password)
  ) {
    return Promise.resolve(makeNetworkError(
      'URL cannot contain credentials for request mode "cors"'
    ))
  }

  // 11. If actualResponse’s status is not 303, request’s body is non-null,
  // and request’s body’s source is null, then return a network error.
  if (
    actualResponse.status !== 303 &&
    request.body != null &&
    request.body.source == null
  ) {
    return Promise.resolve(makeNetworkError())
  }

  // 12. If one of the following is true
  // - actualResponse’s status is 301 or 302 and request’s method is `POST`
  // - actualResponse’s status is 303 and request’s method is not `GET` or `HEAD`
  if (
    ([301, 302].includes(actualResponse.status) && request.method === 'POST') ||
    (actualResponse.status === 303 &&
      !GET_OR_HEAD.includes(request.method))
  ) {
    // then:
    // 1. Set request’s method to `GET` and request’s body to null.
    request.method = 'GET'
    request.body = null

    // 2. For each headerName of request-body-header name, delete headerName from
    // request’s header list.
    for (const headerName of requestBodyHeader) {
      request.headersList.delete(headerName)
    }
  }

  // 13. If request’s current URL’s origin is not same origin with locationURL’s
  //     origin, then for each headerName of CORS non-wildcard request-header name,
  //     delete headerName from request’s header list.
  if (!sameOrigin(requestCurrentURL(request), locationURL)) {
    // https://fetch.spec.whatwg.org/#cors-non-wildcard-request-header-name
    request.headersList.delete('authorization')

    // https://fetch.spec.whatwg.org/#authentication-entries
    request.headersList.delete('proxy-authorization', true)

    // "Cookie" and "Host" are forbidden request-headers, which undici doesn't implement.
    request.headersList.delete('cookie')
    request.headersList.delete('host')
  }

  // 14. If request’s body is non-null, then set request’s body to the first return
  // value of safely extracting request’s body’s source.
  if (request.body != null) {
    assert(request.body.source != null)
    request.body = safelyExtractBody(request.body.source)[0]
  }

  // 15. Let timingInfo be fetchParams’s timing info.
  const timingInfo = fetchParams.timingInfo

  // 16. Set timingInfo’s redirect end time and post-redirect start time to the
  // coarsened shared current time given fetchParams’s cross-origin isolated
  // capability.
  timingInfo.redirectEndTime = timingInfo.postRedirectStartTime =
    coarsenedSharedCurrentTime(fetchParams.crossOriginIsolatedCapability)

  // 17. If timingInfo’s redirect start time is 0, then set timingInfo’s
  //  redirect start time to timingInfo’s start time.
  if (timingInfo.redirectStartTime === 0) {
    timingInfo.redirectStartTime = timingInfo.startTime
  }

  // 18. Append locationURL to request’s URL list.
  request.urlList.push(locationURL)

  // 19. Invoke set request’s referrer policy on redirect on request and
  // actualResponse.
  setRequestReferrerPolicyOnRedirect(request, actualResponse)

  // 20. Return the result of running main fetch given fetchParams and true.
  return mainFetch(fetchParams, true)
}

// https://fetch.spec.whatwg.org/#http-network-or-cache-fetch
async function httpNetworkOrCacheFetch (
  fetchParams,
  isAuthenticationFetch = false,
  isNewConnectionFetch = false
) {
  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request

  // 2. Let httpFetchParams be null.
  let httpFetchParams = null

  // 3. Let httpRequest be null.
  let httpRequest = null

  // 4. Let response be null.
  let response = null

  // 5. Let storedResponse be null.
  // TODO: cache

  // 6. Let httpCache be null.
  const httpCache = null

  // 7. Let the revalidatingFlag be unset.
  const revalidatingFlag = false

  // 8. Run these steps, but abort when the ongoing fetch is terminated:

  //    1. If request’s window is "no-window" and request’s redirect mode is
  //    "error", then set httpFetchParams to fetchParams and httpRequest to
  //    request.
  if (request.window === 'no-window' && request.redirect === 'error') {
    httpFetchParams = fetchParams
    httpRequest = request
  } else {
    // Otherwise:

    // 1. Set httpRequest to a clone of request.
    httpRequest = makeRequest(request)

    // 2. Set httpFetchParams to a copy of fetchParams.
    httpFetchParams = { ...fetchParams }

    // 3. Set httpFetchParams’s request to httpRequest.
    httpFetchParams.request = httpRequest
  }

  //    3. Let includeCredentials be true if one of
  const includeCredentials =
    request.credentials === 'include' ||
    (request.credentials === 'same-origin' &&
      request.responseTainting === 'basic')

  //    4. Let contentLength be httpRequest’s body’s length, if httpRequest’s
  //    body is non-null; otherwise null.
  const contentLength = httpRequest.body ? httpRequest.body.length : null

  //    5. Let contentLengthHeaderValue be null.
  let contentLengthHeaderValue = null

  //    6. If httpRequest’s body is null and httpRequest’s method is `POST` or
  //    `PUT`, then set contentLengthHeaderValue to `0`.
  if (
    httpRequest.body == null &&
    ['POST', 'PUT'].includes(httpRequest.method)
  ) {
    contentLengthHeaderValue = '0'
  }

  //    7. If contentLength is non-null, then set contentLengthHeaderValue to
  //    contentLength, serialized and isomorphic encoded.
  if (contentLength != null) {
    contentLengthHeaderValue = isomorphicEncode(`${contentLength}`)
  }

  //    8. If contentLengthHeaderValue is non-null, then append
  //    `Content-Length`/contentLengthHeaderValue to httpRequest’s header
  //    list.
  if (contentLengthHeaderValue != null) {
    httpRequest.headersList.append('content-length', contentLengthHeaderValue)
  }

  //    9. If contentLengthHeaderValue is non-null, then append (`Content-Length`,
  //    contentLengthHeaderValue) to httpRequest’s header list.

  //    10. If contentLength is non-null and httpRequest’s keepalive is true,
  //    then:
  if (contentLength != null && httpRequest.keepalive) {
    // NOTE: keepalive is a noop outside of browser context.
  }

  //    11. If httpRequest’s referrer is a URL, then append
  //    `Referer`/httpRequest’s referrer, serialized and isomorphic encoded,
  //     to httpRequest’s header list.
  if (httpRequest.referrer instanceof URL) {
    httpRequest.headersList.append('referer', isomorphicEncode(httpRequest.referrer.href))
  }

  //    12. Append a request `Origin` header for httpRequest.
  appendRequestOriginHeader(httpRequest)

  //    13. Append the Fetch metadata headers for httpRequest. [FETCH-METADATA]
  appendFetchMetadata(httpRequest)

  //    14. If httpRequest’s header list does not contain `User-Agent`, then
  //    user agents should append `User-Agent`/default `User-Agent` value to
  //    httpRequest’s header list.
  if (!httpRequest.headersList.contains('user-agent')) {
    httpRequest.headersList.append('user-agent', typeof esbuildDetection === 'undefined' ? 'undici' : 'node')
  }

  //    15. If httpRequest’s cache mode is "default" and httpRequest’s header
  //    list contains `If-Modified-Since`, `If-None-Match`,
  //    `If-Unmodified-Since`, `If-Match`, or `If-Range`, then set
  //    httpRequest’s cache mode to "no-store".
  if (
    httpRequest.cache === 'default' &&
    (httpRequest.headersList.contains('if-modified-since') ||
      httpRequest.headersList.contains('if-none-match') ||
      httpRequest.headersList.contains('if-unmodified-since') ||
      httpRequest.headersList.contains('if-match') ||
      httpRequest.headersList.contains('if-range'))
  ) {
    httpRequest.cache = 'no-store'
  }

  //    16. If httpRequest’s cache mode is "no-cache", httpRequest’s prevent
  //    no-cache cache-control header modification flag is unset, and
  //    httpRequest’s header list does not contain `Cache-Control`, then append
  //    `Cache-Control`/`max-age=0` to httpRequest’s header list.
  if (
    httpRequest.cache === 'no-cache' &&
    !httpRequest.preventNoCacheCacheControlHeaderModification &&
    !httpRequest.headersList.contains('cache-control')
  ) {
    httpRequest.headersList.append('cache-control', 'max-age=0')
  }

  //    17. If httpRequest’s cache mode is "no-store" or "reload", then:
  if (httpRequest.cache === 'no-store' || httpRequest.cache === 'reload') {
    // 1. If httpRequest’s header list does not contain `Pragma`, then append
    // `Pragma`/`no-cache` to httpRequest’s header list.
    if (!httpRequest.headersList.contains('pragma')) {
      httpRequest.headersList.append('pragma', 'no-cache')
    }

    // 2. If httpRequest’s header list does not contain `Cache-Control`,
    // then append `Cache-Control`/`no-cache` to httpRequest’s header list.
    if (!httpRequest.headersList.contains('cache-control')) {
      httpRequest.headersList.append('cache-control', 'no-cache')
    }
  }

  //    18. If httpRequest’s header list contains `Range`, then append
  //    `Accept-Encoding`/`identity` to httpRequest’s header list.
  if (httpRequest.headersList.contains('range')) {
    httpRequest.headersList.append('accept-encoding', 'identity')
  }

  //    19. Modify httpRequest’s header list per HTTP. Do not append a given
  //    header if httpRequest’s header list contains that header’s name.
  //    TODO: https://github.com/whatwg/fetch/issues/1285#issuecomment-896560129
  if (!httpRequest.headersList.contains('accept-encoding')) {
    if (urlHasHttpsScheme(requestCurrentURL(httpRequest))) {
      httpRequest.headersList.append('accept-encoding', 'br, gzip, deflate')
    } else {
      httpRequest.headersList.append('accept-encoding', 'gzip, deflate')
    }
  }

  httpRequest.headersList.delete('host')

  //    20. If includeCredentials is true, then:
  if (includeCredentials) {
    // 1. If the user agent is not configured to block cookies for httpRequest
    // (see section 7 of [COOKIES]), then:
    // TODO: credentials
    // 2. If httpRequest’s header list does not contain `Authorization`, then:
    // TODO: credentials
  }

  //    21. If there’s a proxy-authentication entry, use it as appropriate.
  //    TODO: proxy-authentication

  //    22. Set httpCache to the result of determining the HTTP cache
  //    partition, given httpRequest.
  //    TODO: cache

  //    23. If httpCache is null, then set httpRequest’s cache mode to
  //    "no-store".
  if (httpCache == null) {
    httpRequest.cache = 'no-store'
  }

  //    24. If httpRequest’s cache mode is neither "no-store" nor "reload",
  //    then:
  if (httpRequest.mode !== 'no-store' && httpRequest.mode !== 'reload') {
    // TODO: cache
  }

  // 9. If aborted, then return the appropriate network error for fetchParams.
  // TODO

  // 10. If response is null, then:
  if (response == null) {
    // 1. If httpRequest’s cache mode is "only-if-cached", then return a
    // network error.
    if (httpRequest.mode === 'only-if-cached') {
      return makeNetworkError('only if cached')
    }

    // 2. Let forwardResponse be the result of running HTTP-network fetch
    // given httpFetchParams, includeCredentials, and isNewConnectionFetch.
    const forwardResponse = await httpNetworkFetch(
      httpFetchParams,
      includeCredentials,
      isNewConnectionFetch
    )

    // 3. If httpRequest’s method is unsafe and forwardResponse’s status is
    // in the range 200 to 399, inclusive, invalidate appropriate stored
    // responses in httpCache, as per the "Invalidation" chapter of HTTP
    // Caching, and set storedResponse to null. [HTTP-CACHING]
    if (
      !safeMethodsSet.has(httpRequest.method) &&
      forwardResponse.status >= 200 &&
      forwardResponse.status <= 399
    ) {
      // TODO: cache
    }

    // 4. If the revalidatingFlag is set and forwardResponse’s status is 304,
    // then:
    if (revalidatingFlag && forwardResponse.status === 304) {
      // TODO: cache
    }

    // 5. If response is null, then:
    if (response == null) {
      // 1. Set response to forwardResponse.
      response = forwardResponse

      // 2. Store httpRequest and forwardResponse in httpCache, as per the
      // "Storing Responses in Caches" chapter of HTTP Caching. [HTTP-CACHING]
      // TODO: cache
    }
  }

  // 11. Set response’s URL list to a clone of httpRequest’s URL list.
  response.urlList = [...httpRequest.urlList]

  // 12. If httpRequest’s header list contains `Range`, then set response’s
  // range-requested flag.
  if (httpRequest.headersList.contains('range')) {
    response.rangeRequested = true
  }

  // 13. Set response’s request-includes-credentials to includeCredentials.
  response.requestIncludesCredentials = includeCredentials

  // 14. If response’s status is 401, httpRequest’s response tainting is not
  // "cors", includeCredentials is true, and request’s window is an environment
  // settings object, then:
  // TODO

  // 15. If response’s status is 407, then:
  if (response.status === 407) {
    // 1. If request’s window is "no-window", then return a network error.
    if (request.window === 'no-window') {
      return makeNetworkError()
    }

    // 2. ???

    // 3. If fetchParams is canceled, then return the appropriate network error for fetchParams.
    if (isCancelled(fetchParams)) {
      return makeAppropriateNetworkError(fetchParams)
    }

    // 4. Prompt the end user as appropriate in request’s window and store
    // the result as a proxy-authentication entry. [HTTP-AUTH]
    // TODO: Invoke some kind of callback?

    // 5. Set response to the result of running HTTP-network-or-cache fetch given
    // fetchParams.
    // TODO
    return makeNetworkError('proxy authentication required')
  }

  // 16. If all of the following are true
  if (
    // response’s status is 421
    response.status === 421 &&
    // isNewConnectionFetch is false
    !isNewConnectionFetch &&
    // request’s body is null, or request’s body is non-null and request’s body’s source is non-null
    (request.body == null || request.body.source != null)
  ) {
    // then:

    // 1. If fetchParams is canceled, then return the appropriate network error for fetchParams.
    if (isCancelled(fetchParams)) {
      return makeAppropriateNetworkError(fetchParams)
    }

    // 2. Set response to the result of running HTTP-network-or-cache
    // fetch given fetchParams, isAuthenticationFetch, and true.

    // TODO (spec): The spec doesn't specify this but we need to cancel
    // the active response before we can start a new one.
    // https://github.com/whatwg/fetch/issues/1293
    fetchParams.controller.connection.destroy()

    response = await httpNetworkOrCacheFetch(
      fetchParams,
      isAuthenticationFetch,
      true
    )
  }

  // 17. If isAuthenticationFetch is true, then create an authentication entry
  if (isAuthenticationFetch) {
    // TODO
  }

  // 18. Return response.
  return response
}

// https://fetch.spec.whatwg.org/#http-network-fetch
async function httpNetworkFetch (
  fetchParams,
  includeCredentials = false,
  forceNewConnection = false
) {
  assert(!fetchParams.controller.connection || fetchParams.controller.connection.destroyed)

  fetchParams.controller.connection = {
    abort: null,
    destroyed: false,
    destroy (err) {
      if (!this.destroyed) {
        this.destroyed = true
        this.abort?.(err ?? new DOMException('The operation was aborted.', 'AbortError'))
      }
    }
  }

  // 1. Let request be fetchParams’s request.
  const request = fetchParams.request

  // 2. Let response be null.
  let response = null

  // 3. Let timingInfo be fetchParams’s timing info.
  const timingInfo = fetchParams.timingInfo

  // 4. Let httpCache be the result of determining the HTTP cache partition,
  // given request.
  // TODO: cache
  const httpCache = null

  // 5. If httpCache is null, then set request’s cache mode to "no-store".
  if (httpCache == null) {
    request.cache = 'no-store'
  }

  // 6. Let networkPartitionKey be the result of determining the network
  // partition key given request.
  // TODO

  // 7. Let newConnection be "yes" if forceNewConnection is true; otherwise
  // "no".
  const newConnection = forceNewConnection ? 'yes' : 'no' // eslint-disable-line no-unused-vars

  // 8. Switch on request’s mode:
  if (request.mode === 'websocket') {
    // Let connection be the result of obtaining a WebSocket connection,
    // given request’s current URL.
    // TODO
  } else {
    // Let connection be the result of obtaining a connection, given
    // networkPartitionKey, request’s current URL’s origin,
    // includeCredentials, and forceNewConnection.
    // TODO
  }

  // 9. Run these steps, but abort when the ongoing fetch is terminated:

  //    1. If connection is failure, then return a network error.

  //    2. Set timingInfo’s final connection timing info to the result of
  //    calling clamp and coarsen connection timing info with connection’s
  //    timing info, timingInfo’s post-redirect start time, and fetchParams’s
  //    cross-origin isolated capability.

  //    3. If connection is not an HTTP/2 connection, request’s body is non-null,
  //    and request’s body’s source is null, then append (`Transfer-Encoding`,
  //    `chunked`) to request’s header list.

  //    4. Set timingInfo’s final network-request start time to the coarsened
  //    shared current time given fetchParams’s cross-origin isolated
  //    capability.

  //    5. Set response to the result of making an HTTP request over connection
  //    using request with the following caveats:

  //        - Follow the relevant requirements from HTTP. [HTTP] [HTTP-SEMANTICS]
  //        [HTTP-COND] [HTTP-CACHING] [HTTP-AUTH]

  //        - If request’s body is non-null, and request’s body’s source is null,
  //        then the user agent may have a buffer of up to 64 kibibytes and store
  //        a part of request’s body in that buffer. If the user agent reads from
  //        request’s body beyond that buffer’s size and the user agent needs to
  //        resend request, then instead return a network error.

  //        - Set timingInfo’s final network-response start time to the coarsened
  //        shared current time given fetchParams’s cross-origin isolated capability,
  //        immediately after the user agent’s HTTP parser receives the first byte
  //        of the response (e.g., frame header bytes for HTTP/2 or response status
  //        line for HTTP/1.x).

  //        - Wait until all the headers are transmitted.

  //        - Any responses whose status is in the range 100 to 199, inclusive,
  //        and is not 101, are to be ignored, except for the purposes of setting
  //        timingInfo’s final network-response start time above.

  //    - If request’s header list contains `Transfer-Encoding`/`chunked` and
  //    response is transferred via HTTP/1.0 or older, then return a network
  //    error.

  //    - If the HTTP request results in a TLS client certificate dialog, then:

  //        1. If request’s window is an environment settings object, make the
  //        dialog available in request’s window.

  //        2. Otherwise, return a network error.

  // To transmit request’s body body, run these steps:
  let requestBody = null
  // 1. If body is null and fetchParams’s process request end-of-body is
  // non-null, then queue a fetch task given fetchParams’s process request
  // end-of-body and fetchParams’s task destination.
  if (request.body == null && fetchParams.processRequestEndOfBody) {
    queueMicrotask(() => fetchParams.processRequestEndOfBody())
  } else if (request.body != null) {
    // 2. Otherwise, if body is non-null:

    //    1. Let processBodyChunk given bytes be these steps:
    const processBodyChunk = async function * (bytes) {
      // 1. If the ongoing fetch is terminated, then abort these steps.
      if (isCancelled(fetchParams)) {
        return
      }

      // 2. Run this step in parallel: transmit bytes.
      yield bytes

      // 3. If fetchParams’s process request body is non-null, then run
      // fetchParams’s process request body given bytes’s length.
      fetchParams.processRequestBodyChunkLength?.(bytes.byteLength)
    }

    // 2. Let processEndOfBody be these steps:
    const processEndOfBody = () => {
      // 1. If fetchParams is canceled, then abort these steps.
      if (isCancelled(fetchParams)) {
        return
      }

      // 2. If fetchParams’s process request end-of-body is non-null,
      // then run fetchParams’s process request end-of-body.
      if (fetchParams.processRequestEndOfBody) {
        fetchParams.processRequestEndOfBody()
      }
    }

    // 3. Let processBodyError given e be these steps:
    const processBodyError = (e) => {
      // 1. If fetchParams is canceled, then abort these steps.
      if (isCancelled(fetchParams)) {
        return
      }

      // 2. If e is an "AbortError" DOMException, then abort fetchParams’s controller.
      if (e.name === 'AbortError') {
        fetchParams.controller.abort()
      } else {
        fetchParams.controller.terminate(e)
      }
    }

    // 4. Incrementally read request’s body given processBodyChunk, processEndOfBody,
    // processBodyError, and fetchParams’s task destination.
    requestBody = (async function * () {
      try {
        for await (const bytes of request.body.stream) {
          yield * processBodyChunk(bytes)
        }
        processEndOfBody()
      } catch (err) {
        processBodyError(err)
      }
    })()
  }

  try {
    // socket is only provided for websockets
    const { body, status, statusText, headersList, socket } = await dispatch({ body: requestBody })

    if (socket) {
      response = makeResponse({ status, statusText, headersList, socket })
    } else {
      const iterator = body[Symbol.asyncIterator]()
      fetchParams.controller.next = () => iterator.next()

      response = makeResponse({ status, statusText, headersList })
    }
  } catch (err) {
    // 10. If aborted, then:
    if (err.name === 'AbortError') {
      // 1. If connection uses HTTP/2, then transmit an RST_STREAM frame.
      fetchParams.controller.connection.destroy()

      // 2. Return the appropriate network error for fetchParams.
      return makeAppropriateNetworkError(fetchParams, err)
    }

    return makeNetworkError(err)
  }

  // 11. Let pullAlgorithm be an action that resumes the ongoing fetch
  // if it is suspended.
  const pullAlgorithm = () => {
    fetchParams.controller.resume()
  }

  // 12. Let cancelAlgorithm be an algorithm that aborts fetchParams’s
  // controller with reason, given reason.
  const cancelAlgorithm = (reason) => {
    fetchParams.controller.abort(reason)
  }

  // 13. Let highWaterMark be a non-negative, non-NaN number, chosen by
  // the user agent.
  // TODO

  // 14. Let sizeAlgorithm be an algorithm that accepts a chunk object
  // and returns a non-negative, non-NaN, non-infinite number, chosen by the user agent.
  // TODO

  // 15. Let stream be a new ReadableStream.
  // 16. Set up stream with pullAlgorithm set to pullAlgorithm,
  // cancelAlgorithm set to cancelAlgorithm, highWaterMark set to
  // highWaterMark, and sizeAlgorithm set to sizeAlgorithm.
  if (!ReadableStream) {
    ReadableStream = (__nccwpck_require__(5356).ReadableStream)
  }

  const stream = new ReadableStream(
    {
      async start (controller) {
        fetchParams.controller.controller = controller
      },
      async pull (controller) {
        await pullAlgorithm(controller)
      },
      async cancel (reason) {
        await cancelAlgorithm(reason)
      }
    },
    {
      highWaterMark: 0,
      size () {
        return 1
      }
    }
  )

  // 17. Run these steps, but abort when the ongoing fetch is terminated:

  //    1. Set response’s body to a new body whose stream is stream.
  response.body = { stream }

  //    2. If response is not a network error and request’s cache mode is
  //    not "no-store", then update response in httpCache for request.
  //    TODO

  //    3. If includeCredentials is true and the user agent is not configured
  //    to block cookies for request (see section 7 of [COOKIES]), then run the
  //    "set-cookie-string" parsing algorithm (see section 5.2 of [COOKIES]) on
  //    the value of each header whose name is a byte-case-insensitive match for
  //    `Set-Cookie` in response’s header list, if any, and request’s current URL.
  //    TODO

  // 18. If aborted, then:
  // TODO

  // 19. Run these steps in parallel:

  //    1. Run these steps, but abort when fetchParams is canceled:
  fetchParams.controller.on('terminated', onAborted)
  fetchParams.controller.resume = async () => {
    // 1. While true
    while (true) {
      // 1-3. See onData...

      // 4. Set bytes to the result of handling content codings given
      // codings and bytes.
      let bytes
      let isFailure
      try {
        const { done, value } = await fetchParams.controller.next()

        if (isAborted(fetchParams)) {
          break
        }

        bytes = done ? undefined : value
      } catch (err) {
        if (fetchParams.controller.ended && !timingInfo.encodedBodySize) {
          // zlib doesn't like empty streams.
          bytes = undefined
        } else {
          bytes = err

          // err may be propagated from the result of calling readablestream.cancel,
          // which might not be an error. https://github.com/nodejs/undici/issues/2009
          isFailure = true
        }
      }

      if (bytes === undefined) {
        // 2. Otherwise, if the bytes transmission for response’s message
        // body is done normally and stream is readable, then close
        // stream, finalize response for fetchParams and response, and
        // abort these in-parallel steps.
        readableStreamClose(fetchParams.controller.controller)

        finalizeResponse(fetchParams, response)

        return
      }

      // 5. Increase timingInfo’s decoded body size by bytes’s length.
      timingInfo.decodedBodySize += bytes?.byteLength ?? 0

      // 6. If bytes is failure, then terminate fetchParams’s controller.
      if (isFailure) {
        fetchParams.controller.terminate(bytes)
        return
      }

      // 7. Enqueue a Uint8Array wrapping an ArrayBuffer containing bytes
      // into stream.
      fetchParams.controller.controller.enqueue(new Uint8Array(bytes))

      // 8. If stream is errored, then terminate the ongoing fetch.
      if (isErrored(stream)) {
        fetchParams.controller.terminate()
        return
      }

      // 9. If stream doesn’t need more data ask the user agent to suspend
      // the ongoing fetch.
      if (!fetchParams.controller.controller.desiredSize) {
        return
      }
    }
  }

  //    2. If aborted, then:
  function onAborted (reason) {
    // 2. If fetchParams is aborted, then:
    if (isAborted(fetchParams)) {
      // 1. Set response’s aborted flag.
      response.aborted = true

      // 2. If stream is readable, then error stream with the result of
      //    deserialize a serialized abort reason given fetchParams’s
      //    controller’s serialized abort reason and an
      //    implementation-defined realm.
      if (isReadable(stream)) {
        fetchParams.controller.controller.error(
          fetchParams.controller.serializedAbortReason
        )
      }
    } else {
      // 3. Otherwise, if stream is readable, error stream with a TypeError.
      if (isReadable(stream)) {
        fetchParams.controller.controller.error(new TypeError('terminated', {
          cause: isErrorLike(reason) ? reason : undefined
        }))
      }
    }

    // 4. If connection uses HTTP/2, then transmit an RST_STREAM frame.
    // 5. Otherwise, the user agent should close connection unless it would be bad for performance to do so.
    fetchParams.controller.connection.destroy()
  }

  // 20. Return response.
  return response

  async function dispatch ({ body }) {
    const url = requestCurrentURL(request)
    /** @type {import('../..').Agent} */
    const agent = fetchParams.controller.dispatcher

    return new Promise((resolve, reject) => agent.dispatch(
      {
        path: url.pathname + url.search,
        origin: url.origin,
        method: request.method,
        body: fetchParams.controller.dispatcher.isMockActive ? request.body && (request.body.source || request.body.stream) : body,
        headers: request.headersList.entries,
        maxRedirections: 0,
        upgrade: request.mode === 'websocket' ? 'websocket' : undefined
      },
      {
        body: null,
        abort: null,

        onConnect (abort) {
          // TODO (fix): Do we need connection here?
          const { connection } = fetchParams.controller

          if (connection.destroyed) {
            abort(new DOMException('The operation was aborted.', 'AbortError'))
          } else {
            fetchParams.controller.on('terminated', abort)
            this.abort = connection.abort = abort
          }
        },

        onHeaders (status, headersList, resume, statusText) {
          if (status < 200) {
            return
          }

          let codings = []
          let location = ''

          const headers = new Headers()

          // For H2, the headers are a plain JS object
          // We distinguish between them and iterate accordingly
          if (Array.isArray(headersList)) {
            for (let n = 0; n < headersList.length; n += 2) {
              const key = headersList[n + 0].toString('latin1')
              const val = headersList[n + 1].toString('latin1')
              if (key.toLowerCase() === 'content-encoding') {
                // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.2.1
                // "All content-coding values are case-insensitive..."
                codings = val.toLowerCase().split(',').map((x) => x.trim())
              } else if (key.toLowerCase() === 'location') {
                location = val
              }

              headers[kHeadersList].append(key, val)
            }
          } else {
            const keys = Object.keys(headersList)
            for (const key of keys) {
              const val = headersList[key]
              if (key.toLowerCase() === 'content-encoding') {
                // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.2.1
                // "All content-coding values are case-insensitive..."
                codings = val.toLowerCase().split(',').map((x) => x.trim()).reverse()
              } else if (key.toLowerCase() === 'location') {
                location = val
              }

              headers[kHeadersList].append(key, val)
            }
          }

          this.body = new Readable({ read: resume })

          const decoders = []

          const willFollow = request.redirect === 'follow' &&
            location &&
            redirectStatusSet.has(status)

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
          if (request.method !== 'HEAD' && request.method !== 'CONNECT' && !nullBodyStatus.includes(status) && !willFollow) {
            for (const coding of codings) {
              // https://www.rfc-editor.org/rfc/rfc9112.html#section-7.2
              if (coding === 'x-gzip' || coding === 'gzip') {
                decoders.push(zlib.createGunzip({
                  // Be less strict when decoding compressed responses, since sometimes
                  // servers send slightly invalid responses that are still accepted
                  // by common browsers.
                  // Always using Z_SYNC_FLUSH is what cURL does.
                  flush: zlib.constants.Z_SYNC_FLUSH,
                  finishFlush: zlib.constants.Z_SYNC_FLUSH
                }))
              } else if (coding === 'deflate') {
                decoders.push(zlib.createInflate())
              } else if (coding === 'br') {
                decoders.push(zlib.createBrotliDecompress())
              } else {
                decoders.length = 0
                break
              }
            }
          }

          resolve({
            status,
            statusText,
            headersList: headers[kHeadersList],
            body: decoders.length
              ? pipeline(this.body, ...decoders, () => { })
              : this.body.on('error', () => {})
          })

          return true
        },

        onData (chunk) {
          if (fetchParams.controller.dump) {
            return
          }

          // 1. If one or more bytes have been transmitted from response’s
          // message body, then:

          //  1. Let bytes be the transmitted bytes.
          const bytes = chunk

          //  2. Let codings be the result of extracting header list values
          //  given `Content-Encoding` and response’s header list.
          //  See pullAlgorithm.

          //  3. Increase timingInfo’s encoded body size by bytes’s length.
          timingInfo.encodedBodySize += bytes.byteLength

          //  4. See pullAlgorithm...

          return this.body.push(bytes)
        },

        onComplete () {
          if (this.abort) {
            fetchParams.controller.off('terminated', this.abort)
          }

          fetchParams.controller.ended = true

          this.body.push(null)
        },

        onError (error) {
          if (this.abort) {
            fetchParams.controller.off('terminated', this.abort)
          }

          this.body?.destroy(error)

          fetchParams.controller.terminate(error)

          reject(error)
        },

        onUpgrade (status, headersList, socket) {
          if (status !== 101) {
            return
          }

          const headers = new Headers()

          for (let n = 0; n < headersList.length; n += 2) {
            const key = headersList[n + 0].toString('latin1')
            const val = headersList[n + 1].toString('latin1')

            headers[kHeadersList].append(key, val)
          }

          resolve({
            status,
            statusText: STATUS_CODES[status],
            headersList: headers[kHeadersList],
            socket
          })

          return true
        }
      }
    ))
  }
}

module.exports = {
  fetch,
  Fetch,
  fetching,
  finalizeAndReportTiming
}


/***/ }),

/***/ 8359:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* globals AbortController */



const { extractBody, mixinBody, cloneBody } = __nccwpck_require__(1472)
const { Headers, fill: fillHeaders, HeadersList } = __nccwpck_require__(554)
const { FinalizationRegistry } = __nccwpck_require__(6436)()
const util = __nccwpck_require__(3983)
const {
  isValidHTTPToken,
  sameOrigin,
  normalizeMethod,
  makePolicyContainer,
  normalizeMethodRecord
} = __nccwpck_require__(2538)
const {
  forbiddenMethodsSet,
  corsSafeListedMethodsSet,
  referrerPolicy,
  requestRedirect,
  requestMode,
  requestCredentials,
  requestCache,
  requestDuplex
} = __nccwpck_require__(1037)
const { kEnumerableProperty } = util
const { kHeaders, kSignal, kState, kGuard, kRealm } = __nccwpck_require__(5861)
const { webidl } = __nccwpck_require__(1744)
const { getGlobalOrigin } = __nccwpck_require__(1246)
const { URLSerializer } = __nccwpck_require__(685)
const { kHeadersList, kConstruct } = __nccwpck_require__(2785)
const assert = __nccwpck_require__(9491)
const { getMaxListeners, setMaxListeners, getEventListeners, defaultMaxListeners } = __nccwpck_require__(2361)

let TransformStream = globalThis.TransformStream

const kAbortController = Symbol('abortController')

const requestFinalizer = new FinalizationRegistry(({ signal, abort }) => {
  signal.removeEventListener('abort', abort)
})

// https://fetch.spec.whatwg.org/#request-class
class Request {
  // https://fetch.spec.whatwg.org/#dom-request
  constructor (input, init = {}) {
    if (input === kConstruct) {
      return
    }

    webidl.argumentLengthCheck(arguments, 1, { header: 'Request constructor' })

    input = webidl.converters.RequestInfo(input)
    init = webidl.converters.RequestInit(init)

    // https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object
    this[kRealm] = {
      settingsObject: {
        baseUrl: getGlobalOrigin(),
        get origin () {
          return this.baseUrl?.origin
        },
        policyContainer: makePolicyContainer()
      }
    }

    // 1. Let request be null.
    let request = null

    // 2. Let fallbackMode be null.
    let fallbackMode = null

    // 3. Let baseURL be this’s relevant settings object’s API base URL.
    const baseUrl = this[kRealm].settingsObject.baseUrl

    // 4. Let signal be null.
    let signal = null

    // 5. If input is a string, then:
    if (typeof input === 'string') {
      // 1. Let parsedURL be the result of parsing input with baseURL.
      // 2. If parsedURL is failure, then throw a TypeError.
      let parsedURL
      try {
        parsedURL = new URL(input, baseUrl)
      } catch (err) {
        throw new TypeError('Failed to parse URL from ' + input, { cause: err })
      }

      // 3. If parsedURL includes credentials, then throw a TypeError.
      if (parsedURL.username || parsedURL.password) {
        throw new TypeError(
          'Request cannot be constructed from a URL that includes credentials: ' +
            input
        )
      }

      // 4. Set request to a new request whose URL is parsedURL.
      request = makeRequest({ urlList: [parsedURL] })

      // 5. Set fallbackMode to "cors".
      fallbackMode = 'cors'
    } else {
      // 6. Otherwise:

      // 7. Assert: input is a Request object.
      assert(input instanceof Request)

      // 8. Set request to input’s request.
      request = input[kState]

      // 9. Set signal to input’s signal.
      signal = input[kSignal]
    }

    // 7. Let origin be this’s relevant settings object’s origin.
    const origin = this[kRealm].settingsObject.origin

    // 8. Let window be "client".
    let window = 'client'

    // 9. If request’s window is an environment settings object and its origin
    // is same origin with origin, then set window to request’s window.
    if (
      request.window?.constructor?.name === 'EnvironmentSettingsObject' &&
      sameOrigin(request.window, origin)
    ) {
      window = request.window
    }

    // 10. If init["window"] exists and is non-null, then throw a TypeError.
    if (init.window != null) {
      throw new TypeError(`'window' option '${window}' must be null`)
    }

    // 11. If init["window"] exists, then set window to "no-window".
    if ('window' in init) {
      window = 'no-window'
    }

    // 12. Set request to a new request with the following properties:
    request = makeRequest({
      // URL request’s URL.
      // undici implementation note: this is set as the first item in request's urlList in makeRequest
      // method request’s method.
      method: request.method,
      // header list A copy of request’s header list.
      // undici implementation note: headersList is cloned in makeRequest
      headersList: request.headersList,
      // unsafe-request flag Set.
      unsafeRequest: request.unsafeRequest,
      // client This’s relevant settings object.
      client: this[kRealm].settingsObject,
      // window window.
      window,
      // priority request’s priority.
      priority: request.priority,
      // origin request’s origin. The propagation of the origin is only significant for navigation requests
      // being handled by a service worker. In this scenario a request can have an origin that is different
      // from the current client.
      origin: request.origin,
      // referrer request’s referrer.
      referrer: request.referrer,
      // referrer policy request’s referrer policy.
      referrerPolicy: request.referrerPolicy,
      // mode request’s mode.
      mode: request.mode,
      // credentials mode request’s credentials mode.
      credentials: request.credentials,
      // cache mode request’s cache mode.
      cache: request.cache,
      // redirect mode request’s redirect mode.
      redirect: request.redirect,
      // integrity metadata request’s integrity metadata.
      integrity: request.integrity,
      // keepalive request’s keepalive.
      keepalive: request.keepalive,
      // reload-navigation flag request’s reload-navigation flag.
      reloadNavigation: request.reloadNavigation,
      // history-navigation flag request’s history-navigation flag.
      historyNavigation: request.historyNavigation,
      // URL list A clone of request’s URL list.
      urlList: [...request.urlList]
    })

    const initHasKey = Object.keys(init).length !== 0

    // 13. If init is not empty, then:
    if (initHasKey) {
      // 1. If request’s mode is "navigate", then set it to "same-origin".
      if (request.mode === 'navigate') {
        request.mode = 'same-origin'
      }

      // 2. Unset request’s reload-navigation flag.
      request.reloadNavigation = false

      // 3. Unset request’s history-navigation flag.
      request.historyNavigation = false

      // 4. Set request’s origin to "client".
      request.origin = 'client'

      // 5. Set request’s referrer to "client"
      request.referrer = 'client'

      // 6. Set request’s referrer policy to the empty string.
      request.referrerPolicy = ''

      // 7. Set request’s URL to request’s current URL.
      request.url = request.urlList[request.urlList.length - 1]

      // 8. Set request’s URL list to « request’s URL ».
      request.urlList = [request.url]
    }

    // 14. If init["referrer"] exists, then:
    if (init.referrer !== undefined) {
      // 1. Let referrer be init["referrer"].
      const referrer = init.referrer

      // 2. If referrer is the empty string, then set request’s referrer to "no-referrer".
      if (referrer === '') {
        request.referrer = 'no-referrer'
      } else {
        // 1. Let parsedReferrer be the result of parsing referrer with
        // baseURL.
        // 2. If parsedReferrer is failure, then throw a TypeError.
        let parsedReferrer
        try {
          parsedReferrer = new URL(referrer, baseUrl)
        } catch (err) {
          throw new TypeError(`Referrer "${referrer}" is not a valid URL.`, { cause: err })
        }

        // 3. If one of the following is true
        // - parsedReferrer’s scheme is "about" and path is the string "client"
        // - parsedReferrer’s origin is not same origin with origin
        // then set request’s referrer to "client".
        if (
          (parsedReferrer.protocol === 'about:' && parsedReferrer.hostname === 'client') ||
          (origin && !sameOrigin(parsedReferrer, this[kRealm].settingsObject.baseUrl))
        ) {
          request.referrer = 'client'
        } else {
          // 4. Otherwise, set request’s referrer to parsedReferrer.
          request.referrer = parsedReferrer
        }
      }
    }

    // 15. If init["referrerPolicy"] exists, then set request’s referrer policy
    // to it.
    if (init.referrerPolicy !== undefined) {
      request.referrerPolicy = init.referrerPolicy
    }

    // 16. Let mode be init["mode"] if it exists, and fallbackMode otherwise.
    let mode
    if (init.mode !== undefined) {
      mode = init.mode
    } else {
      mode = fallbackMode
    }

    // 17. If mode is "navigate", then throw a TypeError.
    if (mode === 'navigate') {
      throw webidl.errors.exception({
        header: 'Request constructor',
        message: 'invalid request mode navigate.'
      })
    }

    // 18. If mode is non-null, set request’s mode to mode.
    if (mode != null) {
      request.mode = mode
    }

    // 19. If init["credentials"] exists, then set request’s credentials mode
    // to it.
    if (init.credentials !== undefined) {
      request.credentials = init.credentials
    }

    // 18. If init["cache"] exists, then set request’s cache mode to it.
    if (init.cache !== undefined) {
      request.cache = init.cache
    }

    // 21. If request’s cache mode is "only-if-cached" and request’s mode is
    // not "same-origin", then throw a TypeError.
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
      throw new TypeError(
        "'only-if-cached' can be set only with 'same-origin' mode"
      )
    }

    // 22. If init["redirect"] exists, then set request’s redirect mode to it.
    if (init.redirect !== undefined) {
      request.redirect = init.redirect
    }

    // 23. If init["integrity"] exists, then set request’s integrity metadata to it.
    if (init.integrity != null) {
      request.integrity = String(init.integrity)
    }

    // 24. If init["keepalive"] exists, then set request’s keepalive to it.
    if (init.keepalive !== undefined) {
      request.keepalive = Boolean(init.keepalive)
    }

    // 25. If init["method"] exists, then:
    if (init.method !== undefined) {
      // 1. Let method be init["method"].
      let method = init.method

      // 2. If method is not a method or method is a forbidden method, then
      // throw a TypeError.
      if (!isValidHTTPToken(method)) {
        throw new TypeError(`'${method}' is not a valid HTTP method.`)
      }

      if (forbiddenMethodsSet.has(method.toUpperCase())) {
        throw new TypeError(`'${method}' HTTP method is unsupported.`)
      }

      // 3. Normalize method.
      method = normalizeMethodRecord[method] ?? normalizeMethod(method)

      // 4. Set request’s method to method.
      request.method = method
    }

    // 26. If init["signal"] exists, then set signal to it.
    if (init.signal !== undefined) {
      signal = init.signal
    }

    // 27. Set this’s request to request.
    this[kState] = request

    // 28. Set this’s signal to a new AbortSignal object with this’s relevant
    // Realm.
    // TODO: could this be simplified with AbortSignal.any
    // (https://dom.spec.whatwg.org/#dom-abortsignal-any)
    const ac = new AbortController()
    this[kSignal] = ac.signal
    this[kSignal][kRealm] = this[kRealm]

    // 29. If signal is not null, then make this’s signal follow signal.
    if (signal != null) {
      if (
        !signal ||
        typeof signal.aborted !== 'boolean' ||
        typeof signal.addEventListener !== 'function'
      ) {
        throw new TypeError(
          "Failed to construct 'Request': member signal is not of type AbortSignal."
        )
      }

      if (signal.aborted) {
        ac.abort(signal.reason)
      } else {
        // Keep a strong ref to ac while request object
        // is alive. This is needed to prevent AbortController
        // from being prematurely garbage collected.
        // See, https://github.com/nodejs/undici/issues/1926.
        this[kAbortController] = ac

        const acRef = new WeakRef(ac)
        const abort = function () {
          const ac = acRef.deref()
          if (ac !== undefined) {
            ac.abort(this.reason)
          }
        }

        // Third-party AbortControllers may not work with these.
        // See, https://github.com/nodejs/undici/pull/1910#issuecomment-1464495619.
        try {
          // If the max amount of listeners is equal to the default, increase it
          // This is only available in node >= v19.9.0
          if (typeof getMaxListeners === 'function' && getMaxListeners(signal) === defaultMaxListeners) {
            setMaxListeners(100, signal)
          } else if (getEventListeners(signal, 'abort').length >= defaultMaxListeners) {
            setMaxListeners(100, signal)
          }
        } catch {}

        util.addAbortListener(signal, abort)
        requestFinalizer.register(ac, { signal, abort })
      }
    }

    // 30. Set this’s headers to a new Headers object with this’s relevant
    // Realm, whose header list is request’s header list and guard is
    // "request".
    this[kHeaders] = new Headers(kConstruct)
    this[kHeaders][kHeadersList] = request.headersList
    this[kHeaders][kGuard] = 'request'
    this[kHeaders][kRealm] = this[kRealm]

    // 31. If this’s request’s mode is "no-cors", then:
    if (mode === 'no-cors') {
      // 1. If this’s request’s method is not a CORS-safelisted method,
      // then throw a TypeError.
      if (!corsSafeListedMethodsSet.has(request.method)) {
        throw new TypeError(
          `'${request.method} is unsupported in no-cors mode.`
        )
      }

      // 2. Set this’s headers’s guard to "request-no-cors".
      this[kHeaders][kGuard] = 'request-no-cors'
    }

    // 32. If init is not empty, then:
    if (initHasKey) {
      /** @type {HeadersList} */
      const headersList = this[kHeaders][kHeadersList]
      // 1. Let headers be a copy of this’s headers and its associated header
      // list.
      // 2. If init["headers"] exists, then set headers to init["headers"].
      const headers = init.headers !== undefined ? init.headers : new HeadersList(headersList)

      // 3. Empty this’s headers’s header list.
      headersList.clear()

      // 4. If headers is a Headers object, then for each header in its header
      // list, append header’s name/header’s value to this’s headers.
      if (headers instanceof HeadersList) {
        for (const [key, val] of headers) {
          headersList.append(key, val)
        }
        // Note: Copy the `set-cookie` meta-data.
        headersList.cookies = headers.cookies
      } else {
        // 5. Otherwise, fill this’s headers with headers.
        fillHeaders(this[kHeaders], headers)
      }
    }

    // 33. Let inputBody be input’s request’s body if input is a Request
    // object; otherwise null.
    const inputBody = input instanceof Request ? input[kState].body : null

    // 34. If either init["body"] exists and is non-null or inputBody is
    // non-null, and request’s method is `GET` or `HEAD`, then throw a
    // TypeError.
    if (
      (init.body != null || inputBody != null) &&
      (request.method === 'GET' || request.method === 'HEAD')
    ) {
      throw new TypeError('Request with GET/HEAD method cannot have body.')
    }

    // 35. Let initBody be null.
    let initBody = null

    // 36. If init["body"] exists and is non-null, then:
    if (init.body != null) {
      // 1. Let Content-Type be null.
      // 2. Set initBody and Content-Type to the result of extracting
      // init["body"], with keepalive set to request’s keepalive.
      const [extractedBody, contentType] = extractBody(
        init.body,
        request.keepalive
      )
      initBody = extractedBody

      // 3, If Content-Type is non-null and this’s headers’s header list does
      // not contain `Content-Type`, then append `Content-Type`/Content-Type to
      // this’s headers.
      if (contentType && !this[kHeaders][kHeadersList].contains('content-type')) {
        this[kHeaders].append('content-type', contentType)
      }
    }

    // 37. Let inputOrInitBody be initBody if it is non-null; otherwise
    // inputBody.
    const inputOrInitBody = initBody ?? inputBody

    // 38. If inputOrInitBody is non-null and inputOrInitBody’s source is
    // null, then:
    if (inputOrInitBody != null && inputOrInitBody.source == null) {
      // 1. If initBody is non-null and init["duplex"] does not exist,
      //    then throw a TypeError.
      if (initBody != null && init.duplex == null) {
        throw new TypeError('RequestInit: duplex option is required when sending a body.')
      }

      // 2. If this’s request’s mode is neither "same-origin" nor "cors",
      // then throw a TypeError.
      if (request.mode !== 'same-origin' && request.mode !== 'cors') {
        throw new TypeError(
          'If request is made from ReadableStream, mode should be "same-origin" or "cors"'
        )
      }

      // 3. Set this’s request’s use-CORS-preflight flag.
      request.useCORSPreflightFlag = true
    }

    // 39. Let finalBody be inputOrInitBody.
    let finalBody = inputOrInitBody

    // 40. If initBody is null and inputBody is non-null, then:
    if (initBody == null && inputBody != null) {
      // 1. If input is unusable, then throw a TypeError.
      if (util.isDisturbed(inputBody.stream) || inputBody.stream.locked) {
        throw new TypeError(
          'Cannot construct a Request with a Request object that has already been used.'
        )
      }

      // 2. Set finalBody to the result of creating a proxy for inputBody.
      if (!TransformStream) {
        TransformStream = (__nccwpck_require__(5356).TransformStream)
      }

      // https://streams.spec.whatwg.org/#readablestream-create-a-proxy
      const identityTransform = new TransformStream()
      inputBody.stream.pipeThrough(identityTransform)
      finalBody = {
        source: inputBody.source,
        length: inputBody.length,
        stream: identityTransform.readable
      }
    }

    // 41. Set this’s request’s body to finalBody.
    this[kState].body = finalBody
  }

  // Returns request’s HTTP method, which is "GET" by default.
  get method () {
    webidl.brandCheck(this, Request)

    // The method getter steps are to return this’s request’s method.
    return this[kState].method
  }

  // Returns the URL of request as a string.
  get url () {
    webidl.brandCheck(this, Request)

    // The url getter steps are to return this’s request’s URL, serialized.
    return URLSerializer(this[kState].url)
  }

  // Returns a Headers object consisting of the headers associated with request.
  // Note that headers added in the network layer by the user agent will not
  // be accounted for in this object, e.g., the "Host" header.
  get headers () {
    webidl.brandCheck(this, Request)

    // The headers getter steps are to return this’s headers.
    return this[kHeaders]
  }

  // Returns the kind of resource requested by request, e.g., "document"
  // or "script".
  get destination () {
    webidl.brandCheck(this, Request)

    // The destination getter are to return this’s request’s destination.
    return this[kState].destination
  }

  // Returns the referrer of request. Its value can be a same-origin URL if
  // explicitly set in init, the empty string to indicate no referrer, and
  // "about:client" when defaulting to the global’s default. This is used
  // during fetching to determine the value of the `Referer` header of the
  // request being made.
  get referrer () {
    webidl.brandCheck(this, Request)

    // 1. If this’s request’s referrer is "no-referrer", then return the
    // empty string.
    if (this[kState].referrer === 'no-referrer') {
      return ''
    }

    // 2. If this’s request’s referrer is "client", then return
    // "about:client".
    if (this[kState].referrer === 'client') {
      return 'about:client'
    }

    // Return this’s request’s referrer, serialized.
    return this[kState].referrer.toString()
  }

  // Returns the referrer policy associated with request.
  // This is used during fetching to compute the value of the request’s
  // referrer.
  get referrerPolicy () {
    webidl.brandCheck(this, Request)

    // The referrerPolicy getter steps are to return this’s request’s referrer policy.
    return this[kState].referrerPolicy
  }

  // Returns the mode associated with request, which is a string indicating
  // whether the request will use CORS, or will be restricted to same-origin
  // URLs.
  get mode () {
    webidl.brandCheck(this, Request)

    // The mode getter steps are to return this’s request’s mode.
    return this[kState].mode
  }

  // Returns the credentials mode associated with request,
  // which is a string indicating whether credentials will be sent with the
  // request always, never, or only when sent to a same-origin URL.
  get credentials () {
    // The credentials getter steps are to return this’s request’s credentials mode.
    return this[kState].credentials
  }

  // Returns the cache mode associated with request,
  // which is a string indicating how the request will
  // interact with the browser’s cache when fetching.
  get cache () {
    webidl.brandCheck(this, Request)

    // The cache getter steps are to return this’s request’s cache mode.
    return this[kState].cache
  }

  // Returns the redirect mode associated with request,
  // which is a string indicating how redirects for the
  // request will be handled during fetching. A request
  // will follow redirects by default.
  get redirect () {
    webidl.brandCheck(this, Request)

    // The redirect getter steps are to return this’s request’s redirect mode.
    return this[kState].redirect
  }

  // Returns request’s subresource integrity metadata, which is a
  // cryptographic hash of the resource being fetched. Its value
  // consists of multiple hashes separated by whitespace. [SRI]
  get integrity () {
    webidl.brandCheck(this, Request)

    // The integrity getter steps are to return this’s request’s integrity
    // metadata.
    return this[kState].integrity
  }

  // Returns a boolean indicating whether or not request can outlive the
  // global in which it was created.
  get keepalive () {
    webidl.brandCheck(this, Request)

    // The keepalive getter steps are to return this’s request’s keepalive.
    return this[kState].keepalive
  }

  // Returns a boolean indicating whether or not request is for a reload
  // navigation.
  get isReloadNavigation () {
    webidl.brandCheck(this, Request)

    // The isReloadNavigation getter steps are to return true if this’s
    // request’s reload-navigation flag is set; otherwise false.
    return this[kState].reloadNavigation
  }

  // Returns a boolean indicating whether or not request is for a history
  // navigation (a.k.a. back-foward navigation).
  get isHistoryNavigation () {
    webidl.brandCheck(this, Request)

    // The isHistoryNavigation getter steps are to return true if this’s request’s
    // history-navigation flag is set; otherwise false.
    return this[kState].historyNavigation
  }

  // Returns the signal associated with request, which is an AbortSignal
  // object indicating whether or not request has been aborted, and its
  // abort event handler.
  get signal () {
    webidl.brandCheck(this, Request)

    // The signal getter steps are to return this’s signal.
    return this[kSignal]
  }

  get body () {
    webidl.brandCheck(this, Request)

    return this[kState].body ? this[kState].body.stream : null
  }

  get bodyUsed () {
    webidl.brandCheck(this, Request)

    return !!this[kState].body && util.isDisturbed(this[kState].body.stream)
  }

  get duplex () {
    webidl.brandCheck(this, Request)

    return 'half'
  }

  // Returns a clone of request.
  clone () {
    webidl.brandCheck(this, Request)

    // 1. If this is unusable, then throw a TypeError.
    if (this.bodyUsed || this.body?.locked) {
      throw new TypeError('unusable')
    }

    // 2. Let clonedRequest be the result of cloning this’s request.
    const clonedRequest = cloneRequest(this[kState])

    // 3. Let clonedRequestObject be the result of creating a Request object,
    // given clonedRequest, this’s headers’s guard, and this’s relevant Realm.
    const clonedRequestObject = new Request(kConstruct)
    clonedRequestObject[kState] = clonedRequest
    clonedRequestObject[kRealm] = this[kRealm]
    clonedRequestObject[kHeaders] = new Headers(kConstruct)
    clonedRequestObject[kHeaders][kHeadersList] = clonedRequest.headersList
    clonedRequestObject[kHeaders][kGuard] = this[kHeaders][kGuard]
    clonedRequestObject[kHeaders][kRealm] = this[kHeaders][kRealm]

    // 4. Make clonedRequestObject’s signal follow this’s signal.
    const ac = new AbortController()
    if (this.signal.aborted) {
      ac.abort(this.signal.reason)
    } else {
      util.addAbortListener(
        this.signal,
        () => {
          ac.abort(this.signal.reason)
        }
      )
    }
    clonedRequestObject[kSignal] = ac.signal

    // 4. Return clonedRequestObject.
    return clonedRequestObject
  }
}

mixinBody(Request)

function makeRequest (init) {
  // https://fetch.spec.whatwg.org/#requests
  const request = {
    method: 'GET',
    localURLsOnly: false,
    unsafeRequest: false,
    body: null,
    client: null,
    reservedClient: null,
    replacesClientId: '',
    window: 'client',
    keepalive: false,
    serviceWorkers: 'all',
    initiator: '',
    destination: '',
    priority: null,
    origin: 'client',
    policyContainer: 'client',
    referrer: 'client',
    referrerPolicy: '',
    mode: 'no-cors',
    useCORSPreflightFlag: false,
    credentials: 'same-origin',
    useCredentials: false,
    cache: 'default',
    redirect: 'follow',
    integrity: '',
    cryptoGraphicsNonceMetadata: '',
    parserMetadata: '',
    reloadNavigation: false,
    historyNavigation: false,
    userActivation: false,
    taintedOrigin: false,
    redirectCount: 0,
    responseTainting: 'basic',
    preventNoCacheCacheControlHeaderModification: false,
    done: false,
    timingAllowFailed: false,
    ...init,
    headersList: init.headersList
      ? new HeadersList(init.headersList)
      : new HeadersList()
  }
  request.url = request.urlList[0]
  return request
}

// https://fetch.spec.whatwg.org/#concept-request-clone
function cloneRequest (request) {
  // To clone a request request, run these steps:

  // 1. Let newRequest be a copy of request, except for its body.
  const newRequest = makeRequest({ ...request, body: null })

  // 2. If request’s body is non-null, set newRequest’s body to the
  // result of cloning request’s body.
  if (request.body != null) {
    newRequest.body = cloneBody(request.body)
  }

  // 3. Return newRequest.
  return newRequest
}

Object.defineProperties(Request.prototype, {
  method: kEnumerableProperty,
  url: kEnumerableProperty,
  headers: kEnumerableProperty,
  redirect: kEnumerableProperty,
  clone: kEnumerableProperty,
  signal: kEnumerableProperty,
  duplex: kEnumerableProperty,
  destination: kEnumerableProperty,
  body: kEnumerableProperty,
  bodyUsed: kEnumerableProperty,
  isHistoryNavigation: kEnumerableProperty,
  isReloadNavigation: kEnumerableProperty,
  keepalive: kEnumerableProperty,
  integrity: kEnumerableProperty,
  cache: kEnumerableProperty,
  credentials: kEnumerableProperty,
  attribute: kEnumerableProperty,
  referrerPolicy: kEnumerableProperty,
  referrer: kEnumerableProperty,
  mode: kEnumerableProperty,
  [Symbol.toStringTag]: {
    value: 'Request',
    configurable: true
  }
})

webidl.converters.Request = webidl.interfaceConverter(
  Request
)

// https://fetch.spec.whatwg.org/#requestinfo
webidl.converters.RequestInfo = function (V) {
  if (typeof V === 'string') {
    return webidl.converters.USVString(V)
  }

  if (V instanceof Request) {
    return webidl.converters.Request(V)
  }

  return webidl.converters.USVString(V)
}

webidl.converters.AbortSignal = webidl.interfaceConverter(
  AbortSignal
)

// https://fetch.spec.whatwg.org/#requestinit
webidl.converters.RequestInit = webidl.dictionaryConverter([
  {
    key: 'method',
    converter: webidl.converters.ByteString
  },
  {
    key: 'headers',
    converter: webidl.converters.HeadersInit
  },
  {
    key: 'body',
    converter: webidl.nullableConverter(
      webidl.converters.BodyInit
    )
  },
  {
    key: 'referrer',
    converter: webidl.converters.USVString
  },
  {
    key: 'referrerPolicy',
    converter: webidl.converters.DOMString,
    // https://w3c.github.io/webappsec-referrer-policy/#referrer-policy
    allowedValues: referrerPolicy
  },
  {
    key: 'mode',
    converter: webidl.converters.DOMString,
    // https://fetch.spec.whatwg.org/#concept-request-mode
    allowedValues: requestMode
  },
  {
    key: 'credentials',
    converter: webidl.converters.DOMString,
    // https://fetch.spec.whatwg.org/#requestcredentials
    allowedValues: requestCredentials
  },
  {
    key: 'cache',
    converter: webidl.converters.DOMString,
    // https://fetch.spec.whatwg.org/#requestcache
    allowedValues: requestCache
  },
  {
    key: 'redirect',
    converter: webidl.converters.DOMString,
    // https://fetch.spec.whatwg.org/#requestredirect
    allowedValues: requestRedirect
  },
  {
    key: 'integrity',
    converter: webidl.converters.DOMString
  },
  {
    key: 'keepalive',
    converter: webidl.converters.boolean
  },
  {
    key: 'signal',
    converter: webidl.nullableConverter(
      (signal) => webidl.converters.AbortSignal(
        signal,
        { strict: false }
      )
    )
  },
  {
    key: 'window',
    converter: webidl.converters.any
  },
  {
    key: 'duplex',
    converter: webidl.converters.DOMString,
    allowedValues: requestDuplex
  }
])

module.exports = { Request, makeRequest }


/***/ }),

/***/ 7823:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { Headers, HeadersList, fill } = __nccwpck_require__(554)
const { extractBody, cloneBody, mixinBody } = __nccwpck_require__(1472)
const util = __nccwpck_require__(3983)
const { kEnumerableProperty } = util
const {
  isValidReasonPhrase,
  isCancelled,
  isAborted,
  isBlobLike,
  serializeJavascriptValueToJSONString,
  isErrorLike,
  isomorphicEncode
} = __nccwpck_require__(2538)
const {
  redirectStatusSet,
  nullBodyStatus,
  DOMException
} = __nccwpck_require__(1037)
const { kState, kHeaders, kGuard, kRealm } = __nccwpck_require__(5861)
const { webidl } = __nccwpck_require__(1744)
const { FormData } = __nccwpck_require__(2015)
const { getGlobalOrigin } = __nccwpck_require__(1246)
const { URLSerializer } = __nccwpck_require__(685)
const { kHeadersList, kConstruct } = __nccwpck_require__(2785)
const assert = __nccwpck_require__(9491)
const { types } = __nccwpck_require__(3837)

const ReadableStream = globalThis.ReadableStream || (__nccwpck_require__(5356).ReadableStream)
const textEncoder = new TextEncoder('utf-8')

// https://fetch.spec.whatwg.org/#response-class
class Response {
  // Creates network error Response.
  static error () {
    // TODO
    const relevantRealm = { settingsObject: {} }

    // The static error() method steps are to return the result of creating a
    // Response object, given a new network error, "immutable", and this’s
    // relevant Realm.
    const responseObject = new Response()
    responseObject[kState] = makeNetworkError()
    responseObject[kRealm] = relevantRealm
    responseObject[kHeaders][kHeadersList] = responseObject[kState].headersList
    responseObject[kHeaders][kGuard] = 'immutable'
    responseObject[kHeaders][kRealm] = relevantRealm
    return responseObject
  }

  // https://fetch.spec.whatwg.org/#dom-response-json
  static json (data, init = {}) {
    webidl.argumentLengthCheck(arguments, 1, { header: 'Response.json' })

    if (init !== null) {
      init = webidl.converters.ResponseInit(init)
    }

    // 1. Let bytes the result of running serialize a JavaScript value to JSON bytes on data.
    const bytes = textEncoder.encode(
      serializeJavascriptValueToJSONString(data)
    )

    // 2. Let body be the result of extracting bytes.
    const body = extractBody(bytes)

    // 3. Let responseObject be the result of creating a Response object, given a new response,
    //    "response", and this’s relevant Realm.
    const relevantRealm = { settingsObject: {} }
    const responseObject = new Response()
    responseObject[kRealm] = relevantRealm
    responseObject[kHeaders][kGuard] = 'response'
    responseObject[kHeaders][kRealm] = relevantRealm

    // 4. Perform initialize a response given responseObject, init, and (body, "application/json").
    initializeResponse(responseObject, init, { body: body[0], type: 'application/json' })

    // 5. Return responseObject.
    return responseObject
  }

  // Creates a redirect Response that redirects to url with status status.
  static redirect (url, status = 302) {
    const relevantRealm = { settingsObject: {} }

    webidl.argumentLengthCheck(arguments, 1, { header: 'Response.redirect' })

    url = webidl.converters.USVString(url)
    status = webidl.converters['unsigned short'](status)

    // 1. Let parsedURL be the result of parsing url with current settings
    // object’s API base URL.
    // 2. If parsedURL is failure, then throw a TypeError.
    // TODO: base-URL?
    let parsedURL
    try {
      parsedURL = new URL(url, getGlobalOrigin())
    } catch (err) {
      throw Object.assign(new TypeError('Failed to parse URL from ' + url), {
        cause: err
      })
    }

    // 3. If status is not a redirect status, then throw a RangeError.
    if (!redirectStatusSet.has(status)) {
      throw new RangeError('Invalid status code ' + status)
    }

    // 4. Let responseObject be the result of creating a Response object,
    // given a new response, "immutable", and this’s relevant Realm.
    const responseObject = new Response()
    responseObject[kRealm] = relevantRealm
    responseObject[kHeaders][kGuard] = 'immutable'
    responseObject[kHeaders][kRealm] = relevantRealm

    // 5. Set responseObject’s response’s status to status.
    responseObject[kState].status = status

    // 6. Let value be parsedURL, serialized and isomorphic encoded.
    const value = isomorphicEncode(URLSerializer(parsedURL))

    // 7. Append `Location`/value to responseObject’s response’s header list.
    responseObject[kState].headersList.append('location', value)

    // 8. Return responseObject.
    return responseObject
  }

  // https://fetch.spec.whatwg.org/#dom-response
  constructor (body = null, init = {}) {
    if (body !== null) {
      body = webidl.converters.BodyInit(body)
    }

    init = webidl.converters.ResponseInit(init)

    // TODO
    this[kRealm] = { settingsObject: {} }

    // 1. Set this’s response to a new response.
    this[kState] = makeResponse({})

    // 2. Set this’s headers to a new Headers object with this’s relevant
    // Realm, whose header list is this’s response’s header list and guard
    // is "response".
    this[kHeaders] = new Headers(kConstruct)
    this[kHeaders][kGuard] = 'response'
    this[kHeaders][kHeadersList] = this[kState].headersList
    this[kHeaders][kRealm] = this[kRealm]

    // 3. Let bodyWithType be null.
    let bodyWithType = null

    // 4. If body is non-null, then set bodyWithType to the result of extracting body.
    if (body != null) {
      const [extractedBody, type] = extractBody(body)
      bodyWithType = { body: extractedBody, type }
    }

    // 5. Perform initialize a response given this, init, and bodyWithType.
    initializeResponse(this, init, bodyWithType)
  }

  // Returns response’s type, e.g., "cors".
  get type () {
    webidl.brandCheck(this, Response)

    // The type getter steps are to return this’s response’s type.
    return this[kState].type
  }

  // Returns response’s URL, if it has one; otherwise the empty string.
  get url () {
    webidl.brandCheck(this, Response)

    const urlList = this[kState].urlList

    // The url getter steps are to return the empty string if this’s
    // response’s URL is null; otherwise this’s response’s URL,
    // serialized with exclude fragment set to true.
    const url = urlList[urlList.length - 1] ?? null

    if (url === null) {
      return ''
    }

    return URLSerializer(url, true)
  }

  // Returns whether response was obtained through a redirect.
  get redirected () {
    webidl.brandCheck(this, Response)

    // The redirected getter steps are to return true if this’s response’s URL
    // list has more than one item; otherwise false.
    return this[kState].urlList.length > 1
  }

  // Returns response’s status.
  get status () {
    webidl.brandCheck(this, Response)

    // The status getter steps are to return this’s response’s status.
    return this[kState].status
  }

  // Returns whether response’s status is an ok status.
  get ok () {
    webidl.brandCheck(this, Response)

    // The ok getter steps are to return true if this’s response’s status is an
    // ok status; otherwise false.
    return this[kState].status >= 200 && this[kState].status <= 299
  }

  // Returns response’s status message.
  get statusText () {
    webidl.brandCheck(this, Response)

    // The statusText getter steps are to return this’s response’s status
    // message.
    return this[kState].statusText
  }

  // Returns response’s headers as Headers.
  get headers () {
    webidl.brandCheck(this, Response)

    // The headers getter steps are to return this’s headers.
    return this[kHeaders]
  }

  get body () {
    webidl.brandCheck(this, Response)

    return this[kState].body ? this[kState].body.stream : null
  }

  get bodyUsed () {
    webidl.brandCheck(this, Response)

    return !!this[kState].body && util.isDisturbed(this[kState].body.stream)
  }

  // Returns a clone of response.
  clone () {
    webidl.brandCheck(this, Response)

    // 1. If this is unusable, then throw a TypeError.
    if (this.bodyUsed || (this.body && this.body.locked)) {
      throw webidl.errors.exception({
        header: 'Response.clone',
        message: 'Body has already been consumed.'
      })
    }

    // 2. Let clonedResponse be the result of cloning this’s response.
    const clonedResponse = cloneResponse(this[kState])

    // 3. Return the result of creating a Response object, given
    // clonedResponse, this’s headers’s guard, and this’s relevant Realm.
    const clonedResponseObject = new Response()
    clonedResponseObject[kState] = clonedResponse
    clonedResponseObject[kRealm] = this[kRealm]
    clonedResponseObject[kHeaders][kHeadersList] = clonedResponse.headersList
    clonedResponseObject[kHeaders][kGuard] = this[kHeaders][kGuard]
    clonedResponseObject[kHeaders][kRealm] = this[kHeaders][kRealm]

    return clonedResponseObject
  }
}

mixinBody(Response)

Object.defineProperties(Response.prototype, {
  type: kEnumerableProperty,
  url: kEnumerableProperty,
  status: kEnumerableProperty,
  ok: kEnumerableProperty,
  redirected: kEnumerableProperty,
  statusText: kEnumerableProperty,
  headers: kEnumerableProperty,
  clone: kEnumerableProperty,
  body: kEnumerableProperty,
  bodyUsed: kEnumerableProperty,
  [Symbol.toStringTag]: {
    value: 'Response',
    configurable: true
  }
})

Object.defineProperties(Response, {
  json: kEnumerableProperty,
  redirect: kEnumerableProperty,
  error: kEnumerableProperty
})

// https://fetch.spec.whatwg.org/#concept-response-clone
function cloneResponse (response) {
  // To clone a response response, run these steps:

  // 1. If response is a filtered response, then return a new identical
  // filtered response whose internal response is a clone of response’s
  // internal response.
  if (response.internalResponse) {
    return filterResponse(
      cloneResponse(response.internalResponse),
      response.type
    )
  }

  // 2. Let newResponse be a copy of response, except for its body.
  const newResponse = makeResponse({ ...response, body: null })

  // 3. If response’s body is non-null, then set newResponse’s body to the
  // result of cloning response’s body.
  if (response.body != null) {
    newResponse.body = cloneBody(response.body)
  }

  // 4. Return newResponse.
  return newResponse
}

function makeResponse (init) {
  return {
    aborted: false,
    rangeRequested: false,
    timingAllowPassed: false,
    requestIncludesCredentials: false,
    type: 'default',
    status: 200,
    timingInfo: null,
    cacheState: '',
    statusText: '',
    ...init,
    headersList: init.headersList
      ? new HeadersList(init.headersList)
      : new HeadersList(),
    urlList: init.urlList ? [...init.urlList] : []
  }
}

function makeNetworkError (reason) {
  const isError = isErrorLike(reason)
  return makeResponse({
    type: 'error',
    status: 0,
    error: isError
      ? reason
      : new Error(reason ? String(reason) : reason),
    aborted: reason && reason.name === 'AbortError'
  })
}

function makeFilteredResponse (response, state) {
  state = {
    internalResponse: response,
    ...state
  }

  return new Proxy(response, {
    get (target, p) {
      return p in state ? state[p] : target[p]
    },
    set (target, p, value) {
      assert(!(p in state))
      target[p] = value
      return true
    }
  })
}

// https://fetch.spec.whatwg.org/#concept-filtered-response
function filterResponse (response, type) {
  // Set response to the following filtered response with response as its
  // internal response, depending on request’s response tainting:
  if (type === 'basic') {
    // A basic filtered response is a filtered response whose type is "basic"
    // and header list excludes any headers in internal response’s header list
    // whose name is a forbidden response-header name.

    // Note: undici does not implement forbidden response-header names
    return makeFilteredResponse(response, {
      type: 'basic',
      headersList: response.headersList
    })
  } else if (type === 'cors') {
    // A CORS filtered response is a filtered response whose type is "cors"
    // and header list excludes any headers in internal response’s header
    // list whose name is not a CORS-safelisted response-header name, given
    // internal response’s CORS-exposed header-name list.

    // Note: undici does not implement CORS-safelisted response-header names
    return makeFilteredResponse(response, {
      type: 'cors',
      headersList: response.headersList
    })
  } else if (type === 'opaque') {
    // An opaque filtered response is a filtered response whose type is
    // "opaque", URL list is the empty list, status is 0, status message
    // is the empty byte sequence, header list is empty, and body is null.

    return makeFilteredResponse(response, {
      type: 'opaque',
      urlList: Object.freeze([]),
      status: 0,
      statusText: '',
      body: null
    })
  } else if (type === 'opaqueredirect') {
    // An opaque-redirect filtered response is a filtered response whose type
    // is "opaqueredirect", status is 0, status message is the empty byte
    // sequence, header list is empty, and body is null.

    return makeFilteredResponse(response, {
      type: 'opaqueredirect',
      status: 0,
      statusText: '',
      headersList: [],
      body: null
    })
  } else {
    assert(false)
  }
}

// https://fetch.spec.whatwg.org/#appropriate-network-error
function makeAppropriateNetworkError (fetchParams, err = null) {
  // 1. Assert: fetchParams is canceled.
  assert(isCancelled(fetchParams))

  // 2. Return an aborted network error if fetchParams is aborted;
  // otherwise return a network error.
  return isAborted(fetchParams)
    ? makeNetworkError(Object.assign(new DOMException('The operation was aborted.', 'AbortError'), { cause: err }))
    : makeNetworkError(Object.assign(new DOMException('Request was cancelled.'), { cause: err }))
}

// https://whatpr.org/fetch/1392.html#initialize-a-response
function initializeResponse (response, init, body) {
  // 1. If init["status"] is not in the range 200 to 599, inclusive, then
  //    throw a RangeError.
  if (init.status !== null && (init.status < 200 || init.status > 599)) {
    throw new RangeError('init["status"] must be in the range of 200 to 599, inclusive.')
  }

  // 2. If init["statusText"] does not match the reason-phrase token production,
  //    then throw a TypeError.
  if ('statusText' in init && init.statusText != null) {
    // See, https://datatracker.ietf.org/doc/html/rfc7230#section-3.1.2:
    //   reason-phrase  = *( HTAB / SP / VCHAR / obs-text )
    if (!isValidReasonPhrase(String(init.statusText))) {
      throw new TypeError('Invalid statusText')
    }
  }

  // 3. Set response’s response’s status to init["status"].
  if ('status' in init && init.status != null) {
    response[kState].status = init.status
  }

  // 4. Set response’s response’s status message to init["statusText"].
  if ('statusText' in init && init.statusText != null) {
    response[kState].statusText = init.statusText
  }

  // 5. If init["headers"] exists, then fill response’s headers with init["headers"].
  if ('headers' in init && init.headers != null) {
    fill(response[kHeaders], init.headers)
  }

  // 6. If body was given, then:
  if (body) {
    // 1. If response's status is a null body status, then throw a TypeError.
    if (nullBodyStatus.includes(response.status)) {
      throw webidl.errors.exception({
        header: 'Response constructor',
        message: 'Invalid response status code ' + response.status
      })
    }

    // 2. Set response's body to body's body.
    response[kState].body = body.body

    // 3. If body's type is non-null and response's header list does not contain
    //    `Content-Type`, then append (`Content-Type`, body's type) to response's header list.
    if (body.type != null && !response[kState].headersList.contains('Content-Type')) {
      response[kState].headersList.append('content-type', body.type)
    }
  }
}

webidl.converters.ReadableStream = webidl.interfaceConverter(
  ReadableStream
)

webidl.converters.FormData = webidl.interfaceConverter(
  FormData
)

webidl.converters.URLSearchParams = webidl.interfaceConverter(
  URLSearchParams
)

// https://fetch.spec.whatwg.org/#typedefdef-xmlhttprequestbodyinit
webidl.converters.XMLHttpRequestBodyInit = function (V) {
  if (typeof V === 'string') {
    return webidl.converters.USVString(V)
  }

  if (isBlobLike(V)) {
    return webidl.converters.Blob(V, { strict: false })
  }

  if (types.isArrayBuffer(V) || types.isTypedArray(V) || types.isDataView(V)) {
    return webidl.converters.BufferSource(V)
  }

  if (util.isFormDataLike(V)) {
    return webidl.converters.FormData(V, { strict: false })
  }

  if (V instanceof URLSearchParams) {
    return webidl.converters.URLSearchParams(V)
  }

  return webidl.converters.DOMString(V)
}

// https://fetch.spec.whatwg.org/#bodyinit
webidl.converters.BodyInit = function (V) {
  if (V instanceof ReadableStream) {
    return webidl.converters.ReadableStream(V)
  }

  // Note: the spec doesn't include async iterables,
  // this is an undici extension.
  if (V?.[Symbol.asyncIterator]) {
    return V
  }

  return webidl.converters.XMLHttpRequestBodyInit(V)
}

webidl.converters.ResponseInit = webidl.dictionaryConverter([
  {
    key: 'status',
    converter: webidl.converters['unsigned short'],
    defaultValue: 200
  },
  {
    key: 'statusText',
    converter: webidl.converters.ByteString,
    defaultValue: ''
  },
  {
    key: 'headers',
    converter: webidl.converters.HeadersInit
  }
])

module.exports = {
  makeNetworkError,
  makeResponse,
  makeAppropriateNetworkError,
  filterResponse,
  Response,
  cloneResponse
}


/***/ }),

/***/ 5861:
/***/ ((module) => {

"use strict";


module.exports = {
  kUrl: Symbol('url'),
  kHeaders: Symbol('headers'),
  kSignal: Symbol('signal'),
  kState: Symbol('state'),
  kGuard: Symbol('guard'),
  kRealm: Symbol('realm')
}


/***/ }),

/***/ 2538:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { redirectStatusSet, referrerPolicySet: referrerPolicyTokens, badPortsSet } = __nccwpck_require__(1037)
const { getGlobalOrigin } = __nccwpck_require__(1246)
const { performance } = __nccwpck_require__(4074)
const { isBlobLike, toUSVString, ReadableStreamFrom } = __nccwpck_require__(3983)
const assert = __nccwpck_require__(9491)
const { isUint8Array } = __nccwpck_require__(4978)

let supportedHashes = []

// https://nodejs.org/api/crypto.html#determining-if-crypto-support-is-unavailable
/** @type {import('crypto')|undefined} */
let crypto

try {
  crypto = __nccwpck_require__(6113)
  const possibleRelevantHashes = ['sha256', 'sha384', 'sha512']
  supportedHashes = crypto.getHashes().filter((hash) => possibleRelevantHashes.includes(hash))
/* c8 ignore next 3 */
} catch {
}

function responseURL (response) {
  // https://fetch.spec.whatwg.org/#responses
  // A response has an associated URL. It is a pointer to the last URL
  // in response’s URL list and null if response’s URL list is empty.
  const urlList = response.urlList
  const length = urlList.length
  return length === 0 ? null : urlList[length - 1].toString()
}

// https://fetch.spec.whatwg.org/#concept-response-location-url
function responseLocationURL (response, requestFragment) {
  // 1. If response’s status is not a redirect status, then return null.
  if (!redirectStatusSet.has(response.status)) {
    return null
  }

  // 2. Let location be the result of extracting header list values given
  // `Location` and response’s header list.
  let location = response.headersList.get('location')

  // 3. If location is a header value, then set location to the result of
  //    parsing location with response’s URL.
  if (location !== null && isValidHeaderValue(location)) {
    location = new URL(location, responseURL(response))
  }

  // 4. If location is a URL whose fragment is null, then set location’s
  // fragment to requestFragment.
  if (location && !location.hash) {
    location.hash = requestFragment
  }

  // 5. Return location.
  return location
}

/** @returns {URL} */
function requestCurrentURL (request) {
  return request.urlList[request.urlList.length - 1]
}

function requestBadPort (request) {
  // 1. Let url be request’s current URL.
  const url = requestCurrentURL(request)

  // 2. If url’s scheme is an HTTP(S) scheme and url’s port is a bad port,
  // then return blocked.
  if (urlIsHttpHttpsScheme(url) && badPortsSet.has(url.port)) {
    return 'blocked'
  }

  // 3. Return allowed.
  return 'allowed'
}

function isErrorLike (object) {
  return object instanceof Error || (
    object?.constructor?.name === 'Error' ||
    object?.constructor?.name === 'DOMException'
  )
}

// Check whether |statusText| is a ByteString and
// matches the Reason-Phrase token production.
// RFC 2616: https://tools.ietf.org/html/rfc2616
// RFC 7230: https://tools.ietf.org/html/rfc7230
// "reason-phrase = *( HTAB / SP / VCHAR / obs-text )"
// https://github.com/chromium/chromium/blob/94.0.4604.1/third_party/blink/renderer/core/fetch/response.cc#L116
function isValidReasonPhrase (statusText) {
  for (let i = 0; i < statusText.length; ++i) {
    const c = statusText.charCodeAt(i)
    if (
      !(
        (
          c === 0x09 || // HTAB
          (c >= 0x20 && c <= 0x7e) || // SP / VCHAR
          (c >= 0x80 && c <= 0xff)
        ) // obs-text
      )
    ) {
      return false
    }
  }
  return true
}

/**
 * @see https://tools.ietf.org/html/rfc7230#section-3.2.6
 * @param {number} c
 */
function isTokenCharCode (c) {
  switch (c) {
    case 0x22:
    case 0x28:
    case 0x29:
    case 0x2c:
    case 0x2f:
    case 0x3a:
    case 0x3b:
    case 0x3c:
    case 0x3d:
    case 0x3e:
    case 0x3f:
    case 0x40:
    case 0x5b:
    case 0x5c:
    case 0x5d:
    case 0x7b:
    case 0x7d:
      // DQUOTE and "(),/:;<=>?@[\]{}"
      return false
    default:
      // VCHAR %x21-7E
      return c >= 0x21 && c <= 0x7e
  }
}

/**
 * @param {string} characters
 */
function isValidHTTPToken (characters) {
  if (characters.length === 0) {
    return false
  }
  for (let i = 0; i < characters.length; ++i) {
    if (!isTokenCharCode(characters.charCodeAt(i))) {
      return false
    }
  }
  return true
}

/**
 * @see https://fetch.spec.whatwg.org/#header-name
 * @param {string} potentialValue
 */
function isValidHeaderName (potentialValue) {
  return isValidHTTPToken(potentialValue)
}

/**
 * @see https://fetch.spec.whatwg.org/#header-value
 * @param {string} potentialValue
 */
function isValidHeaderValue (potentialValue) {
  // - Has no leading or trailing HTTP tab or space bytes.
  // - Contains no 0x00 (NUL) or HTTP newline bytes.
  if (
    potentialValue.startsWith('\t') ||
    potentialValue.startsWith(' ') ||
    potentialValue.endsWith('\t') ||
    potentialValue.endsWith(' ')
  ) {
    return false
  }

  if (
    potentialValue.includes('\0') ||
    potentialValue.includes('\r') ||
    potentialValue.includes('\n')
  ) {
    return false
  }

  return true
}

// https://w3c.github.io/webappsec-referrer-policy/#set-requests-referrer-policy-on-redirect
function setRequestReferrerPolicyOnRedirect (request, actualResponse) {
  //  Given a request request and a response actualResponse, this algorithm
  //  updates request’s referrer policy according to the Referrer-Policy
  //  header (if any) in actualResponse.

  // 1. Let policy be the result of executing § 8.1 Parse a referrer policy
  // from a Referrer-Policy header on actualResponse.

  // 8.1 Parse a referrer policy from a Referrer-Policy header
  // 1. Let policy-tokens be the result of extracting header list values given `Referrer-Policy` and response’s header list.
  const { headersList } = actualResponse
  // 2. Let policy be the empty string.
  // 3. For each token in policy-tokens, if token is a referrer policy and token is not the empty string, then set policy to token.
  // 4. Return policy.
  const policyHeader = (headersList.get('referrer-policy') ?? '').split(',')

  // Note: As the referrer-policy can contain multiple policies
  // separated by comma, we need to loop through all of them
  // and pick the first valid one.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#specify_a_fallback_policy
  let policy = ''
  if (policyHeader.length > 0) {
    // The right-most policy takes precedence.
    // The left-most policy is the fallback.
    for (let i = policyHeader.length; i !== 0; i--) {
      const token = policyHeader[i - 1].trim()
      if (referrerPolicyTokens.has(token)) {
        policy = token
        break
      }
    }
  }

  // 2. If policy is not the empty string, then set request’s referrer policy to policy.
  if (policy !== '') {
    request.referrerPolicy = policy
  }
}

// https://fetch.spec.whatwg.org/#cross-origin-resource-policy-check
function crossOriginResourcePolicyCheck () {
  // TODO
  return 'allowed'
}

// https://fetch.spec.whatwg.org/#concept-cors-check
function corsCheck () {
  // TODO
  return 'success'
}

// https://fetch.spec.whatwg.org/#concept-tao-check
function TAOCheck () {
  // TODO
  return 'success'
}

function appendFetchMetadata (httpRequest) {
  //  https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-dest-header
  //  TODO

  //  https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-mode-header

  //  1. Assert: r’s url is a potentially trustworthy URL.
  //  TODO

  //  2. Let header be a Structured Header whose value is a token.
  let header = null

  //  3. Set header’s value to r’s mode.
  header = httpRequest.mode

  //  4. Set a structured field value `Sec-Fetch-Mode`/header in r’s header list.
  httpRequest.headersList.set('sec-fetch-mode', header)

  //  https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-site-header
  //  TODO

  //  https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-user-header
  //  TODO
}

// https://fetch.spec.whatwg.org/#append-a-request-origin-header
function appendRequestOriginHeader (request) {
  // 1. Let serializedOrigin be the result of byte-serializing a request origin with request.
  let serializedOrigin = request.origin

  // 2. If request’s response tainting is "cors" or request’s mode is "websocket", then append (`Origin`, serializedOrigin) to request’s header list.
  if (request.responseTainting === 'cors' || request.mode === 'websocket') {
    if (serializedOrigin) {
      request.headersList.append('origin', serializedOrigin)
    }

  // 3. Otherwise, if request’s method is neither `GET` nor `HEAD`, then:
  } else if (request.method !== 'GET' && request.method !== 'HEAD') {
    // 1. Switch on request’s referrer policy:
    switch (request.referrerPolicy) {
      case 'no-referrer':
        // Set serializedOrigin to `null`.
        serializedOrigin = null
        break
      case 'no-referrer-when-downgrade':
      case 'strict-origin':
      case 'strict-origin-when-cross-origin':
        // If request’s origin is a tuple origin, its scheme is "https", and request’s current URL’s scheme is not "https", then set serializedOrigin to `null`.
        if (request.origin && urlHasHttpsScheme(request.origin) && !urlHasHttpsScheme(requestCurrentURL(request))) {
          serializedOrigin = null
        }
        break
      case 'same-origin':
        // If request’s origin is not same origin with request’s current URL’s origin, then set serializedOrigin to `null`.
        if (!sameOrigin(request, requestCurrentURL(request))) {
          serializedOrigin = null
        }
        break
      default:
        // Do nothing.
    }

    if (serializedOrigin) {
      // 2. Append (`Origin`, serializedOrigin) to request’s header list.
      request.headersList.append('origin', serializedOrigin)
    }
  }
}

function coarsenedSharedCurrentTime (crossOriginIsolatedCapability) {
  // TODO
  return performance.now()
}

// https://fetch.spec.whatwg.org/#create-an-opaque-timing-info
function createOpaqueTimingInfo (timingInfo) {
  return {
    startTime: timingInfo.startTime ?? 0,
    redirectStartTime: 0,
    redirectEndTime: 0,
    postRedirectStartTime: timingInfo.startTime ?? 0,
    finalServiceWorkerStartTime: 0,
    finalNetworkResponseStartTime: 0,
    finalNetworkRequestStartTime: 0,
    endTime: 0,
    encodedBodySize: 0,
    decodedBodySize: 0,
    finalConnectionTimingInfo: null
  }
}

// https://html.spec.whatwg.org/multipage/origin.html#policy-container
function makePolicyContainer () {
  // Note: the fetch spec doesn't make use of embedder policy or CSP list
  return {
    referrerPolicy: 'strict-origin-when-cross-origin'
  }
}

// https://html.spec.whatwg.org/multipage/origin.html#clone-a-policy-container
function clonePolicyContainer (policyContainer) {
  return {
    referrerPolicy: policyContainer.referrerPolicy
  }
}

// https://w3c.github.io/webappsec-referrer-policy/#determine-requests-referrer
function determineRequestsReferrer (request) {
  // 1. Let policy be request's referrer policy.
  const policy = request.referrerPolicy

  // Note: policy cannot (shouldn't) be null or an empty string.
  assert(policy)

  // 2. Let environment be request’s client.

  let referrerSource = null

  // 3. Switch on request’s referrer:
  if (request.referrer === 'client') {
    // Note: node isn't a browser and doesn't implement document/iframes,
    // so we bypass this step and replace it with our own.

    const globalOrigin = getGlobalOrigin()

    if (!globalOrigin || globalOrigin.origin === 'null') {
      return 'no-referrer'
    }

    // note: we need to clone it as it's mutated
    referrerSource = new URL(globalOrigin)
  } else if (request.referrer instanceof URL) {
    // Let referrerSource be request’s referrer.
    referrerSource = request.referrer
  }

  // 4. Let request’s referrerURL be the result of stripping referrerSource for
  //    use as a referrer.
  let referrerURL = stripURLForReferrer(referrerSource)

  // 5. Let referrerOrigin be the result of stripping referrerSource for use as
  //    a referrer, with the origin-only flag set to true.
  const referrerOrigin = stripURLForReferrer(referrerSource, true)

  // 6. If the result of serializing referrerURL is a string whose length is
  //    greater than 4096, set referrerURL to referrerOrigin.
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin
  }

  const areSameOrigin = sameOrigin(request, referrerURL)
  const isNonPotentiallyTrustWorthy = isURLPotentiallyTrustworthy(referrerURL) &&
    !isURLPotentiallyTrustworthy(request.url)

  // 8. Execute the switch statements corresponding to the value of policy:
  switch (policy) {
    case 'origin': return referrerOrigin != null ? referrerOrigin : stripURLForReferrer(referrerSource, true)
    case 'unsafe-url': return referrerURL
    case 'same-origin':
      return areSameOrigin ? referrerOrigin : 'no-referrer'
    case 'origin-when-cross-origin':
      return areSameOrigin ? referrerURL : referrerOrigin
    case 'strict-origin-when-cross-origin': {
      const currentURL = requestCurrentURL(request)

      // 1. If the origin of referrerURL and the origin of request’s current
      //    URL are the same, then return referrerURL.
      if (sameOrigin(referrerURL, currentURL)) {
        return referrerURL
      }

      // 2. If referrerURL is a potentially trustworthy URL and request’s
      //    current URL is not a potentially trustworthy URL, then return no
      //    referrer.
      if (isURLPotentiallyTrustworthy(referrerURL) && !isURLPotentiallyTrustworthy(currentURL)) {
        return 'no-referrer'
      }

      // 3. Return referrerOrigin.
      return referrerOrigin
    }
    case 'strict-origin': // eslint-disable-line
      /**
         * 1. If referrerURL is a potentially trustworthy URL and
         * request’s current URL is not a potentially trustworthy URL,
         * then return no referrer.
         * 2. Return referrerOrigin
        */
    case 'no-referrer-when-downgrade': // eslint-disable-line
      /**
       * 1. If referrerURL is a potentially trustworthy URL and
       * request’s current URL is not a potentially trustworthy URL,
       * then return no referrer.
       * 2. Return referrerOrigin
      */

    default: // eslint-disable-line
      return isNonPotentiallyTrustWorthy ? 'no-referrer' : referrerOrigin
  }
}

/**
 * @see https://w3c.github.io/webappsec-referrer-policy/#strip-url
 * @param {URL} url
 * @param {boolean|undefined} originOnly
 */
function stripURLForReferrer (url, originOnly) {
  // 1. Assert: url is a URL.
  assert(url instanceof URL)

  // 2. If url’s scheme is a local scheme, then return no referrer.
  if (url.protocol === 'file:' || url.protocol === 'about:' || url.protocol === 'blank:') {
    return 'no-referrer'
  }

  // 3. Set url’s username to the empty string.
  url.username = ''

  // 4. Set url’s password to the empty string.
  url.password = ''

  // 5. Set url’s fragment to null.
  url.hash = ''

  // 6. If the origin-only flag is true, then:
  if (originOnly) {
    // 1. Set url’s path to « the empty string ».
    url.pathname = ''

    // 2. Set url’s query to null.
    url.search = ''
  }

  // 7. Return url.
  return url
}

function isURLPotentiallyTrustworthy (url) {
  if (!(url instanceof URL)) {
    return false
  }

  // If child of about, return true
  if (url.href === 'about:blank' || url.href === 'about:srcdoc') {
    return true
  }

  // If scheme is data, return true
  if (url.protocol === 'data:') return true

  // If file, return true
  if (url.protocol === 'file:') return true

  return isOriginPotentiallyTrustworthy(url.origin)

  function isOriginPotentiallyTrustworthy (origin) {
    // If origin is explicitly null, return false
    if (origin == null || origin === 'null') return false

    const originAsURL = new URL(origin)

    // If secure, return true
    if (originAsURL.protocol === 'https:' || originAsURL.protocol === 'wss:') {
      return true
    }

    // If localhost or variants, return true
    if (/^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(originAsURL.hostname) ||
     (originAsURL.hostname === 'localhost' || originAsURL.hostname.includes('localhost.')) ||
     (originAsURL.hostname.endsWith('.localhost'))) {
      return true
    }

    // If any other, return false
    return false
  }
}

/**
 * @see https://w3c.github.io/webappsec-subresource-integrity/#does-response-match-metadatalist
 * @param {Uint8Array} bytes
 * @param {string} metadataList
 */
function bytesMatch (bytes, metadataList) {
  // If node is not built with OpenSSL support, we cannot check
  // a request's integrity, so allow it by default (the spec will
  // allow requests if an invalid hash is given, as precedence).
  /* istanbul ignore if: only if node is built with --without-ssl */
  if (crypto === undefined) {
    return true
  }

  // 1. Let parsedMetadata be the result of parsing metadataList.
  const parsedMetadata = parseMetadata(metadataList)

  // 2. If parsedMetadata is no metadata, return true.
  if (parsedMetadata === 'no metadata') {
    return true
  }

  // 3. If response is not eligible for integrity validation, return false.
  // TODO

  // 4. If parsedMetadata is the empty set, return true.
  if (parsedMetadata.length === 0) {
    return true
  }

  // 5. Let metadata be the result of getting the strongest
  //    metadata from parsedMetadata.
  const strongest = getStrongestMetadata(parsedMetadata)
  const metadata = filterMetadataListByAlgorithm(parsedMetadata, strongest)

  // 6. For each item in metadata:
  for (const item of metadata) {
    // 1. Let algorithm be the alg component of item.
    const algorithm = item.algo

    // 2. Let expectedValue be the val component of item.
    const expectedValue = item.hash

    // See https://github.com/web-platform-tests/wpt/commit/e4c5cc7a5e48093220528dfdd1c4012dc3837a0e
    // "be liberal with padding". This is annoying, and it's not even in the spec.

    // 3. Let actualValue be the result of applying algorithm to bytes.
    let actualValue = crypto.createHash(algorithm).update(bytes).digest('base64')

    if (actualValue[actualValue.length - 1] === '=') {
      if (actualValue[actualValue.length - 2] === '=') {
        actualValue = actualValue.slice(0, -2)
      } else {
        actualValue = actualValue.slice(0, -1)
      }
    }

    // 4. If actualValue is a case-sensitive match for expectedValue,
    //    return true.
    if (compareBase64Mixed(actualValue, expectedValue)) {
      return true
    }
  }

  // 7. Return false.
  return false
}

// https://w3c.github.io/webappsec-subresource-integrity/#grammardef-hash-with-options
// https://www.w3.org/TR/CSP2/#source-list-syntax
// https://www.rfc-editor.org/rfc/rfc5234#appendix-B.1
const parseHashWithOptions = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i

/**
 * @see https://w3c.github.io/webappsec-subresource-integrity/#parse-metadata
 * @param {string} metadata
 */
function parseMetadata (metadata) {
  // 1. Let result be the empty set.
  /** @type {{ algo: string, hash: string }[]} */
  const result = []

  // 2. Let empty be equal to true.
  let empty = true

  // 3. For each token returned by splitting metadata on spaces:
  for (const token of metadata.split(' ')) {
    // 1. Set empty to false.
    empty = false

    // 2. Parse token as a hash-with-options.
    const parsedToken = parseHashWithOptions.exec(token)

    // 3. If token does not parse, continue to the next token.
    if (
      parsedToken === null ||
      parsedToken.groups === undefined ||
      parsedToken.groups.algo === undefined
    ) {
      // Note: Chromium blocks the request at this point, but Firefox
      // gives a warning that an invalid integrity was given. The
      // correct behavior is to ignore these, and subsequently not
      // check the integrity of the resource.
      continue
    }

    // 4. Let algorithm be the hash-algo component of token.
    const algorithm = parsedToken.groups.algo.toLowerCase()

    // 5. If algorithm is a hash function recognized by the user
    //    agent, add the parsed token to result.
    if (supportedHashes.includes(algorithm)) {
      result.push(parsedToken.groups)
    }
  }

  // 4. Return no metadata if empty is true, otherwise return result.
  if (empty === true) {
    return 'no metadata'
  }

  return result
}

/**
 * @param {{ algo: 'sha256' | 'sha384' | 'sha512' }[]} metadataList
 */
function getStrongestMetadata (metadataList) {
  // Let algorithm be the algo component of the first item in metadataList.
  // Can be sha256
  let algorithm = metadataList[0].algo
  // If the algorithm is sha512, then it is the strongest
  // and we can return immediately
  if (algorithm[3] === '5') {
    return algorithm
  }

  for (let i = 1; i < metadataList.length; ++i) {
    const metadata = metadataList[i]
    // If the algorithm is sha512, then it is the strongest
    // and we can break the loop immediately
    if (metadata.algo[3] === '5') {
      algorithm = 'sha512'
      break
    // If the algorithm is sha384, then a potential sha256 or sha384 is ignored
    } else if (algorithm[3] === '3') {
      continue
    // algorithm is sha256, check if algorithm is sha384 and if so, set it as
    // the strongest
    } else if (metadata.algo[3] === '3') {
      algorithm = 'sha384'
    }
  }
  return algorithm
}

function filterMetadataListByAlgorithm (metadataList, algorithm) {
  if (metadataList.length === 1) {
    return metadataList
  }

  let pos = 0
  for (let i = 0; i < metadataList.length; ++i) {
    if (metadataList[i].algo === algorithm) {
      metadataList[pos++] = metadataList[i]
    }
  }

  metadataList.length = pos

  return metadataList
}

/**
 * Compares two base64 strings, allowing for base64url
 * in the second string.
 *
* @param {string} actualValue always base64
 * @param {string} expectedValue base64 or base64url
 * @returns {boolean}
 */
function compareBase64Mixed (actualValue, expectedValue) {
  if (actualValue.length !== expectedValue.length) {
    return false
  }
  for (let i = 0; i < actualValue.length; ++i) {
    if (actualValue[i] !== expectedValue[i]) {
      if (
        (actualValue[i] === '+' && expectedValue[i] === '-') ||
        (actualValue[i] === '/' && expectedValue[i] === '_')
      ) {
        continue
      }
      return false
    }
  }

  return true
}

// https://w3c.github.io/webappsec-upgrade-insecure-requests/#upgrade-request
function tryUpgradeRequestToAPotentiallyTrustworthyURL (request) {
  // TODO
}

/**
 * @link {https://html.spec.whatwg.org/multipage/origin.html#same-origin}
 * @param {URL} A
 * @param {URL} B
 */
function sameOrigin (A, B) {
  // 1. If A and B are the same opaque origin, then return true.
  if (A.origin === B.origin && A.origin === 'null') {
    return true
  }

  // 2. If A and B are both tuple origins and their schemes,
  //    hosts, and port are identical, then return true.
  if (A.protocol === B.protocol && A.hostname === B.hostname && A.port === B.port) {
    return true
  }

  // 3. Return false.
  return false
}

function createDeferredPromise () {
  let res
  let rej
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })

  return { promise, resolve: res, reject: rej }
}

function isAborted (fetchParams) {
  return fetchParams.controller.state === 'aborted'
}

function isCancelled (fetchParams) {
  return fetchParams.controller.state === 'aborted' ||
    fetchParams.controller.state === 'terminated'
}

const normalizeMethodRecord = {
  delete: 'DELETE',
  DELETE: 'DELETE',
  get: 'GET',
  GET: 'GET',
  head: 'HEAD',
  HEAD: 'HEAD',
  options: 'OPTIONS',
  OPTIONS: 'OPTIONS',
  post: 'POST',
  POST: 'POST',
  put: 'PUT',
  PUT: 'PUT'
}

// Note: object prototypes should not be able to be referenced. e.g. `Object#hasOwnProperty`.
Object.setPrototypeOf(normalizeMethodRecord, null)

/**
 * @see https://fetch.spec.whatwg.org/#concept-method-normalize
 * @param {string} method
 */
function normalizeMethod (method) {
  return normalizeMethodRecord[method.toLowerCase()] ?? method
}

// https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string
function serializeJavascriptValueToJSONString (value) {
  // 1. Let result be ? Call(%JSON.stringify%, undefined, « value »).
  const result = JSON.stringify(value)

  // 2. If result is undefined, then throw a TypeError.
  if (result === undefined) {
    throw new TypeError('Value is not JSON serializable')
  }

  // 3. Assert: result is a string.
  assert(typeof result === 'string')

  // 4. Return result.
  return result
}

// https://tc39.es/ecma262/#sec-%25iteratorprototype%25-object
const esIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))

/**
 * @see https://webidl.spec.whatwg.org/#dfn-iterator-prototype-object
 * @param {() => unknown[]} iterator
 * @param {string} name name of the instance
 * @param {'key'|'value'|'key+value'} kind
 */
function makeIterator (iterator, name, kind) {
  const object = {
    index: 0,
    kind,
    target: iterator
  }

  const i = {
    next () {
      // 1. Let interface be the interface for which the iterator prototype object exists.

      // 2. Let thisValue be the this value.

      // 3. Let object be ? ToObject(thisValue).

      // 4. If object is a platform object, then perform a security
      //    check, passing:

      // 5. If object is not a default iterator object for interface,
      //    then throw a TypeError.
      if (Object.getPrototypeOf(this) !== i) {
        throw new TypeError(
          `'next' called on an object that does not implement interface ${name} Iterator.`
        )
      }

      // 6. Let index be object’s index.
      // 7. Let kind be object’s kind.
      // 8. Let values be object’s target's value pairs to iterate over.
      const { index, kind, target } = object
      const values = target()

      // 9. Let len be the length of values.
      const len = values.length

      // 10. If index is greater than or equal to len, then return
      //     CreateIterResultObject(undefined, true).
      if (index >= len) {
        return { value: undefined, done: true }
      }

      // 11. Let pair be the entry in values at index index.
      const pair = values[index]

      // 12. Set object’s index to index + 1.
      object.index = index + 1

      // 13. Return the iterator result for pair and kind.
      return iteratorResult(pair, kind)
    },
    // The class string of an iterator prototype object for a given interface is the
    // result of concatenating the identifier of the interface and the string " Iterator".
    [Symbol.toStringTag]: `${name} Iterator`
  }

  // The [[Prototype]] internal slot of an iterator prototype object must be %IteratorPrototype%.
  Object.setPrototypeOf(i, esIteratorPrototype)
  // esIteratorPrototype needs to be the prototype of i
  // which is the prototype of an empty object. Yes, it's confusing.
  return Object.setPrototypeOf({}, i)
}

// https://webidl.spec.whatwg.org/#iterator-result
function iteratorResult (pair, kind) {
  let result

  // 1. Let result be a value determined by the value of kind:
  switch (kind) {
    case 'key': {
      // 1. Let idlKey be pair’s key.
      // 2. Let key be the result of converting idlKey to an
      //    ECMAScript value.
      // 3. result is key.
      result = pair[0]
      break
    }
    case 'value': {
      // 1. Let idlValue be pair’s value.
      // 2. Let value be the result of converting idlValue to
      //    an ECMAScript value.
      // 3. result is value.
      result = pair[1]
      break
    }
    case 'key+value': {
      // 1. Let idlKey be pair’s key.
      // 2. Let idlValue be pair’s value.
      // 3. Let key be the result of converting idlKey to an
      //    ECMAScript value.
      // 4. Let value be the result of converting idlValue to
      //    an ECMAScript value.
      // 5. Let array be ! ArrayCreate(2).
      // 6. Call ! CreateDataProperty(array, "0", key).
      // 7. Call ! CreateDataProperty(array, "1", value).
      // 8. result is array.
      result = pair
      break
    }
  }

  // 2. Return CreateIterResultObject(result, false).
  return { value: result, done: false }
}

/**
 * @see https://fetch.spec.whatwg.org/#body-fully-read
 */
async function fullyReadBody (body, processBody, processBodyError) {
  // 1. If taskDestination is null, then set taskDestination to
  //    the result of starting a new parallel queue.

  // 2. Let successSteps given a byte sequence bytes be to queue a
  //    fetch task to run processBody given bytes, with taskDestination.
  const successSteps = processBody

  // 3. Let errorSteps be to queue a fetch task to run processBodyError,
  //    with taskDestination.
  const errorSteps = processBodyError

  // 4. Let reader be the result of getting a reader for body’s stream.
  //    If that threw an exception, then run errorSteps with that
  //    exception and return.
  let reader

  try {
    reader = body.stream.getReader()
  } catch (e) {
    errorSteps(e)
    return
  }

  // 5. Read all bytes from reader, given successSteps and errorSteps.
  try {
    const result = await readAllBytes(reader)
    successSteps(result)
  } catch (e) {
    errorSteps(e)
  }
}

/** @type {ReadableStream} */
let ReadableStream = globalThis.ReadableStream

function isReadableStreamLike (stream) {
  if (!ReadableStream) {
    ReadableStream = (__nccwpck_require__(5356).ReadableStream)
  }

  return stream instanceof ReadableStream || (
    stream[Symbol.toStringTag] === 'ReadableStream' &&
    typeof stream.tee === 'function'
  )
}

const MAXIMUM_ARGUMENT_LENGTH = 65535

/**
 * @see https://infra.spec.whatwg.org/#isomorphic-decode
 * @param {number[]|Uint8Array} input
 */
function isomorphicDecode (input) {
  // 1. To isomorphic decode a byte sequence input, return a string whose code point
  //    length is equal to input’s length and whose code points have the same values
  //    as the values of input’s bytes, in the same order.

  if (input.length < MAXIMUM_ARGUMENT_LENGTH) {
    return String.fromCharCode(...input)
  }

  return input.reduce((previous, current) => previous + String.fromCharCode(current), '')
}

/**
 * @param {ReadableStreamController<Uint8Array>} controller
 */
function readableStreamClose (controller) {
  try {
    controller.close()
  } catch (err) {
    // TODO: add comment explaining why this error occurs.
    if (!err.message.includes('Controller is already closed')) {
      throw err
    }
  }
}

/**
 * @see https://infra.spec.whatwg.org/#isomorphic-encode
 * @param {string} input
 */
function isomorphicEncode (input) {
  // 1. Assert: input contains no code points greater than U+00FF.
  for (let i = 0; i < input.length; i++) {
    assert(input.charCodeAt(i) <= 0xFF)
  }

  // 2. Return a byte sequence whose length is equal to input’s code
  //    point length and whose bytes have the same values as the
  //    values of input’s code points, in the same order
  return input
}

/**
 * @see https://streams.spec.whatwg.org/#readablestreamdefaultreader-read-all-bytes
 * @see https://streams.spec.whatwg.org/#read-loop
 * @param {ReadableStreamDefaultReader} reader
 */
async function readAllBytes (reader) {
  const bytes = []
  let byteLength = 0

  while (true) {
    const { done, value: chunk } = await reader.read()

    if (done) {
      // 1. Call successSteps with bytes.
      return Buffer.concat(bytes, byteLength)
    }

    // 1. If chunk is not a Uint8Array object, call failureSteps
    //    with a TypeError and abort these steps.
    if (!isUint8Array(chunk)) {
      throw new TypeError('Received non-Uint8Array chunk')
    }

    // 2. Append the bytes represented by chunk to bytes.
    bytes.push(chunk)
    byteLength += chunk.length

    // 3. Read-loop given reader, bytes, successSteps, and failureSteps.
  }
}

/**
 * @see https://fetch.spec.whatwg.org/#is-local
 * @param {URL} url
 */
function urlIsLocal (url) {
  assert('protocol' in url) // ensure it's a url object

  const protocol = url.protocol

  return protocol === 'about:' || protocol === 'blob:' || protocol === 'data:'
}

/**
 * @param {string|URL} url
 */
function urlHasHttpsScheme (url) {
  if (typeof url === 'string') {
    return url.startsWith('https:')
  }

  return url.protocol === 'https:'
}

/**
 * @see https://fetch.spec.whatwg.org/#http-scheme
 * @param {URL} url
 */
function urlIsHttpHttpsScheme (url) {
  assert('protocol' in url) // ensure it's a url object

  const protocol = url.protocol

  return protocol === 'http:' || protocol === 'https:'
}

/**
 * Fetch supports node >= 16.8.0, but Object.hasOwn was added in v16.9.0.
 */
const hasOwn = Object.hasOwn || ((dict, key) => Object.prototype.hasOwnProperty.call(dict, key))

module.exports = {
  isAborted,
  isCancelled,
  createDeferredPromise,
  ReadableStreamFrom,
  toUSVString,
  tryUpgradeRequestToAPotentiallyTrustworthyURL,
  coarsenedSharedCurrentTime,
  determineRequestsReferrer,
  makePolicyContainer,
  clonePolicyContainer,
  appendFetchMetadata,
  appendRequestOriginHeader,
  TAOCheck,
  corsCheck,
  crossOriginResourcePolicyCheck,
  createOpaqueTimingInfo,
  setRequestReferrerPolicyOnRedirect,
  isValidHTTPToken,
  requestBadPort,
  requestCurrentURL,
  responseURL,
  responseLocationURL,
  isBlobLike,
  isURLPotentiallyTrustworthy,
  isValidReasonPhrase,
  sameOrigin,
  normalizeMethod,
  serializeJavascriptValueToJSONString,
  makeIterator,
  isValidHeaderName,
  isValidHeaderValue,
  hasOwn,
  isErrorLike,
  fullyReadBody,
  bytesMatch,
  isReadableStreamLike,
  readableStreamClose,
  isomorphicEncode,
  isomorphicDecode,
  urlIsLocal,
  urlHasHttpsScheme,
  urlIsHttpHttpsScheme,
  readAllBytes,
  normalizeMethodRecord,
  parseMetadata
}


/***/ }),

/***/ 1744:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { types } = __nccwpck_require__(3837)
const { hasOwn, toUSVString } = __nccwpck_require__(2538)

/** @type {import('../../types/webidl').Webidl} */
const webidl = {}
webidl.converters = {}
webidl.util = {}
webidl.errors = {}

webidl.errors.exception = function (message) {
  return new TypeError(`${message.header}: ${message.message}`)
}

webidl.errors.conversionFailed = function (context) {
  const plural = context.types.length === 1 ? '' : ' one of'
  const message =
    `${context.argument} could not be converted to` +
    `${plural}: ${context.types.join(', ')}.`

  return webidl.errors.exception({
    header: context.prefix,
    message
  })
}

webidl.errors.invalidArgument = function (context) {
  return webidl.errors.exception({
    header: context.prefix,
    message: `"${context.value}" is an invalid ${context.type}.`
  })
}

// https://webidl.spec.whatwg.org/#implements
webidl.brandCheck = function (V, I, opts = undefined) {
  if (opts?.strict !== false && !(V instanceof I)) {
    throw new TypeError('Illegal invocation')
  } else {
    return V?.[Symbol.toStringTag] === I.prototype[Symbol.toStringTag]
  }
}

webidl.argumentLengthCheck = function ({ length }, min, ctx) {
  if (length < min) {
    throw webidl.errors.exception({
      message: `${min} argument${min !== 1 ? 's' : ''} required, ` +
               `but${length ? ' only' : ''} ${length} found.`,
      ...ctx
    })
  }
}

webidl.illegalConstructor = function () {
  throw webidl.errors.exception({
    header: 'TypeError',
    message: 'Illegal constructor'
  })
}

// https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values
webidl.util.Type = function (V) {
  switch (typeof V) {
    case 'undefined': return 'Undefined'
    case 'boolean': return 'Boolean'
    case 'string': return 'String'
    case 'symbol': return 'Symbol'
    case 'number': return 'Number'
    case 'bigint': return 'BigInt'
    case 'function':
    case 'object': {
      if (V === null) {
        return 'Null'
      }

      return 'Object'
    }
  }
}

// https://webidl.spec.whatwg.org/#abstract-opdef-converttoint
webidl.util.ConvertToInt = function (V, bitLength, signedness, opts = {}) {
  let upperBound
  let lowerBound

  // 1. If bitLength is 64, then:
  if (bitLength === 64) {
    // 1. Let upperBound be 2^53 − 1.
    upperBound = Math.pow(2, 53) - 1

    // 2. If signedness is "unsigned", then let lowerBound be 0.
    if (signedness === 'unsigned') {
      lowerBound = 0
    } else {
      // 3. Otherwise let lowerBound be −2^53 + 1.
      lowerBound = Math.pow(-2, 53) + 1
    }
  } else if (signedness === 'unsigned') {
    // 2. Otherwise, if signedness is "unsigned", then:

    // 1. Let lowerBound be 0.
    lowerBound = 0

    // 2. Let upperBound be 2^bitLength − 1.
    upperBound = Math.pow(2, bitLength) - 1
  } else {
    // 3. Otherwise:

    // 1. Let lowerBound be -2^bitLength − 1.
    lowerBound = Math.pow(-2, bitLength) - 1

    // 2. Let upperBound be 2^bitLength − 1 − 1.
    upperBound = Math.pow(2, bitLength - 1) - 1
  }

  // 4. Let x be ? ToNumber(V).
  let x = Number(V)

  // 5. If x is −0, then set x to +0.
  if (x === 0) {
    x = 0
  }

  // 6. If the conversion is to an IDL type associated
  //    with the [EnforceRange] extended attribute, then:
  if (opts.enforceRange === true) {
    // 1. If x is NaN, +∞, or −∞, then throw a TypeError.
    if (
      Number.isNaN(x) ||
      x === Number.POSITIVE_INFINITY ||
      x === Number.NEGATIVE_INFINITY
    ) {
      throw webidl.errors.exception({
        header: 'Integer conversion',
        message: `Could not convert ${V} to an integer.`
      })
    }

    // 2. Set x to IntegerPart(x).
    x = webidl.util.IntegerPart(x)

    // 3. If x < lowerBound or x > upperBound, then
    //    throw a TypeError.
    if (x < lowerBound || x > upperBound) {
      throw webidl.errors.exception({
        header: 'Integer conversion',
        message: `Value must be between ${lowerBound}-${upperBound}, got ${x}.`
      })
    }

    // 4. Return x.
    return x
  }

  // 7. If x is not NaN and the conversion is to an IDL
  //    type associated with the [Clamp] extended
  //    attribute, then:
  if (!Number.isNaN(x) && opts.clamp === true) {
    // 1. Set x to min(max(x, lowerBound), upperBound).
    x = Math.min(Math.max(x, lowerBound), upperBound)

    // 2. Round x to the nearest integer, choosing the
    //    even integer if it lies halfway between two,
    //    and choosing +0 rather than −0.
    if (Math.floor(x) % 2 === 0) {
      x = Math.floor(x)
    } else {
      x = Math.ceil(x)
    }

    // 3. Return x.
    return x
  }

  // 8. If x is NaN, +0, +∞, or −∞, then return +0.
  if (
    Number.isNaN(x) ||
    (x === 0 && Object.is(0, x)) ||
    x === Number.POSITIVE_INFINITY ||
    x === Number.NEGATIVE_INFINITY
  ) {
    return 0
  }

  // 9. Set x to IntegerPart(x).
  x = webidl.util.IntegerPart(x)

  // 10. Set x to x modulo 2^bitLength.
  x = x % Math.pow(2, bitLength)

  // 11. If signedness is "signed" and x ≥ 2^bitLength − 1,
  //    then return x − 2^bitLength.
  if (signedness === 'signed' && x >= Math.pow(2, bitLength) - 1) {
    return x - Math.pow(2, bitLength)
  }

  // 12. Otherwise, return x.
  return x
}

// https://webidl.spec.whatwg.org/#abstract-opdef-integerpart
webidl.util.IntegerPart = function (n) {
  // 1. Let r be floor(abs(n)).
  const r = Math.floor(Math.abs(n))

  // 2. If n < 0, then return -1 × r.
  if (n < 0) {
    return -1 * r
  }

  // 3. Otherwise, return r.
  return r
}

// https://webidl.spec.whatwg.org/#es-sequence
webidl.sequenceConverter = function (converter) {
  return (V) => {
    // 1. If Type(V) is not Object, throw a TypeError.
    if (webidl.util.Type(V) !== 'Object') {
      throw webidl.errors.exception({
        header: 'Sequence',
        message: `Value of type ${webidl.util.Type(V)} is not an Object.`
      })
    }

    // 2. Let method be ? GetMethod(V, @@iterator).
    /** @type {Generator} */
    const method = V?.[Symbol.iterator]?.()
    const seq = []

    // 3. If method is undefined, throw a TypeError.
    if (
      method === undefined ||
      typeof method.next !== 'function'
    ) {
      throw webidl.errors.exception({
        header: 'Sequence',
        message: 'Object is not an iterator.'
      })
    }

    // https://webidl.spec.whatwg.org/#create-sequence-from-iterable
    while (true) {
      const { done, value } = method.next()

      if (done) {
        break
      }

      seq.push(converter(value))
    }

    return seq
  }
}

// https://webidl.spec.whatwg.org/#es-to-record
webidl.recordConverter = function (keyConverter, valueConverter) {
  return (O) => {
    // 1. If Type(O) is not Object, throw a TypeError.
    if (webidl.util.Type(O) !== 'Object') {
      throw webidl.errors.exception({
        header: 'Record',
        message: `Value of type ${webidl.util.Type(O)} is not an Object.`
      })
    }

    // 2. Let result be a new empty instance of record<K, V>.
    const result = {}

    if (!types.isProxy(O)) {
      // Object.keys only returns enumerable properties
      const keys = Object.keys(O)

      for (const key of keys) {
        // 1. Let typedKey be key converted to an IDL value of type K.
        const typedKey = keyConverter(key)

        // 2. Let value be ? Get(O, key).
        // 3. Let typedValue be value converted to an IDL value of type V.
        const typedValue = valueConverter(O[key])

        // 4. Set result[typedKey] to typedValue.
        result[typedKey] = typedValue
      }

      // 5. Return result.
      return result
    }

    // 3. Let keys be ? O.[[OwnPropertyKeys]]().
    const keys = Reflect.ownKeys(O)

    // 4. For each key of keys.
    for (const key of keys) {
      // 1. Let desc be ? O.[[GetOwnProperty]](key).
      const desc = Reflect.getOwnPropertyDescriptor(O, key)

      // 2. If desc is not undefined and desc.[[Enumerable]] is true:
      if (desc?.enumerable) {
        // 1. Let typedKey be key converted to an IDL value of type K.
        const typedKey = keyConverter(key)

        // 2. Let value be ? Get(O, key).
        // 3. Let typedValue be value converted to an IDL value of type V.
        const typedValue = valueConverter(O[key])

        // 4. Set result[typedKey] to typedValue.
        result[typedKey] = typedValue
      }
    }

    // 5. Return result.
    return result
  }
}

webidl.interfaceConverter = function (i) {
  return (V, opts = {}) => {
    if (opts.strict !== false && !(V instanceof i)) {
      throw webidl.errors.exception({
        header: i.name,
        message: `Expected ${V} to be an instance of ${i.name}.`
      })
    }

    return V
  }
}

webidl.dictionaryConverter = function (converters) {
  return (dictionary) => {
    const type = webidl.util.Type(dictionary)
    const dict = {}

    if (type === 'Null' || type === 'Undefined') {
      return dict
    } else if (type !== 'Object') {
      throw webidl.errors.exception({
        header: 'Dictionary',
        message: `Expected ${dictionary} to be one of: Null, Undefined, Object.`
      })
    }

    for (const options of converters) {
      const { key, defaultValue, required, converter } = options

      if (required === true) {
        if (!hasOwn(dictionary, key)) {
          throw webidl.errors.exception({
            header: 'Dictionary',
            message: `Missing required key "${key}".`
          })
        }
      }

      let value = dictionary[key]
      const hasDefault = hasOwn(options, 'defaultValue')

      // Only use defaultValue if value is undefined and
      // a defaultValue options was provided.
      if (hasDefault && value !== null) {
        value = value ?? defaultValue
      }

      // A key can be optional and have no default value.
      // When this happens, do not perform a conversion,
      // and do not assign the key a value.
      if (required || hasDefault || value !== undefined) {
        value = converter(value)

        if (
          options.allowedValues &&
          !options.allowedValues.includes(value)
        ) {
          throw webidl.errors.exception({
            header: 'Dictionary',
            message: `${value} is not an accepted type. Expected one of ${options.allowedValues.join(', ')}.`
          })
        }

        dict[key] = value
      }
    }

    return dict
  }
}

webidl.nullableConverter = function (converter) {
  return (V) => {
    if (V === null) {
      return V
    }

    return converter(V)
  }
}

// https://webidl.spec.whatwg.org/#es-DOMString
webidl.converters.DOMString = function (V, opts = {}) {
  // 1. If V is null and the conversion is to an IDL type
  //    associated with the [LegacyNullToEmptyString]
  //    extended attribute, then return the DOMString value
  //    that represents the empty string.
  if (V === null && opts.legacyNullToEmptyString) {
    return ''
  }

  // 2. Let x be ? ToString(V).
  if (typeof V === 'symbol') {
    throw new TypeError('Could not convert argument of type symbol to string.')
  }

  // 3. Return the IDL DOMString value that represents the
  //    same sequence of code units as the one the
  //    ECMAScript String value x represents.
  return String(V)
}

// https://webidl.spec.whatwg.org/#es-ByteString
webidl.converters.ByteString = function (V) {
  // 1. Let x be ? ToString(V).
  // Note: DOMString converter perform ? ToString(V)
  const x = webidl.converters.DOMString(V)

  // 2. If the value of any element of x is greater than
  //    255, then throw a TypeError.
  for (let index = 0; index < x.length; index++) {
    if (x.charCodeAt(index) > 255) {
      throw new TypeError(
        'Cannot convert argument to a ByteString because the character at ' +
        `index ${index} has a value of ${x.charCodeAt(index)} which is greater than 255.`
      )
    }
  }

  // 3. Return an IDL ByteString value whose length is the
  //    length of x, and where the value of each element is
  //    the value of the corresponding element of x.
  return x
}

// https://webidl.spec.whatwg.org/#es-USVString
webidl.converters.USVString = toUSVString

// https://webidl.spec.whatwg.org/#es-boolean
webidl.converters.boolean = function (V) {
  // 1. Let x be the result of computing ToBoolean(V).
  const x = Boolean(V)

  // 2. Return the IDL boolean value that is the one that represents
  //    the same truth value as the ECMAScript Boolean value x.
  return x
}

// https://webidl.spec.whatwg.org/#es-any
webidl.converters.any = function (V) {
  return V
}

// https://webidl.spec.whatwg.org/#es-long-long
webidl.converters['long long'] = function (V) {
  // 1. Let x be ? ConvertToInt(V, 64, "signed").
  const x = webidl.util.ConvertToInt(V, 64, 'signed')

  // 2. Return the IDL long long value that represents
  //    the same numeric value as x.
  return x
}

// https://webidl.spec.whatwg.org/#es-unsigned-long-long
webidl.converters['unsigned long long'] = function (V) {
  // 1. Let x be ? ConvertToInt(V, 64, "unsigned").
  const x = webidl.util.ConvertToInt(V, 64, 'unsigned')

  // 2. Return the IDL unsigned long long value that
  //    represents the same numeric value as x.
  return x
}

// https://webidl.spec.whatwg.org/#es-unsigned-long
webidl.converters['unsigned long'] = function (V) {
  // 1. Let x be ? ConvertToInt(V, 32, "unsigned").
  const x = webidl.util.ConvertToInt(V, 32, 'unsigned')

  // 2. Return the IDL unsigned long value that
  //    represents the same numeric value as x.
  return x
}

// https://webidl.spec.whatwg.org/#es-unsigned-short
webidl.converters['unsigned short'] = function (V, opts) {
  // 1. Let x be ? ConvertToInt(V, 16, "unsigned").
  const x = webidl.util.ConvertToInt(V, 16, 'unsigned', opts)

  // 2. Return the IDL unsigned short value that represents
  //    the same numeric value as x.
  return x
}

// https://webidl.spec.whatwg.org/#idl-ArrayBuffer
webidl.converters.ArrayBuffer = function (V, opts = {}) {
  // 1. If Type(V) is not Object, or V does not have an
  //    [[ArrayBufferData]] internal slot, then throw a
  //    TypeError.
  // see: https://tc39.es/ecma262/#sec-properties-of-the-arraybuffer-instances
  // see: https://tc39.es/ecma262/#sec-properties-of-the-sharedarraybuffer-instances
  if (
    webidl.util.Type(V) !== 'Object' ||
    !types.isAnyArrayBuffer(V)
  ) {
    throw webidl.errors.conversionFailed({
      prefix: `${V}`,
      argument: `${V}`,
      types: ['ArrayBuffer']
    })
  }

  // 2. If the conversion is not to an IDL type associated
  //    with the [AllowShared] extended attribute, and
  //    IsSharedArrayBuffer(V) is true, then throw a
  //    TypeError.
  if (opts.allowShared === false && types.isSharedArrayBuffer(V)) {
    throw webidl.errors.exception({
      header: 'ArrayBuffer',
      message: 'SharedArrayBuffer is not allowed.'
    })
  }

  // 3. If the conversion is not to an IDL type associated
  //    with the [AllowResizable] extended attribute, and
  //    IsResizableArrayBuffer(V) is true, then throw a
  //    TypeError.
  // Note: resizable ArrayBuffers are currently a proposal.

  // 4. Return the IDL ArrayBuffer value that is a
  //    reference to the same object as V.
  return V
}

webidl.converters.TypedArray = function (V, T, opts = {}) {
  // 1. Let T be the IDL type V is being converted to.

  // 2. If Type(V) is not Object, or V does not have a
  //    [[TypedArrayName]] internal slot with a value
  //    equal to T’s name, then throw a TypeError.
  if (
    webidl.util.Type(V) !== 'Object' ||
    !types.isTypedArray(V) ||
    V.constructor.name !== T.name
  ) {
    throw webidl.errors.conversionFailed({
      prefix: `${T.name}`,
      argument: `${V}`,
      types: [T.name]
    })
  }

  // 3. If the conversion is not to an IDL type associated
  //    with the [AllowShared] extended attribute, and
  //    IsSharedArrayBuffer(V.[[ViewedArrayBuffer]]) is
  //    true, then throw a TypeError.
  if (opts.allowShared === false && types.isSharedArrayBuffer(V.buffer)) {
    throw webidl.errors.exception({
      header: 'ArrayBuffer',
      message: 'SharedArrayBuffer is not allowed.'
    })
  }

  // 4. If the conversion is not to an IDL type associated
  //    with the [AllowResizable] extended attribute, and
  //    IsResizableArrayBuffer(V.[[ViewedArrayBuffer]]) is
  //    true, then throw a TypeError.
  // Note: resizable array buffers are currently a proposal

  // 5. Return the IDL value of type T that is a reference
  //    to the same object as V.
  return V
}

webidl.converters.DataView = function (V, opts = {}) {
  // 1. If Type(V) is not Object, or V does not have a
  //    [[DataView]] internal slot, then throw a TypeError.
  if (webidl.util.Type(V) !== 'Object' || !types.isDataView(V)) {
    throw webidl.errors.exception({
      header: 'DataView',
      message: 'Object is not a DataView.'
    })
  }

  // 2. If the conversion is not to an IDL type associated
  //    with the [AllowShared] extended attribute, and
  //    IsSharedArrayBuffer(V.[[ViewedArrayBuffer]]) is true,
  //    then throw a TypeError.
  if (opts.allowShared === false && types.isSharedArrayBuffer(V.buffer)) {
    throw webidl.errors.exception({
      header: 'ArrayBuffer',
      message: 'SharedArrayBuffer is not allowed.'
    })
  }

  // 3. If the conversion is not to an IDL type associated
  //    with the [AllowResizable] extended attribute, and
  //    IsResizableArrayBuffer(V.[[ViewedArrayBuffer]]) is
  //    true, then throw a TypeError.
  // Note: resizable ArrayBuffers are currently a proposal

  // 4. Return the IDL DataView value that is a reference
  //    to the same object as V.
  return V
}

// https://webidl.spec.whatwg.org/#BufferSource
webidl.converters.BufferSource = function (V, opts = {}) {
  if (types.isAnyArrayBuffer(V)) {
    return webidl.converters.ArrayBuffer(V, opts)
  }

  if (types.isTypedArray(V)) {
    return webidl.converters.TypedArray(V, V.constructor)
  }

  if (types.isDataView(V)) {
    return webidl.converters.DataView(V, opts)
  }

  throw new TypeError(`Could not convert ${V} to a BufferSource.`)
}

webidl.converters['sequence<ByteString>'] = webidl.sequenceConverter(
  webidl.converters.ByteString
)

webidl.converters['sequence<sequence<ByteString>>'] = webidl.sequenceConverter(
  webidl.converters['sequence<ByteString>']
)

webidl.converters['record<ByteString, ByteString>'] = webidl.recordConverter(
  webidl.converters.ByteString,
  webidl.converters.ByteString
)

module.exports = {
  webidl
}


/***/ }),

/***/ 4854:
/***/ ((module) => {

"use strict";


/**
 * @see https://encoding.spec.whatwg.org/#concept-encoding-get
 * @param {string|undefined} label
 */
function getEncoding (label) {
  if (!label) {
    return 'failure'
  }

  // 1. Remove any leading and trailing ASCII whitespace from label.
  // 2. If label is an ASCII case-insensitive match for any of the
  //    labels listed in the table below, then return the
  //    corresponding encoding; otherwise return failure.
  switch (label.trim().toLowerCase()) {
    case 'unicode-1-1-utf-8':
    case 'unicode11utf8':
    case 'unicode20utf8':
    case 'utf-8':
    case 'utf8':
    case 'x-unicode20utf8':
      return 'UTF-8'
    case '866':
    case 'cp866':
    case 'csibm866':
    case 'ibm866':
      return 'IBM866'
    case 'csisolatin2':
    case 'iso-8859-2':
    case 'iso-ir-101':
    case 'iso8859-2':
    case 'iso88592':
    case 'iso_8859-2':
    case 'iso_8859-2:1987':
    case 'l2':
    case 'latin2':
      return 'ISO-8859-2'
    case 'csisolatin3':
    case 'iso-8859-3':
    case 'iso-ir-109':
    case 'iso8859-3':
    case 'iso88593':
    case 'iso_8859-3':
    case 'iso_8859-3:1988':
    case 'l3':
    case 'latin3':
      return 'ISO-8859-3'
    case 'csisolatin4':
    case 'iso-8859-4':
    case 'iso-ir-110':
    case 'iso8859-4':
    case 'iso88594':
    case 'iso_8859-4':
    case 'iso_8859-4:1988':
    case 'l4':
    case 'latin4':
      return 'ISO-8859-4'
    case 'csisolatincyrillic':
    case 'cyrillic':
    case 'iso-8859-5':
    case 'iso-ir-144':
    case 'iso8859-5':
    case 'iso88595':
    case 'iso_8859-5':
    case 'iso_8859-5:1988':
      return 'ISO-8859-5'
    case 'arabic':
    case 'asmo-708':
    case 'csiso88596e':
    case 'csiso88596i':
    case 'csisolatinarabic':
    case 'ecma-114':
    case 'iso-8859-6':
    case 'iso-8859-6-e':
    case 'iso-8859-6-i':
    case 'iso-ir-127':
    case 'iso8859-6':
    case 'iso88596':
    case 'iso_8859-6':
    case 'iso_8859-6:1987':
      return 'ISO-8859-6'
    case 'csisolatingreek':
    case 'ecma-118':
    case 'elot_928':
    case 'greek':
    case 'greek8':
    case 'iso-8859-7':
    case 'iso-ir-126':
    case 'iso8859-7':
    case 'iso88597':
    case 'iso_8859-7':
    case 'iso_8859-7:1987':
    case 'sun_eu_greek':
      return 'ISO-8859-7'
    case 'csiso88598e':
    case 'csisolatinhebrew':
    case 'hebrew':
    case 'iso-8859-8':
    case 'iso-8859-8-e':
    case 'iso-ir-138':
    case 'iso8859-8':
    case 'iso88598':
    case 'iso_8859-8':
    case 'iso_8859-8:1988':
    case 'visual':
      return 'ISO-8859-8'
    case 'csiso88598i':
    case 'iso-8859-8-i':
    case 'logical':
      return 'ISO-8859-8-I'
    case 'csisolatin6':
    case 'iso-8859-10':
    case 'iso-ir-157':
    case 'iso8859-10':
    case 'iso885910':
    case 'l6':
    case 'latin6':
      return 'ISO-8859-10'
    case 'iso-8859-13':
    case 'iso8859-13':
    case 'iso885913':
      return 'ISO-8859-13'
    case 'iso-8859-14':
    case 'iso8859-14':
    case 'iso885914':
      return 'ISO-8859-14'
    case 'csisolatin9':
    case 'iso-8859-15':
    case 'iso8859-15':
    case 'iso885915':
    case 'iso_8859-15':
    case 'l9':
      return 'ISO-8859-15'
    case 'iso-8859-16':
      return 'ISO-8859-16'
    case 'cskoi8r':
    case 'koi':
    case 'koi8':
    case 'koi8-r':
    case 'koi8_r':
      return 'KOI8-R'
    case 'koi8-ru':
    case 'koi8-u':
      return 'KOI8-U'
    case 'csmacintosh':
    case 'mac':
    case 'macintosh':
    case 'x-mac-roman':
      return 'macintosh'
    case 'iso-8859-11':
    case 'iso8859-11':
    case 'iso885911':
    case 'tis-620':
    case 'windows-874':
      return 'windows-874'
    case 'cp1250':
    case 'windows-1250':
    case 'x-cp1250':
      return 'windows-1250'
    case 'cp1251':
    case 'windows-1251':
    case 'x-cp1251':
      return 'windows-1251'
    case 'ansi_x3.4-1968':
    case 'ascii':
    case 'cp1252':
    case 'cp819':
    case 'csisolatin1':
    case 'ibm819':
    case 'iso-8859-1':
    case 'iso-ir-100':
    case 'iso8859-1':
    case 'iso88591':
    case 'iso_8859-1':
    case 'iso_8859-1:1987':
    case 'l1':
    case 'latin1':
    case 'us-ascii':
    case 'windows-1252':
    case 'x-cp1252':
      return 'windows-1252'
    case 'cp1253':
    case 'windows-1253':
    case 'x-cp1253':
      return 'windows-1253'
    case 'cp1254':
    case 'csisolatin5':
    case 'iso-8859-9':
    case 'iso-ir-148':
    case 'iso8859-9':
    case 'iso88599':
    case 'iso_8859-9':
    case 'iso_8859-9:1989':
    case 'l5':
    case 'latin5':
    case 'windows-1254':
    case 'x-cp1254':
      return 'windows-1254'
    case 'cp1255':
    case 'windows-1255':
    case 'x-cp1255':
      return 'windows-1255'
    case 'cp1256':
    case 'windows-1256':
    case 'x-cp1256':
      return 'windows-1256'
    case 'cp1257':
    case 'windows-1257':
    case 'x-cp1257':
      return 'windows-1257'
    case 'cp1258':
    case 'windows-1258':
    case 'x-cp1258':
      return 'windows-1258'
    case 'x-mac-cyrillic':
    case 'x-mac-ukrainian':
      return 'x-mac-cyrillic'
    case 'chinese':
    case 'csgb2312':
    case 'csiso58gb231280':
    case 'gb2312':
    case 'gb_2312':
    case 'gb_2312-80':
    case 'gbk':
    case 'iso-ir-58':
    case 'x-gbk':
      return 'GBK'
    case 'gb18030':
      return 'gb18030'
    case 'big5':
    case 'big5-hkscs':
    case 'cn-big5':
    case 'csbig5':
    case 'x-x-big5':
      return 'Big5'
    case 'cseucpkdfmtjapanese':
    case 'euc-jp':
    case 'x-euc-jp':
      return 'EUC-JP'
    case 'csiso2022jp':
    case 'iso-2022-jp':
      return 'ISO-2022-JP'
    case 'csshiftjis':
    case 'ms932':
    case 'ms_kanji':
    case 'shift-jis':
    case 'shift_jis':
    case 'sjis':
    case 'windows-31j':
    case 'x-sjis':
      return 'Shift_JIS'
    case 'cseuckr':
    case 'csksc56011987':
    case 'euc-kr':
    case 'iso-ir-149':
    case 'korean':
    case 'ks_c_5601-1987':
    case 'ks_c_5601-1989':
    case 'ksc5601':
    case 'ksc_5601':
    case 'windows-949':
      return 'EUC-KR'
    case 'csiso2022kr':
    case 'hz-gb-2312':
    case 'iso-2022-cn':
    case 'iso-2022-cn-ext':
    case 'iso-2022-kr':
    case 'replacement':
      return 'replacement'
    case 'unicodefffe':
    case 'utf-16be':
      return 'UTF-16BE'
    case 'csunicode':
    case 'iso-10646-ucs-2':
    case 'ucs-2':
    case 'unicode':
    case 'unicodefeff':
    case 'utf-16':
    case 'utf-16le':
      return 'UTF-16LE'
    case 'x-user-defined':
      return 'x-user-defined'
    default: return 'failure'
  }
}

module.exports = {
  getEncoding
}


/***/ }),

/***/ 1446:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  staticPropertyDescriptors,
  readOperation,
  fireAProgressEvent
} = __nccwpck_require__(7530)
const {
  kState,
  kError,
  kResult,
  kEvents,
  kAborted
} = __nccwpck_require__(9054)
const { webidl } = __nccwpck_require__(1744)
const { kEnumerableProperty } = __nccwpck_require__(3983)

class FileReader extends EventTarget {
  constructor () {
    super()

    this[kState] = 'empty'
    this[kResult] = null
    this[kError] = null
    this[kEvents] = {
      loadend: null,
      error: null,
      abort: null,
      load: null,
      progress: null,
      loadstart: null
    }
  }

  /**
   * @see https://w3c.github.io/FileAPI/#dfn-readAsArrayBuffer
   * @param {import('buffer').Blob} blob
   */
  readAsArrayBuffer (blob) {
    webidl.brandCheck(this, FileReader)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FileReader.readAsArrayBuffer' })

    blob = webidl.converters.Blob(blob, { strict: false })

    // The readAsArrayBuffer(blob) method, when invoked,
    // must initiate a read operation for blob with ArrayBuffer.
    readOperation(this, blob, 'ArrayBuffer')
  }

  /**
   * @see https://w3c.github.io/FileAPI/#readAsBinaryString
   * @param {import('buffer').Blob} blob
   */
  readAsBinaryString (blob) {
    webidl.brandCheck(this, FileReader)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FileReader.readAsBinaryString' })

    blob = webidl.converters.Blob(blob, { strict: false })

    // The readAsBinaryString(blob) method, when invoked,
    // must initiate a read operation for blob with BinaryString.
    readOperation(this, blob, 'BinaryString')
  }

  /**
   * @see https://w3c.github.io/FileAPI/#readAsDataText
   * @param {import('buffer').Blob} blob
   * @param {string?} encoding
   */
  readAsText (blob, encoding = undefined) {
    webidl.brandCheck(this, FileReader)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FileReader.readAsText' })

    blob = webidl.converters.Blob(blob, { strict: false })

    if (encoding !== undefined) {
      encoding = webidl.converters.DOMString(encoding)
    }

    // The readAsText(blob, encoding) method, when invoked,
    // must initiate a read operation for blob with Text and encoding.
    readOperation(this, blob, 'Text', encoding)
  }

  /**
   * @see https://w3c.github.io/FileAPI/#dfn-readAsDataURL
   * @param {import('buffer').Blob} blob
   */
  readAsDataURL (blob) {
    webidl.brandCheck(this, FileReader)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FileReader.readAsDataURL' })

    blob = webidl.converters.Blob(blob, { strict: false })

    // The readAsDataURL(blob) method, when invoked, must
    // initiate a read operation for blob with DataURL.
    readOperation(this, blob, 'DataURL')
  }

  /**
   * @see https://w3c.github.io/FileAPI/#dfn-abort
   */
  abort () {
    // 1. If this's state is "empty" or if this's state is
    //    "done" set this's result to null and terminate
    //    this algorithm.
    if (this[kState] === 'empty' || this[kState] === 'done') {
      this[kResult] = null
      return
    }

    // 2. If this's state is "loading" set this's state to
    //    "done" and set this's result to null.
    if (this[kState] === 'loading') {
      this[kState] = 'done'
      this[kResult] = null
    }

    // 3. If there are any tasks from this on the file reading
    //    task source in an affiliated task queue, then remove
    //    those tasks from that task queue.
    this[kAborted] = true

    // 4. Terminate the algorithm for the read method being processed.
    // TODO

    // 5. Fire a progress event called abort at this.
    fireAProgressEvent('abort', this)

    // 6. If this's state is not "loading", fire a progress
    //    event called loadend at this.
    if (this[kState] !== 'loading') {
      fireAProgressEvent('loadend', this)
    }
  }

  /**
   * @see https://w3c.github.io/FileAPI/#dom-filereader-readystate
   */
  get readyState () {
    webidl.brandCheck(this, FileReader)

    switch (this[kState]) {
      case 'empty': return this.EMPTY
      case 'loading': return this.LOADING
      case 'done': return this.DONE
    }
  }

  /**
   * @see https://w3c.github.io/FileAPI/#dom-filereader-result
   */
  get result () {
    webidl.brandCheck(this, FileReader)

    // The result attribute’s getter, when invoked, must return
    // this's result.
    return this[kResult]
  }

  /**
   * @see https://w3c.github.io/FileAPI/#dom-filereader-error
   */
  get error () {
    webidl.brandCheck(this, FileReader)

    // The error attribute’s getter, when invoked, must return
    // this's error.
    return this[kError]
  }

  get onloadend () {
    webidl.brandCheck(this, FileReader)

    return this[kEvents].loadend
  }

  set onloadend (fn) {
    webidl.brandCheck(this, FileReader)

    if (this[kEvents].loadend) {
      this.removeEventListener('loadend', this[kEvents].loadend)
    }

    if (typeof fn === 'function') {
      this[kEvents].loadend = fn
      this.addEventListener('loadend', fn)
    } else {
      this[kEvents].loadend = null
    }
  }

  get onerror () {
    webidl.brandCheck(this, FileReader)

    return this[kEvents].error
  }

  set onerror (fn) {
    webidl.brandCheck(this, FileReader)

    if (this[kEvents].error) {
      this.removeEventListener('error', this[kEvents].error)
    }

    if (typeof fn === 'function') {
      this[kEvents].error = fn
      this.addEventListener('error', fn)
    } else {
      this[kEvents].error = null
    }
  }

  get onloadstart () {
    webidl.brandCheck(this, FileReader)

    return this[kEvents].loadstart
  }

  set onloadstart (fn) {
    webidl.brandCheck(this, FileReader)

    if (this[kEvents].loadstart) {
      this.removeEventListener('loadstart', this[kEvents].loadstart)
    }

    if (typeof fn === 'function') {
      this[kEvents].loadstart = fn
      this.addEventListener('loadstart', fn)
    } else {
      this[kEvents].loadstart = null
    }
  }

  get onprogress () {
    webidl.brandCheck(this, FileReader)

    return this[kEvents].progress
  }

  set onprogress (fn) {
    webidl.brandCheck(this, FileReader)

    if (this[kEvents].progress) {
      this.removeEventListener('progress', this[kEvents].progress)
    }

    if (typeof fn === 'function') {
      this[kEvents].progress = fn
      this.addEventListener('progress', fn)
    } else {
      this[kEvents].progress = null
    }
  }

  get onload () {
    webidl.brandCheck(this, FileReader)

    return this[kEvents].load
  }

  set onload (fn) {
    webidl.brandCheck(this, FileReader)

    if (this[kEvents].load) {
      this.removeEventListener('load', this[kEvents].load)
    }

    if (typeof fn === 'function') {
      this[kEvents].load = fn
      this.addEventListener('load', fn)
    } else {
      this[kEvents].load = null
    }
  }

  get onabort () {
    webidl.brandCheck(this, FileReader)

    return this[kEvents].abort
  }

  set onabort (fn) {
    webidl.brandCheck(this, FileReader)

    if (this[kEvents].abort) {
      this.removeEventListener('abort', this[kEvents].abort)
    }

    if (typeof fn === 'function') {
      this[kEvents].abort = fn
      this.addEventListener('abort', fn)
    } else {
      this[kEvents].abort = null
    }
  }
}

// https://w3c.github.io/FileAPI/#dom-filereader-empty
FileReader.EMPTY = FileReader.prototype.EMPTY = 0
// https://w3c.github.io/FileAPI/#dom-filereader-loading
FileReader.LOADING = FileReader.prototype.LOADING = 1
// https://w3c.github.io/FileAPI/#dom-filereader-done
FileReader.DONE = FileReader.prototype.DONE = 2

Object.defineProperties(FileReader.prototype, {
  EMPTY: staticPropertyDescriptors,
  LOADING: staticPropertyDescriptors,
  DONE: staticPropertyDescriptors,
  readAsArrayBuffer: kEnumerableProperty,
  readAsBinaryString: kEnumerableProperty,
  readAsText: kEnumerableProperty,
  readAsDataURL: kEnumerableProperty,
  abort: kEnumerableProperty,
  readyState: kEnumerableProperty,
  result: kEnumerableProperty,
  error: kEnumerableProperty,
  onloadstart: kEnumerableProperty,
  onprogress: kEnumerableProperty,
  onload: kEnumerableProperty,
  onabort: kEnumerableProperty,
  onerror: kEnumerableProperty,
  onloadend: kEnumerableProperty,
  [Symbol.toStringTag]: {
    value: 'FileReader',
    writable: false,
    enumerable: false,
    configurable: true
  }
})

Object.defineProperties(FileReader, {
  EMPTY: staticPropertyDescriptors,
  LOADING: staticPropertyDescriptors,
  DONE: staticPropertyDescriptors
})

module.exports = {
  FileReader
}


/***/ }),

/***/ 5504:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { webidl } = __nccwpck_require__(1744)

const kState = Symbol('ProgressEvent state')

/**
 * @see https://xhr.spec.whatwg.org/#progressevent
 */
class ProgressEvent extends Event {
  constructor (type, eventInitDict = {}) {
    type = webidl.converters.DOMString(type)
    eventInitDict = webidl.converters.ProgressEventInit(eventInitDict ?? {})

    super(type, eventInitDict)

    this[kState] = {
      lengthComputable: eventInitDict.lengthComputable,
      loaded: eventInitDict.loaded,
      total: eventInitDict.total
    }
  }

  get lengthComputable () {
    webidl.brandCheck(this, ProgressEvent)

    return this[kState].lengthComputable
  }

  get loaded () {
    webidl.brandCheck(this, ProgressEvent)

    return this[kState].loaded
  }

  get total () {
    webidl.brandCheck(this, ProgressEvent)

    return this[kState].total
  }
}

webidl.converters.ProgressEventInit = webidl.dictionaryConverter([
  {
    key: 'lengthComputable',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'loaded',
    converter: webidl.converters['unsigned long long'],
    defaultValue: 0
  },
  {
    key: 'total',
    converter: webidl.converters['unsigned long long'],
    defaultValue: 0
  },
  {
    key: 'bubbles',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'cancelable',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'composed',
    converter: webidl.converters.boolean,
    defaultValue: false
  }
])

module.exports = {
  ProgressEvent
}


/***/ }),

/***/ 9054:
/***/ ((module) => {

"use strict";


module.exports = {
  kState: Symbol('FileReader state'),
  kResult: Symbol('FileReader result'),
  kError: Symbol('FileReader error'),
  kLastProgressEventFired: Symbol('FileReader last progress event fired timestamp'),
  kEvents: Symbol('FileReader events'),
  kAborted: Symbol('FileReader aborted')
}


/***/ }),

/***/ 7530:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  kState,
  kError,
  kResult,
  kAborted,
  kLastProgressEventFired
} = __nccwpck_require__(9054)
const { ProgressEvent } = __nccwpck_require__(5504)
const { getEncoding } = __nccwpck_require__(4854)
const { DOMException } = __nccwpck_require__(1037)
const { serializeAMimeType, parseMIMEType } = __nccwpck_require__(685)
const { types } = __nccwpck_require__(3837)
const { StringDecoder } = __nccwpck_require__(1576)
const { btoa } = __nccwpck_require__(4300)

/** @type {PropertyDescriptor} */
const staticPropertyDescriptors = {
  enumerable: true,
  writable: false,
  configurable: false
}

/**
 * @see https://w3c.github.io/FileAPI/#readOperation
 * @param {import('./filereader').FileReader} fr
 * @param {import('buffer').Blob} blob
 * @param {string} type
 * @param {string?} encodingName
 */
function readOperation (fr, blob, type, encodingName) {
  // 1. If fr’s state is "loading", throw an InvalidStateError
  //    DOMException.
  if (fr[kState] === 'loading') {
    throw new DOMException('Invalid state', 'InvalidStateError')
  }

  // 2. Set fr’s state to "loading".
  fr[kState] = 'loading'

  // 3. Set fr’s result to null.
  fr[kResult] = null

  // 4. Set fr’s error to null.
  fr[kError] = null

  // 5. Let stream be the result of calling get stream on blob.
  /** @type {import('stream/web').ReadableStream} */
  const stream = blob.stream()

  // 6. Let reader be the result of getting a reader from stream.
  const reader = stream.getReader()

  // 7. Let bytes be an empty byte sequence.
  /** @type {Uint8Array[]} */
  const bytes = []

  // 8. Let chunkPromise be the result of reading a chunk from
  //    stream with reader.
  let chunkPromise = reader.read()

  // 9. Let isFirstChunk be true.
  let isFirstChunk = true

  // 10. In parallel, while true:
  // Note: "In parallel" just means non-blocking
  // Note 2: readOperation itself cannot be async as double
  // reading the body would then reject the promise, instead
  // of throwing an error.
  ;(async () => {
    while (!fr[kAborted]) {
      // 1. Wait for chunkPromise to be fulfilled or rejected.
      try {
        const { done, value } = await chunkPromise

        // 2. If chunkPromise is fulfilled, and isFirstChunk is
        //    true, queue a task to fire a progress event called
        //    loadstart at fr.
        if (isFirstChunk && !fr[kAborted]) {
          queueMicrotask(() => {
            fireAProgressEvent('loadstart', fr)
          })
        }

        // 3. Set isFirstChunk to false.
        isFirstChunk = false

        // 4. If chunkPromise is fulfilled with an object whose
        //    done property is false and whose value property is
        //    a Uint8Array object, run these steps:
        if (!done && types.isUint8Array(value)) {
          // 1. Let bs be the byte sequence represented by the
          //    Uint8Array object.

          // 2. Append bs to bytes.
          bytes.push(value)

          // 3. If roughly 50ms have passed since these steps
          //    were last invoked, queue a task to fire a
          //    progress event called progress at fr.
          if (
            (
              fr[kLastProgressEventFired] === undefined ||
              Date.now() - fr[kLastProgressEventFired] >= 50
            ) &&
            !fr[kAborted]
          ) {
            fr[kLastProgressEventFired] = Date.now()
            queueMicrotask(() => {
              fireAProgressEvent('progress', fr)
            })
          }

          // 4. Set chunkPromise to the result of reading a
          //    chunk from stream with reader.
          chunkPromise = reader.read()
        } else if (done) {
          // 5. Otherwise, if chunkPromise is fulfilled with an
          //    object whose done property is true, queue a task
          //    to run the following steps and abort this algorithm:
          queueMicrotask(() => {
            // 1. Set fr’s state to "done".
            fr[kState] = 'done'

            // 2. Let result be the result of package data given
            //    bytes, type, blob’s type, and encodingName.
            try {
              const result = packageData(bytes, type, blob.type, encodingName)

              // 4. Else:

              if (fr[kAborted]) {
                return
              }

              // 1. Set fr’s result to result.
              fr[kResult] = result

              // 2. Fire a progress event called load at the fr.
              fireAProgressEvent('load', fr)
            } catch (error) {
              // 3. If package data threw an exception error:

              // 1. Set fr’s error to error.
              fr[kError] = error

              // 2. Fire a progress event called error at fr.
              fireAProgressEvent('error', fr)
            }

            // 5. If fr’s state is not "loading", fire a progress
            //    event called loadend at the fr.
            if (fr[kState] !== 'loading') {
              fireAProgressEvent('loadend', fr)
            }
          })

          break
        }
      } catch (error) {
        if (fr[kAborted]) {
          return
        }

        // 6. Otherwise, if chunkPromise is rejected with an
        //    error error, queue a task to run the following
        //    steps and abort this algorithm:
        queueMicrotask(() => {
          // 1. Set fr’s state to "done".
          fr[kState] = 'done'

          // 2. Set fr’s error to error.
          fr[kError] = error

          // 3. Fire a progress event called error at fr.
          fireAProgressEvent('error', fr)

          // 4. If fr’s state is not "loading", fire a progress
          //    event called loadend at fr.
          if (fr[kState] !== 'loading') {
            fireAProgressEvent('loadend', fr)
          }
        })

        break
      }
    }
  })()
}

/**
 * @see https://w3c.github.io/FileAPI/#fire-a-progress-event
 * @see https://dom.spec.whatwg.org/#concept-event-fire
 * @param {string} e The name of the event
 * @param {import('./filereader').FileReader} reader
 */
function fireAProgressEvent (e, reader) {
  // The progress event e does not bubble. e.bubbles must be false
  // The progress event e is NOT cancelable. e.cancelable must be false
  const event = new ProgressEvent(e, {
    bubbles: false,
    cancelable: false
  })

  reader.dispatchEvent(event)
}

/**
 * @see https://w3c.github.io/FileAPI/#blob-package-data
 * @param {Uint8Array[]} bytes
 * @param {string} type
 * @param {string?} mimeType
 * @param {string?} encodingName
 */
function packageData (bytes, type, mimeType, encodingName) {
  // 1. A Blob has an associated package data algorithm, given
  //    bytes, a type, a optional mimeType, and a optional
  //    encodingName, which switches on type and runs the
  //    associated steps:

  switch (type) {
    case 'DataURL': {
      // 1. Return bytes as a DataURL [RFC2397] subject to
      //    the considerations below:
      //  * Use mimeType as part of the Data URL if it is
      //    available in keeping with the Data URL
      //    specification [RFC2397].
      //  * If mimeType is not available return a Data URL
      //    without a media-type. [RFC2397].

      // https://datatracker.ietf.org/doc/html/rfc2397#section-3
      // dataurl    := "data:" [ mediatype ] [ ";base64" ] "," data
      // mediatype  := [ type "/" subtype ] *( ";" parameter )
      // data       := *urlchar
      // parameter  := attribute "=" value
      let dataURL = 'data:'

      const parsed = parseMIMEType(mimeType || 'application/octet-stream')

      if (parsed !== 'failure') {
        dataURL += serializeAMimeType(parsed)
      }

      dataURL += ';base64,'

      const decoder = new StringDecoder('latin1')

      for (const chunk of bytes) {
        dataURL += btoa(decoder.write(chunk))
      }

      dataURL += btoa(decoder.end())

      return dataURL
    }
    case 'Text': {
      // 1. Let encoding be failure
      let encoding = 'failure'

      // 2. If the encodingName is present, set encoding to the
      //    result of getting an encoding from encodingName.
      if (encodingName) {
        encoding = getEncoding(encodingName)
      }

      // 3. If encoding is failure, and mimeType is present:
      if (encoding === 'failure' && mimeType) {
        // 1. Let type be the result of parse a MIME type
        //    given mimeType.
        const type = parseMIMEType(mimeType)

        // 2. If type is not failure, set encoding to the result
        //    of getting an encoding from type’s parameters["charset"].
        if (type !== 'failure') {
          encoding = getEncoding(type.parameters.get('charset'))
        }
      }

      // 4. If encoding is failure, then set encoding to UTF-8.
      if (encoding === 'failure') {
        encoding = 'UTF-8'
      }

      // 5. Decode bytes using fallback encoding encoding, and
      //    return the result.
      return decode(bytes, encoding)
    }
    case 'ArrayBuffer': {
      // Return a new ArrayBuffer whose contents are bytes.
      const sequence = combineByteSequences(bytes)

      return sequence.buffer
    }
    case 'BinaryString': {
      // Return bytes as a binary string, in which every byte
      //  is represented by a code unit of equal value [0..255].
      let binaryString = ''

      const decoder = new StringDecoder('latin1')

      for (const chunk of bytes) {
        binaryString += decoder.write(chunk)
      }

      binaryString += decoder.end()

      return binaryString
    }
  }
}

/**
 * @see https://encoding.spec.whatwg.org/#decode
 * @param {Uint8Array[]} ioQueue
 * @param {string} encoding
 */
function decode (ioQueue, encoding) {
  const bytes = combineByteSequences(ioQueue)

  // 1. Let BOMEncoding be the result of BOM sniffing ioQueue.
  const BOMEncoding = BOMSniffing(bytes)

  let slice = 0

  // 2. If BOMEncoding is non-null:
  if (BOMEncoding !== null) {
    // 1. Set encoding to BOMEncoding.
    encoding = BOMEncoding

    // 2. Read three bytes from ioQueue, if BOMEncoding is
    //    UTF-8; otherwise read two bytes.
    //    (Do nothing with those bytes.)
    slice = BOMEncoding === 'UTF-8' ? 3 : 2
  }

  // 3. Process a queue with an instance of encoding’s
  //    decoder, ioQueue, output, and "replacement".

  // 4. Return output.

  const sliced = bytes.slice(slice)
  return new TextDecoder(encoding).decode(sliced)
}

/**
 * @see https://encoding.spec.whatwg.org/#bom-sniff
 * @param {Uint8Array} ioQueue
 */
function BOMSniffing (ioQueue) {
  // 1. Let BOM be the result of peeking 3 bytes from ioQueue,
  //    converted to a byte sequence.
  const [a, b, c] = ioQueue

  // 2. For each of the rows in the table below, starting with
  //    the first one and going down, if BOM starts with the
  //    bytes given in the first column, then return the
  //    encoding given in the cell in the second column of that
  //    row. Otherwise, return null.
  if (a === 0xEF && b === 0xBB && c === 0xBF) {
    return 'UTF-8'
  } else if (a === 0xFE && b === 0xFF) {
    return 'UTF-16BE'
  } else if (a === 0xFF && b === 0xFE) {
    return 'UTF-16LE'
  }

  return null
}

/**
 * @param {Uint8Array[]} sequences
 */
function combineByteSequences (sequences) {
  const size = sequences.reduce((a, b) => {
    return a + b.byteLength
  }, 0)

  let offset = 0

  return sequences.reduce((a, b) => {
    a.set(b, offset)
    offset += b.byteLength
    return a
  }, new Uint8Array(size))
}

module.exports = {
  staticPropertyDescriptors,
  readOperation,
  fireAProgressEvent
}


/***/ }),

/***/ 1892:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// We include a version number for the Dispatcher API. In case of breaking changes,
// this version number must be increased to avoid conflicts.
const globalDispatcher = Symbol.for('undici.globalDispatcher.1')
const { InvalidArgumentError } = __nccwpck_require__(8045)
const Agent = __nccwpck_require__(7890)

if (getGlobalDispatcher() === undefined) {
  setGlobalDispatcher(new Agent())
}

function setGlobalDispatcher (agent) {
  if (!agent || typeof agent.dispatch !== 'function') {
    throw new InvalidArgumentError('Argument agent must implement Agent')
  }
  Object.defineProperty(globalThis, globalDispatcher, {
    value: agent,
    writable: true,
    enumerable: false,
    configurable: false
  })
}

function getGlobalDispatcher () {
  return globalThis[globalDispatcher]
}

module.exports = {
  setGlobalDispatcher,
  getGlobalDispatcher
}


/***/ }),

/***/ 6930:
/***/ ((module) => {

"use strict";


module.exports = class DecoratorHandler {
  constructor (handler) {
    this.handler = handler
  }

  onConnect (...args) {
    return this.handler.onConnect(...args)
  }

  onError (...args) {
    return this.handler.onError(...args)
  }

  onUpgrade (...args) {
    return this.handler.onUpgrade(...args)
  }

  onHeaders (...args) {
    return this.handler.onHeaders(...args)
  }

  onData (...args) {
    return this.handler.onData(...args)
  }

  onComplete (...args) {
    return this.handler.onComplete(...args)
  }

  onBodySent (...args) {
    return this.handler.onBodySent(...args)
  }
}


/***/ }),

/***/ 2860:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const util = __nccwpck_require__(3983)
const { kBodyUsed } = __nccwpck_require__(2785)
const assert = __nccwpck_require__(9491)
const { InvalidArgumentError } = __nccwpck_require__(8045)
const EE = __nccwpck_require__(2361)

const redirectableStatusCodes = [300, 301, 302, 303, 307, 308]

const kBody = Symbol('body')

class BodyAsyncIterable {
  constructor (body) {
    this[kBody] = body
    this[kBodyUsed] = false
  }

  async * [Symbol.asyncIterator] () {
    assert(!this[kBodyUsed], 'disturbed')
    this[kBodyUsed] = true
    yield * this[kBody]
  }
}

class RedirectHandler {
  constructor (dispatch, maxRedirections, opts, handler) {
    if (maxRedirections != null && (!Number.isInteger(maxRedirections) || maxRedirections < 0)) {
      throw new InvalidArgumentError('maxRedirections must be a positive number')
    }

    util.validateHandler(handler, opts.method, opts.upgrade)

    this.dispatch = dispatch
    this.location = null
    this.abort = null
    this.opts = { ...opts, maxRedirections: 0 } // opts must be a copy
    this.maxRedirections = maxRedirections
    this.handler = handler
    this.history = []

    if (util.isStream(this.opts.body)) {
      // TODO (fix): Provide some way for the user to cache the file to e.g. /tmp
      // so that it can be dispatched again?
      // TODO (fix): Do we need 100-expect support to provide a way to do this properly?
      if (util.bodyLength(this.opts.body) === 0) {
        this.opts.body
          .on('data', function () {
            assert(false)
          })
      }

      if (typeof this.opts.body.readableDidRead !== 'boolean') {
        this.opts.body[kBodyUsed] = false
        EE.prototype.on.call(this.opts.body, 'data', function () {
          this[kBodyUsed] = true
        })
      }
    } else if (this.opts.body && typeof this.opts.body.pipeTo === 'function') {
      // TODO (fix): We can't access ReadableStream internal state
      // to determine whether or not it has been disturbed. This is just
      // a workaround.
      this.opts.body = new BodyAsyncIterable(this.opts.body)
    } else if (
      this.opts.body &&
      typeof this.opts.body !== 'string' &&
      !ArrayBuffer.isView(this.opts.body) &&
      util.isIterable(this.opts.body)
    ) {
      // TODO: Should we allow re-using iterable if !this.opts.idempotent
      // or through some other flag?
      this.opts.body = new BodyAsyncIterable(this.opts.body)
    }
  }

  onConnect (abort) {
    this.abort = abort
    this.handler.onConnect(abort, { history: this.history })
  }

  onUpgrade (statusCode, headers, socket) {
    this.handler.onUpgrade(statusCode, headers, socket)
  }

  onError (error) {
    this.handler.onError(error)
  }

  onHeaders (statusCode, headers, resume, statusText) {
    this.location = this.history.length >= this.maxRedirections || util.isDisturbed(this.opts.body)
      ? null
      : parseLocation(statusCode, headers)

    if (this.opts.origin) {
      this.history.push(new URL(this.opts.path, this.opts.origin))
    }

    if (!this.location) {
      return this.handler.onHeaders(statusCode, headers, resume, statusText)
    }

    const { origin, pathname, search } = util.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin)))
    const path = search ? `${pathname}${search}` : pathname

    // Remove headers referring to the original URL.
    // By default it is Host only, unless it's a 303 (see below), which removes also all Content-* headers.
    // https://tools.ietf.org/html/rfc7231#section-6.4
    this.opts.headers = cleanRequestHeaders(this.opts.headers, statusCode === 303, this.opts.origin !== origin)
    this.opts.path = path
    this.opts.origin = origin
    this.opts.maxRedirections = 0
    this.opts.query = null

    // https://tools.ietf.org/html/rfc7231#section-6.4.4
    // In case of HTTP 303, always replace method to be either HEAD or GET
    if (statusCode === 303 && this.opts.method !== 'HEAD') {
      this.opts.method = 'GET'
      this.opts.body = null
    }
  }

  onData (chunk) {
    if (this.location) {
      /*
        https://tools.ietf.org/html/rfc7231#section-6.4

        TLDR: undici always ignores 3xx response bodies.

        Redirection is used to serve the requested resource from another URL, so it is assumes that
        no body is generated (and thus can be ignored). Even though generating a body is not prohibited.

        For status 301, 302, 303, 307 and 308 (the latter from RFC 7238), the specs mention that the body usually
        (which means it's optional and not mandated) contain just an hyperlink to the value of
        the Location response header, so the body can be ignored safely.

        For status 300, which is "Multiple Choices", the spec mentions both generating a Location
        response header AND a response body with the other possible location to follow.
        Since the spec explicitily chooses not to specify a format for such body and leave it to
        servers and browsers implementors, we ignore the body as there is no specified way to eventually parse it.
      */
    } else {
      return this.handler.onData(chunk)
    }
  }

  onComplete (trailers) {
    if (this.location) {
      /*
        https://tools.ietf.org/html/rfc7231#section-6.4

        TLDR: undici always ignores 3xx response trailers as they are not expected in case of redirections
        and neither are useful if present.

        See comment on onData method above for more detailed informations.
      */

      this.location = null
      this.abort = null

      this.dispatch(this.opts, this)
    } else {
      this.handler.onComplete(trailers)
    }
  }

  onBodySent (chunk) {
    if (this.handler.onBodySent) {
      this.handler.onBodySent(chunk)
    }
  }
}

function parseLocation (statusCode, headers) {
  if (redirectableStatusCodes.indexOf(statusCode) === -1) {
    return null
  }

  for (let i = 0; i < headers.length; i += 2) {
    if (headers[i].toString().toLowerCase() === 'location') {
      return headers[i + 1]
    }
  }
}

// https://tools.ietf.org/html/rfc7231#section-6.4.4
function shouldRemoveHeader (header, removeContent, unknownOrigin) {
  if (header.length === 4) {
    return util.headerNameToString(header) === 'host'
  }
  if (removeContent && util.headerNameToString(header).startsWith('content-')) {
    return true
  }
  if (unknownOrigin && (header.length === 13 || header.length === 6 || header.length === 19)) {
    const name = util.headerNameToString(header)
    return name === 'authorization' || name === 'cookie' || name === 'proxy-authorization'
  }
  return false
}

// https://tools.ietf.org/html/rfc7231#section-6.4
function cleanRequestHeaders (headers, removeContent, unknownOrigin) {
  const ret = []
  if (Array.isArray(headers)) {
    for (let i = 0; i < headers.length; i += 2) {
      if (!shouldRemoveHeader(headers[i], removeContent, unknownOrigin)) {
        ret.push(headers[i], headers[i + 1])
      }
    }
  } else if (headers && typeof headers === 'object') {
    for (const key of Object.keys(headers)) {
      if (!shouldRemoveHeader(key, removeContent, unknownOrigin)) {
        ret.push(key, headers[key])
      }
    }
  } else {
    assert(headers == null, 'headers must be an object or an array')
  }
  return ret
}

module.exports = RedirectHandler


/***/ }),

/***/ 2286:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const assert = __nccwpck_require__(9491)

const { kRetryHandlerDefaultRetry } = __nccwpck_require__(2785)
const { RequestRetryError } = __nccwpck_require__(8045)
const { isDisturbed, parseHeaders, parseRangeHeader } = __nccwpck_require__(3983)

function calculateRetryAfterHeader (retryAfter) {
  const current = Date.now()
  const diff = new Date(retryAfter).getTime() - current

  return diff
}

class RetryHandler {
  constructor (opts, handlers) {
    const { retryOptions, ...dispatchOpts } = opts
    const {
      // Retry scoped
      retry: retryFn,
      maxRetries,
      maxTimeout,
      minTimeout,
      timeoutFactor,
      // Response scoped
      methods,
      errorCodes,
      retryAfter,
      statusCodes
    } = retryOptions ?? {}

    this.dispatch = handlers.dispatch
    this.handler = handlers.handler
    this.opts = dispatchOpts
    this.abort = null
    this.aborted = false
    this.retryOpts = {
      retry: retryFn ?? RetryHandler[kRetryHandlerDefaultRetry],
      retryAfter: retryAfter ?? true,
      maxTimeout: maxTimeout ?? 30 * 1000, // 30s,
      timeout: minTimeout ?? 500, // .5s
      timeoutFactor: timeoutFactor ?? 2,
      maxRetries: maxRetries ?? 5,
      // What errors we should retry
      methods: methods ?? ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE', 'TRACE'],
      // Indicates which errors to retry
      statusCodes: statusCodes ?? [500, 502, 503, 504, 429],
      // List of errors to retry
      errorCodes: errorCodes ?? [
        'ECONNRESET',
        'ECONNREFUSED',
        'ENOTFOUND',
        'ENETDOWN',
        'ENETUNREACH',
        'EHOSTDOWN',
        'EHOSTUNREACH',
        'EPIPE'
      ]
    }

    this.retryCount = 0
    this.start = 0
    this.end = null
    this.etag = null
    this.resume = null

    // Handle possible onConnect duplication
    this.handler.onConnect(reason => {
      this.aborted = true
      if (this.abort) {
        this.abort(reason)
      } else {
        this.reason = reason
      }
    })
  }

  onRequestSent () {
    if (this.handler.onRequestSent) {
      this.handler.onRequestSent()
    }
  }

  onUpgrade (statusCode, headers, socket) {
    if (this.handler.onUpgrade) {
      this.handler.onUpgrade(statusCode, headers, socket)
    }
  }

  onConnect (abort) {
    if (this.aborted) {
      abort(this.reason)
    } else {
      this.abort = abort
    }
  }

  onBodySent (chunk) {
    if (this.handler.onBodySent) return this.handler.onBodySent(chunk)
  }

  static [kRetryHandlerDefaultRetry] (err, { state, opts }, cb) {
    const { statusCode, code, headers } = err
    const { method, retryOptions } = opts
    const {
      maxRetries,
      timeout,
      maxTimeout,
      timeoutFactor,
      statusCodes,
      errorCodes,
      methods
    } = retryOptions
    let { counter, currentTimeout } = state

    currentTimeout =
      currentTimeout != null && currentTimeout > 0 ? currentTimeout : timeout

    // Any code that is not a Undici's originated and allowed to retry
    if (
      code &&
      code !== 'UND_ERR_REQ_RETRY' &&
      code !== 'UND_ERR_SOCKET' &&
      !errorCodes.includes(code)
    ) {
      cb(err)
      return
    }

    // If a set of method are provided and the current method is not in the list
    if (Array.isArray(methods) && !methods.includes(method)) {
      cb(err)
      return
    }

    // If a set of status code are provided and the current status code is not in the list
    if (
      statusCode != null &&
      Array.isArray(statusCodes) &&
      !statusCodes.includes(statusCode)
    ) {
      cb(err)
      return
    }

    // If we reached the max number of retries
    if (counter > maxRetries) {
      cb(err)
      return
    }

    let retryAfterHeader = headers != null && headers['retry-after']
    if (retryAfterHeader) {
      retryAfterHeader = Number(retryAfterHeader)
      retryAfterHeader = isNaN(retryAfterHeader)
        ? calculateRetryAfterHeader(retryAfterHeader)
        : retryAfterHeader * 1e3 // Retry-After is in seconds
    }

    const retryTimeout =
      retryAfterHeader > 0
        ? Math.min(retryAfterHeader, maxTimeout)
        : Math.min(currentTimeout * timeoutFactor ** counter, maxTimeout)

    state.currentTimeout = retryTimeout

    setTimeout(() => cb(null), retryTimeout)
  }

  onHeaders (statusCode, rawHeaders, resume, statusMessage) {
    const headers = parseHeaders(rawHeaders)

    this.retryCount += 1

    if (statusCode >= 300) {
      this.abort(
        new RequestRetryError('Request failed', statusCode, {
          headers,
          count: this.retryCount
        })
      )
      return false
    }

    // Checkpoint for resume from where we left it
    if (this.resume != null) {
      this.resume = null

      if (statusCode !== 206) {
        return true
      }

      const contentRange = parseRangeHeader(headers['content-range'])
      // If no content range
      if (!contentRange) {
        this.abort(
          new RequestRetryError('Content-Range mismatch', statusCode, {
            headers,
            count: this.retryCount
          })
        )
        return false
      }

      // Let's start with a weak etag check
      if (this.etag != null && this.etag !== headers.etag) {
        this.abort(
          new RequestRetryError('ETag mismatch', statusCode, {
            headers,
            count: this.retryCount
          })
        )
        return false
      }

      const { start, size, end = size } = contentRange

      assert(this.start === start, 'content-range mismatch')
      assert(this.end == null || this.end === end, 'content-range mismatch')

      this.resume = resume
      return true
    }

    if (this.end == null) {
      if (statusCode === 206) {
        // First time we receive 206
        const range = parseRangeHeader(headers['content-range'])

        if (range == null) {
          return this.handler.onHeaders(
            statusCode,
            rawHeaders,
            resume,
            statusMessage
          )
        }

        const { start, size, end = size } = range

        assert(
          start != null && Number.isFinite(start) && this.start !== start,
          'content-range mismatch'
        )
        assert(Number.isFinite(start))
        assert(
          end != null && Number.isFinite(end) && this.end !== end,
          'invalid content-length'
        )

        this.start = start
        this.end = end
      }

      // We make our best to checkpoint the body for further range headers
      if (this.end == null) {
        const contentLength = headers['content-length']
        this.end = contentLength != null ? Number(contentLength) : null
      }

      assert(Number.isFinite(this.start))
      assert(
        this.end == null || Number.isFinite(this.end),
        'invalid content-length'
      )

      this.resume = resume
      this.etag = headers.etag != null ? headers.etag : null

      return this.handler.onHeaders(
        statusCode,
        rawHeaders,
        resume,
        statusMessage
      )
    }

    const err = new RequestRetryError('Request failed', statusCode, {
      headers,
      count: this.retryCount
    })

    this.abort(err)

    return false
  }

  onData (chunk) {
    this.start += chunk.length

    return this.handler.onData(chunk)
  }

  onComplete (rawTrailers) {
    this.retryCount = 0
    return this.handler.onComplete(rawTrailers)
  }

  onError (err) {
    if (this.aborted || isDisturbed(this.opts.body)) {
      return this.handler.onError(err)
    }

    this.retryOpts.retry(
      err,
      {
        state: { counter: this.retryCount++, currentTimeout: this.retryAfter },
        opts: { retryOptions: this.retryOpts, ...this.opts }
      },
      onRetry.bind(this)
    )

    function onRetry (err) {
      if (err != null || this.aborted || isDisturbed(this.opts.body)) {
        return this.handler.onError(err)
      }

      if (this.start !== 0) {
        this.opts = {
          ...this.opts,
          headers: {
            ...this.opts.headers,
            range: `bytes=${this.start}-${this.end ?? ''}`
          }
        }
      }

      try {
        this.dispatch(this.opts, this)
      } catch (err) {
        this.handler.onError(err)
      }
    }
  }
}

module.exports = RetryHandler


/***/ }),

/***/ 8861:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const RedirectHandler = __nccwpck_require__(2860)

function createRedirectInterceptor ({ maxRedirections: defaultMaxRedirections }) {
  return (dispatch) => {
    return function Intercept (opts, handler) {
      const { maxRedirections = defaultMaxRedirections } = opts

      if (!maxRedirections) {
        return dispatch(opts, handler)
      }

      const redirectHandler = new RedirectHandler(dispatch, maxRedirections, opts, handler)
      opts = { ...opts, maxRedirections: 0 } // Stop sub dispatcher from also redirecting.
      return dispatch(opts, redirectHandler)
    }
  }
}

module.exports = createRedirectInterceptor


/***/ }),

/***/ 953:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SPECIAL_HEADERS = exports.HEADER_STATE = exports.MINOR = exports.MAJOR = exports.CONNECTION_TOKEN_CHARS = exports.HEADER_CHARS = exports.TOKEN = exports.STRICT_TOKEN = exports.HEX = exports.URL_CHAR = exports.STRICT_URL_CHAR = exports.USERINFO_CHARS = exports.MARK = exports.ALPHANUM = exports.NUM = exports.HEX_MAP = exports.NUM_MAP = exports.ALPHA = exports.FINISH = exports.H_METHOD_MAP = exports.METHOD_MAP = exports.METHODS_RTSP = exports.METHODS_ICE = exports.METHODS_HTTP = exports.METHODS = exports.LENIENT_FLAGS = exports.FLAGS = exports.TYPE = exports.ERROR = void 0;
const utils_1 = __nccwpck_require__(1891);
// C headers
var ERROR;
(function (ERROR) {
    ERROR[ERROR["OK"] = 0] = "OK";
    ERROR[ERROR["INTERNAL"] = 1] = "INTERNAL";
    ERROR[ERROR["STRICT"] = 2] = "STRICT";
    ERROR[ERROR["LF_EXPECTED"] = 3] = "LF_EXPECTED";
    ERROR[ERROR["UNEXPECTED_CONTENT_LENGTH"] = 4] = "UNEXPECTED_CONTENT_LENGTH";
    ERROR[ERROR["CLOSED_CONNECTION"] = 5] = "CLOSED_CONNECTION";
    ERROR[ERROR["INVALID_METHOD"] = 6] = "INVALID_METHOD";
    ERROR[ERROR["INVALID_URL"] = 7] = "INVALID_URL";
    ERROR[ERROR["INVALID_CONSTANT"] = 8] = "INVALID_CONSTANT";
    ERROR[ERROR["INVALID_VERSION"] = 9] = "INVALID_VERSION";
    ERROR[ERROR["INVALID_HEADER_TOKEN"] = 10] = "INVALID_HEADER_TOKEN";
    ERROR[ERROR["INVALID_CONTENT_LENGTH"] = 11] = "INVALID_CONTENT_LENGTH";
    ERROR[ERROR["INVALID_CHUNK_SIZE"] = 12] = "INVALID_CHUNK_SIZE";
    ERROR[ERROR["INVALID_STATUS"] = 13] = "INVALID_STATUS";
    ERROR[ERROR["INVALID_EOF_STATE"] = 14] = "INVALID_EOF_STATE";
    ERROR[ERROR["INVALID_TRANSFER_ENCODING"] = 15] = "INVALID_TRANSFER_ENCODING";
    ERROR[ERROR["CB_MESSAGE_BEGIN"] = 16] = "CB_MESSAGE_BEGIN";
    ERROR[ERROR["CB_HEADERS_COMPLETE"] = 17] = "CB_HEADERS_COMPLETE";
    ERROR[ERROR["CB_MESSAGE_COMPLETE"] = 18] = "CB_MESSAGE_COMPLETE";
    ERROR[ERROR["CB_CHUNK_HEADER"] = 19] = "CB_CHUNK_HEADER";
    ERROR[ERROR["CB_CHUNK_COMPLETE"] = 20] = "CB_CHUNK_COMPLETE";
    ERROR[ERROR["PAUSED"] = 21] = "PAUSED";
    ERROR[ERROR["PAUSED_UPGRADE"] = 22] = "PAUSED_UPGRADE";
    ERROR[ERROR["PAUSED_H2_UPGRADE"] = 23] = "PAUSED_H2_UPGRADE";
    ERROR[ERROR["USER"] = 24] = "USER";
})(ERROR = exports.ERROR || (exports.ERROR = {}));
var TYPE;
(function (TYPE) {
    TYPE[TYPE["BOTH"] = 0] = "BOTH";
    TYPE[TYPE["REQUEST"] = 1] = "REQUEST";
    TYPE[TYPE["RESPONSE"] = 2] = "RESPONSE";
})(TYPE = exports.TYPE || (exports.TYPE = {}));
var FLAGS;
(function (FLAGS) {
    FLAGS[FLAGS["CONNECTION_KEEP_ALIVE"] = 1] = "CONNECTION_KEEP_ALIVE";
    FLAGS[FLAGS["CONNECTION_CLOSE"] = 2] = "CONNECTION_CLOSE";
    FLAGS[FLAGS["CONNECTION_UPGRADE"] = 4] = "CONNECTION_UPGRADE";
    FLAGS[FLAGS["CHUNKED"] = 8] = "CHUNKED";
    FLAGS[FLAGS["UPGRADE"] = 16] = "UPGRADE";
    FLAGS[FLAGS["CONTENT_LENGTH"] = 32] = "CONTENT_LENGTH";
    FLAGS[FLAGS["SKIPBODY"] = 64] = "SKIPBODY";
    FLAGS[FLAGS["TRAILING"] = 128] = "TRAILING";
    // 1 << 8 is unused
    FLAGS[FLAGS["TRANSFER_ENCODING"] = 512] = "TRANSFER_ENCODING";
})(FLAGS = exports.FLAGS || (exports.FLAGS = {}));
var LENIENT_FLAGS;
(function (LENIENT_FLAGS) {
    LENIENT_FLAGS[LENIENT_FLAGS["HEADERS"] = 1] = "HEADERS";
    LENIENT_FLAGS[LENIENT_FLAGS["CHUNKED_LENGTH"] = 2] = "CHUNKED_LENGTH";
    LENIENT_FLAGS[LENIENT_FLAGS["KEEP_ALIVE"] = 4] = "KEEP_ALIVE";
})(LENIENT_FLAGS = exports.LENIENT_FLAGS || (exports.LENIENT_FLAGS = {}));
var METHODS;
(function (METHODS) {
    METHODS[METHODS["DELETE"] = 0] = "DELETE";
    METHODS[METHODS["GET"] = 1] = "GET";
    METHODS[METHODS["HEAD"] = 2] = "HEAD";
    METHODS[METHODS["POST"] = 3] = "POST";
    METHODS[METHODS["PUT"] = 4] = "PUT";
    /* pathological */
    METHODS[METHODS["CONNECT"] = 5] = "CONNECT";
    METHODS[METHODS["OPTIONS"] = 6] = "OPTIONS";
    METHODS[METHODS["TRACE"] = 7] = "TRACE";
    /* WebDAV */
    METHODS[METHODS["COPY"] = 8] = "COPY";
    METHODS[METHODS["LOCK"] = 9] = "LOCK";
    METHODS[METHODS["MKCOL"] = 10] = "MKCOL";
    METHODS[METHODS["MOVE"] = 11] = "MOVE";
    METHODS[METHODS["PROPFIND"] = 12] = "PROPFIND";
    METHODS[METHODS["PROPPATCH"] = 13] = "PROPPATCH";
    METHODS[METHODS["SEARCH"] = 14] = "SEARCH";
    METHODS[METHODS["UNLOCK"] = 15] = "UNLOCK";
    METHODS[METHODS["BIND"] = 16] = "BIND";
    METHODS[METHODS["REBIND"] = 17] = "REBIND";
    METHODS[METHODS["UNBIND"] = 18] = "UNBIND";
    METHODS[METHODS["ACL"] = 19] = "ACL";
    /* subversion */
    METHODS[METHODS["REPORT"] = 20] = "REPORT";
    METHODS[METHODS["MKACTIVITY"] = 21] = "MKACTIVITY";
    METHODS[METHODS["CHECKOUT"] = 22] = "CHECKOUT";
    METHODS[METHODS["MERGE"] = 23] = "MERGE";
    /* upnp */
    METHODS[METHODS["M-SEARCH"] = 24] = "M-SEARCH";
    METHODS[METHODS["NOTIFY"] = 25] = "NOTIFY";
    METHODS[METHODS["SUBSCRIBE"] = 26] = "SUBSCRIBE";
    METHODS[METHODS["UNSUBSCRIBE"] = 27] = "UNSUBSCRIBE";
    /* RFC-5789 */
    METHODS[METHODS["PATCH"] = 28] = "PATCH";
    METHODS[METHODS["PURGE"] = 29] = "PURGE";
    /* CalDAV */
    METHODS[METHODS["MKCALENDAR"] = 30] = "MKCALENDAR";
    /* RFC-2068, section 19.6.1.2 */
    METHODS[METHODS["LINK"] = 31] = "LINK";
    METHODS[METHODS["UNLINK"] = 32] = "UNLINK";
    /* icecast */
    METHODS[METHODS["SOURCE"] = 33] = "SOURCE";
    /* RFC-7540, section 11.6 */
    METHODS[METHODS["PRI"] = 34] = "PRI";
    /* RFC-2326 RTSP */
    METHODS[METHODS["DESCRIBE"] = 35] = "DESCRIBE";
    METHODS[METHODS["ANNOUNCE"] = 36] = "ANNOUNCE";
    METHODS[METHODS["SETUP"] = 37] = "SETUP";
    METHODS[METHODS["PLAY"] = 38] = "PLAY";
    METHODS[METHODS["PAUSE"] = 39] = "PAUSE";
    METHODS[METHODS["TEARDOWN"] = 40] = "TEARDOWN";
    METHODS[METHODS["GET_PARAMETER"] = 41] = "GET_PARAMETER";
    METHODS[METHODS["SET_PARAMETER"] = 42] = "SET_PARAMETER";
    METHODS[METHODS["REDIRECT"] = 43] = "REDIRECT";
    METHODS[METHODS["RECORD"] = 44] = "RECORD";
    /* RAOP */
    METHODS[METHODS["FLUSH"] = 45] = "FLUSH";
})(METHODS = exports.METHODS || (exports.METHODS = {}));
exports.METHODS_HTTP = [
    METHODS.DELETE,
    METHODS.GET,
    METHODS.HEAD,
    METHODS.POST,
    METHODS.PUT,
    METHODS.CONNECT,
    METHODS.OPTIONS,
    METHODS.TRACE,
    METHODS.COPY,
    METHODS.LOCK,
    METHODS.MKCOL,
    METHODS.MOVE,
    METHODS.PROPFIND,
    METHODS.PROPPATCH,
    METHODS.SEARCH,
    METHODS.UNLOCK,
    METHODS.BIND,
    METHODS.REBIND,
    METHODS.UNBIND,
    METHODS.ACL,
    METHODS.REPORT,
    METHODS.MKACTIVITY,
    METHODS.CHECKOUT,
    METHODS.MERGE,
    METHODS['M-SEARCH'],
    METHODS.NOTIFY,
    METHODS.SUBSCRIBE,
    METHODS.UNSUBSCRIBE,
    METHODS.PATCH,
    METHODS.PURGE,
    METHODS.MKCALENDAR,
    METHODS.LINK,
    METHODS.UNLINK,
    METHODS.PRI,
    // TODO(indutny): should we allow it with HTTP?
    METHODS.SOURCE,
];
exports.METHODS_ICE = [
    METHODS.SOURCE,
];
exports.METHODS_RTSP = [
    METHODS.OPTIONS,
    METHODS.DESCRIBE,
    METHODS.ANNOUNCE,
    METHODS.SETUP,
    METHODS.PLAY,
    METHODS.PAUSE,
    METHODS.TEARDOWN,
    METHODS.GET_PARAMETER,
    METHODS.SET_PARAMETER,
    METHODS.REDIRECT,
    METHODS.RECORD,
    METHODS.FLUSH,
    // For AirPlay
    METHODS.GET,
    METHODS.POST,
];
exports.METHOD_MAP = utils_1.enumToMap(METHODS);
exports.H_METHOD_MAP = {};
Object.keys(exports.METHOD_MAP).forEach((key) => {
    if (/^H/.test(key)) {
        exports.H_METHOD_MAP[key] = exports.METHOD_MAP[key];
    }
});
var FINISH;
(function (FINISH) {
    FINISH[FINISH["SAFE"] = 0] = "SAFE";
    FINISH[FINISH["SAFE_WITH_CB"] = 1] = "SAFE_WITH_CB";
    FINISH[FINISH["UNSAFE"] = 2] = "UNSAFE";
})(FINISH = exports.FINISH || (exports.FINISH = {}));
exports.ALPHA = [];
for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
    // Upper case
    exports.ALPHA.push(String.fromCharCode(i));
    // Lower case
    exports.ALPHA.push(String.fromCharCode(i + 0x20));
}
exports.NUM_MAP = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
    5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
};
exports.HEX_MAP = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
    5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
    A: 0XA, B: 0XB, C: 0XC, D: 0XD, E: 0XE, F: 0XF,
    a: 0xa, b: 0xb, c: 0xc, d: 0xd, e: 0xe, f: 0xf,
};
exports.NUM = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
];
exports.ALPHANUM = exports.ALPHA.concat(exports.NUM);
exports.MARK = ['-', '_', '.', '!', '~', '*', '\'', '(', ')'];
exports.USERINFO_CHARS = exports.ALPHANUM
    .concat(exports.MARK)
    .concat(['%', ';', ':', '&', '=', '+', '$', ',']);
// TODO(indutny): use RFC
exports.STRICT_URL_CHAR = [
    '!', '"', '$', '%', '&', '\'',
    '(', ')', '*', '+', ',', '-', '.', '/',
    ':', ';', '<', '=', '>',
    '@', '[', '\\', ']', '^', '_',
    '`',
    '{', '|', '}', '~',
].concat(exports.ALPHANUM);
exports.URL_CHAR = exports.STRICT_URL_CHAR
    .concat(['\t', '\f']);
// All characters with 0x80 bit set to 1
for (let i = 0x80; i <= 0xff; i++) {
    exports.URL_CHAR.push(i);
}
exports.HEX = exports.NUM.concat(['a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F']);
/* Tokens as defined by rfc 2616. Also lowercases them.
 *        token       = 1*<any CHAR except CTLs or separators>
 *     separators     = "(" | ")" | "<" | ">" | "@"
 *                    | "," | ";" | ":" | "\" | <">
 *                    | "/" | "[" | "]" | "?" | "="
 *                    | "{" | "}" | SP | HT
 */
exports.STRICT_TOKEN = [
    '!', '#', '$', '%', '&', '\'',
    '*', '+', '-', '.',
    '^', '_', '`',
    '|', '~',
].concat(exports.ALPHANUM);
exports.TOKEN = exports.STRICT_TOKEN.concat([' ']);
/*
 * Verify that a char is a valid visible (printable) US-ASCII
 * character or %x80-FF
 */
exports.HEADER_CHARS = ['\t'];
for (let i = 32; i <= 255; i++) {
    if (i !== 127) {
        exports.HEADER_CHARS.push(i);
    }
}
// ',' = \x44
exports.CONNECTION_TOKEN_CHARS = exports.HEADER_CHARS.filter((c) => c !== 44);
exports.MAJOR = exports.NUM_MAP;
exports.MINOR = exports.MAJOR;
var HEADER_STATE;
(function (HEADER_STATE) {
    HEADER_STATE[HEADER_STATE["GENERAL"] = 0] = "GENERAL";
    HEADER_STATE[HEADER_STATE["CONNECTION"] = 1] = "CONNECTION";
    HEADER_STATE[HEADER_STATE["CONTENT_LENGTH"] = 2] = "CONTENT_LENGTH";
    HEADER_STATE[HEADER_STATE["TRANSFER_ENCODING"] = 3] = "TRANSFER_ENCODING";
    HEADER_STATE[HEADER_STATE["UPGRADE"] = 4] = "UPGRADE";
    HEADER_STATE[HEADER_STATE["CONNECTION_KEEP_ALIVE"] = 5] = "CONNECTION_KEEP_ALIVE";
    HEADER_STATE[HEADER_STATE["CONNECTION_CLOSE"] = 6] = "CONNECTION_CLOSE";
    HEADER_STATE[HEADER_STATE["CONNECTION_UPGRADE"] = 7] = "CONNECTION_UPGRADE";
    HEADER_STATE[HEADER_STATE["TRANSFER_ENCODING_CHUNKED"] = 8] = "TRANSFER_ENCODING_CHUNKED";
})(HEADER_STATE = exports.HEADER_STATE || (exports.HEADER_STATE = {}));
exports.SPECIAL_HEADERS = {
    'connection': HEADER_STATE.CONNECTION,
    'content-length': HEADER_STATE.CONTENT_LENGTH,
    'proxy-connection': HEADER_STATE.CONNECTION,
    'transfer-encoding': HEADER_STATE.TRANSFER_ENCODING,
    'upgrade': HEADER_STATE.UPGRADE,
};
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 1145:
/***/ ((module) => {

module.exports = 'AGFzbQEAAAABMAhgAX8Bf2ADf39/AX9gBH9/f38Bf2AAAGADf39/AGABfwBgAn9/AGAGf39/f39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQACA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAA0ZFAwMEAAAFAAAAAAAABQEFAAUFBQAABgAAAAAGBgYGAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAABAQcAAAUFAwABBAUBcAESEgUDAQACBggBfwFBgNQECwfRBSIGbWVtb3J5AgALX2luaXRpYWxpemUACRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQALbGxodHRwX2luaXQAChhsbGh0dHBfc2hvdWxkX2tlZXBfYWxpdmUAQQxsbGh0dHBfYWxsb2MADAZtYWxsb2MARgtsbGh0dHBfZnJlZQANBGZyZWUASA9sbGh0dHBfZ2V0X3R5cGUADhVsbGh0dHBfZ2V0X2h0dHBfbWFqb3IADxVsbGh0dHBfZ2V0X2h0dHBfbWlub3IAEBFsbGh0dHBfZ2V0X21ldGhvZAARFmxsaHR0cF9nZXRfc3RhdHVzX2NvZGUAEhJsbGh0dHBfZ2V0X3VwZ3JhZGUAEwxsbGh0dHBfcmVzZXQAFA5sbGh0dHBfZXhlY3V0ZQAVFGxsaHR0cF9zZXR0aW5nc19pbml0ABYNbGxodHRwX2ZpbmlzaAAXDGxsaHR0cF9wYXVzZQAYDWxsaHR0cF9yZXN1bWUAGRtsbGh0dHBfcmVzdW1lX2FmdGVyX3VwZ3JhZGUAGhBsbGh0dHBfZ2V0X2Vycm5vABsXbGxodHRwX2dldF9lcnJvcl9yZWFzb24AHBdsbGh0dHBfc2V0X2Vycm9yX3JlYXNvbgAdFGxsaHR0cF9nZXRfZXJyb3JfcG9zAB4RbGxodHRwX2Vycm5vX25hbWUAHxJsbGh0dHBfbWV0aG9kX25hbWUAIBJs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ADcDACAAQShqQgA3AwAgAEEgakIANwMAIABBEGpCADcDACAAQQhqQgA3AwAgAEHdATYCHEEAC3sBAX8CQCAAKAIMIgMNAAJAIAAoAgRFDQAgACABNgIECwJAIAAgASACEMSAgIAAIgMNACAAKAIMDwsgACADNgIcQQAhAyAAKAIEIgFFDQAgACABIAIgACgCCBGBgICAAAAiAUUNACAAIAI2AhQgACABNgIMIAEhAwsgAwvk8wEDDn8DfgR/I4CAgIAAQRBrIgMkgICAgAAgASEEIAEhBSABIQYgASEHIAEhCCABIQkgASEKIAEhCyABIQwgASENIAEhDiABIQ8CQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACgCHCIQQX9qDt0B2gEB2QECAwQFBgcICQoLDA0O2AEPENcBERLWARMUFRYXGBkaG+AB3wEcHR7VAR8gISIjJCXUASYnKCkqKyzTAdIBLS7RAdABLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVG2wFHSElKzwHOAUvNAUzMAU1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4ABgQGCAYMBhAGFAYYBhwGIAYkB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QAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC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FCAAIBA2AgxBACEQDLIBCyAAKAIEIRAgAEEANgIEAkAgACAQIAEQp4CAgAAiEA0AIAEhAQxNCyAAQdMANgIcIAAgATYCFCAAIBA2AgxBACEQDLEBCyAAKAIEIRAgAEEANgIEAkAgACAQIAEQp4CAgAAiEA0AIAEhAQxRCyAAQeUANgIcIAAgATYCFCAAIBA2AgxBACEQDLABCyAAQQA2AhwgACABNgIUIABBxoqAgAA2AhAgAEEHNgIMQQAhEAyvAQsgACgCBCEQIABBADYCBAJAIAAgECABEKeAgIAAIhANACABIQEMSQsgAEHSADYCHCAAIAE2AhQgACAQNgIMQQAhEAyuAQsgACgCBCEQIABBADYCBAJAIAAgECABEKeAgIAAIhANACABIQEMSQsgAEHTADYCHCAAIAE2AhQgACAQNgIMQQAhEAytAQsgACgCBCEQIABBADYCBAJAIAAgECABEKeAgIAAIhANACABIQEMTQsgAEHlADYCHCAAIAE2AhQgACAQNgIMQQAhEAysAQsgAEEANgIcIAAgATYCFCAAQdyIgIAANgIQIABBBzYCDEEAIRAMqwELIBBBP0cNASABQQFqIQELQQUhEAyQAQtBACEQIABBADYCHCAAIAE2AhQgAEH9koCAADYCECAAQQc2AgwMqAELIAAoAgQhECAAQQA2AgQCQCAAIBAgARCngICAACIQDQAgASEBDEILIABB0gA2AhwgACABNgIUIAAgEDYCDEEAIRAMpwELIAAoAgQhECAAQQA2AgQCQCAAIBAgARCngICAACIQDQAgASEBDEILIABB0wA2AhwgACABNgIUIAAgEDYCDEEAIRAMpgELIAAoAgQhECAAQQA2AgQCQCAAIBAgARCngICAACIQDQAgASEBDEYLIABB5QA2AhwgACABNgIUIAAgEDYCDEEAIRAMpQELIAAoAgQhASAAQQA2AgQCQCAAIAEgFBCngICAACIBDQAgFCEBDD8LIABB0gA2AhwgACAUNgIUIAAgATYCDEEAIRAMpAELIAAoAgQhASAAQQA2AgQCQCAAIAEgFBCngICAACIBDQAgFCEBDD8LIABB0wA2AhwgACAUNgIUIAAgATYCDEEAIRAMowELIAAoAgQhASAAQQA2AgQCQCAAIAEgFBCngICAACIBDQAgFCEBDEMLIABB5QA2AhwgACAU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YWdlX2JlZ2luYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlYCBjYWxsYmFjayBlcnJvcgBgb25fc3RhdHVzX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdmVyc2lvbl9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3VybF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX3ZhbHVlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWVzc2FnZV9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX21ldGhvZF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2hlYWRlcl9maWVsZF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lYCBjYWxsYmFjayBlcnJvcgBVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNlcnZlcgBJbnZhbGlkIGhlYWRlciB2YWx1ZSBjaGFyAEludmFsaWQgaGVhZGVyIGZpZWxkIGNoYXIAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl92ZXJzaW9uAEludmFsaWQgbWlub3IgdmVyc2lvbgBJbnZhbGlkIG1ham9yIHZlcnNpb24ARXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgdmVyc2lvbgBFeHBlY3RlZCBDUkxGIGFmdGVyIHZlcnNpb24ASW52YWxpZCBIVFRQIHZlcnNpb24ASW52YWxpZCBoZWFkZXIgdG9rZW4AU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl91cmwASW52YWxpZCBjaGFyYWN0ZXJzIGluIHVybABVbmV4cGVjdGVkIHN0YXJ0IGNoYXIgaW4gdXJsAERvdWJsZSBAIGluIHVybABFbXB0eSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXJhY3RlciBpbiBDb250ZW50LUxlbmd0aABEdXBsaWNhdGUgQ29udGVudC1MZW5ndGgASW52YWxpZCBjaGFyIGluIHVybCBwYXRoAENvbnRlbnQtTGVuZ3RoIGNhbid0IGJlIHByZXNlbnQgd2l0aCBUcmFuc2Zlci1FbmNvZGluZwBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBzaXplAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25faGVhZGVyX3ZhbHVlAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgdmFsdWUATWlzc2luZyBleHBlY3RlZCBMRiBhZnRlciBoZWFkZXIgdmFsdWUASW52YWxpZCBgVHJhbnNmZXItRW5jb2RpbmdgIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGVkIHZhbHVlAFBhdXNlZCBieSBvbl9oZWFkZXJzX2NvbXBsZXRlAEludmFsaWQgRU9GIHN0YXRlAG9uX3Jlc2V0IHBhdXNlAG9uX2NodW5rX2hlYWRlciBwYXVzZQBvbl9tZXNzYWdlX2JlZ2luIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZSBwYXVzZQBvbl9zdGF0dXNfY29tcGxldGUgcGF1c2UAb25fdmVyc2lvbl9jb21wbGV0ZSBwYXVzZQBvbl91cmxfY29tcGxldGUgcGF1c2UAb25fY2h1bmtfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX3ZhbHVlX2NvbXBsZXRlIHBhdXNlAG9uX21lc3NhZ2VfY29tcGxldGUgcGF1c2UAb25fbWV0aG9kX2NvbXBsZXRlIHBhdXNlAG9uX2hlYWRlcl9maWVsZF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19leHRlbnNpb25fbmFtZSBwYXVzZQBVbmV4cGVjdGVkIHNwYWNlIGFmdGVyIHN0YXJ0IGxpbmUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fbmFtZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIG5hbWUAUGF1c2Ugb24gQ09OTkVDVC9VcGdyYWRlAFBhdXNlIG9uIFBSSS9VcGdyYWRlAEV4cGVjdGVkIEhUVFAvMiBDb25uZWN0aW9uIFByZWZhY2UAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9tZXRob2QARXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgbWV0aG9kAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25faGVhZGVyX2ZpZWxkAFBhdXNlZABJbnZhbGlkIHdvcmQgZW5jb3VudGVyZWQASW52YWxpZCBtZXRob2QgZW5jb3VudGVyZWQAVW5leHBlY3RlZCBjaGFyIGluIHVybCBzY2hlbWEAUmVxdWVzdCBoYXMgaW52YWxpZCBgVHJhbnNmZXItRW5jb2RpbmdgAFNXSVRDSF9QUk9YWQBVU0VfUFJPWFkATUtBQ1RJVklUWQBVTlBST0NFU1NBQkxFX0VOVElUWQBDT1BZAE1PVkVEX1BFUk1BTkVOVExZAFRPT19FQVJMWQBOT1RJRlkARkFJTEVEX0RFUEVOREVOQ1kAQkFEX0dBVEVXQVkAUExBWQBQVVQAQ0hFQ0tPVVQAR0FURVdBWV9USU1FT1VUAFJFUVVFU1RfVElNRU9VVABORVRXT1JLX0NPTk5FQ1RfVElNRU9VVABDT05ORUNUSU9OX1RJTUVPVVQATE9HSU5fVElNRU9VVABORVRXT1JLX1JFQURfVElNRU9VVABQT1NUAE1JU0RJUkVDVEVEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9SRVFVRVNUAENMSUVOVF9DTE9TRURfTE9BRF9CQUxBTkNFRF9SRVFVRVNUAEJBRF9SRVFVRVNUAEhUVFBfUkVRVUVTVF9TRU5UX1RPX0hUVFBTX1BPUlQAUkVQT1JUAElNX0FfVEVBUE9UAFJFU0VUX0NPTlRFTlQATk9fQ09OVEVOVABQQVJUSUFMX0NPTlRFTlQASFBFX0lOVkFMSURfQ09OU1RBTlQASFBFX0NCX1JFU0VUAEdFVABIUEVfU1RSSUNUAENPTkZMSUNUAFRFTVBPUkFSWV9SRURJUkVDVABQRVJNQU5FTlRfUkVESVJFQ1QAQ09OTkVDVABNVUxUSV9TVEFUVVMASFBFX0lOVkFMSURfU1RBVFVTAFRPT19NQU5ZX1JFUVVFU1RTAEVBUkxZX0hJTlRTAFVOQVZBSUxBQkxFX0ZPUl9MRUdBTF9SRUFTT05TAE9QVElPTlMAU1dJVENISU5HX1BST1RPQ09MUwBWQVJJQU5UX0FMU09fTkVHT1RJQVRFUwBNVUxUSVBMRV9DSE9JQ0VTAElOVEVSTkFMX1NFUlZFUl9FUlJPUgBXRUJfU0VSVkVSX1VOS05PV05fRVJST1IAUkFJTEdVTl9FUlJPUgBJREVOVElUWV9QUk9WSURFUl9BVVRIRU5USUNBVElPTl9FUlJPUgBTU0xfQ0VSVElGSUNBVEVfRVJST1IASU5WQUxJRF9YX0ZPUldBUkRFRF9GT1IAU0VUX1BBUkFNRVRFUgBHRVRfUEFSQU1FVEVSAEhQRV9VU0VSAFNFRV9PVEhFUgBIUEVfQ0JfQ0hVTktfSEVBREVSAE1LQ0FMRU5EQVIAU0VUVVAAV0VCX1NFUlZFUl9JU19ET1dOAFRFQVJET1dOAEhQRV9DTE9TRURfQ09OTkVDVElPTgBIRVVSSVNUSUNfRVhQSVJBVElPTgBESVNDT05ORUNURURfT1BFUkFUSU9OAE5PTl9BVVRIT1JJVEFUSVZFX0lORk9STUFUSU9OAEhQRV9JTlZBTElEX1ZFUlNJT04ASFBFX0NCX01FU1NBR0VfQkVHSU4AU0lURV9JU19GUk9aRU4ASFBFX0lOVkFMSURfSEVBREVSX1RPS0VOAElOVkFMSURfVE9LRU4ARk9SQklEREVOAEVOSEFOQ0VfWU9VUl9DQUxNAEhQRV9JTlZBTElEX1VSTABCTE9DS0VEX0JZX1BBUkVOVEFMX0NPTlRST0wATUtDT0wAQUNMAEhQRV9JTlRFUk5BTABSRVFVRVNUX0hFQURFUl9GSUVMRFNfVE9PX0xBUkdFX1VOT0ZGSUNJQUwASFBFX09LAFVOTElOSwBVTkxPQ0sAUFJJAFJFVFJZX1dJVEgASFBFX0lOVkFMSURfQ09OVEVOVF9MRU5HVEgASFBFX1VORVhQRUNURURfQ09OVEVOVF9MRU5HVEgARkxVU0gAUFJPUFBBVENIAE0tU0VBUkNIAFVSSV9UT09fTE9ORwBQUk9DRVNTSU5HAE1JU0NFTExBTkVPVVNfUEVSU0lTVEVOVF9XQVJOSU5HAE1JU0NFTExBTkVPVVNfV0FSTklORwBIUEVfSU5WQUxJRF9UUkFOU0ZFUl9FTkNPRElORwBFeHBlY3RlZCBDUkxGAEhQRV9JTlZBTElEX0NIVU5LX1NJWkUATU9WRQBDT05USU5VRQBIUEVfQ0JfU1RBVFVTX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJTX0NPTVBMRVRFAEhQRV9DQl9WRVJTSU9OX0NPTVBMRVRFAEhQRV9DQl9VUkxfQ09NUExFVEUASFBFX0NCX0NIVU5LX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfVkFMVUVfQ09NUExFVEUASFBFX0NCX0NIVU5LX0VYVEVOU0lPTl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX05BTUVfQ09NUExFVEUASFBFX0NCX01FU1NBR0VfQ09NUExFVEUASFBFX0NCX01FVEhPRF9DT01QTEVURQBIUEVfQ0JfSEVBREVSX0ZJRUxEX0NPTVBMRVRFAERFTEVURQBIUEVfSU5WQUxJRF9FT0ZfU1RBVEUASU5WQUxJRF9TU0xfQ0VSVElGSUNBVEUAUEFVU0UATk9fUkVTUE9OU0UAVU5TVVBQT1JURURfTUVESUFfVFlQRQBHT05FAE5PVF9BQ0NFUFRBQkxFAFNFUlZJQ0VfVU5BVkFJTEFCTEUAUkFOR0VfTk9UX1NBVElTRklBQkxFAE9SSUdJTl9JU19VTlJFQUNIQUJMRQBSRVNQT05TRV9JU19TVEFMRQBQVVJHRQBNRVJHRQBSRVFVRVNUX0hFQURFUl9GSUVMRFNfVE9PX0xBUkdFAFJFUVVFU1RfSEVBREVSX1RPT19MQVJHRQBQQVlMT0FEX1RPT19MQVJHRQBJTlNVRkZJQ0lFTlRfU1RPUkFHRQBIUEVfUEFVU0VEX1VQR1JBREUASFBFX1BBVVNFRF9IMl9VUEdSQURFAFNPVVJDRQBBTk5PVU5DRQBUUkFDRQBIUEVfVU5FWFBFQ1RFRF9TUEFDRQBERVNDUklCRQBVTlNVQlNDUklCRQBSRUNPUkQASFBFX0lOVkFMSURfTUVUSE9EAE5PVF9GT1VORABQUk9QRklORABVTkJJTkQAUkVCSU5EAFVOQVVUSE9SSVpFRABNRVRIT0RfTk9UX0FMTE9XRUQASFRUUF9WRVJTSU9OX05PVF9TVVBQT1JURUQAQUxSRUFEWV9SRVBPUlRFRABBQ0NFUFRFRABOT1RfSU1QTEVNRU5URUQATE9PUF9ERVRFQ1RFRABIUEVfQ1JfRVhQRUNURUQASFBFX0xGX0VYUEVDVEVEAENSRUFURUQASU1fVVNFRABIUEVfUEFVU0VEAFRJTUVPVVRfT0NDVVJFRABQQVlNRU5UX1JFUVVJUkVEAFBSRUNPTkRJVElPTl9SRVFVSVJFRABQUk9YWV9BVVRIRU5USUNBVElPTl9SRVFVSVJFRABORVRXT1JLX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAExFTkdUSF9SRVFVSVJFRABTU0xfQ0VSVElGSUNBVEVfUkVRVUlSRUQAVVBHUkFERV9SRVFVSVJFRABQQUdFX0VYUElSRUQAUFJFQ09ORElUSU9OX0ZBSUxFRABFWFBFQ1RBVElPTl9GQUlMRUQAUkVWQUxJREFUSU9OX0ZBSUxFRABTU0xfSEFORFNIQUtFX0ZBSUxFRABMT0NLRUQAVFJBTlNGT1JNQVRJT05fQVBQTElFRABOT1RfTU9ESUZJRUQATk9UX0VYVEVOREVEAEJBTkRXSURUSF9MSU1JVF9FWENFRURFRABTSVRFX0lTX09WRVJMT0FERUQASEVBRABFeHBlY3RlZCBIVFRQLwAAXhMAACYTAAAwEAAA8BcAAJ0TAAAVEgAAORcAAPASAAAKEAAAdRIAAK0SAACCEwAATxQAAH8QAACgFQAAIxQAAIkSAACLFAAATRUAANQRAADPFAAAEBgAAMkWAADcFgAAwREAAOAXAAC7FAAAdBQAAHwVAADlFAAACBcAAB8QAABlFQAAoxQAACgVAAACFQAAmRUAACwQAACLGQAATw8AANQOAABqEAAAzhAAAAIXAACJDgAAbhMAABwTAABmFAAAVhcAAMETAADNEwAAbBMAAGgXAABmFwAAXxcAACITAADODwAAaQ4AANgOAABjFgAAyxMAAKoOAAAoFwAAJhcAAMUTAABdFgAA6BEAAGcTAABlEwAA8hYAAHMTAAAdFwAA+RYAAPMRAADPDgAAzhUAAAwSAACzEQAApREAAGEQAAAyFwAAuxMAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIDAgICAgIAAAICAAICAAICAgICAgICAgIABAAAAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAACAAICAgICAAACAgACAgACAgICAgICAgICAAMABAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbG9zZWVlcC1hbGl2ZQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBY2h1bmtlZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAQEBAQEAAAEBAAEBAAEBAQEBAQEBAQEAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABlY3Rpb25lbnQtbGVuZ3Rob25yb3h5LWNvbm5lY3Rpb24AAAAAAAAAAAAAAAAAAAByYW5zZmVyLWVuY29kaW5ncGdyYWRlDQoNCg0KU00NCg0KVFRQL0NFL1RTUC8AAAAAAAAAAAAAAAABAgABAwAAAAAAAAAAAAAAAAAAAAAAAAQBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAQIAAQMAAAAAAAAAAAAAAAAAAAAAAAAEAQEFAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAQAAAgAAAAAAAAAAAAAAAAAAAAAAAAMEAAAEBAQEBAQEBAQEBAUEBAQEBAQEBAQEBAQABAAGBwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAIAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOT1VOQ0VFQ0tPVVRORUNURVRFQ1JJQkVMVVNIRVRFQURTRUFSQ0hSR0VDVElWSVRZTEVOREFSVkVPVElGWVBUSU9OU0NIU0VBWVNUQVRDSEdFT1JESVJFQ1RPUlRSQ0hQQVJBTUVURVJVUkNFQlNDUklCRUFSRE9XTkFDRUlORE5LQ0tVQlNDUklCRUhUVFAvQURUUC8='


/***/ }),

/***/ 5627:
/***/ ((module) => {

module.exports = 'AGFzbQEAAAABMAhgAX8Bf2ADf39/AX9gBH9/f38Bf2AAAGADf39/AGABfwBgAn9/AGAGf39/f39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQACA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAA0ZFAwMEAAAFAAAAAAAABQEFAAUFBQAABgAAAAAGBgYGAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAABAQcAAAUFAwABBAUBcAESEgUDAQACBggBfwFBgNQECwfRBSIGbWVtb3J5AgALX2luaXRpYWxpemUACRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQALbGxodHRwX2luaXQAChhsbGh0dHBfc2hvdWxkX2tlZXBfYWxpdmUAQQxsbGh0dHBfYWxsb2MADAZtYWxsb2MARgtsbGh0dHBfZnJlZQANBGZyZWUASA9sbGh0dHBfZ2V0X3R5cGUADhVsbGh0dHBfZ2V0X2h0dHBfbWFqb3IADxVsbGh0dHBfZ2V0X2h0dHBfbWlub3IAEBFsbGh0dHBfZ2V0X21ldGhvZAARFmxsaHR0cF9nZXRfc3RhdHVzX2NvZGUAEhJsbGh0dHBfZ2V0X3VwZ3JhZGUAEwxsbGh0dHBfcmVzZXQAFA5sbGh0dHBfZXhlY3V0ZQAVFGxsaHR0cF9zZXR0aW5nc19pbml0ABYNbGxodHRwX2ZpbmlzaAAXDGxsaHR0cF9wYXVzZQAYDWxsaHR0cF9yZXN1bWUAGRtsbGh0dHBfcmVzdW1lX2FmdGVyX3VwZ3JhZGUAGhBsbGh0dHBfZ2V0X2Vycm5vABsXbGxodHRwX2dldF9lcnJvcl9yZWFzb24AHBdsbGh0dHBfc2V0X2Vycm9yX3JlYXNvbgAdFGxsaHR0cF9nZXRfZXJyb3JfcG9zAB4RbGxodHRwX2Vycm5vX25hbWUAHxJsbGh0dHBfbWV0aG9kX25hbWUAIBJs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IAH9CwMAIABBMGogAf0LAwAgAEEgaiAB/QsDACAAQd0BNgIcQQALewEBfwJAIAAoAgwiAw0AAkAgACgCBEUNACAAIAE2AgQLAkAgACABIAIQxICAgAAiAw0AIAAoAgwPCyAAIAM2AhxBACEDIAAoAgQiAUUNACAAIAEgAiAAKAIIEYGAgIAAACIBRQ0AIAAgAjYCFCAAIAE2AgwgASEDCyADC+TzAQMOfwN+BH8jgICAgABBEGsiAySAgICAACABIQQgASEFIAEhBiABIQcgASEIIAEhCSABIQogASELIAEhDCABIQ0gASEOIAEhDwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAAKAIcIhBBf2oO3QHaAQHZAQIDBAUGBwgJCgsMDQ7YAQ8Q1wEREtYBExQVFhcYGRob4AHfARwdHtUBHyAhIiMkJdQBJicoKSorLNMB0gEtLtEB0AEvMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUbbAUdISUrPAc4BS80BTMwBTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEB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QAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIBAOxwEAAQID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YWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fdmFsdWVgIGNhbGxiYWNrIGVycm9yAGBvbl9zdGF0dXNfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl92ZXJzaW9uX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdXJsX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXNzYWdlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWV0aG9kX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfZXh0ZW5zaW9uX25hbWVgIGNhbGxiYWNrIGVycm9yAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2VydmVyAEludmFsaWQgaGVhZGVyIHZhbHVlIGNoYXIASW52YWxpZCBoZWFkZXIgZmllbGQgY2hhcgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3ZlcnNpb24ASW52YWxpZCBtaW5vciB2ZXJzaW9uAEludmFsaWQgbWFqb3IgdmVyc2lvbgBFeHBlY3RlZCBzcGFjZSBhZnRlciB2ZXJzaW9uAEV4cGVjdGVkIENSTEYgYWZ0ZXIgdmVyc2lvbgBJbnZhbGlkIEhUVFAgdmVyc2lvbgBJbnZhbGlkIGhlYWRlciB0b2tlbgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3VybABJbnZhbGlkIGNoYXJhY3RlcnMgaW4gdXJsAFVuZXhwZWN0ZWQgc3RhcnQgY2hhciBpbiB1cmwARG91YmxlIEAgaW4gdXJsAEVtcHR5IENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhcmFjdGVyIGluIENvbnRlbnQtTGVuZ3RoAER1cGxpY2F0ZSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXIgaW4gdXJsIHBhdGgAQ29udGVudC1MZW5ndGggY2FuJ3QgYmUgcHJlc2VudCB3aXRoIFRyYW5zZmVyLUVuY29kaW5nAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIHNpemUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfdmFsdWUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIExGIGFmdGVyIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AgaGVhZGVyIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGUgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZWQgdmFsdWUAUGF1c2VkIGJ5IG9uX2hlYWRlcnNfY29tcGxldGUASW52YWxpZCBFT0Ygc3RhdGUAb25fcmVzZXQgcGF1c2UAb25fY2h1bmtfaGVhZGVyIHBhdXNlAG9uX21lc3NhZ2VfYmVnaW4gcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlIHBhdXNlAG9uX3N0YXR1c19jb21wbGV0ZSBwYXVzZQBvbl92ZXJzaW9uX2NvbXBsZXRlIHBhdXNlAG9uX3VybF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGUgcGF1c2UAb25fbWVzc2FnZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXRob2RfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lIHBhdXNlAFVuZXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgc3RhcnQgbGluZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgbmFtZQBQYXVzZSBvbiBDT05ORUNUL1VwZ3JhZGUAUGF1c2Ugb24gUFJJL1VwZ3JhZGUARXhwZWN0ZWQgSFRUUC8yIENvbm5lY3Rpb24gUHJlZmFjZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX21ldGhvZABFeHBlY3RlZCBzcGFjZSBhZnRlciBtZXRob2QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfZmllbGQAUGF1c2VkAEludmFsaWQgd29yZCBlbmNvdW50ZXJlZABJbnZhbGlkIG1ldGhvZCBlbmNvdW50ZXJlZABVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNjaGVtYQBSZXF1ZXN0IGhhcyBpbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AAU1dJVENIX1BST1hZAFVTRV9QUk9YWQBNS0FDVElWSVRZAFVOUFJPQ0VTU0FCTEVfRU5USVRZAENPUFkATU9WRURfUEVSTUFORU5UTFkAVE9PX0VBUkxZAE5PVElGWQBGQUlMRURfREVQRU5ERU5DWQBCQURfR0FURVdBWQBQTEFZAFBVVABDSEVDS09VVABHQVRFV0FZX1RJTUVPVVQAUkVRVUVTVF9USU1FT1VUAE5FVFdPUktfQ09OTkVDVF9USU1FT1VUAENPTk5FQ1RJT05fVElNRU9VVABMT0dJTl9USU1FT1VUAE5FVFdPUktfUkVBRF9USU1FT1VUAFBPU1QATUlTRElSRUNURURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9MT0FEX0JBTEFOQ0VEX1JFUVVFU1QAQkFEX1JFUVVFU1QASFRUUF9SRVFVRVNUX1NFTlRfVE9fSFRUUFNfUE9SVABSRVBPUlQASU1fQV9URUFQT1QAUkVTRVRfQ09OVEVOVABOT19DT05URU5UAFBBUlRJQUxfQ09OVEVOVABIUEVfSU5WQUxJRF9DT05TVEFOVABIUEVfQ0JfUkVTRVQAR0VUAEhQRV9TVFJJQ1QAQ09ORkxJQ1QAVEVNUE9SQVJZX1JFRElSRUNUAFBFUk1BTkVOVF9SRURJUkVDVABDT05ORUNUAE1VTFRJX1NUQVRVUwBIUEVfSU5WQUxJRF9TVEFUVVMAVE9PX01BTllfUkVRVUVTVFMARUFSTFlfSElOVFMAVU5BVkFJTEFCTEVfRk9SX0xFR0FMX1JFQVNPTlMAT1BUSU9OUwBTV0lUQ0hJTkdfUFJPVE9DT0xTAFZBUklBTlRfQUxTT19ORUdPVElBVEVTAE1VTFRJUExFX0NIT0lDRVMASU5URVJOQUxfU0VSVkVSX0VSUk9SAFdFQl9TRVJWRVJfVU5LTk9XTl9FUlJPUgBSQUlMR1VOX0VSUk9SAElERU5USVRZX1BST1ZJREVSX0FVVEhFTlRJQ0FUSU9OX0VSUk9SAFNTTF9DRVJUSUZJQ0FURV9FUlJPUgBJTlZBTElEX1hfRk9SV0FSREVEX0ZPUgBTRVRfUEFSQU1FVEVSAEdFVF9QQVJBTUVURVIASFBFX1VTRVIAU0VFX09USEVSAEhQRV9DQl9DSFVOS19IRUFERVIATUtDQUxFTkRBUgBTRVRVUABXRUJfU0VSVkVSX0lTX0RPV04AVEVBUkRPV04ASFBFX0NMT1NFRF9DT05ORUNUSU9OAEhFVVJJU1RJQ19FWFBJUkFUSU9OAERJU0NPTk5FQ1RFRF9PUEVSQVRJT04ATk9OX0FVVEhPUklUQVRJVkVfSU5GT1JNQVRJT04ASFBFX0lOVkFMSURfVkVSU0lPTgBIUEVfQ0JfTUVTU0FHRV9CRUdJTgBTSVRFX0lTX0ZST1pFTgBIUEVfSU5WQUxJRF9IRUFERVJfVE9LRU4ASU5WQUxJRF9UT0tFTgBGT1JCSURERU4ARU5IQU5DRV9ZT1VSX0NBTE0ASFBFX0lOVkFMSURfVVJMAEJMT0NLRURfQllfUEFSRU5UQUxfQ09OVFJPTABNS0NPTABBQ0wASFBFX0lOVEVSTkFMAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0VfVU5PRkZJQ0lBTABIUEVfT0sAVU5MSU5LAFVOTE9DSwBQUkkAUkVUUllfV0lUSABIUEVfSU5WQUxJRF9DT05URU5UX0xFTkdUSABIUEVfVU5FWFBFQ1RFRF9DT05URU5UX0xFTkdUSABGTFVTSABQUk9QUEFUQ0gATS1TRUFSQ0gAVVJJX1RPT19MT05HAFBST0NFU1NJTkcATUlTQ0VMTEFORU9VU19QRVJTSVNURU5UX1dBUk5JTkcATUlTQ0VMTEFORU9VU19XQVJOSU5HAEhQRV9JTlZBTElEX1RSQU5TRkVSX0VOQ09ESU5HAEV4cGVjdGVkIENSTEYASFBFX0lOVkFMSURfQ0hVTktfU0laRQBNT1ZFAENPTlRJTlVFAEhQRV9DQl9TVEFUVVNfQ09NUExFVEUASFBFX0NCX0hFQURFUlNfQ09NUExFVEUASFBFX0NCX1ZFUlNJT05fQ09NUExFVEUASFBFX0NCX1VSTF9DT01QTEVURQBIUEVfQ0JfQ0hVTktfQ09NUExFVEUASFBFX0NCX0hFQURFUl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fTkFNRV9DT01QTEVURQBIUEVfQ0JfTUVTU0FHRV9DT01QTEVURQBIUEVfQ0JfTUVUSE9EX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfRklFTERfQ09NUExFVEUAREVMRVRFAEhQRV9JTlZBTElEX0VPRl9TVEFURQBJTlZBTElEX1NTTF9DRVJUSUZJQ0FURQBQQVVTRQBOT19SRVNQT05TRQBVTlNVUFBPUlRFRF9NRURJQV9UWVBFAEdPTkUATk9UX0FDQ0VQVEFCTEUAU0VSVklDRV9VTkFWQUlMQUJMRQBSQU5HRV9OT1RfU0FUSVNGSUFCTEUAT1JJR0lOX0lTX1VOUkVBQ0hBQkxFAFJFU1BPTlNFX0lTX1NUQUxFAFBVUkdFAE1FUkdFAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0UAUkVRVUVTVF9IRUFERVJfVE9PX0xBUkdFAFBBWUxPQURfVE9PX0xBUkdFAElOU1VGRklDSUVOVF9TVE9SQUdFAEhQRV9QQVVTRURfVVBHUkFERQBIUEVfUEFVU0VEX0gyX1VQR1JBREUAU09VUkNFAEFOTk9VTkNFAFRSQUNFAEhQRV9VTkVYUEVDVEVEX1NQQUNFAERFU0NSSUJFAFVOU1VCU0NSSUJFAFJFQ09SRABIUEVfSU5WQUxJRF9NRVRIT0QATk9UX0ZPVU5EAFBST1BGSU5EAFVOQklORABSRUJJTkQAVU5BVVRIT1JJWkVEAE1FVEhPRF9OT1RfQUxMT1dFRABIVFRQX1ZFUlNJT05fTk9UX1NVUFBPUlRFRABBTFJFQURZX1JFUE9SVEVEAEFDQ0VQVEVEAE5PVF9JTVBMRU1FTlRFRABMT09QX0RFVEVDVEVEAEhQRV9DUl9FWFBFQ1RFRABIUEVfTEZfRVhQRUNURUQAQ1JFQVRFRABJTV9VU0VEAEhQRV9QQVVTRUQAVElNRU9VVF9PQ0NVUkVEAFBBWU1FTlRfUkVRVUlSRUQAUFJFQ09ORElUSU9OX1JFUVVJUkVEAFBST1hZX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAE5FVFdPUktfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATEVOR1RIX1JFUVVJUkVEAFNTTF9DRVJUSUZJQ0FURV9SRVFVSVJFRABVUEdSQURFX1JFUVVJUkVEAFBBR0VfRVhQSVJFRABQUkVDT05ESVRJT05fRkFJTEVEAEVYUEVDVEFUSU9OX0ZBSUxFRABSRVZBTElEQVRJT05fRkFJTEVEAFNTTF9IQU5EU0hBS0VfRkFJTEVEAExPQ0tFRABUUkFOU0ZPUk1BVElPTl9BUFBMSUVEAE5PVF9NT0RJRklFRABOT1RfRVhURU5ERUQAQkFORFdJRFRIX0xJTUlUX0VYQ0VFREVEAFNJVEVfSVNfT1ZFUkxPQURFRABIRUFEAEV4cGVjdGVkIEhUVFAvAABeEwAAJhMAADAQAADwFwAAnRMAABUSAAA5FwAA8BIAAAoQAAB1EgAArRIAAIITAABPFAAAfxAAAKAVAAAjFAAAiRIAAIsUAABNFQAA1BEAAM8UAAAQGAAAyRYAANwWAADBEQAA4BcAALsUAAB0FAAAfBUAAOUUAAAIFwAAHxAAAGUVAACjFAAAKBUAAAIVAACZFQAALBAAAIsZAABPDwAA1A4AAGoQAADOEAAAAhcAAIkOAABuEwAAHBMAAGYUAABWFwAAwRMAAM0TAABsEwAAaBcAAGYXAABfFwAAIhMAAM4PAABpDgAA2A4AAGMWAADLEwAAqg4AACgXAAAmFwAAxRMAAF0WAADoEQAAZxMAAGUTAADyFgAAcxMAAB0XAAD5FgAA8xEAAM8OAADOFQAADBIAALMRAAClEQAAYRAAADIXAAC7EwAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAgMCAgICAgAAAgIAAgIAAgICAgICAgICAgAEAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgICAgIAAAICAAICAAICAgICAgICAgIAAwAEAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsb3NlZWVwLWFsaXZlAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFjaHVua2VkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQABAQEBAQAAAQEAAQEAAQEBAQEBAQEBAQAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGVjdGlvbmVudC1sZW5ndGhvbnJveHktY29ubmVjdGlvbgAAAAAAAAAAAAAAAAAAAHJhbnNmZXItZW5jb2RpbmdwZ3JhZGUNCg0KDQpTTQ0KDQpUVFAvQ0UvVFNQLwAAAAAAAAAAAAAAAAECAAEDAAAAAAAAAAAAAAAAAAAAAAAABAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAABAgABAwAAAAAAAAAAAAAAAAAAAAAAAAQBAQUBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAABAAACAAAAAAAAAAAAAAAAAAAAAAAAAwQAAAQEBAQEBAQEBAQEBQQEBAQEBAQEBAQEBAAEAAYHBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQABAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAgAAAAACAAAAAAAAAAAAAAAAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE5PVU5DRUVDS09VVE5FQ1RFVEVDUklCRUxVU0hFVEVBRFNFQVJDSFJHRUNUSVZJVFlMRU5EQVJWRU9USUZZUFRJT05TQ0hTRUFZU1RBVENIR0VPUkRJUkVDVE9SVFJDSFBBUkFNRVRFUlVSQ0VCU0NSSUJFQVJET1dOQUNFSU5ETktDS1VCU0NSSUJFSFRUUC9BRFRQLw=='


/***/ }),

/***/ 1891:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.enumToMap = void 0;
function enumToMap(obj) {
    const res = {};
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value === 'number') {
            res[key] = value;
        }
    });
    return res;
}
exports.enumToMap = enumToMap;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 6771:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { kClients } = __nccwpck_require__(2785)
const Agent = __nccwpck_require__(7890)
const {
  kAgent,
  kMockAgentSet,
  kMockAgentGet,
  kDispatches,
  kIsMockActive,
  kNetConnect,
  kGetNetConnect,
  kOptions,
  kFactory
} = __nccwpck_require__(4347)
const MockClient = __nccwpck_require__(8687)
const MockPool = __nccwpck_require__(6193)
const { matchValue, buildMockOptions } = __nccwpck_require__(9323)
const { InvalidArgumentError, UndiciError } = __nccwpck_require__(8045)
const Dispatcher = __nccwpck_require__(412)
const Pluralizer = __nccwpck_require__(8891)
const PendingInterceptorsFormatter = __nccwpck_require__(6823)

class FakeWeakRef {
  constructor (value) {
    this.value = value
  }

  deref () {
    return this.value
  }
}

class MockAgent extends Dispatcher {
  constructor (opts) {
    super(opts)

    this[kNetConnect] = true
    this[kIsMockActive] = true

    // Instantiate Agent and encapsulate
    if ((opts && opts.agent && typeof opts.agent.dispatch !== 'function')) {
      throw new InvalidArgumentError('Argument opts.agent must implement Agent')
    }
    const agent = opts && opts.agent ? opts.agent : new Agent(opts)
    this[kAgent] = agent

    this[kClients] = agent[kClients]
    this[kOptions] = buildMockOptions(opts)
  }

  get (origin) {
    let dispatcher = this[kMockAgentGet](origin)

    if (!dispatcher) {
      dispatcher = this[kFactory](origin)
      this[kMockAgentSet](origin, dispatcher)
    }
    return dispatcher
  }

  dispatch (opts, handler) {
    // Call MockAgent.get to perform additional setup before dispatching as normal
    this.get(opts.origin)
    return this[kAgent].dispatch(opts, handler)
  }

  async close () {
    await this[kAgent].close()
    this[kClients].clear()
  }

  deactivate () {
    this[kIsMockActive] = false
  }

  activate () {
    this[kIsMockActive] = true
  }

  enableNetConnect (matcher) {
    if (typeof matcher === 'string' || typeof matcher === 'function' || matcher instanceof RegExp) {
      if (Array.isArray(this[kNetConnect])) {
        this[kNetConnect].push(matcher)
      } else {
        this[kNetConnect] = [matcher]
      }
    } else if (typeof matcher === 'undefined') {
      this[kNetConnect] = true
    } else {
      throw new InvalidArgumentError('Unsupported matcher. Must be one of String|Function|RegExp.')
    }
  }

  disableNetConnect () {
    this[kNetConnect] = false
  }

  // This is required to bypass issues caused by using global symbols - see:
  // https://github.com/nodejs/undici/issues/1447
  get isMockActive () {
    return this[kIsMockActive]
  }

  [kMockAgentSet] (origin, dispatcher) {
    this[kClients].set(origin, new FakeWeakRef(dispatcher))
  }

  [kFactory] (origin) {
    const mockOptions = Object.assign({ agent: this }, this[kOptions])
    return this[kOptions] && this[kOptions].connections === 1
      ? new MockClient(origin, mockOptions)
      : new MockPool(origin, mockOptions)
  }

  [kMockAgentGet] (origin) {
    // First check if we can immediately find it
    const ref = this[kClients].get(origin)
    if (ref) {
      return ref.deref()
    }

    // If the origin is not a string create a dummy parent pool and return to user
    if (typeof origin !== 'string') {
      const dispatcher = this[kFactory]('http://localhost:9999')
      this[kMockAgentSet](origin, dispatcher)
      return dispatcher
    }

    // If we match, create a pool and assign the same dispatches
    for (const [keyMatcher, nonExplicitRef] of Array.from(this[kClients])) {
      const nonExplicitDispatcher = nonExplicitRef.deref()
      if (nonExplicitDispatcher && typeof keyMatcher !== 'string' && matchValue(keyMatcher, origin)) {
        const dispatcher = this[kFactory](origin)
        this[kMockAgentSet](origin, dispatcher)
        dispatcher[kDispatches] = nonExplicitDispatcher[kDispatches]
        return dispatcher
      }
    }
  }

  [kGetNetConnect] () {
    return this[kNetConnect]
  }

  pendingInterceptors () {
    const mockAgentClients = this[kClients]

    return Array.from(mockAgentClients.entries())
      .flatMap(([origin, scope]) => scope.deref()[kDispatches].map(dispatch => ({ ...dispatch, origin })))
      .filter(({ pending }) => pending)
  }

  assertNoPendingInterceptors ({ pendingInterceptorsFormatter = new PendingInterceptorsFormatter() } = {}) {
    const pending = this.pendingInterceptors()

    if (pending.length === 0) {
      return
    }

    const pluralizer = new Pluralizer('interceptor', 'interceptors').pluralize(pending.length)

    throw new UndiciError(`
${pluralizer.count} ${pluralizer.noun} ${pluralizer.is} pending:

${pendingInterceptorsFormatter.format(pending)}
`.trim())
  }
}

module.exports = MockAgent


/***/ }),

/***/ 8687:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { promisify } = __nccwpck_require__(3837)
const Client = __nccwpck_require__(3598)
const { buildMockDispatch } = __nccwpck_require__(9323)
const {
  kDispatches,
  kMockAgent,
  kClose,
  kOriginalClose,
  kOrigin,
  kOriginalDispatch,
  kConnected
} = __nccwpck_require__(4347)
const { MockInterceptor } = __nccwpck_require__(410)
const Symbols = __nccwpck_require__(2785)
const { InvalidArgumentError } = __nccwpck_require__(8045)

/**
 * MockClient provides an API that extends the Client to influence the mockDispatches.
 */
class MockClient extends Client {
  constructor (origin, opts) {
    super(origin, opts)

    if (!opts || !opts.agent || typeof opts.agent.dispatch !== 'function') {
      throw new InvalidArgumentError('Argument opts.agent must implement Agent')
    }

    this[kMockAgent] = opts.agent
    this[kOrigin] = origin
    this[kDispatches] = []
    this[kConnected] = 1
    this[kOriginalDispatch] = this.dispatch
    this[kOriginalClose] = this.close.bind(this)

    this.dispatch = buildMockDispatch.call(this)
    this.close = this[kClose]
  }

  get [Symbols.kConnected] () {
    return this[kConnected]
  }

  /**
   * Sets up the base interceptor for mocking replies from undici.
   */
  intercept (opts) {
    return new MockInterceptor(opts, this[kDispatches])
  }

  async [kClose] () {
    await promisify(this[kOriginalClose])()
    this[kConnected] = 0
    this[kMockAgent][Symbols.kClients].delete(this[kOrigin])
  }
}

module.exports = MockClient


/***/ }),

/***/ 888:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { UndiciError } = __nccwpck_require__(8045)

class MockNotMatchedError extends UndiciError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, MockNotMatchedError)
    this.name = 'MockNotMatchedError'
    this.message = message || 'The request does not match any registered mock dispatches'
    this.code = 'UND_MOCK_ERR_MOCK_NOT_MATCHED'
  }
}

module.exports = {
  MockNotMatchedError
}


/***/ }),

/***/ 410:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { getResponseData, buildKey, addMockDispatch } = __nccwpck_require__(9323)
const {
  kDispatches,
  kDispatchKey,
  kDefaultHeaders,
  kDefaultTrailers,
  kContentLength,
  kMockDispatch
} = __nccwpck_require__(4347)
const { InvalidArgumentError } = __nccwpck_require__(8045)
const { buildURL } = __nccwpck_require__(3983)

/**
 * Defines the scope API for an interceptor reply
 */
class MockScope {
  constructor (mockDispatch) {
    this[kMockDispatch] = mockDispatch
  }

  /**
   * Delay a reply by a set amount in ms.
   */
  delay (waitInMs) {
    if (typeof waitInMs !== 'number' || !Number.isInteger(waitInMs) || waitInMs <= 0) {
      throw new InvalidArgumentError('waitInMs must be a valid integer > 0')
    }

    this[kMockDispatch].delay = waitInMs
    return this
  }

  /**
   * For a defined reply, never mark as consumed.
   */
  persist () {
    this[kMockDispatch].persist = true
    return this
  }

  /**
   * Allow one to define a reply for a set amount of matching requests.
   */
  times (repeatTimes) {
    if (typeof repeatTimes !== 'number' || !Number.isInteger(repeatTimes) || repeatTimes <= 0) {
      throw new InvalidArgumentError('repeatTimes must be a valid integer > 0')
    }

    this[kMockDispatch].times = repeatTimes
    return this
  }
}

/**
 * Defines an interceptor for a Mock
 */
class MockInterceptor {
  constructor (opts, mockDispatches) {
    if (typeof opts !== 'object') {
      throw new InvalidArgumentError('opts must be an object')
    }
    if (typeof opts.path === 'undefined') {
      throw new InvalidArgumentError('opts.path must be defined')
    }
    if (typeof opts.method === 'undefined') {
      opts.method = 'GET'
    }
    // See https://github.com/nodejs/undici/issues/1245
    // As per RFC 3986, clients are not supposed to send URI
    // fragments to servers when they retrieve a document,
    if (typeof opts.path === 'string') {
      if (opts.query) {
        opts.path = buildURL(opts.path, opts.query)
      } else {
        // Matches https://github.com/nodejs/undici/blob/main/lib/fetch/index.js#L1811
        const parsedURL = new URL(opts.path, 'data://')
        opts.path = parsedURL.pathname + parsedURL.search
      }
    }
    if (typeof opts.method === 'string') {
      opts.method = opts.method.toUpperCase()
    }

    this[kDispatchKey] = buildKey(opts)
    this[kDispatches] = mockDispatches
    this[kDefaultHeaders] = {}
    this[kDefaultTrailers] = {}
    this[kContentLength] = false
  }

  createMockScopeDispatchData (statusCode, data, responseOptions = {}) {
    const responseData = getResponseData(data)
    const contentLength = this[kContentLength] ? { 'content-length': responseData.length } : {}
    const headers = { ...this[kDefaultHeaders], ...contentLength, ...responseOptions.headers }
    const trailers = { ...this[kDefaultTrailers], ...responseOptions.trailers }

    return { statusCode, data, headers, trailers }
  }

  validateReplyParameters (statusCode, data, responseOptions) {
    if (typeof statusCode === 'undefined') {
      throw new InvalidArgumentError('statusCode must be defined')
    }
    if (typeof data === 'undefined') {
      throw new InvalidArgumentError('data must be defined')
    }
    if (typeof responseOptions !== 'object') {
      throw new InvalidArgumentError('responseOptions must be an object')
    }
  }

  /**
   * Mock an undici request with a defined reply.
   */
  reply (replyData) {
    // Values of reply aren't available right now as they
    // can only be available when the reply callback is invoked.
    if (typeof replyData === 'function') {
      // We'll first wrap the provided callback in another function,
      // this function will properly resolve the data from the callback
      // when invoked.
      const wrappedDefaultsCallback = (opts) => {
        // Our reply options callback contains the parameter for statusCode, data and options.
        const resolvedData = replyData(opts)

        // Check if it is in the right format
        if (typeof resolvedData !== 'object') {
          throw new InvalidArgumentError('reply options callback must return an object')
        }

        const { statusCode, data = '', responseOptions = {} } = resolvedData
        this.validateReplyParameters(statusCode, data, responseOptions)
        // Since the values can be obtained immediately we return them
        // from this higher order function that will be resolved later.
        return {
          ...this.createMockScopeDispatchData(statusCode, data, responseOptions)
        }
      }

      // Add usual dispatch data, but this time set the data parameter to function that will eventually provide data.
      const newMockDispatch = addMockDispatch(this[kDispatches], this[kDispatchKey], wrappedDefaultsCallback)
      return new MockScope(newMockDispatch)
    }

    // We can have either one or three parameters, if we get here,
    // we should have 1-3 parameters. So we spread the arguments of
    // this function to obtain the parameters, since replyData will always
    // just be the statusCode.
    const [statusCode, data = '', responseOptions = {}] = [...arguments]
    this.validateReplyParameters(statusCode, data, responseOptions)

    // Send in-already provided data like usual
    const dispatchData = this.createMockScopeDispatchData(statusCode, data, responseOptions)
    const newMockDispatch = addMockDispatch(this[kDispatches], this[kDispatchKey], dispatchData)
    return new MockScope(newMockDispatch)
  }

  /**
   * Mock an undici request with a defined error.
   */
  replyWithError (error) {
    if (typeof error === 'undefined') {
      throw new InvalidArgumentError('error must be defined')
    }

    const newMockDispatch = addMockDispatch(this[kDispatches], this[kDispatchKey], { error })
    return new MockScope(newMockDispatch)
  }

  /**
   * Set default reply headers on the interceptor for subsequent replies
   */
  defaultReplyHeaders (headers) {
    if (typeof headers === 'undefined') {
      throw new InvalidArgumentError('headers must be defined')
    }

    this[kDefaultHeaders] = headers
    return this
  }

  /**
   * Set default reply trailers on the interceptor for subsequent replies
   */
  defaultReplyTrailers (trailers) {
    if (typeof trailers === 'undefined') {
      throw new InvalidArgumentError('trailers must be defined')
    }

    this[kDefaultTrailers] = trailers
    return this
  }

  /**
   * Set reply content length header for replies on the interceptor
   */
  replyContentLength () {
    this[kContentLength] = true
    return this
  }
}

module.exports.MockInterceptor = MockInterceptor
module.exports.MockScope = MockScope


/***/ }),

/***/ 6193:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { promisify } = __nccwpck_require__(3837)
const Pool = __nccwpck_require__(4634)
const { buildMockDispatch } = __nccwpck_require__(9323)
const {
  kDispatches,
  kMockAgent,
  kClose,
  kOriginalClose,
  kOrigin,
  kOriginalDispatch,
  kConnected
} = __nccwpck_require__(4347)
const { MockInterceptor } = __nccwpck_require__(410)
const Symbols = __nccwpck_require__(2785)
const { InvalidArgumentError } = __nccwpck_require__(8045)

/**
 * MockPool provides an API that extends the Pool to influence the mockDispatches.
 */
class MockPool extends Pool {
  constructor (origin, opts) {
    super(origin, opts)

    if (!opts || !opts.agent || typeof opts.agent.dispatch !== 'function') {
      throw new InvalidArgumentError('Argument opts.agent must implement Agent')
    }

    this[kMockAgent] = opts.agent
    this[kOrigin] = origin
    this[kDispatches] = []
    this[kConnected] = 1
    this[kOriginalDispatch] = this.dispatch
    this[kOriginalClose] = this.close.bind(this)

    this.dispatch = buildMockDispatch.call(this)
    this.close = this[kClose]
  }

  get [Symbols.kConnected] () {
    return this[kConnected]
  }

  /**
   * Sets up the base interceptor for mocking replies from undici.
   */
  intercept (opts) {
    return new MockInterceptor(opts, this[kDispatches])
  }

  async [kClose] () {
    await promisify(this[kOriginalClose])()
    this[kConnected] = 0
    this[kMockAgent][Symbols.kClients].delete(this[kOrigin])
  }
}

module.exports = MockPool


/***/ }),

/***/ 4347:
/***/ ((module) => {

"use strict";


module.exports = {
  kAgent: Symbol('agent'),
  kOptions: Symbol('options'),
  kFactory: Symbol('factory'),
  kDispatches: Symbol('dispatches'),
  kDispatchKey: Symbol('dispatch key'),
  kDefaultHeaders: Symbol('default headers'),
  kDefaultTrailers: Symbol('default trailers'),
  kContentLength: Symbol('content length'),
  kMockAgent: Symbol('mock agent'),
  kMockAgentSet: Symbol('mock agent set'),
  kMockAgentGet: Symbol('mock agent get'),
  kMockDispatch: Symbol('mock dispatch'),
  kClose: Symbol('close'),
  kOriginalClose: Symbol('original agent close'),
  kOrigin: Symbol('origin'),
  kIsMockActive: Symbol('is mock active'),
  kNetConnect: Symbol('net connect'),
  kGetNetConnect: Symbol('get net connect'),
  kConnected: Symbol('connected')
}


/***/ }),

/***/ 9323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { MockNotMatchedError } = __nccwpck_require__(888)
const {
  kDispatches,
  kMockAgent,
  kOriginalDispatch,
  kOrigin,
  kGetNetConnect
} = __nccwpck_require__(4347)
const { buildURL, nop } = __nccwpck_require__(3983)
const { STATUS_CODES } = __nccwpck_require__(3685)
const {
  types: {
    isPromise
  }
} = __nccwpck_require__(3837)

function matchValue (match, value) {
  if (typeof match === 'string') {
    return match === value
  }
  if (match instanceof RegExp) {
    return match.test(value)
  }
  if (typeof match === 'function') {
    return match(value) === true
  }
  return false
}

function lowerCaseEntries (headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([headerName, headerValue]) => {
      return [headerName.toLocaleLowerCase(), headerValue]
    })
  )
}

/**
 * @param {import('../../index').Headers|string[]|Record<string, string>} headers
 * @param {string} key
 */
function getHeaderByName (headers, key) {
  if (Array.isArray(headers)) {
    for (let i = 0; i < headers.length; i += 2) {
      if (headers[i].toLocaleLowerCase() === key.toLocaleLowerCase()) {
        return headers[i + 1]
      }
    }

    return undefined
  } else if (typeof headers.get === 'function') {
    return headers.get(key)
  } else {
    return lowerCaseEntries(headers)[key.toLocaleLowerCase()]
  }
}

/** @param {string[]} headers */
function buildHeadersFromArray (headers) { // fetch HeadersList
  const clone = headers.slice()
  const entries = []
  for (let index = 0; index < clone.length; index += 2) {
    entries.push([clone[index], clone[index + 1]])
  }
  return Object.fromEntries(entries)
}

function matchHeaders (mockDispatch, headers) {
  if (typeof mockDispatch.headers === 'function') {
    if (Array.isArray(headers)) { // fetch HeadersList
      headers = buildHeadersFromArray(headers)
    }
    return mockDispatch.headers(headers ? lowerCaseEntries(headers) : {})
  }
  if (typeof mockDispatch.headers === 'undefined') {
    return true
  }
  if (typeof headers !== 'object' || typeof mockDispatch.headers !== 'object') {
    return false
  }

  for (const [matchHeaderName, matchHeaderValue] of Object.entries(mockDispatch.headers)) {
    const headerValue = getHeaderByName(headers, matchHeaderName)

    if (!matchValue(matchHeaderValue, headerValue)) {
      return false
    }
  }
  return true
}

function safeUrl (path) {
  if (typeof path !== 'string') {
    return path
  }

  const pathSegments = path.split('?')

  if (pathSegments.length !== 2) {
    return path
  }

  const qp = new URLSearchParams(pathSegments.pop())
  qp.sort()
  return [...pathSegments, qp.toString()].join('?')
}

function matchKey (mockDispatch, { path, method, body, headers }) {
  const pathMatch = matchValue(mockDispatch.path, path)
  const methodMatch = matchValue(mockDispatch.method, method)
  const bodyMatch = typeof mockDispatch.body !== 'undefined' ? matchValue(mockDispatch.body, body) : true
  const headersMatch = matchHeaders(mockDispatch, headers)
  return pathMatch && methodMatch && bodyMatch && headersMatch
}

function getResponseData (data) {
  if (Buffer.isBuffer(data)) {
    return data
  } else if (typeof data === 'object') {
    return JSON.stringify(data)
  } else {
    return data.toString()
  }
}

function getMockDispatch (mockDispatches, key) {
  const basePath = key.query ? buildURL(key.path, key.query) : key.path
  const resolvedPath = typeof basePath === 'string' ? safeUrl(basePath) : basePath

  // Match path
  let matchedMockDispatches = mockDispatches.filter(({ consumed }) => !consumed).filter(({ path }) => matchValue(safeUrl(path), resolvedPath))
  if (matchedMockDispatches.length === 0) {
    throw new MockNotMatchedError(`Mock dispatch not matched for path '${resolvedPath}'`)
  }

  // Match method
  matchedMockDispatches = matchedMockDispatches.filter(({ method }) => matchValue(method, key.method))
  if (matchedMockDispatches.length === 0) {
    throw new MockNotMatchedError(`Mock dispatch not matched for method '${key.method}'`)
  }

  // Match body
  matchedMockDispatches = matchedMockDispatches.filter(({ body }) => typeof body !== 'undefined' ? matchValue(body, key.body) : true)
  if (matchedMockDispatches.length === 0) {
    throw new MockNotMatchedError(`Mock dispatch not matched for body '${key.body}'`)
  }

  // Match headers
  matchedMockDispatches = matchedMockDispatches.filter((mockDispatch) => matchHeaders(mockDispatch, key.headers))
  if (matchedMockDispatches.length === 0) {
    throw new MockNotMatchedError(`Mock dispatch not matched for headers '${typeof key.headers === 'object' ? JSON.stringify(key.headers) : key.headers}'`)
  }

  return matchedMockDispatches[0]
}

function addMockDispatch (mockDispatches, key, data) {
  const baseData = { timesInvoked: 0, times: 1, persist: false, consumed: false }
  const replyData = typeof data === 'function' ? { callback: data } : { ...data }
  const newMockDispatch = { ...baseData, ...key, pending: true, data: { error: null, ...replyData } }
  mockDispatches.push(newMockDispatch)
  return newMockDispatch
}

function deleteMockDispatch (mockDispatches, key) {
  const index = mockDispatches.findIndex(dispatch => {
    if (!dispatch.consumed) {
      return false
    }
    return matchKey(dispatch, key)
  })
  if (index !== -1) {
    mockDispatches.splice(index, 1)
  }
}

function buildKey (opts) {
  const { path, method, body, headers, query } = opts
  return {
    path,
    method,
    body,
    headers,
    query
  }
}

function generateKeyValues (data) {
  return Object.entries(data).reduce((keyValuePairs, [key, value]) => [
    ...keyValuePairs,
    Buffer.from(`${key}`),
    Array.isArray(value) ? value.map(x => Buffer.from(`${x}`)) : Buffer.from(`${value}`)
  ], [])
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @param {number} statusCode
 */
function getStatusText (statusCode) {
  return STATUS_CODES[statusCode] || 'unknown'
}

async function getResponse (body) {
  const buffers = []
  for await (const data of body) {
    buffers.push(data)
  }
  return Buffer.concat(buffers).toString('utf8')
}

/**
 * Mock dispatch function used to simulate undici dispatches
 */
function mockDispatch (opts, handler) {
  // Get mock dispatch from built key
  const key = buildKey(opts)
  const mockDispatch = getMockDispatch(this[kDispatches], key)

  mockDispatch.timesInvoked++

  // Here's where we resolve a callback if a callback is present for the dispatch data.
  if (mockDispatch.data.callback) {
    mockDispatch.data = { ...mockDispatch.data, ...mockDispatch.data.callback(opts) }
  }

  // Parse mockDispatch data
  const { data: { statusCode, data, headers, trailers, error }, delay, persist } = mockDispatch
  const { timesInvoked, times } = mockDispatch

  // If it's used up and not persistent, mark as consumed
  mockDispatch.consumed = !persist && timesInvoked >= times
  mockDispatch.pending = timesInvoked < times

  // If specified, trigger dispatch error
  if (error !== null) {
    deleteMockDispatch(this[kDispatches], key)
    handler.onError(error)
    return true
  }

  // Handle the request with a delay if necessary
  if (typeof delay === 'number' && delay > 0) {
    setTimeout(() => {
      handleReply(this[kDispatches])
    }, delay)
  } else {
    handleReply(this[kDispatches])
  }

  function handleReply (mockDispatches, _data = data) {
    // fetch's HeadersList is a 1D string array
    const optsHeaders = Array.isArray(opts.headers)
      ? buildHeadersFromArray(opts.headers)
      : opts.headers
    const body = typeof _data === 'function'
      ? _data({ ...opts, headers: optsHeaders })
      : _data

    // util.types.isPromise is likely needed for jest.
    if (isPromise(body)) {
      // If handleReply is asynchronous, throwing an error
      // in the callback will reject the promise, rather than
      // synchronously throw the error, which breaks some tests.
      // Rather, we wait for the callback to resolve if it is a
      // promise, and then re-run handleReply with the new body.
      body.then((newData) => handleReply(mockDispatches, newData))
      return
    }

    const responseData = getResponseData(body)
    const responseHeaders = generateKeyValues(headers)
    const responseTrailers = generateKeyValues(trailers)

    handler.abort = nop
    handler.onHeaders(statusCode, responseHeaders, resume, getStatusText(statusCode))
    handler.onData(Buffer.from(responseData))
    handler.onComplete(responseTrailers)
    deleteMockDispatch(mockDispatches, key)
  }

  function resume () {}

  return true
}

function buildMockDispatch () {
  const agent = this[kMockAgent]
  const origin = this[kOrigin]
  const originalDispatch = this[kOriginalDispatch]

  return function dispatch (opts, handler) {
    if (agent.isMockActive) {
      try {
        mockDispatch.call(this, opts, handler)
      } catch (error) {
        if (error instanceof MockNotMatchedError) {
          const netConnect = agent[kGetNetConnect]()
          if (netConnect === false) {
            throw new MockNotMatchedError(`${error.message}: subsequent request to origin ${origin} was not allowed (net.connect disabled)`)
          }
          if (checkNetConnect(netConnect, origin)) {
            originalDispatch.call(this, opts, handler)
          } else {
            throw new MockNotMatchedError(`${error.message}: subsequent request to origin ${origin} was not allowed (net.connect is not enabled for this origin)`)
          }
        } else {
          throw error
        }
      }
    } else {
      originalDispatch.call(this, opts, handler)
    }
  }
}

function checkNetConnect (netConnect, origin) {
  const url = new URL(origin)
  if (netConnect === true) {
    return true
  } else if (Array.isArray(netConnect) && netConnect.some((matcher) => matchValue(matcher, url.host))) {
    return true
  }
  return false
}

function buildMockOptions (opts) {
  if (opts) {
    const { agent, ...mockOptions } = opts
    return mockOptions
  }
}

module.exports = {
  getResponseData,
  getMockDispatch,
  addMockDispatch,
  deleteMockDispatch,
  buildKey,
  generateKeyValues,
  matchValue,
  getResponse,
  getStatusText,
  mockDispatch,
  buildMockDispatch,
  checkNetConnect,
  buildMockOptions,
  getHeaderByName
}


/***/ }),

/***/ 6823:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { Transform } = __nccwpck_require__(2781)
const { Console } = __nccwpck_require__(6206)

/**
 * Gets the output of `console.table(…)` as a string.
 */
module.exports = class PendingInterceptorsFormatter {
  constructor ({ disableColors } = {}) {
    this.transform = new Transform({
      transform (chunk, _enc, cb) {
        cb(null, chunk)
      }
    })

    this.logger = new Console({
      stdout: this.transform,
      inspectOptions: {
        colors: !disableColors && !process.env.CI
      }
    })
  }

  format (pendingInterceptors) {
    const withPrettyHeaders = pendingInterceptors.map(
      ({ method, path, data: { statusCode }, persist, times, timesInvoked, origin }) => ({
        Method: method,
        Origin: origin,
        Path: path,
        'Status code': statusCode,
        Persistent: persist ? '✅' : '❌',
        Invocations: timesInvoked,
        Remaining: persist ? Infinity : times - timesInvoked
      }))

    this.logger.table(withPrettyHeaders)
    return this.transform.read().toString()
  }
}


/***/ }),

/***/ 8891:
/***/ ((module) => {

"use strict";


const singulars = {
  pronoun: 'it',
  is: 'is',
  was: 'was',
  this: 'this'
}

const plurals = {
  pronoun: 'they',
  is: 'are',
  was: 'were',
  this: 'these'
}

module.exports = class Pluralizer {
  constructor (singular, plural) {
    this.singular = singular
    this.plural = plural
  }

  pluralize (count) {
    const one = count === 1
    const keys = one ? singulars : plurals
    const noun = one ? this.singular : this.plural
    return { ...keys, count, noun }
  }
}


/***/ }),

/***/ 8266:
/***/ ((module) => {

"use strict";
/* eslint-disable */



// Extracted from node/lib/internal/fixed_queue.js

// Currently optimal queue size, tested on V8 6.0 - 6.6. Must be power of two.
const kSize = 2048;
const kMask = kSize - 1;

// The FixedQueue is implemented as a singly-linked list of fixed-size
// circular buffers. It looks something like this:
//
//  head                                                       tail
//    |                                                          |
//    v                                                          v
// +-----------+ <-----\       +-----------+ <------\         +-----------+
// |  [null]   |        \----- |   next    |         \------- |   next    |
// +-----------+               +-----------+                  +-----------+
// |   item    | <-- bottom    |   item    | <-- bottom       |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |       bottom --> |   item    |
// |   item    |               |   item    |                  |   item    |
// |    ...    |               |    ...    |                  |    ...    |
// |   item    |               |   item    |                  |   item    |
// |   item    |               |   item    |                  |   item    |
// |  [empty]  | <-- top       |   item    |                  |   item    |
// |  [empty]  |               |   item    |                  |   item    |
// |  [empty]  |               |  [empty]  | <-- top  top --> |  [empty]  |
// +-----------+               +-----------+                  +-----------+
//
// Or, if there is only one circular buffer, it looks something
// like either of these:
//
//  head   tail                                 head   tail
//    |     |                                     |     |
//    v     v                                     v     v
// +-----------+                               +-----------+
// |  [null]   |                               |  [null]   |
// +-----------+                               +-----------+
// |  [empty]  |                               |   item    |
// |  [empty]  |                               |   item    |
// |   item    | <-- bottom            top --> |  [empty]  |
// |   item    |                               |  [empty]  |
// |  [empty]  | <-- top            bottom --> |   item    |
// |  [empty]  |                               |   item    |
// +-----------+                               +-----------+
//
// Adding a value means moving `top` forward by one, removing means
// moving `bottom` forward by one. After reaching the end, the queue
// wraps around.
//
// When `top === bottom` the current queue is empty and when
// `top + 1 === bottom` it's full. This wastes a single space of storage
// but allows much quicker checks.

class FixedCircularBuffer {
  constructor() {
    this.bottom = 0;
    this.top = 0;
    this.list = new Array(kSize);
    this.next = null;
  }

  isEmpty() {
    return this.top === this.bottom;
  }

  isFull() {
    return ((this.top + 1) & kMask) === this.bottom;
  }

  push(data) {
    this.list[this.top] = data;
    this.top = (this.top + 1) & kMask;
  }

  shift() {
    const nextItem = this.list[this.bottom];
    if (nextItem === undefined)
      return null;
    this.list[this.bottom] = undefined;
    this.bottom = (this.bottom + 1) & kMask;
    return nextItem;
  }
}

module.exports = class FixedQueue {
  constructor() {
    this.head = this.tail = new FixedCircularBuffer();
  }

  isEmpty() {
    return this.head.isEmpty();
  }

  push(data) {
    if (this.head.isFull()) {
      // Head is full: Creates a new queue, sets the old queue's `.next` to it,
      // and sets it as the new main queue.
      this.head = this.head.next = new FixedCircularBuffer();
    }
    this.head.push(data);
  }

  shift() {
    const tail = this.tail;
    const next = tail.shift();
    if (tail.isEmpty() && tail.next !== null) {
      // If there is another queue, it forms the new tail.
      this.tail = tail.next;
    }
    return next;
  }
};


/***/ }),

/***/ 3198:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DispatcherBase = __nccwpck_require__(4839)
const FixedQueue = __nccwpck_require__(8266)
const { kConnected, kSize, kRunning, kPending, kQueued, kBusy, kFree, kUrl, kClose, kDestroy, kDispatch } = __nccwpck_require__(2785)
const PoolStats = __nccwpck_require__(9689)

const kClients = Symbol('clients')
const kNeedDrain = Symbol('needDrain')
const kQueue = Symbol('queue')
const kClosedResolve = Symbol('closed resolve')
const kOnDrain = Symbol('onDrain')
const kOnConnect = Symbol('onConnect')
const kOnDisconnect = Symbol('onDisconnect')
const kOnConnectionError = Symbol('onConnectionError')
const kGetDispatcher = Symbol('get dispatcher')
const kAddClient = Symbol('add client')
const kRemoveClient = Symbol('remove client')
const kStats = Symbol('stats')

class PoolBase extends DispatcherBase {
  constructor () {
    super()

    this[kQueue] = new FixedQueue()
    this[kClients] = []
    this[kQueued] = 0

    const pool = this

    this[kOnDrain] = function onDrain (origin, targets) {
      const queue = pool[kQueue]

      let needDrain = false

      while (!needDrain) {
        const item = queue.shift()
        if (!item) {
          break
        }
        pool[kQueued]--
        needDrain = !this.dispatch(item.opts, item.handler)
      }

      this[kNeedDrain] = needDrain

      if (!this[kNeedDrain] && pool[kNeedDrain]) {
        pool[kNeedDrain] = false
        pool.emit('drain', origin, [pool, ...targets])
      }

      if (pool[kClosedResolve] && queue.isEmpty()) {
        Promise
          .all(pool[kClients].map(c => c.close()))
          .then(pool[kClosedResolve])
      }
    }

    this[kOnConnect] = (origin, targets) => {
      pool.emit('connect', origin, [pool, ...targets])
    }

    this[kOnDisconnect] = (origin, targets, err) => {
      pool.emit('disconnect', origin, [pool, ...targets], err)
    }

    this[kOnConnectionError] = (origin, targets, err) => {
      pool.emit('connectionError', origin, [pool, ...targets], err)
    }

    this[kStats] = new PoolStats(this)
  }

  get [kBusy] () {
    return this[kNeedDrain]
  }

  get [kConnected] () {
    return this[kClients].filter(client => client[kConnected]).length
  }

  get [kFree] () {
    return this[kClients].filter(client => client[kConnected] && !client[kNeedDrain]).length
  }

  get [kPending] () {
    let ret = this[kQueued]
    for (const { [kPending]: pending } of this[kClients]) {
      ret += pending
    }
    return ret
  }

  get [kRunning] () {
    let ret = 0
    for (const { [kRunning]: running } of this[kClients]) {
      ret += running
    }
    return ret
  }

  get [kSize] () {
    let ret = this[kQueued]
    for (const { [kSize]: size } of this[kClients]) {
      ret += size
    }
    return ret
  }

  get stats () {
    return this[kStats]
  }

  async [kClose] () {
    if (this[kQueue].isEmpty()) {
      return Promise.all(this[kClients].map(c => c.close()))
    } else {
      return new Promise((resolve) => {
        this[kClosedResolve] = resolve
      })
    }
  }

  async [kDestroy] (err) {
    while (true) {
      const item = this[kQueue].shift()
      if (!item) {
        break
      }
      item.handler.onError(err)
    }

    return Promise.all(this[kClients].map(c => c.destroy(err)))
  }

  [kDispatch] (opts, handler) {
    const dispatcher = this[kGetDispatcher]()

    if (!dispatcher) {
      this[kNeedDrain] = true
      this[kQueue].push({ opts, handler })
      this[kQueued]++
    } else if (!dispatcher.dispatch(opts, handler)) {
      dispatcher[kNeedDrain] = true
      this[kNeedDrain] = !this[kGetDispatcher]()
    }

    return !this[kNeedDrain]
  }

  [kAddClient] (client) {
    client
      .on('drain', this[kOnDrain])
      .on('connect', this[kOnConnect])
      .on('disconnect', this[kOnDisconnect])
      .on('connectionError', this[kOnConnectionError])

    this[kClients].push(client)

    if (this[kNeedDrain]) {
      process.nextTick(() => {
        if (this[kNeedDrain]) {
          this[kOnDrain](client[kUrl], [this, client])
        }
      })
    }

    return this
  }

  [kRemoveClient] (client) {
    client.close(() => {
      const idx = this[kClients].indexOf(client)
      if (idx !== -1) {
        this[kClients].splice(idx, 1)
      }
    })

    this[kNeedDrain] = this[kClients].some(dispatcher => (
      !dispatcher[kNeedDrain] &&
      dispatcher.closed !== true &&
      dispatcher.destroyed !== true
    ))
  }
}

module.exports = {
  PoolBase,
  kClients,
  kNeedDrain,
  kAddClient,
  kRemoveClient,
  kGetDispatcher
}


/***/ }),

/***/ 9689:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { kFree, kConnected, kPending, kQueued, kRunning, kSize } = __nccwpck_require__(2785)
const kPool = Symbol('pool')

class PoolStats {
  constructor (pool) {
    this[kPool] = pool
  }

  get connected () {
    return this[kPool][kConnected]
  }

  get free () {
    return this[kPool][kFree]
  }

  get pending () {
    return this[kPool][kPending]
  }

  get queued () {
    return this[kPool][kQueued]
  }

  get running () {
    return this[kPool][kRunning]
  }

  get size () {
    return this[kPool][kSize]
  }
}

module.exports = PoolStats


/***/ }),

/***/ 4634:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const {
  PoolBase,
  kClients,
  kNeedDrain,
  kAddClient,
  kGetDispatcher
} = __nccwpck_require__(3198)
const Client = __nccwpck_require__(3598)
const {
  InvalidArgumentError
} = __nccwpck_require__(8045)
const util = __nccwpck_require__(3983)
const { kUrl, kInterceptors } = __nccwpck_require__(2785)
const buildConnector = __nccwpck_require__(2067)

const kOptions = Symbol('options')
const kConnections = Symbol('connections')
const kFactory = Symbol('factory')

function defaultFactory (origin, opts) {
  return new Client(origin, opts)
}

class Pool extends PoolBase {
  constructor (origin, {
    connections,
    factory = defaultFactory,
    connect,
    connectTimeout,
    tls,
    maxCachedSessions,
    socketPath,
    autoSelectFamily,
    autoSelectFamilyAttemptTimeout,
    allowH2,
    ...options
  } = {}) {
    super()

    if (connections != null && (!Number.isFinite(connections) || connections < 0)) {
      throw new InvalidArgumentError('invalid connections')
    }

    if (typeof factory !== 'function') {
      throw new InvalidArgumentError('factory must be a function.')
    }

    if (connect != null && typeof connect !== 'function' && typeof connect !== 'object') {
      throw new InvalidArgumentError('connect must be a function or an object')
    }

    if (typeof connect !== 'function') {
      connect = buildConnector({
        ...tls,
        maxCachedSessions,
        allowH2,
        socketPath,
        timeout: connectTimeout,
        ...(util.nodeHasAutoSelectFamily && autoSelectFamily ? { autoSelectFamily, autoSelectFamilyAttemptTimeout } : undefined),
        ...connect
      })
    }

    this[kInterceptors] = options.interceptors && options.interceptors.Pool && Array.isArray(options.interceptors.Pool)
      ? options.interceptors.Pool
      : []
    this[kConnections] = connections || null
    this[kUrl] = util.parseOrigin(origin)
    this[kOptions] = { ...util.deepClone(options), connect, allowH2 }
    this[kOptions].interceptors = options.interceptors
      ? { ...options.interceptors }
      : undefined
    this[kFactory] = factory
  }

  [kGetDispatcher] () {
    let dispatcher = this[kClients].find(dispatcher => !dispatcher[kNeedDrain])

    if (dispatcher) {
      return dispatcher
    }

    if (!this[kConnections] || this[kClients].length < this[kConnections]) {
      dispatcher = this[kFactory](this[kUrl], this[kOptions])
      this[kAddClient](dispatcher)
    }

    return dispatcher
  }
}

module.exports = Pool


/***/ }),

/***/ 7858:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { kProxy, kClose, kDestroy, kInterceptors } = __nccwpck_require__(2785)
const { URL } = __nccwpck_require__(7310)
const Agent = __nccwpck_require__(7890)
const Pool = __nccwpck_require__(4634)
const DispatcherBase = __nccwpck_require__(4839)
const { InvalidArgumentError, RequestAbortedError } = __nccwpck_require__(8045)
const buildConnector = __nccwpck_require__(2067)

const kAgent = Symbol('proxy agent')
const kClient = Symbol('proxy client')
const kProxyHeaders = Symbol('proxy headers')
const kRequestTls = Symbol('request tls settings')
const kProxyTls = Symbol('proxy tls settings')
const kConnectEndpoint = Symbol('connect endpoint function')

function defaultProtocolPort (protocol) {
  return protocol === 'https:' ? 443 : 80
}

function buildProxyOptions (opts) {
  if (typeof opts === 'string') {
    opts = { uri: opts }
  }

  if (!opts || !opts.uri) {
    throw new InvalidArgumentError('Proxy opts.uri is mandatory')
  }

  return {
    uri: opts.uri,
    protocol: opts.protocol || 'https'
  }
}

function defaultFactory (origin, opts) {
  return new Pool(origin, opts)
}

class ProxyAgent extends DispatcherBase {
  constructor (opts) {
    super(opts)
    this[kProxy] = buildProxyOptions(opts)
    this[kAgent] = new Agent(opts)
    this[kInterceptors] = opts.interceptors && opts.interceptors.ProxyAgent && Array.isArray(opts.interceptors.ProxyAgent)
      ? opts.interceptors.ProxyAgent
      : []

    if (typeof opts === 'string') {
      opts = { uri: opts }
    }

    if (!opts || !opts.uri) {
      throw new InvalidArgumentError('Proxy opts.uri is mandatory')
    }

    const { clientFactory = defaultFactory } = opts

    if (typeof clientFactory !== 'function') {
      throw new InvalidArgumentError('Proxy opts.clientFactory must be a function.')
    }

    this[kRequestTls] = opts.requestTls
    this[kProxyTls] = opts.proxyTls
    this[kProxyHeaders] = opts.headers || {}

    const resolvedUrl = new URL(opts.uri)
    const { origin, port, host, username, password } = resolvedUrl

    if (opts.auth && opts.token) {
      throw new InvalidArgumentError('opts.auth cannot be used in combination with opts.token')
    } else if (opts.auth) {
      /* @deprecated in favour of opts.token */
      this[kProxyHeaders]['proxy-authorization'] = `Basic ${opts.auth}`
    } else if (opts.token) {
      this[kProxyHeaders]['proxy-authorization'] = opts.token
    } else if (username && password) {
      this[kProxyHeaders]['proxy-authorization'] = `Basic ${Buffer.from(`${decodeURIComponent(username)}:${decodeURIComponent(password)}`).toString('base64')}`
    }

    const connect = buildConnector({ ...opts.proxyTls })
    this[kConnectEndpoint] = buildConnector({ ...opts.requestTls })
    this[kClient] = clientFactory(resolvedUrl, { connect })
    this[kAgent] = new Agent({
      ...opts,
      connect: async (opts, callback) => {
        let requestedHost = opts.host
        if (!opts.port) {
          requestedHost += `:${defaultProtocolPort(opts.protocol)}`
        }
        try {
          const { socket, statusCode } = await this[kClient].connect({
            origin,
            port,
            path: requestedHost,
            signal: opts.signal,
            headers: {
              ...this[kProxyHeaders],
              host
            }
          })
          if (statusCode !== 200) {
            socket.on('error', () => {}).destroy()
            callback(new RequestAbortedError(`Proxy response (${statusCode}) !== 200 when HTTP Tunneling`))
          }
          if (opts.protocol !== 'https:') {
            callback(null, socket)
            return
          }
          let servername
          if (this[kRequestTls]) {
            servername = this[kRequestTls].servername
          } else {
            servername = opts.servername
          }
          this[kConnectEndpoint]({ ...opts, servername, httpSocket: socket }, callback)
        } catch (err) {
          callback(err)
        }
      }
    })
  }

  dispatch (opts, handler) {
    const { host } = new URL(opts.origin)
    const headers = buildHeaders(opts.headers)
    throwIfProxyAuthIsSent(headers)
    return this[kAgent].dispatch(
      {
        ...opts,
        headers: {
          ...headers,
          host
        }
      },
      handler
    )
  }

  async [kClose] () {
    await this[kAgent].close()
    await this[kClient].close()
  }

  async [kDestroy] () {
    await this[kAgent].destroy()
    await this[kClient].destroy()
  }
}

/**
 * @param {string[] | Record<string, string>} headers
 * @returns {Record<string, string>}
 */
function buildHeaders (headers) {
  // When using undici.fetch, the headers list is stored
  // as an array.
  if (Array.isArray(headers)) {
    /** @type {Record<string, string>} */
    const headersPair = {}

    for (let i = 0; i < headers.length; i += 2) {
      headersPair[headers[i]] = headers[i + 1]
    }

    return headersPair
  }

  return headers
}

/**
 * @param {Record<string, string>} headers
 *
 * Previous versions of ProxyAgent suggests the Proxy-Authorization in request headers
 * Nevertheless, it was changed and to avoid a security vulnerability by end users
 * this check was created.
 * It should be removed in the next major version for performance reasons
 */
function throwIfProxyAuthIsSent (headers) {
  const existProxyAuth = headers && Object.keys(headers)
    .find((key) => key.toLowerCase() === 'proxy-authorization')
  if (existProxyAuth) {
    throw new InvalidArgumentError('Proxy-Authorization should be sent in ProxyAgent constructor')
  }
}

module.exports = ProxyAgent


/***/ }),

/***/ 9459:
/***/ ((module) => {

"use strict";


let fastNow = Date.now()
let fastNowTimeout

const fastTimers = []

function onTimeout () {
  fastNow = Date.now()

  let len = fastTimers.length
  let idx = 0
  while (idx < len) {
    const timer = fastTimers[idx]

    if (timer.state === 0) {
      timer.state = fastNow + timer.delay
    } else if (timer.state > 0 && fastNow >= timer.state) {
      timer.state = -1
      timer.callback(timer.opaque)
    }

    if (timer.state === -1) {
      timer.state = -2
      if (idx !== len - 1) {
        fastTimers[idx] = fastTimers.pop()
      } else {
        fastTimers.pop()
      }
      len -= 1
    } else {
      idx += 1
    }
  }

  if (fastTimers.length > 0) {
    refreshTimeout()
  }
}

function refreshTimeout () {
  if (fastNowTimeout && fastNowTimeout.refresh) {
    fastNowTimeout.refresh()
  } else {
    clearTimeout(fastNowTimeout)
    fastNowTimeout = setTimeout(onTimeout, 1e3)
    if (fastNowTimeout.unref) {
      fastNowTimeout.unref()
    }
  }
}

class Timeout {
  constructor (callback, delay, opaque) {
    this.callback = callback
    this.delay = delay
    this.opaque = opaque

    //  -2 not in timer list
    //  -1 in timer list but inactive
    //   0 in timer list waiting for time
    // > 0 in timer list waiting for time to expire
    this.state = -2

    this.refresh()
  }

  refresh () {
    if (this.state === -2) {
      fastTimers.push(this)
      if (!fastNowTimeout || fastTimers.length === 1) {
        refreshTimeout()
      }
    }

    this.state = 0
  }

  clear () {
    this.state = -1
  }
}

module.exports = {
  setTimeout (callback, delay, opaque) {
    return delay < 1e3
      ? setTimeout(callback, delay, opaque)
      : new Timeout(callback, delay, opaque)
  },
  clearTimeout (timeout) {
    if (timeout instanceof Timeout) {
      timeout.clear()
    } else {
      clearTimeout(timeout)
    }
  }
}


/***/ }),

/***/ 5354:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const diagnosticsChannel = __nccwpck_require__(7643)
const { uid, states } = __nccwpck_require__(9188)
const {
  kReadyState,
  kSentClose,
  kByteParser,
  kReceivedClose
} = __nccwpck_require__(7578)
const { fireEvent, failWebsocketConnection } = __nccwpck_require__(5515)
const { CloseEvent } = __nccwpck_require__(2611)
const { makeRequest } = __nccwpck_require__(8359)
const { fetching } = __nccwpck_require__(4881)
const { Headers } = __nccwpck_require__(554)
const { getGlobalDispatcher } = __nccwpck_require__(1892)
const { kHeadersList } = __nccwpck_require__(2785)

const channels = {}
channels.open = diagnosticsChannel.channel('undici:websocket:open')
channels.close = diagnosticsChannel.channel('undici:websocket:close')
channels.socketError = diagnosticsChannel.channel('undici:websocket:socket_error')

/** @type {import('crypto')} */
let crypto
try {
  crypto = __nccwpck_require__(6113)
} catch {

}

/**
 * @see https://websockets.spec.whatwg.org/#concept-websocket-establish
 * @param {URL} url
 * @param {string|string[]} protocols
 * @param {import('./websocket').WebSocket} ws
 * @param {(response: any) => void} onEstablish
 * @param {Partial<import('../../types/websocket').WebSocketInit>} options
 */
function establishWebSocketConnection (url, protocols, ws, onEstablish, options) {
  // 1. Let requestURL be a copy of url, with its scheme set to "http", if url’s
  //    scheme is "ws", and to "https" otherwise.
  const requestURL = url

  requestURL.protocol = url.protocol === 'ws:' ? 'http:' : 'https:'

  // 2. Let request be a new request, whose URL is requestURL, client is client,
  //    service-workers mode is "none", referrer is "no-referrer", mode is
  //    "websocket", credentials mode is "include", cache mode is "no-store" ,
  //    and redirect mode is "error".
  const request = makeRequest({
    urlList: [requestURL],
    serviceWorkers: 'none',
    referrer: 'no-referrer',
    mode: 'websocket',
    credentials: 'include',
    cache: 'no-store',
    redirect: 'error'
  })

  // Note: undici extension, allow setting custom headers.
  if (options.headers) {
    const headersList = new Headers(options.headers)[kHeadersList]

    request.headersList = headersList
  }

  // 3. Append (`Upgrade`, `websocket`) to request’s header list.
  // 4. Append (`Connection`, `Upgrade`) to request’s header list.
  // Note: both of these are handled by undici currently.
  // https://github.com/nodejs/undici/blob/68c269c4144c446f3f1220951338daef4a6b5ec4/lib/client.js#L1397

  // 5. Let keyValue be a nonce consisting of a randomly selected
  //    16-byte value that has been forgiving-base64-encoded and
  //    isomorphic encoded.
  const keyValue = crypto.randomBytes(16).toString('base64')

  // 6. Append (`Sec-WebSocket-Key`, keyValue) to request’s
  //    header list.
  request.headersList.append('sec-websocket-key', keyValue)

  // 7. Append (`Sec-WebSocket-Version`, `13`) to request’s
  //    header list.
  request.headersList.append('sec-websocket-version', '13')

  // 8. For each protocol in protocols, combine
  //    (`Sec-WebSocket-Protocol`, protocol) in request’s header
  //    list.
  for (const protocol of protocols) {
    request.headersList.append('sec-websocket-protocol', protocol)
  }

  // 9. Let permessageDeflate be a user-agent defined
  //    "permessage-deflate" extension header value.
  // https://github.com/mozilla/gecko-dev/blob/ce78234f5e653a5d3916813ff990f053510227bc/netwerk/protocol/websocket/WebSocketChannel.cpp#L2673
  // TODO: enable once permessage-deflate is supported
  const permessageDeflate = '' // 'permessage-deflate; 15'

  // 10. Append (`Sec-WebSocket-Extensions`, permessageDeflate) to
  //     request’s header list.
  // request.headersList.append('sec-websocket-extensions', permessageDeflate)

  // 11. Fetch request with useParallelQueue set to true, and
  //     processResponse given response being these steps:
  const controller = fetching({
    request,
    useParallelQueue: true,
    dispatcher: options.dispatcher ?? getGlobalDispatcher(),
    processResponse (response) {
      // 1. If response is a network error or its status is not 101,
      //    fail the WebSocket connection.
      if (response.type === 'error' || response.status !== 101) {
        failWebsocketConnection(ws, 'Received network error or non-101 status code.')
        return
      }

      // 2. If protocols is not the empty list and extracting header
      //    list values given `Sec-WebSocket-Protocol` and response’s
      //    header list results in null, failure, or the empty byte
      //    sequence, then fail the WebSocket connection.
      if (protocols.length !== 0 && !response.headersList.get('Sec-WebSocket-Protocol')) {
        failWebsocketConnection(ws, 'Server did not respond with sent protocols.')
        return
      }

      // 3. Follow the requirements stated step 2 to step 6, inclusive,
      //    of the last set of steps in section 4.1 of The WebSocket
      //    Protocol to validate response. This either results in fail
      //    the WebSocket connection or the WebSocket connection is
      //    established.

      // 2. If the response lacks an |Upgrade| header field or the |Upgrade|
      //    header field contains a value that is not an ASCII case-
      //    insensitive match for the value "websocket", the client MUST
      //    _Fail the WebSocket Connection_.
      if (response.headersList.get('Upgrade')?.toLowerCase() !== 'websocket') {
        failWebsocketConnection(ws, 'Server did not set Upgrade header to "websocket".')
        return
      }

      // 3. If the response lacks a |Connection| header field or the
      //    |Connection| header field doesn't contain a token that is an
      //    ASCII case-insensitive match for the value "Upgrade", the client
      //    MUST _Fail the WebSocket Connection_.
      if (response.headersList.get('Connection')?.toLowerCase() !== 'upgrade') {
        failWebsocketConnection(ws, 'Server did not set Connection header to "upgrade".')
        return
      }

      // 4. If the response lacks a |Sec-WebSocket-Accept| header field or
      //    the |Sec-WebSocket-Accept| contains a value other than the
      //    base64-encoded SHA-1 of the concatenation of the |Sec-WebSocket-
      //    Key| (as a string, not base64-decoded) with the string "258EAFA5-
      //    E914-47DA-95CA-C5AB0DC85B11" but ignoring any leading and
      //    trailing whitespace, the client MUST _Fail the WebSocket
      //    Connection_.
      const secWSAccept = response.headersList.get('Sec-WebSocket-Accept')
      const digest = crypto.createHash('sha1').update(keyValue + uid).digest('base64')
      if (secWSAccept !== digest) {
        failWebsocketConnection(ws, 'Incorrect hash received in Sec-WebSocket-Accept header.')
        return
      }

      // 5. If the response includes a |Sec-WebSocket-Extensions| header
      //    field and this header field indicates the use of an extension
      //    that was not present in the client's handshake (the server has
      //    indicated an extension not requested by the client), the client
      //    MUST _Fail the WebSocket Connection_.  (The parsing of this
      //    header field to determine which extensions are requested is
      //    discussed in Section 9.1.)
      const secExtension = response.headersList.get('Sec-WebSocket-Extensions')

      if (secExtension !== null && secExtension !== permessageDeflate) {
        failWebsocketConnection(ws, 'Received different permessage-deflate than the one set.')
        return
      }

      // 6. If the response includes a |Sec-WebSocket-Protocol| header field
      //    and this header field indicates the use of a subprotocol that was
      //    not present in the client's handshake (the server has indicated a
      //    subprotocol not requested by the client), the client MUST _Fail
      //    the WebSocket Connection_.
      const secProtocol = response.headersList.get('Sec-WebSocket-Protocol')

      if (secProtocol !== null && secProtocol !== request.headersList.get('Sec-WebSocket-Protocol')) {
        failWebsocketConnection(ws, 'Protocol was not set in the opening handshake.')
        return
      }

      response.socket.on('data', onSocketData)
      response.socket.on('close', onSocketClose)
      response.socket.on('error', onSocketError)

      if (channels.open.hasSubscribers) {
        channels.open.publish({
          address: response.socket.address(),
          protocol: secProtocol,
          extensions: secExtension
        })
      }

      onEstablish(response)
    }
  })

  return controller
}

/**
 * @param {Buffer} chunk
 */
function onSocketData (chunk) {
  if (!this.ws[kByteParser].write(chunk)) {
    this.pause()
  }
}

/**
 * @see https://websockets.spec.whatwg.org/#feedback-from-the-protocol
 * @see https://datatracker.ietf.org/doc/html/rfc6455#section-7.1.4
 */
function onSocketClose () {
  const { ws } = this

  // If the TCP connection was closed after the
  // WebSocket closing handshake was completed, the WebSocket connection
  // is said to have been closed _cleanly_.
  const wasClean = ws[kSentClose] && ws[kReceivedClose]

  let code = 1005
  let reason = ''

  const result = ws[kByteParser].closingInfo

  if (result) {
    code = result.code ?? 1005
    reason = result.reason
  } else if (!ws[kSentClose]) {
    // If _The WebSocket
    // Connection is Closed_ and no Close control frame was received by the
    // endpoint (such as could occur if the underlying transport connection
    // is lost), _The WebSocket Connection Close Code_ is considered to be
    // 1006.
    code = 1006
  }

  // 1. Change the ready state to CLOSED (3).
  ws[kReadyState] = states.CLOSED

  // 2. If the user agent was required to fail the WebSocket
  //    connection, or if the WebSocket connection was closed
  //    after being flagged as full, fire an event named error
  //    at the WebSocket object.
  // TODO

  // 3. Fire an event named close at the WebSocket object,
  //    using CloseEvent, with the wasClean attribute
  //    initialized to true if the connection closed cleanly
  //    and false otherwise, the code attribute initialized to
  //    the WebSocket connection close code, and the reason
  //    attribute initialized to the result of applying UTF-8
  //    decode without BOM to the WebSocket connection close
  //    reason.
  fireEvent('close', ws, CloseEvent, {
    wasClean, code, reason
  })

  if (channels.close.hasSubscribers) {
    channels.close.publish({
      websocket: ws,
      code,
      reason
    })
  }
}

function onSocketError (error) {
  const { ws } = this

  ws[kReadyState] = states.CLOSING

  if (channels.socketError.hasSubscribers) {
    channels.socketError.publish(error)
  }

  this.destroy()
}

module.exports = {
  establishWebSocketConnection
}


/***/ }),

/***/ 9188:
/***/ ((module) => {

"use strict";


// This is a Globally Unique Identifier unique used
// to validate that the endpoint accepts websocket
// connections.
// See https://www.rfc-editor.org/rfc/rfc6455.html#section-1.3
const uid = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

/** @type {PropertyDescriptor} */
const staticPropertyDescriptors = {
  enumerable: true,
  writable: false,
  configurable: false
}

const states = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}

const opcodes = {
  CONTINUATION: 0x0,
  TEXT: 0x1,
  BINARY: 0x2,
  CLOSE: 0x8,
  PING: 0x9,
  PONG: 0xA
}

const maxUnsigned16Bit = 2 ** 16 - 1 // 65535

const parserStates = {
  INFO: 0,
  PAYLOADLENGTH_16: 2,
  PAYLOADLENGTH_64: 3,
  READ_DATA: 4
}

const emptyBuffer = Buffer.allocUnsafe(0)

module.exports = {
  uid,
  staticPropertyDescriptors,
  states,
  opcodes,
  maxUnsigned16Bit,
  parserStates,
  emptyBuffer
}


/***/ }),

/***/ 2611:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { webidl } = __nccwpck_require__(1744)
const { kEnumerableProperty } = __nccwpck_require__(3983)
const { MessagePort } = __nccwpck_require__(1267)

/**
 * @see https://html.spec.whatwg.org/multipage/comms.html#messageevent
 */
class MessageEvent extends Event {
  #eventInit

  constructor (type, eventInitDict = {}) {
    webidl.argumentLengthCheck(arguments, 1, { header: 'MessageEvent constructor' })

    type = webidl.converters.DOMString(type)
    eventInitDict = webidl.converters.MessageEventInit(eventInitDict)

    super(type, eventInitDict)

    this.#eventInit = eventInitDict
  }

  get data () {
    webidl.brandCheck(this, MessageEvent)

    return this.#eventInit.data
  }

  get origin () {
    webidl.brandCheck(this, MessageEvent)

    return this.#eventInit.origin
  }

  get lastEventId () {
    webidl.brandCheck(this, MessageEvent)

    return this.#eventInit.lastEventId
  }

  get source () {
    webidl.brandCheck(this, MessageEvent)

    return this.#eventInit.source
  }

  get ports () {
    webidl.brandCheck(this, MessageEvent)

    if (!Object.isFrozen(this.#eventInit.ports)) {
      Object.freeze(this.#eventInit.ports)
    }

    return this.#eventInit.ports
  }

  initMessageEvent (
    type,
    bubbles = false,
    cancelable = false,
    data = null,
    origin = '',
    lastEventId = '',
    source = null,
    ports = []
  ) {
    webidl.brandCheck(this, MessageEvent)

    webidl.argumentLengthCheck(arguments, 1, { header: 'MessageEvent.initMessageEvent' })

    return new MessageEvent(type, {
      bubbles, cancelable, data, origin, lastEventId, source, ports
    })
  }
}

/**
 * @see https://websockets.spec.whatwg.org/#the-closeevent-interface
 */
class CloseEvent extends Event {
  #eventInit

  constructor (type, eventInitDict = {}) {
    webidl.argumentLengthCheck(arguments, 1, { header: 'CloseEvent constructor' })

    type = webidl.converters.DOMString(type)
    eventInitDict = webidl.converters.CloseEventInit(eventInitDict)

    super(type, eventInitDict)

    this.#eventInit = eventInitDict
  }

  get wasClean () {
    webidl.brandCheck(this, CloseEvent)

    return this.#eventInit.wasClean
  }

  get code () {
    webidl.brandCheck(this, CloseEvent)

    return this.#eventInit.code
  }

  get reason () {
    webidl.brandCheck(this, CloseEvent)

    return this.#eventInit.reason
  }
}

// https://html.spec.whatwg.org/multipage/webappapis.html#the-errorevent-interface
class ErrorEvent extends Event {
  #eventInit

  constructor (type, eventInitDict) {
    webidl.argumentLengthCheck(arguments, 1, { header: 'ErrorEvent constructor' })

    super(type, eventInitDict)

    type = webidl.converters.DOMString(type)
    eventInitDict = webidl.converters.ErrorEventInit(eventInitDict ?? {})

    this.#eventInit = eventInitDict
  }

  get message () {
    webidl.brandCheck(this, ErrorEvent)

    return this.#eventInit.message
  }

  get filename () {
    webidl.brandCheck(this, ErrorEvent)

    return this.#eventInit.filename
  }

  get lineno () {
    webidl.brandCheck(this, ErrorEvent)

    return this.#eventInit.lineno
  }

  get colno () {
    webidl.brandCheck(this, ErrorEvent)

    return this.#eventInit.colno
  }

  get error () {
    webidl.brandCheck(this, ErrorEvent)

    return this.#eventInit.error
  }
}

Object.defineProperties(MessageEvent.prototype, {
  [Symbol.toStringTag]: {
    value: 'MessageEvent',
    configurable: true
  },
  data: kEnumerableProperty,
  origin: kEnumerableProperty,
  lastEventId: kEnumerableProperty,
  source: kEnumerableProperty,
  ports: kEnumerableProperty,
  initMessageEvent: kEnumerableProperty
})

Object.defineProperties(CloseEvent.prototype, {
  [Symbol.toStringTag]: {
    value: 'CloseEvent',
    configurable: true
  },
  reason: kEnumerableProperty,
  code: kEnumerableProperty,
  wasClean: kEnumerableProperty
})

Object.defineProperties(ErrorEvent.prototype, {
  [Symbol.toStringTag]: {
    value: 'ErrorEvent',
    configurable: true
  },
  message: kEnumerableProperty,
  filename: kEnumerableProperty,
  lineno: kEnumerableProperty,
  colno: kEnumerableProperty,
  error: kEnumerableProperty
})

webidl.converters.MessagePort = webidl.interfaceConverter(MessagePort)

webidl.converters['sequence<MessagePort>'] = webidl.sequenceConverter(
  webidl.converters.MessagePort
)

const eventInit = [
  {
    key: 'bubbles',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'cancelable',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'composed',
    converter: webidl.converters.boolean,
    defaultValue: false
  }
]

webidl.converters.MessageEventInit = webidl.dictionaryConverter([
  ...eventInit,
  {
    key: 'data',
    converter: webidl.converters.any,
    defaultValue: null
  },
  {
    key: 'origin',
    converter: webidl.converters.USVString,
    defaultValue: ''
  },
  {
    key: 'lastEventId',
    converter: webidl.converters.DOMString,
    defaultValue: ''
  },
  {
    key: 'source',
    // Node doesn't implement WindowProxy or ServiceWorker, so the only
    // valid value for source is a MessagePort.
    converter: webidl.nullableConverter(webidl.converters.MessagePort),
    defaultValue: null
  },
  {
    key: 'ports',
    converter: webidl.converters['sequence<MessagePort>'],
    get defaultValue () {
      return []
    }
  }
])

webidl.converters.CloseEventInit = webidl.dictionaryConverter([
  ...eventInit,
  {
    key: 'wasClean',
    converter: webidl.converters.boolean,
    defaultValue: false
  },
  {
    key: 'code',
    converter: webidl.converters['unsigned short'],
    defaultValue: 0
  },
  {
    key: 'reason',
    converter: webidl.converters.USVString,
    defaultValue: ''
  }
])

webidl.converters.ErrorEventInit = webidl.dictionaryConverter([
  ...eventInit,
  {
    key: 'message',
    converter: webidl.converters.DOMString,
    defaultValue: ''
  },
  {
    key: 'filename',
    converter: webidl.converters.USVString,
    defaultValue: ''
  },
  {
    key: 'lineno',
    converter: webidl.converters['unsigned long'],
    defaultValue: 0
  },
  {
    key: 'colno',
    converter: webidl.converters['unsigned long'],
    defaultValue: 0
  },
  {
    key: 'error',
    converter: webidl.converters.any
  }
])

module.exports = {
  MessageEvent,
  CloseEvent,
  ErrorEvent
}


/***/ }),

/***/ 5444:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { maxUnsigned16Bit } = __nccwpck_require__(9188)

/** @type {import('crypto')} */
let crypto
try {
  crypto = __nccwpck_require__(6113)
} catch {

}

class WebsocketFrameSend {
  /**
   * @param {Buffer|undefined} data
   */
  constructor (data) {
    this.frameData = data
    this.maskKey = crypto.randomBytes(4)
  }

  createFrame (opcode) {
    const bodyLength = this.frameData?.byteLength ?? 0

    /** @type {number} */
    let payloadLength = bodyLength // 0-125
    let offset = 6

    if (bodyLength > maxUnsigned16Bit) {
      offset += 8 // payload length is next 8 bytes
      payloadLength = 127
    } else if (bodyLength > 125) {
      offset += 2 // payload length is next 2 bytes
      payloadLength = 126
    }

    const buffer = Buffer.allocUnsafe(bodyLength + offset)

    // Clear first 2 bytes, everything else is overwritten
    buffer[0] = buffer[1] = 0
    buffer[0] |= 0x80 // FIN
    buffer[0] = (buffer[0] & 0xF0) + opcode // opcode

    /*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
    buffer[offset - 4] = this.maskKey[0]
    buffer[offset - 3] = this.maskKey[1]
    buffer[offset - 2] = this.maskKey[2]
    buffer[offset - 1] = this.maskKey[3]

    buffer[1] = payloadLength

    if (payloadLength === 126) {
      buffer.writeUInt16BE(bodyLength, 2)
    } else if (payloadLength === 127) {
      // Clear extended payload length
      buffer[2] = buffer[3] = 0
      buffer.writeUIntBE(bodyLength, 4, 6)
    }

    buffer[1] |= 0x80 // MASK

    // mask body
    for (let i = 0; i < bodyLength; i++) {
      buffer[offset + i] = this.frameData[i] ^ this.maskKey[i % 4]
    }

    return buffer
  }
}

module.exports = {
  WebsocketFrameSend
}


/***/ }),

/***/ 1688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { Writable } = __nccwpck_require__(2781)
const diagnosticsChannel = __nccwpck_require__(7643)
const { parserStates, opcodes, states, emptyBuffer } = __nccwpck_require__(9188)
const { kReadyState, kSentClose, kResponse, kReceivedClose } = __nccwpck_require__(7578)
const { isValidStatusCode, failWebsocketConnection, websocketMessageReceived } = __nccwpck_require__(5515)
const { WebsocketFrameSend } = __nccwpck_require__(5444)

// This code was influenced by ws released under the MIT license.
// Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com>
// Copyright (c) 2013 Arnout Kazemier and contributors
// Copyright (c) 2016 Luigi Pinca and contributors

const channels = {}
channels.ping = diagnosticsChannel.channel('undici:websocket:ping')
channels.pong = diagnosticsChannel.channel('undici:websocket:pong')

class ByteParser extends Writable {
  #buffers = []
  #byteOffset = 0

  #state = parserStates.INFO

  #info = {}
  #fragments = []

  constructor (ws) {
    super()

    this.ws = ws
  }

  /**
   * @param {Buffer} chunk
   * @param {() => void} callback
   */
  _write (chunk, _, callback) {
    this.#buffers.push(chunk)
    this.#byteOffset += chunk.length

    this.run(callback)
  }

  /**
   * Runs whenever a new chunk is received.
   * Callback is called whenever there are no more chunks buffering,
   * or not enough bytes are buffered to parse.
   */
  run (callback) {
    while (true) {
      if (this.#state === parserStates.INFO) {
        // If there aren't enough bytes to parse the payload length, etc.
        if (this.#byteOffset < 2) {
          return callback()
        }

        const buffer = this.consume(2)

        this.#info.fin = (buffer[0] & 0x80) !== 0
        this.#info.opcode = buffer[0] & 0x0F

        // If we receive a fragmented message, we use the type of the first
        // frame to parse the full message as binary/text, when it's terminated
        this.#info.originalOpcode ??= this.#info.opcode

        this.#info.fragmented = !this.#info.fin && this.#info.opcode !== opcodes.CONTINUATION

        if (this.#info.fragmented && this.#info.opcode !== opcodes.BINARY && this.#info.opcode !== opcodes.TEXT) {
          // Only text and binary frames can be fragmented
          failWebsocketConnection(this.ws, 'Invalid frame type was fragmented.')
          return
        }

        const payloadLength = buffer[1] & 0x7F

        if (payloadLength <= 125) {
          this.#info.payloadLength = payloadLength
          this.#state = parserStates.READ_DATA
        } else if (payloadLength === 126) {
          this.#state = parserStates.PAYLOADLENGTH_16
        } else if (payloadLength === 127) {
          this.#state = parserStates.PAYLOADLENGTH_64
        }

        if (this.#info.fragmented && payloadLength > 125) {
          // A fragmented frame can't be fragmented itself
          failWebsocketConnection(this.ws, 'Fragmented frame exceeded 125 bytes.')
          return
        } else if (
          (this.#info.opcode === opcodes.PING ||
            this.#info.opcode === opcodes.PONG ||
            this.#info.opcode === opcodes.CLOSE) &&
          payloadLength > 125
        ) {
          // Control frames can have a payload length of 125 bytes MAX
          failWebsocketConnection(this.ws, 'Payload length for control frame exceeded 125 bytes.')
          return
        } else if (this.#info.opcode === opcodes.CLOSE) {
          if (payloadLength === 1) {
            failWebsocketConnection(this.ws, 'Received close frame with a 1-byte body.')
            return
          }

          const body = this.consume(payloadLength)

          this.#info.closeInfo = this.parseCloseBody(false, body)

          if (!this.ws[kSentClose]) {
            // If an endpoint receives a Close frame and did not previously send a
            // Close frame, the endpoint MUST send a Close frame in response.  (When
            // sending a Close frame in response, the endpoint typically echos the
            // status code it received.)
            const body = Buffer.allocUnsafe(2)
            body.writeUInt16BE(this.#info.closeInfo.code, 0)
            const closeFrame = new WebsocketFrameSend(body)

            this.ws[kResponse].socket.write(
              closeFrame.createFrame(opcodes.CLOSE),
              (err) => {
                if (!err) {
                  this.ws[kSentClose] = true
                }
              }
            )
          }

          // Upon either sending or receiving a Close control frame, it is said
          // that _The WebSocket Closing Handshake is Started_ and that the
          // WebSocket connection is in the CLOSING state.
          this.ws[kReadyState] = states.CLOSING
          this.ws[kReceivedClose] = true

          this.end()

          return
        } else if (this.#info.opcode === opcodes.PING) {
          // Upon receipt of a Ping frame, an endpoint MUST send a Pong frame in
          // response, unless it already received a Close frame.
          // A Pong frame sent in response to a Ping frame must have identical
          // "Application data"

          const body = this.consume(payloadLength)

          if (!this.ws[kReceivedClose]) {
            const frame = new WebsocketFrameSend(body)

            this.ws[kResponse].socket.write(frame.createFrame(opcodes.PONG))

            if (channels.ping.hasSubscribers) {
              channels.ping.publish({
                payload: body
              })
            }
          }

          this.#state = parserStates.INFO

          if (this.#byteOffset > 0) {
            continue
          } else {
            callback()
            return
          }
        } else if (this.#info.opcode === opcodes.PONG) {
          // A Pong frame MAY be sent unsolicited.  This serves as a
          // unidirectional heartbeat.  A response to an unsolicited Pong frame is
          // not expected.

          const body = this.consume(payloadLength)

          if (channels.pong.hasSubscribers) {
            channels.pong.publish({
              payload: body
            })
          }

          if (this.#byteOffset > 0) {
            continue
          } else {
            callback()
            return
          }
        }
      } else if (this.#state === parserStates.PAYLOADLENGTH_16) {
        if (this.#byteOffset < 2) {
          return callback()
        }

        const buffer = this.consume(2)

        this.#info.payloadLength = buffer.readUInt16BE(0)
        this.#state = parserStates.READ_DATA
      } else if (this.#state === parserStates.PAYLOADLENGTH_64) {
        if (this.#byteOffset < 8) {
          return callback()
        }

        const buffer = this.consume(8)
        const upper = buffer.readUInt32BE(0)

        // 2^31 is the maxinimum bytes an arraybuffer can contain
        // on 32-bit systems. Although, on 64-bit systems, this is
        // 2^53-1 bytes.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_array_length
        // https://source.chromium.org/chromium/chromium/src/+/main:v8/src/common/globals.h;drc=1946212ac0100668f14eb9e2843bdd846e510a1e;bpv=1;bpt=1;l=1275
        // https://source.chromium.org/chromium/chromium/src/+/main:v8/src/objects/js-array-buffer.h;l=34;drc=1946212ac0100668f14eb9e2843bdd846e510a1e
        if (upper > 2 ** 31 - 1) {
          failWebsocketConnection(this.ws, 'Received payload length > 2^31 bytes.')
          return
        }

        const lower = buffer.readUInt32BE(4)

        this.#info.payloadLength = (upper << 8) + lower
        this.#state = parserStates.READ_DATA
      } else if (this.#state === parserStates.READ_DATA) {
        if (this.#byteOffset < this.#info.payloadLength) {
          // If there is still more data in this chunk that needs to be read
          return callback()
        } else if (this.#byteOffset >= this.#info.payloadLength) {
          // If the server sent multiple frames in a single chunk

          const body = this.consume(this.#info.payloadLength)

          this.#fragments.push(body)

          // If the frame is unfragmented, or a fragmented frame was terminated,
          // a message was received
          if (!this.#info.fragmented || (this.#info.fin && this.#info.opcode === opcodes.CONTINUATION)) {
            const fullMessage = Buffer.concat(this.#fragments)

            websocketMessageReceived(this.ws, this.#info.originalOpcode, fullMessage)

            this.#info = {}
            this.#fragments.length = 0
          }

          this.#state = parserStates.INFO
        }
      }

      if (this.#byteOffset > 0) {
        continue
      } else {
        callback()
        break
      }
    }
  }

  /**
   * Take n bytes from the buffered Buffers
   * @param {number} n
   * @returns {Buffer|null}
   */
  consume (n) {
    if (n > this.#byteOffset) {
      return null
    } else if (n === 0) {
      return emptyBuffer
    }

    if (this.#buffers[0].length === n) {
      this.#byteOffset -= this.#buffers[0].length
      return this.#buffers.shift()
    }

    const buffer = Buffer.allocUnsafe(n)
    let offset = 0

    while (offset !== n) {
      const next = this.#buffers[0]
      const { length } = next

      if (length + offset === n) {
        buffer.set(this.#buffers.shift(), offset)
        break
      } else if (length + offset > n) {
        buffer.set(next.subarray(0, n - offset), offset)
        this.#buffers[0] = next.subarray(n - offset)
        break
      } else {
        buffer.set(this.#buffers.shift(), offset)
        offset += next.length
      }
    }

    this.#byteOffset -= n

    return buffer
  }

  parseCloseBody (onlyCode, data) {
    // https://datatracker.ietf.org/doc/html/rfc6455#section-7.1.5
    /** @type {number|undefined} */
    let code

    if (data.length >= 2) {
      // _The WebSocket Connection Close Code_ is
      // defined as the status code (Section 7.4) contained in the first Close
      // control frame received by the application
      code = data.readUInt16BE(0)
    }

    if (onlyCode) {
      if (!isValidStatusCode(code)) {
        return null
      }

      return { code }
    }

    // https://datatracker.ietf.org/doc/html/rfc6455#section-7.1.6
    /** @type {Buffer} */
    let reason = data.subarray(2)

    // Remove BOM
    if (reason[0] === 0xEF && reason[1] === 0xBB && reason[2] === 0xBF) {
      reason = reason.subarray(3)
    }

    if (code !== undefined && !isValidStatusCode(code)) {
      return null
    }

    try {
      // TODO: optimize this
      reason = new TextDecoder('utf-8', { fatal: true }).decode(reason)
    } catch {
      return null
    }

    return { code, reason }
  }

  get closingInfo () {
    return this.#info.closeInfo
  }
}

module.exports = {
  ByteParser
}


/***/ }),

/***/ 7578:
/***/ ((module) => {

"use strict";


module.exports = {
  kWebSocketURL: Symbol('url'),
  kReadyState: Symbol('ready state'),
  kController: Symbol('controller'),
  kResponse: Symbol('response'),
  kBinaryType: Symbol('binary type'),
  kSentClose: Symbol('sent close'),
  kReceivedClose: Symbol('received close'),
  kByteParser: Symbol('byte parser')
}


/***/ }),

/***/ 5515:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { kReadyState, kController, kResponse, kBinaryType, kWebSocketURL } = __nccwpck_require__(7578)
const { states, opcodes } = __nccwpck_require__(9188)
const { MessageEvent, ErrorEvent } = __nccwpck_require__(2611)

/* globals Blob */

/**
 * @param {import('./websocket').WebSocket} ws
 */
function isEstablished (ws) {
  // If the server's response is validated as provided for above, it is
  // said that _The WebSocket Connection is Established_ and that the
  // WebSocket Connection is in the OPEN state.
  return ws[kReadyState] === states.OPEN
}

/**
 * @param {import('./websocket').WebSocket} ws
 */
function isClosing (ws) {
  // Upon either sending or receiving a Close control frame, it is said
  // that _The WebSocket Closing Handshake is Started_ and that the
  // WebSocket connection is in the CLOSING state.
  return ws[kReadyState] === states.CLOSING
}

/**
 * @param {import('./websocket').WebSocket} ws
 */
function isClosed (ws) {
  return ws[kReadyState] === states.CLOSED
}

/**
 * @see https://dom.spec.whatwg.org/#concept-event-fire
 * @param {string} e
 * @param {EventTarget} target
 * @param {EventInit | undefined} eventInitDict
 */
function fireEvent (e, target, eventConstructor = Event, eventInitDict) {
  // 1. If eventConstructor is not given, then let eventConstructor be Event.

  // 2. Let event be the result of creating an event given eventConstructor,
  //    in the relevant realm of target.
  // 3. Initialize event’s type attribute to e.
  const event = new eventConstructor(e, eventInitDict) // eslint-disable-line new-cap

  // 4. Initialize any other IDL attributes of event as described in the
  //    invocation of this algorithm.

  // 5. Return the result of dispatching event at target, with legacy target
  //    override flag set if set.
  target.dispatchEvent(event)
}

/**
 * @see https://websockets.spec.whatwg.org/#feedback-from-the-protocol
 * @param {import('./websocket').WebSocket} ws
 * @param {number} type Opcode
 * @param {Buffer} data application data
 */
function websocketMessageReceived (ws, type, data) {
  // 1. If ready state is not OPEN (1), then return.
  if (ws[kReadyState] !== states.OPEN) {
    return
  }

  // 2. Let dataForEvent be determined by switching on type and binary type:
  let dataForEvent

  if (type === opcodes.TEXT) {
    // -> type indicates that the data is Text
    //      a new DOMString containing data
    try {
      dataForEvent = new TextDecoder('utf-8', { fatal: true }).decode(data)
    } catch {
      failWebsocketConnection(ws, 'Received invalid UTF-8 in text frame.')
      return
    }
  } else if (type === opcodes.BINARY) {
    if (ws[kBinaryType] === 'blob') {
      // -> type indicates that the data is Binary and binary type is "blob"
      //      a new Blob object, created in the relevant Realm of the WebSocket
      //      object, that represents data as its raw data
      dataForEvent = new Blob([data])
    } else {
      // -> type indicates that the data is Binary and binary type is "arraybuffer"
      //      a new ArrayBuffer object, created in the relevant Realm of the
      //      WebSocket object, whose contents are data
      dataForEvent = new Uint8Array(data).buffer
    }
  }

  // 3. Fire an event named message at the WebSocket object, using MessageEvent,
  //    with the origin attribute initialized to the serialization of the WebSocket
  //    object’s url's origin, and the data attribute initialized to dataForEvent.
  fireEvent('message', ws, MessageEvent, {
    origin: ws[kWebSocketURL].origin,
    data: dataForEvent
  })
}

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6455
 * @see https://datatracker.ietf.org/doc/html/rfc2616
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=398407
 * @param {string} protocol
 */
function isValidSubprotocol (protocol) {
  // If present, this value indicates one
  // or more comma-separated subprotocol the client wishes to speak,
  // ordered by preference.  The elements that comprise this value
  // MUST be non-empty strings with characters in the range U+0021 to
  // U+007E not including separator characters as defined in
  // [RFC2616] and MUST all be unique strings.
  if (protocol.length === 0) {
    return false
  }

  for (const char of protocol) {
    const code = char.charCodeAt(0)

    if (
      code < 0x21 ||
      code > 0x7E ||
      char === '(' ||
      char === ')' ||
      char === '<' ||
      char === '>' ||
      char === '@' ||
      char === ',' ||
      char === ';' ||
      char === ':' ||
      char === '\\' ||
      char === '"' ||
      char === '/' ||
      char === '[' ||
      char === ']' ||
      char === '?' ||
      char === '=' ||
      char === '{' ||
      char === '}' ||
      code === 32 || // SP
      code === 9 // HT
    ) {
      return false
    }
  }

  return true
}

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6455#section-7-4
 * @param {number} code
 */
function isValidStatusCode (code) {
  if (code >= 1000 && code < 1015) {
    return (
      code !== 1004 && // reserved
      code !== 1005 && // "MUST NOT be set as a status code"
      code !== 1006 // "MUST NOT be set as a status code"
    )
  }

  return code >= 3000 && code <= 4999
}

/**
 * @param {import('./websocket').WebSocket} ws
 * @param {string|undefined} reason
 */
function failWebsocketConnection (ws, reason) {
  const { [kController]: controller, [kResponse]: response } = ws

  controller.abort()

  if (response?.socket && !response.socket.destroyed) {
    response.socket.destroy()
  }

  if (reason) {
    fireEvent('error', ws, ErrorEvent, {
      error: new Error(reason)
    })
  }
}

module.exports = {
  isEstablished,
  isClosing,
  isClosed,
  fireEvent,
  isValidSubprotocol,
  isValidStatusCode,
  failWebsocketConnection,
  websocketMessageReceived
}


/***/ }),

/***/ 4284:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { webidl } = __nccwpck_require__(1744)
const { DOMException } = __nccwpck_require__(1037)
const { URLSerializer } = __nccwpck_require__(685)
const { getGlobalOrigin } = __nccwpck_require__(1246)
const { staticPropertyDescriptors, states, opcodes, emptyBuffer } = __nccwpck_require__(9188)
const {
  kWebSocketURL,
  kReadyState,
  kController,
  kBinaryType,
  kResponse,
  kSentClose,
  kByteParser
} = __nccwpck_require__(7578)
const { isEstablished, isClosing, isValidSubprotocol, failWebsocketConnection, fireEvent } = __nccwpck_require__(5515)
const { establishWebSocketConnection } = __nccwpck_require__(5354)
const { WebsocketFrameSend } = __nccwpck_require__(5444)
const { ByteParser } = __nccwpck_require__(1688)
const { kEnumerableProperty, isBlobLike } = __nccwpck_require__(3983)
const { getGlobalDispatcher } = __nccwpck_require__(1892)
const { types } = __nccwpck_require__(3837)

let experimentalWarned = false

// https://websockets.spec.whatwg.org/#interface-definition
class WebSocket extends EventTarget {
  #events = {
    open: null,
    error: null,
    close: null,
    message: null
  }

  #bufferedAmount = 0
  #protocol = ''
  #extensions = ''

  /**
   * @param {string} url
   * @param {string|string[]} protocols
   */
  constructor (url, protocols = []) {
    super()

    webidl.argumentLengthCheck(arguments, 1, { header: 'WebSocket constructor' })

    if (!experimentalWarned) {
      experimentalWarned = true
      process.emitWarning('WebSockets are experimental, expect them to change at any time.', {
        code: 'UNDICI-WS'
      })
    }

    const options = webidl.converters['DOMString or sequence<DOMString> or WebSocketInit'](protocols)

    url = webidl.converters.USVString(url)
    protocols = options.protocols

    // 1. Let baseURL be this's relevant settings object's API base URL.
    const baseURL = getGlobalOrigin()

    // 1. Let urlRecord be the result of applying the URL parser to url with baseURL.
    let urlRecord

    try {
      urlRecord = new URL(url, baseURL)
    } catch (e) {
      // 3. If urlRecord is failure, then throw a "SyntaxError" DOMException.
      throw new DOMException(e, 'SyntaxError')
    }

    // 4. If urlRecord’s scheme is "http", then set urlRecord’s scheme to "ws".
    if (urlRecord.protocol === 'http:') {
      urlRecord.protocol = 'ws:'
    } else if (urlRecord.protocol === 'https:') {
      // 5. Otherwise, if urlRecord’s scheme is "https", set urlRecord’s scheme to "wss".
      urlRecord.protocol = 'wss:'
    }

    // 6. If urlRecord’s scheme is not "ws" or "wss", then throw a "SyntaxError" DOMException.
    if (urlRecord.protocol !== 'ws:' && urlRecord.protocol !== 'wss:') {
      throw new DOMException(
        `Expected a ws: or wss: protocol, got ${urlRecord.protocol}`,
        'SyntaxError'
      )
    }

    // 7. If urlRecord’s fragment is non-null, then throw a "SyntaxError"
    //    DOMException.
    if (urlRecord.hash || urlRecord.href.endsWith('#')) {
      throw new DOMException('Got fragment', 'SyntaxError')
    }

    // 8. If protocols is a string, set protocols to a sequence consisting
    //    of just that string.
    if (typeof protocols === 'string') {
      protocols = [protocols]
    }

    // 9. If any of the values in protocols occur more than once or otherwise
    //    fail to match the requirements for elements that comprise the value
    //    of `Sec-WebSocket-Protocol` fields as defined by The WebSocket
    //    protocol, then throw a "SyntaxError" DOMException.
    if (protocols.length !== new Set(protocols.map(p => p.toLowerCase())).size) {
      throw new DOMException('Invalid Sec-WebSocket-Protocol value', 'SyntaxError')
    }

    if (protocols.length > 0 && !protocols.every(p => isValidSubprotocol(p))) {
      throw new DOMException('Invalid Sec-WebSocket-Protocol value', 'SyntaxError')
    }

    // 10. Set this's url to urlRecord.
    this[kWebSocketURL] = new URL(urlRecord.href)

    // 11. Let client be this's relevant settings object.

    // 12. Run this step in parallel:

    //    1. Establish a WebSocket connection given urlRecord, protocols,
    //       and client.
    this[kController] = establishWebSocketConnection(
      urlRecord,
      protocols,
      this,
      (response) => this.#onConnectionEstablished(response),
      options
    )

    // Each WebSocket object has an associated ready state, which is a
    // number representing the state of the connection. Initially it must
    // be CONNECTING (0).
    this[kReadyState] = WebSocket.CONNECTING

    // The extensions attribute must initially return the empty string.

    // The protocol attribute must initially return the empty string.

    // Each WebSocket object has an associated binary type, which is a
    // BinaryType. Initially it must be "blob".
    this[kBinaryType] = 'blob'
  }

  /**
   * @see https://websockets.spec.whatwg.org/#dom-websocket-close
   * @param {number|undefined} code
   * @param {string|undefined} reason
   */
  close (code = undefined, reason = undefined) {
    webidl.brandCheck(this, WebSocket)

    if (code !== undefined) {
      code = webidl.converters['unsigned short'](code, { clamp: true })
    }

    if (reason !== undefined) {
      reason = webidl.converters.USVString(reason)
    }

    // 1. If code is present, but is neither an integer equal to 1000 nor an
    //    integer in the range 3000 to 4999, inclusive, throw an
    //    "InvalidAccessError" DOMException.
    if (code !== undefined) {
      if (code !== 1000 && (code < 3000 || code > 4999)) {
        throw new DOMException('invalid code', 'InvalidAccessError')
      }
    }

    let reasonByteLength = 0

    // 2. If reason is present, then run these substeps:
    if (reason !== undefined) {
      // 1. Let reasonBytes be the result of encoding reason.
      // 2. If reasonBytes is longer than 123 bytes, then throw a
      //    "SyntaxError" DOMException.
      reasonByteLength = Buffer.byteLength(reason)

      if (reasonByteLength > 123) {
        throw new DOMException(
          `Reason must be less than 123 bytes; received ${reasonByteLength}`,
          'SyntaxError'
        )
      }
    }

    // 3. Run the first matching steps from the following list:
    if (this[kReadyState] === WebSocket.CLOSING || this[kReadyState] === WebSocket.CLOSED) {
      // If this's ready state is CLOSING (2) or CLOSED (3)
      // Do nothing.
    } else if (!isEstablished(this)) {
      // If the WebSocket connection is not yet established
      // Fail the WebSocket connection and set this's ready state
      // to CLOSING (2).
      failWebsocketConnection(this, 'Connection was closed before it was established.')
      this[kReadyState] = WebSocket.CLOSING
    } else if (!isClosing(this)) {
      // If the WebSocket closing handshake has not yet been started
      // Start the WebSocket closing handshake and set this's ready
      // state to CLOSING (2).
      // - If neither code nor reason is present, the WebSocket Close
      //   message must not have a body.
      // - If code is present, then the status code to use in the
      //   WebSocket Close message must be the integer given by code.
      // - If reason is also present, then reasonBytes must be
      //   provided in the Close message after the status code.

      const frame = new WebsocketFrameSend()

      // If neither code nor reason is present, the WebSocket Close
      // message must not have a body.

      // If code is present, then the status code to use in the
      // WebSocket Close message must be the integer given by code.
      if (code !== undefined && reason === undefined) {
        frame.frameData = Buffer.allocUnsafe(2)
        frame.frameData.writeUInt16BE(code, 0)
      } else if (code !== undefined && reason !== undefined) {
        // If reason is also present, then reasonBytes must be
        // provided in the Close message after the status code.
        frame.frameData = Buffer.allocUnsafe(2 + reasonByteLength)
        frame.frameData.writeUInt16BE(code, 0)
        // the body MAY contain UTF-8-encoded data with value /reason/
        frame.frameData.write(reason, 2, 'utf-8')
      } else {
        frame.frameData = emptyBuffer
      }

      /** @type {import('stream').Duplex} */
      const socket = this[kResponse].socket

      socket.write(frame.createFrame(opcodes.CLOSE), (err) => {
        if (!err) {
          this[kSentClose] = true
        }
      })

      // Upon either sending or receiving a Close control frame, it is said
      // that _The WebSocket Closing Handshake is Started_ and that the
      // WebSocket connection is in the CLOSING state.
      this[kReadyState] = states.CLOSING
    } else {
      // Otherwise
      // Set this's ready state to CLOSING (2).
      this[kReadyState] = WebSocket.CLOSING
    }
  }

  /**
   * @see https://websockets.spec.whatwg.org/#dom-websocket-send
   * @param {NodeJS.TypedArray|ArrayBuffer|Blob|string} data
   */
  send (data) {
    webidl.brandCheck(this, WebSocket)

    webidl.argumentLengthCheck(arguments, 1, { header: 'WebSocket.send' })

    data = webidl.converters.WebSocketSendData(data)

    // 1. If this's ready state is CONNECTING, then throw an
    //    "InvalidStateError" DOMException.
    if (this[kReadyState] === WebSocket.CONNECTING) {
      throw new DOMException('Sent before connected.', 'InvalidStateError')
    }

    // 2. Run the appropriate set of steps from the following list:
    // https://datatracker.ietf.org/doc/html/rfc6455#section-6.1
    // https://datatracker.ietf.org/doc/html/rfc6455#section-5.2

    if (!isEstablished(this) || isClosing(this)) {
      return
    }

    /** @type {import('stream').Duplex} */
    const socket = this[kResponse].socket

    // If data is a string
    if (typeof data === 'string') {
      // If the WebSocket connection is established and the WebSocket
      // closing handshake has not yet started, then the user agent
      // must send a WebSocket Message comprised of the data argument
      // using a text frame opcode; if the data cannot be sent, e.g.
      // because it would need to be buffered but the buffer is full,
      // the user agent must flag the WebSocket as full and then close
      // the WebSocket connection. Any invocation of this method with a
      // string argument that does not throw an exception must increase
      // the bufferedAmount attribute by the number of bytes needed to
      // express the argument as UTF-8.

      const value = Buffer.from(data)
      const frame = new WebsocketFrameSend(value)
      const buffer = frame.createFrame(opcodes.TEXT)

      this.#bufferedAmount += value.byteLength
      socket.write(buffer, () => {
        this.#bufferedAmount -= value.byteLength
      })
    } else if (types.isArrayBuffer(data)) {
      // If the WebSocket connection is established, and the WebSocket
      // closing handshake has not yet started, then the user agent must
      // send a WebSocket Message comprised of data using a binary frame
      // opcode; if the data cannot be sent, e.g. because it would need
      // to be buffered but the buffer is full, the user agent must flag
      // the WebSocket as full and then close the WebSocket connection.
      // The data to be sent is the data stored in the buffer described
      // by the ArrayBuffer object. Any invocation of this method with an
      // ArrayBuffer argument that does not throw an exception must
      // increase the bufferedAmount attribute by the length of the
      // ArrayBuffer in bytes.

      const value = Buffer.from(data)
      const frame = new WebsocketFrameSend(value)
      const buffer = frame.createFrame(opcodes.BINARY)

      this.#bufferedAmount += value.byteLength
      socket.write(buffer, () => {
        this.#bufferedAmount -= value.byteLength
      })
    } else if (ArrayBuffer.isView(data)) {
      // If the WebSocket connection is established, and the WebSocket
      // closing handshake has not yet started, then the user agent must
      // send a WebSocket Message comprised of data using a binary frame
      // opcode; if the data cannot be sent, e.g. because it would need to
      // be buffered but the buffer is full, the user agent must flag the
      // WebSocket as full and then close the WebSocket connection. The
      // data to be sent is the data stored in the section of the buffer
      // described by the ArrayBuffer object that data references. Any
      // invocation of this method with this kind of argument that does
      // not throw an exception must increase the bufferedAmount attribute
      // by the length of data’s buffer in bytes.

      const ab = Buffer.from(data, data.byteOffset, data.byteLength)

      const frame = new WebsocketFrameSend(ab)
      const buffer = frame.createFrame(opcodes.BINARY)

      this.#bufferedAmount += ab.byteLength
      socket.write(buffer, () => {
        this.#bufferedAmount -= ab.byteLength
      })
    } else if (isBlobLike(data)) {
      // If the WebSocket connection is established, and the WebSocket
      // closing handshake has not yet started, then the user agent must
      // send a WebSocket Message comprised of data using a binary frame
      // opcode; if the data cannot be sent, e.g. because it would need to
      // be buffered but the buffer is full, the user agent must flag the
      // WebSocket as full and then close the WebSocket connection. The data
      // to be sent is the raw data represented by the Blob object. Any
      // invocation of this method with a Blob argument that does not throw
      // an exception must increase the bufferedAmount attribute by the size
      // of the Blob object’s raw data, in bytes.

      const frame = new WebsocketFrameSend()

      data.arrayBuffer().then((ab) => {
        const value = Buffer.from(ab)
        frame.frameData = value
        const buffer = frame.createFrame(opcodes.BINARY)

        this.#bufferedAmount += value.byteLength
        socket.write(buffer, () => {
          this.#bufferedAmount -= value.byteLength
        })
      })
    }
  }

  get readyState () {
    webidl.brandCheck(this, WebSocket)

    // The readyState getter steps are to return this's ready state.
    return this[kReadyState]
  }

  get bufferedAmount () {
    webidl.brandCheck(this, WebSocket)

    return this.#bufferedAmount
  }

  get url () {
    webidl.brandCheck(this, WebSocket)

    // The url getter steps are to return this's url, serialized.
    return URLSerializer(this[kWebSocketURL])
  }

  get extensions () {
    webidl.brandCheck(this, WebSocket)

    return this.#extensions
  }

  get protocol () {
    webidl.brandCheck(this, WebSocket)

    return this.#protocol
  }

  get onopen () {
    webidl.brandCheck(this, WebSocket)

    return this.#events.open
  }

  set onopen (fn) {
    webidl.brandCheck(this, WebSocket)

    if (this.#events.open) {
      this.removeEventListener('open', this.#events.open)
    }

    if (typeof fn === 'function') {
      this.#events.open = fn
      this.addEventListener('open', fn)
    } else {
      this.#events.open = null
    }
  }

  get onerror () {
    webidl.brandCheck(this, WebSocket)

    return this.#events.error
  }

  set onerror (fn) {
    webidl.brandCheck(this, WebSocket)

    if (this.#events.error) {
      this.removeEventListener('error', this.#events.error)
    }

    if (typeof fn === 'function') {
      this.#events.error = fn
      this.addEventListener('error', fn)
    } else {
      this.#events.error = null
    }
  }

  get onclose () {
    webidl.brandCheck(this, WebSocket)

    return this.#events.close
  }

  set onclose (fn) {
    webidl.brandCheck(this, WebSocket)

    if (this.#events.close) {
      this.removeEventListener('close', this.#events.close)
    }

    if (typeof fn === 'function') {
      this.#events.close = fn
      this.addEventListener('close', fn)
    } else {
      this.#events.close = null
    }
  }

  get onmessage () {
    webidl.brandCheck(this, WebSocket)

    return this.#events.message
  }

  set onmessage (fn) {
    webidl.brandCheck(this, WebSocket)

    if (this.#events.message) {
      this.removeEventListener('message', this.#events.message)
    }

    if (typeof fn === 'function') {
      this.#events.message = fn
      this.addEventListener('message', fn)
    } else {
      this.#events.message = null
    }
  }

  get binaryType () {
    webidl.brandCheck(this, WebSocket)

    return this[kBinaryType]
  }

  set binaryType (type) {
    webidl.brandCheck(this, WebSocket)

    if (type !== 'blob' && type !== 'arraybuffer') {
      this[kBinaryType] = 'blob'
    } else {
      this[kBinaryType] = type
    }
  }

  /**
   * @see https://websockets.spec.whatwg.org/#feedback-from-the-protocol
   */
  #onConnectionEstablished (response) {
    // processResponse is called when the "response’s header list has been received and initialized."
    // once this happens, the connection is open
    this[kResponse] = response

    const parser = new ByteParser(this)
    parser.on('drain', function onParserDrain () {
      this.ws[kResponse].socket.resume()
    })

    response.socket.ws = this
    this[kByteParser] = parser

    // 1. Change the ready state to OPEN (1).
    this[kReadyState] = states.OPEN

    // 2. Change the extensions attribute’s value to the extensions in use, if
    //    it is not the null value.
    // https://datatracker.ietf.org/doc/html/rfc6455#section-9.1
    const extensions = response.headersList.get('sec-websocket-extensions')

    if (extensions !== null) {
      this.#extensions = extensions
    }

    // 3. Change the protocol attribute’s value to the subprotocol in use, if
    //    it is not the null value.
    // https://datatracker.ietf.org/doc/html/rfc6455#section-1.9
    const protocol = response.headersList.get('sec-websocket-protocol')

    if (protocol !== null) {
      this.#protocol = protocol
    }

    // 4. Fire an event named open at the WebSocket object.
    fireEvent('open', this)
  }
}

// https://websockets.spec.whatwg.org/#dom-websocket-connecting
WebSocket.CONNECTING = WebSocket.prototype.CONNECTING = states.CONNECTING
// https://websockets.spec.whatwg.org/#dom-websocket-open
WebSocket.OPEN = WebSocket.prototype.OPEN = states.OPEN
// https://websockets.spec.whatwg.org/#dom-websocket-closing
WebSocket.CLOSING = WebSocket.prototype.CLOSING = states.CLOSING
// https://websockets.spec.whatwg.org/#dom-websocket-closed
WebSocket.CLOSED = WebSocket.prototype.CLOSED = states.CLOSED

Object.defineProperties(WebSocket.prototype, {
  CONNECTING: staticPropertyDescriptors,
  OPEN: staticPropertyDescriptors,
  CLOSING: staticPropertyDescriptors,
  CLOSED: staticPropertyDescriptors,
  url: kEnumerableProperty,
  readyState: kEnumerableProperty,
  bufferedAmount: kEnumerableProperty,
  onopen: kEnumerableProperty,
  onerror: kEnumerableProperty,
  onclose: kEnumerableProperty,
  close: kEnumerableProperty,
  onmessage: kEnumerableProperty,
  binaryType: kEnumerableProperty,
  send: kEnumerableProperty,
  extensions: kEnumerableProperty,
  protocol: kEnumerableProperty,
  [Symbol.toStringTag]: {
    value: 'WebSocket',
    writable: false,
    enumerable: false,
    configurable: true
  }
})

Object.defineProperties(WebSocket, {
  CONNECTING: staticPropertyDescriptors,
  OPEN: staticPropertyDescriptors,
  CLOSING: staticPropertyDescriptors,
  CLOSED: staticPropertyDescriptors
})

webidl.converters['sequence<DOMString>'] = webidl.sequenceConverter(
  webidl.converters.DOMString
)

webidl.converters['DOMString or sequence<DOMString>'] = function (V) {
  if (webidl.util.Type(V) === 'Object' && Symbol.iterator in V) {
    return webidl.converters['sequence<DOMString>'](V)
  }

  return webidl.converters.DOMString(V)
}

// This implements the propsal made in https://github.com/whatwg/websockets/issues/42
webidl.converters.WebSocketInit = webidl.dictionaryConverter([
  {
    key: 'protocols',
    converter: webidl.converters['DOMString or sequence<DOMString>'],
    get defaultValue () {
      return []
    }
  },
  {
    key: 'dispatcher',
    converter: (V) => V,
    get defaultValue () {
      return getGlobalDispatcher()
    }
  },
  {
    key: 'headers',
    converter: webidl.nullableConverter(webidl.converters.HeadersInit)
  }
])

webidl.converters['DOMString or sequence<DOMString> or WebSocketInit'] = function (V) {
  if (webidl.util.Type(V) === 'Object' && !(Symbol.iterator in V)) {
    return webidl.converters.WebSocketInit(V)
  }

  return { protocols: webidl.converters['DOMString or sequence<DOMString>'](V) }
}

webidl.converters.WebSocketSendData = function (V) {
  if (webidl.util.Type(V) === 'Object') {
    if (isBlobLike(V)) {
      return webidl.converters.Blob(V, { strict: false })
    }

    if (ArrayBuffer.isView(V) || types.isAnyArrayBuffer(V)) {
      return webidl.converters.BufferSource(V)
    }
  }

  return webidl.converters.USVString(V)
}

module.exports = {
  WebSocket
}


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 1751:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186);
const fs = __nccwpck_require__(3292);

async function PrintLogs(directory, clear = false) {
    core.info(directory);
    try {
        const logs = await fs.readdir(directory, { recursive: true });
        for (const log of logs) {
            try {
                const path = `${directory}/${log}`;
                const stat = await fs.stat(path);
                if (!stat.isFile()) { continue; }
                const logContent = await fs.readFile(path, 'utf8');
                core.info(`::group::${log}`);
                core.info(logContent);
                core.info('::endgroup::');
                if (clear) {
                    await fs.unlink(path);
                }
            } catch (error) {
                core.error(`Failed to read log: ${path}\n${error.message}`);
            }
        }
    } catch (error) {
        core.error(`Failed to read logs in ${directory}!\n${error.message}`);
    }
}

module.exports = { PrintLogs }


/***/ }),

/***/ 8303:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186);
const logging = __nccwpck_require__(1751);
const path = __nccwpck_require__(1017);

async function Run() {
    try {
        await logging.PrintLogs(path.join(process.env.RUNNER_TEMP, '.steamworks'));
        await logging.PrintLogs(path.join(process.env.STEAM_CMD, '..', 'logs'), true);
    } catch (error) {
        core.error(error.message);
    }
};

module.exports = { Run }


/***/ }),

/***/ 9265:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186);
const exec = __nccwpck_require__(1514);
const fs = __nccwpck_require__(3292);
const path = __nccwpck_require__(1017);
const steamTotp = __nccwpck_require__(3627);
const logging = __nccwpck_require__(1751);

const steamcmd = 'steamcmd';
const STEAM_DIR = process.env.STEAM_DIR;
const STEAM_CMD = path.join(process.env.STEAM_CMD, '..');
const WORKSPACE = process.env.GITHUB_WORKSPACE;
const RUNNER_TEMP = process.env.RUNNER_TEMP;
const steamworks = path.join(RUNNER_TEMP, '.steamworks');
const build_output = path.join(steamworks, 'buildoutput');

async function Run() {
    let fail = undefined;
    let printLogs = core.isDebug();

    try {
        const args = await getCommandArgs();
        await exec.exec(steamcmd, args);
    } catch (error) {
        printLogs = true;
        fail = error;
    }

    if (printLogs) {
        await logging.PrintLogs(steamworks);
        await logging.PrintLogs(path.join(STEAM_CMD, 'logs'));
    }

    if (fail) {
        core.setFailed(fail);
    }
}

module.exports = { Run }

async function getCommandArgs() {
    if (!STEAM_DIR) {
        throw new Error('STEAM_DIR is not defined.');
    }

    let args = [];
    const username = core.getInput('username', { required: true });
    args.push('+login', username);
    let isLoggedIn = await verify_login(STEAM_DIR);

    if (!isLoggedIn) {
        const config = core.getInput('config');
        if (config) {
            const ssfn = core.getInput('ssfn');
            if (ssfn) {
                const ssfnName = core.getInput('ssfn_name', { required: true });
                const ssfnPath = path.join(STEAM_DIR, ssfnName);
                await fs.writeFile(ssfnPath, Buffer.from(ssfn, 'base64'));
            }
            await fs.writeFile(configPath, Buffer.from(config, 'base64'));
            await fs.access(configPath, fs.constants.R_OK);
        } else {
            const password = core.getInput('password', { required: true });
            let code = core.getInput('code');
            if (!code) {
                const shared_secret = core.getInput('shared_secret', { required: true });
                code = steamTotp.generateAuthCode(shared_secret);
            }
            args.push(password, '+set_steam_guard_code', code);
        }
    }

    let appBuildPath = core.getInput('app_build');

    if (appBuildPath) {
        await fs.access(appBuildPath, fs.constants.R_OK);
        args.push('+run_app_build', `"${appBuildPath}"`, '+quit');
        return args;
    }

    let workshopItemPath = core.getInput('workshop_item');

    if (workshopItemPath) {
        await fs.access(workshopItemPath, fs.constants.R_OK);
        args.push('+workshop_build_item', `"${workshopItemPath}"`, '+quit');
        return args;
    }

    const appId = core.getInput('app_id', { required: true });
    const contentRoot = path.resolve(core.getInput('content_root') || WORKSPACE);
    await fs.access(contentRoot, fs.constants.R_OK);
    const description = core.getInput('description');

    const workshopItemId = core.getInput('workshop_item_id');

    if (workshopItemId) {
        workshopItemPath = await generateWorkshopItemVdf(appId, workshopItemId, contentRoot, description);
        args.push('+workshop_build_item', `"${workshopItemPath}"`, '+quit');
        return args;
    }

    const set_live = core.getInput('set_live');

    const depot_file_exclusions = core.getInput('depot_file_exclusions');
    let depot_file_exclusions_list = undefined;

    if (depot_file_exclusions) {
        depot_file_exclusions_list = depot_file_exclusions.split('\n');
    }

    const install_scripts = core.getInput('install_scripts');
    let install_scripts_list = undefined;

    if (install_scripts) {
        install_scripts_list = install_scripts.split('\n');
    }

    const depots = core.getInput('depots');
    let depots_list = undefined;

    if (depots) {
        depots_list = depots.split('\n');
    }

    appBuildPath = await generateBuildVdf(appId, contentRoot, description, set_live, depot_file_exclusions_list, install_scripts_list, depots_list);
    args.push('+run_app_build', `"${appBuildPath}"`, '+quit');
    return args;
};

async function generateWorkshopItemVdf(appId, workshopItemId, contentFolder, description) {
    await verify_temp_dir();
    const workshopItemPath = path.join(steamworks, 'workshop_item.vdf');
    let workshopItem = `"workshopitem"\n{\n\t"appid" "${appId}"\n\t"publishedfileid" "${workshopItemId}"\n\t"contentfolder" "${contentFolder}"\n`;
    if (description) {
        workshopItem += `\t"description" "${description}"\n`;
    }
    workshopItem += '}';
    core.info(workshopItem);
    await fs.writeFile(workshopItemPath, workshopItem);
    await fs.access(workshopItemPath, fs.constants.R_OK);
    return workshopItemPath;
};

async function generateBuildVdf(appId, contentRoot, description, set_live, depot_file_exclusions_list, install_scripts_list, depots_list) {
    await verify_temp_dir();
    const appBuildPath = path.join(steamworks, 'app_build.vdf');
    let appBuild = `"AppBuild"\n{\n`;
    appBuild += `\t"AppID" "${appId}"\n`;
    appBuild += `\t"ContentRoot" "${contentRoot}"\n`;
    appBuild += `\t"BuildOutput" "${build_output}"\n`;
    if (description) {
        appBuild += `\t"Desc" "${description}"\n`;
    }
    if (set_live) {
        appBuild += `\t"SetLive" "${set_live}"\n`;
    }
    if (depots_list) {
        appBuild += `\t"Depots"\n\t{\n`;
        let depotIndex = 1;
        depots_list.forEach(depot => {
            appBuild += `\t\t"${appId + depotIndex}" "${depot}"\n`;
            depotIndex++;
        });
        appBuild += `\t}\n`;
    } else {
        appBuild += `\t"Depots"\n\t{\n`;
        appBuild += `\t\t"DepotID" "${appId + 1}"\n`;
        appBuild += `\t\t"FileMapping"\n\t\t{\n`;
        appBuild += `\t\t\t"LocalPath" "*" // all files from content root folder\n`;
        appBuild += `\t\t\t"DepotPath" "." // mapped into the root of the depot\n`;
        appBuild += `\t\t\t"recursive" "1" // include all subfolders\n`;
        appBuild += `\t\t}\n`;
        appBuild += `\t\t"FileExclusion" "*.pdb" // don't include symbols\n`;
        appBuild += `\t\t"FileExclusion" "**/*_BurstDebugInformation_DoNotShip*" // don't include unity build folders\n`;
        appBuild += `\t\t"FileExclusion" "**/*_BackUpThisFolder_ButDontShipItWithYourGame*" // don't include unity build folders\n`;

        if (depot_file_exclusions_list) {
            depot_file_exclusions_list.forEach(exclusion => {
                appBuild += `\t\t"FileExclusion" "${exclusion}"\n`;
            });
        }

        if (install_scripts_list) {
            install_scripts_list.forEach(script => {
                appBuild += `\t\t"InstallScript" "${script}"\n`;
            });
        }

        appBuild += `\t}\n`;
    }

    appBuild += '}';
    core.info(appBuild);
    await fs.writeFile(appBuildPath, appBuild);
    await fs.access(appBuildPath, fs.constants.R_OK);
    return appBuildPath;
}

async function verify_login(directory) {
    const configPath = path.join(directory, 'config', 'config.vdf');

    try {
        await fs.access(configPath, fs.constants.R_OK);
        return true;
    } catch (error) {
        if (directory === STEAM_CMD) { return false; }
        return await verify_login(STEAM_CMD);
    }
}

async function verify_temp_dir() {
    try {
        await fs.access(steamworks, fs.constants.R_OK);
        await fs.rm(steamworks, { recursive: true });
    } catch (error) {
        // do nothing
    }
    await fs.mkdir(steamworks);
    await fs.mkdir(build_output);
}


/***/ }),

/***/ 4978:
/***/ ((module) => {

module.exports = eval("require")("util/types");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 852:
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6206:
/***/ ((module) => {

"use strict";
module.exports = require("console");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 7643:
/***/ ((module) => {

"use strict";
module.exports = require("diagnostics_channel");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3292:
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5158:
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 5673:
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ 4492:
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ 7261:
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4074:
/***/ ((module) => {

"use strict";
module.exports = require("perf_hooks");

/***/ }),

/***/ 3477:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 5356:
/***/ ((module) => {

"use strict";
module.exports = require("stream/web");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 1267:
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 2960:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const WritableStream = (__nccwpck_require__(4492).Writable)
const inherits = (__nccwpck_require__(7261).inherits)

const StreamSearch = __nccwpck_require__(1142)

const PartStream = __nccwpck_require__(1620)
const HeaderParser = __nccwpck_require__(2032)

const DASH = 45
const B_ONEDASH = Buffer.from('-')
const B_CRLF = Buffer.from('\r\n')
const EMPTY_FN = function () {}

function Dicer (cfg) {
  if (!(this instanceof Dicer)) { return new Dicer(cfg) }
  WritableStream.call(this, cfg)

  if (!cfg || (!cfg.headerFirst && typeof cfg.boundary !== 'string')) { throw new TypeError('Boundary required') }

  if (typeof cfg.boundary === 'string') { this.setBoundary(cfg.boundary) } else { this._bparser = undefined }

  this._headerFirst = cfg.headerFirst

  this._dashes = 0
  this._parts = 0
  this._finished = false
  this._realFinish = false
  this._isPreamble = true
  this._justMatched = false
  this._firstWrite = true
  this._inHeader = true
  this._part = undefined
  this._cb = undefined
  this._ignoreData = false
  this._partOpts = { highWaterMark: cfg.partHwm }
  this._pause = false

  const self = this
  this._hparser = new HeaderParser(cfg)
  this._hparser.on('header', function (header) {
    self._inHeader = false
    self._part.emit('header', header)
  })
}
inherits(Dicer, WritableStream)

Dicer.prototype.emit = function (ev) {
  if (ev === 'finish' && !this._realFinish) {
    if (!this._finished) {
      const self = this
      process.nextTick(function () {
        self.emit('error', new Error('Unexpected end of multipart data'))
        if (self._part && !self._ignoreData) {
          const type = (self._isPreamble ? 'Preamble' : 'Part')
          self._part.emit('error', new Error(type + ' terminated early due to unexpected end of multipart data'))
          self._part.push(null)
          process.nextTick(function () {
            self._realFinish = true
            self.emit('finish')
            self._realFinish = false
          })
          return
        }
        self._realFinish = true
        self.emit('finish')
        self._realFinish = false
      })
    }
  } else { WritableStream.prototype.emit.apply(this, arguments) }
}

Dicer.prototype._write = function (data, encoding, cb) {
  // ignore unexpected data (e.g. extra trailer data after finished)
  if (!this._hparser && !this._bparser) { return cb() }

  if (this._headerFirst && this._isPreamble) {
    if (!this._part) {
      this._part = new PartStream(this._partOpts)
      if (this.listenerCount('preamble') !== 0) { this.emit('preamble', this._part) } else { this._ignore() }
    }
    const r = this._hparser.push(data)
    if (!this._inHeader && r !== undefined && r < data.length) { data = data.slice(r) } else { return cb() }
  }

  // allows for "easier" testing
  if (this._firstWrite) {
    this._bparser.push(B_CRLF)
    this._firstWrite = false
  }

  this._bparser.push(data)

  if (this._pause) { this._cb = cb } else { cb() }
}

Dicer.prototype.reset = function () {
  this._part = undefined
  this._bparser = undefined
  this._hparser = undefined
}

Dicer.prototype.setBoundary = function (boundary) {
  const self = this
  this._bparser = new StreamSearch('\r\n--' + boundary)
  this._bparser.on('info', function (isMatch, data, start, end) {
    self._oninfo(isMatch, data, start, end)
  })
}

Dicer.prototype._ignore = function () {
  if (this._part && !this._ignoreData) {
    this._ignoreData = true
    this._part.on('error', EMPTY_FN)
    // we must perform some kind of read on the stream even though we are
    // ignoring the data, otherwise node's Readable stream will not emit 'end'
    // after pushing null to the stream
    this._part.resume()
  }
}

Dicer.prototype._oninfo = function (isMatch, data, start, end) {
  let buf; const self = this; let i = 0; let r; let shouldWriteMore = true

  if (!this._part && this._justMatched && data) {
    while (this._dashes < 2 && (start + i) < end) {
      if (data[start + i] === DASH) {
        ++i
        ++this._dashes
      } else {
        if (this._dashes) { buf = B_ONEDASH }
        this._dashes = 0
        break
      }
    }
    if (this._dashes === 2) {
      if ((start + i) < end && this.listenerCount('trailer') !== 0) { this.emit('trailer', data.slice(start + i, end)) }
      this.reset()
      this._finished = true
      // no more parts will be added
      if (self._parts === 0) {
        self._realFinish = true
        self.emit('finish')
        self._realFinish = false
      }
    }
    if (this._dashes) { return }
  }
  if (this._justMatched) { this._justMatched = false }
  if (!this._part) {
    this._part = new PartStream(this._partOpts)
    this._part._read = function (n) {
      self._unpause()
    }
    if (this._isPreamble && this.listenerCount('preamble') !== 0) {
      this.emit('preamble', this._part)
    } else if (this._isPreamble !== true && this.listenerCount('part') !== 0) {
      this.emit('part', this._part)
    } else {
      this._ignore()
    }
    if (!this._isPreamble) { this._inHeader = true }
  }
  if (data && start < end && !this._ignoreData) {
    if (this._isPreamble || !this._inHeader) {
      if (buf) { shouldWriteMore = this._part.push(buf) }
      shouldWriteMore = this._part.push(data.slice(start, end))
      if (!shouldWriteMore) { this._pause = true }
    } else if (!this._isPreamble && this._inHeader) {
      if (buf) { this._hparser.push(buf) }
      r = this._hparser.push(data.slice(start, end))
      if (!this._inHeader && r !== undefined && r < end) { this._oninfo(false, data, start + r, end) }
    }
  }
  if (isMatch) {
    this._hparser.reset()
    if (this._isPreamble) { this._isPreamble = false } else {
      if (start !== end) {
        ++this._parts
        this._part.on('end', function () {
          if (--self._parts === 0) {
            if (self._finished) {
              self._realFinish = true
              self.emit('finish')
              self._realFinish = false
            } else {
              self._unpause()
            }
          }
        })
      }
    }
    this._part.push(null)
    this._part = undefined
    this._ignoreData = false
    this._justMatched = true
    this._dashes = 0
  }
}

Dicer.prototype._unpause = function () {
  if (!this._pause) { return }

  this._pause = false
  if (this._cb) {
    const cb = this._cb
    this._cb = undefined
    cb()
  }
}

module.exports = Dicer


/***/ }),

/***/ 2032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const EventEmitter = (__nccwpck_require__(5673).EventEmitter)
const inherits = (__nccwpck_require__(7261).inherits)
const getLimit = __nccwpck_require__(1467)

const StreamSearch = __nccwpck_require__(1142)

const B_DCRLF = Buffer.from('\r\n\r\n')
const RE_CRLF = /\r\n/g
const RE_HDR = /^([^:]+):[ \t]?([\x00-\xFF]+)?$/ // eslint-disable-line no-control-regex

function HeaderParser (cfg) {
  EventEmitter.call(this)

  cfg = cfg || {}
  const self = this
  this.nread = 0
  this.maxed = false
  this.npairs = 0
  this.maxHeaderPairs = getLimit(cfg, 'maxHeaderPairs', 2000)
  this.maxHeaderSize = getLimit(cfg, 'maxHeaderSize', 80 * 1024)
  this.buffer = ''
  this.header = {}
  this.finished = false
  this.ss = new StreamSearch(B_DCRLF)
  this.ss.on('info', function (isMatch, data, start, end) {
    if (data && !self.maxed) {
      if (self.nread + end - start >= self.maxHeaderSize) {
        end = self.maxHeaderSize - self.nread + start
        self.nread = self.maxHeaderSize
        self.maxed = true
      } else { self.nread += (end - start) }

      self.buffer += data.toString('binary', start, end)
    }
    if (isMatch) { self._finish() }
  })
}
inherits(HeaderParser, EventEmitter)

HeaderParser.prototype.push = function (data) {
  const r = this.ss.push(data)
  if (this.finished) { return r }
}

HeaderParser.prototype.reset = function () {
  this.finished = false
  this.buffer = ''
  this.header = {}
  this.ss.reset()
}

HeaderParser.prototype._finish = function () {
  if (this.buffer) { this._parseHeader() }
  this.ss.matches = this.ss.maxMatches
  const header = this.header
  this.header = {}
  this.buffer = ''
  this.finished = true
  this.nread = this.npairs = 0
  this.maxed = false
  this.emit('header', header)
}

HeaderParser.prototype._parseHeader = function () {
  if (this.npairs === this.maxHeaderPairs) { return }

  const lines = this.buffer.split(RE_CRLF)
  const len = lines.length
  let m, h

  for (var i = 0; i < len; ++i) { // eslint-disable-line no-var
    if (lines[i].length === 0) { continue }
    if (lines[i][0] === '\t' || lines[i][0] === ' ') {
      // folded header content
      // RFC2822 says to just remove the CRLF and not the whitespace following
      // it, so we follow the RFC and include the leading whitespace ...
      if (h) {
        this.header[h][this.header[h].length - 1] += lines[i]
        continue
      }
    }

    const posColon = lines[i].indexOf(':')
    if (
      posColon === -1 ||
      posColon === 0
    ) {
      return
    }
    m = RE_HDR.exec(lines[i])
    h = m[1].toLowerCase()
    this.header[h] = this.header[h] || []
    this.header[h].push((m[2] || ''))
    if (++this.npairs === this.maxHeaderPairs) { break }
  }
}

module.exports = HeaderParser


/***/ }),

/***/ 1620:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const inherits = (__nccwpck_require__(7261).inherits)
const ReadableStream = (__nccwpck_require__(4492).Readable)

function PartStream (opts) {
  ReadableStream.call(this, opts)
}
inherits(PartStream, ReadableStream)

PartStream.prototype._read = function (n) {}

module.exports = PartStream


/***/ }),

/***/ 1142:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * Copyright Brian White. All rights reserved.
 *
 * @see https://github.com/mscdex/streamsearch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * Based heavily on the Streaming Boyer-Moore-Horspool C++ implementation
 * by Hongli Lai at: https://github.com/FooBarWidget/boyer-moore-horspool
 */
const EventEmitter = (__nccwpck_require__(5673).EventEmitter)
const inherits = (__nccwpck_require__(7261).inherits)

function SBMH (needle) {
  if (typeof needle === 'string') {
    needle = Buffer.from(needle)
  }

  if (!Buffer.isBuffer(needle)) {
    throw new TypeError('The needle has to be a String or a Buffer.')
  }

  const needleLength = needle.length

  if (needleLength === 0) {
    throw new Error('The needle cannot be an empty String/Buffer.')
  }

  if (needleLength > 256) {
    throw new Error('The needle cannot have a length bigger than 256.')
  }

  this.maxMatches = Infinity
  this.matches = 0

  this._occ = new Array(256)
    .fill(needleLength) // Initialize occurrence table.
  this._lookbehind_size = 0
  this._needle = needle
  this._bufpos = 0

  this._lookbehind = Buffer.alloc(needleLength)

  // Populate occurrence table with analysis of the needle,
  // ignoring last letter.
  for (var i = 0; i < needleLength - 1; ++i) { // eslint-disable-line no-var
    this._occ[needle[i]] = needleLength - 1 - i
  }
}
inherits(SBMH, EventEmitter)

SBMH.prototype.reset = function () {
  this._lookbehind_size = 0
  this.matches = 0
  this._bufpos = 0
}

SBMH.prototype.push = function (chunk, pos) {
  if (!Buffer.isBuffer(chunk)) {
    chunk = Buffer.from(chunk, 'binary')
  }
  const chlen = chunk.length
  this._bufpos = pos || 0
  let r
  while (r !== chlen && this.matches < this.maxMatches) { r = this._sbmh_feed(chunk) }
  return r
}

SBMH.prototype._sbmh_feed = function (data) {
  const len = data.length
  const needle = this._needle
  const needleLength = needle.length
  const lastNeedleChar = needle[needleLength - 1]

  // Positive: points to a position in `data`
  //           pos == 3 points to data[3]
  // Negative: points to a position in the lookbehind buffer
  //           pos == -2 points to lookbehind[lookbehind_size - 2]
  let pos = -this._lookbehind_size
  let ch

  if (pos < 0) {
    // Lookbehind buffer is not empty. Perform Boyer-Moore-Horspool
    // search with character lookup code that considers both the
    // lookbehind buffer and the current round's haystack data.
    //
    // Loop until
    //   there is a match.
    // or until
    //   we've moved past the position that requires the
    //   lookbehind buffer. In this case we switch to the
    //   optimized loop.
    // or until
    //   the character to look at lies outside the haystack.
    while (pos < 0 && pos <= len - needleLength) {
      ch = this._sbmh_lookup_char(data, pos + needleLength - 1)

      if (
        ch === lastNeedleChar &&
        this._sbmh_memcmp(data, pos, needleLength - 1)
      ) {
        this._lookbehind_size = 0
        ++this.matches
        this.emit('info', true)

        return (this._bufpos = pos + needleLength)
      }
      pos += this._occ[ch]
    }

    // No match.

    if (pos < 0) {
      // There's too few data for Boyer-Moore-Horspool to run,
      // so let's use a different algorithm to skip as much as
      // we can.
      // Forward pos until
      //   the trailing part of lookbehind + data
      //   looks like the beginning of the needle
      // or until
      //   pos == 0
      while (pos < 0 && !this._sbmh_memcmp(data, pos, len - pos)) { ++pos }
    }

    if (pos >= 0) {
      // Discard lookbehind buffer.
      this.emit('info', false, this._lookbehind, 0, this._lookbehind_size)
      this._lookbehind_size = 0
    } else {
      // Cut off part of the lookbehind buffer that has
      // been processed and append the entire haystack
      // into it.
      const bytesToCutOff = this._lookbehind_size + pos
      if (bytesToCutOff > 0) {
        // The cut off data is guaranteed not to contain the needle.
        this.emit('info', false, this._lookbehind, 0, bytesToCutOff)
      }

      this._lookbehind.copy(this._lookbehind, 0, bytesToCutOff,
        this._lookbehind_size - bytesToCutOff)
      this._lookbehind_size -= bytesToCutOff

      data.copy(this._lookbehind, this._lookbehind_size)
      this._lookbehind_size += len

      this._bufpos = len
      return len
    }
  }

  pos += (pos >= 0) * this._bufpos

  // Lookbehind buffer is now empty. We only need to check if the
  // needle is in the haystack.
  if (data.indexOf(needle, pos) !== -1) {
    pos = data.indexOf(needle, pos)
    ++this.matches
    if (pos > 0) { this.emit('info', true, data, this._bufpos, pos) } else { this.emit('info', true) }

    return (this._bufpos = pos + needleLength)
  } else {
    pos = len - needleLength
  }

  // There was no match. If there's trailing haystack data that we cannot
  // match yet using the Boyer-Moore-Horspool algorithm (because the trailing
  // data is less than the needle size) then match using a modified
  // algorithm that starts matching from the beginning instead of the end.
  // Whatever trailing data is left after running this algorithm is added to
  // the lookbehind buffer.
  while (
    pos < len &&
    (
      data[pos] !== needle[0] ||
      (
        (Buffer.compare(
          data.subarray(pos, pos + len - pos),
          needle.subarray(0, len - pos)
        ) !== 0)
      )
    )
  ) {
    ++pos
  }
  if (pos < len) {
    data.copy(this._lookbehind, 0, pos, pos + (len - pos))
    this._lookbehind_size = len - pos
  }

  // Everything until pos is guaranteed not to contain needle data.
  if (pos > 0) { this.emit('info', false, data, this._bufpos, pos < len ? pos : len) }

  this._bufpos = len
  return len
}

SBMH.prototype._sbmh_lookup_char = function (data, pos) {
  return (pos < 0)
    ? this._lookbehind[this._lookbehind_size + pos]
    : data[pos]
}

SBMH.prototype._sbmh_memcmp = function (data, pos, len) {
  for (var i = 0; i < len; ++i) { // eslint-disable-line no-var
    if (this._sbmh_lookup_char(data, pos + i) !== this._needle[i]) { return false }
  }
  return true
}

module.exports = SBMH


/***/ }),

/***/ 727:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const WritableStream = (__nccwpck_require__(4492).Writable)
const { inherits } = __nccwpck_require__(7261)
const Dicer = __nccwpck_require__(2960)

const MultipartParser = __nccwpck_require__(2183)
const UrlencodedParser = __nccwpck_require__(8306)
const parseParams = __nccwpck_require__(1854)

function Busboy (opts) {
  if (!(this instanceof Busboy)) { return new Busboy(opts) }

  if (typeof opts !== 'object') {
    throw new TypeError('Busboy expected an options-Object.')
  }
  if (typeof opts.headers !== 'object') {
    throw new TypeError('Busboy expected an options-Object with headers-attribute.')
  }
  if (typeof opts.headers['content-type'] !== 'string') {
    throw new TypeError('Missing Content-Type-header.')
  }

  const {
    headers,
    ...streamOptions
  } = opts

  this.opts = {
    autoDestroy: false,
    ...streamOptions
  }
  WritableStream.call(this, this.opts)

  this._done = false
  this._parser = this.getParserByHeaders(headers)
  this._finished = false
}
inherits(Busboy, WritableStream)

Busboy.prototype.emit = function (ev) {
  if (ev === 'finish') {
    if (!this._done) {
      this._parser?.end()
      return
    } else if (this._finished) {
      return
    }
    this._finished = true
  }
  WritableStream.prototype.emit.apply(this, arguments)
}

Busboy.prototype.getParserByHeaders = function (headers) {
  const parsed = parseParams(headers['content-type'])

  const cfg = {
    defCharset: this.opts.defCharset,
    fileHwm: this.opts.fileHwm,
    headers,
    highWaterMark: this.opts.highWaterMark,
    isPartAFile: this.opts.isPartAFile,
    limits: this.opts.limits,
    parsedConType: parsed,
    preservePath: this.opts.preservePath
  }

  if (MultipartParser.detect.test(parsed[0])) {
    return new MultipartParser(this, cfg)
  }
  if (UrlencodedParser.detect.test(parsed[0])) {
    return new UrlencodedParser(this, cfg)
  }
  throw new Error('Unsupported Content-Type.')
}

Busboy.prototype._write = function (chunk, encoding, cb) {
  this._parser.write(chunk, cb)
}

module.exports = Busboy
module.exports["default"] = Busboy
module.exports.Busboy = Busboy

module.exports.Dicer = Dicer


/***/ }),

/***/ 2183:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// TODO:
//  * support 1 nested multipart level
//    (see second multipart example here:
//     http://www.w3.org/TR/html401/interact/forms.html#didx-multipartform-data)
//  * support limits.fieldNameSize
//     -- this will require modifications to utils.parseParams

const { Readable } = __nccwpck_require__(4492)
const { inherits } = __nccwpck_require__(7261)

const Dicer = __nccwpck_require__(2960)

const parseParams = __nccwpck_require__(1854)
const decodeText = __nccwpck_require__(4619)
const basename = __nccwpck_require__(8647)
const getLimit = __nccwpck_require__(1467)

const RE_BOUNDARY = /^boundary$/i
const RE_FIELD = /^form-data$/i
const RE_CHARSET = /^charset$/i
const RE_FILENAME = /^filename$/i
const RE_NAME = /^name$/i

Multipart.detect = /^multipart\/form-data/i
function Multipart (boy, cfg) {
  let i
  let len
  const self = this
  let boundary
  const limits = cfg.limits
  const isPartAFile = cfg.isPartAFile || ((fieldName, contentType, fileName) => (contentType === 'application/octet-stream' || fileName !== undefined))
  const parsedConType = cfg.parsedConType || []
  const defCharset = cfg.defCharset || 'utf8'
  const preservePath = cfg.preservePath
  const fileOpts = { highWaterMark: cfg.fileHwm }

  for (i = 0, len = parsedConType.length; i < len; ++i) {
    if (Array.isArray(parsedConType[i]) &&
      RE_BOUNDARY.test(parsedConType[i][0])) {
      boundary = parsedConType[i][1]
      break
    }
  }

  function checkFinished () {
    if (nends === 0 && finished && !boy._done) {
      finished = false
      self.end()
    }
  }

  if (typeof boundary !== 'string') { throw new Error('Multipart: Boundary not found') }

  const fieldSizeLimit = getLimit(limits, 'fieldSize', 1 * 1024 * 1024)
  const fileSizeLimit = getLimit(limits, 'fileSize', Infinity)
  const filesLimit = getLimit(limits, 'files', Infinity)
  const fieldsLimit = getLimit(limits, 'fields', Infinity)
  const partsLimit = getLimit(limits, 'parts', Infinity)
  const headerPairsLimit = getLimit(limits, 'headerPairs', 2000)
  const headerSizeLimit = getLimit(limits, 'headerSize', 80 * 1024)

  let nfiles = 0
  let nfields = 0
  let nends = 0
  let curFile
  let curField
  let finished = false

  this._needDrain = false
  this._pause = false
  this._cb = undefined
  this._nparts = 0
  this._boy = boy

  const parserCfg = {
    boundary,
    maxHeaderPairs: headerPairsLimit,
    maxHeaderSize: headerSizeLimit,
    partHwm: fileOpts.highWaterMark,
    highWaterMark: cfg.highWaterMark
  }

  this.parser = new Dicer(parserCfg)
  this.parser.on('drain', function () {
    self._needDrain = false
    if (self._cb && !self._pause) {
      const cb = self._cb
      self._cb = undefined
      cb()
    }
  }).on('part', function onPart (part) {
    if (++self._nparts > partsLimit) {
      self.parser.removeListener('part', onPart)
      self.parser.on('part', skipPart)
      boy.hitPartsLimit = true
      boy.emit('partsLimit')
      return skipPart(part)
    }

    // hack because streams2 _always_ doesn't emit 'end' until nextTick, so let
    // us emit 'end' early since we know the part has ended if we are already
    // seeing the next part
    if (curField) {
      const field = curField
      field.emit('end')
      field.removeAllListeners('end')
    }

    part.on('header', function (header) {
      let contype
      let fieldname
      let parsed
      let charset
      let encoding
      let filename
      let nsize = 0

      if (header['content-type']) {
        parsed = parseParams(header['content-type'][0])
        if (parsed[0]) {
          contype = parsed[0].toLowerCase()
          for (i = 0, len = parsed.length; i < len; ++i) {
            if (RE_CHARSET.test(parsed[i][0])) {
              charset = parsed[i][1].toLowerCase()
              break
            }
          }
        }
      }

      if (contype === undefined) { contype = 'text/plain' }
      if (charset === undefined) { charset = defCharset }

      if (header['content-disposition']) {
        parsed = parseParams(header['content-disposition'][0])
        if (!RE_FIELD.test(parsed[0])) { return skipPart(part) }
        for (i = 0, len = parsed.length; i < len; ++i) {
          if (RE_NAME.test(parsed[i][0])) {
            fieldname = parsed[i][1]
          } else if (RE_FILENAME.test(parsed[i][0])) {
            filename = parsed[i][1]
            if (!preservePath) { filename = basename(filename) }
          }
        }
      } else { return skipPart(part) }

      if (header['content-transfer-encoding']) { encoding = header['content-transfer-encoding'][0].toLowerCase() } else { encoding = '7bit' }

      let onData,
        onEnd

      if (isPartAFile(fieldname, contype, filename)) {
        // file/binary field
        if (nfiles === filesLimit) {
          if (!boy.hitFilesLimit) {
            boy.hitFilesLimit = true
            boy.emit('filesLimit')
          }
          return skipPart(part)
        }

        ++nfiles

        if (boy.listenerCount('file') === 0) {
          self.parser._ignore()
          return
        }

        ++nends
        const file = new FileStream(fileOpts)
        curFile = file
        file.on('end', function () {
          --nends
          self._pause = false
          checkFinished()
          if (self._cb && !self._needDrain) {
            const cb = self._cb
            self._cb = undefined
            cb()
          }
        })
        file._read = function (n) {
          if (!self._pause) { return }
          self._pause = false
          if (self._cb && !self._needDrain) {
            const cb = self._cb
            self._cb = undefined
            cb()
          }
        }
        boy.emit('file', fieldname, file, filename, encoding, contype)

        onData = function (data) {
          if ((nsize += data.length) > fileSizeLimit) {
            const extralen = fileSizeLimit - nsize + data.length
            if (extralen > 0) { file.push(data.slice(0, extralen)) }
            file.truncated = true
            file.bytesRead = fileSizeLimit
            part.removeAllListeners('data')
            file.emit('limit')
            return
          } else if (!file.push(data)) { self._pause = true }

          file.bytesRead = nsize
        }

        onEnd = function () {
          curFile = undefined
          file.push(null)
        }
      } else {
        // non-file field
        if (nfields === fieldsLimit) {
          if (!boy.hitFieldsLimit) {
            boy.hitFieldsLimit = true
            boy.emit('fieldsLimit')
          }
          return skipPart(part)
        }

        ++nfields
        ++nends
        let buffer = ''
        let truncated = false
        curField = part

        onData = function (data) {
          if ((nsize += data.length) > fieldSizeLimit) {
            const extralen = (fieldSizeLimit - (nsize - data.length))
            buffer += data.toString('binary', 0, extralen)
            truncated = true
            part.removeAllListeners('data')
          } else { buffer += data.toString('binary') }
        }

        onEnd = function () {
          curField = undefined
          if (buffer.length) { buffer = decodeText(buffer, 'binary', charset) }
          boy.emit('field', fieldname, buffer, false, truncated, encoding, contype)
          --nends
          checkFinished()
        }
      }

      /* As of node@2efe4ab761666 (v0.10.29+/v0.11.14+), busboy had become
         broken. Streams2/streams3 is a huge black box of confusion, but
         somehow overriding the sync state seems to fix things again (and still
         seems to work for previous node versions).
      */
      part._readableState.sync = false

      part.on('data', onData)
      part.on('end', onEnd)
    }).on('error', function (err) {
      if (curFile) { curFile.emit('error', err) }
    })
  }).on('error', function (err) {
    boy.emit('error', err)
  }).on('finish', function () {
    finished = true
    checkFinished()
  })
}

Multipart.prototype.write = function (chunk, cb) {
  const r = this.parser.write(chunk)
  if (r && !this._pause) {
    cb()
  } else {
    this._needDrain = !r
    this._cb = cb
  }
}

Multipart.prototype.end = function () {
  const self = this

  if (self.parser.writable) {
    self.parser.end()
  } else if (!self._boy._done) {
    process.nextTick(function () {
      self._boy._done = true
      self._boy.emit('finish')
    })
  }
}

function skipPart (part) {
  part.resume()
}

function FileStream (opts) {
  Readable.call(this, opts)

  this.bytesRead = 0

  this.truncated = false
}

inherits(FileStream, Readable)

FileStream.prototype._read = function (n) {}

module.exports = Multipart


/***/ }),

/***/ 8306:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Decoder = __nccwpck_require__(7100)
const decodeText = __nccwpck_require__(4619)
const getLimit = __nccwpck_require__(1467)

const RE_CHARSET = /^charset$/i

UrlEncoded.detect = /^application\/x-www-form-urlencoded/i
function UrlEncoded (boy, cfg) {
  const limits = cfg.limits
  const parsedConType = cfg.parsedConType
  this.boy = boy

  this.fieldSizeLimit = getLimit(limits, 'fieldSize', 1 * 1024 * 1024)
  this.fieldNameSizeLimit = getLimit(limits, 'fieldNameSize', 100)
  this.fieldsLimit = getLimit(limits, 'fields', Infinity)

  let charset
  for (var i = 0, len = parsedConType.length; i < len; ++i) { // eslint-disable-line no-var
    if (Array.isArray(parsedConType[i]) &&
        RE_CHARSET.test(parsedConType[i][0])) {
      charset = parsedConType[i][1].toLowerCase()
      break
    }
  }

  if (charset === undefined) { charset = cfg.defCharset || 'utf8' }

  this.decoder = new Decoder()
  this.charset = charset
  this._fields = 0
  this._state = 'key'
  this._checkingBytes = true
  this._bytesKey = 0
  this._bytesVal = 0
  this._key = ''
  this._val = ''
  this._keyTrunc = false
  this._valTrunc = false
  this._hitLimit = false
}

UrlEncoded.prototype.write = function (data, cb) {
  if (this._fields === this.fieldsLimit) {
    if (!this.boy.hitFieldsLimit) {
      this.boy.hitFieldsLimit = true
      this.boy.emit('fieldsLimit')
    }
    return cb()
  }

  let idxeq; let idxamp; let i; let p = 0; const len = data.length

  while (p < len) {
    if (this._state === 'key') {
      idxeq = idxamp = undefined
      for (i = p; i < len; ++i) {
        if (!this._checkingBytes) { ++p }
        if (data[i] === 0x3D/* = */) {
          idxeq = i
          break
        } else if (data[i] === 0x26/* & */) {
          idxamp = i
          break
        }
        if (this._checkingBytes && this._bytesKey === this.fieldNameSizeLimit) {
          this._hitLimit = true
          break
        } else if (this._checkingBytes) { ++this._bytesKey }
      }

      if (idxeq !== undefined) {
        // key with assignment
        if (idxeq > p) { this._key += this.decoder.write(data.toString('binary', p, idxeq)) }
        this._state = 'val'

        this._hitLimit = false
        this._checkingBytes = true
        this._val = ''
        this._bytesVal = 0
        this._valTrunc = false
        this.decoder.reset()

        p = idxeq + 1
      } else if (idxamp !== undefined) {
        // key with no assignment
        ++this._fields
        let key; const keyTrunc = this._keyTrunc
        if (idxamp > p) { key = (this._key += this.decoder.write(data.toString('binary', p, idxamp))) } else { key = this._key }

        this._hitLimit = false
        this._checkingBytes = true
        this._key = ''
        this._bytesKey = 0
        this._keyTrunc = false
        this.decoder.reset()

        if (key.length) {
          this.boy.emit('field', decodeText(key, 'binary', this.charset),
            '',
            keyTrunc,
            false)
        }

        p = idxamp + 1
        if (this._fields === this.fieldsLimit) { return cb() }
      } else if (this._hitLimit) {
        // we may not have hit the actual limit if there are encoded bytes...
        if (i > p) { this._key += this.decoder.write(data.toString('binary', p, i)) }
        p = i
        if ((this._bytesKey = this._key.length) === this.fieldNameSizeLimit) {
          // yep, we actually did hit the limit
          this._checkingBytes = false
          this._keyTrunc = true
        }
      } else {
        if (p < len) { this._key += this.decoder.write(data.toString('binary', p)) }
        p = len
      }
    } else {
      idxamp = undefined
      for (i = p; i < len; ++i) {
        if (!this._checkingBytes) { ++p }
        if (data[i] === 0x26/* & */) {
          idxamp = i
          break
        }
        if (this._checkingBytes && this._bytesVal === this.fieldSizeLimit) {
          this._hitLimit = true
          break
        } else if (this._checkingBytes) { ++this._bytesVal }
      }

      if (idxamp !== undefined) {
        ++this._fields
        if (idxamp > p) { this._val += this.decoder.write(data.toString('binary', p, idxamp)) }
        this.boy.emit('field', decodeText(this._key, 'binary', this.charset),
          decodeText(this._val, 'binary', this.charset),
          this._keyTrunc,
          this._valTrunc)
        this._state = 'key'

        this._hitLimit = false
        this._checkingBytes = true
        this._key = ''
        this._bytesKey = 0
        this._keyTrunc = false
        this.decoder.reset()

        p = idxamp + 1
        if (this._fields === this.fieldsLimit) { return cb() }
      } else if (this._hitLimit) {
        // we may not have hit the actual limit if there are encoded bytes...
        if (i > p) { this._val += this.decoder.write(data.toString('binary', p, i)) }
        p = i
        if ((this._val === '' && this.fieldSizeLimit === 0) ||
            (this._bytesVal = this._val.length) === this.fieldSizeLimit) {
          // yep, we actually did hit the limit
          this._checkingBytes = false
          this._valTrunc = true
        }
      } else {
        if (p < len) { this._val += this.decoder.write(data.toString('binary', p)) }
        p = len
      }
    }
  }
  cb()
}

UrlEncoded.prototype.end = function () {
  if (this.boy._done) { return }

  if (this._state === 'key' && this._key.length > 0) {
    this.boy.emit('field', decodeText(this._key, 'binary', this.charset),
      '',
      this._keyTrunc,
      false)
  } else if (this._state === 'val') {
    this.boy.emit('field', decodeText(this._key, 'binary', this.charset),
      decodeText(this._val, 'binary', this.charset),
      this._keyTrunc,
      this._valTrunc)
  }
  this.boy._done = true
  this.boy.emit('finish')
}

module.exports = UrlEncoded


/***/ }),

/***/ 7100:
/***/ ((module) => {

"use strict";


const RE_PLUS = /\+/g

const HEX = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]

function Decoder () {
  this.buffer = undefined
}
Decoder.prototype.write = function (str) {
  // Replace '+' with ' ' before decoding
  str = str.replace(RE_PLUS, ' ')
  let res = ''
  let i = 0; let p = 0; const len = str.length
  for (; i < len; ++i) {
    if (this.buffer !== undefined) {
      if (!HEX[str.charCodeAt(i)]) {
        res += '%' + this.buffer
        this.buffer = undefined
        --i // retry character
      } else {
        this.buffer += str[i]
        ++p
        if (this.buffer.length === 2) {
          res += String.fromCharCode(parseInt(this.buffer, 16))
          this.buffer = undefined
        }
      }
    } else if (str[i] === '%') {
      if (i > p) {
        res += str.substring(p, i)
        p = i
      }
      this.buffer = ''
      ++p
    }
  }
  if (p < len && this.buffer === undefined) { res += str.substring(p) }
  return res
}
Decoder.prototype.reset = function () {
  this.buffer = undefined
}

module.exports = Decoder


/***/ }),

/***/ 8647:
/***/ ((module) => {

"use strict";


module.exports = function basename (path) {
  if (typeof path !== 'string') { return '' }
  for (var i = path.length - 1; i >= 0; --i) { // eslint-disable-line no-var
    switch (path.charCodeAt(i)) {
      case 0x2F: // '/'
      case 0x5C: // '\'
        path = path.slice(i + 1)
        return (path === '..' || path === '.' ? '' : path)
    }
  }
  return (path === '..' || path === '.' ? '' : path)
}


/***/ }),

/***/ 4619:
/***/ (function(module) {

"use strict";


// Node has always utf-8
const utf8Decoder = new TextDecoder('utf-8')
const textDecoders = new Map([
  ['utf-8', utf8Decoder],
  ['utf8', utf8Decoder]
])

function getDecoder (charset) {
  let lc
  while (true) {
    switch (charset) {
      case 'utf-8':
      case 'utf8':
        return decoders.utf8
      case 'latin1':
      case 'ascii': // TODO: Make these a separate, strict decoder?
      case 'us-ascii':
      case 'iso-8859-1':
      case 'iso8859-1':
      case 'iso88591':
      case 'iso_8859-1':
      case 'windows-1252':
      case 'iso_8859-1:1987':
      case 'cp1252':
      case 'x-cp1252':
        return decoders.latin1
      case 'utf16le':
      case 'utf-16le':
      case 'ucs2':
      case 'ucs-2':
        return decoders.utf16le
      case 'base64':
        return decoders.base64
      default:
        if (lc === undefined) {
          lc = true
          charset = charset.toLowerCase()
          continue
        }
        return decoders.other.bind(charset)
    }
  }
}

const decoders = {
  utf8: (data, sourceEncoding) => {
    if (data.length === 0) {
      return ''
    }
    if (typeof data === 'string') {
      data = Buffer.from(data, sourceEncoding)
    }
    return data.utf8Slice(0, data.length)
  },

  latin1: (data, sourceEncoding) => {
    if (data.length === 0) {
      return ''
    }
    if (typeof data === 'string') {
      return data
    }
    return data.latin1Slice(0, data.length)
  },

  utf16le: (data, sourceEncoding) => {
    if (data.length === 0) {
      return ''
    }
    if (typeof data === 'string') {
      data = Buffer.from(data, sourceEncoding)
    }
    return data.ucs2Slice(0, data.length)
  },

  base64: (data, sourceEncoding) => {
    if (data.length === 0) {
      return ''
    }
    if (typeof data === 'string') {
      data = Buffer.from(data, sourceEncoding)
    }
    return data.base64Slice(0, data.length)
  },

  other: (data, sourceEncoding) => {
    if (data.length === 0) {
      return ''
    }
    if (typeof data === 'string') {
      data = Buffer.from(data, sourceEncoding)
    }

    if (textDecoders.has(this.toString())) {
      try {
        return textDecoders.get(this).decode(data)
      } catch {}
    }
    return typeof data === 'string'
      ? data
      : data.toString()
  }
}

function decodeText (text, sourceEncoding, destEncoding) {
  if (text) {
    return getDecoder(destEncoding)(text, sourceEncoding)
  }
  return text
}

module.exports = decodeText


/***/ }),

/***/ 1467:
/***/ ((module) => {

"use strict";


module.exports = function getLimit (limits, name, defaultLimit) {
  if (
    !limits ||
    limits[name] === undefined ||
    limits[name] === null
  ) { return defaultLimit }

  if (
    typeof limits[name] !== 'number' ||
    isNaN(limits[name])
  ) { throw new TypeError('Limit ' + name + ' is not a valid number') }

  return limits[name]
}


/***/ }),

/***/ 1854:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable object-property-newline */


const decodeText = __nccwpck_require__(4619)

const RE_ENCODED = /%[a-fA-F0-9][a-fA-F0-9]/g

const EncodedLookup = {
  '%00': '\x00', '%01': '\x01', '%02': '\x02', '%03': '\x03', '%04': '\x04',
  '%05': '\x05', '%06': '\x06', '%07': '\x07', '%08': '\x08', '%09': '\x09',
  '%0a': '\x0a', '%0A': '\x0a', '%0b': '\x0b', '%0B': '\x0b', '%0c': '\x0c',
  '%0C': '\x0c', '%0d': '\x0d', '%0D': '\x0d', '%0e': '\x0e', '%0E': '\x0e',
  '%0f': '\x0f', '%0F': '\x0f', '%10': '\x10', '%11': '\x11', '%12': '\x12',
  '%13': '\x13', '%14': '\x14', '%15': '\x15', '%16': '\x16', '%17': '\x17',
  '%18': '\x18', '%19': '\x19', '%1a': '\x1a', '%1A': '\x1a', '%1b': '\x1b',
  '%1B': '\x1b', '%1c': '\x1c', '%1C': '\x1c', '%1d': '\x1d', '%1D': '\x1d',
  '%1e': '\x1e', '%1E': '\x1e', '%1f': '\x1f', '%1F': '\x1f', '%20': '\x20',
  '%21': '\x21', '%22': '\x22', '%23': '\x23', '%24': '\x24', '%25': '\x25',
  '%26': '\x26', '%27': '\x27', '%28': '\x28', '%29': '\x29', '%2a': '\x2a',
  '%2A': '\x2a', '%2b': '\x2b', '%2B': '\x2b', '%2c': '\x2c', '%2C': '\x2c',
  '%2d': '\x2d', '%2D': '\x2d', '%2e': '\x2e', '%2E': '\x2e', '%2f': '\x2f',
  '%2F': '\x2f', '%30': '\x30', '%31': '\x31', '%32': '\x32', '%33': '\x33',
  '%34': '\x34', '%35': '\x35', '%36': '\x36', '%37': '\x37', '%38': '\x38',
  '%39': '\x39', '%3a': '\x3a', '%3A': '\x3a', '%3b': '\x3b', '%3B': '\x3b',
  '%3c': '\x3c', '%3C': '\x3c', '%3d': '\x3d', '%3D': '\x3d', '%3e': '\x3e',
  '%3E': '\x3e', '%3f': '\x3f', '%3F': '\x3f', '%40': '\x40', '%41': '\x41',
  '%42': '\x42', '%43': '\x43', '%44': '\x44', '%45': '\x45', '%46': '\x46',
  '%47': '\x47', '%48': '\x48', '%49': '\x49', '%4a': '\x4a', '%4A': '\x4a',
  '%4b': '\x4b', '%4B': '\x4b', '%4c': '\x4c', '%4C': '\x4c', '%4d': '\x4d',
  '%4D': '\x4d', '%4e': '\x4e', '%4E': '\x4e', '%4f': '\x4f', '%4F': '\x4f',
  '%50': '\x50', '%51': '\x51', '%52': '\x52', '%53': '\x53', '%54': '\x54',
  '%55': '\x55', '%56': '\x56', '%57': '\x57', '%58': '\x58', '%59': '\x59',
  '%5a': '\x5a', '%5A': '\x5a', '%5b': '\x5b', '%5B': '\x5b', '%5c': '\x5c',
  '%5C': '\x5c', '%5d': '\x5d', '%5D': '\x5d', '%5e': '\x5e', '%5E': '\x5e',
  '%5f': '\x5f', '%5F': '\x5f', '%60': '\x60', '%61': '\x61', '%62': '\x62',
  '%63': '\x63', '%64': '\x64', '%65': '\x65', '%66': '\x66', '%67': '\x67',
  '%68': '\x68', '%69': '\x69', '%6a': '\x6a', '%6A': '\x6a', '%6b': '\x6b',
  '%6B': '\x6b', '%6c': '\x6c', '%6C': '\x6c', '%6d': '\x6d', '%6D': '\x6d',
  '%6e': '\x6e', '%6E': '\x6e', '%6f': '\x6f', '%6F': '\x6f', '%70': '\x70',
  '%71': '\x71', '%72': '\x72', '%73': '\x73', '%74': '\x74', '%75': '\x75',
  '%76': '\x76', '%77': '\x77', '%78': '\x78', '%79': '\x79', '%7a': '\x7a',
  '%7A': '\x7a', '%7b': '\x7b', '%7B': '\x7b', '%7c': '\x7c', '%7C': '\x7c',
  '%7d': '\x7d', '%7D': '\x7d', '%7e': '\x7e', '%7E': '\x7e', '%7f': '\x7f',
  '%7F': '\x7f', '%80': '\x80', '%81': '\x81', '%82': '\x82', '%83': '\x83',
  '%84': '\x84', '%85': '\x85', '%86': '\x86', '%87': '\x87', '%88': '\x88',
  '%89': '\x89', '%8a': '\x8a', '%8A': '\x8a', '%8b': '\x8b', '%8B': '\x8b',
  '%8c': '\x8c', '%8C': '\x8c', '%8d': '\x8d', '%8D': '\x8d', '%8e': '\x8e',
  '%8E': '\x8e', '%8f': '\x8f', '%8F': '\x8f', '%90': '\x90', '%91': '\x91',
  '%92': '\x92', '%93': '\x93', '%94': '\x94', '%95': '\x95', '%96': '\x96',
  '%97': '\x97', '%98': '\x98', '%99': '\x99', '%9a': '\x9a', '%9A': '\x9a',
  '%9b': '\x9b', '%9B': '\x9b', '%9c': '\x9c', '%9C': '\x9c', '%9d': '\x9d',
  '%9D': '\x9d', '%9e': '\x9e', '%9E': '\x9e', '%9f': '\x9f', '%9F': '\x9f',
  '%a0': '\xa0', '%A0': '\xa0', '%a1': '\xa1', '%A1': '\xa1', '%a2': '\xa2',
  '%A2': '\xa2', '%a3': '\xa3', '%A3': '\xa3', '%a4': '\xa4', '%A4': '\xa4',
  '%a5': '\xa5', '%A5': '\xa5', '%a6': '\xa6', '%A6': '\xa6', '%a7': '\xa7',
  '%A7': '\xa7', '%a8': '\xa8', '%A8': '\xa8', '%a9': '\xa9', '%A9': '\xa9',
  '%aa': '\xaa', '%Aa': '\xaa', '%aA': '\xaa', '%AA': '\xaa', '%ab': '\xab',
  '%Ab': '\xab', '%aB': '\xab', '%AB': '\xab', '%ac': '\xac', '%Ac': '\xac',
  '%aC': '\xac', '%AC': '\xac', '%ad': '\xad', '%Ad': '\xad', '%aD': '\xad',
  '%AD': '\xad', '%ae': '\xae', '%Ae': '\xae', '%aE': '\xae', '%AE': '\xae',
  '%af': '\xaf', '%Af': '\xaf', '%aF': '\xaf', '%AF': '\xaf', '%b0': '\xb0',
  '%B0': '\xb0', '%b1': '\xb1', '%B1': '\xb1', '%b2': '\xb2', '%B2': '\xb2',
  '%b3': '\xb3', '%B3': '\xb3', '%b4': '\xb4', '%B4': '\xb4', '%b5': '\xb5',
  '%B5': '\xb5', '%b6': '\xb6', '%B6': '\xb6', '%b7': '\xb7', '%B7': '\xb7',
  '%b8': '\xb8', '%B8': '\xb8', '%b9': '\xb9', '%B9': '\xb9', '%ba': '\xba',
  '%Ba': '\xba', '%bA': '\xba', '%BA': '\xba', '%bb': '\xbb', '%Bb': '\xbb',
  '%bB': '\xbb', '%BB': '\xbb', '%bc': '\xbc', '%Bc': '\xbc', '%bC': '\xbc',
  '%BC': '\xbc', '%bd': '\xbd', '%Bd': '\xbd', '%bD': '\xbd', '%BD': '\xbd',
  '%be': '\xbe', '%Be': '\xbe', '%bE': '\xbe', '%BE': '\xbe', '%bf': '\xbf',
  '%Bf': '\xbf', '%bF': '\xbf', '%BF': '\xbf', '%c0': '\xc0', '%C0': '\xc0',
  '%c1': '\xc1', '%C1': '\xc1', '%c2': '\xc2', '%C2': '\xc2', '%c3': '\xc3',
  '%C3': '\xc3', '%c4': '\xc4', '%C4': '\xc4', '%c5': '\xc5', '%C5': '\xc5',
  '%c6': '\xc6', '%C6': '\xc6', '%c7': '\xc7', '%C7': '\xc7', '%c8': '\xc8',
  '%C8': '\xc8', '%c9': '\xc9', '%C9': '\xc9', '%ca': '\xca', '%Ca': '\xca',
  '%cA': '\xca', '%CA': '\xca', '%cb': '\xcb', '%Cb': '\xcb', '%cB': '\xcb',
  '%CB': '\xcb', '%cc': '\xcc', '%Cc': '\xcc', '%cC': '\xcc', '%CC': '\xcc',
  '%cd': '\xcd', '%Cd': '\xcd', '%cD': '\xcd', '%CD': '\xcd', '%ce': '\xce',
  '%Ce': '\xce', '%cE': '\xce', '%CE': '\xce', '%cf': '\xcf', '%Cf': '\xcf',
  '%cF': '\xcf', '%CF': '\xcf', '%d0': '\xd0', '%D0': '\xd0', '%d1': '\xd1',
  '%D1': '\xd1', '%d2': '\xd2', '%D2': '\xd2', '%d3': '\xd3', '%D3': '\xd3',
  '%d4': '\xd4', '%D4': '\xd4', '%d5': '\xd5', '%D5': '\xd5', '%d6': '\xd6',
  '%D6': '\xd6', '%d7': '\xd7', '%D7': '\xd7', '%d8': '\xd8', '%D8': '\xd8',
  '%d9': '\xd9', '%D9': '\xd9', '%da': '\xda', '%Da': '\xda', '%dA': '\xda',
  '%DA': '\xda', '%db': '\xdb', '%Db': '\xdb', '%dB': '\xdb', '%DB': '\xdb',
  '%dc': '\xdc', '%Dc': '\xdc', '%dC': '\xdc', '%DC': '\xdc', '%dd': '\xdd',
  '%Dd': '\xdd', '%dD': '\xdd', '%DD': '\xdd', '%de': '\xde', '%De': '\xde',
  '%dE': '\xde', '%DE': '\xde', '%df': '\xdf', '%Df': '\xdf', '%dF': '\xdf',
  '%DF': '\xdf', '%e0': '\xe0', '%E0': '\xe0', '%e1': '\xe1', '%E1': '\xe1',
  '%e2': '\xe2', '%E2': '\xe2', '%e3': '\xe3', '%E3': '\xe3', '%e4': '\xe4',
  '%E4': '\xe4', '%e5': '\xe5', '%E5': '\xe5', '%e6': '\xe6', '%E6': '\xe6',
  '%e7': '\xe7', '%E7': '\xe7', '%e8': '\xe8', '%E8': '\xe8', '%e9': '\xe9',
  '%E9': '\xe9', '%ea': '\xea', '%Ea': '\xea', '%eA': '\xea', '%EA': '\xea',
  '%eb': '\xeb', '%Eb': '\xeb', '%eB': '\xeb', '%EB': '\xeb', '%ec': '\xec',
  '%Ec': '\xec', '%eC': '\xec', '%EC': '\xec', '%ed': '\xed', '%Ed': '\xed',
  '%eD': '\xed', '%ED': '\xed', '%ee': '\xee', '%Ee': '\xee', '%eE': '\xee',
  '%EE': '\xee', '%ef': '\xef', '%Ef': '\xef', '%eF': '\xef', '%EF': '\xef',
  '%f0': '\xf0', '%F0': '\xf0', '%f1': '\xf1', '%F1': '\xf1', '%f2': '\xf2',
  '%F2': '\xf2', '%f3': '\xf3', '%F3': '\xf3', '%f4': '\xf4', '%F4': '\xf4',
  '%f5': '\xf5', '%F5': '\xf5', '%f6': '\xf6', '%F6': '\xf6', '%f7': '\xf7',
  '%F7': '\xf7', '%f8': '\xf8', '%F8': '\xf8', '%f9': '\xf9', '%F9': '\xf9',
  '%fa': '\xfa', '%Fa': '\xfa', '%fA': '\xfa', '%FA': '\xfa', '%fb': '\xfb',
  '%Fb': '\xfb', '%fB': '\xfb', '%FB': '\xfb', '%fc': '\xfc', '%Fc': '\xfc',
  '%fC': '\xfc', '%FC': '\xfc', '%fd': '\xfd', '%Fd': '\xfd', '%fD': '\xfd',
  '%FD': '\xfd', '%fe': '\xfe', '%Fe': '\xfe', '%fE': '\xfe', '%FE': '\xfe',
  '%ff': '\xff', '%Ff': '\xff', '%fF': '\xff', '%FF': '\xff'
}

function encodedReplacer (match) {
  return EncodedLookup[match]
}

const STATE_KEY = 0
const STATE_VALUE = 1
const STATE_CHARSET = 2
const STATE_LANG = 3

function parseParams (str) {
  const res = []
  let state = STATE_KEY
  let charset = ''
  let inquote = false
  let escaping = false
  let p = 0
  let tmp = ''
  const len = str.length

  for (var i = 0; i < len; ++i) { // eslint-disable-line no-var
    const char = str[i]
    if (char === '\\' && inquote) {
      if (escaping) { escaping = false } else {
        escaping = true
        continue
      }
    } else if (char === '"') {
      if (!escaping) {
        if (inquote) {
          inquote = false
          state = STATE_KEY
        } else { inquote = true }
        continue
      } else { escaping = false }
    } else {
      if (escaping && inquote) { tmp += '\\' }
      escaping = false
      if ((state === STATE_CHARSET || state === STATE_LANG) && char === "'") {
        if (state === STATE_CHARSET) {
          state = STATE_LANG
          charset = tmp.substring(1)
        } else { state = STATE_VALUE }
        tmp = ''
        continue
      } else if (state === STATE_KEY &&
        (char === '*' || char === '=') &&
        res.length) {
        state = char === '*'
          ? STATE_CHARSET
          : STATE_VALUE
        res[p] = [tmp, undefined]
        tmp = ''
        continue
      } else if (!inquote && char === ';') {
        state = STATE_KEY
        if (charset) {
          if (tmp.length) {
            tmp = decodeText(tmp.replace(RE_ENCODED, encodedReplacer),
              'binary',
              charset)
          }
          charset = ''
        } else if (tmp.length) {
          tmp = decodeText(tmp, 'binary', 'utf8')
        }
        if (res[p] === undefined) { res[p] = tmp } else { res[p][1] = tmp }
        tmp = ''
        ++p
        continue
      } else if (!inquote && (char === ' ' || char === '\t')) { continue }
    }
    tmp += char
  }
  if (charset && tmp.length) {
    tmp = decodeText(tmp.replace(RE_ENCODED, encodedReplacer),
      'binary',
      charset)
  } else if (tmp) {
    tmp = decodeText(tmp, 'binary', 'utf8')
  }

  if (res[p] === undefined) {
    if (tmp) { res[p] = tmp }
  } else { res[p][1] = tmp }

  return res
}

module.exports = parseParams


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(2186);
const upload = __nccwpck_require__(9265);
const post = __nccwpck_require__(8303);
const IsPost = !!core.getState('isPost');

const main = async () => {
    if (!IsPost) {
        core.saveState('isPost', 'true');
        await upload.Run();
    } else {
        await post.Run();
    }
}

main();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map