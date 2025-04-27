export interface StringParameterValue {
    _class: string;
    name: string;
    value: string;
}
export interface BooleanParameterValue {
    _class: string;
    name: string;
    value: boolean;
}
export declare type ParameterValue = StringParameterValue | BooleanParameterValue;
export interface GitBranch {
    SHA1: string;
    name: string;
}
export interface GitRevision {
    SHA1: string;
    branch: GitBranch[];
}
export interface GitBuild {
    buildNumber: number;
    buildResult: string | null;
    marked: GitRevision;
    revision: GitRevision;
}
export interface GitBuildData {
    _class: string;
    buildsByBranchName: Record<string, GitBuild>;
    lastBuiltRevision: GitRevision;
    remoteUrls: string[];
    scmName: string;
}
export interface CauseAction {
    _class: string;
    causes: Array<{
        _class: string;
        shortDescription: string;
    }>;
}
export interface ParametersAction {
    _class: string;
    parameters: ParameterValue[];
}
export interface TimeInQueueAction {
    _class: string;
    blockedDurationMillis: number;
    blockedTimeMillis: number;
    buildableDurationMillis: number;
    buildableTimeMillis: number;
    buildingDurationMillis: number;
    executingTimeMillis: number;
    executorUtilization: number;
    subTaskCount: number;
    waitingDurationMillis: number;
    waitingTimeMillis: number;
}
export interface LibrariesAction {
    _class: string;
}
export interface BuildDataAction {
    _class: string;
}
export interface EnvActionImpl {
    _class: string;
}
export interface RunDisplayAction {
    _class: string;
}
export interface RestartDeclarativePipelineAction {
    _class: string;
}
export interface FlowGraphAction {
    _class: string;
}
export declare type Action = CauseAction | ParametersAction | TimeInQueueAction | LibrariesAction | BuildDataAction | EnvActionImpl | RunDisplayAction | RestartDeclarativePipelineAction | FlowGraphAction;
export interface BuildReference {
    number: number;
    url: string;
}
export interface Build {
    _class: string;
    actions: Action[];
    artifacts: any[];
    building: boolean;
    description: string | null;
    displayName: string;
    duration: number;
    estimatedDuration: number;
    executor: any | null;
    fullDisplayName: string;
    id: string;
    keepLog: boolean;
    number: number;
    queueId: number;
    result: string;
    timestamp: number;
    url: string;
    changeSets: any[];
    culprits: any[];
    nextBuild: BuildReference | null;
    previousBuild: BuildReference | null;
}
export interface BuildResponse {
    data: Build;
    [key: string]: any;
}
