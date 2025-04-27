"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FD = require("form-data");
class JobAPI {
    constructor(client) {
        this.client = client;
    }
    async list(filter) {
        const { data } = await this.client.get("/api/json");
        const { jobs: list } = data;
        return list.filter(item => item.name === filter);
    }
    async detail(jobName) {
        const { data } = await this.client.get(`/job/${jobName}/api/json`);
        return { data };
    }
    async createOrUpdate(name, configXML, viewPath) {
        const list = await this.list(name);
        return list && list.length <= 0 ? (viewPath ? this.createInView(name, viewPath, configXML) : this.create(name, configXML)) : this.update(name, configXML);
    }
    async create(name, configXML) {
        return this.client.postConfig(`/createItem?name=${name}`, configXML, { headers: { "content-type": "text/xml" } });
    }
    async createInView(name, viewPath, configXML) {
        const json = { name, "mode": "org.jenkinsci.plugins.workflow.job.WorkflowJob", "from": "", "addToCurrentView": true };
        const { data: createResult } = await this.client.post(`/view/${viewPath}/createItem?name=${name}`, Object.assign({ json }, json));
        return this.update(name, configXML);
    }
    async update(name, configXML) {
        return this.client.postConfig(`/job/${name}/config.xml`, configXML, { headers: { "content-type": "text/xml" } });
    }
    async rename(name, targetName) {
        return this.client.post(`/job/${name}/confirmRename?newName=${targetName}`, { json: { newName: targetName } });
    }
    async getConfig(name) {
        return this.client.get(`/job/${name}/config.xml`);
    }
    async clone(sourceName, targetName) {
        return this.client.post(`/createItem?name=${targetName}&mode=copy&from=${sourceName}`, {});
    }
    async remove(name) {
        return this.client.post(`/job/${name}/doDelete`);
    }
    async disable(name) {
        return this.client.post(`/job/${name}/disable`);
    }
    async enable(name) {
        return this.client.post(`/job/${name}/enable`);
    }
    async build(name, params) {
        return this.client.post(`/job/${name}/${params ? "buildWithParameters" : "build"}`, params);
    }
    async rebuild(name, id, params) {
        return this.client.post(`/job/${name}/${id}/rebuild/configSubmit`, params);
    }
    async replay(name, id, script) {
        const fd = { "mainScript": script };
        return this.client.post(`/job/${name}/${id}/replay/run`, fd);
    }
    async getBuild(name, buildNumber) {
        return this.client.get(`/job/${name}/${buildNumber}/api/json`);
    }
    async abortBuild(name, buildNumber) {
        const { data: build } = await this.getBuild(name, buildNumber);
        if (build.building) {
            return this.client.post(`/job/${name}/${buildNumber}/stop`);
        }
    }
    async deleteBuild(name, buildNumber) {
        return this.client.post(`/job/${name}/${buildNumber}/doDelete`);
    }
    async getByName(name) {
        return this.client.get(`/job/${name}/api/json`);
    }
    async getByNameWithTree(name, tree) {
        return this.client.get(`/job/${name}/api/json?tree=${tree}`);
    }
    async isInQueue(name) {
        const { data: job } = await this.getByName(name);
        return job["inQueue"];
    }
    async nextBuildNumber(name) {
        const { data: job } = await this.getByName(name);
        return job["nextBuildNumber"];
    }
    async guessBuildNumberInQueue(name, id, ids) {
        if (!ids) {
            ids = await this.getInQueueIds(name);
        }
        const nextBuildNumber = await this.nextBuildNumber(name);
        const buildNumber = nextBuildNumber + ids.indexOf(id);
        return buildNumber;
    }
    async getInQueueBuild(name) {
        const ids = await this.getInQueueIds(name);
        const ps = [];
        ids.map(id => {
            const p = new Promise(async (resolve, reject) => {
                try {
                    const buildNumber = await this.guessBuildNumberInQueue(name, id, ids);
                    resolve({ queueId: id, guessBuildNumber: buildNumber });
                }
                catch (e) {
                    reject(e);
                }
            });
            ps.push(p);
        });
        return Promise.all(ps);
    }
    async getInQueueIds(name) {
        const { data } = await this.client.post(`/ajaxBuildQueue`);
        const regex = new RegExp(`${name}.*?\\/queue\\/cancelItem\\?id=(\\d+)`, "g");
        const items = data.match(regex);
        const ids = items.map(item => parseInt(/\/queue\/cancelItem\?id=(\d+)/g.exec(item)[1])).sort((a, b) => a - b);
        return ids;
    }
    async getLog(name, buildNumber) {
        return this.client.get(`/job/${name}/${buildNumber}/consoleText`);
    }
    async getArtifactUrls(name, buildNumber) {
        const { data: buildDetails } = await this.getBuild(name, buildNumber);
        if (!buildDetails.artifacts || !Array.isArray(buildDetails.artifacts)) {
            return [];
        }
        return buildDetails.artifacts.map(artifact => `${buildDetails.url}artifact/${encodeURIComponent(artifact.relativePath)}`);
    }
    async getProgressiveLog(name, buildNumber, pollInterval = 5000) {
        let startOffset = 0;
        let completeLog = '';
        let isComplete = false;
        while (!isComplete) {
            const response = await this.client.get(`/job/${name}/${buildNumber}/logText/progressiveText?start=${startOffset}`, {
                headers: {
                    'Accept': 'text/plain'
                },
                timeout: 5000
            });
            startOffset = parseInt(response.headers['x-text-size'] || '0');
            console.log('\x1b[32m%s\x1b[0m', response.data);
            completeLog += response.data;
            const hasMoreData = response.headers['x-more-data'] === 'true';
            if (!hasMoreData) {
                isComplete = true;
            }
            else {
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
        }
        return completeLog;
    }
}
exports.default = JobAPI;
//# sourceMappingURL=index.js.map