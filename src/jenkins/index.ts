import APIClient from "./api-client";
import ComputerAPI from "./computer";
import {Logger} from "../common/logger";

export type JenkinsClient = {
    computer: ComputerAPI
    logger: Logger
}


export const init = async (url: string, username: string, token: string): Promise<JenkinsClient> => {
    const httpClient = new APIClient(url, username, token);

    await httpClient.init();

    const client: JenkinsClient = {
        computer: new ComputerAPI(httpClient),
        logger: new Logger()
    }

    client.logger.debug(`Jenkins Remote Access API initialed, host: ${url}`);
    return client;
}