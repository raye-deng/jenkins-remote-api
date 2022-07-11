import {init, JenkinsClient} from "../index";
import {Computer} from "./index";

describe('computer module unit test', () => {
    let client: JenkinsClient;
    const computer: Computer = {
        name: "foo_self_host_computer",
        description: "foo user self-host as slaver.",
        executors: 1,
        remote_fs: '/Users/foo/jenkins_running',
        labels: ['foo_computer'],
        slave_port: 22,
        mode: "normal",
        credentials_id: "foo_credential_id",
        slave_host: "127.0.0.1",
        slave_user: "foo_user"
    };

    beforeEach(async () => {
        client = await init("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });

    it('add computer', async () => {
        const addResult = await client.computer.add(computer);
        expect(addResult).not.toBe(null);
    }, 30 * 1000)


    it('disconnect computer', async () => {
        const disConnectedResult = await client.computer.disconnect(computer.name);
        expect(disConnectedResult).not.toBe(null);
    })

    it('launch computer', async () => {
        const launchResult = await client.computer.launch(computer.name);
        expect(launchResult).not.toBe(null);
    })

    it('computer status', async () => {
        const status = await client.computer.status(computer.name);
        expect(status).not.toBe(null);
    })

    it('list computer', async () => {
        const computers = await client.computer.list(computer.name);
        expect(computers && computers.length > 0).toBe(true)
    }, 300 * 1000);

    it('delete computer', async () => {
        const delResult = await client.computer.delete(computer.name);
        expect(delResult).not.toBe(null);
    })
});
