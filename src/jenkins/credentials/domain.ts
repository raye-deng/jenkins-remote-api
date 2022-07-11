import APIClient from "../api-client";

export default class DomainAPI {
    constructor(private readonly client: APIClient) {
    }

    getByName(name:string){
        return this.client.get(`/credentials/store/system/domain/${name}/api/json`)
    }

    add(name: string, description?: string) {
        return this.client.post(`/credentials/store/system/createDomain?name=${name}`, {json: {name, description}})
    }

    remove(name: string) {
        return this.client.post(`/credentials/store/system/domain/${name}/doDelete`, {json: {}});
    }

    update(name: string, description: string) {
        return this.client.post(`/credentials/store/system/domain/${name}/configSubmit?name=${name}`, {json: {name, description}});
    }
}