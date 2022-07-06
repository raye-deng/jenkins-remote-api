import APIClient from "./api-client";
import ComputerAPI from "./computer";
import {Logger} from "../common/logger";
import CredentialsAPI from "./credentials";
import JobAPI from "./job";
import QueueAPI from "./queue";

export type JenkinsClient = {
    computer: ComputerAPI,
    credentials: CredentialsAPI,
    queue: QueueAPI,
    job: JobAPI,
    logger: Logger,
}


export const init = async (url: string, username: string, token: string): Promise<JenkinsClient> => {
    const httpClient = new APIClient(url, username, token);

    await httpClient.init();

    const client: JenkinsClient = {
        computer: new ComputerAPI(httpClient),
        credentials: new CredentialsAPI(httpClient),
        queue: new QueueAPI(httpClient),
        job: new JobAPI(httpClient),
        logger: new Logger()
    }

    client.logger.debug(`Jenkins Remote Access API initialed, host: ${url}`);
    return client;
}