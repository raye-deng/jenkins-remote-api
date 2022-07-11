import {init, JenkinsClient} from "../index";
import {User} from "./index";

describe('user module unit test', () => {
    let client: JenkinsClient;
    const user: User = {"fullName": "foo_user", "password": "foo_password", "email": "foo_user@foo_domain.com", description: "foo user description"};


    beforeEach(async () => {
        client = await init("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });


    it('add user', async () => {
        const result = await client.user.add(user);
        expect(result).not.toBe(null);
    })


    it('get user', async () => {
        const result = await client.user.getUser(user.fullName);
        expect(result.fullName).toEqual(user.fullName);
    })

    it('update user', async () => {
        const result = await client.user.update(Object.assign(user, {description: "foo user description1"}))
        const u = await client.user.getUser(user.fullName);
        expect(u.description).toEqual("foo user description1");
    }, 30 * 1000)

    it('remove user', async () => {
        const result = await client.user.remove(user.fullName);
        expect(result).not.toBe(null);
    })


});
