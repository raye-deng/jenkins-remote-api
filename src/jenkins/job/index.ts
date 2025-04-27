import APIClient from "../api-client";
import { Build, BuildResponse } from "../../types";

const FD = require("form-data");

export default class JobAPI {
  constructor(private readonly client: APIClient) {
  }


  async list(filter: string): Promise<any[]> {
    const { data } = await this.client.get("/api/json");
    const { jobs: list } = data;
    return list.filter(item => item.name === filter);
  }

  async createOrUpdate(name: string, configXML: string, viewPath?: string) {
    const list = await this.list(name);
    return list && list.length <= 0 ? (viewPath ? this.createInView(name, viewPath, configXML) : this.create(name, configXML)) : this.update(name, configXML);
  }

  async create(name: string, configXML: string) {
    return this.client.postConfig(`/createItem?name=${name}`, configXML, { headers: { "content-type": "text/xml" } });
  }

  async createInView(name: string, viewPath: string, configXML: string) {
    const json = { name, "mode": "org.jenkinsci.plugins.workflow.job.WorkflowJob", "from": "", "addToCurrentView": true };
    const { data: createResult } = await this.client.post(`/view/${viewPath}/createItem?name=${name}`, { json, ...json });
    return this.update(name, configXML);
  }

  async update(name: string, configXML: string) {
    return this.client.postConfig(`/job/${name}/config.xml`, configXML, { headers: { "content-type": "text/xml" } });
  }

  async rename(name: string, targetName: string) {
    return this.client.post(`/job/${name}/confirmRename?newName=${targetName}`, { json: { newName: targetName } });
  }

  async getConfig(name) {
    return this.client.get(`/job/${name}/config.xml`);
  }

  async clone(sourceName: string, targetName: string) {
    return this.client.post(`/createItem?name=${targetName}&mode=copy&from=${sourceName}`, {});
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
    return this.client.post(`/job/${name}/${params ? "buildWithParameters" : "build"}`, params);
  }

  async rebuild(name: string, id: number, params?: any) {
    return this.client.post(`/job/${name}/${id}/rebuild/configSubmit`, params);
  }

  async replay(name: string, id: number, script: string) {
    const fd = { "mainScript": script };
    return this.client.post(`/job/${name}/${id}/replay/run`, fd);
  }

  async getBuild(name: string, buildNumber: string | number): Promise<BuildResponse> {
    return this.client.get(`/job/${name}/${buildNumber}/api/json`);
  }

  async abortBuild(name: string, buildNumber: string | number) {
    const { data: build } = await this.getBuild(name, buildNumber);
    if (build.building) {
      return this.client.post(`/job/${name}/${buildNumber}/stop`);
    }
  }

  async deleteBuild(name: string, buildNumber: string | number) {
    return this.client.post(`/job/${name}/${buildNumber}/doDelete`);
  }

  async getByName(name: string) {
    return this.client.get(`/job/${name}/api/json`);
  }

  async getByNameWithTree(name: string, tree: string) {
    return this.client.get(`/job/${name}/api/json?tree=${tree}`);
  }

  async isInQueue(name: string) {
    const { data: job } = await this.getByName(name);
    return job["inQueue"];
  }

  async nextBuildNumber(name: string): Promise<number> {
    const { data: job } = await this.getByName(name);
    return job["nextBuildNumber"];
  }

  async guessBuildNumberInQueue(name: string, id: number, ids?: number[]) {
    if (!ids) {
      ids = await this.getInQueueIds(name);
    }
    const nextBuildNumber = await this.nextBuildNumber(name);
    const buildNumber = nextBuildNumber + ids.indexOf(id);
    return buildNumber;
  }

  async getInQueueBuild(name: string): Promise<{ queueId: number, guessBuildNumber: number; }[]> {
    const ids = await this.getInQueueIds(name);
    const ps = [];
    ids.map(id => {
      const p = new Promise(async (resolve, reject) => {
        try {
          const buildNumber = await this.guessBuildNumberInQueue(name, id, ids);
          resolve({ queueId: id, guessBuildNumber: buildNumber });
        } catch (e) {
          reject(e);
        }
      });
      ps.push(p);
    });
    return Promise.all(ps);
  }

  private async getInQueueIds(name: string) {
    const { data } = await this.client.post(`/ajaxBuildQueue`);
    const regex = new RegExp(`${name}.*?\\/queue\\/cancelItem\\?id=(\\d+)`, "g");
    const items = data.match(regex);
    const ids = items.map(item => parseInt(/\/queue\/cancelItem\?id=(\d+)/g.exec(item)[1])).sort((a, b) => a - b);
    return ids;
  }

  async getLog(name: string, buildNumber: string | number) {
    return this.client.get(`/job/${name}/${buildNumber}/consoleText`);
  }

  async getArtifactUrls(name: string, buildNumber: string | number): Promise<string[]> {
    const { data: buildDetails } = await this.getBuild(name, buildNumber);
    if (!buildDetails.artifacts || !Array.isArray(buildDetails.artifacts)) {
      return [];
    }
    return buildDetails.artifacts.map(artifact =>
      `${buildDetails.url}artifact/${encodeURIComponent(artifact.relativePath)}`
    );
  }

  /**
   * Retrieves progressive console output for a build
   * @param name Job name
   * @param buildNumber Build number
   * @param pollInterval Polling interval in milliseconds (default: 5000)
   * @returns Promise that resolves with the complete console output
   */
  async getProgressiveLog(name: string, buildNumber: string | number, pollInterval: number = 5000): Promise<string> {
    let startOffset = 0;
    let completeLog = '';
    let isComplete = false;

    while (!isComplete) {
      const response = await this.client.get(
        `/job/${name}/${buildNumber}/logText/progressiveText?start=${startOffset}`,
        {
          headers: {
            'Accept': 'text/plain'
          },
          timeout: 5000
        }
      );

      // Update the start offset for the next request
      startOffset = parseInt(response.headers['x-text-size'] || '0');

      console.log('\x1b[32m%s\x1b[0m', response.data);
      // Append new log content
      completeLog += response.data;

      // Check if more data is available
      const hasMoreData = response.headers['x-more-data'] === 'true';

      if (!hasMoreData) {
        isComplete = true;
      } else {
        // Wait for the specified interval before the next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    return completeLog;
  }
}