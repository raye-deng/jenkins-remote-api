"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FormData = require('form-data');
class ComputerAPI {
    constructor(client) {
        this.client = client;
    }
    async list(filter, slaveOnly = false) {
        var _a;
        const { data } = await this.client.get(`/computer/api/json`);
        const list = filter ? (_a = data === null || data === void 0 ? void 0 : data.computer) === null || _a === void 0 ? void 0 : _a.filter(item => item.displayName.match(new RegExp(filter, "ig"))) : data === null || data === void 0 ? void 0 : data.computer;
        return list.filter(item => slaveOnly ? item.displayName !== "master" || item.displayName.indexOf("Built-In Node") : true);
    }
    async add(computer) {
        var _a;
        const payload = {
            name: computer.name,
            "type": "hudson.slaves.DumbSlave",
            "json": {
                "": [
                    "hudson.plugins.sshslaves.SSHLauncher",
                    "hudson.slaves.RetentionStrategy$Always"
                ],
                "launcher": {
                    "": "2",
                    "stapler-class": "hudson.plugins.sshslaves.SSHLauncher",
                    "$class": "hudson.plugins.sshslaves.SSHLauncher",
                    "host": computer.slave_host,
                    "port": computer.slave_port,
                    "username": computer.slave_user,
                    "credentialsId": computer.credentials_id,
                    "javaPath": "",
                    "jvmOptions": "",
                    "launchTimeoutSeconds": "",
                    "maxNumRetries": "",
                    "prefixStartSlaveCmd": "",
                    "suffixStartSlaveCmd": "",
                    "retryWaitTime": "",
                    "sshHostKeyVerificationStrategy": {
                        "stapler-class": "hudson.plugins.sshslaves.verifiers.NonVerifyingKeyVerificationStrategy",
                        "$class": "hudson.plugins.sshslaves.verifiers.NonVerifyingKeyVerificationStrategy"
                    },
                },
                "retentionStrategy": {
                    "$class": "hudson.slaves.RetentionStrategy$Always",
                    "stapler-class": "hudson.slaves.RetentionStrategy$Always"
                },
                "type": "hudson.slaves.DumbSlave",
                "mode": (_a = computer.mode) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                "name": computer.name,
                "nodeDescription": computer.description,
                "numExecutors": computer.executors,
                "remoteFS": computer.remote_fs,
                "labelString": computer.labels.join(","),
                "nodeProperties": {
                    "stapler-class-bag": "true"
                },
            }
        };
        const { data } = await this.client.post(`/computer/doCreateItem`, payload, { headers: {} });
        return data;
    }
    async delete(name) {
        return this.client.post(`/computer/${name}/doDelete`, {});
    }
    async disconnect(name) {
        return this.client.post(`computer/${name}/doDisconnect`, {});
    }
    async launch(name) {
        return this.client.post(`computer/${name}/launchSlaveAgent`, {});
    }
    async status(name) {
        const { data } = await this.client.get(`computer/${name}/api/json`);
        return data;
    }
}
exports.default = ComputerAPI;
//# sourceMappingURL=index.js.map