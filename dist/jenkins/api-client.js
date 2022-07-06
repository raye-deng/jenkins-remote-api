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
        this.client.interceptors.response.use((response) => {
            this.logger.debug(`url:${response.config.url} response: ${JSON.stringify(response.data)}`);
            return response;
        }, async (error) => {
            const { response, config } = error;
            if (response.status === 403 || response.status === 401) {
                await this.getCrumb();
                config.baseURL = undefined;
                return await this.client.request(config);
            }
            this.logger.error(`api invoke failed,[${error.config.method}] ${error.config.url},${typeof error.response.data == "string" ? error.response.data : JSON.stringify(error.response.data)}`);
            return Promise.reject(new Error(error.message));
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
    async post(path, data, options) {
        if (data.json) {
            Object.keys(this.crumb).map(k => data.json[k] = this.crumb[k]);
            data.json = JSON.stringify(data.json);
        }
        return this.client.post(path, qs.stringify(data), Object.assign({ headers: this.crumb }, options || { "content-type": "application/x-www-form-urlencoded" }));
    }
}
exports.default = APIClient;
//# sourceMappingURL=api-client.js.map