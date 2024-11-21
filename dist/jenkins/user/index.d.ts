import APIClient from "../api-client";
export declare type User = {
    id?: string;
    fullName: string;
    description?: string;
    absoluteUrl?: string;
    properties?: {
        _class: string;
        [key: string]: any;
    };
    password?: string;
    email?: string;
};
export declare type ListUser = {
    "lastChange": string;
    "project": string;
    user: User;
};
export declare type TokenResponse = {
    data: {
        tokenName: string;
        tokenUuid: string;
        tokenValue: string;
    };
    status: string;
};
export default class UserAPI {
    private readonly client;
    constructor(client: APIClient);
    add(user: User): Promise<any>;
    remove(username: string): Promise<import("axios").AxiosResponse<any, any>>;
    list(filter: string): Promise<ListUser>;
    createToken(username: string, name: string): Promise<TokenResponse>;
    getUser(username: string): Promise<User>;
    update(user: User): Promise<any>;
}
