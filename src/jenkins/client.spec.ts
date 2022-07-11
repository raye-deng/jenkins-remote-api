import {init, JenkinsClient} from "./index";

describe('api client unit test', () => {
    let client: JenkinsClient;


    beforeEach(async () => {
        client = await init("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });


    it('hello jenkins', async () => {

    })

});
