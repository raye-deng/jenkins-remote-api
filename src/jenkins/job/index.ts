import APIClient from "../api-client";

export default class JobAPI {
    constructor(private readonly client: APIClient) {
    }


    async list(filter: string): Promise<any[]> {
        const {data} = await this.client.get("/api/json");
        const {jobs: list} = data;
        return list.filter(item => item.name === filter);
    }

    async createOrUpdate(name: string, configXML: string) {
        const list = await this.list(name);
        return list && list.length <= 0 ? this.create(name, configXML) : this.update(name, configXML);
    }

    async create(name: string, configXML: string) {
        return this.client.postConfig(`/createItem?name=${name}`, configXML, {headers: {"content-type": 'text/xml'}});
    }

    async update(name: string, configXML: string) {
        return this.client.postConfig(`/job/${name}/config.xml`, configXML, {headers: {"content-type": 'text/xml'}});
    }

    async rename(name: string, targetName: string) {
        return this.client.post(`/job/${name}/doRename?newName=${targetName}`);
    }

    async clone(sourceName: string, targetName: string) {
        return this.client.post(`/createItem?name=${targetName}&mode=copy&from=${targetName}`, {});
    }


    async remove(name: string) {
        return this.client.post(`/job/${name}/doDelete`);
    }

    async disable(name: string) {
        return this.client.post(`/job/${name}/disable`);
    }

    async enable(name: string) {
        return this.client.post(`/job/${name}/enable`);

    }

    async build(name: string, params?: any) {
        return this.client.post(`/job/${name}/${params ? 'buildWithParameters' : 'build'}`, params)
    }

    async getBuild(name: string, buildNumber: string | number) {
        return this.client.get(`/job/${name}/${buildNumber}/api/json`)
    }

    async abortBuild(name: string, buildNumber: string | number) {
        const {data: build} = await this.getBuild(name, buildNumber);
        if (build.building) {
            return this.client.post(`/job/${name}/${buildNumber}/stop`)
        }
    }

    async getByName(name: string) {
        return this.client.get(`/job/${name}/api/json`)
    }

    async isInQueue(name: string) {
        const {data: job} = await this.getByName(name);
        return job['inQueue'];
    }

    async nextBuildNumber(name: string): Promise<number> {
        const {data: job} = await this.getByName(name);
        return job["nextBuildNumber"];
    }

    async guessBuildNumberInQueue(name: string, id: number, ids?: number[]) {
        if (!ids) {
            ids = await this.getInQueueIds(name);
        }
        const nextBuildNumber = await this.nextBuildNumber(name);
        const buildNumber = nextBuildNumber + ids.indexOf(id)
        return buildNumber;
    }

    async getInQueueBuild(name: string): Promise<{ queueId: number, guessBuildNumber: number }[]> {
        const ids = await this.getInQueueIds(name);
        const ps = [];
        ids.map(id => {
            const p = new Promise(async (resolve, reject) => {
                try {
                    const buildNumber = await this.guessBuildNumberInQueue(name, id, ids);
                    resolve({queueId: id, guessBuildNumber: buildNumber})
                } catch (e) {
                    reject(e)
                }
            });
            ps.push(p);
        });
        return Promise.all(ps)
    }

    private async getInQueueIds(name: string) {
        const {data} = await this.client.post(`/ajaxBuildQueue`);
        const regex = new RegExp(`${name}.*?\\/queue\\/cancelItem\\?id=(\\d+)`, "g");
        const items = data.match(regex);
        const ids = items.map(item => parseInt(/\/queue\/cancelItem\?id=(\d+)/g.exec(item)[1])).sort((a, b) => a - b);
        return ids;
    }


}