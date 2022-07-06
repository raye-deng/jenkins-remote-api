"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const logger_1 = require("../common/logger");
const qs = require('qs');
class APIClient {
    constructor(url, username, apiToken) {
        this.url = url;
        this.username = username;
        this.apiToken = apiToken;
    }
    async init() {
        this.client = axios_1.default.create({
            baseURL: this.url,
            auth: { username: this.username, password: this.apiToken }
        });
        this.logger = new logger_1.Logger();
        this.client.interceptors.request.use((config) => {
            if (config.method === "get" && config.url.indexOf("/api/json") === -1) {
                config.url = `${config.url}/api/json`;
            }
            return config;
        });
        this.client.interceptors.response.use((response) => {
            this.logger.debug(`url:${response.config.url} response: ${JSON.stringify(response.data)}`);
            return response;
        }, async (error) => {
            var _a, _b, _c, _d;
            const { data } = error === null || error === void 0 ? void 0 : error.response;
            const regexp = /<div id=\"error-description\">.*?<\/div>/g;
            let rawErrorMessage = data.message ? data.message : data.match(regexp);
            rawErrorMessage = rawErrorMessage ? rawErrorMessage[0].replace(/(<([^>]+)>)/ig, "").replace(/[\r\n]/g, "") : rawErrorMessage;
            const { response, config } = error;
            if (response.status === 403 || response.status === 401) {
                await this.getCrumb();
                config.baseURL = undefined;
                return await this.client.request(config);
            }
            if (response.status === 404 && ((_a = error === null || error === void 0 ? void 0 : error.request) === null || _a === void 0 ? void 0 : _a.method) === "GET" && ((_c = (_b = error === null || error === void 0 ? void 0 : error.request) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.indexOf("/api/json")) === -1) {
                config.url = `${(_d = error === null || error === void 0 ? void 0 : error.request) === null || _d === void 0 ? void 0 : _d.path}/api/json`;
                config.baseURL = undefined;
                return await this.client.request(config);
            }
            this.logger.error(`api invoke failed,[${error.config.method}] ${error.config.url},${typeof error.response.data == "string" ? error.response.data : JSON.stringify(error.response.data)}`);
            return Promise.reject(new Error(`${error.message} ${rawErrorMessage ? "(html error message:" + rawErrorMessage + ")" : ''}`));
        });
        await this.getCrumb();
    }
    async getCrumb() {
        try {
            let { data } = await this.get("/crumbIssuer/api/json");
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
            const crumbConfig = {};
            crumbConfig[data["crumbRequestField"]] = data.crumb;
            this.crumb = crumbConfig;
            this.logger.debug(`refresh crumb:${JSON.stringify(this.crumb)}`);
        }
        catch (e) {
            throw new Error("CSRF protection is not enabled on the server at the moment." +
                " Perhaps the client was initialized when the CSRF setting was" +
                " enabled. Please re-initialize the client, also the root cause:" + e.message);
        }
    }
    async get(path, options) {
        return this.client.get(path, Object.assign({ headers: this.crumb }, options || {}));
    }
    async post(path, data = {}, options) {
        if (data.json) {
            Object.keys(this.crumb).map(k => data.json[k] = this.crumb[k]);
            data.json = JSON.stringify(data.json);
        }
        return this.client.post(path, qs.stringify(data), Object.assign({ headers: this.crumb }, options || { "content-type": "application/x-www-form-urlencoded" }));
    }
    async postConfig(path, data = {}, options) {
        return this.client.post(path, data, Object.assign({ headers: this.crumb }, options || { "content-type": "text/xml" }));
    }
}
exports.default = APIClient;
//# sourceMappingURL=api-client.js.map