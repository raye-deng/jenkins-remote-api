import APIClient from "../api-client";
export declare type Computer = {
    name: string;
    description: string;
    executors: number;
    remote_fs: string;
    labels: string[];
    slave_port: number;
    mode: string | "normal";
    credentials_id: string;
    slave_host: string;
    slave_user: string;
};
export declare type ComputerStatus = {
    "_class": string;
    "actions": any;
    "assignedLabels": {
        name: string;
    }[];
    "description": string;
    "displayName": string;
    "executors": any[];
    "icon": string;
    "iconClassName": string;
    "idle": boolean;
    "jnlpAgent": boolean;
    "launchSupported": boolean;
    "loadStatistics": {
        "_class": string;
    };
    "manualLaunchAllowed": boolean;
    "monitorData": {
        "hudson.node_monitors.SwapSpaceMonitor": {
            "_class": string;
            "availablePhysicalMemory": number;
            "availableSwapSpace": number;
            "totalPhysicalMemory": number;
            "totalSwapSpace": number;
        };
        "hudson.node_monitors.TemporarySpaceMonitor": {
            "_class": string;
            "timestamp": number;
            "path": string;
            "size": number;
        };
        "hudson.node_monitors.DiskSpaceMonitor": {
            "_class": string;
            "timestamp": number;
            "path": string;
            "size": number;
        };
        "hudson.node_monitors.ArchitectureMonitor": string;
        "hudson.node_monitors.ResponseTimeMonitor": {
            "_class": string;
            "timestamp": number;
            "average": number;
        };
        "hudson.node_monitors.ClockMonitor": {
            "_class": string;
            "diff": number;
        };
    };
    "numExecutors": number;
    "offline": boolean;
    "offlineCause": any;
    "offlineCauseReason": string;
    "oneOffExecutors": any[];
    "temporarilyOffline": boolean;
    "absoluteRemotePath": string;
};
export default class ComputerAPI {
    private readonly client;
    constructor(client: APIClient);
    list(filter?: string, slaveOnly?: boolean): Promise<any>;
    add(computer: Computer): Promise<any>;
    delete(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    disconnect(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    launch(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    status(name: string): Promise<ComputerStatus>;
}
