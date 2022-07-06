import APIClient from "../api-client";

export default class QueueAPI {
    constructor(private readonly client: APIClient) {
    }

    async getById(id: number) {
        return this.client.get(`/queue/item/${id}`);
    }

    async list(name: string): Promise<any[]> {
        const {data: list} = await this.client.get('/queue');
        return list?.items?.filter(item => item.task.name === name)
    }

    async causes(id: number) {
        const {data: item} = await this.getById(id)
        return item.actions?.map(action => action?.causes);
    }

    async reason(id: number) {
        const {data: item} = await this.getById(id);
        return item?.why;
    }

}
