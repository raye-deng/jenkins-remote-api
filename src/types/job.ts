/**
 * Jenkins Job Types
 * Based on the API response from job detail method
 */

import { Build, BuildReference } from './build';

// Action types
export interface JobAction {
  _class: string;
}

export interface JobConfigHistoryAction extends JobAction {
  _class: 'hudson.plugins.jobConfigHistory.JobConfigHistoryProjectAction';
}

export interface JobDisplayAction extends JobAction {
  _class: 'org.jenkinsci.plugins.displayurlapi.actions.JobDisplayAction';
}

export interface ViewCredentialsAction extends JobAction {
  _class: 'com.cloudbees.plugins.credentials.ViewCredentialsAction';
}

export interface JiraProjectProperty extends JobAction {
  _class: 'hudson.plugins.jira.JiraProjectProperty';
}

export interface BuildBlockerProperty extends JobAction {
  _class: 'hudson.plugins.buildblocker.BuildBlockerProperty';
}

export interface BuildDiscarderProperty extends JobAction {
  _class: 'jenkins.model.BuildDiscarderProperty';
}

export interface DisableConcurrentBuildsJobProperty extends JobAction {
  _class: 'org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty';
}

export interface DatadogJobProperty extends JobAction {
  _class: 'org.datadog.jenkins.plugins.datadog.DatadogJobProperty';
}

export interface GitLabConnectionProperty extends JobAction {
  _class: 'com.dabsquared.gitlabjenkins.connection.GitLabConnectionProperty';
}

export interface RebuildSettings extends JobAction {
  _class: 'com.sonyericsson.rebuild.RebuildSettings';
}

export interface PipelineTriggersJobProperty extends JobAction {
  _class: 'org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty';
}

export interface ThrottleJobProperty extends JobAction {
  _class: 'hudson.plugins.throttleconcurrents.ThrottleJobProperty';
}

// Parameter definition types
export interface StringParameterDefinition {
  _class: 'hudson.model.StringParameterDefinition';
  defaultParameterValue: {
    _class: 'hudson.model.StringParameterValue';
    name: string;
    value: string;
  };
  description: string;
  name: string;
  type: 'StringParameterDefinition';
}

export interface BooleanParameterDefinition {
  _class: 'hudson.model.BooleanParameterDefinition';
  defaultParameterValue: {
    _class: 'hudson.model.BooleanParameterValue';
    name: string;
    value: boolean;
  };
  description: string;
  name: string;
  type: 'BooleanParameterDefinition';
}

export type ParameterDefinition = StringParameterDefinition | BooleanParameterDefinition;

export interface ParametersDefinitionProperty extends JobAction {
  _class: 'hudson.model.ParametersDefinitionProperty';
  parameterDefinitions: ParameterDefinition[];
}

// Health report type
export interface HealthReport {
  description: string;
  iconClassName: string;
  iconUrl: string;
  score: number;
}

// Job detail type
export interface JobDetail {
  _class: string;
  actions: JobAction[];
  description: string;
  displayName: string;
  displayNameOrNull: string | null;
  fullDisplayName: string;
  fullName: string;
  name: string;
  url: string;
  buildable: boolean;
  builds: BuildReference[];
  color: string;
  firstBuild: BuildReference;
  healthReport: HealthReport[];
  inQueue: boolean;
  keepDependencies: boolean;
  lastBuild: BuildReference;
  lastCompletedBuild: BuildReference;
  lastFailedBuild: BuildReference | null;
  lastStableBuild: BuildReference;
  lastSuccessfulBuild: BuildReference;
  lastUnstableBuild: BuildReference | null;
  lastUnsuccessfulBuild: BuildReference | null;
  nextBuildNumber: number;
  property: JobAction[];
  queueItem: any | null;
  concurrentBuild: boolean;
  resumeBlocked: boolean;
}

// Response type for job detail method
export interface JobDetailResponse {
  data: JobDetail;
  [key: string]: any;
} 