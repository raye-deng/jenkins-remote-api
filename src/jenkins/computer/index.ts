import APIClient from "../api-client";
export type Computer = {
    name: string,
    description: string,
    executors: number,
    remote_fs: string,
    labels: string[],
    slave_port: number,
    mode: string | "normal",
    credentials_id: string,
    slave_host: string,
    slave_user: string
}

export type ComputerStatus = {
    "_class": string,
    "actions": any,
    "assignedLabels": { name: string }[],
    "description": string,
    "displayName": string
    "executors": any[],
    "icon": string,
    "iconClassName": string,
    "idle": boolean,
    "jnlpAgent": boolean,
    "launchSupported": boolean,
    "loadStatistics": {
        "_class": string
    },
    "manualLaunchAllowed": boolean
    "monitorData": {
        "hudson.node_monitors.SwapSpaceMonitor": {
            "_class": string,
            "availablePhysicalMemory": number,
            "availableSwapSpace": number,
            "totalPhysicalMemory": number,
            "totalSwapSpace": number
        },
        "hudson.node_monitors.TemporarySpaceMonitor": {
            "_class": string,
            "timestamp": number,
            "path": string,
            "size": number,
        },
        "hudson.node_monitors.DiskSpaceMonitor": {
            "_class": string,
            "timestamp": number,
            "path": string,
            "size": number,
        },
        "hudson.node_monitors.ArchitectureMonitor": string,
        "hudson.node_monitors.ResponseTimeMonitor": {
            "_class": string,
            "timestamp": number,
            "average": number,
        },
        "hudson.node_monitors.ClockMonitor": {
            "_class": string,
            "diff": number,
        }
    },
    "numExecutors": number,
    "offline": boolean
    "offlineCause": any,
    "offlineCauseReason": string,
    "oneOffExecutors": any[],
    "temporarilyOffline": boolean,
    "absoluteRemotePath": string,
}


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