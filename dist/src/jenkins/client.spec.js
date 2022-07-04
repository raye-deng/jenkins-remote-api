"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe('api client unit test', () => {
    let client;
    const computer = {
        name: "ci_dev_local",
        description: "common-ci dev team self-host as slaver.",
        executors: 1,
        remote_fs: '/Users/raye.deng/jenkins_running',
        labels: ['common_ci_self_host_raye_deng'],
        slave_port: 22,
        mode: "normal",
        credentials_id: "self_host_raye_deng_sshd",
        slave_host: "172.16.6.80",
        slave_user: "raye.deng"
    };
    beforeEach(async () => {
        client = await (0, index_1.init)("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });
    it('add computer', async () => {
        const addResult = await client.computer.add(computer);
        expect(addResult).not.toBe(null);
    }, 300 * 1000);
    it('delete computer', async () => {
        const delResult = await client.computer.delete(computer.name);
        expect(delResult).not.toBe(null);
    });
    it('disconnect computer', async () => {
        const disConnectedResult = await client.computer.disconnect(computer.name);
        expect(disConnectedResult).not.toBe(null);
    });
    it('launch computer', async () => {
        const launchResult = await client.computer.launch(computer.name);
        expect(launchResult).not.toBe(null);
    });
    it('computer status', async () => {
        const status = await client.computer.status(computer.name);
        expect(status).not.toBe(null);
    });
    it('list computer', async () => {
        const computers = await client.computer.list(computer.name);
        expect(computers && computers.length > 0).toBe(true);
    }, 300 * 1000);
});
//# sourceMappingURL=client.spec.js.map