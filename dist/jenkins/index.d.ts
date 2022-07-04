import ComputerAPI from "./computer";
import { Logger } from "../common/logger";
import CredentialsAPI from "./credentials";
import JobAPI from "./job";
export declare type JenkinsClient = {
    computer: ComputerAPI;
    credentials: CredentialsAPI;
    job: JobAPI;
    logger: Logger;
};
export declare const init: (url: string, username: string, token: string) => Promise<JenkinsClient>;
