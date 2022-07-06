import {init, JenkinsClient} from "../index";

const fs = require("fs");

describe('job api unit test', () => {
    let client: JenkinsClient;
    let params = {
        branch: "foo_branch"
    }
    const jobName = "foo_job";
    const targetName = "new_foo_job";

    beforeEach(async () => {
        client = await init("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });

    it('add or update job', async () => {
        const job_xml1 = fs.readFileSync("./assets/foo_job_not_params.xml", "utf8")
        const addResult1 = await client.job.createOrUpdate("foo_job_not_params", job_xml1);
        const job_xml = fs.readFileSync("./assets/foo_job.xml", "utf8")
        const addResult = await client.job.createOrUpdate(jobName, job_xml);
        expect(addResult).not.toBe(null);
    }, 300 * 1000)

    it('delete job', async () => {
        const delResult = await client.job.remove(jobName)
        expect(delResult).not.toBe(null);
    })

    it('disable job', async () => {
        const disConnectedResult = await client.job.disable(jobName)
        expect(disConnectedResult).not.toBe(null);
    })

    it('enable job', async () => {
        const launchResult = await client.job.enable(jobName)
        expect(launchResult).not.toBe(null);
    })

    it('list job', async () => {
        const jobs = await client.job.list(jobName);
        expect(jobs && jobs.length > 0).toBe(true)
    }, 300 * 1000);

    it('build with', async () => {
        const build = await client.job.build(jobName, params);
        expect(build).not.toBe(null);

        const build1 = await client.job.build("foo_job_not_params");
        expect(build1).not.toBe(null);
    })

    it('rename job', async () => {
        const result = await client.job.rename(jobName, targetName);
        expect(result).not.toBe(null);
        const result1 = await client.job.rename(targetName, jobName);
    })

    it('abort build', async () => {
        const result = await client.job.abortBuild(jobName, 5);
        expect(result).not.toBe(null);
    })

    it('get next build number', async () => {
        const data = await client.job.nextBuildNumber(jobName);
        expect(typeof (data)).toBe('number');
    })

    it('get queued status', async () => {
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const {data: build} = await client.job.build(jobName, {branch: 'foo_branch_1' + i});
                    client.logger.info(`start build success build queue id:${build.id}`)
                    resolve(build);
                }, i * 3 * 100)
            })

        }
        const data = await client.job.isInQueue(jobName);
        expect(data).not.toBe(null);

    }, 30 * 1000)

    it('guess build number in queue', async () => {
        const buildNumber = await client.job.guessBuildNumberInQueue(jobName, 39);
        expect(buildNumber).not.toBe(null);
    })

    it('get in queue build and guess build numbers', async () => {
        const idAndBuildNumbers = await client.job.getInQueueBuild(jobName);
        client.logger.info(`in queue build :${JSON.stringify(idAndBuildNumbers)}`)
        expect(idAndBuildNumbers).not.toBe(null);
    })
});
