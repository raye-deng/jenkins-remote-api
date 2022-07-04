import APIClient from "../api-client";
import {Computer, ComputerStatus} from "../type";

const FormData = require('form-data');

export default class ComputerAPI {

    constructor(private readonly client: APIClient) {
    }

    async list(filter?: string, slaveOnly: boolean = false) {
        const {data} = await this.client.get(`/computer/api/json`);
        const list = filter ? data?.computer?.filter(item => item.displayName.match(new RegExp(filter,"ig"))) : data?.computer;
        return list.filter(item => slaveOnly ? item.displayName !== "master" || item.displayName.indexOf("Built-In Node") : true);
    }

    async add(computer: Computer) {
        const payload: any = {
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
                "mode": computer.mode?.toUpperCase(),
                "name": computer.name,
                "nodeDescription": computer.description,
                "numExecutors": computer.executors,
                "remoteFS": computer.remote_fs,
                "labelString": computer.labels.join(","),
                "nodeProperties": {
                    "stapler-class-bag": "true"
                },
            }
        }


        const {data} = await this.client.post(`/computer/doCreateItem`, payload, {headers: {}});
        return data;
    }


    async delete(name: string) {
        return this.client.post(`/computer/${name}/doDelete`, {});
    }

    async disconnect(name: string) {
        return this.client.post(`computer/${name}/doDisconnect`, {});
    }

    async launch(name: string) {
        return this.client.post(`computer/${name}/launchSlaveAgent`, {});
    }

    async status(name: string): Promise<ComputerStatus> {
        const {data} = await this.client.get(`computer/${name}/api/json`);
        return data;
    }
}