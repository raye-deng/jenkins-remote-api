"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueAPI {
    constructor(client) {
        this.client = client;
    }
    async getById(id) {
        return this.client.get(`/queue/item/${id}`);
    }
    async list(name) {
        var _a;
        const { data: list } = await this.client.get('/queue');
        return (_a = list === null || list === void 0 ? void 0 : list.items) === null || _a === void 0 ? void 0 : _a.filter(item => item.task.name === name);
    }
    async causes(id) {
        var _a;
        const { data: item } = await this.getById(id);
        return (_a = item.actions) === null || _a === void 0 ? void 0 : _a.map(action => action === null || action === void 0 ? void 0 : action.causes);
    }
    async reason(id) {
        const { data: item } = await this.getById(id);
        return item === null || item === void 0 ? void 0 : item.why;
    }
}
exports.default = QueueAPI;
//# sourceMappingURL=index.js.map