import {init, JenkinsClient} from "../index";
import exp from "constants";
import {UsernamePasswordCredentialCreateParameter} from "./index";

describe('credentials api test', () => {
    let client: JenkinsClient;
    const credential: UsernamePasswordCredentialCreateParameter = {
        "username": "foo_user",
        "usernameSecret": true,
        "password": "foo_password",
        "id": "foo_user_sshd",
        "description": "foo user sshd credential",
    }
    beforeEach(async () => {
        client = await init("http://localhost:8080", "$username", "$api_token");
    });

    it('get credentials', async () => {
        const cred = await client.credentials.getById(credential.id);
        expect(cred).not.toBe(null);
    }, 300 * 1000);


    it('add credential', async () => {
        const result = await client.credentials.add(credential);
        expect(result).not.toBe(null);
    })

    it('delete credential', async () => {
        const result = await client.credentials.delete(credential.id);
        expect(result).not.toBe(null);
    })
});
