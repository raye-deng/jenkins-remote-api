import {init, JenkinsClient} from "../index";

const fs = require("fs");

describe('job api unit test', () => {
    let client: JenkinsClient;
    const jobName = "foo_job";

    beforeEach(async () => {
        client = await init("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });

    it('get list', async () => {
        const list = await client.queue.list(jobName);
        expect(list).not.toBe(null);
    }, 300 * 1000)

    it.skip('get by id', async () => {
        try {
            const {status} = await client.queue.getById(0);
            expect(status).toBe(200);
        } catch (e) {
            const {response} = e;
            const {status} = response;
            expect(status).toBe(404);
        }
    })
});
