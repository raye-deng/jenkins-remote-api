<p align="center">
  <a href="http://nestjs.com/" target="blank"><img width="400" src="https://www.jenkins.io/images/jenkins-logo-title.svg"></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Jenkins remote access api client for node.js</p>
<p align="center">
    <a href="https://www.npmjs.com/~jenkins-remote-api" target="_blank">
        <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
    </a>
    <img src="https://img.shields.io/badge/coverage-%3E80%25-green"/>
</p>

## Description

This project provides a Jenkins remote access API client for Node.js, allowing you to interact with Jenkins servers programmatically. It includes modules for managing jobs, users, computers, credentials, and queue items within Jenkins.

## Installation

```bash
$ npm install jenkins-remote-api@latest
```

## Usage

### Initialize API Client

```typescript
import APIClient from 'jenkins-remote-api';

const client = new APIClient('http://jenkins-url', 'username', 'apiToken');
await client.init();
```

### Manage Jobs

```typescript
import JobAPI from 'jenkins-remote-api/src/jenkins/job';

const jobAPI = new JobAPI(client);

// List jobs
const jobs = await jobAPI.list('job-name-filter');

// Create or update a job
await jobAPI.createOrUpdate('job-name', '<configXML>');
```

### Manage Users

```typescript
import UserAPI from 'jenkins-remote-api/src/jenkins/user';

const userAPI = new UserAPI(client);

// Add a new user
await userAPI.add({ fullName: 'John Doe', password: 'password123', email: 'john.doe@example.com' });

// List users
const users = await userAPI.list('filter');
```

### Manage Computers

```typescript
import ComputerAPI from 'jenkins-remote-api/src/jenkins/computer';

const computerAPI = new ComputerAPI(client);

// List computers
const computers = await computerAPI.list();

// Add a new computer
await computerAPI.add({
    name: 'new-computer',
    description: 'A new Jenkins node',
    executors: 2,
    remote_fs: '/var/jenkins',
    labels: ['linux', 'docker'],
    slave_port: 22,
    mode: 'NORMAL',
    credentials_id: 'cred-id',
    slave_host: '192.168.1.100',
    slave_user: 'jenkins'
});
```

### Manage Credentials

```typescript
import CredentialsAPI from 'jenkins-remote-api/src/jenkins/credentials';

const credentialsAPI = new CredentialsAPI(client);

// Add credentials
await credentialsAPI.add({
    username: 'jenkins-user',
    usernameSecret: true,
    password: 'secret',
    id: 'cred-id',
    description: 'Jenkins user credentials'
});
```

### Manage Queue

```typescript
import QueueAPI from 'jenkins-remote-api/src/jenkins/queue';

const queueAPI = new QueueAPI(client);

// Get queue item by ID
const queueItem = await queueAPI.getById(123);
```

For more detailed usage, refer to the test files in each module.
