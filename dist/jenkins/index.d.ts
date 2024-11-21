import ComputerAPI from "./computer";
import { Logger } from "../common/logger";
import CredentialsAPI from "./credentials";
import JobAPI from "./job";
import QueueAPI from "./queue";
import UserAPI from "./user";
export declare type JenkinsClient = {
    computer: ComputerAPI;
    credentials: CredentialsAPI;
    queue: QueueAPI;
    job: JobAPI;
    user: UserAPI;
    logger: Logger;
};
export declare const init: (url: string, username: string, token: string) => Promise<JenkinsClient>;
