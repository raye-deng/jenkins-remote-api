import { init, JenkinsClient } from "../index";
import { Build } from "../../types";

const fs = require("fs");
const FD = require("form-data");
const dotenv = require("dotenv");
dotenv.config();

describe('job api unit test', () => {
    jest.setTimeout(30e3);
    let client: JenkinsClient;
    let params: any = {
        branch: "foo_branch"
    }
    const jobName: string = process.env.JOB_NAME || "foo_job";
    const targetName: string = process.env.TARGET_NAME || "new_foo_job";
    const notParamsJobName: string = process.env.NOT_PARAMS_JOB_NAME || "foo_job_not_parameters";
    const buildNumber: string = process.env.BUILD_NUMBER || "1";


    beforeEach(async () => {
        client = await init(process.env.HOST, process.env.USERNAME, process.env.TOKEN);
    });

    it('add or update job', async () => {
        const job_xml1 = fs.readFileSync("./assets/foo_job_not_params.xml", "utf8")
        const addResult1 = await client.job.createOrUpdate(notParamsJobName, job_xml1);
        expect(addResult1).not.toBe(null);

        const job_xml = fs.readFileSync("./assets/foo_job.xml", "utf8")
        const addResult = await client.job.createOrUpdate(jobName, job_xml);
        expect(addResult).not.toBe(null);
    }, 300 * 1000)


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

        const build1 = await client.job.build(notParamsJobName);
        expect(build1).not.toBe(null);
    }, 300 * 1000)

    it('rebuild with', async () => {
        const data = new FD();
        Object.keys(params).map(key => data.append(key, params[key]));
        const build = await client.job.rebuild(jobName, 1, data);
        expect(build).not.toBe(null);
    })

    it('replay with', async () => {
        const script = fs.readFileSync("./assets/foo_job.groovy", "utf8")
        const build = await client.job.replay(jobName, 1, script);
        expect(build).not.toBe(null);
    })

    it('rename job', async () => {
        const result = await client.job.rename(jobName, targetName);
        expect(result).not.toBe(null);
        const result1 = await client.job.rename(targetName, jobName);
    })

    it.skip('abort build', async () => {
        const result = await client.job.abortBuild(jobName, 5);
        expect(result).not.toBe(null);
    })

    it('get next build number', async () => {
        const data = await client.job.nextBuildNumber(jobName);
        expect(typeof (data)).toBe('number');
    })

    it.skip('get queued status', async () => {
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const { data: build } = await client.job.build(jobName, { branch: 'foo_branch_1' + i });
                    client.logger.info(`start build success build queue id:${build.id}`)
                    resolve(build);
                }, i * 3 * 100)
            })

        }
        const data = await client.job.isInQueue(jobName);
        expect(data).not.toBe(null);

    }, 30 * 1000)

    it.skip('guess build number in queue', async () => {
        const buildNumber = await client.job.guessBuildNumberInQueue(jobName, 39);
        expect(buildNumber).not.toBe(null);
    })

    it('get in queue build and guess build numbers', async () => {
        const idAndBuildNumbers = await client.job.getInQueueBuild(jobName);
        client.logger.info(`in queue build :${JSON.stringify(idAndBuildNumbers)}`)
        expect(idAndBuildNumbers).not.toBe(null);
    })

    it('delete job', async () => {
        const delResult = await client.job.remove(jobName)
        expect(delResult).not.toBe(null);
        const delResult1 = await client.job.remove(notParamsJobName)
        expect(delResult1).not.toBe(null);
    })

    it('get build detail', async () => {
        const { data: build } = await client.job.getBuild(jobName, buildNumber);
        console.log(`build fetch done, build result:${build.result}`)
        expect(build).not.toBe(null);
        // Type check
        const typedBuild = build as Build;
        expect(typedBuild._class).toBeDefined();
        expect(typedBuild.actions).toBeInstanceOf(Array);
    })

    it('get build log', async () => {
        const log = await client.job.getLog(jobName, buildNumber);
        console.log(log);
        expect(log).not.toBe(null);
    })

    it('get artifact urls', async () => {
        const artifactUrls = await client.job.getArtifactUrls(jobName, buildNumber);
        expect(Array.isArray(artifactUrls)).toBe(true);
        if (artifactUrls.length > 0) {
            artifactUrls.forEach(url => {
                expect(url).toMatch(/^https?:\/\/.+\/artifact\//);
            });
        }
    });

    it('get progressive log', async () => {
        const log = await client.job.getProgressiveLog(jobName, buildNumber);
        console.log(log);
        expect(log).not.toBe(null);
    }, 600 * 1000)
});
