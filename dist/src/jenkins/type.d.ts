export declare type ComputerCreateParameter = {
    "name": string;
    "json": {
        "name": string;
        "nodeDescription": string;
        "numExecutors": number;
        "remoteFS": string;
        "labelString": string[];
        "mode": string;
        "retentionStrategy": {
            "stapler-class": "hudson.slaves.RetentionStrategy$Always";
            "$class": "hudson.slaves.RetentionStrategy$Always";
        };
        "nodeProperties": {
            "stapler-class-bag": "true";
        };
        "launcher": {
            "stapler-class": "hudson.plugins.sshslaves.SSHLauncher";
            "host": string;
            "port": number;
            "username": string;
            "privatekey": string;
            "credentialsId": string;
        };
        [key: string]: any;
    };
    [key: string]: any;
};
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
export declare type UsernamePasswordCredentialCreateParameter = {
    "username": string;
    "usernameSecret": true;
    "password": string;
    "id": string;
    "description": string;
};
